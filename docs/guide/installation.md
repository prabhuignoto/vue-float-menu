# Installation

## Package Manager Installation

Install Vue Float Menu using your preferred package manager:

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

```bash [bun]
bun add vue-float-menu
```

:::

## CDN Usage

For quick prototyping or simple projects, you can use a CDN:

```html
<!-- Vue 3 -->
<script src="https://unpkg.com/vue@3"></script>

<!-- Vue Float Menu -->
<script src="https://unpkg.com/vue-float-menu"></script>
<link rel="stylesheet" href="https://unpkg.com/vue-float-menu/dist/vue-float-menu.css">

<script>
  const { createApp } = Vue;
  const { FloatMenu } = VueFloatMenu;

  createApp({
    components: { FloatMenu },
    // your app config
  }).mount('#app');
</script>
```

## Requirements

### Peer Dependencies

Vue Float Menu requires Vue 3 as a peer dependency:

- **Vue**: `^3.3.0` or `^4.0.0-0`
- **Node.js**: `>=18.18.0` (for development)

### Browser Support

Vue Float Menu supports all modern browsers:

| Browser | Version |
|---------|---------|
| Chrome  | Latest  |
| Firefox | Latest  |
| Safari  | Latest  |
| Edge    | Latest  |

## Setup

### Import Styles

After installation, import the CSS file in your main entry point:

```ts
// main.ts or main.js
import 'vue-float-menu/dist/vue-float-menu.css';
```

Or import in your component:

```vue
<script setup>
import 'vue-float-menu/dist/vue-float-menu.css';
</script>
```

### TypeScript Support

Vue Float Menu is written in TypeScript and provides full type definitions out of the box.

No additional `@types` packages are needed.

```ts
import { FloatMenu } from 'vue-float-menu';
import type { MenuItem, Theme } from 'vue-float-menu';
```

## Verification

Create a simple test to verify the installation:

```vue
<script setup>
import { FloatMenu } from 'vue-float-menu';
import 'vue-float-menu/dist/vue-float-menu.css';

const items = [{ name: 'Test' }];
</script>

<template>
  <float-menu :menu-data="items">
    <template #icon>
      <span>☰</span>
    </template>
  </float-menu>
</template>
```

If you see a floating menu button, the installation was successful!

## Next Steps

- [Getting Started](/guide/getting-started) - Learn the basics
- [Basic Usage](/guide/basic-usage) - Start building menus
- [Examples](/examples/basic) - See practical examples
