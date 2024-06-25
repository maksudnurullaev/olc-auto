import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  build: {
    outDir: "dist/front",
    minify: true,
  },
  plugins: [vue()],
});
