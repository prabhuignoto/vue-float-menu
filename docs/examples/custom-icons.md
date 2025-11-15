# Custom Icons

Add custom icons to menu items.

## Example

```vue
<script setup>
const menuItems = [
  { name: 'Home', iconSlot: 'home' },
  { name: 'Settings', iconSlot: 'settings' },
  { name: 'Profile', iconSlot: 'profile' }
];
</script>

<template>
  <float-menu :menu-data="menuItems">
    <template #icon>☰</template>

    <template #home>
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    </template>

    <template #settings>
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58..."/>
      </svg>
    </template>

    <template #profile>
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z..."/>
      </svg>
    </template>
  </float-menu>
</template>
```

## Key Points

- Use `iconSlot` property
- Provide named slots
- SVG icons recommended
- 16x16px ideal size

## Related

- [Menu Structure](/guide/menu-structure)
- [Basic Usage](/guide/basic-usage)
