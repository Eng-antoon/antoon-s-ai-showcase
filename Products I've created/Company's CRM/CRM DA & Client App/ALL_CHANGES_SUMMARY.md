# All Changes Summary - December 28, 2025

This document provides a comprehensive summary of all database and edge function changes made today for the Supervisor App to implement.

---

## Table of Contents

1. [Database Changes](#database-changes)
2. [Trigger Function Updates](#trigger-function-updates)
3. [Edge Function Updates](#edge-function-updates)
4. [New Workflow Behaviors](#new-workflow-behaviors)
5. [API Changes for Supervisor App](#api-changes-for-supervisor-app)
6. [Data Fixes Applied](#data-fixes-applied)

---

## Database Changes

### 1. New Column: `issue_reports.reopened_at`

Added a new timestamp column to track when issues are reopened.

```sql
ALTER TABLE issue_reports 
ADD COLUMN reopened_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
```

**Purpose:** 
- When an issue is reopened via approved reopen request, this column stores the reopen timestamp
- The `check-issue-timeouts` edge function now uses this column to calculate the 30-minute auto-resolve window
- Reopened issues get a **fresh 30-minute window** from their `reopened_at` time, not from the original `created_at`

**Values:**
- `NULL` - Issue has never been reopened
- Timestamp - The most recent time the issue was reopened

### 2. New Foreign Key Constraints on `reopen_requests`

Added proper foreign key relationships:

```sql
-- Link requester_id to client_users (who submitted the request)
ALTER TABLE reopen_requests 
ADD CONSTRAINT fk_reopen_requests_requester 
FOREIGN KEY (requester_id) REFERENCES client_users(id) ON DELETE CASCADE;

-- Link reviewed_by to dashboard_users (supervisor who reviewed)
ALTER TABLE reopen_requests 
ADD CONSTRAINT fk_reopen_requests_reviewed_by 
FOREIGN KEY (reviewed_by) REFERENCES dashboard_users(id) ON DELETE SET NULL;
```

**Important for Supervisor App:**
- When fetching reopen requests, you can now JOIN with `client_users` on `requester_id`
- When storing `reviewed_by`, use the supervisor's `dashboard_users.id`

---

## Trigger Function Updates

### Updated: `handle_reopen_request_status_change()`

The trigger now handles **ALL status transitions**, not just changes from `pending`.

#### Status Transition Matrix

| From Status | To Status | Actions Performed |
|-------------|-----------|-------------------|
| `pending` | `approved` | ✅ Reopen issue, set `reopened_at`, log activity |
| `pending` | `rejected` | ✅ Log rejection activity only |
| `approved` | `rejected` | ✅ **NEW:** Undo reopen - set issue back to resolved, log activity |
| `rejected` | `approved` | ✅ **NEW:** Reopen issue like pending→approved |

#### Automatic Actions on Approval (pending→approved OR rejected→approved)

1. Sets `reviewed_at = now()` (only when leaving pending)
2. Updates `issue_reports`:
   - `status = 'open'`
   - `resolved_at = NULL`
   - `resolved_by = NULL`
   - `reopened_at = now()` ⬅️ **NEW**
   - `reminder_sent_at = NULL`
3. Updates `orders.has_active_issue = true`
4. Inserts `order_activities` record with `activity_type = 'issue_reopened'`

#### Automatic Actions on Rejection (pending→rejected)

1. Sets `reviewed_at = now()` (only when leaving pending)
2. Inserts `order_activities` record with `activity_type = 'reopen_rejected'`
3. Issue remains resolved, order stays unchanged

#### Automatic Actions on Rejection After Approval (approved→rejected) ⬅️ **NEW**

1. **Undoes the reopen:**
   - Sets `issue_reports.status = 'resolved'`
   - Sets `issue_reports.resolved_at = now()`
   - Sets `issue_reports.resolved_by = 'reopen_rejected'`
   - Sets `issue_reports.reopened_at = NULL`
2. Updates `orders.has_active_issue = false`
3. Inserts `order_activities` record with `activity_type = 'reopen_rejected'`

---

## Edge Function Updates

### Updated: `check-issue-timeouts`

The timeout calculation now considers `reopened_at` for reopened issues.

#### Logic Change

```typescript
// OLD: Always used created_at
const issueAge = now - new Date(issue.created_at);

// NEW: Uses reopened_at if available
const effectiveStartTime = issue.reopened_at 
  ? new Date(issue.reopened_at) 
  : new Date(issue.created_at);
const issueAge = now - effectiveStartTime;
```

#### Impact

- **Fresh issues:** 30-minute window starts from `created_at`
- **Reopened issues:** 30-minute window starts from `reopened_at`
- Same behavior for 15-minute reminder calculation

---

## New Workflow Behaviors

### Reopened Issues Get Fresh Timeout Window

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    TIMEOUT CALCULATION FLOW                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   Issue Created (created_at: 10:00 AM)                                   │
│       │                                                                  │
│       ├── 10:15 AM: 15-minute reminder sent (if no response)             │
│       │                                                                  │
│       ├── 10:30 AM: Auto-resolved (if no response)                       │
│       │                                                                  │
│       ▼                                                                  │
│   Client Requests Reopen                                                 │
│       │                                                                  │
│       ▼                                                                  │
│   Supervisor Approves (reopened_at: 11:00 AM)                            │
│       │                                                                  │
│       ├── 11:15 AM: NEW 15-minute reminder (if no response)              │
│       │                                                                  │
│       └── 11:30 AM: NEW auto-resolve (if no response)                    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Status Correction on Late Rejection

If a supervisor accidentally approves and then rejects:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    LATE REJECTION FLOW (NEW)                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   Request: pending                                                       │
│       │                                                                  │
│       ▼ (Supervisor clicks Approve by mistake)                           │
│   Request: approved                                                      │
│   Issue: open, reopened_at set                                           │
│   Order: has_active_issue = true                                         │
│       │                                                                  │
│       ▼ (Supervisor clicks Reject to correct)                            │
│   Request: rejected                                                      │
│   Issue: resolved, reopened_at = NULL, resolved_by = 'reopen_rejected'   │
│   Order: has_active_issue = false                                        │
│   Activity: 'reopen_rejected' logged                                     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## API Changes for Supervisor App

### Fetching Reopen Requests with Client Info

Now that `requester_id` has a foreign key, you can JOIN with `client_users`:

```typescript
const { data, error } = await supabase
  .from('reopen_requests')
  .select(`
    *,
    issue_reports (
      id,
      status,
      reopened_at,  // NEW FIELD
      created_at,
      resolved_at,
      orders (
        id,
        order_id,
        client_name,
        address
      )
    ),
    client_users!fk_reopen_requests_requester (  // Uses new FK
      id,
      full_name,
      email
    )
  `)
  .eq('status', 'pending')
  .order('created_at', { ascending: false });
```

### Approving/Rejecting Requests

No API changes needed - the trigger handles everything automatically.

```typescript
// Approve - same as before
await supabase
  .from('reopen_requests')
  .update({
    status: 'approved',
    reviewed_by: supervisorId  // Must be dashboard_users.id
  })
  .eq('id', requestId);

// Reject - same as before
await supabase
  .from('reopen_requests')
  .update({
    status: 'rejected',
    reviewed_by: supervisorId,  // Must be dashboard_users.id
    review_notes: rejectionReason
  })
  .eq('id', requestId);
```

### Checking Issue Reopened Status

```typescript
// Check if an issue was reopened
const { data: issue } = await supabase
  .from('issue_reports')
  .select('id, status, created_at, reopened_at')
  .eq('id', issueId)
  .single();

const wasReopened = issue?.reopened_at !== null;
const effectiveStartTime = issue?.reopened_at || issue?.created_at;
```

---

## Data Fixes Applied

The following data corrections were made to fix inconsistencies from before the trigger was updated:

```sql
-- Fixed issue that was incorrectly left as 'open' after rejection
UPDATE issue_reports
SET 
  status = 'resolved',
  resolved_at = now(),
  resolved_by = 'reopen_rejected',
  reopened_at = NULL
WHERE id = 'cdf350ab-ea23-44a3-82d7-d6a73bbbb14f';

-- Fixed corresponding order
UPDATE orders
SET has_active_issue = false
WHERE id = '9d88a8f7-b507-4a89-a350-f97587642147';
```

---

## Activity Tracking (NEW)

### New Activity Types

The system now tracks comprehensive activity logs in `order_activities` table for complete issue lifecycle visibility:

| Activity Type | When Logged | Actor Type | Trigger/Source |
|---------------|-------------|------------|----------------|
| `issue_created` | Issue inserted | `delivery_agent` | Database trigger: `on_issue_created` |
| `issue_notified_clients` | Push notifications sent to clients | `system` | ReportIssue.tsx after sending notifications |
| `issue_first_viewed` | Client first views the issue | `client` | IssueDetail.tsx when `first_viewed_at` is null |
| `client_first_interaction` | Client sends first response | `client` | Database trigger: `on_first_client_response` |
| `reminder_15min_sent` | 15-min reminder sent | `system` | check-issue-timeouts edge function |
| `issue_resolved` | Issue resolved by client/driver | `client` or `delivery_agent` | Database trigger: `on_issue_resolution` |
| `issue_auto_resolved` | Auto-resolved after 30 min | `system` | check-issue-timeouts edge function (existing) |
| `issue_reopened` | Issue reopened via approved request | `supervisor` | Database trigger: `handle_reopen_request_status_change` (existing) |
| `reopen_rejected` | Reopen request rejected | `supervisor` | Database trigger: `handle_reopen_request_status_change` (existing) |

### Database Triggers Created

```sql
-- 1. Log issue creation
CREATE TRIGGER on_issue_created
AFTER INSERT ON issue_reports
FOR EACH ROW
EXECUTE FUNCTION public.handle_issue_created();

-- 2. Log first client response
CREATE TRIGGER on_first_client_response
AFTER INSERT ON issue_responses
FOR EACH ROW
EXECUTE FUNCTION public.handle_first_client_response();

-- 3. Log issue resolution by client/driver
CREATE TRIGGER on_issue_resolution
BEFORE UPDATE ON issue_reports
FOR EACH ROW
EXECUTE FUNCTION public.handle_issue_resolution();
```

### Code Changes for Activity Tracking

1. **`src/pages/client/IssueDetail.tsx`**: 
   - Sets `first_viewed_at` and `first_viewed_by` when client first views issue
   - Logs `issue_first_viewed` activity

2. **`src/pages/driver/ReportIssue.tsx`**:
   - Logs `issue_notified_clients` activity after sending push notifications

3. **`supabase/functions/check-issue-timeouts/index.ts`**:
   - Logs `reminder_15min_sent` activity when 15-minute reminder is sent

---

## Summary of Changes

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `issue_reports` table | New Column | Added `reopened_at` timestamp |
| `reopen_requests` table | New FK | `requester_id` → `client_users(id)` |
| `reopen_requests` table | New FK | `reviewed_by` → `dashboard_users(id)` |
| `handle_reopen_request_status_change()` | Updated | Handles all status transitions |
| `handle_reopen_request_status_change()` | Updated | Sets `reopened_at` on approval |
| `handle_reopen_request_status_change()` | Updated | Undoes reopen on approved→rejected |
| `check-issue-timeouts` | Updated | Uses `reopened_at` for timeout calculation |
| `check-issue-timeouts` | Updated | Logs `reminder_15min_sent` activity |
| `handle_issue_created()` | **NEW** | Trigger to log `issue_created` activity |
| `handle_first_client_response()` | **NEW** | Trigger to log `client_first_interaction` activity |
| `handle_issue_resolution()` | **NEW** | Trigger to log `issue_resolved` activity |
| `IssueDetail.tsx` | Updated | Tracks first view, logs `issue_first_viewed` activity |
| `ReportIssue.tsx` | Updated | Logs `issue_notified_clients` activity |

---

## Supervisor App Checklist

- [ ] Update API calls to include `reopened_at` in issue queries
- [ ] Update JOIN syntax for `client_users` using new FK
- [ ] Ensure `reviewed_by` uses `dashboard_users.id`
- [ ] Handle `approved→rejected` transition in UI (if allowing status changes)
- [ ] Display `reopened_at` in issue details (optional)
- [ ] Update any timeout displays to use effective start time
- [ ] Display order activities timeline showing all tracked events
