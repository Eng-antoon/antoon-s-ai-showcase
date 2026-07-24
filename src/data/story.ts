import system from "@/assets/story/01-system.webp";
import systemMobile from "@/assets/story/01-system-mobile.webp";
import signals from "@/assets/story/02-signals.webp";
import signalsMobile from "@/assets/story/02-signals-mobile.webp";
import field from "@/assets/story/03-field.webp";
import fieldMobile from "@/assets/story/03-field-mobile.webp";
import constraint from "@/assets/story/04-constraint.webp";
import constraintMobile from "@/assets/story/04-constraint-mobile.webp";
import value from "@/assets/story/05-value.webp";
import valueMobile from "@/assets/story/05-value-mobile.webp";
import feedback from "@/assets/story/06-feedback.webp";
import feedbackMobile from "@/assets/story/06-feedback-mobile.webp";

export type StoryMetric = {
  value: string;
  label: string;
  context?: string;
  tone?: "positive" | "watch";
};

export type StoryScene = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  still: string;
  stillMobile: string;
  accent: string;
  metrics: StoryMetric[];
  tags: string[];
  source: string;
  scroll?: number;
  cta?: {
    primary: { label: string; href: string; download?: boolean };
    secondary: { label: string; href: string };
  };
  clip?: string;
  clipMobile?: string;
};

export const storyScenes: StoryScene[] = [
  {
    id: "system",
    label: "System",
    eyebrow: "AI Technical Product Manager",
    title: "Make the messy measurable.",
    body: "I turn operational noise into product systems teams can see, trust, and improve.",
    still: system,
    stillMobile: systemMobile,
    accent: "#66D9F4",
    metrics: [
      { value: "11", label: "Q2 roadmap items completed" },
      { value: "3", label: "operating loops connected" },
    ],
    tags: ["Logistics", "AI systems", "Cairo · Remote"],
    source: "Q2 2026 execution portfolio",
    scroll: 1.2,
  },
  {
    id: "signals",
    label: "Signals",
    eyebrow: "01 · Instrument reality",
    title: "Trust starts with the signal.",
    body: "Daily reporting, shared definitions, and auditable baselines made field activity visible before anyone tried to optimize it.",
    still: signals,
    stillMobile: signalsMobile,
    accent: "#9B7CFF",
    metrics: [
      { value: "Daily", label: "agent performance readout" },
      { value: "2", label: "measurement systems shipped" },
    ],
    tags: ["KPI taxonomy", "Return dashboard", "Baseline design"],
    source: "Completed Q2 roadmap work · May and June baselines",
  },
  {
    id: "field",
    label: "Field",
    eyebrow: "02 · Move the field",
    title: "Make the next move obvious.",
    body: "GPS routing, reassignment, clearer visit states, and contextual coaching turned coverage into an everyday product behavior.",
    still: field,
    stillMobile: fieldMobile,
    accent: "#65D6A5",
    metrics: [
      { value: "11.3K", label: "field visits" },
      { value: "58.7%", label: "merchant coverage" },
      { value: "+39.8pp", label: "coverage vs May", tone: "positive" },
    ],
    tags: ["Route navigation", "Off-route recovery", "KPI guidance"],
    source: "July 1–21 MTD · compared with May 2026",
    scroll: 1.15,
  },
  {
    id: "constraint",
    label: "Constraint",
    eyebrow: "03 · Find the constraint",
    title: "Good metrics tell the truth.",
    body: "The system exposed where demand converted, where visits failed, and where the next product bet—not a vanity story—was needed.",
    still: constraint,
    stillMobile: constraintMobile,
    accent: "#E0A6FF",
    metrics: [
      { value: "5.5K", label: "placed orders" },
      { value: "−17.3pp", label: "no-storage failures", tone: "positive" },
      { value: "58.5%", label: "strike rate · below baseline", tone: "watch" },
    ],
    tags: ["Merchant readiness", "Failure taxonomy", "Honest readout"],
    source: "July 1–21 MTD · strike rate −16.7pp vs May",
  },
  {
    id: "value",
    label: "Value",
    eyebrow: "04 · Protect the value",
    title: "Connect action to outcome.",
    body: "A clearer operating loop protected successful sales value while making cancelled orders and lost value easier to investigate.",
    still: value,
    stillMobile: valueMobile,
    accent: "#66D9F4",
    metrics: [
      { value: "13.8M", label: "successful sales value" },
      { value: "+28.3%", label: "value vs May", tone: "positive" },
      { value: "−8%", label: "lost value", tone: "positive" },
    ],
    tags: ["Order reliability", "Exception visibility", "Value tracking"],
    source: "July 1–21 MTD · cancelled / unfulfilled orders −10.9%",
  },
  {
    id: "feedback",
    label: "Feedback",
    eyebrow: "05 · Close the loop",
    title: "Load smarter. Learn faster.",
    body: "The planner, guardrails, return dashboard, and adoption tracking made cashvan decisions testable—not anecdotal.",
    still: feedback,
    stillMobile: feedbackMobile,
    accent: "#65D6A5",
    metrics: [
      { value: "+1.52pp", label: "sell-through", tone: "positive" },
      { value: "−1.51pp", label: "return rate", tone: "positive" },
      { value: "−4.7", label: "returns / agent-day", tone: "positive" },
    ],
    tags: ["Load planner", "Forecast guardrails", "Adoption tracking"],
    source: "July 1–21 MTD vs June · sold-unit guardrail still −10,072",
    scroll: 1.25,
    cta: {
      primary: {
        label: "Download résumé",
        href: "/antoon-kamel-resume.pdf",
        download: true,
      },
      secondary: { label: "Start a conversation", href: "#contact" },
    },
  },
];
