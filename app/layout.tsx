import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "./smooth-scroll";

export const metadata: Metadata = {
  title: {
    default: "Guilherme Miranda — Designer Gráfico",
    template: "%s — Guilherme Miranda",
  },
  description:
    "Portfólio de Guilherme Miranda: identidade visual, direção de arte, design editorial e composição gráfica.",
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
