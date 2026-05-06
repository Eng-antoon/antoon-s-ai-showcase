# CaterHub - Product Requirements Document (PRD)

**Version:** 1.0
**Last Updated:** March 2026
**Status:** Production

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Overview](#2-product-overview)
3. [User Personas & Roles](#3-user-personas--roles)
4. [Feature Specifications](#4-feature-specifications)
5. [Database Schema](#5-database-schema)
6. [Technical Architecture](#6-technical-architecture)
7. [User Flows](#7-user-flows)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [API Reference](#9-api-reference)
10. [Future Considerations](#10-future-considerations)

---

## 1. Executive Summary

### 1.1 Product Vision

**CaterHub** is Egypt's premier catering marketplace platform that revolutionizes how customers discover and book catering services for their events. The platform bridges the gap between catering vendors and customers, providing a seamless, bilingual (Arabic/English) experience for planning weddings, corporate events, birthdays, and other celebrations.

### 1.2 Problem Statement

- **For Customers:** Finding reliable catering vendors in Egypt is fragmented, requiring multiple phone calls, in-person visits, and manual price comparisons
- **For Vendors:** Marketing reach is limited, and managing bookings manually is time-consuming and error-prone
- **For the Market:** No centralized platform exists that offers transparency, reviews, and streamlined booking for catering services

### 1.3 Solution

CaterHub provides a unified platform where:
- Customers can browse vetted vendors, compare packages, read reviews, and book services online
- Vendors can showcase their offerings, manage availability, and handle bookings efficiently
- Admins ensure quality control and platform integrity

### 1.4 Target Market

- **Primary:** Egypt (Arabic and English speakers)
- **Event Types:** Weddings, corporate events, birthdays, graduations, engagements, funerals, conferences

### 1.5 Key Differentiators

| Feature | Description |
|---------|-------------|
| Bilingual Support | Full Arabic/English interface with RTL support |
| Verified Vendors | Admin approval workflow ensures quality |
| Consultation Booking | Integrated Google Meet for vendor consultations |
| PayMob Integration | Local Egyptian payment processing |
| Real-time Updates | Live booking status and notifications |
| Mobile-First Design | PWA with offline capabilities |

---

## 2. Product Overview

### 2.1 Platform Description

CaterHub is a full-stack web application built as a Progressive Web App (PWA) that functions across desktop and mobile devices. The platform operates as a three-sided marketplace connecting customers, vendors, and administrators.

### 2.2 Technology Stack

#### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 5.x | Build tool |
| Tailwind CSS | 3.x | Styling |
| shadcn/ui | Latest | Component library |
| React Router | 6.x | Routing |
| TanStack Query | 5.x | Server state |
| React Helmet Async | Latest | SEO |
| Lucide React | Latest | Icons |
| Mixpanel | Latest | Analytics |

#### Backend
| Technology | Purpose |
|------------|---------|
| Supabase | Backend-as-a-Service |
| PostgreSQL | Database |
| Supabase Auth | Authentication |
| Supabase Storage | File storage |
| Supabase Edge Functions | Serverless functions |
| Row Level Security | Data protection |

#### External Services
| Service | Purpose |
|---------|---------|
| PayMob | Egyptian payment gateway |
| Google OAuth | Social login |
| Google Maps | Location services |
| Google Meet | Video consultations |
| Web Push API | Push notifications |

### 2.3 Platform Access

- **Production URL:** https://caterhub.net
- **Mobile:** PWA installable on iOS and Android

---

## 3. User Personas & Roles

### 3.1 Customer

**Profile:**
- Individuals planning events in Egypt
- Age range: 25-55
- Seeking catering services for personal or professional events
- Prefers Arabic or English language

**Goals:**
- Find vetted catering vendors
- Compare prices and packages
- Read authentic reviews
- Book services conveniently
- Communicate with vendors

**Pain Points:**
- Difficulty finding reliable vendors
- Lack of price transparency
- Time-consuming comparison process
- No centralized review system

### 3.2 Vendor

**Profile:**
- Catering business owners in Egypt
- Range from small businesses to large catering companies
- Need online presence and booking management

**Goals:**
- Showcase menu items and packages
- Manage availability calendar
- Handle bookings efficiently
- Build reputation through reviews
- Increase customer reach

**Pain Points:**
- Limited marketing channels
- Manual booking management
- Difficulty reaching new customers
- No professional online presence

### 3.3 Admin

**Profile:**
- Platform operators
- Responsible for quality control and platform health
- Monitor transactions and user activity

**Goals:**
- Ensure vendor quality
- Manage user accounts
- Monitor platform metrics
- Handle disputes
- Feature top vendors

**Pain Points:**
- Manual vendor verification
- Platform abuse prevention
- Business intelligence needs

### 3.4 Role Permissions Matrix

| Feature | Customer | Vendor | Admin |
|---------|----------|--------|-------|
| Browse Vendors | ✅ | ✅ | ✅ |
| Book Services | ✅ | ❌ | ❌ |
| Leave Reviews | ✅ | ❌ | ❌ |
| Manage Menu Items | ❌ | ✅ | ✅ |
| Manage Packages | ❌ | ✅ | ✅ |
| Handle Bookings | ❌ | ✅ | ✅ |
| Approve Vendors | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |
| View Analytics | ❌ | ✅ (Own) | ✅ (All) |
| Feature Vendors | ❌ | ❌ | ✅ |

---

## 4. Feature Specifications

### 4.1 Authentication & Authorization

#### 4.1.1 Email/Password Authentication

**Description:** Users can sign up and log in using email and password.

**Requirements:**
- Email validation with confirmation
- Password minimum 8 characters
- Password reset via email
- Session persistence across browser sessions

**Implementation:**
- Supabase Auth handles authentication
- Automatic profile creation on signup
- Default role assignment (customer)

#### 4.1.2 Google OAuth

**Description:** Users can authenticate using their Google account.

**Requirements:**
- One-click Google sign-in
- Automatic profile population from Google
- Redirect handling for OAuth callback
- Session creation on successful auth

**Implementation:**
- Supabase Auth with Google provider
- `/auth/callback` route handles OAuth response
- Profile and role creation on first login

#### 4.1.3 Role-Based Access Control

**Description:** Platform enforces different access levels based on user roles.

**Roles:**
- `customer` - Default role for all users
- `vendor` - Assigned after vendor registration approval
- `admin` - Manually assigned

**Implementation:**
- `user_roles` table stores role assignments
- RLS policies enforce data access
- Protected routes check role before rendering
- Role caching in AuthContext

#### 4.1.4 Phone Verification

**Description:** Optional phone number verification for enhanced security.

**Requirements:**
- Phone number input with country code
- SMS verification code
- Verification status tracking

**Implementation:**
- `PhoneVerificationModal` component
- Supabase phone auth integration

#### 4.1.5 Session Management

**Description:** Secure session handling with persistence.

**Features:**
- JWT-based sessions via Supabase
- Automatic token refresh
- Session expiry handling
- Logout clears all local state

---

### 4.2 Customer Features

#### 4.2.1 Browse Vendors

**Description:** Customers can discover and search for catering vendors.

**Search Capabilities:**
- Full-text search by vendor name
- Filter by event type
- Filter by price range
- Filter by capacity
- Filter by city/location

**Display:**
- Vendor cards with logo, rating, price range
- Featured vendors highlighted
- Pagination for large result sets

**Implementation:**
- `VendorsListing` page
- TanStack Query for data fetching
- Client-side filtering and pagination

#### 4.2.2 Vendor Profile View

**Description:** Detailed vendor profile with all offerings.

**Profile Sections:**
1. **Header:** Logo, company name, rating, contact info
2. **About:** Description, event types, capacity
3. **Gallery:** Photo gallery of past events
4. **Packages:** Pre-built catering packages
5. **Menu Items:** Individual food items
6. **Reviews:** Customer reviews and ratings

**Features:**
- Bilingual content (Arabic/English)
- Add to cart from profile
- Contact vendor button
- Share profile link

**Implementation:**
- `VendorProfile` page
- Lazy-loaded images
- Tab-based navigation for content

#### 4.2.3 Shopping Cart

**Description:** Persistent shopping cart with vendor management.

**Cart Features:**
- Add packages (per-person pricing)
- Add menu items (per-unit pricing)
- Quantity adjustment
- Real-time total calculation
- Vendor switching with confirmation
- Local storage persistence

**Cart Rules:**
- Can only add items from one vendor at a time
- Switching vendors clears previous cart (with confirmation)
- Minimum order validation

**Implementation:**
- `CartContext` for state management
- localStorage for persistence
- `Cart` page for cart view
- `CartIconBadge` for header display

#### 4.2.4 Checkout Process

**Description:** Multi-step checkout for booking creation.

**Checkout Steps:**

1. **Event Details**
   - Event type selection (wedding, corporate, etc.)
   - Event date picker
   - Event time selection
   - Guest count input

2. **Location**
   - Google Maps location picker
   - Address auto-complete
   - Latitude/longitude capture

3. **Special Requests**
   - Dietary requirements
   - Special instructions
   - Custom requests

4. **Consultation (Optional)**
   - Schedule consultation with vendor
   - Select date and time
   - Google Meet link generation

5. **Review & Confirm**
   - Order summary
   - Total amount
   - Terms acceptance

**Validation:**
- Date must be in the future
- Date must not be in vendor's unavailable dates
- Guest count within vendor's capacity
- All required fields completed

**Implementation:**
- `Checkout` page with multi-step form
- `GoogleMapsLocationPicker` component
- Google Maps JavaScript API
- Form validation with Zod

#### 4.2.5 Booking Management

**Description:** Dashboard for customers to manage their bookings.

**Dashboard Features:**
- List of all bookings with status
- Filter by status (pending, confirmed, completed, cancelled)
- Booking detail view
- Status tracking timeline
- Cancel booking option
- Pay booking option
- Rate completed bookings

**Booking Statuses:**
| Status | Description |
|--------|-------------|
| `pending` | Awaiting vendor confirmation |
| `confirmed` | Vendor approved, awaiting payment |
| `completed` | Event completed successfully |
| `cancelled` | Booking cancelled |

**Implementation:**
- `CustomerDashboard` page
- `Bookings` page for individual booking
- TanStack Query for data fetching
- Real-time status updates

#### 4.2.6 Review System

**Description:** Customers can rate and review vendors after booking completion.

**Review Features:**
- Star rating (1-5)
- Written review
- Photo uploads (optional)
- One review per booking
- Edit existing reviews

**Review Display:**
- Average rating on vendor profile
- Review count
- Individual reviews with date
- Reviewer name (optional anonymity)

**Implementation:**
- `AddReview` page
- `RateVendorModal` component
- `reviews` table in database
- Vendor rating aggregation trigger

---

### 4.3 Vendor Features

#### 4.3.1 Vendor Registration

**Description:** Multi-step registration process for new vendors.

**Registration Steps:**

1. **Account Creation**
   - Email/password or Google OAuth
   - Email verification

2. **Business Information**
   - Company name (Arabic & English)
   - Description (Arabic & English)
   - Event types served
   - Capacity range (min/max guests)
   - Price range

3. **Contact Details**
   - Manager name and phone
   - Business phone
   - Business email
   - Business address
   - City

4. **Media Upload**
   - Logo upload
   - Cover image upload
   - Gallery images

5. **Review & Submit**
   - Summary of all information
   - Terms acceptance
   - Submit for admin approval

**Draft System:**
- Incomplete registrations saved as drafts
- Resume registration from last step
- Draft expires after 30 days

**Implementation:**
- `VendorRegistration` page
- `vendor_registration_drafts` table
- Multi-step form wizard
- Image upload to Supabase Storage

#### 4.3.2 Vendor Dashboard

**Description:** Central hub for vendor operations.

**Dashboard Sections:**

1. **Overview**
   - Total bookings
   - Revenue summary
   - Rating and reviews
   - Quick actions

2. **Bookings**
   - List of all bookings
   - Filter by status
   - Accept/reject bookings
   - View booking details
   - Update booking status

3. **Menu Items**
   - List of menu items
   - Add new items
   - Edit existing items
   - Delete items
   - Bilingual content

4. **Packages**
   - List of packages
   - Create packages
   - Edit packages
   - Manage package items
   - Set pricing

5. **Availability**
   - Calendar view
   - Block unavailable dates
   - Set availability status

6. **Analytics**
   - Booking trends
   - Revenue charts
   - Popular items
   - Customer demographics

**Implementation:**
- `VendorDashboard` page with tabs
- TanStack Query for data
- Recharts for analytics
- Calendar component for availability

#### 4.3.3 Menu Item Management

**Description:** Vendors can manage their food menu items.

**Menu Item Fields:**
| Field | Type | Required | Bilingual |
|-------|------|----------|-----------|
| name | string | Yes | Yes |
| description | text | Yes | Yes |
| category | string | Yes | No |
| price | decimal | Yes | No |
| image_url | string | No | No |

**Categories:**
- Appetizers
- Main Courses
- Desserts
- Beverages
- Custom

**Implementation:**
- `MenuItemForm` component
- `menu_items` table
- Image upload to Supabase Storage

#### 4.3.4 Package Management

**Description:** Vendors can create catering packages.

**Package Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Package name |
| description | text | Yes | Package description |
| event_type | enum | Yes | Target event type |
| price_per_person | decimal | Yes | Per-person pricing |
| min_guests | integer | Yes | Minimum guests |
| max_guests | integer | Yes | Maximum guests |
| includes | array | No | What's included |
| is_active | boolean | Yes | Active status |

**Package Items:**
- Link menu items to packages
- Set quantities per item
- Reorder items

**Implementation:**
- `PackageForm` component
- `packages` table
- `package_items` junction table

#### 4.3.5 Availability Management

**Description:** Vendors can set their availability calendar.

**Availability Features:**
- Block specific dates
- Set unavailable periods
- View bookings on calendar
- Bulk availability updates

**Implementation:**
- `vendor_availability` table
- Calendar UI component
- Date picker integration

#### 4.3.6 Profile Editing

**Description:** Vendors can update their profile information.

**Editable Fields:**
- Business information
- Contact details
- Media (logo, cover, gallery)
- Event types
- Capacity and pricing

**Implementation:**
- `VendorProfileEdit` page
- Form validation
- Image upload handling

---

### 4.4 Admin Features

#### 4.4.1 Admin Dashboard

**Description:** Central admin interface with platform overview.

**Dashboard Metrics:**
- Total users (by role)
- Total vendors (by status)
- Total bookings (by status)
- Revenue summary
- Recent activity feed
- Pending approvals

**Implementation:**
- `AdminDashboard` page
- Aggregate queries
- Real-time updates

#### 4.4.2 Vendor Management

**Description:** Admin can manage all vendor accounts.

**Management Actions:**
- View all vendors
- Filter by status
- Approve pending vendors
- Reject vendors with reason
- Suspend active vendors
- Feature vendors
- Edit vendor information

**Vendor Statuses:**
| Status | Description |
|--------|-------------|
| `pending` | Awaiting admin approval |
| `approved` | Active on platform |
| `rejected` | Rejected by admin |
| `suspended` | Temporarily disabled |

**Featured Vendor System:**
- Request featured status
- Admin approval workflow
- Featured badge on profile
- Priority in search results

**Implementation:**
- `AdminVendorsData` page
- Admin-only RLS policies
- Status update functions

#### 4.4.3 Booking Oversight

**Description:** Admin can view and manage all bookings.

**Features:**
- List all bookings
- Filter by status, vendor, date
- View booking details
- Update booking status
- Handle disputes
- View payment status

**Implementation:**
- `AdminBookings` page
- Comprehensive booking queries
- Status management

#### 4.4.4 User Management

**Description:** Admin can manage user accounts.

**Features:**
- List all users
- View user details
- Assign/change roles
- Disable accounts
- View user activity

**Implementation:**
- `AdminUsers` page
- Admin functions for role management
- User activity logging

#### 4.4.5 Analytics Dashboard

**Description:** Platform-wide analytics and reporting.

**Analytics Metrics:**
- User growth trends
- Vendor acquisition
- Booking volume
- Revenue trends
- Popular event types
- Geographic distribution
- Conversion funnels

**Implementation:**
- `AdminAnalytics` page
- Recharts visualizations
- Aggregate database queries
- Mixpanel integration

---

### 4.5 Payment Integration

#### 4.5.1 PayMob Integration

**Description:** Integration with PayMob for Egyptian payment processing.

**Payment Flow:**
1. Customer initiates payment
2. System creates PayMob intention
3. Customer redirected to PayMob
4. Payment completed
5. Webhook confirms payment
6. Booking status updated

**Payment Methods Supported:**
- Credit/Debit Cards
- Mobile Wallets
- Bank Transfers

**Implementation:**
- `create-paymob-intention` Edge Function
- `confirm-paymob-payment` Edge Function
- `paymob-callback` Edge Function
- `PaymobIframeModal` component

#### 4.5.2 Payment Tracking

**Description:** Track payment status for each booking.

**Payment Statuses:**
| Status | Description |
|--------|-------------|
| `pending` | No payment initiated |
| `uploaded` | Receipt uploaded, pending verification |
| `verified` | Payment confirmed |
| `partial_verified` | Partial payment confirmed |
| `failed` | Payment failed |

**Payment Terms:**
| Term | Description |
|------|-------------|
| `partial` | Partial payment (deposit) |
| `full` | Full payment |

**Payment Fields:**
- `payment_amount_expected` - Expected payment amount
- `payment_amount_verified` - Verified amount received
- `payment_receipt_url` - Receipt file URL
- `payment_verified_at` - Verification timestamp

#### 4.5.3 Receipt Upload

**Description:** Customers can upload payment receipts.

**Features:**
- Image/PDF upload
- File validation
- Secure storage
- Admin/Vendor verification

**Implementation:**
- `payment-receipts` storage bucket
- User-specific folders
- RLS policies for access control

---

### 4.6 Consultation System

#### 4.6.1 Consultation Booking

**Description:** Schedule video consultations with vendors.

**Consultation Features:**
- Select consultation date/time
- Google Meet link generation via Google Calendar API
- Calendar integration
- Email notifications

**Implementation:**
- Consultation fields in bookings table
- Google Calendar API integration (creates calendar event with Meet link)
- Requires OAuth consent for calendar access
- Date/time picker in checkout

**Note:** Google Meet links are generated through the Google Calendar API by creating a calendar event with conference data. This requires:
- Additional OAuth scope: `https://www.googleapis.com/auth/calendar.events`
- User consent for calendar access
- Calendar event creation (not standalone Meet link generation)

#### 4.6.2 Consultation Reminders

**Description:** Push notifications for upcoming consultations.

**Reminder Logic:**
- Send reminder 15 minutes before
- Include meeting link
- Deep link to booking

**Implementation:**
- `send-consultation-reminders` Edge Function
- Scheduled job execution
- Web Push API

---

### 4.7 Notifications

#### 4.7.1 Push Notifications

**Description:** Web push notifications for important events.

**Notification Types:**
- Booking confirmations
- Booking status updates
- Consultation reminders
- Payment confirmations
- New reviews

**Implementation:**
- `register-push-subscription` Edge Function
- `send-push-notification` Edge Function
- `get-vapid-public-key` Edge Function
- Service worker for push handling
- `PushNotificationPrompt` component
- `AutoPushSubscription` component

#### 4.7.2 In-App Notifications

**Description:** Real-time notifications within the application.

**Features:**
- Toast notifications
- Notification center
- Mark as read
- Notification history

**Implementation:**
- Supabase Realtime
- Toast component from shadcn/ui

---

## 5. Database Schema

### 5.1 Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   auth.users    │────<│    profiles     │     │   user_roles    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                                               │
        │                                               │
        ▼                                               │
┌─────────────────┐                                     │
│ vendor_reg...   │                                     │
│    _drafts      │                                     │
└─────────────────┘                                     │
        │                                               │
        ▼                                               │
┌─────────────────┐     ┌─────────────────┐             │
│    vendors      │────<│vendor_avail...  │             │
└─────────────────┘     └─────────────────┘             │
        │                                               │
        │                                               │
        ├──────────────────────┐                        │
        │                      │                        │
        ▼                      ▼                        │
┌─────────────────┐     ┌─────────────────┐             │
│   menu_items    │     │    packages     │             │
└─────────────────┘     └─────────────────┘             │
        │                      │                        │
        │                      │                        │
        └──────────┬───────────┘                        │
                   │                                    │
                   ▼                                    │
           ┌─────────────────┐                          │
           │  package_items  │                          │
           └─────────────────┘                          │
                                                          │
┌─────────────────┐     ┌─────────────────┐             │
│    bookings     │────<│  booking_items  │             │
└─────────────────┘     └─────────────────┘             │
        │                                               │
        │                                               │
        ▼                                               │
┌─────────────────┐                                     │
│    reviews      │<────────────────────────────────────┘
└─────────────────┘
```

### 5.2 Table Definitions

#### 5.2.1 user_roles

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Primary key |
| user_id | uuid | FK → auth.users, NOT NULL | User reference |
| role | app_role | NOT NULL | User role |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |

**Unique Constraint:** (user_id, role)

**Role Assignment Rules:**
- Each user has exactly **one primary role** at a time
- The unique constraint allows for role history but current implementation assigns a single role per user
- When a user's role changes (e.g., customer becomes vendor), the previous role is removed and the new role is added
- AuthContext caches the single active role and determines permissions based on that role

#### 5.2.2 profiles

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, FK → auth.users | User reference |
| full_name | text | | Full name |
| phone | text | | Phone number |
| avatar_url | text | | Avatar image URL |
| preferred_language | text | DEFAULT 'en' | Language preference |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Update timestamp |

#### 5.2.3 vendors

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Primary key |
| user_id | uuid | FK → auth.users, UNIQUE | Owner reference |
| company_name | text | NOT NULL | Company name |
| company_name_ar | text | | Arabic company name |
| description | text | NOT NULL | Description |
| description_ar | text | | Arabic description |
| event_types | event_type[] | NOT NULL | Supported events |
| min_capacity | integer | NOT NULL | Minimum guests |
| max_capacity | integer | NOT NULL | Maximum guests |
| price_range | text | NOT NULL | Price range |
| logo_url | text | | Logo URL |
| cover_image_url | text | | Cover image URL |
| gallery_urls | text[] | | Gallery images |
| manager_name | text | | Manager name |
| manager_phone | text | | Manager phone |
| phone | text | | Business phone |
| email | text | | Business email |
| address | text | | Address |
| city | text | | City |
| latitude | float8 | | Latitude |
| longitude | float8 | | Longitude |
| vendor_status | vendor_status | DEFAULT 'pending' | Approval status |
| is_featured | boolean | DEFAULT false | Featured flag (derived) |
| featured_status | featured_status | DEFAULT 'none' | Featured status |

**Featured Status Logic:**
- `is_featured` is a denormalized boolean derived from `featured_status = 'approved'`
- `featured_status` tracks the workflow: `none` → `pending` → `approved`/`rejected`
- When `featured_status` changes to `approved`, `is_featured` is set to `true`
- When `featured_status` changes to `rejected` or `none`, `is_featured` is set to `false`
- This redundancy exists for query performance on featured listings
| rating | numeric | DEFAULT 0 | Average rating |
| review_count | integer | DEFAULT 0 | Review count |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Update timestamp |

#### 5.2.4 vendor_registration_drafts

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Primary key |
| user_id | uuid | FK → auth.users, UNIQUE | User reference |
| current_step | integer | DEFAULT 1 | Current step |
| [All vendor fields as nullable] | | | Draft data |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Update timestamp |

#### 5.2.5 vendor_availability

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Primary key |
| vendor_id | uuid | FK → vendors | Vendor reference |
| date | date | NOT NULL | Date |
| is_available | boolean | DEFAULT true | Availability status |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |

**Unique Constraint:** (vendor_id, date)

#### 5.2.6 menu_items

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Primary key |
| vendor_id | uuid | FK → vendors | Vendor reference |
| name | text | NOT NULL | Item name |
| name_ar | text | | Arabic name |
| description | text | | Description |
| description_ar | text | | Arabic description |
| category | text | NOT NULL | Category |
| price | numeric | NOT NULL | Price |
| image_url | text | | Image URL |
| is_active | boolean | DEFAULT true | Active status |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Update timestamp |

#### 5.2.7 packages

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Primary key |
| vendor_id | uuid | FK → vendors | Vendor reference |
| name | text | NOT NULL | Package name |
| description | text | | Description |
| event_type | event_type | | Target event type |
| price_per_person | numeric | NOT NULL | Per-person price |
| min_guests | integer | | Minimum guests |
| max_guests | integer | | Maximum guests |
| includes | text[] | | What's included |
| is_active | boolean | DEFAULT true | Active status |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Update timestamp |

#### 5.2.8 package_items

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Primary key |
| package_id | uuid | FK → packages | Package reference |
| menu_item_id | uuid | FK → menu_items | Menu item reference |
| quantity | integer | DEFAULT 1 | Quantity |

#### 5.2.9 bookings

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Primary key |
| vendor_id | uuid | FK → vendors | Vendor reference |
| customer_id | uuid | FK → auth.users | Customer reference |
| package_id | uuid | FK → packages, **NULLABLE** | Package reference (optional) |
| event_type | event_type | NOT NULL | Event type |
| event_date | date | NOT NULL | Event date |
| event_time | time | | Event time |
| guest_count | integer | NOT NULL | Number of guests |
| location | text | | Event location |
| latitude | float8 | | Latitude |
| longitude | float8 | | Longitude |
| customer_name | text | NOT NULL | Customer name |
| customer_phone | text | NOT NULL | Customer phone |
| customer_email | text | | Customer email |
| special_requests | text | | Special requests |
| needs_consultation | boolean | DEFAULT false | Consultation needed |
| consultation_date | date | | Consultation date |
| consultation_time | time | | Consultation time |
| consultation_meet_link | text | | Google Meet link |
| total_amount | numeric | NOT NULL | Total amount |
| booking_status | booking_status | DEFAULT 'pending' | Booking status |
| payment_term | payment_term | | Payment term |
| payment_receipt_url | text | | Receipt URL |
| payment_amount_expected | numeric | | Expected payment |
| payment_amount_verified | numeric | | Verified payment |
| payment_status | payment_status | DEFAULT 'pending' | Payment status |
| payment_verified_at | timestamptz | | Verification time |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Update timestamp |

**Booking Types:**
- **Package Booking:** `package_id` is set, customer selects a pre-built package
- **Custom Booking:** `package_id` is NULL, customer selects individual menu items via `booking_items`
- At least one of `package_id` or `booking_items` must be present for a valid booking

**Validation:**
- Application-level validation ensures at least one booking item exists before creating a booking without a package
- Checkout form validates cart contents before submission
- Future: Consider adding a database CHECK constraint for data integrity

#### 5.2.10 booking_items

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Primary key |
| booking_id | uuid | FK → bookings | Booking reference |
| menu_item_id | uuid | FK → menu_items | Menu item reference |
| quantity | integer | NOT NULL | Quantity |
| unit_price | numeric | NOT NULL | Unit price |
| is_custom_addition | boolean | DEFAULT false | Custom item flag |

#### 5.2.11 reviews

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Primary key |
| booking_id | uuid | FK → bookings, UNIQUE | Booking reference |
| customer_id | uuid | FK → auth.users | Customer reference |
| vendor_id | uuid | FK → vendors | Vendor reference |
| rating | integer | NOT NULL, CHECK (1-5) | Star rating |
| comment | text | | Review text |
| photos | text[] | | Photo URLs |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Update timestamp |

### 5.3 Enums

```sql
-- User Roles
CREATE TYPE app_role AS ENUM ('customer', 'vendor', 'admin');

-- Event Types
CREATE TYPE event_type AS ENUM (
  'wedding',
  'corporate',
  'birthday',
  'graduation',
  'engagement',
  'funeral',
  'conference',
  'other'
);

-- Booking Status
CREATE TYPE booking_status AS ENUM (
  'pending',
  'confirmed',
  'completed',
  'cancelled'
);

-- Vendor Status
CREATE TYPE vendor_status AS ENUM (
  'pending',
  'approved',
  'rejected',
  'suspended'
);

-- Payment Status
CREATE TYPE payment_status AS ENUM (
  'pending',
  'uploaded',
  'verified',
  'partial_verified',
  'failed'
);

-- Payment Term
CREATE TYPE payment_term AS ENUM ('partial', 'full');

-- Featured Status
CREATE TYPE featured_status AS ENUM (
  'none',
  'pending',
  'approved',
  'rejected'
);
```

### 5.4 Row Level Security (RLS) Policies

#### General Principles
- All tables have RLS enabled
- Users can only access their own data
- Admins have elevated permissions
- Public access for approved vendors

#### Key Policies Summary

| Table | Public | Customer | Vendor | Admin |
|-------|--------|----------|--------|-------|
| profiles | Read (own) | Full (own) | Full (own) | Full |
| user_roles | - | Read (own) | Read (own) | Full |
| vendors | Read (approved) | Read | Full (own) | Full |
| menu_items | Read | Read | Full (own) | Full |
| packages | Read | Read | Full (own) | Full |
| bookings | - | Full (own) | Read/Update (assigned) | Full |
| reviews | Read | Full (own) | Read | Full |
| vendor_availability | - | - | Full (own) | Full |

---

## 6. Technical Architecture

### 6.1 Frontend Architecture

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Layout components (Header, Footer)
│   ├── home/            # Home page components
│   ├── menu/            # Menu-related components
│   ├── booking/         # Booking components
│   └── vendor/          # Vendor components
├── pages/               # Page components (lazy-loaded)
│   ├── Index.tsx
│   ├── VendorsListing.tsx
│   ├── VendorProfile.tsx
│   ├── CustomerDashboard.tsx
│   ├── VendorDashboard.tsx
│   ├── AdminDashboard.tsx
│   └── ...
├── contexts/            # React contexts
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   └── LanguageContext.tsx
├── lib/                 # Utilities and configurations
│   ├── supabase.ts
│   ├── utils.ts
│   └── analytics.ts
├── types/               # TypeScript definitions
│   └── database.ts
├── hooks/               # Custom React hooks
├── App.tsx              # Main app with routing
└── main.tsx             # Entry point
```

### 6.2 Routing Structure

```typescript
// Public Routes
/                        → Index (Landing)
/vendors                 → VendorsListing
/vendors/:id             → VendorProfile
/auth                    → Auth (Login/Signup)
/auth/callback           → AuthCallback
/about                   → About
/terms                   → Terms
/privacy                 → Privacy
/payment-callback        → PaymentCallback

// Customer Routes (requireAuth)
/bookings                → CustomerDashboard
/bookings/:id            → Bookings
/bookings/:id/review     → AddReview
/cart                    → Cart
/checkout                → Checkout
/profile                 → Profile

// Vendor Routes (requireVendor)
/vendor/registration     → VendorRegistration
/vendor/dashboard        → VendorDashboard
/vendor/edit             → VendorProfileEdit

// Admin Routes (requireAdmin)
/admin                   → AdminDashboard
/admin/dashboard         → AdminDashboard
/admin/vendors           → AdminVendorsData
/admin/bookings          → AdminBookings
/admin/users             → AdminUsers
/admin/analytics         → AdminAnalytics
/admin/auth              → AdminAuth
```

### 6.3 State Management

#### React Contexts

1. **AuthContext**
   - User authentication state
   - Role management with caching
   - Session persistence
   - OAuth handling

2. **CartContext**
   - Shopping cart state
   - localStorage persistence
   - Vendor switching logic
   - Cart calculations

3. **LanguageContext**
   - Current language (en/ar)
   - RTL support
   - Translation keys

#### Server State

- **TanStack Query** for all server data
- Caching strategies per resource type
- Optimistic updates where appropriate
- Automatic refetch on window focus

### 6.4 Backend Architecture

#### Supabase Services

| Service | Usage |
|---------|-------|
| Database | PostgreSQL with RLS |
| Auth | Email/OAuth authentication |
| Storage | Image and file uploads |
| Edge Functions | Serverless business logic |
| Realtime | Live updates |

#### Edge Functions

| Function | Purpose |
|----------|---------|
| create-paymob-intention | Initialize PayMob payment |
| confirm-paymob-payment | Confirm payment completion |
| paymob-callback | Webhook handler for PayMob |
| validate-payment | Server-side payment validation before confirming (verifies amount, booking ownership, payment status) |
| send-consultation-reminders | Push notification reminders |
| send-push-notification | General push notifications |
| register-push-subscription | Manage push subscriptions |
| get-vapid-public-key | Return VAPID public key |

### 6.5 Database Triggers

| Trigger | Table | Purpose |
|---------|-------|---------|
| handle_new_user | auth.users | Auto-create profile and role |
| update_updated_at_column | All tables | Auto-update timestamp |
| update_vendor_rating | reviews | Aggregate vendor ratings |

---

## 7. User Flows

### 7.1 Customer Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    CUSTOMER JOURNEY                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. DISCOVERY                                                    │
│     │                                                            │
│     ├─→ Land on Homepage                                         │
│     │   ├─→ View Featured Vendors                                │
│     │   └─→ Browse Event Types                                   │
│     │                                                            │
│     └─→ Search/Browse Vendors                                    │
│         ├─→ Filter by Event Type                                 │
│         ├─→ Filter by Price Range                                │
│         └─→ Filter by Capacity                                   │
│                                                                  │
│  2. EXPLORATION                                                  │
│     │                                                            │
│     └─→ View Vendor Profile                                      │
│         ├─→ Read Description                                     │
│         ├─→ View Gallery                                         │
│         ├─→ Browse Packages                                      │
│         ├─→ Browse Menu Items                                    │
│         └─→ Read Reviews                                         │
│                                                                  │
│  3. SELECTION                                                    │
│     │                                                            │
│     └─→ Add to Cart                                              │
│         ├─→ Select Package (per person)                          │
│         └─→ Select Menu Items (per unit)                         │
│                                                                  │
│  4. CHECKOUT                                                     │
│     │                                                            │
│     ├─→ Login/Signup (if not authenticated)                      │
│     │                                                            │
│     └─→ Complete Checkout Form                                   │
│         ├─→ Event Details (type, date, time, guests)             │
│         ├─→ Location (Google Maps picker)                        │
│         ├─→ Special Requests                                     │
│         ├─→ Consultation Booking (optional)                      │
│         └─→ Review & Submit                                      │
│                                                                  │
│  5. BOOKING MANAGEMENT                                           │
│     │                                                            │
│     └─→ View Dashboard                                           │
│         ├─→ Track Status (pending → confirmed → completed)       │
│         ├─→ Make Payment                                         │
│         ├─→ Attend Consultation (if booked)                      │
│         └─→ Rate Vendor (after completion)                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Vendor Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    VENDOR JOURNEY                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. REGISTRATION                                                 │
│     │                                                            │
│     ├─→ Create Account (email/Google)                           │
│     │                                                            │
│     └─→ Complete Vendor Profile                                  │
│         ├─→ Business Information                                 │
│         ├─→ Contact Details                                      │
│         ├─→ Media Upload                                         │
│         └─→ Submit for Approval                                  │
│                                                                  │
│  2. SETUP (After Approval)                                       │
│     │                                                            │
│     ├─→ Create Menu Items                                        │
│     │   ├─→ Add descriptions (bilingual)                         │
│     │   ├─→ Set prices                                           │
│     │   └─→ Upload images                                        │
│     │                                                            │
│     ├─→ Create Packages                                          │
│     │   ├─→ Define inclusions                                    │
│     │   ├─→ Set pricing per person                               │
│     │   └─→ Link menu items                                      │
│     │                                                            │
│     └─→ Set Availability                                         │
│         └─→ Block unavailable dates                              │
│                                                                  │
│  3. OPERATIONS                                                   │
│     │                                                            │
│     └─→ Manage Dashboard                                         │
│         ├─→ View & Accept Bookings                               │
│         ├─→ Update Booking Status                                │
│         ├─→ Conduct Consultations                                │
│         └─→ View Analytics                                       │
│                                                                  │
│  4. GROWTH                                                       │
│     │                                                            │
│     ├─→ Request Featured Status                                  │
│     ├─→ Build Reviews                                            │
│     └─→ Update Profile                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Admin Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN JOURNEY                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. MONITORING                                                   │
│     │                                                            │
│     └─→ View Dashboard                                           │
│         ├─→ Platform Statistics                                  │
│         ├─→ Recent Activity                                      │
│         └─→ Pending Approvals                                    │
│                                                                  │
│  2. VENDOR MANAGEMENT                                            │
│     │                                                            │
│     ├─→ Review Pending Vendors                                   │
│     │   ├─→ Approve                                              │
│     │   └─→ Reject with reason                                   │
│     │                                                            │
│     ├─→ Manage Featured Vendors                                  │
│     │                                                            │
│     └─→ Handle Suspensions                                       │
│                                                                  │
│  3. BOOKING OVERSIGHT                                            │
│     │                                                            │
│     ├─→ View All Bookings                                        │
│     ├─→ Handle Disputes                                          │
│     └─→ Verify Payments                                          │
│                                                                  │
│  4. USER MANAGEMENT                                              │
│     │                                                            │
│     ├─→ View All Users                                           │
│     ├─→ Assign Roles                                             │
│     └─→ Disable Accounts                                         │
│                                                                  │
│  5. ANALYTICS                                                    │
│     │                                                            │
│     └─→ View Platform Analytics                                  │
│         ├─→ User Growth                                          │
│         ├─→ Booking Trends                                       │
│         ├─→ Revenue Reports                                      │
│         └─→ Conversion Funnels                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Non-Functional Requirements

### 8.1 Performance

| Metric | Target |
|---------|--------|
| Page Load Time | < 3 seconds |
| Time to Interactive | < 5 seconds |
| API Response Time | < 500ms (p95) |
| Image Optimization | WebP with fallbacks |
| Code Splitting | Route-level lazy loading |
| Caching | TanStack Query with stale times |

### 8.2 Security

| Requirement | Implementation |
|-------------|----------------|
| Authentication | Supabase Auth with JWT |
| Authorization | Row Level Security (RLS) |
| Data Encryption | TLS in transit, encrypted at rest |
| Input Validation | Zod schemas |
| SQL Injection | Parameterized queries via Supabase |
| XSS Prevention | React auto-escaping, CSP headers |
| File Uploads | Validated types, size limits |

### 8.2.1 Compliance & PII Handling

**Data Protection Measures:**

| Data Type | Handling |
|-----------|----------|
| Customer PII | Encrypted at rest, minimal logging |
| Payment Data | Never stored, handled by PayMob |
| Receipts | User-specific folders, RLS protected |
| Passwords | Hashed by Supabase Auth |

**Data Retention & Deletion:**

| Data | Retention | Deletion Trigger |
|------|-----------|------------------|
| User Profiles | Account lifetime | User deletion request |
| Bookings | 7 years (legal) | N/A |
| Reviews | Indefinite | User deletion (anonymized) |
| Payment Receipts | 7 years (legal) | N/A |
| Logs | 30 days | Automatic |

**User Rights (GDPR/CCPA):**
- **Data Export:** Users can request full data export via admin
- **Data Deletion:** Users can request account deletion via profile settings
- **Processing SLA:** Deletion requests processed within 30 days

**Logging Policy:**
- PII (email, phone, address) is redacted from logs
- Only user IDs logged for debugging
- Server logs retained for 30 days

**Payment Receipt Access:**
- Stored in `payment-receipts` bucket
- RLS policies restrict access:
  - Customer: Own receipts only
  - Vendor: Receipts for their bookings
  - Admin: All receipts

### 8.3 Accessibility

| Standard | Target |
|----------|--------|
| WCAG | 2.1 AA |
| Screen Readers | Full support |
| Keyboard Navigation | Full support |
| Color Contrast | 4.5:1 minimum |
| Focus Management | Visible focus indicators |

### 8.4 Mobile Responsiveness

| Breakpoint | Target |
|------------|--------|
| Mobile | 320px - 767px |
| Tablet | 768px - 1023px |
| Desktop | 1024px+ |

**Features:**
- Mobile-first design
- Touch-optimized interactions
- Bottom navigation on mobile
- Responsive images
- PWA installability

### 8.5 Internationalization

| Feature | Implementation |
|---------|----------------|
| Languages | Arabic (ar), English (en) |
| RTL Support | Full RTL layout for Arabic |
| Content | Bilingual database fields |
| Number Formatting | Locale-aware |
| Date Formatting | Locale-aware |

### 8.6 Reliability

| Metric | Target |
|--------|--------|
| Uptime | 99.9% |
| Error Rate | < 0.1% |
| Data Backup | Daily automated backups |
| Disaster Recovery | < 1 hour RTO |

---

## 9. API Reference

### 9.1 Supabase Client API

All database operations use the Supabase JavaScript client:

```typescript
import { supabase } from '@/lib/supabase';

// Example: Fetch vendors
const { data, error } = await supabase
  .from('vendors')
  .select('*')
  .eq('vendor_status', 'approved');
```

### 9.2 Edge Functions

| Function | Method | Endpoint |
|----------|--------|----------|
| create-paymob-intention | POST | /functions/v1/create-paymob-intention |
| confirm-paymob-payment | POST | /functions/v1/confirm-paymob-payment |
| paymob-callback | POST | /functions/v1/paymob-callback |
| validate-payment | POST | /functions/v1/validate-payment |
| send-push-notification | POST | /functions/v1/send-push-notification |
| register-push-subscription | POST | /functions/v1/register-push-subscription |
| get-vapid-public-key | GET | /functions/v1/get-vapid-public-key |

### 9.3 Storage Buckets

| Bucket | Purpose | Access |
|--------|---------|--------|
| payment-receipts | Payment receipt uploads | User-specific folders |
| vendor-images | Vendor logos and galleries | Public read |

---

## 10. Future Considerations

### 10.1 Potential Enhancements

| Feature | Priority | Description |
|---------|----------|-------------|
| Mobile App | High | Native iOS/Android apps |
| Chat System | High | Real-time messaging between customers and vendors |
| Advanced Analytics | Medium | Machine learning insights for vendors |
| Loyalty Program | Medium | Rewards for repeat customers |
| Multi-vendor Bookings | Medium | Book multiple vendors for one event |
| Inventory Management | Low | Real-time inventory tracking for vendors |
| AI Recommendations | Low | Personalized vendor suggestions |

### 10.2 Scalability Considerations

| Area | Current | Future |
|------|---------|--------|
| Database | Single region | Multi-region replication |
| Edge Functions | Single region | Edge distribution |
| CDN | Basic | Full CDN for static assets |
| Caching | Client-side | Redis caching layer |
| Search | Database | Elasticsearch |

### 10.3 Integration Opportunities

| Integration | Purpose |
|-------------|---------|
| WhatsApp Business | Customer communication |
| Calendar APIs | Outlook, Apple Calendar sync |
| Accounting Software | Vendor financial management |
| Social Media | Vendor marketing tools |

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| PWA | Progressive Web App - Web app with native app capabilities |
| RLS | Row Level Security - Database-level access control |
| VAPID | Voluntary Application Server Identification - Web push authentication |
| RTL | Right-to-Left - Text direction for Arabic and other languages |

## Appendix B: Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | March 2026 | Initial PRD creation |

---

*Document maintained by the CaterHub development team.*
