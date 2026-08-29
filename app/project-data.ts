export type Project = {
  slug: string;
  title: string;
  eyebrow: string;
  category: string;
  year: string;
  image: string;
  width: number;
  height: number;
  alt: string;
  description: string;
  role: string;
  accent: string;
  hasVideo?: boolean;
};

export const projects: Project[] = [
  {
    slug: "yamal",
    title: "Lamine Yamal",
    eyebrow: "Pôster Esportivo · 2026",
    category: "Pôster Esportivo",
    year: "2026",
    image: "/artworks/yamal.jpg",
    width: 787,
    height: 1400,
    alt: "Pôster esportivo azul de Lamine Yamal inspirado na Champions League",
    description: "Estudo de composição, atmosfera e narrativa visual inspirado na UEFA Champions League.",
    role: "Direção de arte, composição, tratamento de imagem e tipografia.",
    accent: "#d06bff",
    hasVideo: true,
  },
  {
    slug: "reece-james",
    title: "Reece James",
    eyebrow: "Pôster Esportivo · 2026",
    category: "Pôster Esportivo",
    year: "2026",
    image: "/artworks/reece-james.jpg",
    width: 990,
    height: 1400,
    alt: "Pôster preto e branco de Reece James para o Mundial de Clubes",
    description: "Pôster esportivo desenvolvido a partir de contraste forte, textura e símbolos do clube.",
    role: "Direção de arte, composição e tratamento de imagem.",
    accent: "#d06bff",
  },
  {
    slug: "messi-maradona",
    title: "Leyendas",
    eyebrow: "Pôster Esportivo · 2026",
    category: "Pôster Esportivo",
    year: "2026",
    image: "/artworks/messi-maradona.jpg",
    width: 1080,
    height: 1350,
    alt: "Pôster de Lionel Messi e Diego Maradona",
    description: "Encontro visual entre duas gerações, construído por camadas, ritmo e memória esportiva.",
    role: "Composição gráfica, tratamento e acabamento.",
    accent: "#d06bff",
  },
  {
    slug: "rafael-leao",
    title: "Rafael Leão",
    eyebrow: "Pôster Esportivo · 2026",
    category: "Pôster Esportivo",
    year: "2026",
    image: "/artworks/rafael-leao.jpg",
    width: 1050,
    height: 1400,
    alt: "Pôster esportivo de Rafael Leão",
    description: "Exploração de movimento e presença usando fotografia, contraste e tipografia expressiva.",
    role: "Direção de arte e composição gráfica.",
    accent: "#d06bff",
  },
  {
    slug: "tobi-uchiha",
    title: "Tobi Uchiha",
    eyebrow: "Composição Gráfica · 2026",
    category: "Composição Gráfica",
    year: "2026",
    image: "/artworks/tobi-uchiha.jpg",
    width: 1122,
    height: 1400,
    alt: "Pôster experimental inspirado em Tobi Uchiha",
    description: "Estudo autoral de personagem com sobreposição de elementos e linguagem de pôster urbano.",
    role: "Composição, tratamento e tipografia.",
    accent: "#d06bff",
  },
  {
    slug: "gus-art",
    title: "Gus",
    eyebrow: "Composição Gráfica · 2026",
    category: "Composição Gráfica",
    year: "2026",
    image: "/artworks/gus-art.jpg",
    width: 1120,
    height: 1400,
    alt: "Composição gráfica autoral intitulada Gus",
    description: "Composição gráfica criada como exercício de textura, hierarquia e atmosfera.",
    role: "Conceito, direção de arte e composição.",
    accent: "#d06bff",
  },
  {
    slug: "ecco2k",
    title: "ECCO2K",
    eyebrow: "Composição Gráfica · 2026",
    category: "Composição Gráfica",
    year: "2026",
    image: "/artworks/ecco2k.jpg",
    width: 1120,
    height: 1400,
    alt: "Pôster experimental de ECCO2K",
    description: "Pôster musical experimental orientado por textura, contraste e uma estética etérea.",
    role: "Direção de arte, composição e tratamento de imagem.",
    accent: "#d06bff",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
