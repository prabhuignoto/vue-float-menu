# Basic Usage

Learn the fundamentals of using Vue Float Menu in your Vue 3 application.

## Minimal Example

The simplest way to use Vue Float Menu:

```vue
<script setup>
import { FloatMenu } from 'vue-float-menu';
import 'vue-float-menu/dist/vue-float-menu.css';

const menuItems = [
  { name: 'Home' },
  { name: 'About' },
  { name: 'Contact' }
];
</script>

<template>
  <float-menu :menu-data="menuItems">
    <template #icon>
      <span>☰</span>
    </template>
  </float-menu>
</template>
```

## Component Structure

A Float Menu consists of:

1. **Menu Button** - The draggable button (via `#icon` slot)
2. **Menu Dropdown** - The list of items (from `menu-data` prop)
3. **Menu Items** - Individual clickable items

## Props Overview

### Required Props

Only one prop is truly required:

```vue
<float-menu :menu-data="items">
```

### Common Props

```vue
<float-menu
  :menu-data="items"
  position="top left"
  :dimension="50"
  @select="handleSelection"
>
```

## Handling Selection

Use the `@select` event to respond to menu item clicks:

```vue
<script setup>
const handleSelection = (itemName: string) => {
  console.log('User selected:', itemName);
  // Perform action based on selection
};
</script>

<template>
  <float-menu :menu-data="items" @select="handleSelection">
    <template #icon>☰</template>
  </float-menu>
</template>
```

## Menu Data Format

Menu items are defined as an array of objects:

```ts
const menuData = [
  {
    name: 'New File',
    disabled: false
  },
  {
    name: 'Open',
    disabled: false
  },
  {
    divider: true  // Visual separator
  },
  {
    name: 'Save',
    disabled: true  // Greyed out, not clickable
  }
];
```

## Icon Customization

### Using Text

```vue
<template #icon>
  <span style="font-size: 24px">☰</span>
</template>
```

### Using SVG

```vue
<template #icon>
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
</template>
```

### Using Components

```vue
<script setup>
import MenuIcon from './icons/MenuIcon.vue';
</script>

<template #icon>
  <MenuIcon />
</template>
```

## Positioning

Control where the menu button appears:

```vue
<!-- Top left corner -->
<float-menu position="top left" />

<!-- Top right corner -->
<float-menu position="top right" />

<!-- Bottom left corner -->
<float-menu position="bottom left" />

<!-- Bottom right corner -->
<float-menu position="bottom right" />
```

## Sizing

### Button Size

```vue
<float-menu :dimension="60">
  <!-- 60x60 pixel button -->
</float-menu>
```

### Menu Size

```vue
<float-menu
  :menu-dimension="{ width: 250, height: 400 }"
>
  <!-- 250px wide, 400px tall menu -->
</float-menu>
```

## Draggable vs Fixed

### Draggable (default)

```vue
<float-menu :menu-data="items">
  <!-- User can drag to reposition -->
</float-menu>
```

### Fixed Position

```vue
<float-menu :menu-data="items" :fixed="true">
  <!-- Locked in place, no dragging -->
</float-menu>
```

## Complete Example

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FloatMenu } from 'vue-float-menu';
import type { MenuItem } from 'vue-float-menu';
import 'vue-float-menu/dist/vue-float-menu.css';

const menuItems: MenuItem[] = [
  { name: 'New Document' },
  { name: 'Open File' },
  { divider: true },
  { name: 'Save', disabled: false },
  { name: 'Save As' },
  { divider: true },
  { name: 'Print' },
  { name: 'Exit' }
];

const handleMenuSelection = (item: string) => {
  console.log('Selected:', item);

  switch(item) {
    case 'New Document':
      createNewDocument();
      break;
    case 'Open File':
      openFileDialog();
      break;
    case 'Save':
      saveDocument();
      break;
    // ... handle other items
  }
};

function createNewDocument() {
  // Your logic here
}

function openFileDialog() {
  // Your logic here
}

function saveDocument() {
  // Your logic here
}
</script>

<template>
  <div class="app">
    <float-menu
      :menu-data="menuItems"
      position="top right"
      :dimension="55"
      :menu-dimension="{ width: 220, height: 350 }"
      @select="handleMenuSelection"
    >
      <template #icon>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
      </template>
    </float-menu>

    <main>
      <!-- Your app content -->
    </main>
  </div>
</template>

<style scoped>
.app {
  width: 100%;
  min-height: 100vh;
}
</style>
```

## Best Practices

1. **Always provide the icon slot** - The menu button needs content
2. **Use TypeScript** - Import types for better IDE support
3. **Handle selection events** - Respond to user interactions
4. **Keep menu data reactive** - Use `ref()` or `reactive()` for dynamic menus
5. **Consider accessibility** - Use semantic HTML in custom icons

## Common Patterns

### Conditional Items

```vue
<script setup>
import { computed } from 'vue';

const isLoggedIn = ref(true);

const menuItems = computed(() => {
  const items = [{ name: 'Home' }];

  if (isLoggedIn.value) {
    items.push(
      { name: 'Profile' },
      { name: 'Settings' },
      { name: 'Logout' }
    );
  } else {
    items.push({ name: 'Login' });
  }

  return items;
});
</script>
```

### Dynamic Updates

```vue
<script setup>
const menuItems = ref([
  { name: 'Item 1' }
]);

function addMenuItem() {
  menuItems.value.push({
    name: `Item ${menuItems.value.length + 1}`
  });
}
</script>
```

## Next Steps

- [Menu Structure](/guide/menu-structure) - Learn about nested menus
- [Positioning](/guide/positioning) - Advanced positioning options
- [Theming](/guide/theming) - Customize the appearance
