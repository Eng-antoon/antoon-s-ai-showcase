import { createFileRoute } from "@tanstack/react-router";
import { PortfolioApp } from "@/components/portfolio/PortfolioApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Antoon Kamel — AI Technical Product Manager" },
      {
        name: "description",
        content:
          "Antoon Kamel is an AI Technical Product Manager turning complex logistics and field operations into measurable product systems.",
      },
      { property: "og:title", content: "Antoon Kamel — AI Technical Product Manager" },
      {
        property: "og:description",
        content:
          "A story-led portfolio of measurable product impact across field sales, logistics, finance, and autonomous AI operations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Manrope:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <PortfolioApp />;
}
