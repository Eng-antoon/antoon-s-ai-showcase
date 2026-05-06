Product Requirements Document (PRD)
Frontdoor Issue Tracker - Delivery Operations Dashboard
1. Product Overview
Product Name: Frontdoor Issue Tracker Type: Internal operations dashboard (web application) Purpose: A centralized platform for managing and monitoring delivery operation issues, orders, delivery agents, and company performance. It enables supervisors and owners to track, investigate, and resolve delivery-related issues raised by delivery agents in the field.

Tech Stack: React + TypeScript, Vite, Tailwind CSS, Supabase (database + storage), Leaflet (maps), Mixpanel (analytics), i18next (internationalization).

Published URL: https://frontdoor-issues-admin.lovable.app

2. User Roles and Authentication
The system has two user roles stored in the dashboard_users table:

Role	Description	Access
Owner	Platform administrator with full access	All pages, all companies, user management
Supervisor	Company-scoped user	Dashboard, Orders, Issues, Reopen Requests, Agents (scoped to their company)
Authentication Flow:

Email + password login (validated against dashboard_users table)
Session persisted in localStorage
Protected routes redirect unauthenticated users to /login
Login page includes language toggle (English/Arabic) and demo credentials display
Mixpanel user identification on login
Access Control:

Supervisors can only see data belonging to their assigned company_id
Owners see data across all companies
Navigation items are filtered by role (Companies and Users pages are owner-only)
3. Internationalization (i18n)
Languages: English (LTR) and Arabic (RTL)
Implementation: react-i18next with i18next-browser-languagedetector
Direction: Automatically sets dir="rtl" on <html> when Arabic is selected
Persistence: Language preference stored in localStorage
Switcher: Available in the header on every page and on the login page
4. Navigation and Layout
Sidebar Navigation:

Collapsible sidebar with icon-only mode
RTL-aware (sidebar appears on right side for Arabic)
Shows user info and logout button in footer
Badge on "Reopen Requests" showing pending count
Menu items: Dashboard, Orders, Issues, Reopen Requests, Companies (owner), Agents, Users (owner)
Header:

Page title and subtitle
Language toggle dropdown
Company scope badge for supervisors
5. Pages and Features
5.1 Dashboard (/dashboard)
Purpose: High-level operational overview with KPIs.

KPI Cards (Row 1):

Total Issues (with tooltip)
Open Issues (amber highlight if > 0)
Resolved Issues (green)
Average Resolution Time (formatted as duration)
Validation Rate Cards (Row 2):

Geofence Valid % (color-coded: green >= 80%, amber >= 50%, red < 50%)
Time Valid % (same color coding)
Orders with Issues
Delivery Agents count
Additional Widgets:

"Never Viewed Issues" alert banner (owner-only, shown when count > 0)
Issues by Reason chart (pie/bar chart)
Recent Issues list (clickable, navigates to issue detail)
Filters:

Date range picker (From / To)
5.2 Orders (/orders)
Purpose: Browse, search, filter, and export all delivery orders.

Filters:

Date From / Date To (calendar popover)
Locus Status (COMPLETED, CANCELLED, ARRIVED, STARTED, ACCEPTED, WAITING, RECEIVED, TRANSACTING)
Has Issue (All / With Issues / No Issues)
Company (owner-only)
Cancelled By (Rider / Admin)
Completed By (Rider / Admin)
Delivery Agent (searchable combobox with agent name search -- only shows agents with orders)
Text search (order ID, client name, address -- debounced 300ms)
Clear all filters button
Order List:

Paginated table with server-side pagination
Configurable rows per page
Each order shows: order ID, client name, address, date, locus status, company, warehouse, tour/rider info, issue indicators
Order Detail Modal:

Opens on row click
Shows: order metadata, time slots, arrival/completion times, delivery agent info, map visualization
Map shows: target location, DA arrival location, cancellation location with distance calculations
Link to view associated issues
Export:

Export to Excel with progress indicator (counting -> fetching -> generating phases)
Exports respect all active filters including delivery agent filter
5.3 Issues (/issues)
Purpose: Browse and manage all reported delivery issues.

Filters:

Date From / Date To
Status (open, waiting_response, resolved, pending_reopen)
Company
Cancellation Reason
Resolved By
Text search
Clear all filters
Issue List:

Paginated with server-side pagination
Shows: order ID, reason, status, company, timestamps
Export:

Export to Excel with progress indicator
5.4 Issue Detail (/issues/:id)
Purpose: Full investigation view for a single issue.

Header Section:

Back button
Live timer (counts elapsed time since creation or reopen; stops on resolution)
Status dropdown (Open / Waiting Response / Resolved)
Status badge
Information Banners:

Client first viewed at (who and when)
Supervisor first reviewed at (who and when)
Resolution time card (shows duration, from/to timestamps, resolved by whom)
Reopened info (if applicable, shows reopen timestamp and requester)
Order Details Card:

Order ID, client name, address, company, warehouse, order status
Delivery Agent Card:

Agent name, phone number
Mute/unmute toggle (prevents agent notifications)
Validation badges: Geofence Valid/Invalid, Arrival Time Valid/Invalid, Issue Create Time Valid/Invalid (each with tooltip)
Issue Details Card:

Cancellation reason (language-aware)
Created timestamp, arrival time, time slot, wait time (ongoing indicator if unresolved)
Distance to merchant (Haversine formula calculation)
Notes field
AI refined text (if available)
Initial voice note with audio player
Evidence Gallery:

Initial evidence images (from issue submission)
Chat images (from conversation)
Lightbox viewer for full-size viewing
Chat System:

Full chat history with messages from client, driver, and supervisor
Each message shows: responder avatar (color-coded by type), name, type label, timestamp, action type badge
Supports: text messages, image attachments (with preview), voice notes (with audio player)
Supervisor can send messages with optional image attachments
Action types: custom_message, client_not_responding, approved_cancel, driver_message, ai_response, retry, supervisor_message, mute_agent, etc.
Cancellation Details:

Shown only for cancelled orders
Cancelled by (rider/admin), raw cancellation reason
Map (Leaflet):

Shows up to 4 location markers: merchant (blue), DA arrival (yellow), issue submitted (red), cancellation (dark red)
Dashed polyline connecting locations
Legend with N/A indicators for missing locations
Distance calculation (DA to merchant)
Activity Timeline:

Collapsible section
Shows order activity history (status changes, issue events, reopen requests)
5.5 Companies (/companies) -- Owner Only
Purpose: Company-level analytics and performance tracking.

Filters:

Company selector
Date range (From / To)
Clear filters
KPI Sections:

Order Overview (4 cards):

Total Orders, Completed, Cancelled, Fulfillment Rate %
Cancellation Responsibility (3 cards):

Client/Supplier Fault (green, not our responsibility)
Our Company Fault (red, our responsibility)
Unknown/Other (amber, needs review)
Issue Analysis (4 cards):

Orders with Issues (with link to issues page)
Open/Pending issues
Client Approved resolutions (green)
Without Client Approval (red -- driver + supervisor + timeout combined)
Resolution Breakdown (4 cards):

By Client, By Driver, By Supervisor, By Timeout
Alerts:

Reason Mismatch alert (when cancellation reasons don't match)
Company Performance Table:

Per-company breakdown with all metrics
Sortable columns
"View Issues" button per company (navigates to issues page with company filter)
Cancellation Reasons Chart:

Visual breakdown of cancellation reasons
5.6 Agents (/agents)
Purpose: Delivery agent performance monitoring.

Summary Cards:

Total Agents (with issues)
Total Issues / Resolved count
Average Geofence Valid %
Average Time Valid %
Search:

Filter agents by name or phone number
Agent KPI Table:

Agent name, phone
Total issues, open issues, resolved issues
Geofence valid % (color-coded badge)
Time valid % (color-coded badge)
Average resolution time
5.7 Reopen Requests (/reopen-requests)
Purpose: Review and manage requests to reopen resolved issues.

Tabs:

Pending (with count badge), Approved, Rejected, All
Request Cards:

Order ID (with link to issue detail)
Client name and company
Requested by (user name)
Submission timestamp
Reason text
Rejection reason (if rejected)
Reviewer info and timestamp
Actions (Pending tab only):

Approve button
Reject button (opens dialog with optional reason textarea)
5.8 Users Management (/users) -- Owner Only
Purpose: Manage platform users.

Two User Types (tabs):

Client Users:

Users associated with companies
Fields: email, full name, company, active status
Company filter dropdown
CRUD operations: create, edit, delete, toggle active
CRM Users (Dashboard Users):

Internal platform users (supervisors, owners)
Fields: email, full name, role, active status
CRUD operations: create, edit, delete, toggle active
Cannot delete yourself
Stats Cards:

Total users, active count, inactive count
Search:

Filter by email, name, company name, or role
Dialogs:

User form dialog (create/edit)
Delete confirmation dialog
6. Data Model (Key Entities)
Entity	Description
companies	Client companies
warehouses	Warehouse locations
orders	Delivery orders with status, times, locations
tours	Delivery tours linking orders to agents
delivery_agents	Driver/agent profiles
issue_reports	Reported delivery issues
issue_responses	Chat messages on issues
issue_evidence	Photo/file evidence
cancellation_reasons	Reason codes for cancellations
reopen_requests	Requests to reopen resolved issues
order_activities	Activity/audit log per order
dashboard_users	CRM/admin users
client_users	Client-side users
Key Relationships:

Orders -> Companies (via company_id)
Orders -> Warehouses (via warehouse_id)
Orders -> Tours (via tour_id)
Tours -> Delivery Agents (via delivery_agent_id)
Issue Reports -> Orders (via order_id)
Issue Reports -> Delivery Agents (via delivery_agent_id)
Issue Reports -> Cancellation Reasons (via reason_id)
7. Analytics (Mixpanel)
Comprehensive event tracking across the entire application:

Authentication: Login page viewed, login attempted/success/failed, logout
Navigation: Sidebar clicks, language changes, sidebar toggle
Dashboard: Page view, date range changes
Issues: Page view, filter changes, search, row click, detail view, status change, chat message sent, agent mute toggle, evidence view, voice note play, timeline toggle
Orders: Page view, filter changes, search, row click, modal open/close, view issue click
Companies: Page view, filter changes, view issues click, chart segment click
Reopen Requests: Page view, tab changes, approve/reject actions, view issue click
Agents: Page view, search
Users: Page view, tab changes, CRUD operations, search, toggle active
Common: Pagination, filter clear, back button, dialog open/close, map view, audio play/pause, lightbox open/close
All events are enriched with: user context (id, email, role, company), page path, timestamp, language.

8. Utilities
Haversine Distance: Calculates distance between GPS coordinates (used for geofence validation and map display)
Duration Formatting: Converts minutes to human-readable duration strings
Export (Excel): Paginated data fetching with progress tracking, generates .xlsx files via client-side library
9. Storage (Supabase)
voice-recordings bucket: Voice note audio files from issues and chat
evidence bucket: Photo evidence and chat images
10. Non-Functional Requirements
Responsive: Mobile-aware with collapsible sidebar
RTL Support: Full right-to-left layout for Arabic
Performance: Server-side pagination, stale time caching (30s), debounced search
Data Freshness: React Query with configurable stale times
Session Recording: Mixpanel session recording at 100%
