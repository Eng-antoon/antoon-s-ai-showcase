import { motion } from "framer-motion";
import { experience } from "@/data/experience";

export function ExperienceTimeline() {
  return (
    <section
      id="experience"
      className="relative mx-auto max-w-6xl bg-[#080f1e] px-5 py-28 sm:px-8 md:py-40"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.8 }}
        className="mb-20 grid gap-6 md:grid-cols-[1fr_.8fr] md:items-end"
      >
        <div>
          <p className="mb-4 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-primary">
            Experience
          </p>
          <h2 className="font-display text-5xl font-semibold leading-[0.95] tracking-[-0.055em] md:text-7xl">
            Built from the ground up.
          </h2>
        </div>
        <p className="max-w-md text-base leading-relaxed text-white/48 md:justify-self-end">
          Customer empathy, QA rigor, engineering fluency, and product ownership—layered in that
          order.
        </p>
      </motion.div>

      <div className="relative">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10 md:left-1/2 md:-translate-x-1/2" />

        <div className="space-y-16">
          {experience.map((e, i) => (
            <motion.div
              key={e.role + e.company}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className={`relative grid gap-4 pl-8 md:grid-cols-2 md:gap-12 md:pl-0 ${
                i % 2 === 0 ? "md:[&>div:first-child]:text-right" : "md:[&>div:first-child]:order-2"
              }`}
            >
              <div className="absolute left-0 top-2 h-3.5 w-3.5 rounded-full border-2 border-primary bg-[#080f1e] shadow-[0_0_18px_rgba(102,217,244,.25)] md:left-1/2 md:-translate-x-1/2" />
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                  {e.period}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{e.location}</p>
              </div>
              <div>
                <h3 className="font-display text-2xl font-medium tracking-[-0.025em]">{e.role}</h3>
                <p className="mt-1 text-sm text-white/46">{e.company}</p>
                <p className="mt-4 text-base leading-relaxed text-white/52">{e.summary}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
