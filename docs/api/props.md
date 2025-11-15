# Component Props

FloatMenu component accepts the following props for configuration.

## Props Reference

### `dimension`

- **Type**: `number`
- **Default**: `50`
- **Description**: Size of the menu button/head in pixels (width and height)

```vue
<float-menu :dimension="60" />
```

### `position`

- **Type**: `string`
- **Default**: `'top left'`
- **Description**: Initial position of the menu button

**Allowed Values:**
- `'top left'`
- `'top right'`
- `'bottom left'`
- `'bottom right'`

```vue
<float-menu position="bottom right" />
```

### `fixed`

- **Type**: `boolean`
- **Default**: `false`
- **Description**: When `true`, disables dragging and fixes the menu in place

```vue
<float-menu :fixed="true" />
```

### `menu-dimension`

- **Type**: `object`
- **Default**: `{ width: 200, height: 300 }`
- **Description**: Dimensions of the menu dropdown

```vue
<float-menu :menu-dimension="{ width: 300, height: 400 }" />
```

### `menu-data`

- **Type**: `MenuItem[]`
- **Default**: `[]`
- **Required**: Yes
- **Description**: Array of menu items to display

```vue
<script setup>
const menuItems = [
  { name: 'Item 1' },
  { name: 'Item 2', subMenu: { items: [...] } },
  { divider: true },
];
</script>

<template>
  <float-menu :menu-data="menuItems" />
</template>
```

### `menu-style`

- **Type**: `string`
- **Default**: `'slide-out'`
- **Description**: Visual style of the menu

**Allowed Values:**
- `'slide-out'` - Menu slides out from the button
- `'accordion'` - Accordion-style expansion (mobile-friendly)

```vue
<float-menu menu-style="accordion" />
```

### `flip-on-edges`

- **Type**: `boolean`
- **Default**: `false`
- **Description**: When `true`, automatically flips menu orientation when near screen edges

```vue
<float-menu :flip-on-edges="true" />
```

### `theme`

- **Type**: `Theme`
- **Default**: `{}` (uses default indigo theme)
- **Description**: Custom theme configuration

```vue
<script setup>
const customTheme = {
  primary: '#00539C',
  textColor: '#000',
  menuBgColor: '#fff',
  textSelectedColor: '#fff',
  hoverBackground: 'rgba(0, 83, 156, 0.1)',
};
</script>

<template>
  <float-menu :theme="customTheme" />
</template>
```

### `preserve-menu-position`

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Maintains menu position after drag (persists in memory, not localStorage)

```vue
<float-menu :preserve-menu-position="true" />
```

### `use-custom-content`

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Allows using custom content instead of menu items

```vue
<float-menu :use-custom-content="true">
  <template #content>
    <div>Custom menu content</div>
  </template>
</float-menu>
```

## MenuItem Interface

The `menu-data` prop accepts an array of items with this structure:

```typescript
interface MenuItem {
  name?: string;
  id?: string;
  disabled?: boolean;
  selected?: boolean;
  divider?: boolean;
  iconSlot?: string;
  subMenu?: {
    items: MenuItem[];
    name?: string;
  };
  showSubMenu?: boolean;
}
```

### Properties

#### `name`
- **Type**: `string`
- **Description**: Display name of the menu item

#### `id`
- **Type**: `string`
- **Description**: Unique identifier (auto-generated if not provided)

#### `disabled`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Disables the menu item

#### `selected`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Marks item as selected

#### `divider`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Renders a visual divider instead of a menu item

#### `iconSlot`
- **Type**: `string`
- **Description**: Name of the slot to use for custom icon

#### `subMenu`
- **Type**: `{ items: MenuItem[], name?: string }`
- **Description**: Nested submenu configuration

## Theme Interface

```typescript
interface Theme {
  primary?: string;
  textColor?: string;
  menuBgColor?: string;
  textSelectedColor?: string;
  hoverBackground?: string;
}
```

### Default Theme

```typescript
const defaultTheme = {
  primary: '#6366f1',        // Indigo-500
  textColor: '#374151',      // Gray-700
  menuBgColor: '#ffffff',    // White
  textSelectedColor: '#ffffff',
  hoverBackground: 'rgba(99, 102, 241, 0.1)',
};
```

## Examples

### Complete Configuration

```vue
<script setup lang="ts">
import { FloatMenu } from 'vue-float-menu';
import type { MenuItem, Theme } from 'vue-float-menu';

const menuItems: MenuItem[] = [
  { name: 'New', iconSlot: 'new' },
  {
    name: 'Edit',
    iconSlot: 'edit',
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
];

const theme: Theme = {
  primary: '#8b5cf6',
  textColor: '#1f2937',
  menuBgColor: 'rgba(255, 255, 255, 0.95)',
  textSelectedColor: '#ffffff',
};

const handleSelect = (name: string) => {
  console.log('Selected:', name);
};
</script>

<template>
  <float-menu
    :dimension="60"
    position="top right"
    :menu-dimension="{ width: 250, height: 350 }"
    :menu-data="menuItems"
    menu-style="slide-out"
    :flip-on-edges="true"
    :theme="theme"
    :preserve-menu-position="true"
    @select="handleSelect"
  >
    <template #icon>
      <MenuIcon />
    </template>
  </float-menu>
</template>
```
