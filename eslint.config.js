// eslint.config.js - new format for ESLint v9+ (2025 standards)
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import vuePlugin from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

export default [
  // Apply recommended JS configurations
  js.configs.recommended,

  // Apply TypeScript configurations
  ...tseslint.configs.recommended,

  // Vue rules - disabled for now since there are parsing issues
  // {
  //   files: ['**/*.vue'],
  //   plugins: {
  //     vue: vuePlugin,
  //   },
  //   processor: vuePlugin.processors['.vue'],
  //   languageOptions: {
  //     parser: vuePlugin.parser,
  //     parserOptions: {
  //       ecmaVersion: 2025,
  //       sourceType: 'module',
  //       parser: tseslint.parser,
  //       extraFileExtensions: ['.vue'],
  //     },
  //   },
  //   rules: {
  //     'vue/multi-word-component-names': 'warn',
  //     'vue/component-name-in-template-casing': ['warn', 'PascalCase'],
  //     'vue/no-v-html': 'warn',
  //     'vue/require-default-prop': 'warn',
  //     'vue/no-unused-vars': 'warn',
  //     'vue/no-reserved-component-names': 'warn',
  //     'vue/no-use-v-if-with-v-for': 'warn',
  //     'vue/valid-v-slot': 'warn',
  //   },
  // },

  // TypeScript rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // JavaScript rules
  {
    files: ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 2025,
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off', // Turn off in JS files
    },
  },

  // Import plugin rules
  {
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {},
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
        },
      },
    },
    rules: {
      'import/order': 'warn',
    },
  },

  // Prettier integration
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'warn',
    },
  },

  // Ignore patterns (replaces .eslintignore)
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
      '**/*.vue', // Temporarily ignore Vue files until parsing issues are resolved
    ],
  },
];
