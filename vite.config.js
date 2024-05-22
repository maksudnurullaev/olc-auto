import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  build: {
    outDir: "dist/front",
    minify: false, // WARNING! Remove later for production...
    // sourcemap: true
  },
  plugins: [vue(), mkcert() ],
});
