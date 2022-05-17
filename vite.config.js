import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      fs: require.resolve('rollup-plugin-node-builtins'),
      require: require.resolve('rollup-plugin-node-builtins'),
    },
  },
})
