# Mixpanel Events Documentation

This document provides a comprehensive list of all Mixpanel analytics events tracked in the application, including their event names and properties.

## Overview

All events automatically include the following **user context properties** (via the `analytics.track()` function):

| Property | Type | Description |
|----------|------|-------------|
| `user_id` | string | Current user's ID |
| `user_type` | string | Either `'delivery_agent'` or `'client'` |
| `user_name` | string | User's display name |
| `user_phone` | string | Phone number (DA only) |
| `user_email` | string | Email address (Client only) |
| `company_id` | string | Company ID (Client only) |
| `company_name` | string | Company name (Client only) |
| `timestamp` | string | ISO timestamp of when the event occurred |

---

## Table of Contents

1. [Authentication Events](#authentication-events)
2. [Driver Events](#driver-events)
   - [Driver Home](#driver-home)
   - [Tour Orders](#tour-orders)
   - [Order Detail](#order-detail)
   - [Report Issue](#report-issue)
   - [Driver Issue Detail](#driver-issue-detail)
3. [Client Events](#client-events)
   - [Client Home](#client-home)
   - [Client Issue Detail](#client-issue-detail)
4. [Component Events](#component-events)
   - [Voice Recorder](#voice-recorder)
   - [Install Prompt](#install-prompt)

---

## Authentication Events

**Source:** `src/contexts/AuthContext.tsx`, `src/pages/Auth.tsx`

### Session Events

| Event Name | Description | Properties |
|------------|-------------|------------|
| `session_restored` | User session restored from local storage | `restored_user_type`: `'delivery_agent'` \| `'client'` |
| `login_success` | User successfully logged in | `login_type`: `'delivery_agent'` \| `'client'` |
| `logout_completed` | User logged out | - |

### Auth Page Events

| Event Name | Description | Properties |
|------------|-------------|------------|
| `auth_page_viewed` | Auth page loaded | - |
| `auth_mode_selected` | User selected login mode (driver/client) | `selected_mode`: `'driver'` \| `'client'` |
| `auth_back_clicked` | User clicked back from login form | `from_mode`: `'driver'` \| `'client'` |
| `login_attempted` | User attempted to log in | `login_type`: `'delivery_agent'` \| `'client'`, `phone_number` (DA) or `email` (Client) |
| `login_failed` | Login attempt failed | `login_type`: `'delivery_agent'` \| `'client'`, `error`: string |

---

## Driver Events

### Driver Home

**Source:** `src/pages/driver/DriverHome.tsx`

| Event Name | Description | Properties |
|------------|-------------|------------|
| `driver_home_viewed` | Driver home page loaded | - |
| `driver_refresh_clicked` | Driver clicked refresh button | `tour_id`: string |
| `driver_refresh_completed` | Tour data successfully refreshed | `tour_id`: string, `refreshed_count`: number |
| `driver_logout_clicked` | Driver clicked logout | - |
| `driver_calendar_opened` | Driver opened calendar popover | - |
| `driver_calendar_date_selected` | Driver selected a date from calendar | `date`: string (YYYY-MM-DD), `is_today`: boolean, `has_tour`: boolean |
| `driver_past_tour_selected` | Driver selected a past tour to view | `date`: string (YYYY-MM-DD) |
| `driver_return_to_today_clicked` | Driver clicked to return to today's tour | `previous_date`: string |
| `driver_view_previous_tours_clicked` | Driver clicked "View Previous Tours" from no-tour state | - |
| `driver_open_issues_clicked` | Driver clicked on open issues card | `issues_count`: number |
| `driver_issue_selected` | Driver selected a specific issue | `issue_id`: string, `issue_status`: string, `has_new_response`?: boolean |
| `driver_tour_card_clicked` | Driver clicked on tour card to view orders | `tour_id`: string, `orders_count`: number, `is_read_only`: boolean |

### Tour Orders

**Source:** `src/pages/driver/TourOrders.tsx`

| Event Name | Description | Properties |
|------------|-------------|------------|
| `tour_orders_viewed` | Tour orders page loaded | `tour_id`: string |
| `tour_back_clicked` | Driver clicked back button | `tour_id`: string |
| `tour_order_clicked` | Driver clicked on an order | `order_id`: string, `order_index`: number, `locus_status`: string \| null, `has_active_issue`: boolean, `latest_issue_status`: string \| null |

### Order Detail

**Source:** `src/pages/driver/OrderDetail.tsx`

| Event Name | Description | Properties |
|------------|-------------|------------|
| `order_detail_viewed` | Order detail page loaded | `order_id`: string |
| `order_back_clicked` | Driver clicked back button | `order_id`: string |
| `order_response_clicked` | Driver clicked on response card (issue with responses) | `order_id`: string, `issue_id`: string |
| `order_issue_clicked` | Driver clicked on active issue card (no responses yet) | `order_id`: string, `issue_id`: string |
| `order_past_issue_clicked` | Driver clicked on a past/resolved issue | `order_id`: string, `issue_id`: string, `resolved_by`: string |
| `order_report_issue_clicked` | Driver clicked "Report Issue" button | `order_id`: string |
| `cancelled_order_notification_opened` | Driver opened order from cancellation push notification | `order_id`: string, `source`: `'push_notification'` |
| `cancellation_notification_sent` | Cancellation push notification sent to DA (backend) | `order_id`: string, `order_db_id`: string, `client_name`: string, `user_type`: `'delivery_agent'` |

### Report Issue

**Source:** `src/pages/driver/ReportIssue.tsx`

| Event Name | Description | Properties |
|------------|-------------|------------|
| `report_issue_viewed` | Report issue page loaded | `order_id`: string |
| `report_mode_changed` | Driver switched between voice/manual mode | `mode`: `'voice'` \| `'manual'`, `order_id`: string |
| `report_back_clicked` | Driver clicked back during issue reporting | `order_id`: string, `current_step`: string, `mode`: `'voice'` \| `'manual'` |
| `report_photo_captured` | Driver captured/selected evidence photo | `order_id`: string, `mode`: `'voice'` \| `'manual'` |
| `report_step_changed` | Driver moved to next step in voice flow | `order_id`: string, `from_step`: string, `to_step`: string |
| `report_text_edited` | Driver saved edited AI-refined text | `order_id`: string |
| `report_reason_changed` | Driver changed cancellation reason | `order_id`: string, `reason_id`: string, `reason_name`: string, `is_ai_suggested`: boolean |
| `report_issue_submitted` | Issue report submitted | `order_id`: string, `mode`: `'voice'` \| `'manual'`, `reason_code`: string, `reason_name`: string, `is_geofence_valid`: boolean, `distance_meters`: number \| null, `waited_minutes`: number |

### Driver Issue Detail

**Source:** `src/pages/driver/IssueDetail.tsx`

| Event Name | Description | Properties |
|------------|-------------|------------|
| `driver_issue_detail_viewed` | Driver issue detail page loaded | `issue_id`: string |
| `driver_issue_detail_back_clicked` | Driver clicked back button | `issue_id`: string |
| `driver_evidence_image_viewed` | Driver clicked to view evidence image fullscreen | `issue_id`: string |
| `driver_conversation_image_viewed` | Driver clicked to view conversation image fullscreen | `issue_id`: string, `response_id`: string |
| `driver_voice_note_played` | Driver played the original voice note | `issue_id`: string |
| `driver_image_upload_started` | Driver started uploading an image | `issue_id`: string |
| `driver_image_upload_completed` | Driver successfully uploaded an image | `issue_id`: string |
| `driver_image_upload_failed` | Driver's image upload failed | `issue_id`: string, `error`: string |
| `driver_voice_message_started` | Driver started recording voice message | `issue_id`: string |
| `driver_voice_message_completed` | Driver successfully sent voice message | `issue_id`: string |
| `driver_voice_message_failed` | Driver's voice message failed | `issue_id`: string, `error`: string |
| `driver_resolve_button_clicked` | Driver clicked "Issue Resolved" button | `issue_id`: string |
| `driver_resolve_issue_started` | Driver initiated issue resolution | `issue_id`: string |
| `driver_resolve_issue_completed` | Driver successfully resolved issue | `issue_id`: string |
| `driver_resolve_issue_failed` | Issue resolution failed | `issue_id`: string, `error`: string |
| `driver_resolve_cancelled` | Driver cancelled resolve confirmation dialog | `issue_id`: string |
| `driver_voice_record_button_clicked` | Driver clicked voice record button | `issue_id`: string |
| `driver_image_button_clicked` | Driver clicked image upload button | `issue_id`: string |

---

## Client Events

### Client Home

**Source:** `src/pages/client/ClientHome.tsx`

| Event Name | Description | Properties |
|------------|-------------|------------|
| `client_home_viewed` | Client home page loaded | - |
| `client_refresh_clicked` | Client clicked refresh button | - |
| `client_logout_clicked` | Client clicked logout | - |
| `client_calendar_opened` | Client opened calendar popover | - |
| `client_date_selected` | Client selected a date in calendar | `date`: string (YYYY-MM-DD), `is_today`: boolean, `has_issues`: boolean, `issue_count`: number |
| `client_return_to_today_clicked` | Client clicked "Return to today" button | `previous_date`: string (YYYY-MM-DD) |
| `client_timeout_banner_clicked` | Client clicked timeout issues banner | `timeout_count`: number, `action`: `'filter'` \| `'clear'` |
| `client_filter_open_clicked` | Client clicked "Open" filter card | `count`: number, `action`: `'filter'` \| `'clear'` |
| `client_filter_waiting_clicked` | Client clicked "Waiting" filter card | `count`: number, `action`: `'filter'` \| `'clear'` |
| `client_filter_resolved_clicked` | Client clicked "Resolved" filter card | `count`: number, `action`: `'filter'` \| `'clear'` |
| `client_filter_cleared` | Client clicked "Show All" button | `previous_filter`: string |
| `client_issue_card_clicked` | Client clicked on an issue card | `issue_id`: string, `status`: string, `resolved_by`: string \| null, `has_unread_message`: boolean, `reason_name`: string, `driver_name`: string |

### Client Issue Detail

**Source:** `src/pages/client/IssueDetail.tsx`

| Event Name | Description | Properties |
|------------|-------------|------------|
| `client_issue_detail_viewed` | Client issue detail page loaded | `issue_id`: string |
| `client_issue_first_viewed` | Issue marked as first viewed by client | `issue_id`: string |
| `client_issue_detail_back_clicked` | Client clicked back button | `issue_id`: string |
| `client_evidence_image_viewed` | Client clicked to view evidence image fullscreen | `issue_id`: string |
| `client_conversation_image_viewed` | Client clicked to view conversation image fullscreen | `issue_id`: string, `response_id`: string |
| `client_ai_suggestions_dismissed` | Client dismissed AI suggestions | `issue_id`: string, `suggestions_count`: number |
| `client_ai_suggestion_clicked` | Client clicked an AI-suggested response | `issue_id`: string, `suggestion_index`: number, `suggestion_text`: string (first 50 chars) |
| `client_approve_cancel_clicked` | Client clicked "Approve Cancel" button | `issue_id`: string |
| `client_image_upload_started` | Client started uploading an image | `issue_id`: string |
| `client_image_upload_completed` | Client successfully uploaded an image | `issue_id`: string |
| `client_image_upload_failed` | Client's image upload failed | `issue_id`: string, `error`: string |
| `client_custom_message_sent` | Client sent a custom message | `issue_id`: string, `message_length`: number |
| `client_response_sent` | Client response successfully sent | `issue_id`: string, `action_type`: string, `has_message`: boolean |
| `client_response_failed` | Client response failed to send | `issue_id`: string, `error`: string |
| `client_reopen_dialog_opened` | Client opened reopen request dialog | `issue_id`: string, `resolved_by`: string |
| `client_reopen_dialog_cancelled` | Client cancelled reopen request dialog | `issue_id`: string |
| `client_reopen_request_submitted` | Client submitted reopen request | `issue_id`: string, `reason_length`: number |
| `client_reopen_request_success` | Reopen request successfully submitted | `issue_id`: string |
| `client_reopen_request_failed` | Reopen request failed | `issue_id`: string, `error`: string |

---

## Component Events

### Voice Recorder

**Source:** `src/components/VoiceRecorder.tsx`

The `VoiceRecorder` component includes a `trackingContext` prop to differentiate events by usage context (e.g., `'report_issue'`, `'driver_issue_detail'`).

| Event Name | Description | Properties |
|------------|-------------|------------|
| `voice_recording_started` | User started voice recording | `context`: string |
| `voice_recording_stopped` | User stopped voice recording (for processing) | `context`: string, `duration_seconds`: number |
| `voice_recording_cancelled` | User cancelled voice recording | `context`: string, `duration_seconds`: number |
| `voice_recording_error` | Voice recording encountered an error | `context`: string, `error`: string |

### Install Prompt

**Source:** `src/components/InstallPrompt.tsx`

| Event Name | Description | Properties |
|------------|-------------|------------|
| `install_prompt_shown` | PWA install prompt displayed to user | `platform`: `'ios'` \| `'android_desktop'` |
| `install_button_clicked` | User clicked install button | - |
| `install_accepted` | User accepted PWA installation | - |
| `install_dismissed` | User dismissed PWA installation | - |
| `install_prompt_dismissed` | User closed install prompt banner | - |

---

## User Identification

**Source:** `src/lib/mixpanel.ts`

### Delivery Agent Identification

Called on DA login/session restore:

```typescript
analytics.identifyDA({
  id: string,           // Delivery agent ID
  phone_number: string, // Phone number
  full_name: string,    // Display name
});
```

Sets Mixpanel people properties:
- `$name`: Full name
- `user_type`: `'delivery_agent'`
- `phone_number`: Phone number

### Client Identification

Called on Client login/session restore:

```typescript
analytics.identifyClient({
  id: string,           // Client user ID
  email: string,        // Email address
  full_name: string,    // Display name
  company_id: string,   // Company ID
  company_name: string, // Company name
});
```

Sets Mixpanel people properties:
- `$name`: Full name or email
- `$email`: Email address
- `user_type`: `'client'`
- `company_id`: Company ID
- `company_name`: Company name

### Reset User

Called on logout:

```typescript
analytics.reset();
```

Clears current user context and resets Mixpanel identity.

---

## Event Summary by Category

| Category | Event Count |
|----------|-------------|
| Authentication | 6 |
| Driver Home | 11 |
| Tour Orders | 3 |
| Order Detail | 7 |
| Report Issue | 8 |
| Driver Issue Detail | 17 |
| Client Home | 12 |
| Client Issue Detail | 19 |
| Voice Recorder | 4 |
| Install Prompt | 5 |
| **Total** | **92** |

---

## Mixpanel Configuration

**Token:** `00a1d6b53053f3ca97fca47f19a9331e`

**Options:**
- `autocapture`: false (manual event tracking only)
- `record_sessions_percent`: 100 (all sessions recorded)

---

*Last updated: January 2026*
