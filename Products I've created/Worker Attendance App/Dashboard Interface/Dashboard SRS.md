# Software Requirements Specification (SRS)
# Worker's Attendance Management System

**Version:** 1.0  
**Last Updated:** December 2024  
**Document Status:** Current Implementation

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for the Worker's Attendance Management System, a web-based administrative dashboard for managing outsourced worker attendance and financial calculations.

### 1.2 Scope
The system provides:
- Role-based authentication and authorization
- Company provider and warehouse management
- Worker attendance tracking and validation
- Monthly financial report generation
- Data export capabilities

### 1.3 Definitions and Acronyms
| Term | Definition |
|------|------------|
| RLS | Row Level Security (Supabase feature) |
| EGP | Egyptian Pound (currency) |
| GPS | Global Positioning System |
| CRUD | Create, Read, Update, Delete |
| Grace Period | 15-minute buffer after arrival time |

---

## 2. System Architecture

### 2.1 Architecture Overview
```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │ Pages   │ │Components│ │ Hooks   │ │ Context │           │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  Database   │ │   Storage   │ │    Auth     │           │
│  │ (PostgreSQL)│ │  (Buckets)  │ │  (Sessions) │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack
| Layer | Technology |
|-------|------------|
| Frontend Framework | React 18.3.1 |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui (Radix primitives) |
| State Management | React Context, TanStack Query |
| Routing | React Router DOM 6.30.1 |
| Backend | Supabase (PostgreSQL) |
| Charts | Recharts 2.15.4 |
| Date Handling | date-fns 3.6.0 |
| Excel Export | xlsx 0.18.5 |
| Type Safety | TypeScript |

---

## 3. Functional Requirements

### 3.1 Authentication Module

#### FR-AUTH-001: User Login
- **Description:** Users authenticate with username and password
- **Input:** Username (text), Password (text)
- **Process:** Query admin_users table, validate credentials
- **Output:** Session created, redirect to dashboard
- **Error Handling:** Display toast on invalid credentials

#### FR-AUTH-002: Session Management
- **Description:** Maintain user session across page refreshes
- **Storage:** sessionStorage (browser)
- **Data Stored:** User ID, username, role

#### FR-AUTH-003: Logout
- **Description:** End user session
- **Process:** Clear sessionStorage, redirect to login

#### FR-AUTH-004: Role-Based Access Control
- **Description:** Restrict features based on user role
- **Roles:** admin, hr, finance
- **Implementation:** ProtectedRoute component, hasRole() function

### 3.2 Dashboard Module

#### FR-DASH-001: Statistics Display
- **Description:** Show aggregated metrics
- **Metrics:**
  - Total Active Companies (status = 'active')
  - Total Workers (profiles count)
  - Today's Attendance (attendance_logs for current date)
  - Pending Validations (daily_validations with status = 'pending')

#### FR-DASH-002: Navigation
- **Description:** Role-filtered sidebar navigation
- **Implementation:** AppSidebar component with role filtering

### 3.3 Company Management Module

#### FR-COMP-001: List Companies
- **Description:** Display all company providers
- **Columns:** Name, Daily Rate, Contact, Shift Time, Status, Workers, Late Time, Grace Time
- **Access:** Admin, HR, Finance (read-only for Finance)

#### FR-COMP-002: Add Company
- **Description:** Create new company provider
- **Fields:** Name (required), Daily Rate (required), Shift Arrival Time, Contact Info
- **Side Effect:** Create initial rate_history record
- **Access:** Admin, HR

#### FR-COMP-003: Edit Company
- **Description:** Update company details
- **Rate Change Handling:** If daily_rate changes, create new rate_history record
- **Access:** Admin, HR

#### FR-COMP-004: Toggle Company Status
- **Description:** Switch between active/inactive
- **Effect:** Inactive companies hidden from registration app
- **Access:** Admin, HR

### 3.4 Warehouse Management Module

#### FR-WARE-001: List Warehouses
- **Description:** Display all warehouses with statistics
- **Columns:** Name, Location (lat/lng), Radius, Worker Count, Total Late Time
- **Access:** Admin, HR

#### FR-WARE-002: Add Warehouse
- **Description:** Create new warehouse
- **Fields:** Name (required), Latitude (required), Longitude (required), Radius (default: 300m)
- **Access:** Admin, HR

#### FR-WARE-003: Edit Warehouse
- **Description:** Update warehouse details
- **Access:** Admin, HR

### 3.5 Worker Management Module

#### FR-WORK-001: List Workers
- **Description:** Display all worker profiles
- **Columns:** Name, Company, Warehouse, Days Worked, Late Days, Avg Lateness
- **Access:** Admin, HR

#### FR-WORK-002: View Worker Details
- **Description:** Display worker attendance history
- **Data Shown:** Full attendance log with dates, times, late minutes, validation status
- **Access:** Admin, HR

#### FR-WORK-003: Edit Worker Assignment
- **Description:** Update worker's company or warehouse
- **Fields:** Company (dropdown), Warehouse (dropdown)
- **Access:** Admin, HR

### 3.6 Daily Validation Module

#### FR-VALID-001: Date Selection
- **Description:** Select validation date
- **Component:** Calendar picker (react-day-picker)
- **Default:** Current date

#### FR-VALID-002: Load Attendance Data
- **Description:** Fetch workers who attended on selected date
- **Query:** Join attendance_logs, profiles, companies, warehouses
- **Include:** Existing worker_validations status

#### FR-VALID-003: Filter Attendance
- **Description:** Filter displayed workers
- **Filters:**
  - Worker name (text search)
  - Company (dropdown)
  - Warehouse (dropdown)
  - Arrival Status (On-Time, Grace, Late)

#### FR-VALID-004: Display Statistics
- **Description:** Show counts for filtered results
- **Cards:** Present, On-Time, Grace, Late

#### FR-VALID-005: Set Worker Validation Status
- **Description:** Set enforce/waive status per worker
- **Statuses:** pending, enforced, waived
- **Auto-Waive:** On-time and grace workers automatically waived
- **UI:** Dropdown for late workers only
- **Storage:** worker_validations table

#### FR-VALID-006: Bulk Actions
- **Description:** Apply status to all late workers in filtered results
- **Actions:** Bulk Enforce All, Bulk Waive All
- **Scope:** Only affects late workers

#### FR-VALID-007: Reset Filters
- **Description:** Clear all active filters
- **Button:** "Reset Filters"

### 3.7 Monthly Reports Module

#### FR-REP-001: Month Selection
- **Description:** Select reporting month/year
- **Component:** Month picker
- **Default:** Current month

#### FR-REP-002: Calculate Financial Summary
- **Description:** Generate financial data per company
- **Calculation:**
  ```
  Man-Days = Count of attendance records for company workers
  Gross Pay = Man-Days × Historical Daily Rate
  Late Deduction = Σ((Late Minutes / 720) × Daily Rate) 
                   WHERE worker_validation.status = 'enforced'
  Net Payout = Gross Pay - Late Deduction
  ```

#### FR-REP-003: Display Summary Table
- **Description:** Show financial summary
- **Columns:** Company, Man-Days, Gross Pay, Late Deductions, Net Payout
- **Footer:** Totals row

#### FR-REP-004: Display Charts
- **Description:** Visualize attendance data
- **Chart 1:** Monthly Attendance Overview (bar chart)
  - Categories: On-Time, Within Grace, Late
- **Chart 2:** Daily Attendance Trend (line chart)
  - X-axis: Days of month
  - Y-axis: Attendance count

#### FR-REP-005: Export to Excel
- **Description:** Download report as .xlsx file
- **Library:** xlsx
- **Filename:** `monthly_report_YYYY_MM.xlsx`

### 3.8 Settings Module

#### FR-SET-001: Display Global Configuration
- **Description:** Show system configuration values
- **Values:**
  - Arrival Time: 08:00:00
  - Grace Period: 15 minutes
  - Shift Duration: 12 hours (720 minutes)
- **Access:** Admin only

#### FR-SET-002: Display Deduction Formula
- **Description:** Explain deduction calculation
- **Formula:** (Minutes Late / 720) × Daily Rate
- **Example:** Included with sample calculation

#### FR-SET-003: Seed Test Data
- **Description:** Populate database with test records
- **Function:** seedDatabase()
- **Access:** Admin only

#### FR-SET-004: Clear Test Data
- **Description:** Remove test data from database
- **Access:** Admin only

---

## 4. Non-Functional Requirements

### 4.1 Performance
| Requirement | Specification |
|-------------|---------------|
| Page Load | < 3 seconds initial load |
| Data Fetch | < 2 seconds for table data |
| Query Limit | Supabase default 1000 rows |

### 4.2 Security
| Requirement | Implementation |
|-------------|----------------|
| Authentication | Session-based with sessionStorage |
| Authorization | Role-based access control (RBAC) |
| Database Security | Row Level Security (RLS) policies |
| Password Storage | Plain text (development phase) |

### 4.3 Compatibility
| Browser | Support |
|---------|---------|
| Chrome | Latest 2 versions |
| Firefox | Latest 2 versions |
| Safari | Latest 2 versions |
| Edge | Latest 2 versions |

### 4.4 Usability
- Responsive sidebar navigation
- Toast notifications for user feedback
- Loading states for async operations
- Error handling with user-friendly messages

---

## 5. Database Schema

### 5.1 Tables

#### admin_users
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  role app_role NOT NULL, -- enum: admin, hr, finance
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### company_providers
```sql
CREATE TABLE company_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  daily_worker_rate NUMERIC NOT NULL DEFAULT 0,
  shift_arrival_time TIME NOT NULL DEFAULT '08:00:00',
  contact_info TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### warehouses
```sql
CREATE TABLE warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  radius_meters INTEGER NOT NULL DEFAULT 300,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  company_id UUID REFERENCES company_providers(id),
  warehouse_id UUID REFERENCES warehouses(id),
  phone_number TEXT,
  reference_image_url TEXT,
  face_descriptor TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### attendance_logs
```sql
CREATE TABLE attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id),
  check_in_date DATE NOT NULL DEFAULT CURRENT_DATE,
  check_in_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  gps_lat DOUBLE PRECISION NOT NULL,
  gps_lng DOUBLE PRECISION NOT NULL,
  confidence_score DOUBLE PRECISION NOT NULL
);
```

#### worker_validations
```sql
CREATE TABLE worker_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id),
  validation_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, enforced, waived
  attendance_log_id UUID REFERENCES attendance_logs(id),
  validated_by UUID REFERENCES admin_users(id),
  validated_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### daily_validations
```sql
CREATE TABLE daily_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  validation_date DATE NOT NULL,
  warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  status TEXT NOT NULL DEFAULT 'pending',
  validated_by UUID REFERENCES admin_users(id),
  validated_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### rate_history
```sql
CREATE TABLE rate_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES company_providers(id),
  daily_rate NUMERIC NOT NULL,
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_to DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### app_settings
```sql
CREATE TABLE app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  value TEXT NOT NULL
);
```

### 5.2 Row Level Security (RLS)
All tables have RLS enabled with policies allowing:
- SELECT: All authenticated/anonymous users
- INSERT: All users (where applicable)
- UPDATE: All users (where applicable)
- DELETE: Restricted (no delete policies)

### 5.3 Storage Buckets
| Bucket | Public | Purpose |
|--------|--------|---------|
| worker-photos | Yes | Worker reference images |
| attendance-photos | Yes | Check-in verification photos |

---

## 6. API Integration

### 6.1 Supabase Client
```typescript
import { supabase } from "@/integrations/supabase/client";
```

### 6.2 Common Query Patterns

#### Fetch with Join
```typescript
const { data } = await supabase
  .from('profiles')
  .select(`
    *,
    company:company_providers(*),
    warehouse:warehouses(*)
  `);
```

#### Insert with Returning
```typescript
const { data, error } = await supabase
  .from('company_providers')
  .insert({ name, daily_worker_rate })
  .select()
  .single();
```

#### Upsert (Insert or Update)
```typescript
const { error } = await supabase
  .from('worker_validations')
  .upsert(
    { profile_id, validation_date, status },
    { onConflict: 'profile_id,validation_date' }
  );
```

---

## 7. User Interface Requirements

### 7.1 Layout Structure
- **Sidebar:** Left-side navigation (collapsible)
- **Header:** Top bar with page title
- **Content:** Main scrollable content area
- **Footer:** None

### 7.2 Component Library
- Base: shadcn/ui components
- Icons: Lucide React
- Charts: Recharts
- Toasts: Sonner

### 7.3 Design Tokens
- Colors: HSL-based semantic tokens
- Typography: System fonts
- Spacing: Tailwind default scale
- Border Radius: Rounded corners (0.5rem default)

### 7.4 Responsive Behavior
- Desktop-first design
- Sidebar collapses on mobile
- Tables scroll horizontally on small screens

---

## 8. Error Handling

### 8.1 User Feedback
- **Success:** Green toast notification
- **Error:** Red toast notification with message
- **Loading:** Spinner or skeleton states

### 8.2 Error Types
| Type | Handling |
|------|----------|
| Network Error | Display retry message |
| Auth Error | Redirect to login |
| Validation Error | Inline field errors |
| Server Error | Generic error toast |

---

## 9. Testing Considerations

### 9.1 Test Data
- Seed function available in Settings page
- Creates sample companies, warehouses, workers, attendance

### 9.2 Test Accounts
Default test credentials provided on login page

---

## 10. Deployment

### 10.1 Build Process
```bash
npm run build  # Vite production build
```

### 10.2 Environment
- Frontend: Deployed via Lovable platform
- Backend: Supabase managed instance
- Project ID: dybwlzortinyymamzxen

---

## 11. Appendix

### 11.1 File Structure
```
src/
├── components/
│   ├── layout/
│   │   ├── AppSidebar.tsx
│   │   └── DashboardLayout.tsx
│   ├── ui/              # shadcn components
│   ├── NavLink.tsx
│   └── ProtectedRoute.tsx
├── contexts/
│   └── AuthContext.tsx
├── hooks/
│   └── use-toast.ts
├── integrations/
│   └── supabase/
│       ├── client.ts
│       └── types.ts
├── pages/
│   ├── Companies.tsx
│   ├── DailyValidation.tsx
│   ├── Dashboard.tsx
│   ├── Index.tsx
│   ├── Login.tsx
│   ├── MonthlyReports.tsx
│   ├── Settings.tsx
│   ├── Warehouses.tsx
│   └── Workers.tsx
├── types/
│   └── admin.ts
└── App.tsx
```

### 11.2 Global Configuration Constants
```typescript
export const GLOBAL_CONFIG = {
  arrivalTime: '08:00:00',
  gracePeriod: 15,      // minutes
  shiftDuration: 12,    // hours (720 minutes)
};
```
