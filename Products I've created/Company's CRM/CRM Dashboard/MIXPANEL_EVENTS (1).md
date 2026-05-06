# Mixpanel Analytics Events Documentation

## Overview

This document provides a comprehensive reference of all manually tracked Mixpanel events in the application.

**Configuration:**
- Autocapture: **Disabled**
- Session Recording: **100%**
- Persistence: `localStorage`

**Core Files:**
- `src/lib/analytics.ts` - Analytics service with event constants
- `src/hooks/useAnalytics.ts` - React hook for tracking with user context

---

## User Identity Properties

Every event automatically includes the following properties via the `useAnalytics` hook:

| Property | Description | Example |
|----------|-------------|---------|
| `user_id` | Unique user ID | `uuid-string` |
| `user_email` | User's email address | `user@example.com` |
| `user_name` | User's full name | `John Doe` |
| `user_role` | Role: `owner` or `supervisor` | `supervisor` |
| `company_id` | Associated company ID (null for owners) | `uuid-string` |
| `page_path` | Current URL path | `/issues` |
| `page_search` | URL query parameters | `?status=open` |
| `timestamp` | ISO timestamp of event | `2024-01-15T10:30:00Z` |
| `language` | Current language | `en` or `ar` |

---

## Events by Category

### 1. Authentication Events (5 events)

| Event Name | Trigger | Additional Properties |
|------------|---------|----------------------|
| `Login Page Viewed` | Login page loads | - |
| `Login Attempted` | Login form submitted | `email` |
| `Login Success` | Successful authentication | `email` |
| `Login Failed` | Authentication error | `email`, `error` |
| `Logout Clicked` | Logout button clicked | - |

---

### 2. Navigation Events (3 events)

| Event Name | Trigger | Additional Properties |
|------------|---------|----------------------|
| `Navigation Clicked` | Sidebar nav item clicked | `destination`, `from_page`, `menu_item` |
| `Sidebar Toggled` | Collapse/expand sidebar | `collapsed` |
| `Language Changed` | Language dropdown selection | `from_language`, `to_language` |

---

### 3. Dashboard Events (4 events)

| Event Name | Trigger | Additional Properties |
|------------|---------|----------------------|
| `Dashboard Viewed` | Dashboard page loads | - |
| `Date Range Changed` | Date filter applied | `date_from`, `date_to`, `selection_type` |
| `Quick Filter Selected` | Quick filter button clicked | `quick_filter`, `date_from`, `date_to` |
| `Stat Card Clicked` | Stat card interaction | `card_title` |

---

### 4. Issues Events (11 events)

| Event Name | Trigger | Additional Properties |
|------------|---------|----------------------|
| `Issues Page Viewed` | Issues page loads | `total_count` |
| `Issue Filter Changed` | Any filter applied | `filter_type`, `filter_value` |
| `Issue Searched` | Search input submitted | `search_query`, `query_length` |
| `Issue Row Clicked` | Table row clicked | `issue_id`, `order_id`, `status`, `reason`, `source` |
| `Issue Detail Viewed` | Detail page loads | `issue_id`, `order_id`, `status`, `reason`, `is_geofence_valid`, `is_arrival_valid`, `is_timing_valid` |
| `Issue Status Changed` | Status dropdown changed | `issue_id`, `from_status`, `to_status` |
| `Issue Chat Message Sent` | Chat message submitted | `issue_id`, `has_image`, `message_length` |
| `Issue Agent Mute Toggled` | Mute switch toggled | `issue_id`, `agent_id`, `muted` |
| `Issue Evidence Viewed` | Evidence gallery opened | `issue_id` |
| `Issue Voice Note Played` | Audio playback started | `issue_id` |
| `Issue Timeline Toggled` | Timeline expand/collapse | `issue_id`, `expanded` |

---

### 5. Orders Events (7 events)

| Event Name | Trigger | Additional Properties |
|------------|---------|----------------------|
| `Orders Page Viewed` | Orders page loads | `total_count` |
| `Order Filter Changed` | Any filter applied | `filter_type`, `filter_value`, `filter_label` |
| `Order Searched` | Search input submitted | `search_query`, `query_length` |
| `Order Row Clicked` | Table row clicked | `order_id`, `status`, `client_name`, `has_issue` |
| `Order Modal Opened` | Order detail modal opens | `order_id`, `order_status`, `has_issue` |
| `Order Modal Closed` | Order detail modal closes | `order_id` |
| `Order View Issue Clicked` | "View Issue" link clicked | `order_id`, `issue_id`, `issue_status` |

---

### 6. Companies Events (4 events)

| Event Name | Trigger | Additional Properties |
|------------|---------|----------------------|
| `Companies Page Viewed` | Companies page loads | - |
| `Company Filter Changed` | Company dropdown changed | `company_id`, `company_name` |
| `Company View Issues Clicked` | "View Issues" button | `company_id` |
| `Chart Segment Clicked` | Cancellation chart bar clicked | `chart_type`, `reason_name`, `count`, `fault_type` |

---

### 7. Reopen Requests Events (5 events)

| Event Name | Trigger | Additional Properties |
|------------|---------|----------------------|
| `Reopen Requests Page Viewed` | Page loads | `pending_count` |
| `Reopen Tab Changed` | Tab switch | `from_tab`, `to_tab` |
| `Reopen Request Approved` | Approve button clicked | `request_id`, `issue_id`, `order_id` |
| `Reopen Request Rejected` | Reject confirmed | `request_id`, `issue_id`, `has_reason` |
| `Reopen View Issue Clicked` | External link clicked | `request_id`, `issue_id` |

---

### 8. Agents Events (3 events)

| Event Name | Trigger | Additional Properties |
|------------|---------|----------------------|
| `Agents Page Viewed` | Agents page loads | `total_agents` |
| `Agent Searched` | Search input submitted | `search_query`, `results_count` |
| `Agent Row Clicked` | Table row clicked | `agent_id`, `agent_name` |

---

### 9. Users Management Events (10 events)

| Event Name | Trigger | Additional Properties |
|------------|---------|----------------------|
| `Users Page Viewed` | Page loads | `client_count`, `crm_count` |
| `User Tab Changed` | Tab switch | `from_tab`, `to_tab` |
| `User Add Clicked` | Add user button | `user_type` |
| `User Edit Clicked` | Edit button | `user_id`, `user_type` |
| `User Delete Clicked` | Delete button | `user_id`, `user_type` |
| `User Delete Confirmed` | Delete confirmed | `user_id`, `user_type` |
| `User Form Submitted` | Form submitted | `user_type`, `is_editing`, `user_id` |
| `User Active Toggled` | Toggle switch | `user_id`, `user_type`, `new_status` |
| `User Searched` | Search input | `search_query`, `user_type` |
| `User Dialog Cancelled` | Cancel button clicked | `dialog_type`, `user_type`, `is_editing` |

---

### 10. Common Events (6 events)

| Event Name | Trigger | Additional Properties |
|------------|---------|----------------------|
| `Pagination Changed` | Page navigation | `source`, `from_page`, `to_page`, `per_page`, `total_pages` |
| `Filters Cleared` | Clear filters button | `page`, filter-specific booleans |
| `Back Button Clicked` | Back navigation | `issue_id`, `page` |
| `Dialog Opened` | Modal opens | `dialog_type`, `context` |
| `Dialog Closed` | Modal closes | `dialog_type` |
| `Map Viewed` | Map rendered | `issue_id`/`order_id`, location booleans |

---

### 11. Media Events (5 events)

| Event Name | Trigger | Additional Properties |
|------------|---------|----------------------|
| `Audio Play Clicked` | Play button clicked | `issue_id`, `duration` |
| `Audio Pause Clicked` | Pause button clicked | `issue_id`, `current_time`, `duration` |
| `Lightbox Opened` | Image thumbnail clicked | `issue_id`, `image_source` |
| `Lightbox Closed` | Lightbox closed | `issue_id` |
| `Password Visibility Toggled` | Eye icon clicked | `user_id`, `user_type`, `is_visible` |

---

## Suggested Funnels

### Funnel 1: Login to First Action

Track how users engage immediately after logging in.

```
Login Success → Dashboard Viewed → [Issues Page Viewed | Orders Page Viewed | Companies Page Viewed]
```

**Purpose:** Understand initial user behavior and preferred first destination.

**Breakdown by:** `user_role`, `company_id`

---

### Funnel 2: Issue Resolution Flow

Track the complete issue handling process from discovery to resolution.

```
Issues Page Viewed → Issue Row Clicked → Issue Detail Viewed → [Issue Chat Message Sent | Issue Status Changed]
```

**Purpose:** Measure how supervisors handle issues from discovery to resolution.

**Key Metrics:**
- Conversion rate at each step
- Time between steps
- Drop-off points

---

### Funnel 3: Order to Issue Investigation

Track users investigating orders with issues.

```
Orders Page Viewed → Order Row Clicked → Order View Issue Clicked → Issue Detail Viewed
```

**Purpose:** Understand how users navigate from orders to their related issues.

**Breakdown by:** `company_id`, `user_role`

---

### Funnel 4: Reopen Request Processing

Track reopen request handling efficiency.

```
Reopen Requests Page Viewed → [Reopen Request Approved | Reopen Request Rejected] → Reopen View Issue Clicked
```

**Purpose:** Measure decision-making speed and patterns on reopen requests.

**Key Metrics:**
- Approval vs rejection rate
- Time from view to decision

---

### Funnel 5: User Management Flow

Track user creation workflow completion.

```
Users Page Viewed → User Add Clicked → User Form Submitted
```

**Purpose:** Understand user management patterns and form completion rates.

**Breakdown by:** `user_type` (client vs CRM)

---

### Funnel 6: Company Analytics Deep Dive

Track how users analyze company performance data.

```
Companies Page Viewed → Company Filter Changed → Chart Segment Clicked → Company View Issues Clicked
```

**Purpose:** Understand analytical behavior and data exploration patterns.

**Key Metrics:**
- Chart engagement rate
- Filter usage patterns

---

### Funnel 7: Search to Action

Track search feature effectiveness across modules.

```
[Issue Searched | Order Searched | Agent Searched] → [Issue Row Clicked | Order Row Clicked | Agent Row Clicked]
```

**Purpose:** Measure search feature effectiveness and result relevance.

**Key Metrics:**
- Search-to-click conversion rate
- Average results per search

---

### Funnel 8: Issue Deep Dive Investigation

Track detailed issue investigation before taking action.

```
Issue Detail Viewed → Issue Timeline Toggled → [Issue Evidence Viewed | Issue Voice Note Played] → Issue Status Changed
```

**Purpose:** Understand how users investigate issues before making decisions.

**Breakdown by:** `user_role`, `reason`

---

## Key Metrics to Track

### Engagement Metrics

| Metric | Description | Events Used |
|--------|-------------|-------------|
| Daily/Weekly Active Users | Unique users by day/week | Any event by `user_id` |
| Page Views by Role | Feature usage by role | `*_Page_Viewed` by `user_role` |
| Feature Usage by Company | Company-specific engagement | All events by `company_id` |
| Language Preference | UI language usage | All events by `language` |

### Operational Metrics

| Metric | Description | Events Used |
|--------|-------------|-------------|
| Issue Resolution Time | Time from view to resolve | `Issue Detail Viewed` → `Issue Status Changed` |
| Messages per Issue | Communication volume | `Issue Chat Message Sent` count |
| Reopen Approval Rate | % approved vs rejected | `Reopen Request Approved/Rejected` |
| Filter Usage | Most popular filters | `*_Filter_Changed` events |

### User Behavior Metrics

| Metric | Description | Events Used |
|--------|-------------|-------------|
| Navigation Paths | Common user journeys | `Navigation Clicked` sequences |
| Search Patterns | Query frequency/terms | `*_Searched` events |
| Feature Adoption | New feature usage | Feature-specific events |
| Session Depth | Pages per session | Page view counts |

---

## Implementation Reference

### Tracking an Event

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

function MyComponent() {
  const { track, events } = useAnalytics();

  const handleClick = () => {
    track(events.ISSUE_ROW_CLICKED, {
      issue_id: issue.id,
      order_id: issue.order_id,
      status: issue.status,
      reason: issue.reason,
    });
  };

  return <button onClick={handleClick}>View Issue</button>;
}
```

### Event Constants Location

All event name constants are defined in `src/lib/analytics.ts`:

```typescript
export const AnalyticsEvents = {
  LOGIN_PAGE_VIEWED: 'Login Page Viewed',
  LOGIN_ATTEMPTED: 'Login Attempted',
  // ... all 63 events
} as const;
```

---

## Files Modified for Tracking

| File | Events Added |
|------|--------------|
| `src/components/dashboard/DateRangeFilter.tsx` | Date Range Changed, Quick Filter Selected, Filters Cleared |
| `src/components/issues/IssueFilters.tsx` | Issue Filter Changed, Issue Searched, Filters Cleared |
| `src/components/issues/AudioPlayer.tsx` | Audio Play Clicked, Audio Pause Clicked |
| `src/components/issues/EvidenceGallery.tsx` | Lightbox Opened, Lightbox Closed |
| `src/components/issues/IssuePagination.tsx` | Pagination Changed |
| `src/components/issues/IssueMap.tsx` | Map Viewed |
| `src/components/orders/OrderFilters.tsx` | Order Filter Changed, Order Searched, Filters Cleared |
| `src/components/orders/OrderDetailModal.tsx` | Order Modal Opened, Order Modal Closed, Order View Issue Clicked |
| `src/components/orders/OrderMap.tsx` | Map Viewed |
| `src/components/companies/CompanyFilters.tsx` | Company Filter Changed, Filters Cleared |
| `src/components/users/ClientUsersTable.tsx` | Password Visibility Toggled |
| `src/components/users/CRMUsersTable.tsx` | Password Visibility Toggled |
| `src/components/users/UserFormDialog.tsx` | Dialog Opened, Dialog Closed, User Dialog Cancelled |
| `src/components/users/DeleteUserDialog.tsx` | Dialog Opened, Dialog Closed, User Dialog Cancelled |

---

## Total Event Count

| Category | Count |
|----------|-------|
| Authentication | 5 |
| Navigation | 3 |
| Dashboard | 4 |
| Issues | 11 |
| Orders | 7 |
| Companies | 4 |
| Reopen Requests | 5 |
| Agents | 3 |
| Users Management | 10 |
| Common | 6 |
| Media | 5 |
| **Total** | **63** |
