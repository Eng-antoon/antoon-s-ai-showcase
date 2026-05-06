# Data Mapping Documentation

This document provides a comprehensive mapping of all database fields, their sources, and how they are populated.

---

## Data Flow Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   AWS RDS       │     │   Locus API     │     │   User Input    │
│   (PostgreSQL)  │     │                 │     │   (App Forms)   │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Edge Functions                              │
│  ┌──────────────┐  ┌─────────────────┐  ┌───────────────────┐   │
│  │  da-login    │  │ refresh-orders  │  │ ai-process-issue  │   │
│  └──────────────┘  └─────────────────┘  └───────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase Database                             │
│  ┌────────┐ ┌──────┐ ┌────────────────┐ ┌─────────────────────┐ │
│  │ orders │ │tours │ │ delivery_agents│ │ issue_reports       │ │
│  └────────┘ └──────┘ └────────────────┘ └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. orders Table

| Column | Type | Source | Extraction Path / Calculation | Edge Function |
|--------|------|--------|------------------------------|---------------|
| `id` | uuid | Generated | `gen_random_uuid()` | da-login, refresh-orders |
| `order_id` | text | Locus API | `response.taskId` | da-login, refresh-orders |
| `tour_id` | uuid | Supabase | Reference to `tours.id` (looked up by `tour_id` text) | da-login |
| `company_id` | uuid | Supabase | Reference to `companies.id` (looked up by `locus_company_owner`) | da-login, refresh-orders |
| `warehouse_id` | uuid | Supabase | Reference to `warehouses.id` (looked up by `homebase_id`) | da-login, refresh-orders |
| `client_name` | text | Locus API | `taskGraph.visits[CUSTOMER].locationOptions[0].addressDetails.name` | da-login, refresh-orders |
| `address` | text | Locus API | `taskGraph.visits[CUSTOMER].locationOptions[0].addressDetails.formattedAddress` | da-login, refresh-orders |
| `location_id` | text | Locus API | `taskGraph.visits[CUSTOMER].locationOptions[0].locationId` | da-login, refresh-orders |
| `target_lat` | double | Locus API | `taskGraph.visits[CUSTOMER].locationOptions[0].location.latitude` | da-login, refresh-orders |
| `target_lng` | double | Locus API | `taskGraph.visits[CUSTOMER].locationOptions[0].location.longitude` | da-login, refresh-orders |
| `slot_start` | timestamptz | Locus API | `taskGraph.visits[CUSTOMER].locationOptions[0].timeWindow.slot.start` OR `timeWindow.slots[0].start` | da-login, refresh-orders |
| `slot_end` | timestamptz | Locus API | `taskGraph.visits[CUSTOMER].locationOptions[0].timeWindow.slot.end` OR `timeWindow.slots[0].end` | da-login, refresh-orders |
| `locus_status` | enum | Locus API | `taskGraph.statuses[last].status` (latest status from array) | da-login, refresh-orders |
| `arrival_time` | timestamptz | Locus API | `taskGraph.statuses[].time` where `status = 'ARRIVED'` | da-login, refresh-orders |
| `started_time` | timestamptz | Locus API | `taskGraph.statuses[].time` where `status = 'STARTED'` | da-login, refresh-orders |
| `completion_time` | timestamptz | Locus API | `taskGraph.statuses[].time` where `status IN ('COMPLETED', 'PARTIAL_COMPLETED', 'CANCELLED')` | da-login, refresh-orders |
| `da_arrival_lat` | double | Locus API | `taskGraph.statuses[].latlng.latitude` where `status = 'ARRIVED'` | da-login, refresh-orders |
| `da_arrival_lng` | double | Locus API | `taskGraph.statuses[].latlng.longitude` where `status = 'ARRIVED'` | da-login, refresh-orders |
| `sequence` | integer | AWS RDS | `rds_query.sequence` from tour orders | da-login |
| `status` | enum | Calculated | Derived from `locus_status` mapping | da-login, refresh-orders |
| `has_active_issue` | boolean | Calculated | Set to `true` when issue is opened, `false` when resolved | ReportIssue.tsx |
| `locus_fetched_at` | timestamptz | Generated | `new Date().toISOString()` at fetch time | da-login, refresh-orders |
| `created_at` | timestamptz | Generated | `now()` default | - |
| `updated_at` | timestamptz | Generated | `now()` trigger | - |

### Locus Status to Order Status Mapping

```javascript
const statusMapping = {
  'ASSIGNED': 'pending',
  'NOTIFIED': 'pending',
  'ACKNOWLEDGED': 'pending',
  'STARTED': 'in_progress',
  'ARRIVED': 'in_progress',
  'COMPLETED': 'delivered',
  'PARTIAL_COMPLETED': 'partial',
  'CANCELLED': 'cancelled'
}
```

---

## 2. tours Table

| Column | Type | Source | Extraction Path / Calculation | Edge Function |
|--------|------|--------|------------------------------|---------------|
| `id` | uuid | Generated | `gen_random_uuid()` | da-login |
| `tour_id` | text | AWS RDS | `rds_query.tour_id` | da-login |
| `delivery_agent_id` | uuid | Supabase | Reference to `delivery_agents.id` after upsert | da-login |
| `rider_name` | text | AWS RDS | `rds_query.rider_name` | da-login |
| `rider_phone` | text | AWS RDS | `rds_query.rider_phone` | da-login |
| `vehicle_name` | text | AWS RDS | `rds_query.vehicle_name` | da-login |
| `vehicle_model` | text | AWS RDS | `rds_query.vehicle_model` | da-login |
| `plate_number` | text | AWS RDS | `rds_query.plate_number` | da-login |
| `tour_date` | date | AWS RDS | `rds_query.date` (tour date) | da-login |
| `status` | text | Default | `'active'` on creation | da-login |
| `fetched_at` | timestamptz | Generated | `new Date().toISOString()` at fetch time | da-login |
| `created_at` | timestamptz | Generated | `now()` default | - |
| `updated_at` | timestamptz | Generated | `now()` trigger | - |

---

## 3. delivery_agents Table

| Column | Type | Source | Extraction Path / Calculation | Edge Function |
|--------|------|--------|------------------------------|---------------|
| `id` | uuid | Generated | `gen_random_uuid()` | da-login |
| `phone_number` | text | User Input | Login phone number (formatted to international) | da-login |
| `full_name` | text | AWS RDS | `rds_query.rider_name` | da-login |
| `company_id` | uuid | - | Not populated currently | - |
| `avatar_url` | text | - | Not populated currently | - |
| `is_active` | boolean | Default | `true` | - |
| `created_at` | timestamptz | Generated | `now()` default | - |
| `updated_at` | timestamptz | Generated | `now()` trigger | - |

---

## 4. issue_reports Table

| Column | Type | Source | Extraction Path / Calculation | Edge Function / Component |
|--------|------|--------|------------------------------|--------------------------|
| `id` | uuid | Generated | `gen_random_uuid()` | ReportIssue.tsx |
| `order_id` | uuid | App State | Selected order's UUID | ReportIssue.tsx |
| `delivery_agent_id` | uuid | App State | Logged-in agent's UUID | ReportIssue.tsx |
| `reason_id` | uuid | User Input | Selected cancellation reason UUID | ReportIssue.tsx |
| `da_lat` | double | Browser API | `navigator.geolocation.getCurrentPosition().coords.latitude` | ReportIssue.tsx |
| `da_lng` | double | Browser API | `navigator.geolocation.getCurrentPosition().coords.longitude` | ReportIssue.tsx |
| `distance_to_target` | double | **Calculated** | Haversine formula: `distance(da_lat, da_lng, order.target_lat, order.target_lng)` in km | ReportIssue.tsx |
| `is_geofence_valid` | boolean | **Calculated** | `distance_to_target <= 0.5` (500 meters threshold) | ReportIssue.tsx |
| `wait_start_time` | timestamptz | User Action | Timestamp when "Start Wait" button clicked | ReportIssue.tsx |
| `wait_end_time` | timestamptz | User Action | Timestamp when "End Wait" button clicked | ReportIssue.tsx |
| `waited_minutes` | integer | **Calculated** | `Math.floor((wait_end_time - wait_start_time) / 60000)` | ReportIssue.tsx |
| `is_arrival_time_valid` | boolean (nullable) | **Calculated** | `arrival_time >= slot_start && arrival_time <= slot_end`. Returns `null` if `arrival_time` is null. | ReportIssue.tsx |
| `is_issue_create_time_valid` | boolean (nullable) | **Calculated** | `issue_create_time >= slot_start && issue_create_time <= slot_end`. Uses current timestamp at issue creation. | ReportIssue.tsx |
| `voice_note_path` | text | Storage Upload | Supabase storage path: `voice-recordings/{order_id}/{timestamp}.webm` | ReportIssue.tsx |
| `notes` | text | User Input | Text notes entered by driver | ReportIssue.tsx |
| `ai_transcription` | text | AI Generated | Whisper transcription of voice note | ai-process-issue |
| `ai_refined_text` | text | AI Generated | Gemini-refined transcription with context | ai-process-issue |
| `ai_suggested_evidence` | text | AI Generated | Gemini-suggested evidence types to collect | ai-process-issue |
| `status` | enum | State Machine | `'open'` → `'in_review'` → `'resolved'` / `'rejected'` | App Logic |
| `is_agent_muted` | boolean | Client Action | Set by client when muting driver notifications | ClientHome.tsx |
| `resolved_at` | timestamptz | Client Action | Timestamp when issue resolved/rejected | ClientHome.tsx |
| `resolved_by` | text | Client Action | Client user email who resolved | ClientHome.tsx |
| `first_viewed_at` | timestamptz | Client Action | Timestamp of first client view | IssueDetail.tsx |
| `first_viewed_by` | uuid | Client Action | Client user UUID who first viewed | IssueDetail.tsx |
| `created_at` | timestamptz | Generated | `now()` default | - |
| `updated_at` | timestamptz | Generated | `now()` trigger | - |

### Distance Calculation (Haversine Formula)

```typescript
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};
```

### Geofence Validation

```typescript
const GEOFENCE_RADIUS_KM = 0.5; // 500 meters
const is_geofence_valid = distance_to_target <= GEOFENCE_RADIUS_KM;
```

### Arrival Time Validation

Checks if the delivery agent's arrival time was within the customer's designated time window. Returns `null` if no arrival time is recorded:

```typescript
const calculateIsArrivalTimeValid = (): boolean | null => {
  // If no arrival_time, return null (cannot validate)
  if (!order?.arrival_time) {
    return null;
  }
  
  // If no slot defined, assume valid
  if (!order?.slot_start || !order?.slot_end) {
    return true;
  }
  
  const slotStart = new Date(order.slot_start);
  const slotEnd = new Date(order.slot_end);
  const arrivalTime = new Date(order.arrival_time);
  
  return arrivalTime >= slotStart && arrivalTime <= slotEnd;
};
```

### Issue Create Time Validation

Checks if the issue was created within the customer's designated time window:

```typescript
const calculateIsIssueCreateTimeValid = (): boolean | null => {
  // If no slot defined, assume valid
  if (!order?.slot_start || !order?.slot_end) {
    return true;
  }
  
  const slotStart = new Date(order.slot_start);
  const slotEnd = new Date(order.slot_end);
  const issueCreateTime = new Date(); // Current timestamp
  
  return issueCreateTime >= slotStart && issueCreateTime <= slotEnd;
};
```

### Geofence Validation

Validates the DA's current GPS location against the order's target location using the Haversine formula with a 500m threshold:

```typescript
// DA's current location from GPS
const daLat = geoStatus.lat;  // navigator.geolocation.getCurrentPosition()
const daLng = geoStatus.lng;

// Order's target location from Locus API
const targetLat = order.target_lat;
const targetLng = order.target_lng;

const distance = calculateDistance(daLat, daLng, targetLat, targetLng);
const is_geofence_valid = distance <= 0.5; // 500 meters threshold
```

---

## 5. issue_responses Table

| Column | Type | Source | Extraction Path / Calculation | Component |
|--------|------|--------|------------------------------|-----------|
| `id` | uuid | Generated | `gen_random_uuid()` | IssueDetail.tsx |
| `report_id` | uuid | App State | Parent issue report UUID | IssueDetail.tsx |
| `responder_id` | uuid | App State | Responder's UUID (client or driver) | IssueDetail.tsx |
| `responder_type` | text | App State | `'client'` or `'driver'` | IssueDetail.tsx |
| `message` | text | User Input | Text message content | IssueDetail.tsx |
| `voice_note_path` | text | Storage Upload | Supabase storage path: `voice-recordings/{report_id}/{timestamp}.webm` | IssueDetail.tsx |
| `image_path` | text | Storage Upload | Supabase storage path: `evidence/{report_id}/{timestamp}.jpg` | IssueDetail.tsx |
| `action_type` | text | System | Action taken: `'resolve'`, `'reject'`, `'escalate'`, `'mute'` | IssueDetail.tsx |
| `read_by_client` | boolean | App Logic | Set to `true` when client views | IssueDetail.tsx |
| `read_by_driver` | boolean | App Logic | Set to `true` when driver views | IssueDetail.tsx |
| `created_at` | timestamptz | Generated | `now()` default | - |

---

## 6. report_evidence Table

| Column | Type | Source | Extraction Path / Calculation | Component |
|--------|------|--------|------------------------------|-----------|
| `id` | uuid | Generated | `gen_random_uuid()` | ReportIssue.tsx |
| `report_id` | uuid | App State | Parent issue report UUID | ReportIssue.tsx |
| `storage_path` | text | Storage Upload | Supabase storage path: `evidence/{report_id}/{timestamp}.{ext}` | ReportIssue.tsx |
| `file_type` | text | Detected | `'image'` or `'video'` based on MIME type | ReportIssue.tsx |
| `created_at` | timestamptz | Generated | `now()` default | - |

---

## 7. companies Table

| Column | Type | Source | Extraction Path / Calculation | Edge Function |
|--------|------|--------|------------------------------|---------------|
| `id` | uuid | Generated | `gen_random_uuid()` | da-login, refresh-orders |
| `name` | text | Locus API | `response.clientId` OR `'Unknown'` if not present | da-login, refresh-orders |
| `locus_company_owner` | text | Locus API | `response.clientId` (used as unique identifier) | da-login, refresh-orders |
| `created_at` | timestamptz | Generated | `now()` default | - |
| `updated_at` | timestamptz | Generated | `now()` trigger | - |

---

## 8. warehouses Table

| Column | Type | Source | Extraction Path / Calculation | Edge Function |
|--------|------|--------|------------------------------|---------------|
| `id` | uuid | Generated | `gen_random_uuid()` | da-login, refresh-orders |
| `name` | text | Locus API | `taskGraph.visits[HOMEBASE].locationOptions[0].addressDetails.name` | da-login, refresh-orders |
| `homebase_id` | text | Locus API | `taskGraph.visits[HOMEBASE].locationOptions[0].locationId` | da-login, refresh-orders |
| `address` | text | Locus API | `taskGraph.visits[HOMEBASE].locationOptions[0].addressDetails.formattedAddress` | da-login, refresh-orders |
| `lat` | double | Locus API | `taskGraph.visits[HOMEBASE].locationOptions[0].location.latitude` | da-login, refresh-orders |
| `lng` | double | Locus API | `taskGraph.visits[HOMEBASE].locationOptions[0].location.longitude` | da-login, refresh-orders |
| `company_id` | uuid | - | Not populated currently | - |
| `created_at` | timestamptz | Generated | `now()` default | - |

---

## 9. cancellation_reasons Table

| Column | Type | Source | Extraction Path / Calculation | Source |
|--------|------|--------|------------------------------|--------|
| `id` | uuid | Generated | `gen_random_uuid()` | Manual/Admin |
| `name_en` | text | Admin Input | English display name | Admin Dashboard |
| `name_ar` | text | Admin Input | Arabic display name | Admin Dashboard |
| `code` | text | Admin Input | Unique code identifier | Admin Dashboard |
| `wait_time_minutes` | integer | Admin Input | Required wait time before using this reason | Admin Dashboard |
| `requires_wait_time` | boolean | Admin Input | Whether driver must wait before reporting | Admin Dashboard |
| `display_order` | integer | Admin Input | Sort order in UI | Admin Dashboard |
| `is_active` | boolean | Admin Input | Whether reason is selectable | Admin Dashboard |
| `created_at` | timestamptz | Generated | `now()` default | - |

---

## 10. client_users Table

| Column | Type | Source | Extraction Path / Calculation | Source |
|--------|------|--------|------------------------------|--------|
| `id` | uuid | Generated | `gen_random_uuid()` | client-login |
| `email` | text | Admin Input | Client email address | Admin Dashboard |
| `password` | text | Admin Input | Hashed password | Admin Dashboard |
| `full_name` | text | Admin Input | Display name | Admin Dashboard |
| `company_id` | uuid | Admin Input | Reference to `companies.id` | Admin Dashboard |
| `is_active` | boolean | Admin Input | Whether user can login | Admin Dashboard |
| `created_at` | timestamptz | Generated | `now()` default | - |
| `updated_at` | timestamptz | Generated | `now()` trigger | - |

---

## 11. push_subscriptions Table

| Column | Type | Source | Extraction Path / Calculation | Edge Function |
|--------|------|--------|------------------------------|---------------|
| `id` | uuid | Generated | `gen_random_uuid()` | register-push-subscription |
| `user_id` | uuid | App State | Logged-in user's UUID | register-push-subscription |
| `user_type` | text | App State | `'driver'` or `'client'` | register-push-subscription |
| `endpoint` | text | Browser API | `PushSubscription.endpoint` | register-push-subscription |
| `p256dh` | text | Browser API | `PushSubscription.keys.p256dh` | register-push-subscription |
| `auth` | text | Browser API | `PushSubscription.keys.auth` | register-push-subscription |
| `created_at` | timestamptz | Generated | `now()` default | - |
| `updated_at` | timestamptz | Generated | `now()` trigger | - |

---

## Locus API Response Structure

```json
{
  "taskId": "ORDER-12345",
  "clientId": "company_owner_id",
  "taskGraph": {
    "visits": {
      "CUSTOMER": {
        "locationOptions": [{
          "locationId": "LOC-001",
          "location": {
            "latitude": 30.0444,
            "longitude": 31.2357
          },
          "addressDetails": {
            "name": "Customer Name",
            "formattedAddress": "123 Main St, Cairo"
          },
          "timeWindow": {
            "slot": {
              "start": "2025-12-18T06:00:00.000+0000",
              "end": "2025-12-18T15:00:00.000+0000"
            },
            "slots": [{
              "start": "2025-12-18T06:00:00.000+0000",
              "end": "2025-12-18T15:00:00.000+0000"
            }]
          }
        }]
      },
      "HOMEBASE": {
        "locationOptions": [{
          "locationId": "WH-001",
          "location": {
            "latitude": 30.1234,
            "longitude": 31.4567
          },
          "addressDetails": {
            "name": "Warehouse Name",
            "formattedAddress": "456 Warehouse St"
          }
        }]
      }
    },
    "statuses": [
      {
        "status": "ASSIGNED",
        "time": "2025-12-18T05:00:00.000Z"
      },
      {
        "status": "ARRIVED",
        "time": "2025-12-18T10:30:00.000Z",
        "latlng": {
          "latitude": 30.0445,
          "longitude": 31.2358
        }
      },
      {
        "status": "COMPLETED",
        "time": "2025-12-18T10:45:00.000Z"
      }
    ]
  }
}
```

---

## AWS RDS Query Structure

The `da-login` edge function queries the AWS RDS PostgreSQL database for tour information:

```sql
SELECT 
  tour_id,
  rider_name,
  rider_phone,
  vehicle_name,
  vehicle_model,
  plate_number,
  date as tour_date,
  order_id,
  sequence
FROM tours_view
WHERE rider_phone IN (phone_variants)
  AND date >= CURRENT_DATE - 1
ORDER BY date DESC
```

---

## Storage Bucket Paths

| Bucket | Path Pattern | Content |
|--------|-------------|---------|
| `evidence` | `{report_id}/{timestamp}.{ext}` | Photos/videos from issue reports |
| `voice-recordings` | `{order_id}/{timestamp}.webm` | Voice notes from drivers |
| `voice-recordings` | `{report_id}/{timestamp}.webm` | Voice notes in issue responses |

---

## Edge Functions Summary

| Function | Purpose | Data Sources | Tables Modified |
|----------|---------|--------------|-----------------|
| `da-login` | Driver authentication & data sync | AWS RDS, Locus API | delivery_agents, tours, orders, companies, warehouses |
| `refresh-orders` | Update order statuses | Locus API | orders, companies, warehouses |
| `ai-process-issue` | AI analysis of voice notes | Whisper API, Gemini API | issue_reports |
| `client-login` | Client authentication | Supabase | - (read only) |
| `send-push-notification` | Push notifications | Supabase | - (read only) |
| `register-push-subscription` | Save push subscriptions | Browser API | push_subscriptions |
| `get-vapid-public-key` | Return VAPID key | Environment | - (read only) |
