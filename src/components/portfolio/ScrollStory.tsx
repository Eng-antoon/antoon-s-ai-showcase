import {
  AnimatePresence,
  motion,
  type MotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { storyScenes, type StoryScene } from "@/data/story";

const storyWeight = storyScenes.reduce((sum, scene) => sum + (scene.scroll ?? 1), 0);
const sceneRanges = storyScenes.map((scene, index) => {
  const startWeight = storyScenes
    .slice(0, index)
    .reduce((sum, item) => sum + (item.scroll ?? 1), 0);
  return {
    start: startWeight / storyWeight,
    end: (startWeight + (scene.scroll ?? 1)) / storyWeight,
  };
});

function SceneVisual({
  scene,
  index,
  start,
  end,
  progress,
  reduceMotion,
}: {
  scene: StoryScene;
  index: number;
  start: number;
  end: number;
  progress: MotionValue<number>;
  reduceMotion: boolean | null;
}) {
  const count = storyScenes.length;
  const fade = 0.025;
  const opacity = useTransform(
    progress,
    index === 0
      ? [0, end - fade, end + fade]
      : index === count - 1
        ? [start - fade, start + fade, 1]
        : [start - fade, start + fade, end - fade, end + fade],
    index === 0 ? [1, 1, 0] : index === count - 1 ? [0, 1, 1] : [0, 1, 1, 0],
  );
  const scale = useTransform(progress, [start, end], reduceMotion ? [1, 1] : [0.94, 1.055]);
  const y = useTransform(progress, [start, end], reduceMotion ? ["0%", "0%"] : ["2.5%", "-2.5%"]);

  return (
    <motion.figure
      aria-hidden={index !== 0}
      style={{ opacity }}
      className="absolute inset-0 overflow-hidden"
    >
      <motion.picture style={{ scale, y }} className="absolute inset-[-4%] block">
        <source media="(max-width: 720px)" srcSet={scene.stillMobile} />
        <img
          src={scene.still}
          alt=""
          width={1536}
          height={1024}
          loading={index > 1 ? "lazy" : "eager"}
          fetchPriority={index === 0 ? "high" : "auto"}
          className="h-full w-full object-cover"
        />
      </motion.picture>
      <div className="story-vignette absolute inset-0" />
    </motion.figure>
  );
}

function Metric({ metric }: { metric: StoryScene["metrics"][number] }) {
  return (
    <div className="min-w-0 border-l border-white/20 pl-3 first:border-l-0 first:pl-0 md:pl-4">
      <div
        className={`font-display text-xl font-semibold tracking-[-0.04em] sm:text-2xl ${
          metric.tone === "watch" ? "text-amber-200" : "text-white"
        }`}
      >
        {metric.value}
      </div>
      <div className="mt-1 max-w-28 text-[0.65rem] leading-tight text-white/52 sm:max-w-32">
        {metric.label}
      </div>
    </div>
  );
}

function SceneCopy({ scene, index }: { scene: StoryScene; index: number }) {
  const isFirst = index === 0;

  return (
    <motion.article
      key={scene.id}
      initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
      transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[40rem]"
    >
      {isFirst && (
        <div className="mb-5 flex items-center gap-3 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-white/72">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--scene-accent)] shadow-[0_0_16px_var(--scene-accent)]" />
          Antoon Kamel
        </div>
      )}
      <p
        className="font-mono text-[0.65rem] uppercase tracking-[0.24em]"
        style={{ color: scene.accent }}
      >
        {scene.eyebrow}
      </p>
      <h1
        className={`font-display mt-4 max-w-[11ch] font-semibold leading-[0.92] tracking-[-0.06em] text-white ${
          isFirst ? "text-[clamp(3.25rem,8vw,7.4rem)]" : "text-[clamp(2.9rem,6.6vw,6.2rem)]"
        }`}
      >
        {scene.title}
      </h1>
      <p className="mt-5 max-w-[34rem] text-base leading-relaxed text-white/65 sm:text-lg">
        {scene.body}
      </p>

      <div className="mt-7 grid grid-cols-3 gap-2 sm:flex sm:gap-5">
        {scene.metrics.map((metric) => (
          <Metric key={metric.value + metric.label} metric={metric} />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
        {scene.tags.map((tag) => (
          <span
            key={tag}
            className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-white/46"
          >
            {tag}
          </span>
        ))}
      </div>

      {scene.cta && (
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <a
            href={scene.cta.primary.href}
            download={scene.cta.primary.download}
            className="inline-flex min-h-11 items-center gap-3 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#08101f] transition hover:-translate-y-0.5 hover:bg-[#dffaff]"
          >
            {scene.cta.primary.label}
            <span aria-hidden>↗</span>
          </a>
          <a
            href={scene.cta.secondary.href}
            className="inline-flex min-h-11 items-center gap-3 px-2 py-2.5 text-sm font-medium text-white/72 transition hover:text-white"
          >
            {scene.cta.secondary.label}
            <span aria-hidden>→</span>
          </a>
        </div>
      )}

      <p className="mt-6 font-mono text-[0.6rem] leading-relaxed text-white/32">{scene.source}</p>
    </motion.article>
  );
}

export function ScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const totalWeight = useMemo(() => storyWeight, []);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const found = sceneRanges.findIndex((range) => latest < range.end);
    const next = found === -1 ? storyScenes.length - 1 : found;
    setActiveIndex((current) => (current === next ? current : next));
  });

  const jumpTo = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const available = section.offsetHeight - window.innerHeight;
    const range = sceneRanges[index];
    window.scrollTo({
      top: top + available * (range.start + (range.end - range.start) * 0.45),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const activeScene = storyScenes[activeIndex];

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative bg-[#080f1e]"
      style={{ height: `${Math.round(totalWeight * 100)}svh` }}
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-[#080f1e]">
        <div className="absolute inset-0">
          {storyScenes.map((scene, index) => (
            <SceneVisual
              key={scene.id}
              scene={scene}
              index={index}
              start={sceneRanges[index].start}
              end={sceneRanges[index].end}
              progress={scrollYProgress}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(8,15,30,.98)_0%,rgba(8,15,30,.88)_28%,rgba(8,15,30,.28)_62%,rgba(8,15,30,.05)_100%)] max-md:bg-[linear-gradient(0deg,rgba(8,15,30,.98)_0%,rgba(8,15,30,.86)_35%,rgba(8,15,30,.08)_72%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(circle_at_72%_45%,transparent_0%,#080f1e_78%)]" />

        <div
          className="absolute inset-x-0 top-0 h-px origin-left bg-white/80"
          style={{
            transform: `scaleX(${(activeIndex + 1) / storyScenes.length})`,
            transition: "transform 400ms cubic-bezier(.16,1,.3,1)",
          }}
        />

        <div
          className="relative z-10 mx-auto flex h-full max-w-[94rem] items-end px-5 pb-[max(5.5rem,env(safe-area-inset-bottom))] pt-24 sm:px-8 md:items-center md:px-12 md:pb-12 lg:px-16"
          style={{ "--scene-accent": activeScene.accent } as React.CSSProperties}
        >
          <div className="w-full md:w-[54%]">
            <AnimatePresence mode="wait" initial={false}>
              <SceneCopy scene={activeScene} index={activeIndex} />
            </AnimatePresence>
          </div>
        </div>

        <nav
          aria-label="Story chapters"
          className="absolute bottom-5 left-5 z-20 flex items-center gap-2 sm:left-8 md:bottom-auto md:left-auto md:right-7 md:top-1/2 md:-translate-y-1/2 md:flex-col"
        >
          {storyScenes.map((scene, index) => (
            <button
              key={scene.id}
              type="button"
              onClick={() => jumpTo(index)}
              aria-label={`Go to ${scene.label}`}
              aria-current={index === activeIndex ? "step" : undefined}
              className="group relative flex min-h-8 min-w-8 items-center justify-center"
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "h-2.5 w-2.5 bg-white shadow-[0_0_14px_rgba(255,255,255,.65)]"
                    : "h-1.5 w-1.5 bg-white/28 group-hover:bg-white/65"
                }`}
              />
              <span className="pointer-events-none absolute right-7 hidden whitespace-nowrap text-[0.62rem] uppercase tracking-[0.16em] text-white/60 opacity-0 transition group-hover:opacity-100 md:block">
                {scene.label}
              </span>
            </button>
          ))}
        </nav>

        {activeIndex === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-5 right-5 z-10 hidden items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/36 sm:flex md:left-12 md:right-auto lg:left-16"
          >
            <span className="h-px w-8 bg-white/26" />
            Scroll to enter the system
          </motion.div>
        )}
      </div>
    </section>
  );
}
