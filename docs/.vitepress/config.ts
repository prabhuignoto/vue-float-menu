import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Vue Float Menu',
  description: 'A modern, draggable floating menu component for Vue 3 applications',
  base: '/vue-float-menu/',

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Examples', link: '/examples/basic' },
      { text: 'API', link: '/api/props' },
      { text: 'GitHub', link: 'https://github.com/prabhuignoto/vue-float-menu' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is Vue Float Menu?', link: '/guide/introduction' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
          ],
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Basic Usage', link: '/guide/basic-usage' },
            { text: 'Menu Structure', link: '/guide/menu-structure' },
            { text: 'Positioning', link: '/guide/positioning' },
            { text: 'Theming', link: '/guide/theming' },
          ],
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Nested Menus', link: '/guide/nested-menus' },
            { text: 'Keyboard Navigation', link: '/guide/keyboard-navigation' },
            { text: 'Touch Optimizations', link: '/guide/touch-optimizations' },
            { text: 'Accessibility', link: '/guide/accessibility' },
            { text: 'TypeScript', link: '/guide/typescript' },
          ],
        },
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Basic Menu', link: '/examples/basic' },
            { text: 'Nested Menus', link: '/examples/nested' },
            { text: 'Custom Icons', link: '/examples/custom-icons' },
            { text: 'Custom Themes', link: '/examples/custom-themes' },
            { text: 'Menu Styles', link: '/examples/menu-styles' },
            { text: 'Disabled Items', link: '/examples/disabled-items' },
            { text: 'Dividers', link: '/examples/dividers' },
            { text: 'Edge Flipping', link: '/examples/edge-flipping' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Component Props', link: '/api/props' },
            { text: 'Events', link: '/api/events' },
            { text: 'Slots', link: '/api/slots' },
            { text: 'Types', link: '/api/types' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/prabhuignoto/vue-float-menu' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present Prabhu Murthy',
    },

    search: {
      provider: 'local',
    },

    editLink: {
      pattern: 'https://github.com/prabhuignoto/vue-float-menu/edit/master/docs/:path',
      text: 'Edit this page on GitHub',
    },
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#667eea' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:title', content: 'Vue Float Menu' }],
    ['meta', { name: 'og:description', content: 'A modern, draggable floating menu component for Vue 3' }],
  ],

  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },
});
