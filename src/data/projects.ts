import cater from "@/assets/portfolio/p-caterhub.jpg";
import deliveryProof from "@/assets/portfolio/p-frontdoor-ar.jpg";
import deliveryOps from "@/assets/portfolio/p-frontdoor-admin.jpg";
import capacity from "@/assets/portfolio/p-capacity.jpg";
import finance from "@/assets/portfolio/p-finance.jpg";
import mohsen from "@/assets/portfolio/p-mohsen.jpg";
import nutri from "@/assets/portfolio/p-nutritrack.jpg";
import telesales from "@/assets/portfolio/p-telesales.jpg";
import fieldSales from "@/assets/portfolio/p-field-sales.png";
import workforce from "@/assets/portfolio/p-workforce-attendance.png";

export type Project = {
  id: string;
  index: string;
  name: string;
  tagline: string;
  domain: string;
  need: string;
  solution: string;
  role: string;
  stack: string[];
  impact: string[];
  image: string;
  accent: "cyan" | "violet";
};

export const projects: Project[] = [
  {
    id: "catering-marketplace",
    index: "01",
    name: "Catering Marketplace",
    tagline: "A bilingual marketplace for comparing, booking, and trusting caterers.",
    domain: "Marketplace · B2C",
    need: "Customers had to compare caterers through calls, chats, and scattered referrals, while vendors had no structured way to present packages, reviews, or consultation availability.",
    solution:
      "A bilingual marketplace with vendor profiles, package discovery, reviews, consultation booking, and a payment-ready booking journey.",
    role: "Owned vendor onboarding, Arabic / English UX, consultation flow, payment roadmap, and the product requirements that connected customer trust with vendor operations.",
    stack: ["React", "Supabase", "PayMob", "Google Meet", "PWA"],
    impact: [
      "Reduced the decision path from fragmented calls to one comparable catalog",
      "Created a structured digital acquisition channel for vendors",
      "Made bilingual discovery and booking usable for Arabic-first customers",
    ],
    image: cater,
    accent: "violet",
  },
  {
    id: "delivery-proof-pwa",
    index: "02",
    name: "Delivery Proof PWA",
    tagline: "Field evidence for failed delivery attempts.",
    domain: "Mobile PWA · Last-mile Operations",
    need: "Delivery teams lacked reliable proof when an attempt failed, leaving clients, drivers, and supervisors with disputes that were hard to verify.",
    solution:
      "A mobile workflow for GPS validation, photos, voice notes, AI transcription, client chat, and structured issue resolution.",
    role: "Designed the voice-first driver workflow, geofence validation, AI transcription requirements, client response loop, and analytics taxonomy.",
    stack: ["React PWA", "Supabase Realtime", "Gemini", "Web Push", "Mixpanel"],
    impact: [
      "Turned failed attempts into evidence-backed operational records",
      "Improved supervisor visibility into field issues and reopen requests",
      "Reduced ambiguity by attaching location, media, and conversation context to each case",
    ],
    image: deliveryProof,
    accent: "cyan",
  },
  {
    id: "delivery-operations-dashboard",
    index: "03",
    name: "Delivery Operations Dashboard",
    tagline: "A control room for issue resolution and operational performance.",
    domain: "Internal Dashboard · Analytics",
    need: "Supervisors needed one place to investigate field issues, monitor agents, review company performance, and control reopen approvals.",
    solution:
      "A bilingual operations dashboard with role-based access, issue queues, map-backed investigation, KPI cards, and reopen approval workflows.",
    role: "Defined permissions, KPI surfaces, geofence analytics, media review, issue investigation flows, and product analytics events.",
    stack: ["React", "Supabase", "Leaflet", "i18next", "Mixpanel"],
    impact: [
      "Centralized investigation work that previously lived across disconnected tools",
      "Gave supervisors live visibility into validation rate, resolution time, and reopen queues",
      "Made owner and supervisor views safer through scoped access control",
    ],
    image: deliveryOps,
    accent: "violet",
  },
  {
    id: "capacity-cost-planning",
    index: "04",
    name: "Capacity & Cost Planning System",
    tagline: "Monthly planning, approvals, actuals, and variance in one loop.",
    domain: "Enterprise · Planning",
    need: "Warehouse and delivery planning depended on spreadsheets, making workforce, trucks, costs, approvals, and variance hard to reconcile across locations.",
    solution:
      "A planning system for monthly capacity plans, client forecasts, resource requests, approvals, actuals, costing, and executive variance reports.",
    role: "Translated stakeholder interviews into a 10-role permission model, planning entities, request lifecycle, costing logic, and executive reporting needs.",
    stack: ["React 19", "Supabase RLS", "TanStack Query", "Recharts"],
    impact: [
      "Created one source of truth for planned versus actual operational cost",
      "Linked requests, approvals, and actuals back to the monthly plan",
      "Made resource variance visible before it became a finance surprise",
    ],
    image: capacity,
    accent: "cyan",
  },
  {
    id: "finance-aging-reconciliation",
    index: "05",
    name: "Finance Aging & Reconciliation System",
    tagline: "Auditable receivables, FIFO allocation, and overdue follow-up.",
    domain: "FinTech · AR Automation",
    need: "Finance teams were tracking receivables manually, allocating payments by hand, and missing a reliable audit trail for overdue invoices and client balances.",
    solution:
      "A bilingual receivables system with invoice aging, FIFO reconciliation, credit handling, approval queues, client statements, and scheduled alerts.",
    role: "Specified reconciliation rules, aging views, approval workflows, import tolerance, notification behavior, and analytics events for finance operations.",
    stack: ["React", "Supabase", "Edge Functions", "PostgreSQL", "i18n"],
    impact: [
      "Reduced manual payment allocation through automated FIFO logic",
      "Improved collection follow-up with overdue visibility and notifications",
      "Made invoice and payment changes traceable through an audit log",
    ],
    image: finance,
    accent: "violet",
  },
  {
    id: "ai-operations-agent",
    index: "06",
    name: "AI Operations Agent",
    tagline: "An always-on agent for delivery coordination and team follow-up.",
    domain: "Autonomous AI · Internal Tools",
    need: "Sprint coordination, ticket hygiene, commit tracking, and follow-ups were consuming product and engineering management time every week.",
    solution:
      "A VPS-hosted autonomous agent with scheduled workflows, memory, chat integrations, ticket lookups, and repository activity monitoring.",
    role: "Designed the agent persona, skill architecture, integrations, workflows, deployment model, and operating rules for human-in-the-loop execution.",
    stack: ["OpenClaw", "GLM-5", "Gemini", "Jira API", "GitHub", "Slack", "Node 22"],
    impact: [
      "Moved repetitive sprint follow-up into scheduled agent workflows",
      "Improved ticket and commit visibility without manual status chasing",
      "Created a reusable pattern for internal AI operations assistants",
    ],
    image: mohsen,
    accent: "cyan",
  },
  {
    id: "nutrition-vision-tracker",
    index: "07",
    name: "Nutrition Vision Tracker",
    tagline: "Photo-based nutrition logging with personalized goals.",
    domain: "Consumer · AI Vision",
    need: "Manual meal logging creates friction and weak retention because users do not want to search databases or type every ingredient.",
    solution:
      "A camera-first nutrition app that estimates meal macros from images, calculates goals, tracks weight, and surfaces weekly insights.",
    role: "Defined the onboarding wizard, body-stat goal engine, AI food scanner flow, dashboard metrics, and retention-focused insight surfaces.",
    stack: ["React", "Gemini Vision", "Supabase", "Recharts"],
    impact: [
      "Reduced meal logging effort from minutes to seconds",
      "Made calorie and macro targets feel personalized and explainable",
      "Turned weekly tracking into visible patterns for long-term adherence",
    ],
    image: nutri,
    accent: "violet",
  },
  {
    id: "telesales-crm",
    index: "08",
    name: "Telesales CRM",
    tagline: "Arabic-first call queues, ordering, and refusal analytics.",
    domain: "CRM · Mobile-first",
    need: "Telesales agents were losing order context across spreadsheets, paper notes, and unstructured refusal reasons, while supervisors had little live visibility.",
    solution:
      "A mobile-first CRM with prioritized call queues, merchant profiles, product catalog ordering, invalid-phone feedback, and supervisor analytics.",
    role: "Owned the call queue logic, refusal taxonomy, order placement flow, flagged merchant handling, and analytics requirements.",
    stack: ["React", "Supabase", "i18n", "Mixpanel"],
    impact: [
      "Made order placement possible directly from the call workflow",
      "Converted refusal reasons into market-level signals",
      "Gave supervisors visibility into agent activity and merchant quality",
    ],
    image: telesales,
    accent: "cyan",
  },
  {
    id: "field-sales-pwa",
    index: "09",
    name: "Field Sales PWA",
    tagline: "Route execution, geofenced visits, and mobile ordering for field agents.",
    domain: "Sales Operations · PWA",
    need: "Field sales teams needed proof of merchant visits, structured routes, accurate pricing, mobile order capture, and real-time supervisor visibility.",
    solution:
      "A bilingual PWA for route visits, geofence verification, merchant onboarding, pre-sell and cash-van orders, KPI tracking, and backend order sync.",
    role: "Mapped the field journey, defined dual sales modes, geofence rules, KPI calculations, order submission flows, and analytics events.",
    stack: ["React", "TypeScript", "Supabase", "Rails API", "PWA", "Mixpanel"],
    impact: [
      "Replaced paper order capture with mobile, location-verified workflows",
      "Improved supervisor visibility into visit completion, strike rate, and sales value",
      "Supported both planned route selling and cash-van execution in one experience",
    ],
    image: fieldSales,
    accent: "violet",
  },
  {
    id: "workforce-attendance",
    index: "10",
    name: "Workforce Attendance System",
    tagline: "Gate attendance, ID scanning, geofencing, and validation for outsourced workers.",
    domain: "Operations · Workforce Compliance",
    need: "Warehouse teams tracked outsourced worker attendance manually, creating weak identity validation, delayed reporting, and limited cost visibility.",
    solution:
      "A mobile attendance app for guards and delivery associates with ID scanning, worker photos, GPS checks, truck-exit logging, and admin validation.",
    role: "Defined guard and delivery-associate flows, geofence rules, OCR fallback behavior, external worker registration, and dashboard reporting requirements.",
    stack: ["React", "Supabase", "Gemini OCR", "Geolocation API", "Arabic UX"],
    impact: [
      "Digitized paper attendance into timestamped and photo-backed records",
      "Improved compliance through National ID checks and geofence validation",
      "Connected daily attendance to reporting, approvals, and cost tracking",
    ],
    image: workforce,
    accent: "cyan",
  },
];
