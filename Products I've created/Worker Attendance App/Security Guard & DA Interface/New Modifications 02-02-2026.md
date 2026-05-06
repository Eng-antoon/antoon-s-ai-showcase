# System Modifications - February 2, 2026

## Executive Summary

Major architectural changes to the worker role and payment tracking system. This document captures **ALL modifications** made on 2026-02-02 to guide the dashboard system update. The changes introduce a **company-centric role-based payment system** where rates are stored per-company per-role, replacing the legacy flat `daily_worker_rate` approach.

---

## 1. Database Schema Changes

### 1.1 New ENUMs Created

#### `work_sector` ENUM
```sql
CREATE TYPE public.work_sector AS ENUM ('frontdoor', 'distribution');
```
- **Purpose**: Categorizes the work area/department
- **Values**: 
  - `frontdoor` (فرونتدور) - Frontdoor operations
  - `distribution` (تجزئة) - Distribution operations

#### `worker_role_type` ENUM
```sql
CREATE TYPE public.worker_role_type AS ENUM (
  'delivery_labor',
  'delivery_agent',
  'driver',
  'worker_coordinator',
  'delivery_team_leader',
  'delivery_invoicing',
  'forklift_driver',
  'warehouse_keeper',
  'warehouse_labor',
  'stock_control',
  'security_guard',
  'security_supervisor',
  'cleaning_labor',
  'external_driver',
  'external_worker'
);
```
- **Purpose**: Defines all possible worker job types
- **15 roles total**: 8 entry roles, 4 exit roles, 3 both/special

---

### 1.2 New Tables

#### `worker_roles` Table (Role Definitions)
```sql
CREATE TABLE public.worker_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key worker_role_type NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,           -- Arabic display name
  name_en TEXT NOT NULL,           -- English display name
  applies_to TEXT NOT NULL,        -- 'entry', 'exit', or 'both'
  category TEXT NOT NULL,          -- 'delivery_team' or 'warehouse_team'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS: Read-only for all users
ALTER TABLE public.worker_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view worker roles" ON public.worker_roles 
  FOR SELECT USING (true);
```

**Complete Role Data:**
| key | name_ar | name_en | applies_to | category |
|-----|---------|---------|------------|----------|
| delivery_labor | عامل توصيل | Delivery Labor | exit | delivery_team |
| delivery_agent | مندوب توصيل | Delivery Agent | exit | delivery_team |
| driver | سائق مخزن | Driver | entry | delivery_team |
| worker_coordinator | عامل تنسيق | Worker Coordinator | entry | delivery_team |
| delivery_team_leader | مشرف المناديب | Delivery Team Leader | entry | delivery_team |
| delivery_invoicing | مسئول فواتير | Delivery Invoicing | entry | delivery_team |
| external_driver | سائق خارجي | External Driver | exit | delivery_team |
| external_worker | عامل خارجي | External Worker | exit | delivery_team |
| forklift_driver | سائق معدات | Forklift Driver | entry | warehouse_team |
| warehouse_keeper | أمين المخزن | Warehouse Keeper | entry | warehouse_team |
| warehouse_labor | عامل المخازن | Warehouse Labor | entry | warehouse_team |
| stock_control | مراقب مخزون | Stock Control | entry | warehouse_team |
| security_guard | عامل الامن | Security Guard | entry | warehouse_team |
| security_supervisor | مشرف الامن | Security Supervisor | entry | warehouse_team |
| cleaning_labor | عامل نظافة | Cleaning Labor | entry | warehouse_team |

---

#### `company_role_rates` Table (Per-Company Pricing)
```sql
CREATE TABLE public.company_role_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES company_providers(id) ON DELETE CASCADE,
  role_key worker_role_type NOT NULL,
  rate NUMERIC NOT NULL,           -- Payment rate in local currency
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(company_id, role_key)     -- One rate per company per role
);

-- RLS: Full CRUD for admin operations
ALTER TABLE public.company_role_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view company role rates" ON public.company_role_rates FOR SELECT USING (true);
CREATE POLICY "Anyone can insert company role rates" ON public.company_role_rates FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update company role rates" ON public.company_role_rates FOR UPDATE USING (true);
```

**Key Architecture Points:**
- ✅ Rates are **company-specific** - no system-wide default rates
- ✅ If a role has no rate for a company, it's **excluded from UI**
- ✅ Rates are **NOT inherited** from worker_roles table
- ✅ Each company manages their own role rates independently

---

### 1.3 Modified Tables

#### `attendance_logs` - New Columns
```sql
ALTER TABLE public.attendance_logs 
  ADD COLUMN sector work_sector,
  ADD COLUMN worker_role worker_role_type,
  ADD COLUMN payment_amount NUMERIC DEFAULT 0;
```

**Column Details:**
| Column | Type | Purpose |
|--------|------|---------|
| `sector` | work_sector ENUM | Records which sector (frontdoor/distribution) the worker was assigned to |
| `worker_role` | worker_role_type ENUM | Records the specific job role performed that day |
| `payment_amount` | NUMERIC | **FROZEN SNAPSHOT** of the rate at check-in time |

**CRITICAL: Payment Amount Freezing**
The `payment_amount` is captured at the moment of check-in and **never recalculated**. This ensures:
- Historical payroll accuracy (even if rates change)
- Audit trail of what was agreed at time of work
- No retroactive payment changes

---

### 1.4 All Migrations Applied (in order)

```sql
-- Migration 1: Create work_sector ENUM
CREATE TYPE public.work_sector AS ENUM ('frontdoor', 'distribution');

-- Migration 2: Create worker_role_type ENUM
CREATE TYPE public.worker_role_type AS ENUM (
  'delivery_labor', 'delivery_agent', 'driver', 'worker_coordinator',
  'delivery_team_leader', 'delivery_invoicing', 'forklift_driver',
  'warehouse_keeper', 'warehouse_labor', 'stock_control',
  'security_guard', 'security_supervisor', 'cleaning_labor'
);

-- Migration 3: Create worker_roles table
CREATE TABLE public.worker_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key worker_role_type NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  applies_to TEXT NOT NULL CHECK (applies_to IN ('entry', 'exit', 'both')),
  category TEXT NOT NULL CHECK (category IN ('delivery_team', 'warehouse_team')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.worker_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view worker roles" ON public.worker_roles FOR SELECT USING (true);

-- Migration 4: Create company_role_rates table
CREATE TABLE public.company_role_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES company_providers(id) ON DELETE CASCADE,
  role_key worker_role_type NOT NULL,
  rate NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(company_id, role_key)
);
ALTER TABLE public.company_role_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view company role rates" ON public.company_role_rates FOR SELECT USING (true);
CREATE POLICY "Anyone can insert company role rates" ON public.company_role_rates FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update company role rates" ON public.company_role_rates FOR UPDATE USING (true);

-- Migration 5: Add columns to attendance_logs
ALTER TABLE public.attendance_logs 
  ADD COLUMN sector work_sector,
  ADD COLUMN worker_role worker_role_type,
  ADD COLUMN payment_amount NUMERIC DEFAULT 0;

-- Migration 6: Insert role definitions
INSERT INTO worker_roles (key, name_ar, name_en, applies_to, category) VALUES
  ('delivery_labor', 'عامل توصيل', 'Delivery Labor', 'exit', 'delivery_team'),
  ('delivery_agent', 'مندوب توصيل', 'Delivery Agent', 'exit', 'delivery_team'),
  ('driver', 'سائق مخزن', 'Driver', 'entry', 'delivery_team'),
  ('worker_coordinator', 'عامل تنسيق', 'Worker Coordinator', 'entry', 'delivery_team'),
  ('delivery_team_leader', 'مشرف المناديب', 'Delivery Team Leader', 'entry', 'delivery_team'),
  ('delivery_invoicing', 'مسئول فواتير', 'Delivery Invoicing', 'entry', 'delivery_team'),
  ('forklift_driver', 'سائق معدات', 'Forklift Driver', 'entry', 'warehouse_team'),
  ('warehouse_keeper', 'أمين المخزن', 'Warehouse Keeper', 'entry', 'warehouse_team'),
  ('warehouse_labor', 'عامل المخازن', 'Warehouse Labor', 'entry', 'warehouse_team'),
  ('stock_control', 'مراقب مخزون', 'Stock Control', 'entry', 'warehouse_team'),
  ('security_guard', 'عامل الامن', 'Security Guard', 'entry', 'warehouse_team'),
  ('security_supervisor', 'مشرف الامن', 'Security Supervisor', 'entry', 'warehouse_team'),
  ('cleaning_labor', 'عامل نظافة', 'Cleaning Labor', 'entry', 'warehouse_team')
ON CONFLICT (key) DO NOTHING;

-- Migration 7: Add external worker roles to ENUM
ALTER TYPE public.worker_role_type ADD VALUE IF NOT EXISTS 'external_driver';
ALTER TYPE public.worker_role_type ADD VALUE IF NOT EXISTS 'external_worker';

-- Migration 8: Insert external role definitions
INSERT INTO worker_roles (key, name_ar, name_en, applies_to, category) VALUES
  ('external_driver', 'سائق خارجي', 'External Driver', 'exit', 'delivery_team'),
  ('external_worker', 'عامل خارجي', 'External Worker', 'exit', 'delivery_team')
ON CONFLICT (key) DO NOTHING;
```

---

## 2. Role Architecture

### 2.1 Company-Centric Rate System

```
┌─────────────────────────────────────────────────────────────┐
│                    RATE LOOKUP HIERARCHY                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Check company_role_rates for (company_id, role_key)     │
│     ↓ Found? → Use that rate                                │
│     ↓ Not found? → Role is NOT AVAILABLE for this company   │
│                                                             │
│  ⚠️ NO FALLBACK TO worker_roles.default_rate               │
│  ⚠️ NO SYSTEM-WIDE DEFAULT RATES                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Business Logic:**
- Each company **must explicitly configure** rates for roles they use
- Roles without configured rates are **hidden from UI** (not selectable)
- This prevents accidental zero-rate check-ins

### 2.2 Role Categories

```
┌─────────────────────────────────────────────────────────────┐
│                      ROLE CATEGORIES                         │
├──────────────────────────┬──────────────────────────────────┤
│      DELIVERY TEAM       │        WAREHOUSE TEAM            │
├──────────────────────────┼──────────────────────────────────┤
│ • delivery_labor (exit)  │ • forklift_driver (entry)        │
│ • delivery_agent (exit)  │ • warehouse_keeper (entry)       │
│ • driver (entry)         │ • warehouse_labor (entry)        │
│ • worker_coordinator     │ • stock_control (entry)          │
│ • delivery_team_leader   │ • security_guard (entry)         │
│ • delivery_invoicing     │ • security_supervisor (entry)    │
│ • external_driver (exit) │ • cleaning_labor (entry)         │
│ • external_worker (exit) │                                  │
└──────────────────────────┴──────────────────────────────────┘
```

### 2.3 Entry vs Exit Roles

| applies_to | Use Case | Example Flow |
|------------|----------|--------------|
| `entry` | Workers arriving at warehouse | Guard Dashboard → "دخول" tab |
| `exit` | Workers going out on delivery | DA Checkin → Tour workers |
| `both` | (Reserved for future use) | N/A |

**Critical:** The DA Checkin flow ONLY shows `exit` roles because workers are leaving for delivery tours.

### 2.4 External Worker Roles

Two new roles specifically for non-contracted workers:

| Role Key | Arabic | Use Case |
|----------|--------|----------|
| `external_driver` | سائق خارجي | Truck drivers not on company payroll |
| `external_worker` | عامل خارجي | Store helpers, unloaders at delivery locations |

**Special handling:**
- `warehouse_id` is set to `NULL` in attendance_logs
- `payment_amount` is manually entered by DA (not from company rates)
- Logged with `log_type='external_worker'`

---

## 3. Frontend Changes

### 3.1 Constants Updated

**File:** `src/lib/constants.ts`

```typescript
// Worker role type enum values (matches PostgreSQL worker_role_type enum)
export const WORKER_ROLE_TYPES = [
  'delivery_labor',
  'delivery_agent',
  'driver',
  'worker_coordinator',
  'delivery_team_leader',
  'delivery_invoicing',
  'forklift_driver',
  'warehouse_keeper',
  'warehouse_labor',
  'stock_control',
  'security_guard',
  'security_supervisor',
  'cleaning_labor',
  'external_driver',    // NEW
  'external_worker'     // NEW
] as const;

// Static fallback data for role definitions (no rates)
export const WORKER_ROLES_FALLBACK: WorkerRoleMetadata[] = [
  // ... includes all 15 roles with Arabic/English names, applies_to, category
];
```

### 3.2 Components Modified

#### `DriverRegistrationForm.tsx`
- Added profile existence check via `national_id`
- **Existing workers:** Shows read-only name/phone/company, only payment editable
- **New workers:** Full editable form
- Uses `external_driver` as `worker_role`

#### `StoreWorkerForm.tsx`
- Added profile existence check via `national_id`
- **Existing workers:** Shows read-only data, payment and order selection only
- **New workers:** Full editable form
- Uses `external_worker` as `worker_role`

#### `NIDRegistrationForm.tsx`
- Company field is **read-only** when pre-assigned (from existing worker data)
- Prevents company mismatch for existing workers

#### `DailyAssignmentModal.tsx`
- Receives `currentTab` prop to filter roles by `applies_to`
- Shows roles grouped by category (Delivery Team / Warehouse Team)
- Displays only roles that have configured rates for the selected company

### 3.3 New Hooks

#### `useCompanyRoles.ts`
```typescript
interface CompanyRole {
  key: WorkerRoleType;
  name_ar: string;
  name_en: string;
  applies_to: 'entry' | 'exit' | 'both';
  category: 'delivery_team' | 'warehouse_team';
  rate: number;  // From company_role_rates
}

function useCompanyRoles({ companyId, tab }: UseCompanyRolesOptions) {
  // Fetches roles ONLY if they have rates configured for this company
  // Returns grouped roles (deliveryTeam, warehouseTeam)
}
```

### 3.4 Flow Changes

#### DA Checkin Flow Fix
```tsx
// BEFORE (Bug)
<DailyAssignmentModal currentTab="entry" ... />

// AFTER (Fixed)
<DailyAssignmentModal currentTab="exit" ... />
```
This ensures DA workers only see delivery-related roles (exit roles).

---

## 4. Edge Functions Updated

### 4.1 `check-national-id`

**New Input Parameters:**
```typescript
{
  national_id: string;      // 14-digit ID
  gps_lat: number;
  gps_lng: number;
  warehouse_id?: string;
  log_type?: string;        // Default: 'warehouse_entry'
  trip_data?: TripData;
  worker_role?: string;     // NEW: worker_role_type value
  sector?: string;          // NEW: work_sector value
  role_payment_amount?: number; // NEW: Override payment amount
}
```

**Payment Calculation Logic:**
```typescript
// 1. Use provided role_payment_amount if available
// 2. Otherwise, lookup company_role_rates for (worker.company_id, worker_role)
// 3. NO FALLBACK - if no rate found, payment_amount = 0
```

### 4.2 `register-and-attend-nid`

**New Input Parameters:**
```typescript
{
  // ... existing fields ...
  worker_role?: string;     // NEW
  sector?: string;          // NEW
  payment_amount?: number;  // For external workers (manual entry)
}
```

**Existence Check Logic:**
```typescript
// If national_id provided:
//   1. Check if profile exists
//   2. If exists: Log attendance only (don't create duplicate profile)
//   3. If not exists: Create profile + log attendance
```

---

## 5. Dashboard Requirements

### 5.1 Company Role Rates Management (CRITICAL)

**Required Admin Features:**

1. **View Company Rates**
   - List all companies with their configured rates
   - Show which roles are configured vs missing per company

2. **Add/Edit Rate Configuration**
   ```
   ┌────────────────────────────────────────────────┐
   │ Company: [Dropdown: company_providers]         │
   │ Role: [Dropdown: worker_roles]                 │
   │ Rate (EGP): [Number Input]                     │
   │ [Save] [Cancel]                                │
   └────────────────────────────────────────────────┘
   ```

3. **Bulk Rate Configuration**
   - Allow setting all 15 roles for a company at once
   - Copy rates from another company as template

4. **Rate Validation**
   - Warn if a company has no rates configured
   - Show which roles are missing for each company

**API Calls Needed:**
```typescript
// Fetch all rates for a company
supabase.from('company_role_rates')
  .select('*, worker_roles!inner(name_ar, name_en, category)')
  .eq('company_id', companyId)

// Upsert rate
supabase.from('company_role_rates')
  .upsert({ company_id, role_key, rate }, { onConflict: 'company_id,role_key' })

// Delete rate
supabase.from('company_role_rates')
  .delete()
  .eq('company_id', companyId)
  .eq('role_key', roleKey)
```

### 5.2 Worker Role Definitions (Read-Only View)

Display the `worker_roles` table for reference:
- Show all 15 roles
- Group by category (Delivery Team / Warehouse Team)
- Filter by applies_to (Entry / Exit)
- **No editing** - this table is managed by migrations only

### 5.3 Attendance Log Display Updates

**New Columns to Display:**
| Column | Display Name (Arabic) | Filter Options |
|--------|----------------------|----------------|
| `sector` | قطاع العمل | Dropdown: frontdoor, distribution |
| `worker_role` | نوع العمل | Dropdown: All 15 roles |
| `payment_amount` | المبلغ | Number range filter |

**Enhanced Attendance View:**
```
┌──────────────────────────────────────────────────────────────────────────┐
│ Date │ Worker Name │ Company │ Sector │ Role │ Payment │ Log Type │ Time │
├──────┼─────────────┼─────────┼────────┼──────┼─────────┼──────────┼──────┤
│ 02/02│ أحمد محمد   │ شركة أ  │ تجزئة  │ عامل │ 150     │ da_entry │ 08:30│
│      │             │         │        │ توصيل│         │          │      │
└──────────────────────────────────────────────────────────────────────────┘
```

### 5.4 Cost Tracking & Reporting

**New Reports Needed:**

1. **Daily Cost by Company**
   ```sql
   SELECT 
     DATE(check_in_date) as date,
     cp.name as company_name,
     COUNT(*) as worker_count,
     SUM(payment_amount) as total_cost
   FROM attendance_logs al
   JOIN profiles p ON al.profile_id = p.id
   JOIN company_providers cp ON p.company_id = cp.id
   WHERE payment_amount > 0
   GROUP BY DATE(check_in_date), cp.name
   ORDER BY date DESC, company_name;
   ```

2. **Cost by Role**
   ```sql
   SELECT 
     worker_role,
     wr.name_ar as role_name,
     COUNT(*) as attendance_count,
     SUM(payment_amount) as total_cost,
     AVG(payment_amount) as avg_payment
   FROM attendance_logs al
   LEFT JOIN worker_roles wr ON al.worker_role::text = wr.key::text
   WHERE worker_role IS NOT NULL
   GROUP BY worker_role, wr.name_ar;
   ```

3. **Cost by Sector**
   ```sql
   SELECT 
     sector,
     COUNT(*) as attendance_count,
     SUM(payment_amount) as total_cost
   FROM attendance_logs
   WHERE sector IS NOT NULL
   GROUP BY sector;
   ```

### 5.5 External Worker Tracking

**Special View for External Workers:**
- Filter by `log_type = 'external_worker'`
- Show manually entered payment amounts
- Track approval status from `worker_approvals` table
- Flag workers without company assignment

---

## 6. Data Model Diagram

```
┌─────────────────────┐     ┌─────────────────────┐
│  company_providers  │     │    worker_roles     │
├─────────────────────┤     ├─────────────────────┤
│ id (PK)             │     │ id (PK)             │
│ name                │     │ key (UNIQUE)        │
│ daily_worker_rate   │     │ name_ar             │
│ ...                 │     │ name_en             │
└─────────┬───────────┘     │ applies_to          │
          │                 │ category            │
          │                 └──────────┬──────────┘
          │                            │
          ▼                            ▼
┌─────────────────────────────────────────────────┐
│              company_role_rates                  │
├─────────────────────────────────────────────────┤
│ id (PK)                                          │
│ company_id (FK) ─────────────────────────────────┤
│ role_key (FK) ───────────────────────────────────┤
│ rate                                             │
│ UNIQUE(company_id, role_key)                     │
└─────────────────────────────────────────────────┘
                      │
                      │ Rate lookup at check-in
                      ▼
┌─────────────────────────────────────────────────┐
│                attendance_logs                   │
├─────────────────────────────────────────────────┤
│ id (PK)                                          │
│ profile_id (FK)                                  │
│ check_in_date                                    │
│ check_in_time                                    │
│ log_type                                         │
│ warehouse_id (FK, nullable)                      │
│ gps_lat, gps_lng                                 │
│ sector (NEW - work_sector ENUM)                  │
│ worker_role (NEW - worker_role_type ENUM)        │
│ payment_amount (NEW - FROZEN at check-in)        │
│ tour_id, plate_number, driver_name, etc.         │
└─────────────────────────────────────────────────┘
```

---

## 7. Migration Checklist for Dashboard

### Phase 1: Database Support
- [ ] Add `company_role_rates` CRUD operations
- [ ] Display new `attendance_logs` columns (sector, worker_role, payment_amount)
- [ ] Create rate lookup utility functions

### Phase 2: Admin UI
- [ ] Company rate configuration screen
- [ ] Role definitions reference view
- [ ] Enhanced attendance log filters

### Phase 3: Reporting
- [ ] Daily cost by company report
- [ ] Cost by role breakdown
- [ ] Cost by sector report
- [ ] External worker tracking view

### Phase 4: Validation
- [ ] Warn for companies without configured rates
- [ ] Highlight missing role configurations
- [ ] Audit trail for rate changes

---

## 8. Important Notes

### Breaking Changes
1. **Rate Logic Changed**: The `daily_worker_rate` on `company_providers` is now a **legacy fallback** only used for tour_workers when no role-specific rate exists.

2. **No Default Rates**: Unlike before, there are no system-wide default rates. Each company must have explicit rate configurations.

3. **External Workers**: These bypass the company rate system entirely - payment is manually entered.

### Backward Compatibility
- Existing attendance records without `sector`, `worker_role`, or `payment_amount` will have NULL values
- Legacy `daily_worker_rate` still exists but is not the primary rate source
- Old log types (`warehouse_entry`, `truck_exit`, `da_entry`) still work

### Rate Freeze Principle
```
┌─────────────────────────────────────────────────────────────┐
│ The payment_amount in attendance_logs is a SNAPSHOT         │
│ captured at check-in time. It NEVER changes, even if        │
│ the company_role_rates are updated later.                   │
│                                                             │
│ This ensures:                                               │
│ • Historical payroll accuracy                               │
│ • Audit compliance                                          │
│ • No retroactive payment disputes                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Quick Reference: TypeScript Types

```typescript
// Work sector
type WorkSector = 'frontdoor' | 'distribution';

// Worker role types (15 total)
type WorkerRoleType = 
  | 'delivery_labor' | 'delivery_agent' | 'driver'
  | 'worker_coordinator' | 'delivery_team_leader' | 'delivery_invoicing'
  | 'forklift_driver' | 'warehouse_keeper' | 'warehouse_labor'
  | 'stock_control' | 'security_guard' | 'security_supervisor'
  | 'cleaning_labor' | 'external_driver' | 'external_worker';

// Company role rate record
interface CompanyRoleRate {
  id: string;
  company_id: string;
  role_key: WorkerRoleType;
  rate: number;
  created_at: string;
}

// Enhanced attendance log
interface AttendanceLog {
  // ... existing fields ...
  sector: WorkSector | null;
  worker_role: WorkerRoleType | null;
  payment_amount: number;
}
```

---

*Document generated: February 2, 2026*
*For dashboard AI agent integration*
