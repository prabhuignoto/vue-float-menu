# Nested Menus

Multi-level menu hierarchies with submenus.

## Example

```vue
<script setup>
import { FloatMenu } from 'vue-float-menu';

const menuItems = [
  {
    name: 'File',
    subMenu: {
      items: [
        { name: 'New' },
        {
          name: 'Recent',
          subMenu: {
            items: [
              { name: 'doc1.txt' },
              { name: 'doc2.txt' }
            ]
          }
        }
      ]
    }
  },
  {
    name: 'Edit',
    subMenu: {
      items: [
        { name: 'Cut' },
        { name: 'Copy' },
        { name: 'Paste' }
      ]
    }
  }
];
</script>

<template>
  <float-menu :menu-data="menuItems">
    <template #icon>☰</template>
  </float-menu>
</template>
```

## Features

- Two-level nesting
- File and Edit menus
- Recent files submenu
- Keyboard navigation works

## Navigation

- Click to open submenus
- Right arrow key to expand
- Left arrow key to collapse

## Related

- [Nested Menus Guide](/guide/nested-menus)
- [Menu Structure](/guide/menu-structure)
