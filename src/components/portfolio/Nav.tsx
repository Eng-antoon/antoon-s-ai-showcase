import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { id: "about", label: "About" },
  { id: "toolkit", label: "Toolkit" },
  { id: "projects", label: "Roadmap" },
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
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ${
          scrolled ? "scale-95" : ""
        }`}
      >
        <div className="flex items-center gap-1 rounded-full border border-border/50 bg-background/70 p-1.5 backdrop-blur-xl">
          <a href="#top" className="px-4 py-1.5 text-sm font-medium tracking-tight">
            AK<span className="text-primary">.</span>
          </a>
          <span className="hidden h-4 w-px bg-border md:block" />
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="hidden rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-card/60 hover:text-foreground md:block"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/antoon-kamel-resume.pdf"
            download
            className="ml-1 rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            CV
          </a>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
}
