# ILLA Telesales CRM — Complete Project Documentation

> Mobile-first, Arabic-language (RTL) telesales CRM for Egyptian FMCG distribution.
> Agents manage merchant relationships via phone, browse product catalogs, place orders, and record no-order reasons. Supervisors manage agents and view performance analytics.

---

## Table of Contents

1. [Business Overview](#1-business-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [User Roles & Access](#4-user-roles--access)
5. [Feature Catalog](#5-feature-catalog)
   - 5.1 [Authentication](#51-authentication)
   - 5.2 [Agent Dashboard](#52-agent-dashboard)
   - 5.3 [Merchant Detail](#53-merchant-detail)
   - 5.4 [Order Placement & Editing](#54-order-placement--editing)
   - 5.5 [No-Order / Refusal Recording](#55-no-order--refusal-recording)
   - 5.6 [Invalid Phone Flagging](#56-invalid-phone-flagging)
   - 5.7 [Supervisor Panel — Agent Management](#57-supervisor-panel--agent-management)
   - 5.8 [Supervisor Panel — Agent Profile & Call Logs](#58-supervisor-panel--agent-profile--call-logs)
   - 5.9 [Supervisor Panel — Flagged Merchants](#59-supervisor-panel--flagged-merchants)
   - 5.10 [Analytics & Tracking](#510-analytics--tracking)
   - 5.11 [Internationalization (i18n)](#511-internationalization-i18n)
6. [Database Schema](#6-database-schema)
7. [API Reference](#7-api-reference)
8. [Edge Functions](#8-edge-functions)
9. [State Management](#9-state-management)
10. [Security Considerations](#10-security-considerations)
11. [Known Gaps & Technical Debt](#11-known-gaps--technical-debt)
12. [Project Commands](#12-project-commands)
13. [File Map](#13-file-map)

---

## 1. Business Overview

### Problem Statement

FMCG distribution companies in Egypt employ telesales agents who call merchants daily to take product orders. Without a dedicated system, agents rely on spreadsheets or paper, leading to:

- Lost orders and misrecorded merchant refusals
- No visibility into which merchants need follow-up
- No accountability for agent call activity
- Inability to track why merchants refuse orders
- Stale merchant phone data with no feedback loop

### Business Impact

ILLA Telesales CRM solves these problems by providing:

| Capability | Business Value |
|---|---|
| Prioritized merchant call list | Agents contact the most overdue merchants first, reducing churn and increasing order volume |
| One-tap order placement from catalog | Reduces order cycle time from minutes to seconds per merchant |
| Refusal reason tracking | Management identifies patterns (price sensitivity, stock issues, competitor switching) and takes corrective action |
| Invalid phone flagging | Keeps merchant data clean; flagged merchants routed for data team cleanup |
| 24-hour edit/cancel window | Agents correct mistakes without supervisor intervention; full audit trail prevents abuse |
| Supervisor call logs | Full transparency into agent activity: orders placed, refusals recorded, edits made |
| Performance metrics (contacted, refusal rate) | Data-driven agent coaching and incentive programs |
| Multi-channel order history | Agents see presell, fawry, cashvan orders alongside telesales — full context before calling |

### Target Users

| Role | Description |
|---|---|
| **Telesales Agent** | Calls merchants daily, places orders or records refusals. Each agent is assigned specific routes containing merchants. |
| **Supervisor** | Manages agent roster, assigns routes, monitors performance metrics, reviews flagged merchants, audits call logs. |

---

## 2. Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | React | 18.x | UI rendering |
| Language | TypeScript | 5.x | Type safety |
| Build Tool | Vite | 5.x (SWC) | Fast dev/build |
| Routing | react-router-dom | v6 | Client-side routing |
| Server State | TanStack React Query | v5 | Data fetching, caching, mutations |
| UI Library | shadcn/ui (Radix primitives) | — | Accessible component primitives |
| Styling | Tailwind CSS | 3.x | Utility-first CSS |
| Backend | Supabase | — | PostgreSQL, Edge Functions, RLS |
| i18n | i18next + react-i18next | — | Arabic/English translations |
| Notifications | Sonner | — | Toast notifications |
| Analytics | Mixpanel | — | Event tracking, session recording |
| Testing | Vitest + Testing Library | — | Unit/integration tests |
| Font | Cairo | — | Arabic-optimized web font |
| PWA | Web App Manifest | — | Standalone mobile app experience |

---

## 3. Architecture

### High-Level Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│  Agent Phone │────>│  React SPA   │────>│   Supabase       │
│  or Desktop  │<────│  (Vite)      │<────│   - PostgreSQL   │
└──────────────┘     │              │     │   - Edge Funcs   │
                     │  TanStack    │     │   - RLS Policies  │
┌──────────────┐     │  React Query │     └──────────────────┘
│  Supervisor  │────>│              │
│  Dashboard   │<────│  i18next     │
└──────────────┘     └──────────────┘
```

### Routing Map

| Path | Component | Access | Purpose |
|---|---|---|---|
| `/login` | `Login` | Public | Agent login |
| `/login/supervisor` | `SupervisorLogin` | Public | Supervisor login |
| `/` | `Dashboard` | Agent | Merchant call list with stats |
| `/merchant/:id` | `MerchantDetail` | Agent | Merchant profile, orders, no-order |
| `/merchant/:id/order` | `OrderPage` | Agent | Product catalog + cart |
| `/supervisor` | `Supervisor` | Supervisor | Agent management, flagged merchants |
| `/supervisor/agent/:id` | `AgentProfile` | Supervisor | Agent details, call logs |

### Dual Supabase Clients

| Client | File | Usage |
|---|---|---|
| **Staging** | `src/lib/supabaseStaging.ts` | Hardcoded URL/key. **Active client** used by all API functions. |
| **Production** | `src/integrations/supabase/client.ts` | Env vars. Currently **unused** in app pages. |

### Directory Structure

```
src/
├── main.tsx                          # Entry point
├── App.tsx                           # Root: QueryClient, router, routes
├── pages/
│   ├── Login.tsx                     # Agent login
│   ├── SupervisorLogin.tsx           # Supervisor login
│   ├── agent/
│   │   ├── Dashboard.tsx             # Agent dashboard
│   │   ├── MerchantDetail.tsx        # Merchant profile + actions
│   │   └── OrderPage.tsx             # Product catalog + cart
│   └── supervisor/
│       ├── Supervisor.tsx            # Supervisor panel (3 tabs)
│       └── AgentProfile.tsx          # Agent detail + call logs
├── lib/
│   ├── telesalesApi.ts               # All API functions
│   ├── telesalesTypes.ts             # TypeScript types
│   ├── session.ts                    # localStorage session management
│   ├── supabaseStaging.ts            # Staging Supabase client
│   ├── queryUtils.ts                 # Chunked/paginated fetch helpers
│   ├── optimisticUpdates.ts          # Optimistic cache mutation helpers
│   ├── analytics.ts                  # Mixpanel integration
│   └── utils.ts                      # cn() utility
├── components/
│   ├── ui/                           # 45 shadcn/ui primitives
│   └── NavLink.tsx                   # Router-aware nav link
├── hooks/
│   ├── use-mobile.tsx                # Viewport breakpoint hook
│   └── use-toast.ts                  # Legacy toast system
├── i18n/
│   └── index.ts                      # i18next configuration
├── integrations/
│   └── supabase/
│       ├── client.ts                 # Production Supabase client
│       └── types.ts                  # Auto-generated DB types
└── test/
    ├── setup.ts                      # Test setup + matchMedia mock
    └── example.test.ts               # Placeholder test
```

---

## 4. User Roles & Access

### Agent

- **Authentication**: Login with `agent_code` + `password` via `telesales-login` edge function
- **Session**: Stored in `localStorage` under key `illa_telesales_agent_session`
- **Session shape**: `{ type: "agent", agent: { id, agent_code, name, status } }`
- **Access**: Dashboard, Merchant Detail, Order Page
- **Auth guard**: Each page checks `getAgentSession()`, redirects to `/login` if absent

### Supervisor

- **Authentication**: Login with `email` + `password` via `admin-auth` edge function (external, not in this repo)
- **Session**: Stored in `localStorage` under key `illa_telesales_supervisor_session`
- **Session shape**: `{ type: "supervisor", token, admin: { id, name?, email } }`
- **Access**: Supervisor Panel, Agent Profile
- **Auth guard**: Each page checks `getSupervisorSession()`, redirects to `/login/supervisor` if absent

---

## 5. Feature Catalog

### 5.1 Authentication

#### Agent Login (`/login`)

| Aspect | Detail |
|---|---|
| **What** | Agent enters `agent_code` and `password`. On success, session stored in localStorage, user identified in Mixpanel, greeted with time-of-day Arabic toast, redirected to dashboard. |
| **Files** | `src/pages/Login.tsx`, `supabase/functions/telesales-login/index.ts` |
| **Business Impact** | Fast, mobile-friendly login gets agents into their call queue immediately. Account status check (active/inactive) prevents deactivated agents from accessing the system. |

**Error handling**: Distinguishes "account inactive" (status !== 1) from "invalid credentials" using `errorKey` from the edge function.

#### Supervisor Login (`/login/supervisor`)

| Aspect | Detail |
|---|---|
| **What** | Supervisor enters `email` and `password`. Calls external `admin-auth` edge function. |
| **Files** | `src/pages/SupervisorLogin.tsx` |
| **Business Impact** | Separate auth flow for supervisors. Edge function not in this repo — managed by the broader ILLA admin system. |

---

### 5.2 Agent Dashboard

| Aspect | Detail |
|---|---|
| **Route** | `/` |
| **File** | `src/pages/agent/Dashboard.tsx` |
| **API** | `getAssignedMerchants(agentId)`, `getAgentAnalytics(agentId)` |

#### Features

| Feature | Description | Business Impact |
|---|---|---|
| **Animated stat counters** | CountUp animation with ease-out cubic over 600ms. Arabic-EG numerals. | Visual feedback reinforces agent progress at a glance. |
| **Time-of-day greeting** | Morning/afternoon/evening Arabic greeting based on current hour. | Personalized experience increases agent engagement. |
| **Summary stats bar** | Total merchants, placed orders, refused, remaining, wrong numbers. | Agent sees daily progress without navigating away. Drives completionist behavior to reduce "remaining" count. |
| **Search** | Filters by merchant name, sign_name, merchant_code, phone_number. | Agent can quickly find specific merchants in large lists. |
| **Status filters** | All / Ordered / Refused / Remaining buttons. | Agent focuses on remaining merchants — the highest-value action. |
| **Smart sorting by contact gap** | Merchants never contacted or contacted longest ago appear first. Overdue badge (>14 days since last contact). | Ensures no merchant falls through the cracks. Maximizes contact coverage per day. |
| **Pagination** | 20 merchants per page with RTL chevron navigation. | Mobile-friendly scrolling. Fast rendering on low-end devices. |
| **Refusal reason badge** | Shows most recent refusal reason (Arabic) on each merchant card. | Agent sees why a merchant refused — can adjust pitch before calling. |
| **Mixpanel tracking** | Page view, search, filter, pagination, merchant card click, logout. | Management has full visibility into agent behavior patterns. |

---

### 5.3 Merchant Detail

| Aspect | Detail |
|---|---|
| **Route** | `/merchant/:id` |
| **File** | `src/pages/agent/MerchantDetail.tsx` |
| **API** | `getMerchant()`, `getMerchantOrders()`, `recordNoOrder()`, `cancelTelesalesOrder()`, `flagMerchantInvalidPhone()` |

#### Merchant Info Card

Displays: merchant_code, phone numbers (clickable `tel:` links for direct calling), governorate, detailed address, merchant type, price tier.

**Business Impact**: Agent has all context before making the call. One-tap phone dialing reduces friction.

#### Order History (30-Day, Multi-Channel)

| Feature | Description | Business Impact |
|---|---|---|
| **Multi-channel display** | Telesales (blue), presell (purple), fawry (orange), cashvan (yellow). | Agent sees the full picture — knows if merchant already ordered through another channel this week. Prevents duplicate orders and enables informed cross-sell. |
| **Order details** | Date, receiving date, channel badge, payment type, total, line items (qty × unit_price). | Agent can reference previous orders during the call ("You ordered 10 boxes of X last week"). |
| **24-hour edit/cancel** | Edit and Cancel buttons on recent telesales orders (non-cancelled, <24h old). | Agents fix mistakes without supervisor help. Full audit trail prevents abuse. |

#### Cancel Order Dialog

| Aspect | Detail |
|---|---|
| **What** | Dialog with optional cancellation reason textarea. Calls `cancelTelesalesOrder`. |
| **Business Impact** | Reason tracking enables pattern analysis — why are orders being cancelled? |

#### Today-Order Detection

If merchant already has a non-cancelled telesales order today, bottom bar shows "Place new order" instead of the place/no-order split.

**Business Impact**: Prevents accidental duplicate orders while allowing agents to add more items to already-served merchants.

---

### 5.4 Order Placement & Editing

| Aspect | Detail |
|---|---|
| **Route** | `/merchant/:id/order` |
| **File** | `src/pages/agent/OrderPage.tsx` |
| **API** | `getCatalogProducts()`, `submitTelesalesOrder()`, `editTelesalesOrder()`, `getOrderForEdit()` |

#### Two Modes

| Mode | Trigger | Behavior |
|---|---|---|
| **Create** | Default navigation | Browse catalog, build cart, submit new order |
| **Edit** | `?edit=orderId` query param | Pre-fills cart with existing order items. Submits via `editTelesalesOrder` instead. |

#### Product Catalog

| Feature | Description | Business Impact |
|---|---|---|
| **Vendor/principal grouping** | Products grouped by vendor with count and image. Click to expand. | Agent navigates by brand — matches how sales reps think about product lines. |
| **Search** | Filters by product description/SKU across all vendors. Vendor list narrows to matching results. | Agent finds specific products fast even in large catalogs. |
| **Region + price tier filtering** | Products filtered by merchant's `price_tier` (retail/wholesale/big_wholesale/large_grocery) and `region_id`/`governorate_id`. | Merchants see only products and prices relevant to them. No confusion about pricing. |
| **Cart persistence** | Cart stored in `sessionStorage` under `illa_telesales_cart_{merchantId}`. Survives page refresh. | Agent won't lose a half-built cart if browser reloads. |

#### Order Review Phase

| Feature | Description | Business Impact |
|---|---|---|
| **Item list with images** | Each cart item shows product image, description, qty, subtotal. | Visual confirmation reduces ordering errors. |
| **Payment type** | Cash or Credit radio buttons. | Captures payment terms for downstream invoicing. |
| **Receiving date picker** | Calendar with Arabic locale, RTL direction, past dates disabled. | Merchant specifies when they want delivery. Critical for logistics planning. |
| **Collection date picker** | Required only for credit orders. | Captures when payment will be collected. Enables cash-flow forecasting. |
| **Validation** | Must have ≥1 item, a receiving date, and collection date if credit. | Prevents incomplete orders from entering the system. |
| **Idempotency key** | Each submission includes `crypto.randomUUID()` in `price_details`. | Prevents duplicate orders if network is flaky (common on mobile in Egypt). |

#### Order Edit Flow

| Step | Description |
|---|---|
| 1 | Fetches existing order via `getOrderForEdit(orderId)` |
| 2 | Pre-fills cart with previous items and payment info |
| 3 | Agent modifies cart, dates, or payment |
| 4 | Submits via `editTelesalesOrder()` |
| 5 | System snapshots previous items, updates order, inserts new items, creates edit log with action="edited" |

**Business Impact**: Agents can adjust orders within 24 hours when merchants change their minds. Full before/after audit trail in `telesales_order_edits` table.

---

### 5.5 No-Order / Refusal Recording

| Aspect | Detail |
|---|---|
| **Where** | Merchant Detail page — "No Order" button in sticky bottom bar |
| **File** | `src/pages/agent/MerchantDetail.tsx` |
| **API** | `recordNoOrder()`, `getNoOrderReasons()` |

| Feature | Description | Business Impact |
|---|---|---|
| **Reason selection** | Radio group of active `no_order_reasons` from DB, ordered by `display_order`. | Structured data enables analytics: "30% of refusals are 'price too high'" → pricing strategy adjustment. |
| **Notes for "Other"** | When "Other" reason is selected (hardcoded UUID), notes textarea becomes required. | Free-text capture for reasons not in the standard list. Can be analyzed later to identify new reason categories. |
| **Optimistic update** | Analytics cache updated immediately (no refetch needed). | Agent sees "Refused" badge instantly — no loading delay. |

---

### 5.6 Invalid Phone Flagging

| Aspect | Detail |
|---|---|
| **Where** | Merchant Detail page — below no-order form |
| **API** | `flagMerchantInvalidPhone()`, `restoreMerchantPhone()` |
| **Migration** | `20260501000000_create_invalid_phone_flags.sql` |

| Feature | Description | Business Impact |
|---|---|---|
| **Flag button** | Destructive button with confirmation dialog. Sets `phone_invalid=true` on merchant. Upserts into `telesales_invalid_phone_flags` with agent ID and notes. | Merchants with bad numbers are automatically excluded from agent call lists. Saves agents from wasting time on unreachable numbers. |
| **Auto-clear trigger** | Database trigger `auto_clear_phone_invalid_flag()` fires when merchant's `phone_number` or `secondary_phone` changes — automatically clears the flag. | When data team updates a merchant's phone, the flag self-heals. No manual cleanup needed. |
| **Supervisor restore** | Supervisor can manually restore a flagged merchant from the Flagged Merchants tab. | Human override for edge cases (e.g., merchant has both valid and invalid numbers). |

---

### 5.7 Supervisor Panel — Agent Management

| Aspect | Detail |
|---|---|
| **Route** | `/supervisor` |
| **File** | `src/pages/supervisor/Supervisor.tsx` |
| **API** | `getSupervisorAgents()`, `createTelesalesAgent()`, `getFlaggedMerchants()`, `restoreMerchantPhone()` |

#### Agents Tab

| Feature | Description | Business Impact |
|---|---|---|
| **Agent cards** | Grid of cards: name, agent_code, phone, status badge (active/inactive), 4-stat grid (contacted, placed orders, refused, refusal rate %). | Supervisor sees team performance at a glance. Identifies top performers and underperformers instantly. |
| **Agent linking** | Each card links to `/supervisor/agent/:id` for detailed profile. | Drill-down from summary to detail — no dead ends. |

#### Create Agent Tab

| Feature | Description | Business Impact |
|---|---|---|
| **Agent creation form** | agent_code (auto-prefixed "TA-"), name, phone, password. "TA-" prefix cannot be deleted. | Fast onboarding of new agents. Naming convention enforced automatically. |

#### Flagged Merchants Tab

| Feature | Description | Business Impact |
|---|---|---|
| **Flagged list** | Merchants flagged with invalid phones. Shows code, name, both phones, flagging agent, notes, date. | Data quality dashboard — supervisor sees scope of bad phone data and assigns cleanup. |
| **Agent filter** | Dropdown to filter flagged merchants by agent. | Identify if a specific agent is flagging too many — might need training or there might be a route-specific data issue. |
| **Restore button** | Clears the flag and removes the flag record. | Human override when the flag was a mistake. |

---

### 5.8 Supervisor Panel — Agent Profile & Call Logs

| Aspect | Detail |
|---|---|
| **Route** | `/supervisor/agent/:id` |
| **File** | `src/pages/supervisor/AgentProfile.tsx` |
| **API** | `getAssignmentData()`, `updateTelesalesAgent()`, `setAgentStatus()`, `assignRoute()`, `unassignRoute()`, `getAgentOrdersForLogs()`, `getAgentRefusalsForLogs()`, `getAgentOrderEdits()` |

#### Agent Info & Credentials

| Feature | Description | Business Impact |
|---|---|---|
| **Profile card** | Avatar (first letter), name, agent_code, phone, status, 4-stat grid. | Quick agent overview. |
| **Activate/Deactivate** | Toggle button to enable/disable agent access. | Instant access revocation for terminated agents. |
| **Edit credentials** | Dialog to update name, phone, password (partial updates — only non-empty fields sent). | Self-service credential management — no DBA needed for password resets. |

#### Route Assignment

| Feature | Description | Business Impact |
|---|---|---|
| **Route list** | Accordion of all routes with merchant counts. Assigned routes highlighted in teal. | Supervisor sees agent's territory at a glance. |
| **Assign/Unassign** | Toggle button per route. | Flexible territory management — routes can be redistributed between agents based on workload. |

#### Call Logs (Time-Filtered)

Time range selector: Today / Last 7 days / This Month.

##### Orders Tab

| Feature | Description | Business Impact |
|---|---|---|
| **Order cards** | Merchant name, date, total, product count. | Quick scan of what the agent is selling. |
| **Order detail dialog** | Full breakdown: merchant, date, payment/receiving/collection badges, product list, total. | Deep-dive into specific orders. Verify agent is quoting correct prices. |

##### Refusals Tab

| Feature | Description | Business Impact |
|---|---|---|
| **Refusal cards** | Reason badge, merchant name, date. | Pattern detection: "Agent X has 40% 'price too high' refusals" → pricing discussion. |
| **Refusal detail dialog** | Reason and notes. | See agent's free-text notes for context. |

##### Changes Tab (Edits & Cancellations)

| Feature | Description | Business Impact |
|---|---|---|
| **Change cards** | Old total → new total with arrow, action badge (edited/cancelled). | Spot suspicious patterns — frequent cancellations or large total reductions. |
| **Diff dialog** | Full diff view: added items (green), removed items (red), quantity changes (amber). Product descriptions and quantities. | Line-item-level audit. Catch if agent is removing high-value items after initial submission. |
| **Diff computation** | `computeDiff()` compares previous and new item arrays by `product_id`. Detects added, removed, and quantity-changed items. | Algorithmic comparison — no manual checking needed. |

---

### 5.9 Supervisor Panel — Flagged Merchants

Covered in [5.7 — Flagged Merchants Tab](#57-supervisor-panel--agent-management).

---

### 5.10 Analytics & Tracking

| Aspect | Detail |
|---|---|
| **File** | `src/lib/analytics.ts` |
| **Provider** | Mixpanel (token: `c6744263893779abebd03bdb86c8c072`) |
| **Session recording** | Enabled at 100% with text masking |

#### Features

| Feature | Description | Business Impact |
|---|---|---|
| **User identification** | `identifyUser()` — sets agent/supervisor identity, people properties, super properties (role, name, phone, email, agent_code). | All events attributed to specific users. Enables per-agent behavioral analysis. |
| **Event tracking** | `track(event, props)` — tracks with automatic identity re-attachment. | Consistent event schema across all tracked actions. |
| **Session recording** | Full session replay with text masking for privacy. | Watch actual agent sessions to identify UX friction points. |
| **Auto-identify on load** | Module re-identifies user on import if session exists. | Survives page refreshes — no lost tracking. |

#### Tracked Events (Dashboard)

Page view, search, filter change, pagination, merchant card click, logout.

---

### 5.11 Internationalization (i18n)

| Aspect | Detail |
|---|---|
| **File** | `src/i18n/index.ts` |
| **Provider** | i18next + i18next-http-backend + react-i18next |
| **Default language** | Arabic (`ar`) |
| **Fallback** | Arabic (`ar`) |
| **Translation files** | `/public/locales/ar/translation.json` (148 keys), `/public/locales/en/translation.json` (62 keys, partial) |

#### RTL Support

| Feature | Description |
|---|---|
| `dir="rtl"` on HTML | Enforced by i18next on language change |
| `lang="ar"` on HTML | Set automatically |
| `tailwindcss-rtl` plugin | RTL-aware utility classes |
| Cairo font | Arabic-optimized web font |
| Currency | "ج.م" (Egyptian Pound) |
| Number formatting | `toLocaleString("ar-EG")` |

#### Price Tier Translations

| English Key | Arabic Label | Tier |
|---|---|---|
| `retail` | قطاعي | Retail |
| `wholesale` | جملة | Wholesale |
| `big_wholesale` | جملة كبيرة | Big Wholesale |
| `large_grocery` | قطاعي كبير | Large Grocery |

---

## 6. Database Schema

### Telesales-Specific Tables

#### `telesales_agents`

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Agent unique ID |
| `agent_code` | TEXT (UNIQUE) | Agent login code (e.g., "TA-001") |
| `name` | TEXT | Agent display name |
| `phone_number` | TEXT | Agent phone |
| `password` | TEXT | Plaintext password |
| `status` | INTEGER | 1 = active, 0 = inactive |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Auto-updated on change |

**RLS**: Full access (SELECT, INSERT, UPDATE for all).

**Business Impact**: Core agent entity. Status toggle enables instant access control.

---

#### `telesales_agent_routes`

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Row ID |
| `agent_id` | UUID (FK → telesales_agents) | Assigned agent |
| `route_id` | UUID (FK → routes) | Assigned route |
| `created_at` | TIMESTAMPTZ | Assignment timestamp |

**Constraint**: UNIQUE (agent_id, route_id) — no duplicate assignments.

**Business Impact**: Many-to-many mapping. Routes determine which merchants an agent sees. Territory rebalancing is a single unassign/assign operation.

---

#### `telesales_agent_regions`

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Row ID |
| `agent_id` | UUID (FK → telesales_agents) | Assigned agent |
| `region_id` | UUID (FK → regions) | Assigned region |
| `created_at` | TIMESTAMPTZ | Assignment timestamp |

**Business Impact**: Region-level assignments for product pricing and catalog filtering.

---

#### `telesales_no_orders`

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Row ID |
| `agent_id` | UUID (FK → telesales_agents) | Recording agent |
| `merchant_id` | UUID (FK → merchants) | Merchant who refused |
| `reason_id` | UUID (FK → no_order_reasons) | Selected refusal reason |
| `notes` | TEXT | Optional agent notes |
| `created_at` | TIMESTAMPTZ | Recording timestamp |

**Business Impact**: Every refusal is tracked with who, when, why. Feeds refusal rate analytics and pattern detection.

---

#### `telesales_invalid_phone_flags`

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Row ID |
| `merchant_id` | UUID (FK → merchants, UNIQUE) | Flagged merchant |
| `agent_id` | UUID (FK → telesales_agents) | Flagging agent |
| `notes` | TEXT | Optional notes |
| `created_at` | TIMESTAMPTZ | Flag timestamp |

**Trigger**: `auto_clear_phone_invalid_flag()` — fires on merchant phone update, clears `phone_invalid` and deletes flag record.

**Business Impact**: Self-healing data quality loop. Merchants with bad numbers are hidden from agents until their phone is updated.

---

#### `telesales_order_edits`

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Row ID |
| `order_id` | UUID (FK → sales_orders) | Edited order |
| `agent_id` | UUID (FK → telesales_agents) | Editing agent |
| `action` | TEXT (CHECK: 'edited' or 'cancelled') | Action type |
| `reason` | TEXT | Optional cancellation reason |
| `previous_items` | JSONB | Snapshot of items before change |
| `previous_total` | NUMERIC | Total before change |
| `new_items` | JSONB | Full new order state after change |
| `created_at` | TIMESTAMPTZ | Edit timestamp |

**Business Impact**: Full audit trail for order modifications. Line-item-level diffing catches fraudulent edits (e.g., removing items after approval).

---

### Shared Tables (Queried by This App)

| Table | Purpose | Used By |
|---|---|---|
| `merchants` | Merchant accounts with phones, addresses, price tiers | Dashboard, MerchantDetail, OrderPage |
| `merchant_routes` | Maps merchants to routes | Dashboard (via agent → routes → merchant_routes) |
| `routes` | Delivery route definitions | Supervisor route assignment |
| `regions` | Geographic region definitions | Product pricing, catalog filtering |
| `products` | Product catalog | OrderPage |
| `product_prices` | Per-tier, per-region pricing | OrderPage |
| `product_regions` | Product-region availability | OrderPage |
| `principals` | Product vendors/brands | OrderPage vendor grouping |
| `sales_orders` | Order records (all channels) | MerchantDetail, OrderPage, call logs |
| `sales_order_items` | Order line items | OrderPage, order details |
| `no_order_reasons` | Refusal reason catalog | MerchantDetail no-order dialog |
| `merchant_types` | Merchant category labels | Dashboard, MerchantDetail |

### Column Added to Shared Table

| Table | Column | Migration |
|---|---|---|
| `sales_orders` | `telesales_agent_id` UUID (nullable FK → telesales_agents) | `20260429000000` |
| `merchants` | `phone_invalid` BOOLEAN DEFAULT false | `20260501000000` |
| `sales_orders` | `agent_id` made nullable | `20260506102000` |

### Database Trigger

`set_sales_order_agent_name()` — Auto-populates `agent_name` on `sales_orders` from either `agents` (presell) or `telesales_agents` (telesales) table based on which ID is present.

---

## 7. API Reference

### File: `src/lib/telesalesApi.ts` (614 lines)

All functions use the **staging** Supabase client. Login functions call Edge Functions via `fetch()`. All other queries use the Supabase JS client directly.

#### Authentication

| Function | Parameters | Returns | Edge Function |
|---|---|---|---|
| `loginAgent(agent_code, password)` | string, string | `{ success, agent: { id, agent_code, name, status } }` | `telesales-login` |
| `loginSupervisor(email, password)` | string, string | `{ token, admin: { id, name, email } }` | `admin-auth` (external) |

#### Agent Dashboard

| Function | Parameters | Returns | Details |
|---|---|---|---|
| `getAssignedMerchants(agentId)` | UUID | `Merchant[]` | Resolves agent → routes → merchant_routes → merchants. Filters out merchants without phones and those flagged invalid. Joins `merchant_types`. Uses `fetchInChunks` for large ID lists. |
| `getAgentAnalytics(agentId)` | UUID | `AgentAnalytics` | Monthly window: counts ordered/refused merchants, wrong number flags. Tracks last-contacted-at across all channels (sales_orders, orders/cashvan, telesales_no_orders). |

#### Merchant Operations

| Function | Parameters | Returns | Details |
|---|---|---|---|
| `getMerchant(agentId, merchantId)` | UUID, UUID | `Merchant \| null` | Filters from `getAssignedMerchants` (ensures assignment). |
| `getMerchantOrders(merchantId)` | UUID | `MerchantOrder[]` | 30-day history from `sales_orders` + `orders` (cashvan). Unified via `classifyChannel()`. |
| `getCatalogProducts(agentId, merchant)` | UUID, Merchant | `CatalogProduct[]` | Products with prices filtered by merchant's price_tier and region_id/governorate_id. Joined with principals for vendor info. |

#### Order Operations

| Function | Parameters | Returns | Details |
|---|---|---|---|
| `submitTelesalesOrder(agentId, merchant, cartItems, paymentType, collectionDate?, receivingDate?)` | ... | Order record | Generates idempotency key, calculates totals, inserts `sales_orders` + `sales_order_items`. |
| `editTelesalesOrder(orderId, agentId, items, merchant, paymentType, collectionDate?, receivingDate?)` | ... | Updated order | Snapshots previous items, updates order + items, inserts edit log with action="edited". |
| `cancelTelesalesOrder(orderId, agentId, reason?)` | UUID, UUID, string? | Cancelled order | Snapshots items, sets status="cancelled", inserts edit log with action="cancelled". |
| `getOrderForEdit(orderId)` | UUID | Order with items | Returns order with items including price_snapshot for pre-filling edit form. |

#### No-Order & Flags

| Function | Parameters | Returns | Details |
|---|---|---|---|
| `getNoOrderReasons()` | — | Reason[] | Active reasons ordered by display_order. |
| `recordNoOrder(agentId, merchantId, reasonId, notes?)` | UUID, UUID, UUID, string? | No-order record | Inserts into `telesales_no_orders`. |
| `flagMerchantInvalidPhone(agentId, merchantId, notes?)` | UUID, UUID, string? | Flag record | Sets `phone_invalid=true` on merchant, upserts flag record. |
| `restoreMerchantPhone(merchantId)` | UUID | — | Clears `phone_invalid`, deletes flag record. |

#### Supervisor Operations

| Function | Parameters | Returns | Details |
|---|---|---|---|
| `getSupervisorAgents()` | — | Agent[] with stats | Monthly orders, refusals, contacted count, refusal rate %. |
| `createTelesalesAgent(input)` | { agent_code, name, phone_number, password } | Agent record | Inserts with status=1. |
| `updateTelesalesAgent(agentId, updates)` | UUID, Partial<Agent> | Updated agent | Partial update: only non-empty fields sent. |
| `setAgentStatus(agentId, status)` | UUID, number | Updated agent | 1=active, 0=inactive. |
| `getAssignmentData()` | — | { agents, routes, assignments, merchantRoutes } | Full dataset for route assignment UI. |
| `assignRoute(agentId, routeId)` | UUID, UUID | Assignment record | Inserts into `telesales_agent_routes`. |
| `unassignRoute(agentId, routeId)` | UUID, UUID | — | Deletes from `telesales_agent_routes`. |
| `getFlaggedMerchants()` | — | InvalidPhoneFlag[] | Joins with agent and merchant info. |

#### Call Log Operations

| Function | Parameters | Returns | Details |
|---|---|---|---|
| `getAgentOrdersForLogs(agentId, range)` | UUID, TimeRange | AgentOrderLog[] | Joins with merchants and products. |
| `getAgentRefusalsForLogs(agentId, range)` | UUID, TimeRange | AgentRefusalLog[] | Joins with merchants and no_order_reasons. |
| `getAgentOrderEdits(agentId, range)` | UUID, TimeRange | OrderEditLog[] | Joins with sales_orders → merchants. |
| `timeRangeToDates(range)` | TimeRange | { start, end } | Converts enum to ISO date range. |

---

## 8. Edge Functions

### `telesales-login` (in this repo)

**File**: `supabase/functions/telesales-login/index.ts`

**Flow**:
1. Handle CORS preflight (OPTIONS)
2. Accept POST with `{ agent_code, password }`
3. Create Supabase admin client using `SUPABASE_SERVICE_ROLE_KEY`
4. Query `telesales_agents` by `agent_code`
5. Plaintext password comparison
6. Check `agent.status !== 1` → return 403 with inactive message
7. Return `{ success: true, agent: { id, agent_code, name, status } }`

### `admin-auth` (external, not in this repo)

Supervisor authentication. Called by `loginSupervisor()` but deployed separately on the staging project.

---

## 9. State Management

### Server State: TanStack React Query

- **Query keys**: `["entity", id?, ...params]` pattern
- **Cache invalidation**: Manual via `queryClient.invalidateQueries()` after mutations
- **Optimistic updates**: `markMerchantOrdered`, `markMerchantRefused`, `markMerchantWrongNumber` in `src/lib/optimisticUpdates.ts`

### Local State: React `useState`

- Cart state in OrderPage
- Filter/search state in Dashboard
- Dialog open/close states

### No Global Client Store

No Redux, Zustand, or Context provider for global state. Session is read directly from localStorage per page.

### Session Persistence

| Storage | Key | Shape |
|---|---|---|
| localStorage | `illa_telesales_agent_session` | `{ type: "agent", agent: { id, agent_code, name, status } }` |
| localStorage | `illa_telesales_supervisor_session` | `{ type: "supervisor", token, admin: { id, name?, email } }` |
| sessionStorage | `illa_telesales_cart_{merchantId}` | Cart items array |

---

## 10. Security Considerations

| Area | Current State | Risk |
|---|---|---|
| Agent passwords | Stored **plaintext** in `telesales_agents` | High — password exposure via DB access |
| RLS policies | Fully permissive (`USING (true)`) | High — no row-level access control |
| Auth middleware | None — pages self-protect | Medium — route guard could be bypassed |
| Staging credentials | Hardcoded in source | Medium — committed to git |
| API authentication | No auth tokens for data queries | High — any client can query all data |
| Idempotency | Order submissions include idempotency key | Low — prevents duplicate orders |

**Note**: This is a staging/development system. Production deployment requires addressing all items above.

---

## 11. Known Gaps & Technical Debt

| Item | Details | Impact |
|---|---|---|
| Scaffold leftovers | `src/pages/Index.tsx`, `src/App.css`, `src/components/NavLink.tsx` unused | Dead code |
| Unused dependencies | `recharts`, `react-hook-form`, `zod`, `@hookform/resolvers` | Larger bundle size |
| Placeholder test | `expect(true).toBe(true)` — no real tests | Zero test coverage |
| Lovable artifacts | `lovable-tagger`, `.lovable/` directory | Build noise |
| English translations incomplete | Only 62 of 148 keys translated | English UI broken |
| No centralized route guard | Each page checks session independently | Potential auth bypass |
| No rate limiting | Edge functions accept unlimited requests | Abuse potential |
| No password hashing | Plaintext comparison | Security risk |

---

## 12. Project Commands

```bash
npm run dev        # Vite dev server on port 8080
npm run build      # Production build
npm run build:dev  # Development-mode build
npm run lint       # ESLint
npm run test       # vitest run (single execution)
npm run test:watch # vitest watch mode
```

---

## 13. File Map

### Core Application Files

| File | Lines | Purpose |
|---|---|---|
| `src/App.tsx` | ~80 | Root component, QueryClient, router, all routes |
| `src/main.tsx` | ~20 | Entry point, React root render |
| `src/lib/telesalesApi.ts` | ~614 | All API functions |
| `src/lib/telesalesTypes.ts` | ~120 | TypeScript type definitions |
| `src/lib/session.ts` | ~50 | localStorage session management |
| `src/lib/supabaseStaging.ts` | ~10 | Staging Supabase client (hardcoded) |
| `src/lib/queryUtils.ts` | ~50 | `fetchInChunks()` and `fetchAllRows()` helpers |
| `src/lib/optimisticUpdates.ts` | ~40 | Optimistic cache mutation helpers |
| `src/lib/analytics.ts` | ~60 | Mixpanel integration |
| `src/lib/utils.ts` | ~10 | `cn()` Tailwind class merge utility |

### Pages

| File | Lines | Purpose |
|---|---|---|
| `src/pages/Login.tsx` | ~100 | Agent login form |
| `src/pages/SupervisorLogin.tsx` | ~80 | Supervisor login form |
| `src/pages/agent/Dashboard.tsx` | ~400 | Agent dashboard with merchant list |
| `src/pages/agent/MerchantDetail.tsx` | ~600 | Merchant profile, orders, no-order flow |
| `src/pages/agent/OrderPage.tsx` | ~700 | Product catalog, cart, order submission/edit |
| `src/pages/supervisor/Supervisor.tsx` | ~500 | Supervisor panel (agents, create, flagged) |
| `src/pages/supervisor/AgentProfile.tsx` | ~600 | Agent detail, routes, call logs |

### Backend

| File | Purpose |
|---|---|
| `supabase/functions/telesales-login/index.ts` | Agent auth edge function |
| `supabase/migrations/20260429000000_create_telesales_tables.sql` | Core telesales tables + RLS |
| `supabase/migrations/20260501000000_create_invalid_phone_flags.sql` | Invalid phone flagging |
| `supabase/migrations/20260505000000_create_order_edits.sql` | Order edit audit table |
| `supabase/migrations/20260505000001_add_order_edits_new_items.sql` | New items JSONB column |
| `supabase/migrations/20260506102000_*.sql` | Nullable agent_id on sales_orders |

### Configuration

| File | Purpose |
|---|---|
| `vite.config.ts` | Vite build config (path alias, SWC) |
| `tailwind.config.ts` | Tailwind + RTL plugin config |
| `tsconfig.json` | TypeScript config (strict: false) |
| `vitest.config.ts` | Vitest test runner config |
| `postcss.config.js` | PostCSS with Tailwind + autoprefixer |
| `public/manifest.json` | PWA manifest (Arabic, RTL, standalone) |
| `public/locales/ar/translation.json` | Arabic translations (148 keys) |
| `public/locales/en/translation.json` | English translations (62 keys, partial) |
