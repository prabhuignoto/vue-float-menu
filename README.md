# Vue Float Menu 🎯

<div align="center">
  <img src="./readme-assets/social-media-logo-small.png" alt="Vue Float Menu Logo" width="200">
  
  <p>A modern, draggable floating menu component for Vue 3 applications</p>

[![Build Status](https://dev.azure.com/prabhummurthy/float-menu/_apis/build/status/prabhuignoto.vue-float-menu?branchName=master)](https://dev.azure.com/prabhummurthy/float-menu/_build/latest?definitionId=9&branchName=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/a591487451582a389126/maintainability)](https://codeclimate.com/github/prabhuignoto/float-menu/maintainability)
[![DeepScan grade](https://deepscan.io/api/teams/10074/projects/13372/branches/223016/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=10074&pid=13372&bid=223016)
[![DeepSource](https://deepsource.io/gh/prabhuignoto/vue-float-menu.svg/?label=active+issues)](https://deepsource.io/gh/prabhuignoto/vue-float-menu/?ref=repository-badge)
![Snyk Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/prabhuignoto/float-menu)
![Bundle Size](https://badgen.net/bundlephobia/minzip/vue-float-menu)
[![Depfu](https://badges.depfu.com/badges/3597df88718d346a7b41f08e31fe1331/overview.svg)](https://depfu.com/github/prabhuignoto/float-menu?project_id=15010)

</div>

<div align="center">
  <img src="./readme-assets/demo.gif" alt="Vue Float Menu Demo">
</div>

## ✨ Features

- 🎯 **Drag & Drop** - Freely position your menu anywhere on screen
- 🧠 **Smart Positioning** - Automatic edge detection and menu flipping
- 🌳 **Nested Menus** - Support for complex menu hierarchies
- ⌨️ **Keyboard Accessible** - Full keyboard navigation support
- 📱 **Touch Optimized** - Enhanced mobile experience ([Touch Guide](./TOUCH_FEATURES.md))
- ⚡ **Performance** - Optimized bundle size ([Bundle Guide](./BUNDLE_OPTIMIZATION.md))
- 🎨 **Customizable** - Extensive theming options
- 🛠 **TypeScript** - Built with type safety
- 🎭 **Vue 3** - Leverages the latest Vue.js features
- 📦 **Tree-shakeable** - Only import what you need

## 📚 Table of Contents

- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Documentation](#-documentation)
  - [Props](#props)
  - [Positioning](#positioning)
  - [Menu Configuration](#menu-configuration)
  - [Styling](#styling)
  - [Events](#events)
  - [Theming](#theming)
- [Examples](#-examples)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)

## ⚡ Installation

```bash
# Using npm
npm install vue-float-menu

# Using yarn
yarn add vue-float-menu

# Using pnpm
pnpm add vue-float-menu
```

## 🚀 Quick Start

```vue
<template>
  <float-menu position="top left" :dimension="50" :menu-data="items" @select="handleSelection">
    <template #icon>
      <BoxIcon />
    </template>
  </float-menu>
</template>

<script setup>
import { FloatMenu } from 'vue-float-menu';
import 'vue-float-menu/dist/vue-float-menu.css';

const items = [
  { name: 'New' },
  {
    name: 'Edit',
    subMenu: {
      name: 'edit-items',
      items: [{ name: 'Copy' }, { name: 'Paste' }],
    },
  },
  { name: 'Open Recent' },
  { name: 'Save' },
];

const handleSelection = (selectedItem) => {
  console.log('Selected:', selectedItem);
};
</script>
```

## 📖 Documentation

### Props

| Prop             | Type      | Default                       | Description                                                               |
| ---------------- | --------- | ----------------------------- | ------------------------------------------------------------------------- |
| `dimension`      | `number`  | `50`                          | Size of menu head in pixels                                               |
| `position`       | `string`  | `'top left'`                  | Initial position (`top left`, `top right`, `bottom left`, `bottom right`) |
| `fixed`          | `boolean` | `false`                       | Disable dragging and fix position                                         |
| `menu-dimension` | `object`  | `{ width: 200, height: 300 }` | Menu dimensions                                                           |
| `menu-data`      | `array`   | `[]`                          | Menu structure data                                                       |
| `menu-style`     | `string`  | `'slide-out'`                 | Menu style (`slide-out' or `accordion`)                                   |
| `flip-on-edges`  | `boolean` | `false`                       | Auto-flip menu on screen edges                                            |
| `theme`          | `object`  | `{}`                          | Custom theme configuration                                                |

### Positioning

The menu can be positioned in four corners of the screen:

```vue
<float-menu position="bottom right">
  <template #icon>
    <BoxIcon />
  </template>
</float-menu>
```

### Menu Configuration

Configure menu dimensions and style:

```vue
<float-menu :dimension="50" :menu-dimension="{ width: 300, height: 400 }" menu-style="accordion">
  <template #icon>
    <BoxIcon />
  </template>
</float-menu>
```

### Styling

Two menu styles are available:

1. **Slide-out** (default)
2. **Accordion** (mobile-friendly)

![Accordion Style](./readme-assets/accordion.png)

### Theming

Customize the appearance with the theme prop:

```vue
<float-menu
  :theme="{
    primary: '#00539C',
    textColor: '#000',
    menuBgColor: '#fff',
    textSelectedColor: '#fff',
  }"
>
  Click
</float-menu>
```

## 🛠 Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Run linting
pnpm run lint:all

# Build package
pnpm run rollup
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Author

**Prabhu Murthy**

- Twitter: [@prabhumurthy2](https://twitter.com/prabhumurthy2)
- Email: prabhu.m.murthy@gmail.com
- Website: [prabhumurthy.com](https://www.prabhumurthy.com)
- GitHub: [@prabhuignoto](https://github.com/prabhuignoto)

---

<div align="center">
  Made with ❤️ by Prabhu Murthy
</div>
