import { motion } from "framer-motion";
import { experience } from "@/data/experience";

export function ExperienceTimeline() {
  return (
    <section id="experience" className="relative mx-auto max-w-5xl px-6 py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.8 }}
        className="mb-20"
      >
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-primary">Experience</p>
        <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
          From customer support to AI product leadership.
        </h2>
      </motion.div>

      <div className="relative">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border md:left-1/2 md:-translate-x-1/2" />

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
              <div className="absolute left-0 top-2 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background md:left-1/2 md:-translate-x-1/2" />
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                  {e.period}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{e.location}</p>
              </div>
              <div>
                <h3 className="text-xl font-medium">{e.role}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{e.company}</p>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {e.summary}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
