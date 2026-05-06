# Illa Sales — Field Sales Agent Platform

## Product Overview

**Illa Sales** (إلى للمبيعات) is a production-grade Progressive Web Application (PWA) built for FMCG (Fast-Moving Consumer Goods) field sales operations in Egypt. It enables sales agents to manage their daily merchant visits, place product orders, track performance KPIs, and onboard new merchants — all from a mobile device while working in the field.

The platform consists of two integrated systems:

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Sales Agent PWA** (this repo) | React 18 + TypeScript + Vite | Mobile-first field agent app |
| **Distribution Sales Backend** | Ruby on Rails 8 + PostgreSQL | Supervisor portal & API server |
| **Edge Functions** | Supabase Functions (Deno) | Serverless business logic & auth |

---

## The Problem

FMCG distribution companies in Egypt face several operational challenges:

1. **No visibility into field operations** — Supervisors cannot track which merchants were visited, what orders were placed, or whether agents are at the right location.
2. **Paper-based order processing** — Orders are taken on paper, prone to errors, and delayed in reaching the warehouse.
3. **No geofencing or location verification** — Agents claim visits without proof of presence, leading to fraudulent reporting.
4. **Static pricing** — No ability to manage tiered pricing across regions (governorates) and merchant types.
5. **No route management** — Agents have no structured daily plan; merchants are visited randomly or skipped entirely.
6. **Zero analytics** — No real-time KPIs on visit completion rates, strike rates, or revenue per agent.
7. **Merchant onboarding friction** — Adding new merchants requires manual paperwork and office visits.

---

## Solution

Illa Sales digitizes the entire pre-sell and cash-van distribution workflow into a single mobile-first PWA that works offline-capable, bilingual (Arabic/English), and enforces location-verified visits through geofencing.

### Key Differentiators

- **Geofence-verified visits** — Agents must be within 100m of a merchant's GPS coordinates to start a visit, preventing fraudulent location claims.
- **Dual sales modes** — Pre-sell (planned route visits) and Cash Van (inventory-on-truck, sell-from-stock) in one app.
- **Real-time KPI dashboard** — Visit completion rate, strike rate, daily visit count, and total sales value — updated live.
- **Locus integration** — Delivery tracking via Locus dispatch API with bidirectional order sync.
- **Multi-tier pricing** — 4 price tiers (Retail, Wholesale, Big Wholesale, Large Grocery) with governorate-specific price overrides and fallback logic.
- **Bilingual RTL support** — Full Arabic and English with automatic RTL/LTR layout switching.

---

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Sales Agent PWA                        │
│         (React 18 + TypeScript + Tailwind CSS)           │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Dashboard│  │  Route   │  │  Order   │  │ Cashvan │ │
│  │   + KPIs │  │ Merchant │  │  Cart    │  │  Mode   │ │
│  │  Cards   │  │  Cards   │  │ Checkout │  │         │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Geofence │  │ Location │  │  Visit   │  │ i18n    │ │
│  │  Engine  │  │  Gate    │  │ Tracking │  │ AR/EN   │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ Mixpanel │  │   PWA    │  │  React Query Cache   │  │
│  │Analytics │  │ Service  │  │  (TanStack Query)    │  │
│  └──────────┘  └──────────┘  └──────────────────────┘  │
└───────────────────────┬─────────────────────────────────┘
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
┌───────────────────┐   ┌───────────────────────┐
│  Supabase         │   │  Rails API Backend     │
│  (PostgreSQL +    │   │  (Distribution Sales)  │
│   Edge Functions  │   │                        │
│   + Auth + RLS)   │   │  V1: Supervisor Portal │
│                   │   │  V2: Mobile App API    │
│  • agent-login    │   │                        │
│  • create-visit   │   │  • Plan Management     │
│  • list-visits    │   │  • Product Catalog     │
│  • merchant-crud  │   │  • Order Processing    │
│  • no-order-reason│   │  • Pricing Engine      │
│  • sync-locus-*   │   │  • Locus Integration   │
│  • admin-auth     │   │  • JWT Auth            │
│  • tier-approval  │   │  • Multi-tier Pricing  │
│  • fetch-da-trip  │   │  • Governorate Pricing │
└───────────────────┘   └───────────────────────┘
            │                       │
            └───────────┬───────────┘
                        ▼
              ┌─────────────────┐
              │  Locus API      │
              │  (Delivery      │
              │   Dispatch)     │
              └─────────────────┘
```

### Frontend Architecture

```
src/
├── App.tsx                    # Root: routing, providers, error boundary
├── main.tsx                   # Entry: React root, Mixpanel init, PWA register
├── i18n.ts                    # i18next config (Arabic + English)
│
├── pages/                     # Route-level page components
│   ├── Index.tsx              # Landing: login gate → Dashboard
│   ├── VendorSelection.tsx    # Product browsing by vendor/category
│   ├── ProductSelectionWithVisit.tsx  # Product cart with visit context
│   ├── MerchantSelector.tsx   # Merchant search/selection
│   ├── CreateMerchant.tsx     # Multi-step merchant onboarding
│   ├── OrderHistory.tsx       # Historical orders with search/filter
│   ├── CashvanProductSelection.tsx   # Cash van product browsing
│   ├── CashvanOrderHistory.tsx       # Cash van order history
│   ├── ForceUpdate.tsx        # Recovery page for stale cached versions
│   └── NotFound.tsx           # 404 page
│
├── components/                # Reusable UI components
│   ├── Dashboard.tsx          # Main dashboard (700+ lines of business logic)
│   ├── AgentLogin.tsx         # Login form with agent code + password
│   ├── VisitCard.tsx          # Visit timeline entry card
│   ├── VisitTimeline.tsx      # Today's visits timeline
│   ├── CartSummary.tsx        # Order summary with totals
│   ├── PaymentMethodModal.tsx # Cash/Credit selection with collection date
│   ├── NoOrderReasonSheet.tsx # Bottom sheet for visit-without-order reasons
│   ├── LocationGate.tsx       # Location permission gate wrapper
│   ├── LocationPermissionModal.tsx # GPS permission request UI
│   ├── CelebrationModal.tsx   # Success animation on order placement
│   ├── ProductCard.tsx        # Product display card
│   ├── ProductGroup.tsx       # Grouped product list by category
│   ├── QuantityStepper.tsx    # +/- quantity input
│   ├── MobileHeader.tsx       # App header with back navigation
│   ├── UpdatePrompt.tsx       # PWA update notification banner
│   ├── ErrorBoundary.tsx      # React error boundary with recovery
│   ├── dashboard/             # Dashboard sub-components
│   │   ├── ModeToggle.tsx     # Pre-sell / Cash Van mode switcher
│   │   ├── KPICards.tsx       # KPI metric cards (visits, orders, sales, rate)
│   │   ├── RouteMerchantCard.tsx  # Merchant card with visit status
│   │   ├── VirtualizedMerchantList.tsx  # TanStack Virtual for 500+ merchants
│   │   ├── MerchantDetailSheet.tsx  # Merchant detail bottom sheet
│   │   ├── VisitSetupSheet.tsx      # Multi-step visit creation flow
│   │   ├── AdHocOrderButton.tsx     # Out-of-route order FAB
│   │   └── CashvanDashboard.tsx     # Cash van mode dashboard
│   └── cashvan/               # Cash Van specific components
│       ├── CashvanCheckout.tsx       # Cash van order checkout
│       ├── CashvanMerchantSelector.tsx  # Merchant selection for cash van
│       ├── PlanProductCard.tsx       # Product card from delivery plan
│       ├── HybridQuantityInput.tsx   # Advanced quantity input
│       └── CashvanLoginModal.tsx     # Separate Rails API auth for cash van
│
├── contexts/                  # React Context providers
│   ├── AuthContext.tsx         # Agent auth state + localStorage persistence
│   ├── RailsApiAuthContext.tsx # Cash van Rails API JWT auth + token refresh
│   ├── CartContext.tsx         # Pre-sell cart state (add/remove/update/clear)
│   ├── CashvanCartContext.tsx  # Cash van cart state (separate from pre-sell)
│   ├── LocationContext.tsx     # GPS position tracking state
│   └── VisitContext.tsx        # Visit session state management
│
├── hooks/                     # Custom React hooks
│   ├── useAgentRoute.ts       # Fetch agent routes, merchants, visits, KPIs
│   ├── useVisits.ts           # Create/complete visits via Supabase
│   ├── useOrderSubmission.ts  # Submit pre-sell orders to Supabase
│   ├── useAgentLocation.ts    # Real-time GPS watch with 50m jitter filter
│   ├── useCashvanPlan.ts      # Fetch cash van delivery plan from Rails API
│   ├── useCashvanProducts.ts  # Fetch plan products with pricing
│   ├── useCashvanOrderHistory.ts  # Cash van order history from Rails API
│   ├── useCashvanOrderSubmission.ts # Submit cash van orders to Rails API
│   ├── useMerchantVisitHistory.ts  # Merchant visit history lookup
│   ├── useLocationPermission.ts    # Location permission state machine
│   ├── usePWADetection.ts     # Detect PWA install/standalone mode
│   └── useSoundEffects.ts    # Audio feedback for success/error events
│
├── lib/                       # Utility libraries
│   ├── railsApiClient.ts      # Axios-like client for Rails API with JWT refresh
│   ├── geofence.ts            # Distance calculation, geofence radius, formatting
│   ├── geolocation.ts         # Browser Geolocation API wrapper
│   ├── mixpanel.ts            # Mixpanel analytics wrapper with safeTrack
│   ├── priceUtils.ts          # Price formatting, tier resolution
│   ├── version.ts             # App version for update detection
│   └── utils.ts               # Tailwind merge, general utilities
│
├── types/
│   └── cashvan.ts             # TypeScript interfaces for cash van domain
│
├── utils/
│   └── kpiCalculations.ts     # KPI math: completion rate, strike rate, week-based tracking
│
└── integrations/
    └── supabase/
        └── client.ts          # Supabase client initialization
```

### Backend Architecture (Rails API)

```
distribution-sales/            # Ruby on Rails 8 API-only backend
├── app/
│   ├── controllers/
│   │   ├── api/v1/            # Supervisor Portal endpoints
│   │   └── api/v2/            # Mobile App endpoints
│   ├── models/                # 36 database models
│   └── serializers/           # V1 & V2 JSON serializers
├── docs/                      # Architecture documentation
│   ├── API.md                 # API endpoint reference
│   ├── DATABASE_ERD.md        # Entity relationship diagram
│   └── SECURITY_POLICY.md     # Security audit documentation
└── config/                    # Environment configs
```

### Database Schema (36 Tables)

Core entities:

| Table | Purpose |
|-------|---------|
| `agents` | Sales agents with credentials and status |
| `merchants` | Customer businesses with GPS coordinates and pricing tiers |
| `routes` | Delivery routes grouping merchants geographically |
| `agent_routes` | Many-to-many: agents assigned to routes |
| `merchant_routes` | Many-to-many: merchants belonging to routes |
| `visits` | Agent visit records with GPS location, type, and timestamps |
| `no_order_reasons` | Configurable reasons for visits without orders |
| `products` | Product catalog with SKU codes |
| `product_prices` | Multi-tier pricing (retail, wholesale, big_wholesale, large_grocery) |
| `plans` | Sales plans assigned to agents with products and quantities |
| `orders` | Customer orders linking merchants to visits |
| `sales_orders` | Pre-sell orders with payment tracking |
| `merchant_types` | Classification of merchant business types |
| `local_admins` | Admin users for approval workflows |
| `merchant_visit_days` | Scheduled visit days per merchant |

---

## Feature Deep Dive

### 1. Authentication System

**Dual authentication architecture** supporting two operational modes:

| Mode | Auth Provider | Credentials | Storage |
|------|-------------|------------|---------|
| Pre-sell | Supabase Edge Function | Agent code + password | localStorage |
| Cash Van | Rails API (JWT) | Phone number + password | localStorage + token refresh |

**Login flow:**
1. Agent enters agent code (e.g., `ILLA_001`) and password
2. Supabase Edge Function `agent-login` validates credentials against `agents` table
3. Agent status checked (must be `active = 1`)
4. Session persisted to localStorage with agent data and route IDs
5. Mixpanel `identify()` called for analytics tracking
6. On logout, `mixpanel.reset()` clears the session identity

**Cash Van mode** uses a separate JWT authentication flow via Rails API with automatic token refresh:
- Phone number normalized to Egyptian format (201XXXXXXXXX)
- Access token + refresh token stored separately
- Auto-redirect to pre-sell mode on token expiry

### 2. Dashboard & Route Management

The **Dashboard** is the central hub for daily operations. It displays:

**KPI Cards (Real-time):**
| KPI | Calculation |
|-----|------------|
| Total Visits | Unique merchants visited today |
| Total Orders | Orders placed today |
| Total Sales | Revenue from today's orders (EGP) |
| Strike Rate | (Visits with orders / Total visits) × 100 |
| Completion Rate | (Covered weeks / Merchants count) × 100 |

**Monthly Journey Plan:**
- Lists all merchants assigned to agent's routes
- Each merchant card shows: name, sign name, visit status, distance, phone, address
- Merchants auto-sorted by GPS distance (live, with 50m jitter filter to prevent re-sorting on tiny GPS movements)
- Filter chips: All, Not Visited, Visited, Completed
- Search by name, code, or route

**Performance optimizations for 500+ merchants:**
- `VirtualizedMerchantList` using TanStack Virtual — only renders visible cards
- Pre-computed lowercase search index for O(1) text matching
- Single-pass filter + group (filtered first, then grouped by route)
- Chunked PostgREST queries to bypass URL length limits (200 UUIDs per chunk)
- Paginated row fetching to bypass PostgREST 1000-row cap

### 3. Geofencing & Location Verification

**How it works:**
1. Browser Geolocation API watches agent's position in real-time (`watchPosition`)
2. When agent taps "Start Visit", system calculates distance to merchant's stored GPS coordinates
3. If distance > 100m radius, visit is **blocked** with an error toast
4. If merchant has no stored coordinates, visit proceeds with a warning
5. Agent's GPS coordinates are recorded with every visit for audit trail

**Location permission flow:**
- `LocationGate` wraps the entire app — location is mandatory
- `LocationPermissionModal` shows platform-specific instructions (Chrome mobile vs PWA)
- GPS status indicator in header: green (locked), yellow (acquiring), red (error)
- Pull-to-refresh on dashboard refreshes route data

**Distance calculations:**
- Uses Haversine formula via `calculateDistance()` for accurate geodesic distance
- Jitter filter: only updates sort position when agent moves >50m
- Distance displayed in human-readable format (meters or km)

### 4. Visit Management

**Visit types:**
| Type | Flow |
|------|------|
| **With Order** | Geofence check → Payment method → Product selection → Cart → Submit |
| **Without Order** | Geofence check → Reason selection → Visit logged |

**Multi-step visit creation flow (`VisitSetupSheet`):**
1. **Visit Type Selection** — "With Order" or "Without Order"
2. **Revisit Warning** (conditional) — If merchant already visited this month, warns agent with count of unvisited merchants
3. **Payment Method** — Cash or Credit (with collection date picker for credit)
4. **Geofence Check** — GPS verification against merchant coordinates
5. **Navigation** — Redirects to product selection or reason sheet

**Duplicate visit prevention:** 5-minute cooldown between visits to the same merchant.

**Visit recording includes:**
- Agent ID, Merchant ID, Visit date/time
- GPS coordinates (latitude, longitude)
- Visit type (with_order / without_order)
- No-order reason (if applicable)
- Cash van flag (if from cash van mode)

### 5. Product Selection & Cart Management

**Two separate cart systems** (pre-sell and cash van have independent carts):

| Feature | Pre-sell Cart | Cash Van Cart |
|---------|-------------|--------------|
| Context | `CartContext` | `CashvanCartContext` |
| Source | Supabase products table | Rails API plan products |
| Pricing | Region-based tier pricing | Plan-specific pricing |
| Submission | Supabase Edge Function | Rails API V2 endpoint |

**Cart features:**
- Add/remove/update product quantities with animated quantity stepper
- Per-product unit price display with tier-based pricing
- Running subtotal calculation
- Cart badge showing item count
- Clear cart on merchant change or logout
- Stock validation against plan quantities (cash van mode)

**Price resolution algorithm:**
1. Look for product_id + price_tier + governorate_id (region-specific)
2. If not found → fall back to product_id + price_tier (global)
3. 4 tiers: Retail, Wholesale, Big Wholesale, Large Grocery

### 6. Order Submission

**Pre-sell order submission (`useOrderSubmission`):**
1. Validates cart has items and merchant is selected
2. Creates visit record via `create-visit` Edge Function
3. Inserts order with line items to `sales_orders` and `sales_order_items`
4. Records payment method and collection date
5. Tracks GPS location with the order
6. Triggers celebration modal on success
7. Sends Mixpanel `order_placed` event with full order details

**Cash van order submission (`useCashvanOrderSubmission`):**
1. Submits to Rails API V2 endpoint
2. JWT-authenticated request with auto-refresh
3. Updates plan product sold quantities
4. Returns updated plan with remaining quantities

### 7. Merchant Onboarding

**Multi-step merchant creation form** with 3 sections:

**Step 1: Basic Information**
- Merchant name (required)
- Sign name / shop sign (required)
- Merchant type (select from predefined types)
- Auto-populated agent name

**Step 2: Contact & Location**
- Primary phone number (validated Egyptian mobile format: 01XXXXXXXXX)
- Secondary phone (optional, same validation)
- Governorate (auto-detected from GPS)
- Route plan (auto-assigned based on governorate)
- Detailed address (auto-filled from reverse geocoding, editable)

**Step 3: Business Details**
- Price tier selection (Retail default, with upgrade request option)
- Visit days (multi-select checkbox grid)
- Tier upgrade request workflow (pending supervisor approval)

**Smart location detection:**
- GPS coordinates auto-captured on form open
- Governorate auto-detected from coordinates
- Route auto-assigned based on governorate mapping
- Address auto-populated from GPS (editable)

**Approval workflow:**
- New merchants default to Retail pricing tier
- Agent can request a higher tier (Wholesale, etc.)
- Request triggers `notify-tier-approval` email to supervisor
- Supervisor approves/rejects via admin dashboard
- Agent notified of result

### 8. Order History

**Comprehensive order browsing with:**
- Search by client name or code
- Date range filtering (from/to)
- Total summary stats: orders, pieces, clients, value
- Per-order details: products, quantities, prices, location
- Encouraging personalized messages (5 rotating Egyptian colloquial phrases)
- Virtualized list for performance with large datasets
- "Load more" pagination

### 9. Cash Van Mode

**Purpose:** Enables agents selling from inventory on their truck (van-based distribution) rather than pre-sell (order today, deliver later).

**Switching between modes:**
- `ModeToggle` component in dashboard header
- Persists selection to localStorage
- Each mode has its own dashboard, cart, and order flow

**Cash Van specific features:**
- Fetches current delivery plan from Rails API
- Shows plan products with remaining quantities
- Products grouped by vendor/category
- Real-time quantity tracking (decremented on order)
- Separate order history and submission pipeline
- JWT authentication against Rails API

### 10. Out-of-Route (Ad-hoc) Orders

**AdHocOrderButton** (floating action button) enables:
- Searching any merchant in the system (not just assigned route)
- Placing orders without geofence restrictions
- Useful for agents receiving calls from merchants outside their route
- All ad-hoc visits flagged with `is_ad_hoc = true` for analytics

### 11. Analytics (Mixpanel)

**22+ tracked events** covering the full user journey:

| Category | Events |
|----------|--------|
| Authentication | `agent_sign_in`, `agent_login_failed`, `logout` |
| Navigation | `view_order_history`, `add_visit_clicked` |
| Dashboard | `merchant_search_performed`, `merchant_filter_changed`, `dashboard_pull_to_refresh_triggered`, `merchant_detail_sheet_opened` |
| Visits | `visit_setup_sheet_opened`, `visit_type_selected`, `geofence_check_failed`, `visit_without_order_completed`, `no_order_reason_selected` |
| Cart | `cart_item_added`, `cart_item_quantity_changed`, `cart_item_removed`, `cart_cleared` |
| Orders | `payment_method_selected`, `continue_to_products`, `order_placed`, `order_submission_failed` |
| Merchant | `merchant_creation_started`, `merchant_created`, `merchant_creation_failed` |
| App | `app_error_boundary_triggered`, `app_update_available_shown`, `app_update_accepted` |
| Ad-hoc | `ad_hoc_search_opened`, `ad_hoc_search_query_typed`, `merchant_selected` |

**Suggested analytics funnels:**
1. **Login → Order**: sign_in → merchant_detail_sheet_opened → visit_setup_sheet_opened → visit_type_selected (with_order) → payment_method_selected → order_placed
2. **Ad-hoc order**: ad_hoc_search_opened → ad_hoc_search_query_typed → merchant_selected → payment_method_selected → continue_to_products → order_placed
3. **Visit without order**: visit_setup_sheet_opened → visit_type_selected (without_order) → no_order_reason_selected → visit_without_order_completed
4. **New merchant**: merchant_creation_started → merchant_created (or merchant_creation_failed)

### 12. Internationalization (i18n)

**Full bilingual support:**
- **Arabic** (primary, RTL) — includes Egyptian colloquial phrases for greetings and encouragement
- **English** (LTR)
- Auto-detects direction (`dir="rtl"` or `dir="ltr"`) based on language
- RTL-specific CSS via `tailwindcss-rtl` plugin
- 200+ translation keys covering all UI elements

**Notable localization details:**
- Egyptian colloquial Arabic for casual/approachable tone ("يا جدع", "يا معلم")
- Time-based greetings: Good morning/afternoon/evening with agent's first name
- Currency: EGP (Egyptian Pound) / جنيه
- Price tiers translated: Retail (قطاعي), Wholesale (جملة), Big Wholesale (جملة كبيرة), Large Grocery (قطاعي كبير)

### 13. PWA Features

| Feature | Implementation |
|---------|---------------|
| Installable | Web App Manifest with standalone display |
| App icon | 192x192 and 512x512 PNG icons |
| Theme | Brand teal (#1f7a7a) with white background |
| Orientation | Portrait locked |
| Update flow | `UpdatePrompt` banner with service worker update detection |
| Force update | Recovery route `/force-update` outside all providers for emergency cache bust |
| Pull-to-refresh | Custom touch handler with resistance curve (70px threshold) |
| Offline-first | Service worker caching via `vite-plugin-pwa` |

### 14. Locus Delivery Integration

**Bidirectional order synchronization with Locus dispatch platform:**

- **Outbound:** Orders synced to Locus for delivery assignment
- **Inbound:** `sync-locus-orders` Edge Function polls Locus API for status updates
- **Status mapping:** Locus statuses mapped to local order statuses (delivered, partial, cancelled)
- **Batch processing:** Orders processed 5 at a time with error tracking
- **Trip tracking:** `fetch-da-trip` retrieves delivery associate's current trip and linked orders
- **Phone normalization:** Egyptian phone number formats handled (with/without country code)

### 15. Security

| Layer | Measure |
|-------|---------|
| **Database** | Supabase Row Level Security (RLS) on all tables |
| **Authentication** | Password validation + active status check |
| **Edge Functions** | JWT token validation for admin operations |
| **Rails API** | JWT with refresh tokens, 24-hour expiry |
| **Input validation** | Zod schemas + server-side validation |
| **XSS** | React built-in escaping, no dangerouslySetInnerHTML |
| **Fraud prevention** | Geofence verification, duplicate visit cooldown |
| **Analytics safety** | `safeTrack()` wrapper — analytics never crashes the app |

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3 | UI framework |
| TypeScript | 5.5 | Type safety |
| Vite | 5.4 | Build tool with SWC |
| Tailwind CSS | 3.4 | Utility-first styling |
| shadcn/ui | Latest | Component library (Radix UI primitives) |
| TanStack React Query | 5.56 | Server state management & caching |
| TanStack Virtual | 3.13 | Virtualized lists for 500+ merchants |
| React Router DOM | 6.26 | Client-side routing |
| React Hook Form + Zod | 7.53 / 3.23 | Form validation |
| i18next | 23.12 | Internationalization |
| Recharts | 2.12 | Data visualization |
| Mixpanel Browser | 2.72 | Product analytics |
| date-fns | 3.6 | Date formatting & manipulation |
| vite-plugin-pwa | 1.0 | PWA service worker |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Ruby | 3.3 | Server language |
| Ruby on Rails | 8.0 | API framework |
| PostgreSQL | 16+ | Relational database |
| PostGIS | — | Geographic queries |
| Redis | — | Caching & Sidekiq |
| Sidekiq | — | Background job processing |
| JWT | — | Token authentication |
| Shrine + S3 | — | File storage |
| Sentry | — | Error tracking |

### Infrastructure

| Service | Purpose |
|---------|---------|
| Supabase | Database, Edge Functions, Auth, RLS |
| Lovable | Initial project scaffolding |
| Mixpanel (EU) | Product analytics |
| Locus | Delivery dispatch |
| Resend | Email notifications (tier approvals) |
| GitHub Actions | CI/CD |

---

## Routing Map

| Route | Page | Auth Required | Description |
|-------|------|:------------:|-------------|
| `/` | Index | Yes | Login gate → Dashboard |
| `/orders` | OrderHistory | Yes | Pre-sell order history |
| `/vendor-selection` | VendorSelection | Yes | Product browsing by vendor |
| `/select-products` | ProductSelectionWithVisit | Yes | Product cart with visit |
| `/merchant-selector` | MerchantSelector | Yes | Merchant search/selection |
| `/create-merchant` | CreateMerchant | Yes | New merchant onboarding |
| `/cashvan/select-products` | CashvanProductSelection | Yes* | Cash van product browsing |
| `/cashvan/orders` | CashvanOrderHistory | Yes* | Cash van order history |
| `/cashvan/merchants` | CashvanMerchantSelector | Yes* | Cash van merchant selection |
| `/force-update` | ForceUpdate | No | Recovery page (outside providers) |

\* Cash Van routes require additional Rails API JWT authentication.

---

## Supabase Edge Functions

| Function | Method | Purpose |
|----------|--------|---------|
| `agent-login` | POST | Authenticate agent by code + password |
| `create-visit` | POST | Record a new merchant visit with GPS data |
| `list-visits` | POST | Fetch today's visits for an agent |
| `merchant-crud` | POST | Create/update/delete merchants (admin) |
| `merchant-approvals` | POST | Approve/reject merchant tier upgrades (admin) |
| `no-order-reasons` | GET | List active reasons for visits without orders |
| `notify-tier-approval` | POST | Send tier approval email via Resend |
| `sync-locus-orders` | POST | Batch sync order statuses from Locus API |
| `sync-locus-order-test` | POST | Test single order sync with Locus |
| `fetch-da-trip` | POST | Fetch delivery associate trip data |
| `admin-auth` | POST | Authenticate admin users, issue JWT |

---

## User Roles & Permissions

| Role | Capabilities |
|------|-------------|
| **Sales Agent** | Login, view route, start visits (geofenced), place orders, create merchants, view own order history, request tier upgrades |
| **Supervisor** | Manage agents, create plans, assign routes, approve tier requests, manage products and pricing, view all orders and analytics |
| **Admin** | Full CRUD on merchants, approve/reject tier upgrades, system configuration |

---

## Data Flow: Order Lifecycle

```
┌──────────────────────────────────────────────────────────────┐
│                     ORDER LIFECYCLE                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Agent opens Dashboard                                    │
│     ↓                                                        │
│  2. Selects merchant from route list                         │
│     ↓                                                        │
│  3. Taps "Start Visit"                                       │
│     ↓                                                        │
│  4. Choose visit type: With Order / Without Order            │
│     ↓                                                        │
│  5a. [With Order]                                            │
│      → Geofence check (must be ≤100m from merchant)          │
│      → Select payment method (Cash / Credit + date)          │
│      → Browse products by vendor/category                    │
│      → Add products to cart with quantities                  │
│      → Review cart summary                                   │
│      → Submit order                                          │
│      → Create visit record (type: with_order)                │
│      → Insert order + line items                             │
│      → Celebration modal                                     │
│      → Mixpanel: order_placed event                          │
│      → Sync to Locus (if configured)                         │
│                                                              │
│  5b. [Without Order]                                         │
│      → Geofence check                                        │
│      → Select reason from dropdown                           │
│      → Create visit record (type: without_order)             │
│      → Attach reason                                         │
│      → Mixpanel: visit_without_order_completed event          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Performance Considerations

| Challenge | Solution |
|-----------|----------|
| 500+ merchants per route | TanStack Virtual for virtualized rendering |
| PostgREST 1000-row cap | Custom `fetchAllRows` pagination helper |
| PostgREST URL length limit | Chunked `IN(...)` queries (200 UUIDs per chunk) |
| GPS jitter causing re-sorts | 50m movement threshold before updating sort |
| Search performance | Pre-computed lowercase search index (Map-based) |
| Slow mobile networks | React Query caching (60s stale time, 10min garbage collection) |
| Large translation files | Lazy-loaded via i18next-http-backend |
| PWA cache staleness | Force update recovery route outside provider tree |

---

## Project Metrics

| Metric | Value |
|--------|-------|
| Frontend components | 40+ React components |
| Custom hooks | 12 specialized hooks |
| Context providers | 6 state management contexts |
| Supabase Edge Functions | 11 serverless functions |
| Database tables | 36 tables with RLS |
| Translation keys | 200+ per language |
| Analytics events | 22+ tracked events |
| API endpoints | 30+ REST endpoints (V1 + V2) |
| Price tiers | 4 with governorate overrides |

---

## Future Roadmap

- Real-time order tracking with live driver GPS
- AI-powered route optimization
- Photo capture during visits (shelf audits)
- Gamification with agent leaderboards
- Offline-first with IndexedDB sync
- Push notifications for order status updates
- Invoice generation and PDF export
- Multi-language expansion beyond Arabic/English

---

## Credits

**Built by:** ILLA Engineering Team
**Tech Lead:** Eng. Antoon (Tony)
**Stack:** React 18 · TypeScript · Supabase · Rails 8 · PostgreSQL · Locus
**Region:** Egypt (FMCG Distribution)
