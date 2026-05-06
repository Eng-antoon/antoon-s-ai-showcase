import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { projects } from "@/data/projects";
import { ProjectLayer } from "./ProjectLayer";

export function RoadmapParallax() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const lineH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="projects" ref={ref} className="relative">
      {/* intro */}
      <div className="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-6 py-32 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-4 text-xs uppercase tracking-[0.3em] text-primary"
        >
          The Roadmap
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl"
        >
          Nine products. One throughline:{" "}
          <span className="text-gradient">turn business chaos into shipped AI software.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          Scroll through each station of the journey — context, role, stack, and the outcomes that matter.
        </motion.p>
      </div>

      {/* connecting line */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 md:block">
        <div className="absolute inset-0 bg-border/40" />
        <motion.div
          style={{ height: lineH }}
          className="absolute top-0 left-0 w-px bg-gradient-to-b from-primary via-accent to-transparent"
        />
      </div>

      {projects.map((p, i) => (
        <ProjectLayer key={p.id} project={p} even={i % 2 === 0} />
      ))}
    </section>
  );
}
