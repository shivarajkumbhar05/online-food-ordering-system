import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const frontendDirectory = fileURLToPath(new URL(".", import.meta.url));
const pages = Object.fromEntries(
  readdirSync(frontendDirectory)
    .filter((file) => file.endsWith(".html"))
    .map((file) => [file.slice(0, -".html".length), resolve(frontendDirectory, file)])
);

export default defineConfig({
  build: {
    rollupOptions: {
      input: pages,
    },
  },
});
