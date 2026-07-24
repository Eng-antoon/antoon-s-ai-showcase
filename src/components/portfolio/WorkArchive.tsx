import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { projects, type Project } from "@/data/projects";

const filters = ["All", "Operations", "Sales", "Finance", "AI", "Consumer"] as const;
type Filter = (typeof filters)[number];

function matches(project: Project, filter: Filter) {
  if (filter === "All") return true;
  const haystack = `${project.name} ${project.domain} ${project.tagline}`.toLowerCase();
  const terms: Record<Exclude<Filter, "All">, string[]> = {
    Operations: ["operations", "planning", "workforce", "last-mile"],
    Sales: ["sales", "crm", "marketplace"],
    Finance: ["finance", "fintech", "reconciliation"],
    AI: ["ai", "vision", "autonomous"],
    Consumer: ["consumer", "b2c", "marketplace"],
  };
  return terms[filter].some((term) => haystack.includes(term));
}

function ProjectDetails({ project }: { project: Project }) {
  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-[#0d1628]">
        <img
          src={project.image}
          alt={project.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080f1e]/85 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-white/50">
            {project.domain}
          </p>
          <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
            {project.name}
          </h3>
        </div>
      </div>
      <p className="mt-6 text-sm leading-relaxed text-white/56">{project.role}</p>
      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
        {project.stack.map((item) => (
          <span
            key={item}
            className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-white/36"
          >
            {item}
          </span>
        ))}
      </div>
      <p className="mt-6 border-l border-[#66d9f4]/45 pl-4 text-sm leading-relaxed text-white/72">
        {project.impact[0]}
      </p>
    </motion.div>
  );
}

export function WorkArchive() {
  const [filter, setFilter] = useState<Filter>("All");
  const filtered = useMemo(() => projects.filter((project) => matches(project, filter)), [filter]);
  const [selectedId, setSelectedId] = useState(projects[0].id);
  const selected =
    filtered.find((project) => project.id === selectedId) ?? filtered[0] ?? projects[0];

  return (
    <section id="work" className="relative bg-[#080f1e] px-5 py-28 sm:px-8 md:py-40 lg:px-12">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-8 border-b border-white/10 pb-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-[#66d9f4]">
              Selected work
            </p>
            <h2 className="font-display mt-5 max-w-[12ch] text-5xl font-semibold leading-[0.95] tracking-[-0.055em] text-white md:text-7xl">
              The rest of the evidence.
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-white/50">
            Ten products across logistics, finance, field sales, marketplaces, consumer AI, and
            autonomous operations.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-1.5" aria-label="Filter work by domain">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
              className={`min-h-10 rounded-full px-4 text-xs font-medium transition ${
                filter === item
                  ? "bg-white text-[#08101f]"
                  : "bg-white/[0.04] text-white/52 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(22rem,.8fr)] lg:items-start">
          <div className="border-t border-white/12">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => {
                const active = selected.id === project.id;
                return (
                  <motion.div layout key={project.id} className="border-b border-white/10">
                    <button
                      type="button"
                      onMouseEnter={() => setSelectedId(project.id)}
                      onFocus={() => setSelectedId(project.id)}
                      onClick={() => setSelectedId(project.id)}
                      aria-expanded={active}
                      className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-start gap-3 py-6 text-left sm:grid-cols-[3.5rem_1fr_auto] sm:py-8"
                    >
                      <span className="pt-1 font-mono text-[0.62rem] text-white/30">
                        {project.index}
                      </span>
                      <span>
                        <span
                          className={`font-display block text-2xl font-medium tracking-[-0.035em] transition sm:text-3xl ${
                            active ? "text-white" : "text-white/58 group-hover:text-white"
                          }`}
                        >
                          {project.name}
                        </span>
                        <span className="mt-2 block max-w-xl text-sm leading-relaxed text-white/38">
                          {project.tagline}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className={`pt-1 text-xl transition ${
                          active
                            ? "rotate-90 translate-x-0 text-[#66d9f4]"
                            : "-translate-x-2 text-white/20"
                        }`}
                      >
                        →
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {active && (
                        <motion.div
                          key={`${project.id}-inline`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden lg:hidden"
                        >
                          <div className="pb-8 pl-[3.25rem] sm:pl-[4.25rem]">
                            <ProjectDetails project={project} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="hidden lg:sticky lg:top-28 lg:block">
            <AnimatePresence mode="wait">
              <ProjectDetails project={selected} />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
