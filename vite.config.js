import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "dist/front",
    minify: false // TODO: remove later, just for development
  },
  plugins: [vue()],
  resolve: {
    alias: {
      fs: require.resolve('rollup-plugin-node-builtins'),
      require: require.resolve('rollup-plugin-node-builtins'),
    },
  },
  server: {
    host: '0.0.0.0'
  }
})
