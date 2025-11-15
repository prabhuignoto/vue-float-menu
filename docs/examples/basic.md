# Basic Menu

A simple float menu with essential features.

## Example

<div class="demo-container">

```vue
<script setup>
import { FloatMenu } from 'vue-float-menu';
import 'vue-float-menu/dist/vue-float-menu.css';

const menuItems = [
  { name: 'New' },
  { name: 'Open' },
  { name: 'Save' },
  { divider: true },
  { name: 'Exit' }
];

const handleSelection = (item) => {
  alert(`You selected: ${item}`);
};
</script>

<template>
  <float-menu
    :menu-data="menuItems"
    position="top left"
    :dimension="50"
    @select="handleSelection"
  >
    <template #icon>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
      </svg>
    </template>
  </float-menu>
</template>
```

</div>

## Key Points

- Simple flat menu structure
- Icon using SVG
- Selection handler logs to console
- Positioned in top-left corner
- 50px button size

## Try It

1. Click the menu button
2. Select an item
3. See the alert message

## Related

- [Menu Structure](/guide/menu-structure)
- [Basic Usage](/guide/basic-usage)
