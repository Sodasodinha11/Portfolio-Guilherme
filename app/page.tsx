import type { Metadata } from "next";
import { PortfolioShowcase } from "./portfolio-showcase";

export const metadata: Metadata = {
  title: "Guilherme Miranda — Designer Gráfico",
  description:
    "Portfólio de Guilherme Miranda: identidade visual, direção de arte, design editorial e composição gráfica.",
};

export default function Home() {
  return <PortfolioShowcase />;
}
