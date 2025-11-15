# Slots

Customize menu appearance with Vue slots.

## #icon (Required)

Main menu button content.

```vue
<template>
  <float-menu :menu-data="items">
    <template #icon>
      <svg><!-- Your icon --></svg>
    </template>
  </float-menu>
</template>
```

### Examples

**Text Icon**
```vue
<template #icon>
  <span style="font-size: 24px">☰</span>
</template>
```

**SVG Icon**
```vue
<template #icon>
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
</template>
```

**Component Icon**
```vue
<script setup>
import MenuIcon from './icons/MenuIcon.vue';
</script>

<template #icon>
  <MenuIcon />
</template>
```

## Custom Item Icons

Add icons to specific menu items using named slots.

```vue
<script setup>
const menuItems = [
  { name: 'New', iconSlot: 'new-icon' },
  { name: 'Save', iconSlot: 'save-icon' }
];
</script>

<template>
  <float-menu :menu-data="menuItems">
    <template #icon>☰</template>

    <template #new-icon>
      <svg><!-- New icon --></svg>
    </template>

    <template #save-icon>
      <svg><!-- Save icon --></svg>
    </template>
  </float-menu>
</template>
```

## #content

Custom menu content (when `use-custom-content` is true).

```vue
<float-menu :use-custom-content="true">
  <template #icon>☰</template>

  <template #content>
    <div class="custom-menu">
      <h3>My Custom Menu</h3>
      <button>Action 1</button>
      <button>Action 2</button>
    </div>
  </template>
</float-menu>
```

## Slot Props

Icon slots receive no props. Menu item icon slots may receive context in future versions.

## Styling Slots

```vue
<template #icon>
  <div class="menu-icon">
    <svg class="icon">...</svg>
    <span class="label">Menu</span>
  </div>
</template>

<style scoped>
.menu-icon {
  display: flex;
  align-items: center;
  gap: 4px;
  color: white;
}

.icon {
  width: 24px;
  height: 24px;
}

.label {
  font-size: 12px;
  font-weight: 600;
}
</style>
```

## Best Practices

1. **Always provide #icon** - Required for menu button
2. **Use semantic markup** - Proper HTML structure
3. **Accessible icons** - Include aria-labels or sr-only text
4. **Consistent sizing** - Keep icons similar size
5. **SVG preferred** - Scalable and crisp

## See Also

- [Component Props](/api/props)
- [Events](/api/events)
- [Custom Icons Example](/examples/custom-icons)
