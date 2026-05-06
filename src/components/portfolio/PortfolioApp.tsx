import { SmoothScroll } from "@/components/portfolio/SmoothScroll";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Toolkit } from "@/components/portfolio/Toolkit";
import { RoadmapParallax } from "@/components/portfolio/RoadmapParallax";
import { ExperienceTimeline } from "@/components/portfolio/ExperienceTimeline";
import { Recognition } from "@/components/portfolio/Recognition";
import { Contact } from "@/components/portfolio/Contact";

export function PortfolioApp() {
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
