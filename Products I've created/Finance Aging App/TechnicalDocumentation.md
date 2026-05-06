# ILLA Finance System -- Technical Documentation Package

---

## 1. Full PRD (Product Requirements Document)

### 1.1 Product Overview

ILLA Finance is a back-office Accounts Receivable (AR) management system for ILLA Trucking. It tracks clients, invoices, payment reconciliation, credit management, and provides analytics dashboards. The application supports bilingual UI (English and Arabic with RTL layout).

**Published URL:** https://financeilla.lovable.app

### 1.2 User Roles

| Role | Capabilities |
|------|-------------|
| Admin | Full CRUD on clients/invoices, bulk import, bulk update clients, reconciliation, reversal, access to all pages |
| Supervisor | Same as Admin except no access to the "Bulk Update" feature for clients |

Authentication uses a custom `users` table with plain-text password storage. No sign-up page exists; users are added manually to the database.

### 1.3 Pages and Features

#### 1.3.1 Login (`/login`)
- Email + password login against the `users` table.
- On app load, the stored user session is verified against the database to ensure role freshness.
- User identified in Mixpanel on login.

#### 1.3.2 Dashboard (`/dashboard`)
- **Overview Tab:**
  - Summary cards: Total Receivables (sum of all unpaid `left_amount`), Overdue Amount (subset past due date), Total Clients, Total Invoices (paid/unpaid breakdown).
  - Client Breakdown table: paginated (25/page), sorted by overdue amount descending. Shows receivables, overdue, invoice counts per client.
  - Recent Activity feed (last 5 activity log entries).
  - Client filter dropdown (server-side search, ClientCombobox).
- **Analytics Tab:**
  - Three DSO metrics: Lifetime DSO `(AR/Sales)*Days`, 30-Day DSO `(AR30/Sales30)*30`, Weighted Average DSO (payment-amount-weighted per invoice).
  - Summary cards: Total AR, Total Credit Sales, Operating Days.
  - Collection Efficiency progress bar `(1 - AR/Sales) * 100`.
  - All calculated via `get_analytics_stats()` database function.

#### 1.3.3 Clients (`/clients`)
- **Table:** Paginated (25/page), searchable by name/code, filterable by client type and credit balance.
- **CRUD:** Create, Edit (name, code, type, aging days, credit limit), Soft-delete (sets `deleted_at`).
- **Delete validation:** Clients with linked invoices or reconciliation transactions cannot be deleted. Shows blocking dialog.
- **Bulk Import:** Excel upload. All-or-nothing validation. Two-pass: (1) detect in-file duplicates, (2) validate against full DB using paginated fetch. Row-by-row insertion. Rejects if any code already exists (active or archived).
- **Bulk Update (Admin only):** Excel upload matching by client code. Updates name, type, aging days, credit limit. Rejects if any code is missing, not found, or archived.
- **Export:** Full client list to Excel.
- **Client Types (ENUM):** `retailer`, `large_grocery`, `wholesale`, `big_wholesale`.

#### 1.3.4 Invoices (`/invoices`)
- **Table:** Client-side filtered/paginated. Columns: Invoice #, Order ID, Client, Invoice Date, Total Value, Left Amount, Status, Remaining Days to Due, Batch IDs.
- **Display Status Hierarchy:** PAID > OVERDUE > DUE > CURRENT.
- **Remaining Days to Due:** For unpaid: `dueDate - today` (positive = days remaining, 0 = due today, negative = overdue). For PAID: frozen at `paid_at` date.
- **Filters:** Search (invoice #, order ID, client name/code), status, client, amount range (gte/lte/between), incomplete data toggle.
- **CRUD:** Create (auto-applies available client credit via `apply-credit-to-invoice` edge function), Edit (UNPAID only for full edit; non-UNPAID allows completing missing invoice_number/order_id only), Delete (UNPAID only), Bulk delete.
- **Bulk Import:** Excel upload with validation (unique invoice_number, unique order_id, valid client codes, non-future dates, positive amounts).
- **Invoice Detail Modal:** Click any row to see full invoice details + reconciliation history (batch ID, date, amount per batch) + credit auto-pay entries (blue badge).
- **Export:** Full invoice list to Excel with all columns.
- **Uniqueness Constraint:** invoice_number and order_id must be unique. At least one must be provided.

#### 1.3.5 Reconciliation (`/reconciliation`)
- **Manual Entry Tab:** Select client, enter amount and date, process single payment.
- **Bulk Upload Tab:** Excel upload with columns: client_code, amount, date. Validates all rows before processing.
- **Processing Logic:** FIFO (oldest invoice first). Partial payments supported. Overpayments converted to client credit balance.
- **Smart Parallel Processing:** Payments grouped by client; different clients processed in parallel (up to 10 concurrent), same-client payments processed sequentially to prevent race conditions.
- **Batch ID Format:** `YYYYMM-NNNNNN` (auto-incrementing sequence per month).
- **Progress Overlay:** Shows processing progress with browser `beforeunload` warning.
- **Re-upload:** Supports re-uploading a batch (reverses old batch, then re-processes).
- **History Tab:** View all reconciliation transactions grouped by batch. Filter by client or batch ID. Reverse individual transactions or entire batches.
- **Batch Detail Modal:** Click a batch to see all transactions in it.

#### 1.3.6 Client Statement (`/client-statement`)
- Select a client to view chronological debit/credit statement.
- Combines invoices (debits) and reconciliation payments (credits).
- Running balance calculation.
- Credit balances shown in green with minus sign.
- Export to Excel.

#### 1.3.7 Activity Log (`/activity-log`)
- Searchable table of all logged user actions (last 500).
- Columns: Timestamp, User, Action Type (badge-coded), Description.
- Action types: CREATE_CLIENT, UPDATE_CLIENT, DELETE_CLIENT, CREATE_INVOICE, UPDATE_INVOICE, DELETE_INVOICE, MANUAL_RECONCILE, BULK_RECONCILE, BULK_IMPORT_CLIENTS, BULK_IMPORT_INVOICES, FAILED_IMPORT_*, FAILED_DELETE_CLIENT.

#### 1.3.8 Approvals Queue (`/approvals-queue`)
- **Two-Tab Layout:**
  - **Review Submissions** (default): Filter bar + accordion list of agents with pending cash collection submissions. Supervisors approve or reject individual submissions with editable amount and promise date fields.
  - **Performance Analytics**: Summary metric cards (Daily Summary, Top 5 Leaderboard, Total Approved) and a dynamic Collection History bar chart.
- **Shared Filter State:** Both tabs share the same date range and agent filter state. Changing filters in one tab automatically updates the other.
- **Date Range Picker:** Supports selecting a start and end date via a `react-day-picker` range calendar. All range boundaries use DST-safe Egypt Local Time (Africa/Cairo, UTC+2/UTC+3) via the `getEgyptDayRange` utility.
- **Dynamic Chart:** The Collection History bar chart generates one bar per day within the selected range. Defaults to the last 7 days when no range is selected.
- **Data Source:** Reads from the `agent_submissions` table. Submissions have statuses: `pending`, `approved`, `rejected`.
- **Table Columns:** Checkbox, Client Name (min-w 140px), Client Phone (min-w 110px), Amount Collected (min-w 130px), Promise Date (min-w 150px), Partial Reason (max-w 180px), Receipt Photo (centered, 100px).
- **Bilingual:** Full EN/AR translation support with RTL layout.

### 1.4 Cross-Cutting Concerns

- **Activity Logging:** Every user action is logged to `activity_logs` with user ID, name, action type, description, and timestamp.
- **Bilingual (EN/AR):** Full translation support with RTL layout for Arabic.
- **Mixpanel Analytics:** Page views, button clicks, searches, and errors tracked.
- **Server-side Pagination:** All large datasets use paginated fetching (1000-row pages) to bypass Supabase default limit.
- **Import Error Reporting:** Failed bulk imports show detailed error modal with downloadable error list.

### 1.5 Credit System

- Overpayments during reconciliation are stored as `credit_balance` on the client record.
- Credit is automatically applied to new invoices in FIFO order (oldest credit batch first).
- Credit tracking uses dual storage: `client_credit_transactions` table and `invoices.credit_batch_ids`.
- Reversal of reconciliation also reverses associated credit transactions.
- The `apply-credit-bulk` edge function handles applying credit to multiple invoices after a reconciliation creates overpayment.

### 1.6 Scheduled Jobs

- **`update_overdue_flags()`**: pg_cron daily job that sets `was_overdue = TRUE` on invoices where `current_date > due_date AND left_amount > 0`. Once set, never reverts.
- **`send-past-due-notification`**: Edge function (triggered externally/cron) that emails a daily past-due invoice report via Resend. Sends to `finance.app.notification@illa.com.eg` from `notifications@illatrucking.com`.

---

## 2. Database Schema

### 2.1 Tables

#### `users`
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | No | gen_random_uuid() | PK |
| name | text | No | - | |
| email | text | No | - | |
| password | text | No | - | Plain-text |
| role | text | Yes | 'Admin' | 'Admin' or 'Supervisor' |
| created_at | timestamptz | Yes | now() | |

#### `clients`
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | No | gen_random_uuid() | PK |
| name | text | No | - | |
| code | text | No | - | Unique (enforced by app) |
| client_type | client_type_enum | No | 'retailer' | |
| max_aging_days | integer | Yes | 15 | Days until invoice is overdue |
| credit_limit | numeric | No | 0 | |
| credit_balance | numeric | Yes | 0 | Current overpayment credit |
| last_reconciled_at | date | Yes | - | |
| created_by | uuid | Yes | - | FK -> users.id |
| created_at | timestamptz | Yes | now() | |
| deleted_at | timestamptz | Yes | - | Soft delete |

#### `invoices`
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | No | gen_random_uuid() | PK |
| client_id | uuid | No | - | FK -> clients.id |
| invoice_number | text | Yes | - | Unique |
| order_id | text | Yes | - | Unique |
| invoice_date | date | No | - | |
| total_value | numeric | No | - | |
| left_amount | numeric | No | - | Remaining unpaid amount |
| status | invoice_status | Yes | 'UNPAID' | |
| paid_at | timestamptz | Yes | - | Set when status becomes PAID |
| settled_from_credit | boolean | Yes | false | |
| credit_batch_ids | text[] | Yes | '{}' | Batch IDs that contributed credit |
| was_overdue | boolean | Yes | false | Set by cron, never unset |
| created_by | uuid | Yes | - | FK -> users.id |
| created_at | timestamptz | Yes | now() | |

#### `reconciliation_transactions`
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | No | gen_random_uuid() | PK |
| client_id | uuid | No | - | FK -> clients.id |
| amount_paid | numeric | No | - | |
| reconciliation_date | date | No | - | |
| reference_id | text | No | '' | Batch ID (YYYYMM-NNNNNN) |
| created_by | uuid | Yes | - | FK -> users.id |
| created_at | timestamptz | Yes | now() | |

#### `invoice_reconciliation_details`
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | No | gen_random_uuid() | PK |
| invoice_id | uuid | No | - | FK -> invoices.id |
| reconciliation_transaction_id | uuid | No | - | FK -> reconciliation_transactions.id |
| amount_applied | numeric | No | - | Portion of payment applied to this invoice |
| created_at | timestamptz | Yes | now() | |

#### `client_credit_transactions`
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | No | gen_random_uuid() | PK |
| client_id | uuid | No | - | FK -> clients.id |
| amount | numeric | No | - | Positive=OVERPAYMENT, Negative=CREDIT_APPLIED |
| transaction_type | text | No | - | 'OVERPAYMENT' or 'CREDIT_APPLIED' |
| invoice_id | uuid | Yes | - | FK -> invoices.id (for CREDIT_APPLIED) |
| reconciliation_transaction_id | uuid | Yes | - | FK -> reconciliation_transactions.id |
| batch_id | text | Yes | - | Source reconciliation batch ID |
| created_at | timestamptz | Yes | now() | |

#### `activity_logs`
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | No | gen_random_uuid() | PK |
| user_id | uuid | Yes | - | FK -> users.id |
| user_name | text | No | - | |
| action_type | text | No | - | |
| description | text | Yes | - | |
| timestamp | timestamptz | Yes | now() | |

### 2.2 Enums

```sql
CREATE TYPE client_type_enum AS ENUM ('retailer', 'large_grocery', 'wholesale', 'big_wholesale');
CREATE TYPE invoice_status AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID');
```

### 2.3 Foreign Key Relationships

```text
clients.created_by              -> users.id
invoices.client_id              -> clients.id
invoices.created_by             -> users.id
reconciliation_transactions.client_id   -> clients.id
reconciliation_transactions.created_by  -> users.id
invoice_reconciliation_details.invoice_id -> invoices.id
invoice_reconciliation_details.reconciliation_transaction_id -> reconciliation_transactions.id
client_credit_transactions.client_id    -> clients.id
client_credit_transactions.invoice_id   -> invoices.id
client_credit_transactions.reconciliation_transaction_id -> reconciliation_transactions.id
activity_logs.user_id           -> users.id
```

---

## 3. SQL Export (CREATE TABLE Statements)

```sql
-- Enums
CREATE TYPE client_type_enum AS ENUM ('retailer', 'large_grocery', 'wholesale', 'big_wholesale');
CREATE TYPE invoice_status AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID');

-- Users
CREATE TABLE users (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  password text NOT NULL,
  role text DEFAULT 'Admin',
  created_at timestamptz DEFAULT now()
);

-- Clients
CREATE TABLE clients (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  code text NOT NULL,
  client_type client_type_enum NOT NULL DEFAULT 'retailer',
  max_aging_days integer DEFAULT 15,
  credit_limit numeric NOT NULL DEFAULT 0,
  credit_balance numeric DEFAULT 0,
  last_reconciled_at date,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- Invoices
CREATE TABLE invoices (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL REFERENCES clients(id),
  invoice_number text,
  order_id text,
  invoice_date date NOT NULL,
  total_value numeric NOT NULL,
  left_amount numeric NOT NULL,
  status invoice_status DEFAULT 'UNPAID',
  paid_at timestamptz,
  settled_from_credit boolean DEFAULT false,
  credit_batch_ids text[] DEFAULT '{}',
  was_overdue boolean DEFAULT false,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Reconciliation Transactions
CREATE TABLE reconciliation_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL REFERENCES clients(id),
  amount_paid numeric NOT NULL,
  reconciliation_date date NOT NULL,
  reference_id text NOT NULL DEFAULT '',
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Invoice Reconciliation Details (junction table)
CREATE TABLE invoice_reconciliation_details (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id uuid NOT NULL REFERENCES invoices(id),
  reconciliation_transaction_id uuid NOT NULL REFERENCES reconciliation_transactions(id),
  amount_applied numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Client Credit Transactions
CREATE TABLE client_credit_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL REFERENCES clients(id),
  amount numeric NOT NULL,
  transaction_type text NOT NULL,
  invoice_id uuid REFERENCES invoices(id),
  reconciliation_transaction_id uuid REFERENCES reconciliation_transactions(id),
  batch_id text,
  created_at timestamptz DEFAULT now()
);

-- Activity Logs
CREATE TABLE activity_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  user_name text NOT NULL,
  action_type text NOT NULL,
  description text,
  timestamp timestamptz DEFAULT now()
);

-- Enable RLS on all tables (with permissive "allow all" policies as currently configured)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE reconciliation_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_reconciliation_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON reconciliation_transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON invoice_reconciliation_details FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON client_credit_transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON activity_logs FOR ALL USING (true) WITH CHECK (true);
```

---

## 4. Database Functions

### 4.1 `get_dashboard_stats(p_client_id uuid DEFAULT NULL)`

Returns: total_receivables, total_overdue, total_clients, total_invoices, paid_invoices, unpaid_invoices.

- total_receivables = SUM(left_amount) for all invoices (or filtered by client).
- total_overdue = SUM(left_amount) WHERE status != 'PAID' AND current_date > (invoice_date + max_aging_days).
- Overdue is a subset of receivables.

### 4.2 `get_client_breakdown(p_limit, p_offset)`

Returns per-client breakdown: receivables, overdue, invoice counts. Paginated, sorted by overdue amount descending.

### 4.3 `get_client_breakdown_count()`

Returns total count of active (non-deleted) clients.

### 4.4 `get_analytics_stats()`

Returns: total_ar, total_credit_sales, days_since_start, start_date, ar_last_30_days, sales_last_30_days, weighted_avg_dso, total_invoice_count.

Weighted Average DSO formula per invoice:
```
(SUM(payment_amount * days_from_invoice_to_payment) + (remaining_balance * days_since_invoice)) / total_value
```
Final metric = AVG of all individual invoice weighted DSOs.

Payment sources: `invoice_reconciliation_details` (direct payments) + `client_credit_transactions` where type = 'CREDIT_APPLIED'.

### 4.5 `update_overdue_flags()`

Daily cron job. Sets `was_overdue = TRUE` on invoices where:
- `was_overdue = FALSE`
- `left_amount > 0`
- `invoice_date + max_aging_days < CURRENT_DATE`

Once TRUE, never reverts.

---

## 5. Edge Functions (Backend Logic)

### 5.1 `process-reconciliation`

**Purpose:** Process a single client payment against their unpaid invoices.

**Input:** `{ clientId, paymentAmount, reconciliationDate, userId, batchId? }`

**Logic:**
1. Generate or use provided batch ID (format: `YYYYMM-NNNNNN`).
2. Fetch client's unpaid invoices sorted by `invoice_date` ASC (FIFO).
3. Calculate total debt. If payment > debt, excess becomes overpayment credit.
4. Create `reconciliation_transactions` record.
5. Apply payment to invoices in FIFO order, updating `left_amount`, `status`, `paid_at`.
6. Insert `invoice_reconciliation_details` for each affected invoice.
7. Verify all updates succeeded (read-back verification).
8. If overpayment: update `clients.credit_balance`, insert `client_credit_transactions` (type: 'OVERPAYMENT').
9. Final accounting verification: `payment = applied + credit`.
10. On failure: full rollback of all changes.

**Resilience:** Retry with exponential backoff (3 attempts, 2s base delay). Full rollback on failure.

### 5.2 `reverse-reconciliation`

**Purpose:** Reverse a single transaction or entire batch.

**Input:** `{ transactionId?, batchId?, userId }`

**Logic:**
1. Fetch transaction(s) to reverse.
2. For each transaction:
   - Restore invoice `left_amount` and `status` to pre-payment state.
   - Reverse `client_credit_transactions` (subtract from credit balance).
   - Delete `client_credit_transactions` records.
   - Delete `invoice_reconciliation_details`.
   - Delete `reconciliation_transactions`.
   - Verify all deletions.
3. On failure: rollback to pre-reversal state.

### 5.3 `apply-credit-to-invoice`

**Purpose:** Apply a client's existing credit balance to a single new invoice.

**Input:** `{ invoiceId, clientId }`

**Logic:**
1. Check client's `credit_balance`. If zero, skip.
2. Apply min(credit, invoice left_amount) to the invoice.
3. Determine contributing batch IDs using FIFO on `client_credit_transactions`.
4. Update invoice: reduce `left_amount`, set `settled_from_credit`, update `credit_batch_ids`, set `paid_at` if fully paid.
5. Reduce client's `credit_balance`.
6. Insert `client_credit_transactions` (type: 'CREDIT_APPLIED', negative amount).

### 5.4 `apply-credit-bulk`

**Purpose:** Apply client credit to multiple invoices at once (called after reconciliation creates overpayment).

**Input:** `{ clientId, invoiceIds? }`

**Logic:** Same as apply-credit-to-invoice but operates on all unpaid invoices for the client in FIFO order.

### 5.5 `send-past-due-notification`

**Purpose:** Daily email report of past-due invoices.

**Logic:**
1. Fetch all unpaid invoices (paginated).
2. Fetch all clients (paginated).
3. Filter invoices where `today > invoice_date + max_aging_days`.
4. Generate HTML email with styled table of past-due invoices.
5. Send via Resend to `finance.app.notification@illa.com.eg`.
6. If no past-due invoices, sends an "all clear" email.

**Uses Egypt timezone (Africa/Cairo).**

### 5.6 `cleanup-credit-reconciliations`

**Purpose:** One-time cleanup utility. Removes incorrectly created `reconciliation_transactions` with `CREDIT-*` reference IDs that were system-generated (created_by is null).

---

## 6. Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui (Radix primitives) |
| State/Data | TanStack React Query, React Context |
| Routing | React Router v6 |
| Backend | Supabase (PostgreSQL + Edge Functions / Deno) |
| Email | Resend |
| Analytics | Mixpanel |
| Excel I/O | xlsx (SheetJS) |
| Date Handling | date-fns |

---

## 7. Approvals Queue — Feature Detail

### 7.1 Page Structure

The Approvals Queue (`/approvals-queue`) is organized into two sub-tabs using the `Tabs` component from `@/components/ui/tabs`:

| Tab | Content |
|-----|---------|
| Review Submissions (default) | Filter bar (Date Range Picker, Agent Filter, Clear Filters) + Agent Accordion with submission tables |
| Performance Analytics | Filter bar (same shared state) + 3 Summary Cards + Dynamic Collection History Bar Chart |

### 7.2 State Management

| State Variable | Type | Purpose |
|----------------|------|---------|
| `dateRange` | `{ from: Date \| null; to: Date \| null }` | Shared date range filter across both tabs |
| `calendarOpen` | `boolean` | Controls popover visibility for the range calendar |
| `selectedAgentFilter` | `string \| null` | Agent dropdown filter |
| `agentSummaries` | `AgentSummary[]` | Pending submission counts per agent |
| `leaderboard` | `LeaderboardEntry[]` | Top 5 agents by approved amount |
| `totalApproved` | `number` | Sum of approved amounts in the selected range |
| `chartData` | `ChartEntry[]` | Dynamic bar chart data (one entry per day) |

### 7.3 Date Range Filtering

The `getQueryWindow()` helper converts the `dateRange` state into UTC-safe query boundaries:

- Uses `getEgyptDayRange(date)` — a DST-safe utility that calculates the UTC offset for Africa/Cairo dynamically using `Intl.DateTimeFormat`.
- `from` date -> start of day in Cairo local time.
- `to` date -> end of day in Cairo local time.
- When no range is set, no date filter is applied (All Dates).
- When only `from` is set, it acts as a single-day filter.

All five fetch functions (`fetchAgentSummaries`, `fetchLeaderboard`, `fetchTotalApproved`, `fetchSubmissions`, `fetchChartData`) use this helper.

### 7.4 Dynamic Collection History Chart

- If a date range is selected, generates one bar for each calendar day in the range (no gaps).
- If no range is selected, defaults to the last 7 days.
- Groups approved `agent_submissions` by Cairo-local date string using `Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Cairo' })`.
- Chart rendered with Recharts `BarChart` + `ResponsiveContainer`.

### 7.5 Table Column Alignment

All 7 columns have explicit width constraints and alignment classes to prevent layout shifting:

| Column | Header Class | Cell Class |
|--------|-------------|------------|
| Checkbox | `w-10 text-center px-3` | `text-center px-3` |
| Client Name | `min-w-[140px]` | (default) |
| Client Phone | `min-w-[110px]` | (default) |
| Amount Collected | `min-w-[130px]` | (default) |
| Promise Date | `min-w-[150px]` | (default) |
| Partial Reason | `max-w-[180px]` | `max-w-[180px]` |
| Receipt Photo | `text-center w-[100px]` | `text-center` |

### 7.6 Translation Keys (Approvals Queue)

| Key | English | Arabic |
|-----|---------|--------|
| `approvals.reviewTab` | Review Submissions | مراجعة التحصيلات |
| `approvals.analyticsTab` | Performance Analytics | تحليلات الأداء |
| `approvals.dateRange` | Date Range | نطاق التاريخ |
| `approvals.startDate` | Start Date | تاريخ البداية |
| `approvals.endDate` | End Date | تاريخ النهاية |
| `approvals.to` | to | إلى |
| `approvals.allDates` | All Dates | كل التواريخ |
| `approvals.clientPhone` | Client Phone | هاتف العميل |
| `approvals.partialReason` | Partial Reason | سبب الدفع الجزئي |
| `approvals.receiptPhoto` | Receipt Photo | صورة الإيصال |
| `approvals.last7Days` | Last 7 Days | آخر 7 أيام |

### 7.7 Removed Features

- **Admin Notes**: The `admin_notes` column was removed from the `agent_submissions` table. The Approvals Queue review workflow focuses exclusively on verifying Amount Collected and Promise Date.

### 7.8 Database Indexes

#### `idx_invoices_lookup_composite`

- **Table:** `public.invoices`
- **Columns:** `(client_id, status)` — composite B-tree
- **Purpose:** Eliminates sequential scans on the invoices table for receivables and overdue aggregation queries. With 100,000+ invoice records across 4,000 clients, this index allows PostgreSQL to jump directly to a specific client's unpaid records rather than scanning the full table.
- **Queries Optimized:**
  - `get_dashboard_stats` — total receivables / overdue per client
  - `get_client_breakdown` — client-level AR breakdown with pagination
  - `get_collection_management_breakdown` — agent collection workflow
  - `get_overdue_collection_breakdown` — overdue-only filtered view
  - Invoice list queries filtered by client and status
- **Design Decision:** `client_id` is placed first (left-to-right) because all core queries filter by client before narrowing by status. This matches the B-tree traversal order for maximum selectivity.

### 7.9 Relaxed Bulk Import/Update Validation (First Rollout)

#### Overview

For the initial rollout, bulk import and bulk update validation has been relaxed to allow incomplete client data. This enables faster onboarding of client records that can be cleaned up later.

#### Relaxed Fields

| Field | If Missing | Default Value |
|-------|-----------|---------------|
| `territory` | Allowed | `'Pending'` |
| `territory_code` | Allowed | `null` |
| `phone_number` | Allowed | `'Pending'` |
| `street` | Allowed | `'Pending'` |
| `gps_coordinates` | Allowed | `null` |

#### Still Mandatory

- `name` — Client name is always required
- `code` — Client code is always required

#### Territory Code Mapping Rule

The strict 1:1 mapping between `territory_code` and `territory` is still enforced **only when a territory code is provided**. If both territory and territory_code are left blank, the row passes validation.

#### UI Indicators

Fields with `'Pending'` or `null`/empty values are displayed in the Clients table with light grey italic text (`text-muted-foreground/50 italic`) so administrators can easily identify clients that still need data cleaning.

#### Affected Functions

- `handleFileUpload` (Import) — relaxed validation, defaults applied on insert
- `handleBulkUpdate` — relaxed validation, defaults applied on update

### 7.10 Chunked Bulk Operations

#### Problem
Bulk import and bulk update of 4,000+ clients caused browser timeouts when processing rows sequentially, resulting in partial updates.

#### Solution
Both `handleFileUpload` (import) and `handleBulkUpdate` now process database operations in **parallel chunks of 200 rows**. Within each chunk, all Supabase calls execute concurrently via `Promise.all()`. After each chunk completes, the table is incrementally refreshed so the user sees rows update in real-time.

#### Progress Indicator
A `Progress` bar with "Updating X of Y..." text is displayed above the table during bulk operations, using the `bulkProgress` state variable.

#### Error Handling
If a chunk contains failed rows, processing **continues** with remaining chunks. All errors are collected and displayed in the `ImportErrorModal` at the end, with a summary toast showing how many succeeded vs failed.

#### Pending Field Consistency
All table cells for `territory`, `territory_code`, `phone_number`, `street`, and `gps_coordinates` consistently display "Pending" in grey italic (`text-muted-foreground/50 italic`) when the value is `null`, empty string, or the literal `'Pending'`.

### 7.11 Incomplete Data Indicator (Collection Management)

The Collection Management breakdown table displays an orange warning icon (⚠️ `AlertTriangle`) next to the client name for any client with incomplete mandatory data.

#### Data Logic
After fetching the `get_collection_management_breakdown` RPC results, a secondary query fetches five fields from the `clients` table (`territory`, `territory_code`, `phone_number`, `street`, `gps_coordinates`) for the returned client IDs. A client is flagged as "incomplete" if any field is `NULL`, empty string, or the placeholder `'Pending'`.

#### UI Implementation
- An orange `AlertTriangle` icon (from `lucide-react`) appears next to the client name in the breakdown table.
- Hovering the icon shows a `Tooltip` listing the specific missing fields (e.g., "Missing: GPS Coordinates, Street").
- The `incompleteFields` array stores **translation keys** (e.g., `'clients.street'`) rather than pre-translated strings. At render time, each key is resolved via `t()` — ensuring the tooltip updates instantly when the user switches language (EN ↔ AR).

#### Translation Keys
- `overdue.incompleteData` — EN: "Incomplete Data" / AR: "بيانات غير مكتملة"
- `overdue.missingFields` — EN: "Missing" / AR: "مفقود"

### 7.12 Agent Status Toggle (Active/Disabled)

Agents can be toggled between Active and Disabled status instead of being deleted, preserving historical data integrity.

#### Database
- `agents.is_active` — `boolean NOT NULL DEFAULT true`

#### Disabling Validation
Before setting `is_active = false`, the system checks `agent_submissions` for records with `status = 'pending'`. If any exist, the operation is blocked with an error message.

#### Cleanup on Disable
When an agent is successfully disabled, all records in `client_agent_assignments` for that agent are automatically deleted to clear their task list.

#### UI
- **Agent Table**: A "Status" column displays color-coded badges — green for Active, grey for Disabled.
- **Edit Agent Dialog**: A `Switch` toggle controls the `is_active` field.
- **Assign Agent Dropdown**: Only agents with `is_active = true` appear in the assignment dropdown.

#### Translation Keys
- `overdue.status` — EN: "Status" / AR: "الحالة"
- `overdue.active` — EN: "Active" / AR: "نشط"
- `overdue.disabled` — EN: "Disabled" / AR: "موقوف"
- `overdue.activeStatus` — EN: "Active Status" / AR: "الحالة النشطة"
- `overdue.cannotDisableAgent` — EN: "Cannot disable agent..." / AR: "لا يمكن إيقاف المندوب..."
- `overdue.agentDisabled` — EN: "Agent disabled successfully" / AR: "تم إيقاف المندوب بنجاح"

### 7.13 Mixpanel Tracking — Collection Management & Approvals Queue

Comprehensive Mixpanel event tracking was added to both the Collection Management (`/overdue-collection`) and Approvals Queue (`/approvals`) pages.

#### Collection Management Events (~15 events)
- **Page & Tab**: `View - Collection Management Page`, tab switches (Breakdown / Agent Management)
- **Filters**: Territory filter, Agent filter, Sort column changes, Search (debounced 500ms), Page size changes
- **Agent Actions**: `Agent Assigned`, `Agent Unassigned`, `Agent Created`, `Agent Updated`, `Agent Status Changed`, `Agent Status Change Blocked`
- **Dialogs**: `Assign Dialog Opened`, `Create Agent Dialog Opened`, `Edit Agent Dialog Opened`

#### Approvals Queue Events (~8 events)
- **Page & Tab**: `View - Approvals Queue`, tab switches (Review / Analytics)
- **Filters**: Date filter, Agent filter, Filters cleared
- **Actions**: `Submission Approved` (with `agent_name`, `approved_count`, `total_amount`, `batch_id`), `Submission Rejected` (with `agent_name`, `rejected_count`)
- **Navigation**: `Agent Expanded` (accordion open with `pending_count`)

#### Implementation
- `useMixpanel` hook used in both pages for `track`, `trackPageView`, `trackTabChange`, `trackSearch`
- All events documented in `docs/Mixpanel_Events.md`
