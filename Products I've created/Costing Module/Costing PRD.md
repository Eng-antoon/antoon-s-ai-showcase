
# Full Product Requirements Document (PRD) - Capacity Tracker Pro

## 1. Product Overview

**Name:** Capacity Tracker Pro
**Version:** 1.0.0
**Currency:** Egyptian Pound (EGP)
**Industry:** Third-party logistics (3PL), warehousing, and last-mile delivery operations

Capacity Tracker Pro is a web-based capacity planning and cost tracking system designed for logistics and warehousing operations. It enables operations teams to plan monthly resource needs (workforce, equipment, trucks), forecast client volumes, track actual costs against planned budgets, and generate variance and executive reports. The system serves a multi-warehouse, multi-client environment where resources are shared across business lines.

---

## 2. Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui components
- **State Management:** React Context API (Auth, Theme, Notifications, Permissions) + TanStack React Query for server state
- **Charts:** Recharts
- **Backend:** Supabase (PostgreSQL database, Auth, Row-Level Security, Edge Functions)
- **Routing:** React Router v7 with lazy-loaded pages

---

## 3. User Roles and Permissions (RBAC)

The system implements a hierarchical Role-Based Access Control system with 10 roles:

| Role | Level | Description |
|------|-------|-------------|
| System Admin | 100 | Full system access: user management, configuration, all CRUD |
| Executive | 80 | Read-only across all modules; can export reports |
| Operations Director | 70 | Create/edit/submit plans, approve/reject requests, record actuals |
| Finance Manager | 55 | Full cost management, view plans, approve financial items |
| Warehouse Manager | 50 | Create/edit/submit warehouse plans, create requests, record actuals |
| Delivery Manager | 50 | Create/edit/submit delivery plans, create requests, record actuals |
| Approver | 45 | Approve or reject resource requests only |
| Finance Analyst | 40 | View-only costs, plans, and export reports |
| Request Submitter | 30 | Create and track own resource requests |
| Viewer | 10 | Read-only access to dashboard, plans, requests, costs |

Permission categories: Dashboard, Plans, Requests, Approvals, Actuals, Costs, Reports, Users, Config. Each combined with actions: View, Create, Edit, Delete, Submit, Approve, Reject, Export, Manage.

---

## 4. Database Schema (All Tables and Their Purpose)

### Core Planning Tables

**`capacity_plans`** -- The central entity. One plan per month per warehouse.
- `year`, `month` -- The planning period (e.g., January 2026)
- `working_days` -- Number of working days in the month (default 25); used for daily rate calculations and throughput
- `location_id` -- Which warehouse this plan is for (nullable = "All Warehouses")
- `status` -- Draft, Pending, Approved, Rejected (workflow lifecycle)
- `total_planned_cost` -- Sum of all resource costs (role salary x quantity)
- `total_actual_cost` -- Sum of recorded actuals
- `total_variance`, `variance_percentage` -- Difference between planned and actual
- `version` -- Plan version number
- `created_by`, `approved_by` -- User references for audit
- `notes` -- Free-text notes

**`client_forecasts`** -- Volume predictions per client per plan.
- `plan_id` -- Links to a capacity plan
- `client_id` -- Which client
- `business_line_id` -- Which business line (e.g., Distribution, CPC)
- `volume_cartons` -- Forecasted monthly carton volume
- `agreed_pallet_positions` -- Contracted storage capacity in pallet positions
- `turnover_days` -- **How many days it takes for a client's orders to deplete their agreed pallet positions.** Formula: Agreed PP / (Monthly Volume / Working Days). This is a contractual value entered manually. It indicates storage velocity -- lower turnover days means higher throughput relative to storage space.
- `daily_avg_cartons` -- Calculated: volume_cartons / working_days
- `monthly_total_cartons` -- Same as volume_cartons (stored for denormalization)
- `fm_trucks` -- Number of First Mile trucks needed for this client/business line
- `daily_rate` -- Optional daily throughput rate
- `forecast_type` -- Default "monthly"
- Unique constraint on (plan_id, client_id, business_line_id)

**`plan_items`** -- Resource allocation lines within a plan.
- `plan_id` -- Links to capacity plan
- `role_id` -- Which resource role (e.g., WH Man, Delivery Driver, MHE)
- `client_id` -- Optional: if resource is assigned to a specific client (used for LM resources)
- `planned_quantity` -- How many units of this role are planned
- `planned_cost` -- Calculated: role.base_salary x planned_quantity
- `source` -- "planned" (manually added) or "requested" (came from an approved request)
- `request_id`, `requested_by`, `requested_at` -- Traceability to the originating request

**`plan_actuals`** -- Actual performance recorded against plan items.
- `plan_id`, `role_id`, `plan_item_id` -- What was measured
- `actual_quantity`, `actual_cost` -- What actually happened
- `variance_quantity`, `variance_cost`, `variance_percentage` -- Computed differences
- `recorded_by`, `recorded_at` -- Audit trail
- `notes` -- Comments on the actual entry

### Warehouse Configuration Tables

**`warehouse_capacity`** -- Dock/door configuration for throughput calculations.
- `location_id` -- Which warehouse
- `dock_name` -- Name of the loading door/dock (e.g., "Door 1", "Door 2")
- `dock_capacity_per_truck` -- How many trucks can be loaded simultaneously at this dock
- `loading_time_mins` -- Average time to load one truck (minutes)
- `loading_hours_mins` -- Total available loading hours per day in minutes (e.g., 600 = 10 hours)
- `owned_trucks` -- Number of company-owned trucks
- `owned_truck_capacity` -- Carton capacity per owned truck
- `truck_capacity` -- Carton capacity per outsourced truck (default 400)
- `dock_capacity_per_trailer` -- Trailer loading slots
- `trailer_loading_time_mins` -- Trailer loading time
- `effective_date` -- When this configuration takes effect

**Throughput Calculation Formulas:**
```text
Trucks/Day = dock_capacity_per_truck x (loading_hours_mins / loading_time_mins)
Outsourced Trucks = Trucks/Day - owned_trucks
Cartons/Day = (owned_trucks x owned_truck_capacity) + (outsourced_trucks x truck_capacity)
Cartons/Month = Cartons/Day x working_days
Utilization % = Forecasted Volume / Cartons/Month x 100
```

**`storage_capacity`** -- Pallet position allocation per client per warehouse.
- `location_id` -- Which warehouse
- `client_id` -- Which client
- `storage_pp` -- Storage pallet positions allocated
- `inbound_pp` -- Inbound staging pallet positions
- `outbound_pp` -- Outbound staging pallet positions
- `storage_m2` -- Storage area in square meters

### Client and Reference Tables

**`clients`** -- Client master data.
- `name`, `is_active`, `notes`
- `business_model` -- Distribution, 3PL, CPC (Cost Per Case), 2PL
- `agreed_pallet_positions` -- Legacy field; actual PP now tracked in storage_capacity

**`client_business_lines`** -- Maps clients to business lines with agreed pallet positions.
- `client_id`, `business_line_id`
- `agreed_pallet_positions` -- PP per business line
- `is_active`, `notes`

**`business_lines`** -- Business line definitions (e.g., Distribution, CPC).
- `name`, `code`, `display_order`, `is_active`

**`locations`** -- Warehouse locations.
- `name`, `code`, `business_model`, `is_active`

**`roles`** -- Unified resource catalog (NOT user permission roles).
- `name` -- e.g., "WH Manager", "WH Man", "MHE", "LM Truck", "Shrink Wrap"
- `department` -- warehouse, delivery, admin, operations, consumables
- `category` -- manpower, machinery, equipment
- `base_salary` -- Monthly cost per unit
- `is_outsourced` -- Whether this is an outsourced role
- `is_active`

### Request and Approval Tables

**`requests`** -- Resource requests (additional manpower, machinery, etc.).
- `request_number` -- Auto-generated identifier
- `title`, `request_type` (manpower/machinery/equipment/other), `urgency` (low/medium/high/critical)
- `justification` -- Why the request is needed
- `plan_id` -- Linked capacity plan (optional)
- `start_date`, `end_date` -- Requested period
- `estimated_cost` -- Total estimated cost
- `status` -- Draft, Pending, Approved, Rejected, Cancelled
- `created_by`, `updated_by`

**`request_items`** -- Line items within a request.
- `request_id`, `role_id`
- `item_type` -- role, machinery, other
- `item_name`, `quantity`, `unit_cost`, `total_cost`

**`request_approvals`** -- Approval/rejection records.
- `request_id`, `approver_id`, `approval_level`
- `action` -- approved, rejected, escalated
- `comments` -- Approval/rejection reason
- Unique constraint on (request_id, approver_id, approval_level)

### Cost Management Tables

**`cost_categories`** -- Hierarchical cost category tree.
- `name`, `parent_id` (self-referencing for tree structure)
- `cost_type` -- Category classification
- `allocation_percentage`, `allocation_units` -- How costs are distributed
- `level`, `display_order` -- For UI rendering

**`monthly_costs`** -- Monthly cost entries by category.
- `plan_id`, `category_id`, `month`
- `planned_cost`, `actual_cost`
- `variance`, `variance_percentage`

**`revenue_entries`** -- Client revenue tracking.
- `client_id`, `location_id`, `year`, `month`
- `volume_cartons`, `price_per_carton`, `revenue`
- `direct_cost`, `gross_profit`, `gross_margin_pct`

### User and System Tables

**`user_profiles`** -- User profile data (full_name, department, phone, avatar, is_active).
**`user_roles`** -- Maps users to system roles with department, expiry, and granted_by.
**`profiles`** -- Legacy/view profile table with first/last name.
**`notifications`** -- In-app notification system (type, title, message, read status, action URL).
**`audit_logs`** -- Tracks create/update/delete actions with old/new data snapshots.
**`seasonality_index`** -- Monthly seasonality multipliers per client for volume adjustment.

### Lookup/Reference Tables
- `departments` -- warehouse, delivery, admin
- `plan_statuses` -- draft, pending, approved, rejected
- `request_statuses` -- draft, pending, approved, rejected, cancelled
- `request_types` -- manpower, machinery, other
- `urgency_levels` -- low, medium, high, critical (with weight)
- `notification_types` -- Notification category definitions
- `warehouse_business_lines` -- Maps warehouses to their supported business lines

---

## 5. Application Pages and Features

### 5.1 Login Page (`/login`)
- Email + password authentication via Supabase Auth
- Redirects to dashboard on success

### 5.2 Dashboard (`/`, `/dashboard`)
**Contains:**
- Welcome header with user's first name
- 4 KPI cards: Total Plans, Pending Requests, Budget Used, Active Clients (with trend indicators)
- Quick Actions panel: New Capacity Plan, New Request, Approvals Queue, View Reports (filtered by permissions)
- Recent Activity feed: plan approvals, pending requests, actuals submissions, variance alerts
- Capacity Utilization bars: per-location utilization percentage with color-coded status (Optimal/High Load/Underutilized/Over Capacity)
- Pending Approvals alert card (visible only to approver roles)

### 5.3 Capacity Plans

#### 5.3.1 Plans List (`/capacity-plans`)
- Year-grouped accordion/folder view
- Each year folder shows: plan count, total planned cost, total actual cost, average variance %
- Annual "Planned vs Actual" line chart per year
- Monthly plan cards in a grid showing status badge, working days, planned/actual costs
- Actions per plan: View, Edit, Delete, Duplicate
- **Duplicate Plan Dialog:** Clone a plan's details, forecasts (including FM trucks), and resource items to a new target month/year
- **Annual Report Export:** Download a yearly summary as CSV
- Filters: search, status, warehouse location

#### 5.3.2 New Plan (`/capacity-plans/new`) -- 5-Step Wizard
**Step 1 - Plan Details:**
- Year, Month, Working Days, Warehouse (location), Notes

**Step 2 - Client Forecasts and First Mile Trucks:**
- Add rows per client + business line combination
- Fields: Client, Business Line, Volume (Cartons), Pallet Positions, Turnover Days, FM Trucks
- FM Truck Summary cards (CPC vs DST totals)
- Validates no duplicate client+business_line combinations

**Step 3 - Warehouse Resources:**
- Add workforce/equipment items filtered to "warehouse" department roles
- Fields: Role (with salary displayed), Quantity
- Shows WH Cost Subtotal

**Step 4 - Last Mile Resources:**
- Add delivery-related roles (drivers, trucks)
- Fields: Role, Quantity, Assigned Client (optional -- for dedicated delivery resources)
- LM Truck Summary (total LM trucks, DST trucks)
- Shows LM Cost Subtotal

**Step 5 - Review/Summary:**
- Read-only overview of all entered data
- Save as Draft or Submit for Approval

**Data Export/Import:** Plans can be exported to CSV and imported back. This works across the create and detail pages.

#### 5.3.3 Plan Detail (`/capacity-plans/:planId`)
**Contains 5 tabs:**
1. **Overview:** Period, warehouse, version, status, dates, notes
2. **Client Forecasts:** Table with Client, Business Line, Volume, Pallet Positions, Turnover Days, FM Trucks, Daily Throughput (calculated: PP / Turnover Days), Daily Average, Monthly Total
3. **Resource Allocation:** WH and LM resource items with planned quantities, costs, and actuals entry capability. Shows "Requested" badge for items that originated from approved resource requests.
4. **Dock Configuration:** Warehouse dock specifications with throughput calculations. Summary cards: Monthly Capacity, Forecasted Volume, Utilization %, Status. Detailed table per dock with all calculation fields. Trailer throughput section.
5. **Storage Capacity:** Per-client pallet position breakdown (Storage PP, Inbound PP, Outbound PP, Storage M2). CRUD controls for admin users. Summary totals.

**Actions:** Edit (draft/approved/rejected plans by creator), Submit for Approval, Approve, Reject

#### 5.3.4 Edit Plan (`/capacity-plans/:planId/edit`)
- Same 5-step wizard as creation, pre-populated with existing data
- Uses delete/re-insert pattern for forecasts and items on save
- Allowed for draft, rejected, and approved plans (by creator)

### 5.4 Resource Requests

#### 5.4.1 Requests List (`/requests`)
- Table of all requests with status, type, urgency, dates, cost
- Filter and search capabilities

#### 5.4.2 New Request (`/requests/new`)
- Title, Request Type (manpower/machinery/equipment/other), Urgency
- Hierarchical plan selector: Warehouse -> Year -> Month
- Start Date, End Date, Justification, Notes
- Line Items: each with Role (filtered by type category), Quantity, Unit Cost
- Auto-calculated estimated total cost
- Save as Draft or Submit

#### 5.4.3 Request Detail (`/requests/:requestId`)
- Full request information with status timeline
- Line items table
- Approval history with comments
- **Approve Dialog:** Confirmation modal with optional comments
- **Reject Dialog:** Modal requiring a rejection reason (textarea)
- Actions: Approve, Reject (for approvers when status is "pending")

#### 5.4.4 Approvals Queue (`/requests/approvals`)
- Filtered view of requests pending the current user's approval

### 5.5 Costs

#### 5.5.1 Cost Dashboard (`/costs`)
- Filters: Month, Year, Capacity Plan, Business Model
- KPI cards: Planned Cost, Actual Cost, Variance, Variance %
- Hierarchical cost category tree with expand/collapse
- Each node shows: category name, level badge, planned amount, actual amount, allocation %
- Edit dialog for updating actual costs and notes
- Tabs: Dashboard view, Category tree view, Details view
- Business model filtering (Distribution, 3PL, CPC, 2PL)

#### 5.5.2 Actuals Entry (`/costs/actuals`)
- Select a capacity plan
- View planned resource items (by role)
- Enter actual quantities and costs
- Auto-calculate variance (quantity and cost)
- Bulk save and CSV import support
- Shows submission status and history

#### 5.5.3 Variance Analysis (`/costs/variance`)
- Planned vs Actual comparison by cost category
- Favorable (green) / Unfavorable (red) indicators
- Drill-down capability by category, location
- Cost trend visualization
- Export to CSV

### 5.6 Reports (`/reports`)
A catalog page listing 8 report types:

| Report | Type | Description |
|--------|------|-------------|
| Variance Analysis | Financial | Planned vs actual costs with drill-down by category/location/client |
| Executive Summary | Financial | High-level KPIs, capacity utilization, cost trends |
| Capacity Utilization | Capacity | Warehouse utilization rates and trend analysis |
| Client Performance | Operational | Volume rankings, revenue, and profit per client |
| Delivery Operations | Operational | Fleet metrics, staffing, route efficiency |
| Warehouse Operations | Operational | Throughput, storage utilization, labor metrics |
| Cost Breakdown | Financial | Detailed category analysis with allocation |
| Resource Allocation | Capacity | Manpower and MHE distribution analysis |

### 5.7 Admin Pages

#### 5.7.1 Clients (`/admin/clients`)
- CRUD for client master data
- Business model assignment (Distribution, 3PL, CPC, 2PL)
- Business line configuration with pallet positions
- Read-only turnover days display (from latest plan's client_forecasts)
- Read-only pallet positions display (from storage_capacity table)
- Volume trend chart per client

#### 5.7.2 Roles (`/admin/roles`)
- CRUD for workforce/equipment roles (NOT user permission roles)
- Fields: Name, Department (warehouse/delivery/admin/operations/consumables), Base Salary, Is Outsourced, Is Active
- Category: manpower, machinery, equipment
- Filter by department

#### 5.7.3 Users (`/admin/users`)
- User management with Supabase Auth integration
- Create users via edge function (`create-user`)
- Assign system roles and departments
- Change passwords via edge function (`change-user-password`)
- Delete users via edge function (`delete-user`)

#### 5.7.4 Cost Rates (`/admin/cost-rates`)
- Manage cost category tree structure
- Set allocation percentages and units
- Direct vs Indirect cost classification

#### 5.7.5 Warehouses (`/admin/warehouses`)
- CRUD for warehouse locations (name, code, business model)
- Dock configuration management (add/edit/delete docks per warehouse)
- Live throughput calculation preview in dock form
- Warehouse business line assignment (which business lines operate at each warehouse)
- Storage capacity management (per-client pallet positions)

#### 5.7.6 CSV Import (`/admin/csv-import`)
- Bulk data import from CSV files

---

## 6. Key Business Concepts Explained

### Turnover Days
Measures how quickly a client's inventory cycles through their allocated storage space. Formula: `Agreed Pallet Positions / (Monthly Volume / Working Days)`. A client with 100 PP and 5,000 cartons/month with 25 working days has a daily rate of 200 cartons, so turnover = 100/200 = 0.5 days. This is entered manually as a contracted value in capacity plans.

### First Mile (FM) Trucks
Trucks that bring goods FROM clients TO the warehouse. Tracked per client per business line in client forecasts. Summarized by CPC and DST business line types.

### Last Mile (LM) Trucks
Trucks that deliver goods FROM the warehouse TO end customers. Managed in Step 4 of the plan wizard as delivery department resources. Can be assigned to specific clients or marked as "shared."

### Throughput
The maximum carton processing capacity of a warehouse, calculated from dock configurations. Acts as a ceiling for feasibility planning -- if forecasted volume exceeds throughput, the system flags it as "Over Capacity."

### Cost Per Carton Allocation
Shared costs (warehouse rent, management overhead) are divided by total carton volume to get a per-carton cost rate. This rate is then multiplied by each client's volume to determine their share of indirect costs, enabling client-level profitability analysis.

### Plan Lifecycle
Draft -> Pending (submitted for approval) -> Approved or Rejected. Rejected and Approved plans can be edited (by the creator) and re-submitted. Pending plans are locked for review.

### Resource Request Workflow
Draft -> Pending (submitted) -> Approved/Rejected by approvers (Operations Director, Executive, System Admin). Approved request items can be incorporated into capacity plans as "requested" resources with source traceability.

---

## 7. Edge Functions (Supabase)

| Function | Purpose |
|----------|---------|
| `create-user` | Creates a new user with Supabase Auth + profile + role |
| `delete-user` | Removes a user from auth and related tables |
| `change-user-password` | Admin password reset for users |
| `create-admin-user` | Bootstrap initial admin account |
| `approve-request` | Server-side request approval logic |
| `calculate-capacity` | Compute capacity metrics |
| `calculate-variance` | Compute variance analysis |
| `validate-plan` | Server-side plan validation |
| `export-csv` | Generate CSV exports |

---

## 8. Security Model

- **Authentication:** Supabase Auth with email/password
- **Authorization:** Row-Level Security (RLS) on every table
- **Key RLS patterns:**
  - Users see their own data + data visible to their role level
  - System admins have unrestricted access
  - Plan visibility: creator, approver, or approved plans are visible
  - Request visibility: creator or admin/operations_director roles
  - Cost management: restricted to finance_manager and system_admin
  - Audit logs: insert by any authenticated user, read by admin only
- **Helper functions used in RLS:** `is_system_admin()`, `has_role(text)`, `can_view_all_plans()`, `can_manage_costs()`

---

## 9. Data Flow Summary

```text
Clients + Business Lines (Admin)
        |
        v
Capacity Plan (Monthly)
  |-- Client Forecasts (volumes, PP, turnover, FM trucks)
  |-- WH Resources (staff, MHE, equipment quantities)
  |-- LM Resources (drivers, trucks, assigned clients)
  |-- Dock Configuration (throughput calculations)
  |-- Storage Capacity (pallet positions per client)
        |
        v
Actuals Entry (actual quantities and costs recorded)
        |
        v
Variance Analysis (planned vs actual comparison)
        |
        v
Reports (executive, capacity, cost, delivery, warehouse)
```

---

## 10. Export Capabilities

- Plan data export/import (CSV format with forecasts + resources)
- Annual report export per year
- Actuals CSV import
- Variance analysis CSV export
- Cost data export
