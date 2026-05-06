import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import portrait from "@/assets/portfolio/portrait.jpg";
import bg from "@/assets/portfolio/bg-hero.jpg";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden">
      {/* Background layer */}
      <motion.div style={{ scale }} className="absolute inset-0 -z-10">
        <img src={bg} alt="" className="h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/40 to-background" />
      </motion.div>

      {/* Floating orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[10%] top-[20%] h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-[15%] bottom-[15%] h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-24 md:flex-row md:gap-16"
      >
        <div className="flex-1">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/40 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground backdrop-blur"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            Available for AI product roles
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-5xl font-semibold tracking-tight md:text-7xl lg:text-8xl"
          >
            Antoon Kamel
            <br />
            <span className="text-gradient">Ibrahim</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl"
          >
            AI Technical Product Manager — translating logistics, finance and consumer ambitions
            into shipped, measurable AI products. Cairo · Remote.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              See the roadmap
              <span className="transition group-hover:translate-x-1">→</span>
            </a>
            <a
              href="/antoon-kamel-resume.pdf"
              download
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-6 py-3 text-sm font-medium text-foreground backdrop-blur transition hover:bg-card"
            >
              Download CV
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="relative mt-16 flex-1 md:mt-0"
          style={{ perspective: 1200 }}
        >
          <div className="relative mx-auto aspect-square w-[min(420px,80vw)]">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary/40 via-accent/20 to-transparent blur-xl" />
            <div className="relative h-full w-full overflow-hidden rounded-3xl border border-border/40 glass">
              <img
                src={portrait}
                alt="Stylized portrait of Antoon Kamel — AI Technical Product Manager"
                className="h-full w-full object-cover"
                width={1024}
                height={1024}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-muted-foreground"
      >
        <div className="flex flex-col items-center gap-2">
          <span>scroll</span>
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-primary to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
