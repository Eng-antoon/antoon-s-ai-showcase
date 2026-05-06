import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Project } from "@/data/projects";

const reveal = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.78, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

const listReveal = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.34,
      staggerChildren: 0.055,
    },
  },
};

const itemReveal = {
  hidden: { opacity: 0, x: -12, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] },
  },
};

export function ProjectLayer({ project, even }: { project: Project; even: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const contentVisible = useInView(ref, { margin: "-38% 0px -38% 0px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05]);
  const stickyOpacity = useTransform(scrollYProgress, [0, 0.1, 0.85, 1], [0, 1, 1, 0]);

  const accent = project.accent === "cyan" ? "var(--cyan)" : "var(--violet)";

  return (
    <section ref={ref} className="relative" style={{ minHeight: "200vh" }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          style={{ opacity: stickyOpacity }}
          className={`absolute inset-y-0 hidden md:block ${even ? "right-0" : "left-0"} w-1/2`}
        >
          <motion.div style={{ y: imgY, scale: imgScale }} className="relative h-full w-full">
            <img
              src={project.image}
              alt={project.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(${even ? "to right" : "to left"}, var(--background), transparent 60%)`,
              }}
            />
            <div
              className="absolute inset-0 mix-blend-overlay opacity-40"
              style={{
                background: `radial-gradient(60% 60% at 50% 50%, ${accent}, transparent 70%)`,
              }}
            />
          </motion.div>
        </motion.div>

        <motion.div style={{ opacity: stickyOpacity }} className="absolute inset-0 md:hidden">
          <img src={project.image} alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </motion.div>

        <motion.div
          style={{ opacity: stickyOpacity }}
          className={`relative z-10 mx-auto flex w-full max-w-7xl px-6 ${
            even ? "md:justify-start" : "md:justify-end"
          }`}
        >
          <div className="w-full md:w-1/2 md:px-8">
            <motion.div
              custom={0}
              initial="hidden"
              animate={contentVisible ? "visible" : "hidden"}
              variants={reveal}
              className="mb-6 flex items-center gap-4"
            >
              <span className="font-mono text-sm tracking-widest" style={{ color: accent }}>
                {project.index}
              </span>
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                {project.domain}
              </span>
            </motion.div>

            <motion.h3
              custom={0.04}
              initial="hidden"
              animate={contentVisible ? "visible" : "hidden"}
              variants={reveal}
              className="text-4xl font-semibold tracking-tight md:text-6xl"
            >
              {project.name}
            </motion.h3>
            <motion.p
              custom={0.08}
              initial="hidden"
              animate={contentVisible ? "visible" : "hidden"}
              variants={reveal}
              className="mt-3 text-lg text-muted-foreground md:text-xl"
            >
              {project.tagline}
            </motion.p>

            <motion.div
              custom={0.14}
              initial="hidden"
              animate={contentVisible ? "visible" : "hidden"}
              variants={reveal}
              className="mt-8"
            >
              <p className="mb-2 text-xs uppercase tracking-[0.25em]" style={{ color: accent }}>
                Need
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">{project.need}</p>
            </motion.div>

            <motion.div
              custom={0.2}
              initial="hidden"
              animate={contentVisible ? "visible" : "hidden"}
              variants={reveal}
              className="mt-6"
            >
              <p className="mb-2 text-xs uppercase tracking-[0.25em]" style={{ color: accent }}>
                Product & role
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">{project.solution}</p>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{project.role}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border/60 bg-card/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              custom={0.26}
              initial="hidden"
              animate={contentVisible ? "visible" : "hidden"}
              variants={reveal}
              className="mt-6"
            >
              <p className="mb-3 text-xs uppercase tracking-[0.25em]" style={{ color: accent }}>
                Impact
              </p>
              <motion.ul
                initial="hidden"
                animate={contentVisible ? "visible" : "hidden"}
                variants={listReveal}
                className="space-y-2"
              >
                {project.impact.map((i) => (
                  <motion.li
                    key={i}
                    variants={itemReveal}
                    className="flex gap-3 text-sm text-foreground/90"
                  >
                    <span
                      className="mt-2 h-1 w-1 shrink-0 rounded-full"
                      style={{ background: accent }}
                    />
                    {i}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
