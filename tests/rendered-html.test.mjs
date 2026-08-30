import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders Guilherme's portfolio home", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Guilherme Miranda — Designer Gráfico<\/title>/);
  assert.match(html, /GUILHERME/);
  assert.match(html, /MIRANDA/);
  assert.match(html, /TRABALHOS SELECIONADOS/i);
  assert.match(html, /Nature/);
  assert.match(html, /Redesign de Marca/);
  assert.match(html, /Lamine Yamal/);
  assert.match(html, /Pôster Esportivo/);
  assert.match(html, /Composição Gráfica/);
  assert.match(html, /gui_8\.0@hotmail\.com/);
  assert.match(html, /linkedin\.com\/in\/guilherme-miranda-9336723b5/);
  assert.match(html, /\/media\/blob-orchid\.svg/);
  assert.equal((html.match(/\/artworks\/nature\/nature-cover\.png/g) ?? []).length, 1);
  assert.ok((html.match(/\/artworks\/yamal\.jpg/g) ?? []).length >= 2);
  assert.ok((html.match(/\/artworks\/tobi-uchiha\.jpg/g) ?? []).length >= 2);
  assert.ok((html.match(/\/artworks\/ecco2k\.jpg/g) ?? []).length >= 2);
  assert.doesNotMatch(html, /Desencanto/i);
  assert.doesNotMatch(html, /O design como linguagem visual/i);
  assert.doesNotMatch(html, /Instagram|Behance/i);
});

test("server-renders the Nature redesign case with its complete gallery", async () => {
  const response = await render("/projetos/nature");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Nature/);
  assert.match(html, /Redesign de Marca/);
  assert.match(html, /Redesign de identidade visual desenvolvido para uma cliente/);
  assert.match(html, /\/artworks\/nature\/nature-cover\.png/);
  assert.match(html, /\/artworks\/nature\/nature-awning\.png/);
  assert.match(html, /\/artworks\/nature\/nature-bag\.png/);
  assert.match(html, /\/artworks\/nature\/nature-storefront\.png/);
});

test("uses the same dynamic display treatment on every project title", async () => {
  for (const [slug, title] of [
    ["nature", "Nature"],
    ["tobi-uchiha", "Tobi Uchiha"],
    ["gus-art", "Gus"],
    ["ecco2k", "ECCO2K"],
  ]) {
    const response = await render(`/projetos/${slug}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, new RegExp(`<h1>${title}</h1>`));
    assert.doesNotMatch(html, /couture-face--project/);
  }
});

test("server-renders the Yamal project with poster and process video", async () => {
  const response = await render("/projetos/yamal");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Lamine Yamal/);
  assert.match(html, /Pôster Esportivo/);
  assert.match(html, /\/artworks\/yamal\.jpg/);
  assert.match(html, /\/media\/yamal-process\.mp4/);
  assert.match(html, /Processo de criação/);
  assert.match(html, /\/media\/blob-cobalt\.svg/);
});
