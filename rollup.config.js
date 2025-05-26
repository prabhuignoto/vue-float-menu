import { readFileSync } from 'fs';
import beep from '@rollup/plugin-beep';
import common from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
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

// Base plugins configuration (shared between builds)
const createPlugins = (extractCSS = true) => [
  // Resolve dependencies
  resolve({
    browser: true,
    preferBuiltins: false,
    extensions: ['.js', '.ts', '.vue'],
  }),

  // Handle CommonJS dependencies
  common({
    exclude: 'src/**',
  }),

  // Process Vue files
  vue({
    css: false, // Always let postcss handle CSS extraction
    compileTemplate: true,
    preprocessStyles: true,
    template: {
      isProduction: true,
      compilerOptions: {
        whitespace: 'condense',
      },
    },
  }),

  // Process CSS/SCSS files
  postcss({
    extract: extractCSS ? 'vue-float-menu.css' : false,
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
    inject: !extractCSS, // Inject CSS if not extracting
  }),

  // Use esbuild for TypeScript and JavaScript transpilation
  esbuild({
    include: /\.[jt]s$/,
    minify: false, // Let terser handle minification for better control
    target: 'es2020', // More compatible target
    tsconfig: './tsconfig.build.json',
  }),

  // Minify JavaScript with terser for better compression
  terser({
    format: {
      comments: /^!/,
    },
    compress: {
      drop_console: true,
      drop_debugger: true,
    },
  }),

  // Success notification
  beep(),
];

// Export configurations
export default [
  // ES Module build (for modern bundlers)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/vue-float-menu.js',
      format: 'es',
      exports: 'named',
      banner,
      sourcemap: true,
      inlineDynamicImports: true, // Added to prevent chunking
    },
    plugins: createPlugins(true), // Extract CSS for ES build
    external: ['vue'],
    onwarn(warning, warn) {
      // Suppress certain warnings
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      if (warning.code === 'CIRCULAR_DEPENDENCY') return;
      warn(warning);
    },
  },

  // UMD build (for direct browser usage)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/vue-float-menu.umd.js',
      format: 'umd',
      exports: 'named',
      banner,
      name: 'VueFloatMenu',
      sourcemap: true,
      inlineDynamicImports: true, // Fixed: moved to output config
      globals: {
        vue: 'Vue',
      },
    },
    plugins: createPlugins(false), // Don't extract CSS for UMD (inject instead)
    external: ['vue'],
    onwarn(warning, warn) {
      // Suppress certain warnings
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      if (warning.code === 'CIRCULAR_DEPENDENCY') return;
      warn(warning);
    },
  },

  // CommonJS build (for Node.js compatibility)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/vue-float-menu.cjs',
      format: 'cjs',
      exports: 'named',
      banner,
      sourcemap: true,
      inlineDynamicImports: true, // Added to prevent chunking
    },
    plugins: createPlugins(false), // Don't extract CSS for CJS
    external: ['vue'],
    onwarn(warning, warn) {
      // Suppress certain warnings
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      if (warning.code === 'CIRCULAR_DEPENDENCY') return;
      warn(warning);
    },
  },
];
