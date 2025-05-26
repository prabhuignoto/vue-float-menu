import { readFileSync } from 'fs';
import beep from '@rollup/plugin-beep';
import common from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import vue from 'rollup-plugin-vue';

// Read package.json using fs for better compatibility
const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

const banner = `/*
 * ${pkg.name}
 * ${pkg.description}
 * v${pkg.version}
 * ${pkg.license} License
 */
`;

export default {
  input: 'src/vue-float-menu.js',
  output: [
    {
      file: pkg.main,
      format: 'es',
      exports: 'named',
      strict: true,
      banner,
      sourcemap: true,
    },
    {
      file: pkg.umd,
      format: 'umd',
      exports: 'named',
      strict: true,
      banner,
      name: 'VueFloatMenu',
      sourcemap: true,
      globals: {
        vue: 'Vue',
      },
    },
  ],
  plugins: [
    // Resolve dependencies first
    resolve({
      browser: true,
      preferBuiltins: false,
      extensions: ['.js', '.ts', '.vue'],
    }),

    // Handle CommonJS dependencies
    common({
      exclude: 'src/**',
    }),

    // Process Vue files with CSS handling
    vue({
      css: true, // Let Vue handle CSS internally
      compileTemplate: true,
      preprocessStyles: true,
      template: {
        isProduction: true,
        compilerOptions: {
          whitespace: 'condense',
        },
      },
    }),

    // Process CSS/SCSS files (including those extracted by Vue)
    postcss({
      extract: 'vue-float-menu.css',
      minimize: true,
      use: [
        [
          'sass',
          {
            includePaths: ['node_modules', 'src'],
          },
        ],
      ],
      extensions: ['.css', '.scss', '.sass'],
      inject: false, // Don't inject CSS into JS
    }),

    // Use esbuild for TypeScript and JavaScript transpilation
    esbuild({
      include: /\.[jt]s$/,
      minify: true,
      target: 'esnext',
      tsconfig: './tsconfig.build.json',
    }),

    // Success notification
    beep(),
  ],
  external: ['vue'],
  onwarn(warning, warn) {
    // Suppress certain warnings
    if (warning.code === 'THIS_IS_UNDEFINED') return;
    if (warning.code === 'CIRCULAR_DEPENDENCY') return;
    warn(warning);
  },
};
