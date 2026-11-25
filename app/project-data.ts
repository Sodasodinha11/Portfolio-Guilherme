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
  layout?: "portrait" | "landscape";
  caseSections?: Array<{ src: string; alt: string; width: number; height: number }>;
  gallery?: Array<{
    src: string;
    alt: string;
    wide?: boolean;
  }>;
};

export const projects: Project[] = [
  {
    slug: "nature",
    title: "Nature",
    eyebrow: "Redesign de Marca · 2026",
    category: "Redesign de Marca",
    year: "2026",
    image: "/artworks/nature/nature-cover.png",
    width: 2400,
    height: 1350,
    alt: "Nova assinatura visual da Nature em verde claro sobre fundo verde escuro",
    description: "Redesign de identidade visual desenvolvido para uma cliente. A proposta aproxima a comida natural da rotina, do primeiro olhar à refeição.",
    role: "Lettering, símbolo, paleta cromática, tipografia, grafismos e aplicações da identidade visual.",
    accent: "#d06bff",
    layout: "landscape",
    caseSections: [
      { src: "/artworks/nature/v8-01.png", alt: "Nature: Comida de verdade. Do natural à mesa. Início da cena com sacola kraft.", width: 2048, height: 1462 },
      { src: "/artworks/nature/v8-02.png", alt: "Continuação da cena de abertura com embalagem e bowl de salada Nature.", width: 2048, height: 1609 },
      { src: "/artworks/nature/v8-03.png", alt: "O natural, mais perto. Uma identidade que aproxima a comida natural da rotina, do primeiro olhar à refeição.", width: 2048, height: 1111 },
      { src: "/artworks/nature/v8-04.png", alt: "Um garfo que brota. O lettering Nature e seu símbolo independente, que une garfo e folhas.", width: 2048, height: 1609 },
      { src: "/artworks/nature/v8-05.png", alt: "Assinaturas da marca em verde-claro, verde-escuro, positiva e negativa.", width: 2048, height: 1960 },
      { src: "/artworks/nature/v8-06.png", alt: "Cor que embala. Paleta cromática: Verde Nature #164921, Verde broto #B8D195, branco #FFFFFF e preto #000000.", width: 1291, height: 2048 },
      { src: "/artworks/nature/v8-07.png", alt: "Tem frescor. Tem sabor. Lilita One nos títulos e DM Sans nos textos do case; lettering próprio na assinatura.", width: 2048, height: 1609 },
      { src: "/artworks/nature/v8-08.png", alt: "Do desenho à estampa. Frutas e folhas se transformam em grafismos para papel de embalagem.", width: 2048, height: 1544 },
      { src: "/artworks/nature/v8-09.png", alt: "Feita pra acompanhar. Bandejas com cintas de embalagem e sacola Nature.", width: 1442, height: 2048 },
      { src: "/artworks/nature/v8-10.png", alt: "Da bancada à rua. Aplicações da identidade visual em avental e van.", width: 1805, height: 2048 },
      { src: "/artworks/nature/v8-11.png", alt: "Na mesa e na tela. Cardápios impressos e apresentação digital.", width: 1780, height: 2048 },
      { src: "/artworks/nature/v8-12.png", alt: "Comida de verdade. Só Nature! Símbolo e encerramento do case.", width: 2048, height: 1192 },
    ],
  },
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
    title: "Uchiha Obito",
    eyebrow: "Composição Gráfica · 2026",
    category: "Composição Gráfica",
    year: "2026",
    image: "/artworks/tobi-uchiha.jpg",
    width: 1122,
    height: 1400,
    alt: "Pôster experimental inspirado em Uchiha Obito",
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
