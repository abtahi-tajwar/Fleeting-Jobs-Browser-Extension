import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";

const __dirname = fileURLToPath(
  new URL(".", import.meta.url)
);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,

    rollupOptions: {
      input: {
        popup: resolve(
          __dirname,
          "popup.html"
        ),

        background: resolve(
          __dirname,
          "src/background/index.ts"
        ),

        content: resolve(
          __dirname,
          "src/content/index.ts"
        )
      },

      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === "background") {
            return "src/background/index.js";
          }

          if (chunk.name === "content") {
            return "src/content/index.js";
          }

          return "assets/[name].js";
        }
      }
    }
  }
});