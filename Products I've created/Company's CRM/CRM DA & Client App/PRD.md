

# Product Requirements Document (PRD)
## Frontdoor AR Tracker

**Version:** 1.0
**Date:** March 14, 2026
**Platform:** Mobile-first Progressive Web Application (PWA)
**Language:** Arabic (RTL), Egyptian dialect

---

## 1. Product Overview

Frontdoor AR Tracker is a mobile-first PWA that creates "Proof of Attempt" documentation for last-mile delivery operations. It connects delivery agents (drivers) with client/sales teams in real-time, enabling drivers to report delivery issues with GPS validation, photo evidence, and AI-powered voice transcription, while clients review and respond to those issues.

The application serves the Egyptian market, with all UI text in Arabic and Egyptian colloquial dialect used in AI-generated content.

---

## 2. User Roles

### 2.1 Delivery Agent (DA)
- Logs in via phone number (validated against AWS RDS tour assignments)
- Reports delivery issues using voice-first workflow
- Communicates with clients through a chat-like interface
- Can resolve issues directly

### 2.2 Client / Sales Team
- Logs in via email/password (validated against `client_users` table, plain-text)
- Scoped to their company -- only sees issues for orders belonging to their company
- Reviews and responds to delivery issues
- Can approve cancellations or request reopening of auto-resolved issues

### 2.3 Supervisor (Dashboard User)
- Not implemented in this app -- referenced as a separate "Supervisor App"
- Reviews reopen requests, can approve/reject
- Has `dashboard_users` table with `password_hash` and `role` fields

---

## 3. Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Supabase (PostgreSQL, Edge Functions, Storage, Realtime) |
| External Data | AWS RDS (tour/order warehouse), Locus REST API (order enrichment) |
| AI | Google Gemini API (transcription, text refinement, reason matching, response generation) |
| Analytics | Mixpanel (100% session replay, event tracking) |
| Push Notifications | Web Push API (VAPID), service worker (`sw-push.js`) |
| PWA | Install prompt, standalone display mode |

---

## 4. Data Architecture

### 4.1 Database Tables

| Table | Purpose |
|-------|---------|
| `delivery_agents` | Driver profiles (phone, name, company) |
| `tours` | Daily tour assignments (vehicle, rider, date, linked DA) |
| `orders` | Individual delivery orders (address, coords, status, company, Locus data) |
| `companies` | Client companies |
| `warehouses` | Warehouse/homebase locations |
| `client_users` | Client login credentials and company association |
| `dashboard_users` | Supervisor accounts (separate app) |
| `cancellation_reasons` | Configurable issue reasons with Arabic names, wait time requirements, visibility type (client/supervisor) |
| `issue_reports` | Core issue records with GPS validation, AI data, status lifecycle |
| `issue_responses` | Conversation messages between driver, client, and supervisor |
| `report_evidence` | Photo evidence storage paths |
| `reopen_requests` | Client requests to reopen auto-resolved issues |
| `order_activities` | Comprehensive activity audit log |
| `push_subscriptions` | Web Push subscription storage |
| `user_roles` | Role-based access control |
| `profiles` | Supabase auth profiles |

### 4.2 Key Enums

- **issue_status:** `open`, `waiting_response`, `resolved`, `pending_reopen`
- **order_status:** `pending`, `in_progress`, `issue_reported`, `resolved`, `delivered`, `cancelled`
- **locus_order_status:** `RECEIVED`, `WAITING`, `ACCEPTED`, `STARTED`, `ARRIVED`, `TRANSACTING`, `COMPLETED`, `CANCELLED`
- **issue_visibility:** `client`, `supervisor`
- **reopen_request_status:** `pending`, `approved`, `rejected`
- **app_role:** `admin`, `client`, `sales`, `delivery_agent`, `supervisor`, `owner`

### 4.3 External Data Sources

**AWS RDS:** Source of truth for tour assignments and order creation. The `sync-orders-from-rds` edge function runs on a schedule, fetching tours and orders from the last 3 days and upserting into Supabase. Uses `DISTINCT ON` with priority ordering to handle reassigned orders.

**Locus API:** Provides real-time order enrichment (status, timestamps, coordinates, cancellation reasons). Used by `refresh-orders` (on-demand) and `sync-orders-status` (cron-based, processes up to 200 orders per run).

---

## 5. Authentication

### 5.1 Mode Selection Screen
- Two cards: "Delivery Driver" (truck icon) and "Client/Sales" (building icon)
- Arabic text with descriptions

### 5.2 Delivery Agent Login
- Phone number input (Egyptian format: `01xxxxxxxxx`)
- Calls `da-login` edge function which:
  - Checks Supabase cache first for existing DA + tour
  - Falls back to AWS RDS query for fresh data
  - Enriches orders via Locus API
  - Upserts DA, tour, and orders into Supabase
  - Returns tour data (vehicle, rider, orders)
- Session stored in `localStorage`

### 5.3 Client Login
- Email + password form
- Calls `client-login` edge function
- Plain-text password comparison against `client_users` table
- Fetches company name if `company_id` exists
- Session stored in `localStorage`

### 5.4 Session Management
- Restored from `localStorage` on app load
- Protected routes redirect unauthorized users
- Cross-type access redirects to correct home page

---

## 6. Driver Experience

### 6.1 Driver Home (`/driver/home`)
- **Header:** Driver name, phone, calendar button, refresh button, logout
- **Calendar:** Popover with Arabic locale, dots on dates with tours (last 30 days)
- **Date Navigation:** Select past dates to view historical tours (read-only if older than 3 days)
- **No Tour State:** Informational card when no tour exists for today
- **Open Issues Card:** Shows count of active issues with unread response indicators; navigates to issue detail or expands list if multiple
- **Tour Summary Card:** Vehicle info, order count, quick stats; clickable to view full tour orders

### 6.2 Tour Orders (`/driver/tour/:tourId`)
- List of all orders in the tour with status badges
- Company owner displayed per order
- Status badges for Locus statuses (color-coded)
- Read-only banner for past tours
- Real-time subscription for order updates

### 6.3 Order Detail (`/driver/order/:orderId`)
- Order info: client name, address, Locus status
- Active issue warning banner with link to issue detail
- Past resolved issues list
- "Report Issue" button (only for pending orders on current/recent tours)

### 6.4 Report Issue (`/driver/order/:orderId/report`) -- Voice-First Flow

**Step 1: Record**
- Full-screen voice recorder component
- Records audio as WebM/Opus

**Step 2: AI Processing (automatic)**
- Transcription via Gemini API
- Text refinement (Egyptian Arabic, removes profanity, cleans grammar)
- Evidence suggestion (what photo to take)
- Reason matching (maps description to predefined cancellation reasons)
- Content filtering (rejects all-offensive messages)

**Step 3: Refine**
- Shows transcribed and refined text (editable)
- Matched reason displayed with option to change
- Reason dropdown from `cancellation_reasons` table

**Step 4: Evidence**
- Photo capture via device camera
- Evidence suggestion text from AI

**Step 5: Confirm & Submit**
- Validates: reason selected, photo taken, GPS available
- GPS validation: Haversine distance calculation, 500m geofence
- Time slot validation: checks arrival time and issue creation time against delivery slot
- Wait time tracking: timer for reasons requiring wait time
- Uploads photo to `evidence` storage bucket
- Uploads voice note to `voice-recordings` storage bucket
- Creates `issue_reports` record with all metadata
- Creates `report_evidence` record
- Updates order status to `issue_reported`, `has_active_issue = true`
- Sends push notifications to all active clients in the order's company (if reason is client-visible)
- Logs `issue_notified_clients` activity
- Sends push notification to `notify-issue-created` for dashboard users

### 6.5 Driver Issue Detail (`/driver/issue/:issueId`)
- **Issue Info:** Reason, notes, evidence photo, geofence status, timestamps
- **Conversation:** Chronological list of responses from driver, client, and supervisor
- **Real-time:** Subscribes to new responses and status changes
- **Read receipts:** Marks client messages as read when viewed
- **Actions (if issue is open and agent not muted):**
  - Voice message: Record, transcribe via AI, refine, send as text + voice attachment
  - Image upload: Camera capture, upload to evidence storage
  - Resolve issue: Confirmation dialog, marks resolved by driver, resets order status
- **Smart notification targeting:** If a client has already responded, notifications go only to that client; otherwise to all company clients
- **Agent muting:** If `is_agent_muted` is true, action buttons are hidden

---

## 7. Client Experience

### 7.1 Client Home (`/client/home`)
- **Header:** Company name/email, calendar, refresh, logout
- **Company Banner:** Shows company filter
- **Visibility Filter:** Only shows issues with `client`-visible cancellation reasons
- **Date Navigation:** Calendar with color-coded indicators:
  - Orange dots: dates with unresolved issues
  - Green dots: dates with only resolved issues
  - Amber: dates with timeout-resolved issues
- **Timeout Banner:** Prominent gradient banner showing count of auto-closed issues; clickable to filter
- **Stats Cards:** Clickable filter cards showing counts for:
  - Open (no client response yet)
  - Waiting (client has responded, awaiting resolution)
  - Resolved
- **Issue Feed:** Cards showing:
  - Evidence thumbnail
  - Cancellation reason
  - Client name and address
  - Status badge (open/waiting/resolved/timeout/pending reopen)
  - Time since creation (IssueTimer component)
  - Unread driver message indicator (blue dot)
- **Real-time:** Subscribes to all issue_reports changes

### 7.2 Client Issue Detail (`/client/issue/:issueId`)
- **First View Tracking:** Sets `first_viewed_at` and `first_viewed_by` on first open; logs `issue_first_viewed` activity
- **Access Control:** Redirects if issue has supervisor-only visibility
- **Issue Info:** Evidence photos (clickable fullscreen), reason, driver notes, voice note playback, geofence validity, distance, arrival time validity, issue creation time validity, waited minutes
- **IssueTimer:** Live countdown showing time remaining before 30-minute auto-resolve (color changes: green > yellow > red)
- **AI Suggestions:** On first view of unresponded issues, generates quick response suggestions via Gemini
- **Conversation:** Chronological messages with role labels (driver/client/supervisor)
- **Actions (if issue is open):**
  - Send text message
  - Send AI-suggested response
  - Upload image evidence
  - Approve cancellation (resolves issue, marks order as cancelled)
- **Reopen Workflow (if issue is resolved):**
  - "Request Reopen" button (available for timeout-resolved and same-day issues)
  - Dialog to enter reason
  - Creates `reopen_requests` record
  - Real-time subscription for reopen request status changes
  - Shows pending/approved/rejected status
  - Supervisor approval triggers database trigger that reopens issue with fresh 30-min timeout window
- **Read Receipts:** Marks driver messages as read

---

## 8. Edge Functions

| Function | Trigger | Purpose |
|----------|---------|---------|
| `da-login` | Manual (login) | Authenticate DA, sync tour/orders from RDS + Locus |
| `client-login` | Manual (login) | Authenticate client against `client_users` |
| `refresh-orders` | Manual (pull-to-refresh) | Re-fetch order data from Locus API for a tour |
| `sync-orders-from-rds` | Cron | Bulk sync tours and orders from AWS RDS (last 3 days) |
| `sync-orders-status` | Cron | Bulk update order statuses from Locus API (200/run), includes stale terminal status guard for reassigned orders |
| `ai-process-issue` | Manual | Multi-purpose AI: transcribe, refine, suggest evidence, match reason, generate responses, refine messages |
| `check-issue-timeouts` | Cron | 15-min reminder notifications + 30-min auto-resolve for unresponded issues |
| `send-push-notification` | Internal | Send web push notification to a user |
| `register-push-subscription` | Manual | Store push subscription |
| `get-vapid-public-key` | Manual | Return VAPID public key for push setup |
| `notify-issue-created` | Webhook | Notify dashboard users of new issues |
| `notify-issue-response` | Webhook | Forward supervisor responses to DA and clients |
| `notify-reopen-request` | Webhook | Notify supervisors of reopen requests |
| `notify-reopen-approved` | Webhook | Notify requester of approval |
| `notify-reopen-rejected` | Webhook | Notify requester of rejection |

---

## 9. Issue Lifecycle

```text
Driver reports issue
    |
    v
[OPEN] -- issue_reports.status = 'open'
    |-- order.status = 'issue_reported'
    |-- order.has_active_issue = true
    |-- Push notifications sent to clients
    |-- 15-min timer starts
    |
    |-- (No response after 15 min) --> Reminder notification sent
    |
    |-- (Client/Driver responds) --> [WAITING_RESPONSE]
    |       |-- Conversation continues
    |       |-- Client can: send message, upload image, approve cancel
    |       |-- Driver can: send voice message, upload image, resolve
    |
    |-- (Client approves cancel) --> [RESOLVED] resolved_by='client'
    |       |-- order.status = 'cancelled'
    |
    |-- (Driver resolves) --> [RESOLVED] resolved_by='driver'
    |       |-- order.status = 'pending'
    |
    |-- (No response after 30 min) --> [RESOLVED] resolved_by='timeout'
    |       |-- Auto-resolved by check-issue-timeouts
    |
    v
[RESOLVED]
    |
    |-- (Client requests reopen) --> reopen_requests.status = 'pending'
    |       |
    |       |-- (Supervisor approves) --> [OPEN] again
    |       |       |-- reopened_at set
    |       |       |-- Fresh 30-min timeout window
    |       |       |-- reminder_sent_at reset
    |       |
    |       |-- (Supervisor rejects) --> stays [RESOLVED]
    |
    |-- (Supervisor reverses approval) --> [RESOLVED]
            |-- resolved_by = 'reopen_rejected'
            |-- reopened_at = NULL
```

---

## 10. Push Notifications

- **Technology:** Web Push API with VAPID keys
- **Service Worker:** `sw-push.js` handles background push events
- **Subscription Management:** Via `usePushNotifications` hook; auto-subscribes on login, unsubscribes on logout
- **Storage:** `push_subscriptions` table (endpoint, p256dh, auth keys)
- **Notification Scenarios:**
  - New issue reported -> all clients in company
  - Driver sends message/image -> targeted client (or all if no prior response)
  - Client responds -> driver
  - 15-minute reminder -> all clients in company
  - Auto-resolve -> driver + all clients
  - Reopen request created -> supervisors
  - Reopen approved/rejected -> requester

---

## 11. Analytics (Mixpanel)

- **Session Replay:** 100% recording, no text masking
- **User Identification:** Separate identify calls for DA and Client
- **Event Categories:**
  - Authentication: page views, login attempts, successes, failures, mode selection
  - Driver: home views, calendar, refresh, tour navigation, issue interactions
  - Issue Reporting: each step tracked, submission with full metadata
  - Client: home views, date selection, filter usage, responses, image uploads
  - Voice Recorder: start, stop, cancel with duration
  - Install Prompt: shown, clicked, accepted, dismissed
- **User Properties:** Name, type, phone/email, company

---

## 12. PWA Features

- **Install Prompt:** Custom banner prompting home screen installation
  - iOS: Shows "Add to Home Screen" instructions
  - Android/Desktop: Uses `beforeinstallprompt` API
  - Dismissable with 24-hour cooldown
- **Service Worker:** Handles push notifications in background
- **Icons:** 192px and 512px icons, splash logo, apple-touch-icon
- **Standalone Mode:** Detects if running as installed app

---

## 13. Data Sync Architecture

### 13.1 RDS Sync (`sync-orders-from-rds`)
- Runs on cron schedule
- Fetches last 3 days of tours and orders from AWS RDS
- Uses `DISTINCT ON` with priority ordering:
  - Tours: prioritizes records with rider data
  - Orders: prioritizes records with non-null tour_id
- Handles order reassignment: renames old record (appends `_OLD_`), inserts new with updated tour
- Links orders to companies via `company_owner` field

### 13.2 Locus Status Sync (`sync-orders-status`)
- Runs on cron schedule
- Processes up to 200 orders per run
- Fetches fresh status from Locus API for each order
- **Stale Terminal Status Guard:** Skips CANCELLED/COMPLETED updates where the terminal event timestamp predates the order record's `created_at` (protects reassigned orders)
- Updates coordinates only if Locus provides non-null values (preserves RDS fallback)
- Upserts company data from Locus response

---

## 14. Database Triggers

| Trigger | Table | Action |
|---------|-------|--------|
| `on_issue_created` | `issue_reports` INSERT | Logs `issue_created` activity |
| `on_first_client_response` | `issue_responses` INSERT | Logs `client_first_interaction` activity |
| `on_issue_resolution` | `issue_reports` UPDATE | Logs `issue_resolved` activity |
| `handle_reopen_request_status_change` | `reopen_requests` UPDATE | Handles all status transitions: reopens/closes issues, updates orders, logs activities |

---

## 15. Activity Audit Log

The `order_activities` table provides a complete lifecycle audit trail:

| Activity Type | Actor | Source |
|--------------|-------|--------|
| `issue_created` | delivery_agent | DB trigger |
| `issue_notified_clients` | system | ReportIssue.tsx |
| `issue_first_viewed` | client | IssueDetail.tsx |
| `client_first_interaction` | client | DB trigger |
| `reminder_15min_sent` | system | check-issue-timeouts |
| `issue_resolved` | client/driver | DB trigger |
| `issue_auto_resolved` | system | check-issue-timeouts |
| `issue_reopened` | supervisor | DB trigger (reopen_requests) |
| `reopen_rejected` | supervisor | DB trigger (reopen_requests) |

---

## 16. Cancellation Reasons

- Stored in `cancellation_reasons` table
- Configurable fields: code, Arabic name, English name, display order, active flag
- **Visibility types:**
  - `client`: Visible to clients in their dashboard
  - `supervisor`: Hidden from clients, only visible in supervisor app
- **Wait time:** Some reasons require the driver to wait a configurable number of minutes (tracked via timer)
- **AI Matching:** Gemini matches voice descriptions to the closest predefined reason using a detailed Arabic matching guide

---

## 17. Geofencing & Location Validation

- **GPS Capture:** Browser Geolocation API with high accuracy
- **Distance Calculation:** Haversine formula
- **Geofence Radius:** 500 meters from target coordinates
- **Validation Fields Stored:**
  - `da_lat`, `da_lng`: Driver's GPS position
  - `distance_to_target`: Calculated distance in km
  - `is_geofence_valid`: Whether within 500m
  - `is_arrival_time_valid`: Whether arrival time falls within delivery slot
  - `is_issue_create_time_valid`: Whether issue creation time falls within delivery slot

---

## 18. Storage Buckets

| Bucket | Content |
|--------|---------|
| `evidence` | Photo evidence (issue reports and responses) |
| `voice-recordings` | Voice note recordings (WebM format) |

---

## 19. Security Considerations

- Client passwords stored in plain text (noted as a known limitation)
- Edge functions have `verify_jwt = false` (public access)
- Client data scoped by `company_id` in queries
- Supervisor-only issues blocked from client access via `visibility_type` check
- User roles stored in separate `user_roles` table
- `has_role` security definer function for RLS bypass

---

## 20. Localization

- All UI text in Arabic (MSA for labels, Egyptian dialect in AI content)
- RTL layout (`dir="rtl"` on root containers)
- Arabic date formatting via `date-fns/locale/ar`
- Numbers displayed in Western Arabic numerals

