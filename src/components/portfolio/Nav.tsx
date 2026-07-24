import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { id: "story", label: "Story" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      <motion.nav
        initial={false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ${
          scrolled ? "scale-95" : ""
        }`}
      >
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-[#080f1e]/72 p-1.5 shadow-[0_16px_50px_rgba(0,0,0,.22)] backdrop-blur-xl">
          <a
            href="#top"
            aria-label="Back to the beginning"
            className="px-4 py-1.5 text-sm font-semibold tracking-tight text-white"
          >
            AK<span className="text-primary">.</span>
          </a>
          <span className="hidden h-4 w-px bg-white/12 md:block" />
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="hidden rounded-full px-3 py-1.5 text-sm text-white/52 transition hover:bg-white/[0.06] hover:text-white md:block"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/antoon-kamel-resume.pdf"
            download
            className="ml-1 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-[#08101f] transition hover:bg-[#dffaff]"
          >
            Résumé
          </a>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
}
