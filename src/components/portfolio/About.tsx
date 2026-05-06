import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
  { label: "Years in product & engineering", value: 4, suffix: "+" },
  { label: "Products shipped", value: 10 },
  { label: "Autonomous agents deployed", value: 6 },
  { label: "Languages spoken", value: 3 },
];

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-7xl px-6 py-32">
      <div className="grid gap-16 md:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8 }}
          className="md:col-span-5"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-primary">About</p>
          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
            I build software for messy operational workflows.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="md:col-span-7"
        >
          <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
            I'm a results-driven Technical Product Manager who translates ambiguous business
            problems into specs, JIRA tickets, API contracts, and working MVPs. I use Cursor, Claude
            Code, Lovable, and AI agents to validate ideas quickly before teams commit full sprint
            capacity.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
            Today I lead AI-driven logistics and operations products while consulting on growth
            automation. I've shipped marketplaces, ops dashboards, last-mile PWAs, finance
            reconciliation engines, workforce tools, field sales systems, and autonomous AI agents
            that run 24/7 on a VPS.
          </p>
        </motion.div>
      </div>

      <div className="mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/50 bg-border/50 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="bg-background/80 px-6 py-10 backdrop-blur"
          >
            <div className="text-4xl font-semibold tracking-tight text-gradient md:text-5xl">
              <Counter to={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-3 text-sm text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
