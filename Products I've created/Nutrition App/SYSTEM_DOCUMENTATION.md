# NutriTrack — System Documentation (Product Manager View)

**Generated:** 2026-05-06
**Project:** NutriTrack (nutrationAPP)
**Status:** In Development (Uncommitted Changes)

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Target Users & Value Proposition](#2-target-users--value-proposition)
3. [Technology Stack](#3-technology-stack)
4. [Feature Catalog](#4-feature-catalog)
5. [User Flows](#5-user-flows)
6. [Data Architecture](#6-data-architecture)
7. [Integration Map](#7-integration-map)
8. [Route Architecture](#8-route-architecture)
9. [Component Inventory](#9-component-inventory)
10. [Business Logic & Calculations](#10-business-logic--calculations)
11. [Security Model](#11-security-model)
12. [Current State & Gaps](#12-current-state--gaps)

---

## 1. Product Overview

**NutriTrack** is an AI-powered nutrition tracking web application that helps users monitor daily food intake, track macronutrients, log weight progress, and achieve personalized fitness goals. The app combines camera-based AI food recognition with manual entry to minimize friction in meal logging.

**Core Problem:** Most nutrition apps require tedious manual data entry for every meal, leading to poor retention. NutriTrack uses AI vision (Google Gemini) to analyze food photos instantly, reducing logging effort from minutes to seconds.

**Product Differentiator:** AI-first food logging with real-time camera analysis, combined with science-based calorie/macro calculations personalized to each user's body composition and goals.

---

## 2. Target Users & Value Proposition

### Primary Users
| Segment | Description | Key Need |
|---------|-------------|----------|
| Fitness beginners | People starting their fitness journey | Simple, guided setup with clear targets |
| Weight loss seekers | Users aiming to reduce body fat | Calorie deficit tracking with visual progress |
| Muscle builders | Users in caloric surplus for muscle gain | Macro tracking (high protein emphasis) |
| Health-conscious | General wellness-focused individuals | Balanced nutrition monitoring |

### Value Propositions per Feature

| Feature | User Value | Business Value |
|---------|-----------|---------------|
| AI Food Scanner | Zero-effort meal logging via photo | Reduces onboarding friction, increases retention |
| Personalized Goals | Science-based targets (Mifflin-St Jeor) | Builds trust through accuracy, reduces churn |
| Weekly Analytics | Pattern recognition in eating habits | Increases engagement through insights |
| Weight Tracking | Visual progress proof over time | Motivation anchor, long-term retention driver |
| Macro Tracking | Nutritional quality beyond just calories | Educates users, builds product stickiness |

---

## 3. Technology Stack

### Frontend
| Technology | Version | Reason |
|-----------|---------|--------|
| React | 18.3.1 | Industry-standard UI library, large ecosystem |
| TypeScript | 5.8.3 | Type safety reduces runtime bugs |
| Vite | 5.4.19 | Fast HMR, optimized builds |
| Tailwind CSS | 3.4.17 | Utility-first CSS, rapid UI development |
| shadcn/ui | Latest | Accessible, unstyled components for consistent design |
| Radix UI | Various | WAI-ARIA compliant primitives |
| Framer Motion | 12.34.0 | Smooth page transitions and micro-animations |
| React Router DOM | 6.30.1 | Client-side routing |
| React Query | 5.83.0 | Server state management, caching, refetching |
| React Hook Form | 7.61.1 | Performant form handling |
| Zod | 3.25.76 | Runtime type validation, form schemas |
| Recharts | 2.15.4 | Charting for weekly stats and weight progress |
| date-fns | 3.6.0 | Date manipulation and formatting |
| Lucide React | 0.462.0 | Consistent icon library |

### Backend & Services
| Service | Purpose | Reason |
|---------|---------|--------|
| Supabase | Auth, Database (PostgreSQL), Storage | Open-source Firebase alternative, built-in RLS, real-time capable |
| Google Gemini API | AI food analysis (image + text) | Multimodal AI, fast inference, cost-effective |
| Supabase Auth | Email/password authentication | Integrated with DB, RLS support, session management |

### Development
| Tool | Purpose |
|------|---------|
| Vitest | Unit/integration testing |
| React Testing Library | Component testing |
| ESLint | Code quality |
| PostCSS | CSS processing |

---

## 4. Feature Catalog

### 4.1 Authentication & Account Management

**Features:**
- Email/password registration
- Email/password login
- Password reset (UI placeholder, not yet functional)
- Session persistence across browser refreshes
- Auto-redirect based on auth state

**Why this exists:** Users need private, personalized data. Auth is the gateway to all tracked nutrition data. Without accounts, there's no way to persist goals, meals, or progress. Email/password was chosen over social auth for simplicity in MVP.

**Status:** Functional. Password reset pending implementation.

---

### 4.2 Onboarding Flow (5-Step Wizard)

**Steps:**
1. **Personal Info** — Full name, phone number (optional), age, biological sex
2. **Body Stats** — Height (cm), weight (kg)
3. **Activity Level** — Sedentary, Light, Moderate, Active, Extra Active
4. **Fitness Goal** — Lose Weight, Maintain, Build Muscle, Gain Weight
5. **Summary** — Calculated BMR, TDEE, daily calorie target, macro split

**Why this exists:** Generic calorie targets (e.g., "2000 cal/day") fail most users. The 5-step wizard collects enough data to calculate personalized targets using the Mifflin-St Jeor equation — the most accurate BMR formula for the general population. Step-by-step UI reduces cognitive load compared to one long form. Summary step builds user confidence by showing the math behind their targets.

**Validation Rules:**
- Name: minimum 2 characters
- Age: 13-120
- Height: 100-250 cm
- Weight: 30-300 kg
- Gender, activity level, goal: required selections

**On Completion:**
- Profile saved to Supabase `profiles` table
- Initial weight entry created in `weight_entries` table
- User redirected to Dashboard

---

### 4.3 Dashboard (Home Screen)

**Components:**
- **Calorie Pulse** — Animated circular progress showing calories consumed vs. daily goal. 4 visual states: low (<50%), good (50-90%), warning (90-110%), over (>110%)
- **Macro Progress** — Protein/Carbs/Fat progress bars with current vs. goal values
- **Quick Actions** — Shortcut buttons to log breakfast, lunch, dinner, snack, or drink
- **Meal History** — Scrollable list of recent meals with delete option
- **Refresh Button** — Manual data reload

**Why this exists:** The dashboard is the most visited screen. It answers the user's primary question: "How am I doing today?" at a glance. Calorie pulse gives instant visual feedback without reading numbers. Macro breakdown ensures users don't just track calories but also nutritional quality. Quick actions reduce friction for the most common task (logging meals).

**Data Flow:**
- Fetches all meals for the user (last 7 days)
- Calculates today's nutrition from meal data
- Compares against profile goals

---

### 4.4 AI Food Scanner

**Modes:**
1. **Camera Mode** — Capture photo via device camera (front/back toggle)
2. **Upload Mode** — Upload existing photo from gallery
3. **Manual Mode** — Text description of meal

**Flow:**
1. User captures/uploads photo OR types description
2. Image/text sent to Google Gemini API for analysis
3. AI returns: food items identified, portion estimates, full nutritional breakdown
4. User reviews results, adjusts portions if needed
5. User selects meal type (breakfast/lunch/dinner/snack/drink)
6. Meal saved to database

**Why this exists:** Manual calorie lookup is the #1 reason users abandon nutrition apps. AI-powered photo analysis reduces a 2-minute task to 10 seconds. Manual text fallback covers cases where photos aren't practical (e.g., already ate the food). Portion adjustment lets users correct AI estimates, building trust.

**AI Response Structure:**
- Individual food items with name, portion, macros, confidence score (0-1)
- Total nutrition (calories, protein, carbs, fat, fiber)
- Brief description of identified foods

**Error Handling:**
- API failure: user-friendly error toast, returns to scan mode
- Unclear image: AI returns low confidence scores, user can adjust
- No text entered: validation prevents submission

---

### 4.5 Weekly Statistics

**Components:**
- **Week Selector** — Navigate between current and past weeks (up to 4 weeks back)
- **Stats Grid** — Average calories/day, days on goal, meals logged, days tracked
- **Weekly Chart** — Bar chart showing daily calories vs. goal line
- **Macro Breakdown** — Pie chart showing protein/carbs/fat distribution
- **Macro Averages** — Animated progress bars for daily macro averages vs. goals

**Why this exists:** Daily tracking alone creates a "trees vs. forest" problem. Weekly aggregation reveals eating patterns (e.g., overeating on weekends, under-eating on weekdays). Days-on-goal metric gamifies consistency. Macro breakdown helps users understand if they're hitting protein targets for muscle building or eating too much fat for weight loss.

**Calculations:**
- Averages computed per day (not per meal) to avoid skew from uneven meal distribution
- Days on goal = days where total calories <= daily calorie goal
- Week starts on Monday (ISO standard)

---

### 4.6 Weight Tracker

**Components:**
- **Stats Cards** — Current weight, total change (color-coded), lowest, highest
- **Progress Chart** — Area chart with selectable time ranges (30/60/90 days)
- **Weight History** — Chronological list with change badges and notes
- **Log Weight Dialog** — Weight input + optional note

**Why this exists:** Weight is the most tangible progress metric for fitness goals. Visual chart progress is a powerful motivator — seeing a downward trend reinforces continued effort. Notes provide context (e.g., "after vacation", "started new program"). Time range selection lets users focus on recent trends vs. long-term progress.

**Special Behaviors:**
- Auto-seeds initial weight entry from onboarding data if none exist
- Updating weight also updates the profile's current weight
- Change badges: green for loss (positive for weight loss goals), amber for gain
- Requires minimum 2 entries to display chart

---

### 4.7 User Profile

**Sections:**
- Profile card with avatar (initials fallback), name, email
- Body statistics: age, gender, height, weight, phone
- Activity & goals: activity level label, fitness goal label
- Daily targets: calories, protein, carbs, fat, TDEE
- Sign out button

**Why this exists:** Users need to verify their profile data is correct. Displaying calculated targets (TDEE, macros) transparently shows how goals were derived, building trust. Edit button is present but edit functionality is not yet implemented.

---

### 4.8 Navigation & Layout

**Components:**
- **Desktop Sidebar** — Persistent left sidebar with navigation links
- **Mobile Bottom Nav** — Fixed bottom navigation bar
- **Mobile Header** — Contextual header for mobile screens
- **Route Protection** — Auth-aware routing (public-only, protected, onboarding-gated)

**Why this exists:** Responsive layout ensures usability across devices. Bottom nav on mobile follows platform conventions (thumb-reachable). Sidebar on desktop uses available screen space better. Route protection prevents unauthorized access and ensures onboarding completion before main app access.

---

## 5. User Flows

### 5.1 New User Registration

```
Landing (/) → Auth (/auth) → Register Tab → Enter email, password, name
  → If email confirmation enabled: "Check your email" message
  → If email confirmation disabled: Redirect to Onboarding (/onboarding)
    → Step 1: Personal info → Step 2: Body stats → Step 3: Activity → Step 4: Goal
    → Step 5: Review calculated targets → Submit → Dashboard (/dashboard)
```

### 5.2 Returning User Login

```
Landing (/) → Auth (/auth) → Login Tab → Enter email, password
  → Profile loaded → Check onboarding_completed
    → If completed: Dashboard (/dashboard)
    → If not completed: Onboarding (/onboarding)
```

### 5.3 Meal Logging (Camera)

```
Dashboard → Scanner (/scanner) → Capture photo → AI analyzing spinner
  → Results displayed → Review/adjust portions → Select meal type → Confirm
  → Meal saved → Redirect to Dashboard (updated nutrition)
```

### 5.4 Meal Logging (Manual)

```
Dashboard → Quick Action (meal type) → Scanner (/scanner?mode=manual)
  → Type description → Analyze → Results → Confirm → Dashboard
```

### 5.5 Weight Logging

```
Weight Tracker (/weight) → "Log Weight" button → Dialog opens
  → Enter weight + optional note → Save → Chart & history updated
```

---

## 6. Data Architecture

### 6.1 Database Tables

#### `profiles`
| Column | Type | Nullable | Purpose |
|--------|------|----------|---------|
| id | UUID (PK) | No | Auto-generated record ID |
| user_id | UUID (FK → auth.users) | No | Links to Supabase Auth |
| email | string | No | User email |
| full_name | string | Yes | Display name |
| avatar_url | string | Yes | Profile picture URL |
| phone_number | string | Yes | Contact number |
| age | integer | Yes | For BMR calculation |
| gender | 'male' \| 'female' | Yes | For BMR calculation |
| height_cm | integer | Yes | For BMR calculation |
| weight_kg | float | Yes | Current weight |
| activity_level | enum | Yes | For TDEE multiplier |
| goal | enum | Yes | For calorie adjustment |
| tdee | integer | Yes | Calculated maintenance calories |
| daily_calorie_goal | integer | Yes | Target calories per day |
| daily_protein_goal | integer | Yes | Target protein (g) per day |
| daily_carbs_goal | integer | Yes | Target carbs (g) per day |
| daily_fat_goal | integer | Yes | Target fat (g) per day |
| onboarding_completed | boolean | No | Gates app access |
| created_at | timestamp | No | Account creation date |
| updated_at | timestamp | No | Last modification date |

**Why:** Single table for all profile data keeps queries simple. Nullable fields allow incremental onboarding. Calculated fields (tdee, goals) are stored to avoid recalculating on every request.

#### `meals`
| Column | Type | Nullable | Purpose |
|--------|------|----------|---------|
| id | UUID (PK) | No | Auto-generated record ID |
| user_id | UUID (FK) | No | Owner reference |
| name | string | No | Meal display name |
| meal_type | enum | No | breakfast/lunch/dinner/snack/drink |
| description | string | Yes | Food items summary |
| calories | integer | No | Total calories |
| protein_g | float | No | Total protein |
| carbs_g | float | No | Total carbs |
| fat_g | float | No | Total fat |
| fiber_g | float | Yes | Total fiber |
| image_url | string | Yes | Food photo URL |
| logged_at | timestamp | No | When meal was eaten |
| created_at | timestamp | No | Record creation |
| updated_at | timestamp | No | Last modification |

**Why:** Stores aggregated meal nutrition. Individual food items stored separately in `meal_items` for granularity. `logged_at` allows historical meal entry (not just current time).

#### `meal_items`
| Column | Type | Nullable | Purpose |
|--------|------|----------|---------|
| id | UUID (PK) | No | Auto-generated record ID |
| meal_id | UUID (FK → meals) | No | Parent meal reference |
| user_id | UUID (FK) | No | Owner reference (denormalized) |
| name | string | No | Food item name |
| portion | string | Yes | Portion description |
| calories | integer | No | Item calories |
| protein_g | float | No | Item protein |
| carbs_g | float | No | Item carbs |
| fat_g | float | No | Item fat |
| fiber_g | float | Yes | Item fiber |
| confidence | float | Yes | AI confidence score (0-1) |
| created_at | timestamp | No | Record creation |

**Why:** Allows per-item nutrition breakdown. Confidence score from AI helps users know which estimates to trust. Denormalized `user_id` enables direct user-scoped queries without joining meals table.

#### `weight_entries`
| Column | Type | Nullable | Purpose |
|--------|------|----------|---------|
| id | UUID (PK) | No | Auto-generated record ID |
| user_id | UUID (FK) | No | Owner reference |
| weight_kg | float | No | Recorded weight |
| note | string | Yes | Context note |
| recorded_at | timestamp | No | When weight was measured |
| created_at | timestamp | No | Record creation |

**Why:** Separate table from profile because weight history needs multiple entries over time. Profile stores only current weight; this table stores the full timeline. Notes add context for each measurement.

### 6.2 Data Relationships

```
auth.users (Supabase Auth)
  └── profiles (1:1, via user_id)
  └── meals (1:N, via user_id)
  │     └── meal_items (1:N, via meal_id)
  └── weight_entries (1:N, via user_id)
```

### 6.3 Client-Side State Management

| State | Mechanism | Purpose |
|-------|-----------|---------|
| Auth (user, session, profile) | React Context (AuthContext) | Global auth state, available to all components |
| Server data (meals, weights, stats) | React Query (via useState + fetch) | Fetch/cache/refetch server data |
| Form state | React Hook Form | Onboarding and auth forms |
| UI state (modals, tabs, steps) | Component-level useState | Local UI interactions |

---

## 7. Integration Map

### 7.1 Supabase Integration

**Client:** `@supabase/supabase-js` v2.95.3

**Operations:**

| Operation | Table | Purpose |
|-----------|-------|---------|
| `signUp` | auth.users | Register new user |
| `signInWithPassword` | auth.users | Authenticate user |
| `signOut` | auth.users | End session |
| `resetPasswordForEmail` | auth.users | Password reset flow |
| `onAuthStateChange` | auth.users | Session lifecycle listener |
| `getProfile` | profiles | Fetch user profile |
| `createProfile` | profiles | Initial profile creation |
| `updateProfile` (upsert) | profiles | Update profile data |
| `getMeals` | meals | Fetch user's meals |
| `createMeal` | meals + meal_items | Log meal with food items |
| `updateMeal` | meals | Edit meal data |
| `deleteMeal` | meals | Remove meal |
| `getDailyNutrition` | meals | Aggregate daily nutrition |
| `getWeeklyStats` | meals | Aggregate weekly stats |
| `getWeightEntries` | weight_entries | Fetch weight history |
| `addWeightEntry` | weight_entries + profiles | Log weight + update profile |
| `deleteWeightEntry` | weight_entries | Remove weight entry |
| `getMealItems` | meal_items | Fetch items for a meal |

**Supabase Project ID:** `cnijilfvpcztnmhfuklp`

### 7.2 Google Gemini API Integration

**Client:** `@google/generative-ai` v0.24.1
**Model:** `gemini-3-flash-preview`

| Function | Input | Output | Purpose |
|----------|-------|--------|---------|
| `analyzeFoodImage` | Base64 image + MIME type | FoodAnalysisResult | Identify foods from photo |
| `analyzeFoodText` | Text description | FoodAnalysisResult | Estimate nutrition from text |
| `adjustPortion` | FoodItem + multiplier | FoodItem | Scale nutrition by portion size |
| `calculateTotals` | FoodItem[] | Nutrition totals | Aggregate multi-item meals |

**AI Prompt Design:**
- Role set as "professional nutritionist"
- Structured JSON output enforced (no markdown)
- Confidence scores required per food item
- Realistic portion estimation emphasized

---

## 8. Route Architecture

| Route | Page | Auth Required | Onboarding Required | Layout |
|-------|------|---------------|-------------------|--------|
| `/` | Index (redirect) | No | No | None |
| `/auth` | Auth (Login/Register) | No (public-only) | No | AuthLayout |
| `/onboarding` | Onboarding Wizard | Yes | No (must NOT be completed) | None |
| `/dashboard` | Dashboard | Yes | Yes | MainLayout |
| `/scanner` | Food Scanner | Yes | Yes | MainLayout |
| `/stats` | Weekly Statistics | Yes | Yes | MainLayout |
| `/weight` | Weight Tracker | Yes | Yes | MainLayout |
| `/profile` | User Profile | Yes | Yes | MainLayout |
| `*` | 404 Not Found | No | No | None |

**Route Guards:**
- `ProtectedRoute` — Requires authenticated session
- `ProtectedRoute requireOnboarding={false}` — Requires auth, blocks if onboarding completed
- `PublicOnlyRoute` — Redirects to dashboard if already authenticated

---

## 9. Component Inventory

### Pages (8 files)
| File | Component | Purpose |
|------|-----------|---------|
| `Index.tsx` | Index | Entry point, redirects based on auth/onboarding state |
| `Onboarding.tsx` | OnboardingPage | 5-step profile setup wizard |
| `Dashboard.tsx` | DashboardPage | Main nutrition overview |
| `Scanner.tsx` | ScannerPage | AI food analysis interface |
| `WeeklyStats.tsx` | WeeklyStatsPage | Weekly nutrition analytics |
| `WeightTracker.tsx` | WeightTrackerPage | Weight progress tracking |
| `Profile.tsx` | ProfilePage | User profile display |
| `NotFound.tsx` | NotFound | 404 error page |

### Auth Components (1 file)
| File | Component | Purpose |
|------|-----------|---------|
| `Auth.tsx` | AuthPage | Login/register tabbed form with Supabase auth |

### Dashboard Components (5 files)
| File | Component | Purpose |
|------|-----------|---------|
| `CaloriePulse.tsx` | CaloriePulse | Animated calorie progress circle |
| `MacroProgress.tsx` | MacrosGrid | Protein/carbs/fat progress bars |
| `MealHistory.tsx` | MealHistory | Recent meals list with delete |
| `MealDetailModal.tsx` | MealDetailModal | Detailed meal breakdown |
| `QuickActions.tsx` | QuickActions, QuickActionsMini | Meal type shortcut buttons |

### Scanner Components (2 files)
| File | Component | Purpose |
|------|-----------|---------|
| `FoodScanner.tsx` | FoodScanner | Camera/upload interface |
| `ScanResult.tsx` | ScanResult | AI results display with portion adjustment |

### Stats Components (3 files)
| File | Component | Purpose |
|------|-----------|---------|
| `WeeklyChart.tsx` | WeeklyChart | Recharts bar chart for daily calories |
| `MacroBreakdown.tsx` | MacroBreakdown | Pie chart for macro distribution |
| `StatCard.tsx` | StatCard, StatsGrid | Reusable stat display cards |

### Layout Components (4 files)
| File | Component | Purpose |
|------|-----------|---------|
| `Layout.tsx` | MainLayout, AuthLayout | Page wrapper with nav |
| `Header.tsx` | Header | Mobile top bar |
| `BottomNav.tsx` | BottomNav | Mobile bottom navigation |
| `DesktopNav.tsx` | DesktopNav | Desktop sidebar navigation |
| `ProtectedRoute.tsx` | ProtectedRoute, PublicOnlyRoute | Auth route guards |

### Shared
| File | Component | Purpose |
|------|-----------|---------|
| `NavLink.tsx` | NavLink | Reusable navigation link |

### Context (1 file)
| File | Component | Purpose |
|------|-----------|---------|
| `AuthContext.tsx` | AuthProvider, useAuth | Global auth state (user, session, profile) |

### Libraries (3 files)
| File | Purpose |
|------|---------|
| `supabase.ts` | Supabase client + all database/auth operations |
| `gemini.ts` | Google Gemini AI integration for food analysis |
| `utils.ts` | Utility functions (cn class merger) |

### Types (1 file)
| File | Purpose |
|------|---------|
| `index.ts` | All TypeScript interfaces, type aliases, Zod schemas, calculation helpers |

---

## 10. Business Logic & Calculations

### 10.1 BMR Calculation (Basal Metabolic Rate)

**Formula:** Mifflin-St Jeor Equation
```
Male:   BMR = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) + 5
Female: BMR = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) − 161
```

**Why Mifflin-St Jeor:** Most accurate BMR formula for general population per American Dietetic Association. Requires only weight, height, age, and gender — all collected during onboarding.

### 10.2 TDEE Calculation (Total Daily Energy Expenditure)

```
TDEE = BMR × Activity Multiplier
```

| Activity Level | Multiplier | Description |
|---------------|------------|-------------|
| Sedentary | 1.2 | Little or no exercise |
| Light | 1.375 | Light exercise 1-3 days/week |
| Moderate | 1.55 | Moderate exercise 3-5 days/week |
| Active | 1.725 | Hard exercise 6-7 days/week |
| Very Active | 1.9 | Very hard exercise + physical job |

**Why these multipliers:** Standard Katch-McArdle activity factors widely used in clinical nutrition.

### 10.3 Goal-Based Calorie Adjustment

| Goal | Adjustment | Reasoning |
|------|-----------|-----------|
| Lose Weight | TDEE × 0.8 (−20%) | Sustainable deficit without muscle loss |
| Maintain | TDEE × 1.0 (0%) | Energy balance |
| Build Muscle | TDEE × 1.1 (+10%) | Slight surplus for lean gains |
| Gain Weight | TDEE × 1.15 (+15%) | Moderate surplus for weight gain |

### 10.4 Macro Distribution

| Macro | % of Calories | Cal/g | Calculation |
|-------|--------------|-------|-------------|
| Protein | 30% | 4 cal/g | (calories × 0.30) / 4 |
| Carbs | 40% | 4 cal/g | (calories × 0.40) / 4 |
| Fat | 30% | 9 cal/g | (calories × 0.30) / 9 |

**Why 30/40/30 split:** Balanced approach suitable for most goals. Higher protein supports muscle retention/growth. Moderate carbs fuel activity. Adequate fat supports hormone function. Not extreme in any direction.

---

## 11. Security Model

### Authentication
- **Method:** Email/password via Supabase Auth
- **Session:** JWT tokens, auto-refresh enabled, persisted in localStorage
- **Token Refresh:** Automatic via Supabase client
- **Session Detection:** `onAuthStateChange` listener for real-time auth state updates

### Data Protection
- **Row Level Security (RLS):** Expected on all tables (Supabase project configured)
- **User Scoping:** All queries filtered by `user_id` — users can only access their own data
- **Client Validation:** Zod schemas validate form input before submission
- **Server Validation:** Supabase policies enforce data access rules

### API Key Security
- **Supabase Anon Key:** Public-safe, limited by RLS policies
- **Gemini API Key:** Client-side (VITE_ prefix). **Risk:** Exposed in browser. Should move to server-side proxy for production.
- **Environment Variables:** Stored in `.env.local`, not committed to git

### Input Validation
- Onboarding: Zod schema with min/max bounds
- Auth forms: Email format, password length, password confirmation
- Scanner: Non-empty text validation
- Weight: Numeric, positive value validation

---

## 12. Current State & Gaps

### Implemented & Functional
- [x] Authentication (register, login, session management)
- [x] Onboarding wizard (5 steps with validation)
- [x] Dashboard with live calorie/macro tracking
- [x] AI food scanner (camera + upload + manual)
- [x] Meal CRUD (create, read, delete)
- [x] Weekly statistics with charts
- [x] Weight tracking with progress chart
- [x] User profile display
- [x] Responsive layout (mobile + desktop)
- [x] Route protection

### Not Yet Implemented
- [ ] Password reset functionality (UI placeholder exists)
- [ ] Profile editing (edit button exists but non-functional)
- [ ] Meal editing (update endpoint exists, no UI)
- [ ] Image storage for meal photos (image_url column exists but not populated)
- [ ] Avatar upload
- [ ] Push notifications / reminders
- [ ] Social auth (Google, Apple)
- [ ] Dark mode toggle (next-themes imported but not wired)
- [ ] Meal duplication / favorites
- [ ] Barcode scanning
- [ ] Recipe / custom food creation
- [ ] Water intake tracking
- [ ] Exercise logging
- [ ] Offline mode / PWA
- [ ] Unit preferences (lbs vs kg, ft vs cm)

### Technical Debt
- [ ] Gemini API key exposed client-side (security risk)
- [ ] No error boundary components
- [ ] No loading states for some async operations
- [ ] No pagination for meal history (fetches all meals)
- [ ] No database migration files (schema managed externally)
- [ ] TypeScript strict mode disabled
- [ ] No E2E tests (only unit test setup)
- [ ] Console.log statements in production code (AuthContext)

---

*Documentation generated from source code analysis. Last updated: 2026-05-06*
