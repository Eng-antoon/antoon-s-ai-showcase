import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PortfolioApp } from "@/components/portfolio/PortfolioApp";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PortfolioApp />
  </StrictMode>,
);
