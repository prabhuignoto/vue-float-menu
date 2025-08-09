import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import terserPlugin from '@rollup/plugin-terser';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  publicDir: false,
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
    sourcemap: false,
    minify: false,
    rollupOptions: {
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
        exports: 'named',
        inlineDynamicImports: true,
        compact: true,
      },
      plugins: [
        terserPlugin({
          module: true,
          ecma: 2020,
          mangle: { toplevel: true },
          compress: {
            defaults: true,
            drop_console: true,
            drop_debugger: true,
            passes: 3,
            pure_getters: true,
          },
          format: { comments: false },
        }),
      ],
    },
  },
});
