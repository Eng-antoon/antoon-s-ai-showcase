# Product Requirements Document (PRD)
# نظام حضور ILLA - ILLA Worker's Attendance System

**Document Version:** 3.0  
**Last Updated:** December 2024  
**Status:** Production

---

## 1. Product Overview

### 1.1 Product Name
**ILLA Worker's Attendance System** (نظام حضور ILLA)

### 1.2 Product Description
A mobile-first web application designed for security guards at warehouse gates and delivery associates (DAs) to track daily attendance of outsourced workers. The system replaces manual paper-based attendance tracking with a digital solution that captures worker information via National ID card scanning, photos, GPS coordinates, and timestamps.

### 1.3 Target Users
- **Primary User (Guard):** Security guards stationed at warehouse gates
- **Primary User (DA):** Delivery Associates managing workers on delivery tours
- **Secondary User:** Administrators who manage warehouse and company data directly in the database

### 1.4 Business Objectives
1. Digitize manual attendance tracking for outsourced workers
2. Maintain accurate records of worker attendance with timestamps and photos
3. Support multiple warehouse locations with geofencing
4. Track workers by their outsourced company provider
5. Provide real-time visibility into daily attendance
6. Link worker attendance to logistics tours and deliveries
7. Support both warehouse entry and truck exit logging
8. Enable registration of external workers (drivers and store workers)
9. Track store worker payments with supervisor approval workflow

---

## 2. User Personas

### 2.1 Security Guard (Primary User)
- **Role:** Gate security personnel at warehouse
- **Technical Skill:** Low to moderate
- **Device:** Personal smartphone (Android/iOS)
- **Language:** Arabic (Egyptian dialect)
- **Access:** `/guard` route with geofencing enabled
- **Responsibilities:**
  - Log worker attendance at gate entry
  - Register new workers when they first arrive
  - Verify worker identity via National ID card
  - Log truck exit with trip data

### 2.2 Delivery Associate (Primary User)
- **Role:** Driver/rider managing delivery tours
- **Technical Skill:** Low to moderate
- **Device:** Personal smartphone (Android/iOS)
- **Language:** Arabic (Egyptian dialect)
- **Access:** `/da-checkin` route with geofencing bypassed
- **Responsibilities:**
  - Enter phone number to fetch tour data from Locus
  - Scan and register workers assigned to their tour
  - Register external workers (drivers and store workers)
  - Work remotely without warehouse proximity requirement

### 2.3 Administrator (Secondary User)
- **Role:** Operations/HR manager
- **Technical Skill:** Moderate
- **Access:** Direct database access via Supabase dashboard
- **Responsibilities:**
  - Manage warehouse locations and geofence radius
  - Manage company providers and rates
  - View attendance reports
  - Process store worker payment approvals (via external admin dashboard)

---

## 3. User Stories (Currently Implemented)

### 3.1 Authentication
| ID | User Story | Status |
|----|------------|--------|
| US-001 | As a security guard, I can log in using a password so that only authorized personnel can access the system | ✅ Implemented |
| US-002 | As a security guard, I must re-enter the password each session for security | ✅ Implemented |
| US-003 | As a delivery associate, I can access the DA check-in page directly from the login screen | ✅ Implemented |

### 3.2 Geofencing
| ID | User Story | Status |
|----|------------|--------|
| US-004 | As a security guard, I can only access the attendance system when I am within the warehouse vicinity | ✅ Implemented |
| US-005 | As a security guard, I see a blocking overlay when outside the geofence that auto-redirects to DA mode | ✅ Implemented |
| US-006 | As a security guard, I can see my distance to the nearest warehouse | ✅ Implemented |
| US-007 | As a delivery associate, I can access the system from anywhere (geofencing bypassed) | ✅ Implemented |
| US-008 | As a user, my location is cached for 10 minutes to improve performance | ✅ Implemented |

### 3.3 National ID Scanning & OCR
| ID | User Story | Status |
|----|------------|--------|
| US-009 | As a guard/DA, I can scan a worker's National ID card using the rear camera | ✅ Implemented |
| US-010 | As a guard/DA, the system extracts name and 14-digit National ID via AI OCR | ✅ Implemented |
| US-011 | As a guard/DA, I can manually enter data if OCR fails | ✅ Implemented |

### 3.4 Warehouse Entry (Guard Flow)
| ID | User Story | Status |
|----|------------|--------|
| US-012 | As a guard, I see a "دخول المخزن" tab to log warehouse entry | ✅ Implemented |
| US-013 | As a guard, scanning an existing worker's ID auto-logs attendance | ✅ Implemented |
| US-014 | As a guard, I see a notification if the worker has already logged attendance today | ✅ Implemented |
| US-015 | As a guard, I can register a new worker inline with name/ID auto-filled from OCR | ✅ Implemented |
| US-016 | As a guard, new workers are automatically assigned to nearest warehouse | ✅ Implemented |

### 3.5 Truck Exit (Guard Flow)
| ID | User Story | Status |
|----|------------|--------|
| US-017 | As a guard, I see a "خروج التراك" tab to log truck exit | ✅ Implemented |
| US-018 | As a guard, I enter DA's phone number to fetch trip data from Locus | ✅ Implemented |
| US-019 | As a guard, trip data (plate number, DA name) is auto-filled from Locus | ✅ Implemented |
| US-020 | As a guard, I can edit plate number while original is preserved for audit | ✅ Implemented |
| US-021 | As a guard, I manually enter driver name | ✅ Implemented |
| US-022 | As a guard, I scan worker's National ID to log truck exit with trip context | ✅ Implemented |

### 3.6 DA Check-in Flow
| ID | User Story | Status |
|----|------------|--------|
| US-023 | As a DA, I enter my phone number to authenticate and fetch tour data | ✅ Implemented |
| US-024 | As a DA, I see a personalized greeting with my name | ✅ Implemented |
| US-025 | As a DA, I see a table of orders on my tour (Order ID, Warehouse, Location) | ✅ Implemented |
| US-026 | As a DA, I see which workers have already checked in on my tour | ✅ Implemented |
| US-027 | As a DA, I can scan multiple workers and register/log their attendance | ✅ Implemented |
| US-028 | As a DA, workers are automatically assigned to the tour's primary warehouse | ✅ Implemented |

### 3.7 External Workers (DA Flow)
| ID | User Story | Status |
|----|------------|--------|
| US-029 | As a DA, I can register an external driver with optional NID scanning | ✅ Implemented |
| US-030 | As a DA, I can register an external store worker with payment amount | ✅ Implemented |
| US-031 | As a DA, I select an Order ID when registering store workers | ✅ Implemented |
| US-032 | As a DA, I see workers added immediately to the list after registration | ✅ Implemented |
| US-033 | As a DA, driver registration shows smart company selection (auto-select if single) | ✅ Implemented |
| US-034 | As a DA, store worker registration creates a payment approval request | ✅ Implemented |

### 3.8 Worker Registration
| ID | User Story | Status |
|----|------------|--------|
| US-035 | As a guard/DA, I can register a new worker with name auto-filled from OCR | ✅ Implemented |
| US-036 | As a guard/DA, I manually enter the worker's phone number | ✅ Implemented |
| US-037 | As a guard/DA, I select the worker's company provider | ✅ Implemented |
| US-038 | As a guard/DA, I capture the worker's face photo using rear camera | ✅ Implemented |
| US-039 | As a guard/DA, both NID image and face photo are stored for compliance | ✅ Implemented |
| US-040 | As a guard/DA, new workers are automatically logged for attendance upon registration | ✅ Implemented |

### 3.9 Dashboard
| ID | User Story | Status |
|----|------------|--------|
| US-041 | As a guard, I can see today's warehouse entry logs in a table | ✅ Implemented |
| US-042 | As a guard, I can see today's truck exit logs in a separate table | ✅ Implemented |
| US-043 | As a guard, logs update in real-time when new attendance is recorded | ✅ Implemented |
| US-044 | As a guard, National IDs are displayed masked (showing last 4 digits only) | ✅ Implemented |

---

## 4. Feature List (Currently Implemented)

### 4.1 Admin Authentication
- Password-based login (no username required)
- Password stored in `app_settings` table
- Session-based authentication using `sessionStorage`
- No persistent login (must re-authenticate each session)
- Logout functionality
- Direct DA check-in button on login page

### 4.2 Geofencing System
- Multi-warehouse support
- Dynamic warehouse locations from database
- Configurable radius per warehouse (default: 300 meters)
- Haversine formula for distance calculation
- Red blocking overlay when outside geofence
- Auto-redirect to DA mode after 2 seconds when outside geofence
- Distance display to nearest warehouse
- 10-minute location caching for performance

### 4.3 National ID-Based Attendance
- 14-digit Egyptian National ID as primary identifier
- OCR extraction via Google Gemini Flash AI
- Multi-line name handling for complete name extraction
- Database constraint enforcing 14-digit format
- National ID uniqueness validation

### 4.4 Guard Warehouse Entry Flow
- Scan National ID card with rear camera
- OCR extracts name and 14-digit ID
- System checks if worker exists in database
- If exists: auto-logs attendance with warehouse_entry type
- If new: shows registration form with name/ID pre-filled
- Manual phone number entry required
- Automatic nearest warehouse assignment

### 4.5 Guard Truck Exit Flow
- Enter DA phone number to fetch trip data
- Auto-fill: plate number, DA name, tour ID, vehicle name
- Editable plate number (original preserved for audit)
- Manual driver name entry
- Scan worker's National ID
- Logs attendance with truck_exit type and all trip context

### 4.6 DA Check-in Flow
- Phone number authentication
- Fetches tour data from external AWS RDS/Locus database
- Personalized greeting with rider name
- Orders table display (Order ID, Warehouse, Location)
- Workers list showing already checked-in workers (real-time updates)
- Scan multiple workers per tour
- Automatic warehouse assignment from tour homebase
- GPS capture for each attendance log
- External worker registration (drivers and store workers)

### 4.7 External Workers System
- **External Worker Dialog:** Selection between driver and store worker types
- **Driver Registration:**
  - Optional NID scanning (can skip and enter manually)
  - Phone number entry with numeric keyboard
  - Smart company selection (auto-select if single company)
  - Worker type set to 'driver'
  - Log type: external_worker
- **Store Worker Registration:**
  - Optional NID scanning
  - Order ID selection (required - links to specific delivery)
  - Payment amount entry (numeric)
  - Creates entry in worker_approvals table for supervisor approval
  - Worker type set to 'store_worker'
  - No company assignment (store workers are independent)
  - Log type: external_worker
- **Real-time Workers List:** Updates immediately when workers are registered

### 4.8 Worker Registration
- Name auto-filled from OCR
- National ID auto-filled from OCR
- Manual phone number entry (placeholder: 01XXXXXXXXX)
- Company provider selection dropdown
- Warehouse display (auto-assigned or selectable)
- NID image capture and storage
- Face photo capture using rear camera
- Automatic attendance logging upon registration
- Payment amount auto-populated from company daily rate

### 4.9 Dashboard
- Dual tabs: Warehouse Entry / Truck Exit
- Warehouse entry table: Name, Masked NID, Time
- Truck exit table: Name, Plate, Driver, Tour ID, Time
- Real-time updates via Supabase subscriptions
- Tour ID displayed in shortened format (e.g., "tour-11")

---

## 5. Non-Functional Requirements

### 5.1 Language & Localization
- **Primary Language:** Arabic
- **Dialect:** Egyptian colloquial (Ibn Balad style)
- **Direction:** Right-to-Left (RTL) support
- **Examples of UI copy:**
  - "امسح البطاقة الشخصية" (Scan National ID card)
  - "تم تسجيل الحضور!" (Attendance logged!)
  - "جارى الحفظ يا كبير..." (Saving, boss...)
  - "منور يا ريس!" (Welcome boss!)

### 5.2 Design
- Mobile-first responsive design
- Dark theme by default
- Cyan/teal accent color (#0e7490)
- Large touch targets for mobile use
- Circular worker photos throughout UI
- Increased font sizes for mobile readability

### 5.3 Performance
- Geolocation caching for 10 minutes
- Real-time GPS watching
- Immediate attendance logging
- Image optimization for storage

### 5.4 Security
- Geofencing prevents off-site access (for guards)
- No client-side AI processing (prevents tampering)
- Service role key used only in Edge Functions
- RLS policies on all database tables
- Dual plate number fields for audit trail

---

## 6. External Integrations

### 6.1 AWS RDS / Locus Logistics
- Database: PostgreSQL on AWS RDS
- Schema: `locus_dw_recover.order_all`
- Data Retrieved:
  - Tour ID
  - Rider name and phone
  - Vehicle name and registration
  - Order IDs and locations
  - Homebase IDs (mapped to warehouses)
- Used by: `fetch-locus-trip` edge function

### 6.2 Google Gemini Flash AI
- Used for OCR on National ID cards
- Extracts: Full name, 14-digit National ID
- Handles multi-line names on Egyptian IDs
- Called via `ocr-national-id` edge function

---

## 7. Out of Scope (Not Currently Implemented)

The following features are **NOT** currently implemented:
- Facial recognition / AI verification
- Liveness detection
- Worker self-service portal
- Attendance reports / exports
- Multi-user admin accounts
- Role-based access control
- Worker check-out logging
- Shift management
- Payroll integration (approval workflow exists, but no payroll system integration)
- Push notifications
- Offline mode

---

## 8. Success Metrics

| Metric | Target |
|--------|--------|
| National ID scan + OCR time | < 5 seconds |
| Attendance logging time | < 3 seconds per worker |
| New worker registration time | < 30 seconds |
| System uptime | 99.9% |
| Geofence accuracy | Within 50 meters |

---

## 9. Appendix

### 9.1 Glossary
| Term | Definition |
|------|------------|
| Geofencing | Location-based restriction using GPS coordinates |
| Company Provider | Outsourced staffing company that supplies workers |
| Check-in | Recording a worker's attendance for the day |
| National ID | 14-digit Egyptian National ID number |
| OCR | Optical Character Recognition (AI text extraction) |
| Tour | A delivery route/trip assigned to a DA |
| Homebase | Locus system warehouse identifier |
| DA | Delivery Associate (rider/driver) |
| External Worker | Driver or store worker registered outside regular workforce |
| Store Worker | Temporary assistant at delivery locations requiring payment |
| Worker Approval | Payment request for store workers pending supervisor approval |

### 9.2 Log Types
| Log Type | Description |
|----------|-------------|
| warehouse_entry | Worker entering warehouse (Guard flow) |
| truck_exit | Worker exiting with truck (Guard flow) |
| da_entry | Worker logged by DA (DA flow) |
| external_worker | External worker (driver/store worker) logged by DA |

### 9.3 Worker Types
| Worker Type | Description |
|-------------|-------------|
| worker | Regular warehouse worker (default) |
| driver | External driver registered by DA |
| store_worker | External store assistant with payment tracking |

### 9.4 Related Documents
- [Software Requirements Specification (SRS)](./SRS.md)