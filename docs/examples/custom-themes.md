# Custom Themes

Style your menu with custom color schemes.

## Example

```vue
<script setup>
const darkTheme = {
  primary: '#8b5cf6',
  textColor: '#e5e7eb',
  menuBgColor: '#1f2937',
  textSelectedColor: '#ffffff',
  hoverBackground: 'rgba(139, 92, 246, 0.2)'
};

const menuItems = [
  { name: 'Dashboard' },
  { name: 'Analytics' },
  { name: 'Settings' }
];
</script>

<template>
  <float-menu
    :theme="darkTheme"
    :menu-data="menuItems"
  >
    <template #icon>☰</template>
  </float-menu>
</template>
```

## Preset Themes

### Ocean

```ts
const oceanTheme = {
  primary: '#0ea5e9',
  textColor: '#0f172a',
  menuBgColor: '#f0f9ff',
  textSelectedColor: '#ffffff'
};
```

### Forest

```ts
const forestTheme = {
  primary: '#10b981',
  textColor: '#064e3b',
  menuBgColor: '#f0fdf4',
  textSelectedColor: '#ffffff'
};
```

## Related

- [Theming Guide](/guide/theming)
- [API Props](/api/props)
