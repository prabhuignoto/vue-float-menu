# Dividers

Visual separators for menu sections.

## Example

```vue
<script setup>
const menuItems = [
  // File operations
  { name: 'New' },
  { name: 'Open' },
  { divider: true },

  // Edit operations  
  { name: 'Cut' },
  { name: 'Copy' },
  { name: 'Paste' },
  { divider: true },

  // Application
  { name: 'Settings' },
  { name: 'Exit' }
];
</script>

<template>
  <float-menu :menu-data="menuItems">
    <template #icon>☰</template>
  </float-menu>
</template>
```

## Best Practices

1. **Group related items** - Dividers separate logical groups
2. **Don't overuse** - Too many dividers clutter the menu
3. **Consistent spacing** - Standard vertical spacing
4. **Skip in navigation** - Keyboard nav jumps over dividers

## Related

- [Menu Structure](/guide/menu-structure)
