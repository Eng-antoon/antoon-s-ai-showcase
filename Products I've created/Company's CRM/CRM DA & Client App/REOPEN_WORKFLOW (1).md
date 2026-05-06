# Issue Reopen Workflow - Supervisor App Documentation

This document provides comprehensive documentation for the Supervisor App to manage issue reopen requests.

## Overview

The reopen workflow is a **Client ↔ Supervisor** communication channel. When a client is unsatisfied with a resolved issue, they can request to reopen it. The supervisor reviews the request and either approves or rejects it.

**Important:** The Driver is NOT involved in the reopen workflow. They are not notified about reopen requests, approvals, or rejections.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        REOPEN REQUEST FLOW                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────┐         ┌────────────────┐         ┌──────────────────┐  │
│   │  CLIENT  │────────▶│ REOPEN REQUEST │────────▶│    SUPERVISOR    │  │
│   └──────────┘  submit │  (pending)     │  notify │  (reviews)       │  │
│        ▲               └────────────────┘         └────────┬─────────┘  │
│        │                                                   │            │
│        │                    ┌───────────────────────────────┤            │
│        │                    │                               │            │
│        │                    ▼                               ▼            │
│        │           ┌────────────────┐             ┌────────────────┐    │
│        │           │    APPROVED    │             │    REJECTED    │    │
│        │           └───────┬────────┘             └───────┬────────┘    │
│        │                   │                              │             │
│        │                   ▼                              ▼             │
│        │    • Issue status → 'open'           • Status stays 'resolved'│
│        │    • has_active_issue → true         • Client notified only   │
│        │    • Client notified                                           │
│        │    • Activity logged                 • Activity logged         │
│        │                                                                │
│        │            ❌ DRIVER NOT NOTIFIED IN ANY CASE ❌               │
│        └────────────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────────────────┘
```

## Database Schema

### `reopen_requests` Table

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | No | gen_random_uuid() | Primary key |
| `issue_id` | uuid | No | - | Reference to `issue_reports.id` |
| `requester_id` | uuid | No | - | ID of the client who submitted |
| `requester_type` | text | No | 'client' | Always 'client' for this workflow |
| `reason` | text | No | - | Client's reason for reopening |
| `status` | reopen_request_status | No | 'pending' | ENUM: `pending`, `approved`, `rejected` |
| `reviewed_by` | uuid | Yes | null | Supervisor ID who reviewed |
| `reviewed_at` | timestamptz | Yes | null | **AUTO-SET BY TRIGGER** when status changes |
| `review_notes` | text | Yes | null | Supervisor's notes (used for rejection reason) |
| `created_at` | timestamptz | No | now() | Request creation time |
| `updated_at` | timestamptz | No | now() | Last update time |

### Status ENUM Values

```sql
CREATE TYPE public.reopen_request_status AS ENUM ('pending', 'approved', 'rejected');
```

| Status | Description |
|--------|-------------|
| `pending` | Awaiting supervisor review |
| `approved` | Supervisor approved - issue is reopened |
| `rejected` | Supervisor rejected - issue stays resolved |

### `order_activities` Table (Activity Log)

This table tracks all significant events on orders for complete audit trail.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | No | gen_random_uuid() | Primary key |
| `order_id` | uuid | No | - | Reference to the order |
| `activity_type` | text | No | - | Type of activity (see below) |
| `issue_id` | uuid | Yes | null | Related issue if applicable |
| `reopen_request_id` | uuid | Yes | null | Related reopen request if applicable |
| `actor_type` | text | Yes | null | 'driver', 'client', 'supervisor', 'system' |
| `actor_id` | uuid | Yes | null | ID of the user who performed action |
| `old_value` | text | Yes | null | Previous state (e.g., old status) |
| `new_value` | text | Yes | null | New state (e.g., new status) |
| `notes` | text | Yes | null | Additional context |
| `created_at` | timestamptz | No | now() | When activity occurred |

#### Activity Types

| Activity Type | When Logged | Actor Type | Logged By |
|--------------|-------------|------------|-----------|
| `issue_created` | Driver reports issue | driver | Application code |
| `issue_resolved` | Client/Driver resolves manually | client/driver | Application code |
| `issue_auto_resolved` | 30-min timeout with no response | system | `check-issue-timeouts` edge function |
| `issue_reopened` | Supervisor approves reopen | supervisor | **Database trigger** |
| `reopen_rejected` | Supervisor rejects reopen | supervisor | **Database trigger** |
| `status_change` | Order status changes | system/driver | Application code |

## Database Trigger: `handle_reopen_request_status_change`

A database trigger automatically handles all updates when a reopen request status changes. **The Supervisor App only needs to update the `status` and `reviewed_by` fields** - everything else is handled automatically.

### What the Trigger Does

The trigger handles **ALL status transitions**, not just changes from `pending`:

| Status Change | Automatic Actions |
|---------------|-------------------|
| `pending` → `approved` | 1. Set `reviewed_at = now()` |
| | 2. Update `issue_reports.status = 'open'` |
| | 3. Clear `issue_reports.resolved_at` and `resolved_by` |
| | 4. Set `issue_reports.reopened_at = now()` |
| | 5. Clear `issue_reports.reminder_sent_at` |
| | 6. Set `orders.has_active_issue = true` |
| | 7. Insert `order_activities` record (type: `issue_reopened`) |
| `pending` → `rejected` | 1. Set `reviewed_at = now()` |
| | 2. Insert `order_activities` record (type: `reopen_rejected`) |
| `approved` → `rejected` | 1. **Undo the reopen:** set `issue_reports.status = 'resolved'` |
| | 2. Set `issue_reports.resolved_at = now()`, `resolved_by = 'reopen_rejected'` |
| | 3. Clear `issue_reports.reopened_at` |
| | 4. Set `orders.has_active_issue = false` |
| | 5. Insert `order_activities` record (type: `reopen_rejected`) |
| `rejected` → `approved` | Same as `pending` → `approved` |

### Key Column: `issue_reports.reopened_at`

When an issue is reopened, the `reopened_at` timestamp is set. This is used by `check-issue-timeouts` to calculate the 30-minute auto-resolve window from the reopen time, giving reopened issues a fresh timeout window.

### Foreign Key Constraints

The `reopen_requests` table now has proper foreign key relationships:

| Column | References | On Delete |
|--------|------------|-----------|
| `requester_id` | `client_users(id)` | CASCADE |
| `reviewed_by` | `dashboard_users(id)` | SET NULL |

## Table Relationships

```
reopen_requests
    │
    ├── issue_id ──────────▶ issue_reports.id
    │                            │
    │                            ├── order_id ──────▶ orders.id
    │                            │                        │
    │                            │                        └── company_id ──▶ companies.id
    │                            │
    │                            └── delivery_agent_id ──▶ delivery_agents.id
    │
    └── requester_id ──────▶ client_users.id

order_activities
    │
    ├── order_id ──────────▶ orders.id
    ├── issue_id ──────────▶ issue_reports.id (optional)
    └── reopen_request_id ─▶ reopen_requests.id (optional)
```

## API Operations (Simplified with Trigger)

### 1. Fetch Pending Requests

Fetch all pending reopen requests with full issue and order details:

```typescript
const fetchPendingRequests = async () => {
  const { data, error } = await supabase
    .from('reopen_requests')
    .select(`
      *,
      issue_reports (
        id,
        status,
        created_at,
        resolved_at,
        resolved_by,
        notes,
        ai_refined_text,
        is_geofence_valid,
        waited_minutes,
        distance_to_target,
        voice_note_path,
        orders (
          id,
          order_id,
          client_name,
          address,
          company_id
        ),
        delivery_agents (
          id,
          full_name,
          phone_number
        ),
        cancellation_reasons (
          name_ar,
          name_en,
          code
        ),
        report_evidence (
          id,
          storage_path,
          file_type
        )
      ),
      client_users (
        id,
        full_name,
        email
      )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
```

### 2. Approve a Reopen Request (SIMPLIFIED)

**The trigger handles all database updates automatically!** You only need to:
1. Update `reopen_requests.status` to `approved` and set `reviewed_by`
2. Call the notification edge function

```typescript
interface ApproveParams {
  requestId: string;
  issueId: string;
  clientUserId: string;
  supervisorId: string;
  locationName?: string;
}

const approveReopenRequest = async ({
  requestId,
  issueId,
  clientUserId,
  supervisorId,
  locationName
}: ApproveParams) => {
  // Just update the status - trigger handles everything else!
  const { error: updateError } = await supabase
    .from('reopen_requests')
    .update({
      status: 'approved',
      reviewed_by: supervisorId
      // reviewed_at is AUTO-SET by trigger!
    })
    .eq('id', requestId);

  if (updateError) throw updateError;

  // The trigger automatically:
  // - Sets reviewed_at = now()
  // - Updates issue_reports.status = 'open'
  // - Clears issue_reports.resolved_at and resolved_by
  // - Sets orders.has_active_issue = true
  // - Logs activity in order_activities

  // Notify the client
  const { error: notifyError } = await supabase.functions.invoke('notify-reopen-approved', {
    body: {
      request_id: requestId,
      issue_id: issueId,
      client_user_id: clientUserId,
      location_name: locationName
    }
  });

  if (notifyError) {
    console.error('Failed to send notification:', notifyError);
  }

  return { success: true };
};
```

### 3. Reject a Reopen Request (SIMPLIFIED)

```typescript
interface RejectParams {
  requestId: string;
  issueId: string;
  clientUserId: string;
  supervisorId: string;
  rejectionReason: string;
  locationName?: string;
}

const rejectReopenRequest = async ({
  requestId,
  issueId,
  clientUserId,
  supervisorId,
  rejectionReason,
  locationName
}: RejectParams) => {
  // Just update the status - trigger handles timestamp and activity logging
  const { error: updateError } = await supabase
    .from('reopen_requests')
    .update({
      status: 'rejected',
      reviewed_by: supervisorId,
      review_notes: rejectionReason
      // reviewed_at is AUTO-SET by trigger!
    })
    .eq('id', requestId);

  if (updateError) throw updateError;

  // The trigger automatically:
  // - Sets reviewed_at = now()
  // - Logs activity in order_activities

  // Notify the client
  const { error: notifyError } = await supabase.functions.invoke('notify-reopen-rejected', {
    body: {
      request_id: requestId,
      issue_id: issueId,
      client_user_id: clientUserId,
      rejection_reason: rejectionReason,
      location_name: locationName
    }
  });

  if (notifyError) {
    console.error('Failed to send notification:', notifyError);
  }

  return { success: true };
};
```

### 4. Query Order Activities

Fetch all activities for an order:

```typescript
const fetchOrderActivities = async (orderId: string) => {
  const { data, error } = await supabase
    .from('order_activities')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Fetch activities for a specific issue
const fetchIssueActivities = async (issueId: string) => {
  const { data, error } = await supabase
    .from('order_activities')
    .select('*')
    .eq('issue_id', issueId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
```

## Edge Functions Reference

### `notify-reopen-request` (Existing)

Called automatically when a client submits a reopen request. Notifies all active supervisors.

**Payload:**
```typescript
{
  issue_id: string;        // UUID of the issue
  requester_id: string;    // UUID of the client
  reason: string;          // Client's reason for reopening
  client_name?: string;    // Optional client name
  location_name?: string;  // Optional location/address
  order_id?: string;       // Optional order ID
}
```

### `notify-reopen-approved`

Call this after approving a request. Notifies **only** the client.

**Payload:**
```typescript
{
  request_id: string;      // UUID of the reopen_request
  issue_id: string;        // UUID of the issue
  client_user_id: string;  // UUID of the client to notify
  location_name?: string;  // Optional location for context
}
```

### `notify-reopen-rejected`

Call this after rejecting a request. Notifies **only** the client.

**Payload:**
```typescript
{
  request_id: string;        // UUID of the reopen_request
  issue_id: string;          // UUID of the issue
  client_user_id: string;    // UUID of the client to notify
  rejection_reason?: string; // Supervisor's notes/reason
  location_name?: string;    // Optional location for context
}
```

## Real-time Subscriptions

Subscribe to new reopen requests in real-time:

```typescript
useEffect(() => {
  const channel = supabase
    .channel('supervisor-reopen-requests')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'reopen_requests'
      },
      (payload) => {
        console.log('New reopen request:', payload.new);
        fetchPendingRequests();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

## Activity Logging Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       ORDER ACTIVITY FLOW                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Driver Reports Issue                                                    │
│       │                                                                  │
│       ▼                                                                  │
│  ┌──────────────────┐                                                    │
│  │ issue_created    │ ─────► order_activities (by app code)             │
│  └──────────────────┘                                                    │
│       │                                                                  │
│       ▼                                                                  │
│  ┌──────────────────┐        ┌──────────────────┐                       │
│  │ 30 min timeout   │───────►│ issue_auto_      │                       │
│  │ (no response)    │        │ resolved         │                       │
│  └──────────────────┘        └────────┬─────────┘                       │
│       │                               │                                  │
│       │ OR                            ▼                                  │
│       ▼                        order_activities (by edge function)      │
│  ┌──────────────────┐                                                    │
│  │ Client resolves  │ ─────► order_activities (by app code)             │
│  │ (issue_resolved) │                                                    │
│  └──────────────────┘                                                    │
│       │                                                                  │
│       ▼                                                                  │
│  ┌──────────────────┐                                                    │
│  │ Client requests  │                                                    │
│  │ reopen           │                                                    │
│  └──────────────────┘                                                    │
│       │                                                                  │
│       ▼                                                                  │
│  ┌──────────────────┐                                                    │
│  │ Supervisor       │                                                    │
│  │ reviews          │                                                    │
│  └──────────────────┘                                                    │
│       │                                                                  │
│   ┌───┴───┐                                                              │
│   │       │                                                              │
│   ▼       ▼                                                              │
│ APPROVED  REJECTED                                                       │
│   │          │                                                           │
│   ▼          ▼                                                           │
│ ┌────────────────────┐  ┌────────────────────┐                          │
│ │ TRIGGER updates:   │  │ TRIGGER updates:   │                          │
│ │ • reviewed_at      │  │ • reviewed_at      │                          │
│ │ • issue → open     │  │                    │                          │
│ │ • order flag       │  │                    │                          │
│ │ • order_activities │  │ • order_activities │                          │
│ │   (issue_reopened) │  │   (reopen_rejected)│                          │
│ └────────────────────┘  └────────────────────┘                          │
│   │                        │                                             │
│   ▼                        ▼                                             │
│ notify-reopen-approved   notify-reopen-rejected                          │
│ (client only)            (client only)                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Notification Flow Summary

| Event | Who Submits | Who Receives Notification | Edge Function |
|-------|-------------|---------------------------|---------------|
| Client submits request | Client | **Supervisors only** | `notify-reopen-request` |
| Supervisor approves | Supervisor | **Client only** | `notify-reopen-approved` |
| Supervisor rejects | Supervisor | **Client only** | `notify-reopen-rejected` |
| *Driver* | - | **NEVER** | - |

## Complete Example: Supervisor Component

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ReopenRequest {
  id: string;
  issue_id: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  issue_reports: {
    id: string;
    orders: {
      id: string;
      order_id: string;
      client_name: string;
      address: string;
    };
  };
  client_users: {
    id: string;
    full_name: string;
  };
}

export function SupervisorReopenRequests() {
  const [requests, setRequests] = useState<ReopenRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const supervisorId = 'your-supervisor-id'; // Get from auth context

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('reopen_requests')
      .select(`
        *,
        issue_reports (
          id,
          orders (id, order_id, client_name, address)
        ),
        client_users (id, full_name)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (!error) setRequests(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();

    // Real-time subscription
    const channel = supabase
      .channel('supervisor-reopen')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'reopen_requests'
      }, () => fetchRequests())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleApprove = async (request: ReopenRequest) => {
    // Just update status - trigger handles the rest!
    await supabase.from('reopen_requests').update({
      status: 'approved',
      reviewed_by: supervisorId
    }).eq('id', request.id);

    // Send notification
    await supabase.functions.invoke('notify-reopen-approved', {
      body: {
        request_id: request.id,
        issue_id: request.issue_id,
        client_user_id: request.client_users.id,
        location_name: request.issue_reports.orders.client_name
      }
    });

    fetchRequests();
  };

  const handleReject = async (request: ReopenRequest, reason: string) => {
    // Just update status - trigger handles the rest!
    await supabase.from('reopen_requests').update({
      status: 'rejected',
      reviewed_by: supervisorId,
      review_notes: reason
    }).eq('id', request.id);

    // Send notification
    await supabase.functions.invoke('notify-reopen-rejected', {
      body: {
        request_id: request.id,
        issue_id: request.issue_id,
        client_user_id: request.client_users.id,
        rejection_reason: reason,
        location_name: request.issue_reports.orders.client_name
      }
    });

    fetchRequests();
  };

  // ... render UI
}
```

## Security Notes

1. **RLS Policies**: The `order_activities` table has RLS enabled with policies for service role management and anon user read/insert access.

2. **Trigger Security**: The trigger function uses `SECURITY DEFINER` with `search_path = 'public'` to ensure consistent behavior.

3. **Notification Security**: Edge functions validate the payload before sending notifications.

## Troubleshooting

### Issue not reopening after approval
1. Check that the trigger `on_reopen_request_status_change` exists
2. Check Postgres logs for trigger errors
3. Verify the `status` is changing from `'pending'` to `'approved'`

### Activities not being logged
1. Check `order_activities` table for records
2. Check Postgres logs for insert errors
3. For auto-resolve, check `check-issue-timeouts` edge function logs

### Query activities for debugging
```sql
SELECT * FROM order_activities 
WHERE order_id = 'your-order-id' 
ORDER BY created_at DESC;
```
