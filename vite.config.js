import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'VueFloatMenu',
      fileName: (format) => ({
        es: 'vue-float-menu.js',
        cjs: 'vue-float-menu.cjs',
        umd: 'vue-float-menu.umd.js',
      })[format],
      formats: ['es', 'cjs', 'umd'],
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
        exports: 'named',
      },
    },
  },
});
