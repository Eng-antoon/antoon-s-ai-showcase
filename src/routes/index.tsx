import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/portfolio/SmoothScroll";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Toolkit } from "@/components/portfolio/Toolkit";
import { RoadmapParallax } from "@/components/portfolio/RoadmapParallax";
import { ExperienceTimeline } from "@/components/portfolio/ExperienceTimeline";
import { Recognition } from "@/components/portfolio/Recognition";
import { Contact } from "@/components/portfolio/Contact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Antoon Kamel — AI Technical Product Manager" },
      {
        name: "description",
        content:
          "Portfolio of Antoon Kamel Ibrahim — AI Technical Product Manager building logistics, finance and consumer AI products in Cairo and remote.",
      },
      { property: "og:title", content: "Antoon Kamel — AI Technical Product Manager" },
      {
        property: "og:description",
        content:
          "Nine shipped AI products. Logistics, marketplaces, autonomous agents, ops dashboards. An interactive scroll-driven portfolio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SmoothScroll>
      <main id="top" className="noise relative min-h-screen bg-background text-foreground">
        <Nav />
        <Hero />
        <About />
        <Toolkit />
        <RoadmapParallax />
        <ExperienceTimeline />
        <Recognition />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
