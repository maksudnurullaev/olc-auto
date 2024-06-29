import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import mkcert from 'vite-plugin-mkcert';

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (mode === 'production'){
    return {
      build: {
        outDir: "dist/front",
        minify: true,
      },
      plugins: [vue()],
    }
  } else {
    return {
      build: {
        outDir: "dist/front",
        minify: true,
      },
      plugins: [vue(), mkcert() ],
    }
  } 
}
);
