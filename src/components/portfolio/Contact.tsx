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
  { label: "GitHub", href: "https://github.com/", value: "github.com/antoonkamel" },
];

export function Contact() {
  return (
    <section id="contact" className="relative mx-auto max-w-7xl px-6 py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-primary">Get in touch</p>
        <h2 className="max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
          Have a product that <span className="text-gradient">should already exist</span>?
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          I'm always open to bold AI product roles, advisory engagements, and short-cycle MVP
          collaborations.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {links.map((l, i) => (
          <motion.a
            key={l.label}
            href={l.href}
            target={l.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="group flex items-center justify-between rounded-2xl border border-border/50 bg-card/40 px-6 py-6 backdrop-blur transition hover:border-primary/40 hover:bg-card/70"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{l.label}</p>
              <p className="mt-1 text-lg font-medium">{l.value}</p>
            </div>
            <span className="text-2xl text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary">
              →
            </span>
          </motion.a>
        ))}
      </div>

      <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-border/40 pt-10 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Antoon Kamel Ibrahim — Cairo, Egypt</p>
        <a
          href="/antoon-kamel-resume.pdf"
          download
          className="inline-flex items-center gap-2 text-foreground hover:text-primary"
        >
          Download résumé →
        </a>
      </div>
    </section>
  );
}
