# Getting Started

Welcome to Vue Float Menu! This guide will help you get up and running quickly.

## Prerequisites

Before you begin, ensure you have:

- Node.js >= 18.18.0
- Vue 3.3.0 or higher
- Basic knowledge of Vue 3 Composition API

## Installation

Install Vue Float Menu via your preferred package manager:

::: code-group

```bash [npm]
npm install vue-float-menu
```

```bash [pnpm]
pnpm add vue-float-menu
```

```bash [yarn]
yarn add vue-float-menu
```

:::

## Basic Setup

### 1. Import the Component

In your Vue component, import the FloatMenu component and its styles:

```vue
<script setup lang="ts">
import { FloatMenu } from 'vue-float-menu';
import 'vue-float-menu/dist/vue-float-menu.css';
</script>
```

### 2. Define Menu Data

Create your menu structure using the MenuItem interface:

```vue
<script setup lang="ts">
import { FloatMenu } from 'vue-float-menu';
import 'vue-float-menu/dist/vue-float-menu.css';

const menuItems = [
  { name: 'New' },
  { name: 'Open' },
  { divider: true },
  { name: 'Save' },
];
</script>
```

### 3. Use the Component

Add the FloatMenu component to your template:

```vue
<template>
  <float-menu :menu-data="menuItems" position="top left" :dimension="50">
    <template #icon>
      <MenuIcon />
    </template>
  </float-menu>
</template>
```

## Complete Example

Here's a complete working example:

```vue
<script setup lang="ts">
import { FloatMenu } from 'vue-float-menu';
import 'vue-float-menu/dist/vue-float-menu.css';

const menuItems = [
  { name: 'New Document' },
  {
    name: 'Edit',
    subMenu: {
      items: [
        { name: 'Cut' },
        { name: 'Copy' },
        { name: 'Paste' },
      ],
    },
  },
  { divider: true },
  { name: 'Save', disabled: false },
  { name: 'Save As', disabled: false },
  { divider: true },
  { name: 'Exit' },
];

const handleSelection = (itemName: string) => {
  console.log('Selected:', itemName);
};
</script>

<template>
  <div class="app">
    <float-menu
      :menu-data="menuItems"
      position="top left"
      :dimension="50"
      @select="handleSelection"
    >
      <template #icon>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </svg>
      </template>
    </float-menu>

    <div class="content">
      <h1>My Application</h1>
      <p>Click the menu button in the top-left corner!</p>
    </div>
  </div>
</template>

<style scoped>
.app {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.content {
  padding: 2rem;
  color: white;
}
</style>
```

## Global Registration

If you want to use FloatMenu globally across your application:

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import FloatMenu from 'vue-float-menu';
import 'vue-float-menu/dist/vue-float-menu.css';

const app = createApp(App);
app.component('FloatMenu', FloatMenu);
app.mount('#app');
```

Now you can use `<float-menu>` in any component without importing it.

## TypeScript Support

Vue Float Menu is built with TypeScript. Import types for better IDE support:

```vue
<script setup lang="ts">
import { FloatMenu } from 'vue-float-menu';
import type { MenuItem, Theme } from 'vue-float-menu';

const menuItems: MenuItem[] = [
  { name: 'Item 1' },
  { name: 'Item 2' },
];

const customTheme: Theme = {
  primary: '#667eea',
  textColor: '#333',
  menuBgColor: '#fff',
  textSelectedColor: '#fff',
};
</script>
```

## Next Steps

Now that you have Vue Float Menu installed and working, explore:

- [Menu Structure](/guide/menu-structure) - Learn about creating complex menu hierarchies
- [Positioning](/guide/positioning) - Understand menu positioning options
- [Theming](/guide/theming) - Customize the appearance
- [Examples](/examples/basic) - See real-world usage examples

## Troubleshooting

### Styles not applied

Make sure you're importing the CSS file:

```ts
import 'vue-float-menu/dist/vue-float-menu.css';
```

### TypeScript errors

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "types": ["vue"]
  }
}
```

### Menu not appearing

Check that you're providing the required props:

- `menu-data`: Array of menu items
- Icon slot: Custom content for the menu button

## Getting Help

If you encounter issues:

1. Check the [API Documentation](/api/props)
2. Search [GitHub Issues](https://github.com/prabhuignoto/vue-float-menu/issues)
3. Start a [Discussion](https://github.com/prabhuignoto/vue-float-menu/discussions)
