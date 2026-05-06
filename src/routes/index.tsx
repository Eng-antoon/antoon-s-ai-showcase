import { createFileRoute } from "@tanstack/react-router";
import { PortfolioApp } from "@/components/portfolio/PortfolioApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Antoon Kamel — AI Technical Product Manager" },
      {
        name: "description",
        content:
          "Portfolio of Antoon Kamel Ibrahim — AI Technical Product Manager building logistics, finance, sales, workforce and consumer AI products in Cairo and remote.",
      },
      { property: "og:title", content: "Antoon Kamel — AI Technical Product Manager" },
      {
        property: "og:description",
        content:
          "Ten shipped products across logistics, marketplaces, finance, sales, workforce operations, AI agents and consumer AI.",
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
  return <PortfolioApp />;
}
