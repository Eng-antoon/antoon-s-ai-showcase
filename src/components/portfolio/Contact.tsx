import { motion } from "framer-motion";

const links = [
  {
    label: "Email",
    href: "mailto:antoonkamel20000@outlook.com",
    value: "antoonkamel20000@outlook.com",
  },
  { label: "Phone", href: "tel:+201201048402", value: "+20 120 104 8402" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/antoon-kamel-swengineeer/",
    value: "linkedin.com/in/antoon-kamel-swengineeer",
  },
  {
    label: "GitHub",
    href: "https://github.com/antoonkamel",
    value: "github.com/antoonkamel",
  },
];

export function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#060c17] px-5 py-28 sm:px-8 md:py-40"
    >
      <div className="pointer-events-none absolute right-[-12rem] top-[-10rem] h-[34rem] w-[34rem] rounded-full bg-[#66d9f4]/10 blur-[120px]" />
      <div className="mx-auto max-w-[90rem]">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-primary">
            Get in touch
          </p>
          <h2 className="font-display mt-6 max-w-[11ch] text-[clamp(3.5rem,9vw,8.5rem)] font-semibold leading-[0.88] tracking-[-0.065em] text-white">
            Build what should already exist.
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/50">
            Open to ambitious AI product roles, operational platforms, and short-cycle MVP
            collaborations.
          </p>
        </motion.div>

        <div className="mt-20 border-t border-white/12">
          {links.map((link, index) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="group grid min-h-20 grid-cols-[5.5rem_1fr_auto] items-center border-b border-white/10 py-5 sm:grid-cols-[8rem_1fr_auto]"
            >
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white/34">
                {link.label}
              </span>
              <span className="truncate text-sm text-white/68 transition group-hover:text-white sm:text-lg">
                {link.value}
              </span>
              <span
                aria-hidden
                className="text-xl text-white/24 transition group-hover:translate-x-1 group-hover:text-primary"
              >
                ↗
              </span>
            </motion.a>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-6 text-xs text-white/30">
          <p>© {new Date().getFullYear()} Antoon Kamel Ibrahim · Cairo, Egypt</p>
          <a
            href="/antoon-kamel-resume.pdf"
            download
            className="text-white/62 transition hover:text-primary"
          >
            Download résumé ↗
          </a>
        </div>
      </div>
    </section>
  );
}
