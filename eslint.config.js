// eslint.config.js - new format for ESLint v9+ (2025 standards)
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import vuePlugin from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

export default [
  // Vue flat config (includes parser and recommended rules for SFCs)
  // Restrict to src/components to avoid demo parsing issues for now
  {
    ...vuePlugin.configs['flat/recommended'][0],
    files: ['src/components/**/*.vue'],
  },

  // JS/TS base
  js.configs.recommended,
  ...tseslint.configs.recommended,

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
    settings: {
      'import/resolver': {
        typescript: {},
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'] },
      },
    },
    rules: { 'import/order': 'warn' },
  },

  // Prettier
  { plugins: { prettier: prettierPlugin }, rules: { 'prettier/prettier': 'warn' } },

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
    ],
  },
];
