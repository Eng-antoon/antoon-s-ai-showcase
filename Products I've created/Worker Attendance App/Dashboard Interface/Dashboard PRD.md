# Product Requirements Document (PRD)
# Worker's Attendance Management System

**Version:** 1.0  
**Last Updated:** December 2024  
**Product Owner:** ILLA

---

## 1. Product Overview

### 1.1 Purpose
Worker's Attendance is an administrative dashboard for managing outsourced worker attendance, validating daily attendance records, and calculating monthly financial payouts. The system connects to a Supabase database shared with a separate attendance registration mobile app.

### 1.2 Problem Statement
Organizations using outsourced workers need to:
- Track worker attendance across multiple warehouses
- Manage multiple outsourcing company agreements with different daily rates
- Apply late deductions based on business rules while allowing flexibility for high-pressure days
- Generate accurate monthly financial reports for payouts

### 1.3 Solution
A web-based admin dashboard that provides:
- Role-based access for Admin, HR, and Finance users
- Real-time attendance tracking and validation
- Flexible deduction enforcement (enforce/waive per worker)
- Automated financial calculations with historical rate tracking

---

## 2. Target Users and Roles

### 2.1 Admin Role
- **Access:** Full system access
- **Capabilities:**
  - All HR capabilities
  - All Finance capabilities
  - System settings management
  - Test data management (seed/clear)

### 2.2 HR Role
- **Access:** Company, Warehouse, Worker, and Validation management
- **Capabilities:**
  - Manage company providers (add, edit, toggle status)
  - Manage warehouses (add, edit)
  - View and edit worker assignments
  - Perform daily validation (enforce/waive deductions)

### 2.3 Finance Role
- **Access:** Read-only financial data
- **Capabilities:**
  - View company information
  - Access monthly financial reports
  - Export reports to Excel

---

## 3. Core Features

### 3.1 Dashboard
- **Statistics Cards:**
  - Total Active Companies
  - Total Workers
  - Today's Attendance Count
  - Pending Validations Count
- **Role-specific Navigation:** Sidebar menu filtered by user role

### 3.2 Company Providers Management
- **CRUD Operations:**
  - Add new company with name, daily rate (EGP), shift arrival time, contact info
  - Edit company details (rate changes trigger history snapshot)
  - Toggle company status (active/inactive)
- **Aggregated Statistics Display:**
  - Worker count per company
  - Total late time (minutes) per company
  - Total grace time (minutes) per company
- **Rate History Tracking:** Automatic tracking when daily rates change

### 3.3 Warehouses Management
- **CRUD Operations:**
  - Add warehouse with name, location (lat/lng), geofence radius
  - Edit warehouse details
- **Aggregated Statistics Display:**
  - Worker count per warehouse
  - Total late time per warehouse

### 3.4 Workers Management
- **Worker List View:**
  - Display all workers with company and warehouse assignments
  - Show attendance statistics (days worked, late days, average lateness)
- **Worker Detail View:**
  - Full attendance history with check-in times
  - Late minutes per day
  - Validation status per attendance record
- **Edit Capabilities:**
  - Update worker's company assignment
  - Update worker's warehouse assignment

### 3.5 Daily Validation
- **Date Selection:** Calendar picker for validation date
- **Filtering Options:**
  - Search by worker name
  - Filter by company
  - Filter by warehouse
  - Filter by arrival status (On-Time, Grace, Late)
- **Statistics Cards:**
  - Workers present count
  - On-time count
  - Grace period count
  - Late count
- **Worker-Level Validation:**
  - Individual status per worker: Pending, Enforced, Waived
  - On-time and grace period workers auto-waived
  - Action dropdowns only for late workers
- **Bulk Actions:**
  - Bulk Enforce All (late workers in filtered results)
  - Bulk Waive All (late workers in filtered results)
- **Reset Filters:** Quick clear all active filters

### 3.6 Monthly Reports
- **Month Selection:** Month/Year picker
- **Financial Summary Table (grouped by company):**
  - Company Name
  - Total Man-Days (sum of attended days)
  - Gross Pay (Man-Days × Historical Daily Rate)
  - Total Late Deductions (only for enforced validation days)
  - Net Payout (Gross Pay - Late Deductions)
- **Data Visualization:**
  - Monthly Attendance Overview (bar chart: On-Time vs Grace vs Late)
  - Daily Attendance Trend (line chart throughout month)
- **Export:** Download to Excel (.xlsx) format

### 3.7 Settings (Admin Only)
- **Global Configuration Display:**
  - Standard Arrival Time (08:00 AM)
  - Grace Period (15 minutes)
  - Shift Duration (12 hours)
- **Deduction Formula Explanation:**
  - Formula: (Minutes Late / 720) × Daily Rate
  - Example calculation display
- **Test Data Management:**
  - Seed database with test data
  - Clear test data

---

## 4. User Flows

### 4.1 Login Flow
1. User navigates to login page
2. Enters username and password
3. System validates against admin_users table
4. On success: Redirect to dashboard, store user in session
5. On failure: Display error toast

### 4.2 Daily Validation Flow (HR)
1. HR selects date from calendar
2. System loads all workers who attended that date
3. HR applies filters to narrow down workers
4. HR reviews worker arrival times
5. For late workers: HR sets status to Enforced or Waived
6. System saves validation status to worker_validations table

### 4.3 Monthly Report Flow (Finance)
1. Finance selects month/year
2. System calculates:
   - Attendance data grouped by company
   - Deductions only for workers with enforced status
   - Uses historical daily rate from rate_history
3. Finance reviews report and charts
4. Finance exports to Excel if needed

---

## 5. Business Rules

### 5.1 Attendance Timing
| Rule | Value |
|------|-------|
| Standard Arrival Time | 08:00 AM |
| Grace Period | 15 minutes |
| On-Time | Arrival at 08:00 |
| Within Grace | Arrival 08:01 - 08:15 |
| Late | Arrival after 08:15 |
| Shift Duration | 12 hours (720 minutes) |

### 5.2 Deduction Calculation
- **Formula:** `(Minutes Late / 720) × Company Daily Rate`
- **Condition:** Deduction applied ONLY when:
  - Worker arrived late (after grace period)
  - AND worker_validations.status = 'enforced'
- **No Deduction When:**
  - Worker arrived on-time or within grace
  - OR worker_validations.status = 'pending' or 'waived'

### 5.3 Rate History
- When company daily rate is edited, system creates rate_history record
- Monthly reports use the rate effective during the reporting period
- Historical data integrity maintained for accurate financial reconciliation

### 5.4 Company Status
- Active companies: Visible in registration app, included in current operations
- Inactive companies: Hidden from registration, historical data preserved for reports

---

## 6. Data Model Overview

### 6.1 Core Entities
| Entity | Description |
|--------|-------------|
| admin_users | System users with roles (admin, hr, finance) |
| company_providers | Outsourcing companies with daily rates |
| warehouses | Work locations with geofence coordinates |
| profiles | Worker profiles linked to company and warehouse |
| attendance_logs | Check-in records with GPS and timestamp |
| worker_validations | Per-worker validation status per date |
| daily_validations | Date/warehouse level validation (legacy) |
| rate_history | Historical record of company rate changes |
| app_settings | System configuration key-value pairs |

### 6.2 Key Relationships
- Worker (profile) → belongs to → Company Provider
- Worker (profile) → assigned to → Warehouse
- Attendance Log → created by → Worker (profile)
- Worker Validation → references → Worker and Attendance Log
- Rate History → tracks changes for → Company Provider

---

## 7. Success Metrics

### 7.1 Operational Metrics
- Time to complete daily validation
- Accuracy of monthly financial calculations
- User adoption across roles

### 7.2 Business Metrics
- Reduction in payroll processing time
- Accuracy of deduction enforcement
- Audit trail completeness

---

## 8. Future Considerations (Not Implemented)

The following features are NOT currently implemented but may be considered:
- Email/SMS notifications for workers
- Mobile-responsive admin interface
- Real-time attendance monitoring
- Integration with payroll systems
- Multi-language support
- Advanced analytics and reporting
