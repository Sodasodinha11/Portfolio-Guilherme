# Design QA — Portfólio Guilherme Miranda

Data: 27/08/2026  
final result: passed

## Revisão adicional — legenda do retrato e texto do Sobre

- Data: 29/08/2026.
- Fontes visuais fornecidas pelo usuário: `C:/Users/gui_8/AppData/Local/Temp/codex-clipboard-c3056626-6259-409f-9c39-4ec350c891b2.png` e `C:/Users/gui_8/AppData/Local/Temp/codex-clipboard-e9b63e87-c5d7-421d-95d6-49d92a52833a.png`.
- Evidência inicial: `audit-before/mobile-hero.png` e `audit-before/mobile-about.png`.
- Comparações conjuntas: `audit-after/profile-caption-comparison.png` e `audit-after/about-phrase-comparison.png`.
- Estado final em tela estreita: `audit-after/mobile-hero-caption-centered.png` e `audit-after/mobile-about-phrase-removed.png`, viewport de 412 × 915 CSS px.
- Estado final em desktop: `audit-after/desktop-hero-caption-centered.png`, viewport de 1280 × 800 CSS px.
- [P2 resolvido] A legenda “Designer Gráfico” herdava alinhamento à esquerda; passou a ocupar a largura do retrato e usar alinhamento central. No mobile, os centros calculados da foto e da legenda ficaram ambos em 232,07 px; no desktop, a diferença ficou abaixo de 0,07 px.
- [P2 resolvido] A frase “O design como linguagem visual, pesquisa e experimentação.” foi removida, preservando o rótulo “Sobre”, o título, a biografia, a lista de áreas e o ritmo vertical da seção.
- Tipografia, cores, formas ambientais, imagem e conteúdo adjacente permaneceram inalterados.
- A frase removida teve contagem 0 no DOM e ganhou uma asserção de regressão no teste de renderização.
- Console: 0 erros e 0 avisos. Build de produção concluído e 4/4 testes aprovados.

final result: passed

## Revisão adicional — rotação da galeria

- Evidência inicial: `audit-rotation/02-wheel-before.png`.
- [P1 resolvido] A roda do mouse aceitava uma troca e bloqueava as seguintes por 1,15 s; cada evento ignorado reiniciava o bloqueio, deixando touchpads e rolagens repetidas com sensação de travamento.
- Correção: deltas de mouse/touchpad agora são normalizados e acumulados, e o cooldown de 440 ms começa somente quando uma troca é realmente aceita.
- [P1 resolvido] O início de um arraste durante uma transição podia reconstruir a timeline no índice de destino e produzir um salto, especialmente ao cruzar o card horizontal do Nature.
- Correção: o `horizontalLoop()` preserva o progresso visual no início do arraste, sincroniza o índice após a inércia, interrompe a inércia anterior ao receber outro comando e limita a duração do arremesso.
- [P2 resolvido] Pulsos de blur consecutivos podiam se sobrepor; agora o tween anterior é encerrado antes do próximo.
- Verificação funcional: duas rolagens separadas por 600 ms avançaram `Nature → Lamine Yamal → Reece James`; a seta direita avançou para `Leyendas`; o arraste curto avançou apenas para `Rafael Leão`; fora da galeria, a página continuou rolando.
- Alinhamento final: centro do card ativo em 779 px e centro da galeria em 780 px.
- Evidência pós-correção: `audit-rotation/03-wheel-corrected.png`.
- Console: 0 erros e 0 avisos. Build de produção concluído e 4/4 testes aprovados.

final result: passed

## Fontes de verdade

- Direção visual escolhida: `design-references/selected-direction-03.png`.
- Referência de movimento editorial: `design-references/robin-thomas-loading-reference.png`.
- Referência da galeria: helper oficial `horizontalLoop()` do GSAP e demo centralizada/arrastável em `design-references/gsap-horizontal-loop-reference.png`.
- Conteúdo e identidade: informações fornecidas por Guilherme e arquivos reais em `public/media/`.
- Implementação revisada: `app/portfolio-showcase.tsx`, `app/project-motion.tsx`, `app/projetos/[slug]/page.tsx` e `app/globals.css`.

## Evidência visual

- Comparação da referência de movimento com a implementação: `audit-after/55-reference-prototype-comparison.png`.
- Comparação da referência GSAP com a galeria implementada: `audit-after/69-gsap-reference-prototype-comparison.png`.
- Galeria GSAP em repouso: `audit-after/72-iab-desktop-final.png`.
- Galeria após roda do mouse e snap: `audit-after/73-iab-gsap-wheel-interaction.png`.
- Galeria GSAP em tela estreita: `audit-after/71-mobile-gsap-loop-fresh.png`.
- Projeto Yamal: `audit-after/37-yamal-organic-bg.png`.
- Projeto Tobi: `audit-after/38-tobi-couture.png`.
- Nature na galeria principal: `audit-after/nature-home-wheel.png`.
- Abertura do case Nature: `audit-after/nature-project-top.png`.
- Case Nature em tela estreita: `audit-after/nature-mobile.png`.

## Estados e viewports verificados

- Desktop efetivo: 1125 × 793, sem overflow horizontal.
- Responsivo efetivo: 339 × 734, pôster central inteiro e sem overflow horizontal.
- A roda do mouse, usada sobre a galeria, avançou de `01` para `02` sem alterar a posição vertical da página.
- O arraste horizontal acionou inércia e snap, manteve a URL e a posição vertical e terminou com o pôster ativo centralizado.
- A navegação por setas do teclado foi verificada durante a rodada de interação.
- Hover mantém a arte em escala de cinza no repouso e revela a cor somente sobre o pôster.

## Resultado por superfície

### Galeria GSAP

- A wheel circular anterior foi removida por completo.
- A faixa usa o `horizontalLoop()` responsivo do GSAP, com loop infinito, cálculo de larguras variáveis e alinhamento pelo centro real da galeria.
- `Draggable` e `InertiaPlugin` controlam arraste, desaceleração e encaixe no pôster mais próximo.
- O card lateral pode ser selecionado; o card central abre o projeto.
- O scroll é capturado somente enquanto o cursor está sobre a galeria. Fora dela, a página continua rolando normalmente.
- O movimento aplica um impulso curto de no máximo 1,4 px de blur em um wrapper interno. O GSAP mantém controle exclusivo do posicionamento dos cards, evitando conflito de transforms.
- Todas as imagens usam `object-fit: contain`, sem moldura, sem `clip-path` e sem corte da arte.

### Tipografia e hierarquia

- Nibor permanece na assinatura, nome principal, intro e títulos esportivos.
- Couture permanece nos títulos editoriais e de composição gráfica, com kerning calibrado.
- A fonte neutra fica restrita a textos funcionais, categorias, datas e contatos.
- Não há corte do nome durante o motion ou no estado final.
- Hero, trabalhos, sobre e contato mantêm papéis distintos, ritmo vertical e hierarquia editorial.

### Cor, fundo e conteúdo

- Fundo all-black `#050505`, texto neutro e roxo forte `#D06BFF` apenas em detalhes e estados ativos.
- Formas ambientais são monocromáticas, ficam atrás do conteúdo e não interceptam o cursor.
- Textura editorial permanece discreta; não há film grain pesado, gradientes ou obras usadas como fundo geral.
- Nome, profissão, biografia, e-mail e LinkedIn foram conferidos.
- Instagram, Behance, experiência inventada e Desencanto não aparecem.
- Todos os trabalhos exibem 2026; categorias esportivas usam “Pôster Esportivo”, as artes pessoais usam “Composição Gráfica” e o novo case usa “Redesign de Marca”.

### Case Nature

- O redesign foi incluído no portfólio original como o primeiro trabalho da galeria, com tratamento horizontal próprio para não deformar nem cortar a capa.
- A página usa o material real da apresentação: assinatura principal e secundária, versões positiva/negativa, versões monocromáticas, símbolo, paleta e três aplicações.
- A narrativa é curta e direta, identificando que se trata de um trabalho para cliente e registrando a contribuição em redesign de logo, símbolo, sistema de versões e aplicações.
- A galeria alterna peças em largura total e duplas proporcionais, sem espaços vazios artificiais; no mobile, tudo passa para uma coluna.
- Arquivos `.AI`, arquivos nomeados como `Ativo` e `exec-e2025f1c-d3e0-4732-b83a-21ccf596e7c6` não foram usados.

## Acessibilidade e estabilidade

- A galeria é focável e responde às setas esquerda/direita.
- `prefers-reduced-motion` remove inércia, blur e inclinação desnecessários.
- O fundo usa `pointer-events: none` e não bloqueia a interface.
- Nenhum erro ou aviso novo apareceu no console após recarregamento limpo.
- Build de produção concluído sem erro.
- Testes locais: 4 aprovados, 0 falhas, incluindo renderização completa do case Nature, restauração da intro e tratamento tipográfico unificado.

## Pendências

- Nenhuma pendência P0, P1 ou P2 encontrada nesta revisão.

## Revisão adicional — tipografia dos cases e abertura original

### Fontes de verdade

- Capturas do problema fornecidas pelo usuário: `audit-current/project-tobi-title-wrong.png`, `audit-current/project-gus-title-wrong.png`, `audit-current/project-ecco2k-title-wrong.png` e `audit-current/project-nature-title-wrong.png`.
- Tratamento tipográfico correto já existente no projeto esportivo: `audit-current/project-yamal-title-reference.png` (637 × 682 px).
- Abertura original definida no código antes da inclusão do Nature: Yamal, Tobi Uchiha e ECCO2K.

### Comparação e histórico

- [P1 resolvido] Tobi, Gus, ECCO2K e Nature usavam Couture expandida dentro de um wrapper comprimido, produzindo títulos excessivamente estreitos e diferentes dos cases esportivos.
- Correção: todas as páginas de projeto agora usam diretamente a mesma Nibor dinâmica, com peso 400, `line-height: 0.84`, `letter-spacing: 0.005em` e sem wrapper escalado.
- Evidência pós-correção: `audit-after/project-tobi-title-fixed.png`, `audit-after/project-gus-title-fixed.png`, `audit-after/project-ecco2k-title-fixed.png` e `audit-after/project-nature-title-fixed.png` (637 × 682 px).
- [P1 resolvido] A inclusão do Nature deslocou os índices usados pela intro e substituiu parte das artes originais.
- Correção: a intro deixou de depender de índices e passou a selecionar explicitamente `yamal`, `tobi-uchiha` e `ecco2k`.
- Evidência pós-correção: `audit-after/intro-restored-motion.png` (652 × 698 px); os três `src` renderizados foram confirmados no navegador e não incluem Nature.

### Responsividade e superfícies obrigatórias

- Mobile solicitado: override de 390 × 844 CSS px; captura útil gerada em 375 × 812 px devido à área interna do navegador. Evidência: `audit-after/project-nature-title-mobile-final.png`.
- Tipografia: família, peso, escala, kerning, line-height e quebra foram comparados com Yamal e estão consistentes.
- Espaçamento: a troca da fonte não alterou grid, ritmo vertical, fatos do projeto ou início da mídia.
- Cores: fundo, formas monocromáticas, texto e roxo de destaque foram preservados.
- Imagens: nenhuma arte, crop ou qualidade de arquivo foi alterada.
- Conteúdo: títulos, categorias, descrições e contribuições foram preservados.
- Console após desktop/mobile: 0 erros e 0 avisos.
- Comparação focada foi suficiente porque a mudança se restringiu aos títulos e à seleção das três imagens da intro; nenhuma estrutura adjacente foi alterada.

final result: passed
