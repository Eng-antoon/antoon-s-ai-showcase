import { motion } from "framer-motion";

const groups = [
  {
    title: "Product",
    items: [
      "Roadmap & Prioritization",
      "MVP & Iteration",
      "Discovery & Research",
      "User Stories",
      "Stakeholder Mgmt",
      "Agile / Scrum",
    ],
  },
  {
    title: "Growth & Analytics",
    items: [
      "A/B Testing",
      "CRO",
      "Funnel Analysis",
      "Mixpanel",
      "Google Analytics",
      "Clarity / UX Cam",
    ],
  },
  {
    title: "AI-Powered Build",
    items: [
      "Cursor",
      "Claude Code",
      "Codex",
      "Lovable",
      "Prompt Engineering",
      "React / Node / Python",
    ],
  },
  {
    title: "Automation & Ops",
    items: [
      "VPS-hosted AI Agents",
      "Zapier / Make",
      "Custom Scripts",
      "API Integration",
      "QA Automation",
      "CI/CD",
    ],
  },
];

export function Toolkit() {
  return (
    <section id="toolkit" className="relative mx-auto max-w-7xl px-6 py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.8 }}
        className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
      >
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-primary">Toolkit</p>
          <h2 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
            Product instinct, fused with engineering speed.
          </h2>
        </div>
        <p className="max-w-md text-muted-foreground">
          I don't hand off prototypes — I build them, validate them, then ship them with the team.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {groups.map((g, gi) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: gi * 0.08 }}
            className="group relative rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur transition hover:border-primary/40 hover:bg-card/70"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="font-mono text-xs text-muted-foreground">0{gi + 1}</span>
              <h3 className="text-lg font-medium">{g.title}</h3>
            </div>
            <ul className="space-y-2.5">
              {g.items.map((it) => (
                <li key={it} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  {it}
                </li>
              ))}
            </ul>
            <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 blur-2xl transition group-hover:opacity-30" style={{ background: "radial-gradient(circle at 50% 0%, var(--cyan), transparent 70%)" }} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
