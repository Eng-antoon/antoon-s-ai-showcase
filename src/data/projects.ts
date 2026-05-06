import illa from "@/assets/portfolio/p-illa-trucking.jpg";
import cater from "@/assets/portfolio/p-caterhub.jpg";
import ar from "@/assets/portfolio/p-frontdoor-ar.jpg";
import admin from "@/assets/portfolio/p-frontdoor-admin.jpg";
import capacity from "@/assets/portfolio/p-capacity.jpg";
import finance from "@/assets/portfolio/p-finance.jpg";
import mohsen from "@/assets/portfolio/p-mohsen.jpg";
import nutri from "@/assets/portfolio/p-nutritrack.jpg";
import telesales from "@/assets/portfolio/p-telesales.jpg";

export type Project = {
  id: string;
  index: string;
  name: string;
  tagline: string;
  domain: string;
  context: string;
  role: string;
  stack: string[];
  impact: string[];
  image: string;
  accent: "cyan" | "violet";
};

export const projects: Project[] = [
  {
    id: "illa-trucking",
    index: "01",
    name: "ILLA Trucking",
    tagline: "AI-driven logistics, end-to-end.",
    domain: "Logistics · AI Operations",
    context:
      "Egypt's trucking operations were fragmented across spreadsheets, WhatsApp, and tribal knowledge — slowing dispatch and burying insight.",
    role:
      "AI Technical Product Manager. Translated business needs into specs, API contracts, and JIRA tickets; ran QA; led cross-functional delivery.",
    stack: ["Cursor", "Claude Code", "Lovable", "Supabase", "VPS Agents", "JIRA"],
    impact: [
      "Shipped multiple AI-powered internal products in under 12 months",
      "Hosted autonomous agents that track sprint progress from GitHub commits",
      "Cut prototype-to-pilot time from weeks to days via vibe-coded MVPs",
    ],
    image: illa,
    accent: "cyan",
  },
  {
    id: "caterhub",
    index: "02",
    name: "CaterHub",
    tagline: "Egypt's bilingual catering marketplace.",
    domain: "Marketplace · B2C",
    context:
      "Customers couldn't compare caterers without dozens of phone calls; vendors had no digital reach. No platform centralized trust, pricing, and booking.",
    role:
      "Product Manager. Owned vendor onboarding, bilingual UX (Arabic RTL + English), consultation flow, and PayMob integration roadmap.",
    stack: ["React", "Supabase", "PayMob", "Google Meet", "PWA"],
    impact: [
      "End-to-end booking flow with verified vendors and reviews",
      "Full Arabic / English parity with RTL-aware components",
      "Integrated consultation booking via Google Meet",
    ],
    image: cater,
    accent: "violet",
  },
  {
    id: "frontdoor-ar",
    index: "03",
    name: "Frontdoor AR Tracker",
    tagline: "Proof-of-attempt for last-mile delivery.",
    domain: "Mobile PWA · Operations",
    context:
      "Drivers had no structured way to report failed deliveries; clients had no visibility. Disputes were impossible to settle.",
    role:
      "Product Manager. Designed the voice-first driver workflow, geofence validation, AI transcription, and the client response loop.",
    stack: ["React PWA", "Supabase Realtime", "Gemini", "Web Push (VAPID)", "Mixpanel"],
    impact: [
      "GPS-validated, photo-backed proof for every delivery attempt",
      "AI transcription in Egyptian Arabic dialect",
      "Real-time driver ↔ client chat with auto-resolution rules",
    ],
    image: ar,
    accent: "cyan",
  },
  {
    id: "frontdoor-admin",
    index: "04",
    name: "Frontdoor Issues Admin",
    tagline: "The control room for delivery operations.",
    domain: "Internal Dashboard · Analytics",
    context:
      "Supervisors and owners needed a single pane of glass to investigate issues, monitor agents, and gate reopen requests across companies.",
    role:
      "Product Manager. Defined RBAC, KPI cards, geofence rate analytics, and the reopen-approval workflow.",
    stack: ["React", "Supabase", "Leaflet", "i18next", "Mixpanel"],
    impact: [
      "Owner / supervisor RBAC scoped by company",
      "Bilingual (Arabic RTL) operations dashboard",
      "Live KPIs: validation rate, resolution time, reopen queue",
    ],
    image: admin,
    accent: "violet",
  },
  {
    id: "capacity",
    index: "05",
    name: "Capacity Tracker Pro",
    tagline: "Plan, cost, and reconcile a 3PL.",
    domain: "Enterprise · Planning",
    context:
      "Multi-warehouse 3PL operations were planned in spreadsheets — no shared truth for workforce, trucks, costs, or variance.",
    role:
      "Product Manager. Designed a 10-role RBAC model, monthly capacity plans, cost actuals, and executive variance reporting.",
    stack: ["React 19", "Supabase RLS", "TanStack Query", "Recharts"],
    impact: [
      "10-role hierarchical permission system",
      "Monthly plan → request → approval → actuals → variance loop",
      "Lazy-loaded modules for snappy enterprise navigation",
    ],
    image: capacity,
    accent: "cyan",
  },
  {
    id: "finance",
    index: "06",
    name: "ILLA Finance",
    tagline: "FIFO receivables, audited and automatic.",
    domain: "FinTech · AR Automation",
    context:
      "Receivables were tracked in spreadsheets, payments allocated by hand, and overdue accounts slipped through. No audit trail.",
    role:
      "Product Manager. Specified the FIFO reconciliation engine, daily overdue notifications, and the bilingual EGP-native UX.",
    stack: ["React", "Supabase", "Edge Functions", "i18n (AR/EN)"],
    impact: [
      "Automated FIFO payment allocation with full audit log",
      "Daily email alerts for past-due invoices",
      "Single source of truth for clients, invoices, and payments",
    ],
    image: finance,
    accent: "violet",
  },
  {
    id: "mohsen",
    index: "07",
    name: "Mohsen — AI Agent",
    tagline: "An always-on teammate on OpenClaw.",
    domain: "Autonomous AI · Internal Tools",
    context:
      "Sprint coordination, ticket hygiene, and developer follow-ups consumed managerial time. We needed a tireless agent embedded in our tools.",
    role:
      "Product Manager & Operator. Designed Mohsen's skill architecture, tool integrations, and Slack persona; deployed on a Hostinger VPS.",
    stack: ["OpenClaw", "GLM-5", "Gemini", "Jira API", "GitHub", "Slack", "Node 22"],
    impact: [
      "24/7 daemon with cron-driven workflows and long-term memory",
      "Live Jira & GitHub orchestration via DMs",
      "Replaces hours of manual standup prep each week",
    ],
    image: mohsen,
    accent: "cyan",
  },
  {
    id: "nutritrack",
    index: "08",
    name: "NutriTrack",
    tagline: "AI-vision nutrition logging.",
    domain: "Consumer · AI Vision",
    context:
      "Manual meal logging kills nutrition-app retention. Users want a photo, not a form.",
    role:
      "Product Manager. Defined the camera-first capture flow, Mifflin-St Jeor goal engine, and weekly insight surfaces.",
    stack: ["React", "Gemini Vision", "Supabase", "Recharts"],
    impact: [
      "Photo-to-macros in seconds via AI vision",
      "Personalized calorie & macro targets from body composition",
      "Weekly pattern recognition to anchor long-term retention",
    ],
    image: nutri,
    accent: "violet",
  },
  {
    id: "telesales",
    index: "09",
    name: "ILLA Telesales CRM",
    tagline: "Arabic-first telesales for FMCG.",
    domain: "CRM · Mobile-first",
    context:
      "Telesales agents juggled spreadsheets and paper, losing orders and refusal context. Supervisors had zero visibility.",
    role:
      "Product Manager. Owned the prioritized call queue, refusal taxonomy, invalid-phone feedback loop, and supervisor analytics.",
    stack: ["React", "Supabase", "i18n (AR RTL)", "Mixpanel"],
    impact: [
      "One-tap order placement from product catalog",
      "Refusal-reason analytics surface market-level patterns",
      "Supervisor view of agent activity & flagged merchants",
    ],
    image: telesales,
    accent: "cyan",
  },
];
