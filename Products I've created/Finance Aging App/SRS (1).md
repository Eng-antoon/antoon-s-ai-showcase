# Software Requirements Specification (SRS)

## ILLA Finance System

> **Version:** 1.0  
> **Last Updated:** December 2024  
> **Document Status:** Approved

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Features](#3-system-features)
4. [External Interface Requirements](#4-external-interface-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Data Requirements](#6-data-requirements)
7. [Appendices](#7-appendices)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document provides a comprehensive description of the ILLA Finance System, a back-office financial management application designed for ILLA Trucking. This document is intended for development teams, stakeholders, and project managers to ensure alignment on system functionality and requirements.

### 1.2 Scope

The ILLA Finance System is a web-based application that manages:
- Client accounts and relationships
- Invoice tracking and lifecycle management
- Payment reconciliation with FIFO (First-In-First-Out) methodology
- Activity logging and audit trails
- Automated notifications for past-due invoices

The system is designed specifically for the finance team at ILLA Trucking to manage accounts receivable operations efficiently.

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| **FIFO** | First-In-First-Out - Payment allocation methodology |
| **EGP** | Egyptian Pound - Currency used throughout the system |
| **RTL** | Right-to-Left - Text direction for Arabic language |
| **RLS** | Row Level Security - Database security mechanism |
| **CRUD** | Create, Read, Update, Delete - Basic data operations |
| **Aging Days** | Number of days since invoice date |
| **Max Aging Days** | Client-specific payment term threshold |
| **Past Due** | Invoice exceeding the max aging days threshold |

### 1.4 References

- Mixpanel Events Documentation (`docs/Mixpanel_Events.md`)
- Supabase Database Types (`src/integrations/supabase/types.ts`)
- Product Requirements Document (`docs/PRD.md`)

### 1.5 Overview

This document is organized into sections covering the overall system description, detailed functional requirements, external interfaces, non-functional requirements, and data specifications.

---

## 2. Overall Description

### 2.1 Product Perspective

The ILLA Finance System is a standalone web application that integrates with:
- **Supabase**: Backend database and authentication infrastructure
- **Resend**: Email delivery service for notifications
- **Mixpanel**: Analytics and user behavior tracking

The system operates independently but relies on these external services for full functionality.

### 2.2 Product Functions

The primary functions of the system include:

1. **User Authentication**: Secure login for authorized finance personnel
2. **Dashboard Analytics**: Real-time overview of receivables and client metrics
3. **Client Management**: CRUD operations and bulk import for client records
4. **Invoice Management**: Full lifecycle management of invoices with status tracking
5. **Payment Reconciliation**: FIFO-based payment allocation with manual and bulk modes
6. **Activity Logging**: Comprehensive audit trail of all user actions
7. **Email Notifications**: Automated daily alerts for past-due invoices
8. **Localization**: Bilingual support (English/Arabic) with RTL layout

### 2.3 User Classes and Characteristics

| User Class | Description | Technical Skill |
|------------|-------------|-----------------|
| **Finance Administrator** | Senior finance team member with full system access | Moderate |
| **Finance Team Member** | Staff responsible for day-to-day invoice and reconciliation operations | Basic to Moderate |

All users are internal ILLA Trucking employees with pre-created accounts.

### 2.4 Operating Environment

- **Platform**: Web-based application (browser-based)
- **Supported Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Device Support**: Desktop and tablet (responsive design)
- **Minimum Resolution**: 1024x768 pixels
- **Internet Connectivity**: Required for all operations

### 2.5 Design and Implementation Constraints

1. **Technology Stack**: React 18, TypeScript, Vite, Tailwind CSS
2. **Backend**: Supabase (PostgreSQL database)
3. **Authentication**: Custom users table with plain-text password storage
4. **No Self-Registration**: Users are created manually by administrators
5. **Currency**: All monetary values in Egyptian Pounds (EGP)
6. **Languages**: English and Arabic with full RTL support

### 2.6 Assumptions and Dependencies

**Assumptions:**
- Users have stable internet connections
- Users have basic computer literacy
- Finance team operates during Egyptian business hours

**Dependencies:**
- Supabase service availability
- Resend email service for notifications
- Mixpanel for analytics (non-critical)

---

## 3. System Features

### 3.1 FR-AUTH: Authentication System

#### 3.1.1 Description
The system provides secure authentication for authorized users to access the application.

#### 3.1.2 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AUTH-01 | System shall provide a login page with email and password fields | Must |
| FR-AUTH-02 | System shall validate credentials against the users table | Must |
| FR-AUTH-03 | System shall redirect authenticated users to the dashboard | Must |
| FR-AUTH-04 | System shall maintain user session until explicit logout | Must |
| FR-AUTH-05 | System shall provide a logout function accessible from all pages | Must |
| FR-AUTH-06 | System shall redirect unauthenticated users to the login page | Must |
| FR-AUTH-07 | System shall display appropriate error messages for failed login attempts | Must |
| FR-AUTH-08 | System shall NOT provide self-registration functionality | Must |

---

### 3.2 FR-DASH: Dashboard & Analytics

#### 3.2.1 Description
The dashboard provides real-time financial metrics and client analytics.

#### 3.2.2 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-DASH-01 | System shall display total outstanding receivables | Must |
| FR-DASH-02 | System shall display total overdue receivables | Must |
| FR-DASH-03 | System shall display client count | Should |
| FR-DASH-04 | System shall display invoice count | Should |
| FR-DASH-05 | System shall list all clients sorted by overdue amount (highest first) | Must |
| FR-DASH-06 | System shall allow filtering dashboard metrics by specific client | Must |
| FR-DASH-07 | System shall display recent activity widget | Should |
| FR-DASH-08 | System shall provide searchable client selection via combobox | Must |

---

### 3.3 FR-CLT: Client Management

#### 3.3.1 Description
Complete client lifecycle management including CRUD operations and bulk import.

#### 3.3.2 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-CLT-01 | System shall display all active clients in a searchable table | Must |
| FR-CLT-02 | System shall allow creating new clients with name, code, and max aging days | Must |
| FR-CLT-03 | System shall enforce unique client codes (case-insensitive) | Must |
| FR-CLT-04 | System shall allow editing existing client records | Must |
| FR-CLT-05 | System shall allow soft-deletion of clients without transactions | Must |
| FR-CLT-06 | System shall block deletion of clients with existing invoices or reconciliations | Must |
| FR-CLT-07 | System shall display reason when deletion is blocked | Must |
| FR-CLT-08 | System shall support bulk import via Excel file | Must |
| FR-CLT-09 | System shall provide downloadable Excel template for bulk import | Must |
| FR-CLT-10 | Bulk import shall use all-or-nothing validation | Must |
| FR-CLT-11 | System shall display detailed error modal when bulk import fails | Must |
| FR-CLT-12 | System shall allow downloading error list as file | Should |
| FR-CLT-13 | System shall search clients by name and code | Must |

---

### 3.4 FR-INV: Invoice Management

#### 3.4.1 Description
Complete invoice lifecycle management with status tracking and bulk operations.

#### 3.4.2 Invoice Status States

| Status | Description |
|--------|-------------|
| **UNPAID** | Full invoice amount outstanding |
| **PARTIALLY_PAID** | Some payment received, balance remaining |
| **PAID** | Invoice fully settled |
| **PAST_DUE** | Derived status when aging days exceed client's max aging days |

#### 3.4.3 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-INV-01 | System shall display all invoices in a paginated table (20 per page) | Must |
| FR-INV-02 | System shall sort invoices: PAID at bottom, others by aging days (oldest first) | Must |
| FR-INV-03 | System shall allow creating invoices with: client, invoice number, order ID, date, amount | Must |
| FR-INV-04 | System shall enforce unique invoice numbers | Must |
| FR-INV-05 | System shall enforce unique order IDs (when provided) | Must |
| FR-INV-06 | System shall reject invoice dates in the future | Must |
| FR-INV-07 | System shall allow editing UNPAID invoices only | Must |
| FR-INV-08 | System shall allow deleting invoices | Must |
| FR-INV-09 | System shall support bulk import via Excel file | Must |
| FR-INV-10 | Bulk import shall use all-or-nothing validation | Must |
| FR-INV-11 | System shall provide downloadable Excel template | Must |
| FR-INV-12 | System shall display detailed error modal when bulk import fails | Must |
| FR-INV-13 | System shall calculate and display aging days for each invoice | Must |
| FR-INV-14 | System shall calculate PAST_DUE status based on client's max aging days | Must |
| FR-INV-15 | System shall filter invoices by status | Must |
| FR-INV-16 | System shall filter invoices by client | Must |
| FR-INV-17 | System shall search invoices by invoice number and order ID | Must |
| FR-INV-18 | System shall display both total value and remaining amount | Must |
| FR-INV-19 | System shall support invoice export to Excel | Should |

---

### 3.5 FR-REC: Reconciliation

#### 3.5.1 Description
Payment reconciliation using FIFO methodology with manual and bulk modes.

#### 3.5.2 FIFO Algorithm

When a payment is received for a client:
1. Retrieve all UNPAID and PARTIALLY_PAID invoices for the client
2. Sort invoices by invoice_date ascending (oldest first)
3. Apply payment to invoices in order until payment is exhausted
4. Update invoice status based on remaining balance:
   - `left_amount = 0` → Status: PAID
   - `left_amount > 0 && left_amount < total_value` → Status: PARTIALLY_PAID
   - `left_amount = total_value` → Status: UNPAID

#### 3.5.3 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-REC-01 | System shall provide manual reconciliation entry form | Must |
| FR-REC-02 | Manual entry shall require: client selection, amount, reconciliation date | Must |
| FR-REC-03 | System shall reject reconciliation dates in the future | Must |
| FR-REC-04 | System shall prevent overpayment (amount > total outstanding debt) | Must |
| FR-REC-05 | System shall display overpayment error message when applicable | Must |
| FR-REC-06 | System shall apply FIFO algorithm to allocate payments | Must |
| FR-REC-07 | System shall update invoice statuses after reconciliation | Must |
| FR-REC-08 | System shall update client's last_reconciled_at timestamp | Must |
| FR-REC-09 | System shall support bulk reconciliation via Excel file | Must |
| FR-REC-10 | Bulk reconciliation shall use all-or-nothing validation | Must |
| FR-REC-11 | System shall provide downloadable Excel template for bulk reconciliation | Must |
| FR-REC-12 | System shall display reconciliation history in dedicated tab | Must |
| FR-REC-13 | Reconciliation history shall be read-only (no delete/edit) | Must |
| FR-REC-14 | System shall filter reconciliation history by client | Should |
| FR-REC-15 | System shall record reconciliation transactions in database | Must |
| FR-REC-16 | System shall display client's current outstanding debt during manual entry | Should |

---

### 3.6 FR-LOG: Activity Logging

#### 3.6.1 Description
Comprehensive audit trail for all user actions in the system.

#### 3.6.2 Logged Actions

| Action Type | Description |
|-------------|-------------|
| Client Created | New client added (manually or bulk) |
| Client Updated | Client record modified |
| Client Deleted | Client soft-deleted |
| Invoice Created | New invoice added (manually or bulk) |
| Invoice Updated | Invoice record modified |
| Invoice Deleted | Invoice removed |
| Reconciliation | Payment reconciled for client |
| Bulk Import | Bulk import operation (clients/invoices/reconciliation) |

#### 3.6.3 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-LOG-01 | System shall log all create, update, delete operations | Must |
| FR-LOG-02 | System shall record user ID and name for each action | Must |
| FR-LOG-03 | System shall record timestamp for each action | Must |
| FR-LOG-04 | System shall record detailed description for each action | Must |
| FR-LOG-05 | System shall display activity log in chronological order (newest first) | Must |
| FR-LOG-06 | System shall support searching activity log | Should |
| FR-LOG-07 | Activity log shall be read-only | Must |

---

### 3.7 FR-NOTIF: Email Notifications

#### 3.7.1 Description
Automated daily email notifications for past-due invoices.

#### 3.7.2 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-NOTIF-01 | System shall send daily email at 10 AM Egypt time | Must |
| FR-NOTIF-02 | Email shall contain all past-due invoices | Must |
| FR-NOTIF-03 | Email shall include: Invoice Number, Client Name, Client Code, Order ID, Invoice Date, Amount Due | Must |
| FR-NOTIF-04 | Invoices shall be sorted by amount (highest first) | Should |
| FR-NOTIF-05 | Email shall include link to invoices page | Should |
| FR-NOTIF-06 | Email shall be sent from notifications@illatrucking.com | Must |
| FR-NOTIF-07 | Email shall be sent to finance.app.notification@illa.com.eg | Must |
| FR-NOTIF-08 | Email shall use professional HTML template | Should |

---

### 3.8 FR-LOC: Localization

#### 3.8.1 Description
Bilingual support with English and Arabic languages including RTL layout.

#### 3.8.2 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-LOC-01 | System shall provide language toggle button | Must |
| FR-LOC-02 | System shall support English language | Must |
| FR-LOC-03 | System shall support Arabic language | Must |
| FR-LOC-04 | Arabic mode shall use RTL text direction | Must |
| FR-LOC-05 | Arabic mode shall position sidebar on right side | Must |
| FR-LOC-06 | All UI text shall be translated to Arabic | Must |
| FR-LOC-07 | Numbers shall remain in English numerals | Must |
| FR-LOC-08 | Language preference shall persist across sessions | Should |

---

### 3.9 FR-ANA: Analytics

#### 3.9.1 Description
User behavior tracking via Mixpanel integration.

#### 3.9.2 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ANA-01 | System shall track page view events | Must |
| FR-ANA-02 | System shall track button click events | Must |
| FR-ANA-03 | System shall track form submission events | Must |
| FR-ANA-04 | System shall track search events (debounced) | Should |
| FR-ANA-05 | System shall track validation failure events | Should |
| FR-ANA-06 | System shall include user context in all events | Must |
| FR-ANA-07 | System shall identify users on login | Must |
| FR-ANA-08 | System shall reset user on logout | Must |

---

## 4. External Interface Requirements

### 4.1 User Interfaces

| Interface | Description |
|-----------|-------------|
| **Login Page** | Email and password input with submit button |
| **Dashboard** | Metrics cards, client list, activity feed |
| **Clients Page** | Data table with search, CRUD dialogs, bulk import |
| **Invoices Page** | Paginated table with filters, CRUD dialogs, bulk import |
| **Reconciliation Page** | Tabbed interface (Manual, Bulk, History) |
| **Activity Log Page** | Searchable chronological list of actions |

### 4.2 Software Interfaces

#### 4.2.1 Supabase
- **Purpose**: Database and backend infrastructure
- **Data**: All application data (users, clients, invoices, reconciliation transactions, activity logs)
- **Protocol**: REST API via Supabase JavaScript client

#### 4.2.2 Resend
- **Purpose**: Email delivery for notifications
- **Protocol**: REST API via Edge Function
- **Trigger**: pg_cron scheduled job at 10 AM Egypt time

#### 4.2.3 Mixpanel
- **Purpose**: User analytics and behavior tracking
- **Protocol**: JavaScript SDK
- **Data Host**: EU region (api-eu.mixpanel.com)

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

| Requirement | Target |
|-------------|--------|
| Page load time | < 3 seconds |
| API response time | < 1 second |
| Bulk import (1000 records) | < 30 seconds |
| Concurrent users | 50+ |

### 5.2 Security Requirements

| Requirement | Description |
|-------------|-------------|
| Authentication | Required for all pages except login |
| Session management | Secure session handling via context |
| Data isolation | Users can only access ILLA Trucking data |
| RLS policies | Database-level row security |

**Security Note**: Current implementation uses plain-text password storage. This is a known security limitation and should be addressed in future iterations.

### 5.3 Reliability Requirements

| Requirement | Target |
|-------------|--------|
| System availability | 99.5% uptime |
| Data backup | Automatic via Supabase |
| Error handling | Graceful error messages for all failures |

### 5.4 Usability Requirements

| Requirement | Description |
|-------------|-------------|
| Accessibility | WCAG 2.1 AA compliance (target) |
| Responsiveness | Functional on tablet and desktop |
| Language support | Full English and Arabic support |
| Error feedback | Clear, actionable error messages |

### 5.5 Scalability Requirements

| Requirement | Target |
|-------------|--------|
| Client records | 10,000+ |
| Invoice records | 100,000+ |
| Reconciliation transactions | 50,000+ |

---

## 6. Data Requirements

### 6.1 Database Schema

#### 6.1.1 Users Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key |
| email | VARCHAR | Unique, Not Null |
| password | VARCHAR | Not Null |
| name | VARCHAR | Not Null |
| role | VARCHAR | Nullable |
| created_at | TIMESTAMP | Default: now() |

#### 6.1.2 Clients Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key |
| code | VARCHAR | Unique, Not Null |
| name | VARCHAR | Not Null |
| max_aging_days | INTEGER | Nullable |
| created_by | UUID | Foreign Key (users) |
| created_at | TIMESTAMP | Default: now() |
| deleted_at | TIMESTAMP | Nullable (soft delete) |
| last_reconciled_at | TIMESTAMP | Nullable |

#### 6.1.3 Invoices Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key |
| client_id | UUID | Foreign Key (clients), Not Null |
| invoice_number | VARCHAR | Unique, Not Null |
| order_id | VARCHAR | Unique, Nullable |
| invoice_date | DATE | Not Null |
| total_value | DECIMAL | Not Null |
| left_amount | DECIMAL | Not Null |
| status | ENUM | UNPAID, PARTIALLY_PAID, PAID |
| created_by | UUID | Foreign Key (users) |
| created_at | TIMESTAMP | Default: now() |

#### 6.1.4 Reconciliation Transactions Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key |
| client_id | UUID | Foreign Key (clients), Not Null |
| amount_paid | DECIMAL | Not Null |
| reconciliation_date | DATE | Not Null |
| created_by | UUID | Foreign Key (users) |
| created_at | TIMESTAMP | Default: now() |

#### 6.1.5 Activity Logs Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key |
| user_id | UUID | Foreign Key (users) |
| user_name | VARCHAR | Not Null |
| action_type | VARCHAR | Not Null |
| description | TEXT | Nullable |
| timestamp | TIMESTAMP | Default: now() |

### 6.2 Data Validation Rules

| Rule | Description |
|------|-------------|
| Client code uniqueness | Case-insensitive unique constraint |
| Invoice number uniqueness | System-wide unique |
| Order ID uniqueness | System-wide unique (when provided) |
| Invoice date validation | Cannot be in the future |
| Reconciliation date validation | Cannot be in the future |
| Overpayment prevention | Reconciliation amount ≤ client's total outstanding debt |
| Bulk import validation | All-or-nothing (entire sheet rejected if any error) |

---

## 7. Appendices

### 7.1 Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────────────────┐
│   Users     │       │   Clients   │       │        Invoices         │
├─────────────┤       ├─────────────┤       ├─────────────────────────┤
│ id (PK)     │──┐    │ id (PK)     │──┐    │ id (PK)                 │
│ email       │  │    │ code        │  │    │ client_id (FK)          │
│ password    │  │    │ name        │  ├───│ invoice_number          │
│ name        │  │    │ max_aging   │  │    │ order_id                │
│ role        │  │    │ created_by  │──┤    │ invoice_date            │
│ created_at  │  └───│ (FK)        │  │    │ total_value             │
└─────────────┘       │ created_at  │  │    │ left_amount             │
                      │ deleted_at  │  │    │ status                  │
                      │ last_rec_at │  │    │ created_by (FK)         │
                      └─────────────┘  │    │ created_at              │
                             │         │    └─────────────────────────┘
                             │         │
                             │         │    ┌─────────────────────────┐
                             │         │    │ Reconciliation Trans.   │
                             │         │    ├─────────────────────────┤
                             │         └───│ id (PK)                 │
                             │              │ client_id (FK)          │
                             │              │ amount_paid             │
                             │              │ reconciliation_date     │
                             │              │ created_by (FK)         │
                             │              │ created_at              │
                             │              └─────────────────────────┘
                             │
                             │              ┌─────────────────────────┐
                             │              │    Activity Logs        │
                             │              ├─────────────────────────┤
                             └─────────────│ id (PK)                 │
                                            │ user_id (FK)            │
                                            │ user_name               │
                                            │ action_type             │
                                            │ description             │
                                            │ timestamp               │
                                            └─────────────────────────┘
```

### 7.2 Invoice Status State Diagram

```
                    ┌───────────────────┐
                    │                   │
                    │      UNPAID       │◄──────────────────┐
                    │                   │                   │
                    └─────────┬─────────┘                   │
                              │                             │
                              │ Partial Payment             │ Created
                              │                             │
                              ▼                             │
                    ┌───────────────────┐                   │
                    │                   │                   │
                    │  PARTIALLY_PAID   │───────────────────┘
                    │                   │      (No more payment needed
                    └─────────┬─────────┘       - extremely rare rollback)
                              │
                              │ Full Payment
                              │
                              ▼
                    ┌───────────────────┐
                    │                   │
                    │       PAID        │
                    │                   │
                    └───────────────────┘

    Note: PAST_DUE is a derived status overlaid on UNPAID or PARTIALLY_PAID
          when aging_days > client.max_aging_days
```

### 7.3 Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2024 | Development Team | Initial release |

---

*End of Software Requirements Specification*
