# Product Requirements Document (PRD)

## ILLA Finance System

> **Version:** 1.0  
> **Last Updated:** December 2024  
> **Product Owner:** ILLA Trucking Finance Department

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Goals](#2-product-vision--goals)
3. [User Personas](#3-user-personas)
4. [User Stories](#4-user-stories)
5. [Feature Prioritization](#5-feature-prioritization)
6. [Technical Architecture](#6-technical-architecture)
7. [Risk Assessment](#7-risk-assessment)
8. [Release Plan](#8-release-plan)
9. [Success Metrics](#9-success-metrics)
10. [Appendices](#10-appendices)

---

## 1. Executive Summary

### 1.1 Product Overview

The ILLA Finance System is a purpose-built back-office application designed to streamline accounts receivable operations for ILLA Trucking. The system provides comprehensive tools for managing client relationships, tracking invoices throughout their lifecycle, and reconciling payments using industry-standard FIFO methodology.

### 1.2 Business Problem

ILLA Trucking's finance team faces several challenges in managing accounts receivable:

- **Manual tracking**: Invoice and payment tracking through spreadsheets is error-prone
- **Lack of visibility**: No centralized view of outstanding receivables and overdue accounts
- **Inefficient reconciliation**: Manual payment allocation is time-consuming and inconsistent
- **Audit gaps**: Limited audit trail for financial operations
- **Communication delays**: No automated notifications for past-due accounts

### 1.3 Solution

The ILLA Finance System addresses these challenges by providing:

- **Centralized data management**: Single source of truth for clients, invoices, and payments
- **Real-time analytics**: Dashboard with instant visibility into receivables and overdue amounts
- **Automated FIFO reconciliation**: Consistent, auditable payment allocation
- **Comprehensive audit logging**: Complete trail of all financial operations
- **Automated notifications**: Daily email alerts for past-due invoices
- **Bilingual support**: Full Arabic/English support for the local team

### 1.4 Target Users

Primary users are finance team members at ILLA Trucking headquarters in Egypt, requiring Arabic language support and EGP currency throughout the system.

---

## 2. Product Vision & Goals

### 2.1 Vision Statement

*"To empower ILLA Trucking's finance team with an intuitive, reliable, and efficient accounts receivable management system that eliminates manual processes, ensures data accuracy, and provides actionable insights for better financial decision-making."*

### 2.2 Strategic Goals

| Goal | Description | Measurement |
|------|-------------|-------------|
| **Efficiency** | Reduce time spent on manual reconciliation | 70% reduction in reconciliation time |
| **Accuracy** | Eliminate payment allocation errors | 100% accurate FIFO allocation |
| **Visibility** | Provide real-time receivables insights | < 5 seconds to view current status |
| **Compliance** | Maintain complete audit trail | 100% of actions logged |
| **Accessibility** | Support bilingual operations | Full Arabic/English support |

### 2.3 Key Objectives

1. Replace spreadsheet-based invoice tracking with structured database
2. Implement automated FIFO payment reconciliation
3. Provide real-time dashboard with key financial metrics
4. Enable bulk data import for efficient data entry
5. Automate past-due notifications to improve collections
6. Deliver full Arabic localization with RTL support

---

## 3. User Personas

### 3.1 Primary Persona: Finance Administrator

**Name**: Fatima Hassan  
**Role**: Senior Finance Administrator  
**Age**: 42  
**Technical Skill**: Moderate

#### Background
Fatima has 15 years of experience in finance at ILLA Trucking. She oversees the accounts receivable team and is responsible for ensuring accurate financial reporting and timely collections.

#### Goals
- Monitor overall receivables health at a glance
- Quickly identify high-risk overdue accounts
- Ensure team members follow consistent reconciliation processes
- Generate accurate reports for management

#### Pain Points
- Spending hours consolidating data from multiple spreadsheets
- Difficulty tracking which invoices are past due
- No confidence in payment allocation accuracy
- Limited visibility into team members' actions

#### Preferred Features
- Dashboard with real-time metrics
- Client analytics sorted by risk
- Comprehensive activity log
- Bulk import capabilities

---

### 3.2 Secondary Persona: Finance Team Member

**Name**: Ahmed Mohamed  
**Role**: Accounts Receivable Specialist  
**Age**: 28  
**Technical Skill**: Basic to Moderate

#### Background
Ahmed joined ILLA Trucking 3 years ago. He handles day-to-day invoice creation, payment processing, and client communications.

#### Goals
- Quickly create and update invoices
- Process payments accurately and efficiently
- Find specific invoices and client information fast
- Work comfortably in Arabic

#### Pain Points
- Manual data entry is tedious and error-prone
- Difficulty remembering FIFO rules for payment allocation
- Searching through large Excel files takes too long
- English-only systems are harder to use

#### Preferred Features
- Simple invoice creation forms
- Automated FIFO reconciliation
- Fast search and filtering
- Full Arabic language support

---

## 4. User Stories

### 4.1 Epic: Authentication

#### US-1.1: User Login
**As a** finance team member  
**I want to** log into the system with my credentials  
**So that** I can access financial data securely

**Acceptance Criteria:**
- [ ] Login page with email and password fields
- [ ] Error message for invalid credentials
- [ ] Redirect to dashboard on successful login
- [ ] Session persists until explicit logout

---

### 4.2 Epic: Dashboard

#### US-2.1: View Financial Overview
**As a** finance administrator  
**I want to** see key financial metrics on the dashboard  
**So that** I can quickly assess accounts receivable health

**Acceptance Criteria:**
- [ ] Display total outstanding receivables
- [ ] Display total overdue receivables
- [ ] Display client count
- [ ] Display invoice count
- [ ] Data updates in real-time

#### US-2.2: View Client Risk Analysis
**As a** finance administrator  
**I want to** see clients sorted by overdue amount  
**So that** I can prioritize collection efforts

**Acceptance Criteria:**
- [ ] List all clients on dashboard
- [ ] Sort by overdue amount (highest first)
- [ ] Display overdue amount per client
- [ ] Display total outstanding per client
- [ ] Click client to filter dashboard

#### US-2.3: Filter Dashboard by Client
**As a** finance team member  
**I want to** filter dashboard metrics by specific client  
**So that** I can focus on a single account

**Acceptance Criteria:**
- [ ] Searchable client dropdown
- [ ] Metrics update when client selected
- [ ] Clear filter option available
- [ ] Search by name and code

---

### 4.3 Epic: Client Management

#### US-3.1: View Clients
**As a** finance team member  
**I want to** view all clients in a searchable list  
**So that** I can find client information quickly

**Acceptance Criteria:**
- [ ] Display client name, code, max aging days
- [ ] Search by name or code
- [ ] Display client count
- [ ] Responsive table layout

#### US-3.2: Create Client
**As a** finance team member  
**I want to** add new clients to the system  
**So that** I can track their invoices

**Acceptance Criteria:**
- [ ] Form with name, code, max aging days fields
- [ ] Code uniqueness validation
- [ ] Success notification on creation
- [ ] Action logged to activity log

#### US-3.3: Edit Client
**As a** finance team member  
**I want to** update client information  
**So that** records stay accurate

**Acceptance Criteria:**
- [ ] Edit button opens pre-filled form
- [ ] All fields editable
- [ ] Code uniqueness re-validated
- [ ] Changes logged to activity log

#### US-3.4: Delete Client
**As a** finance administrator  
**I want to** remove clients without transactions  
**So that** the client list stays clean

**Acceptance Criteria:**
- [ ] Delete button with confirmation dialog
- [ ] Block deletion if invoices exist
- [ ] Block deletion if reconciliation transactions exist
- [ ] Show reason when blocked
- [ ] Soft delete (retain in database)
- [ ] Deletion logged to activity log

#### US-3.5: Bulk Import Clients
**As a** finance team member  
**I want to** import multiple clients from Excel  
**So that** I can add clients efficiently

**Acceptance Criteria:**
- [ ] Download template button
- [ ] File upload with validation
- [ ] All-or-nothing import (reject all if any error)
- [ ] Detailed error modal for failures
- [ ] Download errors option
- [ ] Success notification with count
- [ ] Bulk import logged to activity log

---

### 4.4 Epic: Invoice Management

#### US-4.1: View Invoices
**As a** finance team member  
**I want to** view all invoices with status and aging  
**So that** I can track outstanding receivables

**Acceptance Criteria:**
- [ ] Paginated table (20 per page)
- [ ] Display: invoice number, client, date, amount, status, aging days
- [ ] PAID invoices at bottom
- [ ] Other invoices sorted by aging (oldest first)
- [ ] Visual indicators for PAST_DUE status

#### US-4.2: Filter Invoices
**As a** finance team member  
**I want to** filter invoices by status and client  
**So that** I can find specific invoices quickly

**Acceptance Criteria:**
- [ ] Status filter dropdown
- [ ] Client filter with searchable combobox
- [ ] Search by invoice number and order ID
- [ ] Filters work across all pages
- [ ] Clear filter options

#### US-4.3: Create Invoice
**As a** finance team member  
**I want to** add new invoices to the system  
**So that** I can track client receivables

**Acceptance Criteria:**
- [ ] Form with: client, invoice number, order ID, date, amount
- [ ] Client selection via searchable dropdown
- [ ] Invoice number uniqueness validation
- [ ] Order ID uniqueness validation
- [ ] Reject future dates
- [ ] Default status: UNPAID
- [ ] Action logged to activity log

#### US-4.4: Edit Invoice
**As a** finance team member  
**I want to** update UNPAID invoice details  
**So that** I can correct errors

**Acceptance Criteria:**
- [ ] Only UNPAID invoices editable
- [ ] Error message for non-UNPAID invoices
- [ ] All fields except status editable
- [ ] Uniqueness validations apply
- [ ] Changes logged to activity log

#### US-4.5: Delete Invoice
**As a** finance team member  
**I want to** remove invoices  
**So that** I can correct data entry errors

**Acceptance Criteria:**
- [ ] Delete button with confirmation
- [ ] Deletion logged to activity log

#### US-4.6: Bulk Import Invoices
**As a** finance team member  
**I want to** import multiple invoices from Excel  
**So that** I can add invoices efficiently

**Acceptance Criteria:**
- [ ] Download template button
- [ ] File upload with validation
- [ ] Client code lookup validation
- [ ] Invoice number uniqueness validation
- [ ] Order ID uniqueness validation
- [ ] Date validation (no future dates)
- [ ] All-or-nothing import
- [ ] Detailed error modal for failures
- [ ] Download errors option
- [ ] Success notification with count

---

### 4.5 Epic: Reconciliation

#### US-5.1: Manual Reconciliation
**As a** finance team member  
**I want to** record a payment against a client  
**So that** their invoices are updated correctly

**Acceptance Criteria:**
- [ ] Select client via searchable dropdown
- [ ] Display client's current outstanding debt
- [ ] Enter payment amount and date
- [ ] Reject future dates
- [ ] Reject overpayment (amount > debt)
- [ ] Apply FIFO algorithm automatically
- [ ] Update invoice statuses
- [ ] Record reconciliation transaction
- [ ] Action logged to activity log

#### US-5.2: View Outstanding Invoices
**As a** finance team member  
**I want to** see a client's unpaid invoices during reconciliation  
**So that** I understand what payments will be applied to

**Acceptance Criteria:**
- [ ] Display UNPAID and PARTIALLY_PAID invoices
- [ ] Show invoice number, date, total, remaining
- [ ] Sort by date (oldest first - FIFO order)
- [ ] Update in real-time when client changes

#### US-5.3: Bulk Reconciliation
**As a** finance team member  
**I want to** import multiple payments from Excel  
**So that** I can process payments efficiently

**Acceptance Criteria:**
- [ ] Download template button
- [ ] File upload with validation
- [ ] Client code lookup validation
- [ ] Date validation (no future dates)
- [ ] Overpayment validation per client
- [ ] All-or-nothing import
- [ ] Detailed error modal for failures
- [ ] Download errors option
- [ ] Success notification with count

#### US-5.4: View Reconciliation History
**As a** finance administrator  
**I want to** view past reconciliation transactions  
**So that** I can audit payment records

**Acceptance Criteria:**
- [ ] Display all reconciliation transactions
- [ ] Show: date, client, amount, processed by
- [ ] Sort by date (newest first)
- [ ] Filter by client
- [ ] Read-only (no edit/delete)

---

### 4.6 Epic: Activity Log

#### US-6.1: View Activity Log
**As a** finance administrator  
**I want to** view all user actions in the system  
**So that** I can audit operations

**Acceptance Criteria:**
- [ ] Display all logged actions
- [ ] Show: timestamp, user, action type, description
- [ ] Sort by timestamp (newest first)
- [ ] Search functionality
- [ ] Read-only

---

### 4.7 Epic: Localization

#### US-7.1: Switch Language
**As a** finance team member  
**I want to** switch between English and Arabic  
**So that** I can use the system in my preferred language

**Acceptance Criteria:**
- [ ] Language toggle button visible on all pages
- [ ] Full Arabic translation of all UI text
- [ ] RTL layout in Arabic mode
- [ ] Sidebar moves to right in Arabic mode
- [ ] Numbers remain in English numerals
- [ ] Language preference persists

---

### 4.8 Epic: Notifications

#### US-8.1: Receive Past-Due Alerts
**As a** finance administrator  
**I want to** receive daily emails about past-due invoices  
**So that** I can prioritize collection efforts

**Acceptance Criteria:**
- [ ] Email sent daily at 10 AM Egypt time
- [ ] Include all invoices where aging > max_aging_days
- [ ] Show: invoice number, client, order ID, date, amount
- [ ] Sort by amount (highest first)
- [ ] Professional HTML email template
- [ ] Link to invoices page in email

---

## 5. Feature Prioritization

### 5.1 MoSCoW Matrix

| Priority | Features |
|----------|----------|
| **Must Have** | Authentication, Client CRUD, Invoice CRUD, Manual Reconciliation, FIFO Algorithm, Activity Logging, Arabic Localization |
| **Should Have** | Dashboard Analytics, Bulk Import (all), Reconciliation History, Invoice Filtering, Client Filtering |
| **Could Have** | Email Notifications, Invoice Export, Error File Download, Analytics Tracking |
| **Won't Have (v1)** | User Management, Role-Based Access, Payment Reminders, Integration with Accounting Software |

### 5.2 Feature Dependencies

```
Authentication
    └── All Features (requires login)

Client Management
    └── Invoice Management (requires clients)
        └── Reconciliation (requires invoices)
            └── Email Notifications (requires past-due calculation)

Localization
    └── All UI Components (parallel development)

Analytics
    └── All Features (cross-cutting concern)
```

---

## 6. Technical Architecture

### 6.1 Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui |
| **State Management** | React Context, TanStack Query |
| **Backend** | Supabase (PostgreSQL) |
| **Authentication** | Custom (users table) |
| **Email** | Resend API via Edge Function |
| **Analytics** | Mixpanel |
| **Hosting** | Lovable Cloud |

### 6.2 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              React Application (SPA)                 │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │    │
│  │  │  Pages   │  │Components│  │  Context/Hooks   │   │    │
│  │  └──────────┘  └──────────┘  └──────────────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                       Supabase                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  PostgreSQL  │  │ Edge Function│  │    pg_cron       │   │
│  │   Database   │  │  (Emails)    │  │  (Scheduler)     │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
┌─────────────────────┐   ┌─────────────────────┐
│       Resend        │   │      Mixpanel       │
│   (Email Service)   │   │    (Analytics)      │
└─────────────────────┘   └─────────────────────┘
```

### 6.3 Data Flow: Reconciliation

```
1. User selects client and enters payment amount
                    │
                    ▼
2. Frontend validates: client selected, amount > 0, date not future
                    │
                    ▼
3. Frontend fetches client's UNPAID + PARTIALLY_PAID invoices
                    │
                    ▼
4. Frontend calculates total outstanding debt
                    │
                    ▼
5. Validate: payment amount ≤ total debt (prevent overpayment)
                    │
                    ▼
6. Sort invoices by date (oldest first - FIFO)
                    │
                    ▼
7. Loop: Allocate payment to each invoice until exhausted
   │
   ├── Update invoice.left_amount
   └── Update invoice.status (PAID if left_amount = 0)
                    │
                    ▼
8. Create reconciliation_transaction record
                    │
                    ▼
9. Update client.last_reconciled_at
                    │
                    ▼
10. Log action to activity_logs
                    │
                    ▼
11. Display success message
```

---

## 7. Risk Assessment

### 7.1 Technical Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **Plain-text passwords** | High | Certain | Document as known limitation; plan future migration to hashed passwords |
| **Supabase downtime** | High | Low | Monitor status; implement graceful error handling |
| **Bulk import performance** | Medium | Medium | Limit batch size; implement progress indicators |
| **Browser compatibility** | Medium | Low | Test on major browsers; use polyfills |

### 7.2 Business Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **User adoption resistance** | High | Medium | Provide training; ensure Arabic support; responsive support |
| **Data migration errors** | High | Medium | Validate imported data; maintain rollback capability |
| **Incorrect reconciliation** | High | Low | Thorough FIFO testing; activity logging for audit |

### 7.3 Security Considerations

**Current Limitations:**
- Plain-text password storage (not recommended for production)
- No multi-factor authentication
- No session timeout
- No IP-based access restrictions

**Mitigations in Place:**
- Row Level Security (RLS) on database tables
- HTTPS for all communications
- No self-registration (admin-controlled user creation)

**Future Improvements:**
- Implement password hashing (bcrypt)
- Add session timeout
- Consider MFA for admin users

---

## 8. Release Plan

### 8.1 Phase 1: Core Foundation (Completed)

**Duration**: 4 weeks

**Features Delivered:**
- ✅ User authentication (login/logout)
- ✅ Client management (CRUD + bulk import)
- ✅ Invoice management (CRUD + bulk import)
- ✅ Basic dashboard
- ✅ Activity logging

**Milestone**: System operational for basic invoice tracking

---

### 8.2 Phase 2: Reconciliation (Completed)

**Duration**: 3 weeks

**Features Delivered:**
- ✅ Manual reconciliation with FIFO
- ✅ Overpayment prevention
- ✅ Bulk reconciliation import
- ✅ Reconciliation history
- ✅ Enhanced dashboard with client analytics

**Milestone**: Full accounts receivable workflow operational

---

### 8.3 Phase 3: Localization & Notifications (Completed)

**Duration**: 2 weeks

**Features Delivered:**
- ✅ Arabic language translation
- ✅ RTL layout support
- ✅ Daily past-due email notifications
- ✅ Language toggle with persistence

**Milestone**: Full bilingual support; automated notifications

---

### 8.4 Phase 4: Analytics & Polish (Completed)

**Duration**: 2 weeks

**Features Delivered:**
- ✅ Mixpanel integration
- ✅ Comprehensive event tracking
- ✅ Validation failure tracking
- ✅ Error modal button tracking
- ✅ UI/UX refinements

**Milestone**: Production-ready with analytics

---

### 8.5 Future Roadmap

**Potential Future Enhancements:**
- Password hashing implementation
- User management interface
- Role-based access control
- Payment reminders via email
- Report generation (PDF)
- Integration with accounting software
- Mobile-responsive improvements
- Advanced analytics dashboards

---

## 9. Success Metrics

### 9.1 Key Performance Indicators (KPIs)

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Reconciliation time** | 70% reduction | Time tracking comparison |
| **Payment allocation accuracy** | 100% | Audit review |
| **User adoption** | 100% of finance team | Login analytics |
| **System uptime** | 99.5% | Monitoring |
| **Page load time** | < 3 seconds | Performance monitoring |
| **User satisfaction** | > 4/5 rating | User feedback surveys |

### 9.2 Analytics Events to Monitor

| Category | Key Events |
|----------|------------|
| **Engagement** | Page views, session duration |
| **Feature usage** | Reconciliation completions, bulk imports |
| **Errors** | Validation failures, import errors |
| **Language** | Language toggle events, language distribution |

---

## 10. Appendices

### 10.1 Glossary

| Term | Definition |
|------|------------|
| **Accounts Receivable** | Money owed to the company by customers |
| **FIFO** | First-In-First-Out payment allocation method |
| **Aging Days** | Number of days since invoice date |
| **Max Aging Days** | Client-specific payment term (days until past due) |
| **Past Due** | Invoice exceeding max aging days without full payment |
| **Reconciliation** | Process of recording and allocating received payments |
| **Soft Delete** | Marking record as deleted without removing from database |
| **RTL** | Right-to-left text direction (Arabic) |

### 10.2 Related Documents

- Software Requirements Specification (SRS): `docs/SRS.md`
- Mixpanel Events Documentation: `docs/Mixpanel_Events.md`
- Database Types: `src/integrations/supabase/types.ts`

### 10.3 Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2024 | Development Team | Initial release |

---

*End of Product Requirements Document*
