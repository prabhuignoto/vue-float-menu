// eslint.config.js - new format for ESLint v9+ (2025 standards)
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import vuePlugin from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import tsParser from '@typescript-eslint/parser';
import tseslint from 'typescript-eslint';

export default [
  // JS base (scope to JS only so it doesn't override Vue parser)
  {
    ...js.configs.recommended,
    files: ['**/*.{js,jsx,cjs,mjs}'],
  },

  // TS base (scope to TS only so it doesn't override Vue parser for .vue files)
  ...tseslint.configs.recommended.map((cfg) => ({
    ...cfg,
    files: ['**/*.{ts,tsx}'],
  })),

  // TS tweaks
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // Import ordering
  {
    plugins: { import: importPlugin },
    files: ['**/*.{js,jsx,ts,tsx,vue}'],
    settings: {
      'import/resolver': {
        typescript: {},
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'] },
      },
    },
    rules: { 'import/order': 'warn' },
  },

  // Prettier
  {
    plugins: { prettier: prettierPlugin },
    files: ['**/*.{js,jsx,ts,tsx,vue,scss,css}'],
    rules: { 'prettier/prettier': 'warn' },
  },

  // Vue flat config (includes parser and recommended rules for SFCs)
  // Apply last so its parser settings win for .vue files
  ...vuePlugin.configs['flat/recommended'].map((cfg) => ({
    ...cfg,
    files: ['src/components/**/*.vue'],
    languageOptions: {
      ...(cfg.languageOptions || {}),
      parser: vueParser,
      parserOptions: {
        ...((cfg.languageOptions && cfg.languageOptions.parserOptions) || {}),
        parser: {
          ts: tsParser,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
  })),

  // Ignores
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      'logs/**',
      '*.log',
      '.vscode/**',
      '.idea/**',
      '*.sublime-*',
      '.DS_Store',
      'Thumbs.db',
      'vite.config.{js,ts,mjs,cjs}',
      'src/demo/**',
      '**/*.{scss,css}',
    ],
  },
];
