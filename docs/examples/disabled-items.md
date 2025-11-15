# Disabled Items

Make menu items non-interactive.

## Example

```vue
<script setup>
const menuItems = [
  { name: 'New File', disabled: false },
  { name: 'Save', disabled: true },     // Grayed out
  { name: 'Save As', disabled: true },
  { divider: true },
  { name: 'Exit', disabled: false }
];
</script>

<template>
  <float-menu :menu-data="menuItems">
    <template #icon>☰</template>
  </float-menu>
</template>
```

## Conditional Disabling

```vue
<script setup>
import { ref, computed } from 'vue';

const hasUnsavedChanges = ref(false);

const menuItems = computed(() => [
  { name: 'Save', disabled: !hasUnsavedChanges.value },
  { name: 'Discard', disabled: !hasUnsavedChanges.value }
]);
</script>
```

## Visual State

Disabled items:
- Grayed out text
- No hover effect
- Cannot be clicked
- Skipped in keyboard navigation

## Related

- [Menu Structure](/guide/menu-structure)
