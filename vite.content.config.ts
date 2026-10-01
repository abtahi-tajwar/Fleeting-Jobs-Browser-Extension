import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  publicDir: false,

  build: {
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: true,
    minify: false,

    rollupOptions: {
      input: resolve(
        __dirname,
        "src/content/index.ts",
      ),

      output: {
        format: "iife",
        entryFileNames: "src/content/index.js",
        inlineDynamicImports: true,
      },
    },
  },
});