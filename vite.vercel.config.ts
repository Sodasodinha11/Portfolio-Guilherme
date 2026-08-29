import { nitro } from "nitro/vite";
import vinext from "vinext";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const tailwindStylesheet = fileURLToPath(
  new URL("./node_modules/tailwindcss/index.css", import.meta.url),
);

// Vercel uses Nitro's Build Output API adapter. The default Vite config stays
// dedicated to Cloudflare so both hosting targets remain independently usable.
export default defineConfig({
  resolve: {
    alias: [{ find: /^tailwindcss$/, replacement: tailwindStylesheet }],
  },
  plugins: [vinext(), nitro({ preset: "vercel" })],
});
