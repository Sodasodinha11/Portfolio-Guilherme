import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "./smooth-scroll";

const siteTitle = "Guilherme Miranda — Designer Gráfico";
const siteDescription =
  "Portfólio de Guilherme Miranda: identidade visual, direção de arte, design editorial e composição gráfica.";

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: "%s — Guilherme Miranda",
  },
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body><SmoothScroll />{children}</body>
    </html>
  );
}
