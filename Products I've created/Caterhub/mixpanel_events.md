# Mixpanel Analytics Events Reference

This document provides a complete reference for all analytics events tracked in CaterHub.

## Configuration

- **Token:** `3005cfdd1d1ebf0d7d63278f77fadddc`
- **API Host:** `https://api-eu.mixpanel.com`
- **Session Recording:** 100% of sessions
- **Text Masking:** Disabled (text is visible in recordings)

## Common Properties

All events automatically include:
- `User Role` - The user's role (customer, vendor, admin, or anonymous)
- `Language` - Current language preference (en, ro, etc.)
- `Timestamp` - ISO timestamp when the event occurred

---

## Authentication Events

| Event Name | Description | Properties |
|------------|-------------|------------|
| `Auth - Login Attempt` | User submitted login form | `Auth Method: email` |
| `Auth - Login Success` | Login successful | `Auth Method: email` |
| `Auth - Login Failure` | Login failed | `Auth Method: email`, `Error Message` |
| `Auth - Signup Attempt` | User submitted signup form | `Auth Method: email` |
| `Auth - Signup Success` | Account created | `Auth Method: email` |
| `Auth - Signup Failure` | Signup failed | `Auth Method: email`, `Error Message` |
| `Auth - Google Sign In` | Google OAuth initiated | `Auth Method: google`, `User Type` |
| `Auth - Logout` | User signed out | - |
| `Auth - User Type Selected` | Customer/Vendor chosen | `User Type: customer | vendor` |

---

## Navigation Events

| Event Name | Description | Properties |
|------------|-------------|------------|
| `Navigation - Header Click` | Header nav link clicked | `Destination` |
| `Navigation - Bottom Nav Click` | Mobile bottom nav clicked | `Destination`, `Role` |
| `Navigation - Language Toggle` | Language switched | `Previous Language`, `New Language` |
| `Navigation - User Dropdown` | User menu opened | - |

---

## Home Page Events

| Event Name | Description | Properties |
|------------|-------------|------------|
| `Home - Hero CTA Click` | "Find Caterers" clicked | - |
| `Home - Featured Vendor Click` | Vendor card clicked | `Vendor ID`, `Vendor Name` |
| `Home - View All Vendors` | View all link clicked | - |
| `Home - Event Type Click` | Event type card clicked | `Event Type` |

---

## Product Events

| Event Name | Description | Properties |
|------------|-------------|------------|
| `Product - Card Click` | Product card opened | `Product ID`, `Product Name`, `Vendor ID`, `Vendor Name`, `Price` |
| `Product - Add to Cart` | Added to cart | `Product ID`, `Product Name`, `Vendor ID`, `Vendor Name`, `Quantity`, `Price` |
| `Product - Quantity Change` | Quantity +/- clicked | `Product ID`, `Product Name`, `Vendor ID`, `Vendor Name`, `Quantity` |

---

## Cart Events

| Event Name | Description | Properties |
|------------|-------------|------------|
| `Cart - View` | Cart page opened | `Item Count`, `Cart Total` |
| `Cart - Remove Item` | Item removed | `Product ID`, `Product Name`, `Vendor ID`, `Vendor Name` |
| `Cart - Continue Shopping` | Back to vendor | `Vendor ID`, `Vendor Name` |
| `Cart - Checkout Click` | Proceed to checkout | `Item Count`, `Cart Total` |
| `Cart - Badge Click` | Cart icon clicked | - |

---

## Checkout Events

| Event Name | Description | Properties |
|------------|-------------|------------|
| `Checkout - Event Type Select` | Event type chosen | `Event Type` |
| `Checkout - Date Select` | Date picked | `Event Date` |
| `Checkout - Time Select` | Time entered | `Event Time` |
| `Checkout - Location Select` | Location picked | `Location` |
| `Checkout - Consultation Toggle` | Consultation on/off | `Consultation Requested` |
| `Checkout - Submit Booking` | Place order clicked | `Event Type`, `Event Date`, `Event Time`, `Location`, `Guest Count`, `Total Amount`, `Consultation Requested`, `Vendor ID`, `Vendor Name` |
| `Checkout - Booking Success` | Booking created | `Booking ID`, `Total Amount` |
| `Checkout - Booking Failure` | Booking failed | `Error Message` |

---

## Vendor Profile Events

| Event Name | Description | Properties |
|------------|-------------|------------|
| `Vendor Profile - View` | Vendor page opened | `Vendor ID`, `Vendor Name` |
| `Vendor Profile - Tab Change` | Tab switched | `Tab: menu | packages | reviews | about` |

---

## Vendor Dashboard Events

| Event Name | Description | Properties |
|------------|-------------|------------|
| `Vendor Dashboard - View` | Dashboard opened | - |
| `Vendor Dashboard - Menu Item Add` | Menu item created | `Item ID`, `Item Name` |
| `Vendor Dashboard - Menu Item Edit` | Menu item updated | `Item ID`, `Item Name` |
| `Vendor Dashboard - Menu Item Delete` | Menu item deleted | `Item ID`, `Item Name` |
| `Vendor Dashboard - Package Add` | Package created | `Item ID`, `Item Name` |
| `Vendor Dashboard - Package Edit` | Package updated | `Item ID`, `Item Name` |
| `Vendor Dashboard - Package Delete` | Package deleted | `Item ID`, `Item Name` |
| `Vendor Dashboard - Availability Update` | Calendar updated | - |
| `Vendor Dashboard - Booking Action` | Accept/Reject booking | `Booking ID`, `Booking Action: accept | reject` |
| `Vendor Dashboard - Section Navigate` | Tab changed | `Section: menu | packages | bookings | availability` |

---

## Vendor Registration Events

| Event Name | Description | Properties |
|------------|-------------|------------|
| `Vendor Registration - Step 1 Complete` | Business info submitted | - |
| `Vendor Registration - Step 2 Complete` | Menu items added | - |
| `Vendor Registration - Submitted` | Registration complete | - |

---

## Admin Events

| Event Name | Description | Properties |
|------------|-------------|------------|
| `Admin - Dashboard View` | Dashboard opened | - |
| `Admin - Vendors View` | Vendors page opened | - |
| `Admin - Bookings View` | Bookings page opened | - |
| `Admin - Users View` | Users page opened | - |
| `Admin - Analytics View` | Analytics page opened | - |
| `Admin - Filter Apply` | Filter changed | `Filter Type`, `Filter Value` |
| `Admin - Export Data` | Export clicked | - |
| `Admin - Vendor Action` | Approve/Reject/Suspend | `Target ID`, `Action Taken` |
| `Admin - Booking Action` | Booking status change | `Target ID`, `Action Taken` |
| `Admin - User Action` | User management | `Target ID`, `Action Taken` |

---

## Page View Event

| Event Name | Description | Properties |
|------------|-------------|------------|
| `Page View` | Route changed | `Page Name`, `Page Path` |

### Page Names

| Path | Page Name |
|------|-----------|
| `/` | Home |
| `/vendors` | Vendors Listing |
| `/vendors/:id` | Vendor Profile |
| `/auth` | Auth |
| `/auth/callback` | Auth Callback |
| `/admin/auth` | Admin Auth |
| `/admin` | Admin Dashboard |
| `/admin/dashboard` | Admin Dashboard |
| `/admin/vendors` | Admin Vendors |
| `/admin/bookings` | Admin Bookings |
| `/admin/users` | Admin Users |
| `/admin/analytics` | Admin Analytics |
| `/bookings` | Customer Bookings |
| `/bookings/:id` | Booking Details |
| `/bookings/:id/review` | Add Review |
| `/cart` | Cart |
| `/checkout` | Checkout |
| `/vendor/registration` | Vendor Registration |
| `/vendor/dashboard` | Vendor Dashboard |
| `/vendor/edit` | Vendor Edit |
| `/profile` | Profile |

---

## User Properties

When a user is identified, the following properties are set:

| Property | Mixpanel Name | Source |
|----------|---------------|--------|
| User ID | `$distinct_id` | `user.id` |
| Email | `$email` | `user.email` |
| Name | `$name` | `user.user_metadata.full_name` |
| Phone | `Phone Number` | `profiles.phone` |
| Role | `User Role` | `user_roles.role` |
| Created | `Account Created Date` | `user.created_at` |
| Language | `Language Preference` | `localStorage.language` |

---

## Funnels

### Funnel 1: User Registration
```
1. Auth - User Type Selected (Customer)
2. Auth - Signup Attempt
3. Auth - Signup Success
```

### Funnel 2: Vendor Registration
```
1. Auth - User Type Selected (Vendor)
2. Auth - Signup Success
3. Vendor Registration - Step 1 Complete
4. Vendor Registration - Step 2 Complete
5. Vendor Registration - Submitted
```

### Funnel 3: Booking Flow (Customer)
```
1. Home - Hero CTA Click OR Home - Featured Vendor Click
2. Vendor Profile - View
3. Product - Add to Cart
4. Cart - Checkout Click
5. Checkout - Submit Booking
6. Checkout - Booking Success
```

### Funnel 4: Google Sign-In
```
1. Auth - Google Sign In
2. Auth - Login Success
```

### Funnel 5: Vendor Engagement
```
1. Vendor Dashboard - View
2. Vendor Dashboard - Menu Item Add OR Vendor Dashboard - Package Add
3. Vendor Dashboard - Booking Action (Accept)
```

### Funnel 6: Admin Review Funnel
```
1. Admin - Vendors View
2. Admin - Filter Apply (Pending Status)
3. Admin - Vendor Action (Approve/Reject)
```

---

## Implementation Notes

### Initialization
Mixpanel is initialized in `AuthContext.tsx` when the app loads:
```typescript
initMixpanel();
```

### User Identification
Users are identified in `AuthContext.tsx` when their role is fetched:
```typescript
identifyUser(userId, {
  $email: user.email,
  $name: user.user_metadata.full_name,
  'Phone Number': profile.phone,
  'User Role': role,
  'Account Created Date': user.created_at,
  'Language Preference': language,
});
```

### User Reset
When a user signs out, their identity is reset:
```typescript
resetUser();
```

### React Hook
Use the `useAnalytics` hook in components:
```typescript
const { track, trackButtonClick, trackAuthEvent, trackCartEvent } = useAnalytics();
```

### Button Tracking
For buttons, use the `TrackButton` component:
```typescript
<TrackButton
  trackName="Button Name"
  trackLocation="Component Name"
  onClick={handleClick}
>
  Click Me
</TrackButton>
```

---

## Testing

### Test User Identification
1. Login as customer
2. Check Mixpanel > Users > see user profile with all properties
3. Verify role, email, name, phone are populated

### Test Page Views
1. Navigate through all pages
2. Check Mixpanel > Events > "Page View" events
3. Verify page names are correct

### Test Button Tracking
1. Click various buttons
2. Check Mixpanel > Events for tracked events
3. Verify properties include userRole and buttonName

### Test Session Recording
1. Login and perform actions
2. Check Mixpanel > Sessions
3. Verify text is visible (not masked with `*`)

### Test Funnels
1. Complete booking flow as customer
2. Check Mixpanel > Funnels
3. Verify conversion steps are tracked
