---
layout: home

hero:
  name: Vue Float Menu
  text: Modern Floating Menu Component
  tagline: A feature-rich, draggable floating menu for Vue 3 applications with full accessibility support
  image:
    src: /hero.svg
    alt: Vue Float Menu
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/prabhuignoto/vue-float-menu

features:
  - icon: 🖱️
    title: Drag & Drop
    details: Freely position your menu anywhere on screen with smooth, responsive drag and drop functionality.

  - icon: 🧠
    title: Smart Positioning
    details: Automatic edge detection and menu flipping ensures your menu is always visible and accessible.

  - icon: 🌳
    title: Nested Menus
    details: Support for complex, multi-level menu hierarchies with smooth transitions and animations.

  - icon: ⌨️
    title: Keyboard Accessible
    details: Full keyboard navigation support with arrow keys, Enter, and Escape for seamless interaction.

  - icon: 📱
    title: Touch Optimized
    details: Enhanced mobile experience with haptic feedback, gesture recognition, and touch-friendly targets.

  - icon: ⚡
    title: High Performance
    details: Optimized bundle size, tree-shaking support, and efficient rendering for blazing-fast performance.

  - icon: 🎨
    title: Customizable
    details: Extensive theming options with CSS custom properties for easy visual customization.

  - icon: 🛠️
    title: TypeScript
    details: Built with TypeScript for robust type safety and excellent developer experience.

  - icon: 🎭
    title: Vue 3 Powered
    details: Leverages the latest Vue 3 Composition API for optimal performance and flexibility.
---

## Quick Start

```bash
npm install vue-float-menu
```

```vue
<script setup>
import { FloatMenu } from 'vue-float-menu';
import 'vue-float-menu/dist/vue-float-menu.css';

const menuItems = [
  { name: 'New' },
  { name: 'Edit', subMenu: { items: [{ name: 'Copy' }, { name: 'Paste' }] } },
  { name: 'Save' },
];
</script>

<template>
  <float-menu position="top left" :menu-data="menuItems" @select="handleSelection">
    <template #icon>
      <MenuIcon />
    </template>
  </float-menu>
</template>
```

## Why Vue Float Menu?

Vue Float Menu is designed to provide a delightful user experience with minimal setup. It combines powerful features like nested menus, keyboard navigation, and touch optimizations with a clean, intuitive API.

### Perfect for:

- 🎯 Context menus
- 📋 Action menus
- 🛠️ Tool palettes
- 🎨 Settings panels
- 📱 Mobile applications

### Built with Modern Standards

- ✅ Vue 3 Composition API
- ✅ TypeScript
- ✅ WCAG 2.1 Accessibility
- ✅ Tree-shakeable
- ✅ Modern ES6+
- ✅ Comprehensive testing

## Browser Support

Vue Float Menu supports all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Community

- 💬 [Discussions](https://github.com/prabhuignoto/vue-float-menu/discussions)
- 🐛 [Issues](https://github.com/prabhuignoto/vue-float-menu/issues)
- ⭐ [GitHub](https://github.com/prabhuignoto/vue-float-menu)

## License

[MIT](https://github.com/prabhuignoto/vue-float-menu/blob/master/LICENSE) © [Prabhu Murthy](https://www.prabhumurthy.com)
