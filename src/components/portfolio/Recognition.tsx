import { motion } from "framer-motion";

const press = [
  "Featured in El Youm7",
  "Ahram Gate",
  "News4",
  "El Balad",
  "Rosa El Youssef",
  "Aladwaa",
  "On 8 — El Sob7 (DMC)",
  "Helwan University Graduation Project",
];

export function Recognition() {
  return (
    <section className="relative overflow-hidden border-y border-border/40 bg-card/20 py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-7xl px-6"
      >
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-primary">Recognition</p>
        <h3 className="max-w-3xl text-2xl font-medium tracking-tight md:text-3xl">
          Engineering for impact since university —{" "}
          <span className="text-muted-foreground">
            our autism-therapy assistive robot was featured across Egyptian press and television.
          </span>
        </h3>
      </motion.div>

      <div className="relative mt-12 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex shrink-0 gap-12 px-6 text-lg text-muted-foreground"
        >
          {[...press, ...press].map((p, i) => (
            <span key={i} className="flex items-center gap-12 whitespace-nowrap">
              <span>{p}</span>
              <span className="h-1 w-1 rounded-full bg-primary" />
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
