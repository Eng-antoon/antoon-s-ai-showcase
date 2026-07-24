import { SmoothScroll } from "@/components/portfolio/SmoothScroll";
import { Nav } from "@/components/portfolio/Nav";
import { ScrollStory } from "@/components/portfolio/ScrollStory";
import { WorkArchive } from "@/components/portfolio/WorkArchive";
import { ExperienceTimeline } from "@/components/portfolio/ExperienceTimeline";
import { Recognition } from "@/components/portfolio/Recognition";
import { Contact } from "@/components/portfolio/Contact";

export function PortfolioApp() {
  return (
    <SmoothScroll>
      <main id="top" className="noise relative min-h-screen bg-[#080f1e] text-foreground">
        <Nav />
        <ScrollStory />
        <WorkArchive />
        <ExperienceTimeline />
        <Recognition />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
