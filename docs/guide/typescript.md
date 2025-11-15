# TypeScript

Vue Float Menu is built with TypeScript and provides full type definitions.

## Type Imports

Import types from the package:

```ts
import type { MenuItem, Theme, Position, FloatMenuProps } from 'vue-float-menu';
```

## MenuItem Interface

```typescript
interface MenuItem {
  name?: string;
  id?: string;
  disabled?: boolean;
  selected?: boolean;
  divider?: boolean;
  iconSlot?: string;
  subMenu?: {
    name?: string;
    items: MenuItem[];
  };
  showSubMenu?: boolean;
}
```

### Usage

```ts
const menuItems: MenuItem[] = [
  {
    name: 'File',
    subMenu: {
      name: 'file-menu',
      items: [
        { name: 'New' },
        { name: 'Open' }
      ]
    }
  }
];
```

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

### Usage

```ts
const customTheme: Theme = {
  primary: '#6366f1',
  textColor: '#1f2937',
  menuBgColor: '#ffffff',
};
```

## Position Type

```typescript
type Position = 'top left' | 'top right' | 'bottom left' | 'bottom right';
```

### Usage

```ts
const menuPosition: Position = 'top right';
```

## Component Props

```typescript
interface FloatMenuProps {
  dimension?: number;
  position?: Position;
  fixed?: boolean;
  menuDimension?: { width: number; height: number };
  menuData: MenuItem[];
  menuStyle?: 'slide-out' | 'accordion';
  flipOnEdges?: boolean;
  theme?: Theme;
  preserveMenuPosition?: boolean;
  useCustomContent?: boolean;
}
```

## Generic Component

Type the component in your setup:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FloatMenu } from 'vue-float-menu';
import type { MenuItem } from 'vue-float-menu';

const menuItems = ref<MenuItem[]>([
  { name: 'Item 1' },
  { name: 'Item 2' }
]);

const handleSelection = (item: string): void => {
  console.log('Selected:', item);
};
</script>

<template>
  <float-menu
    :menu-data="menuItems"
    @select="handleSelection"
  >
    <template #icon>☰</template>
  </float-menu>
</template>
```

## Strict Type Checking

Enable strict mode in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

## Event Handlers

Type your event handlers:

```ts
const handleSelect = (itemName: string): void => {
  // Handle selection
};

const handleClose = (): void => {
  // Handle close
};
```

## Utility Types

Create reusable types:

```ts
type MenuConfig = {
  items: MenuItem[];
  theme: Theme;
  position: Position;
};

const appMenuConfig: MenuConfig = {
  items: [{ name: 'Home' }],
  theme: { primary: '#6366f1' },
  position: 'top left'
};
```

## Type Guards

Check types at runtime:

```ts
function isMenuItem(item: unknown): item is MenuItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    'name' in item
  );
}

if (isMenuItem(data)) {
  console.log(data.name); // TypeScript knows data is MenuItem
}
```

## Generics

Type-safe menu builders:

```ts
function createMenu<T extends MenuItem>(
  items: T[],
  transformer: (item: T) => MenuItem
): MenuItem[] {
  return items.map(transformer);
}
```

## Next Steps

- [API Reference](/api/types) - Full type documentation
- [Examples](/examples/basic) - TypeScript examples
