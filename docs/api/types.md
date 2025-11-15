# Types

TypeScript type definitions for Vue Float Menu.

## MenuItem

Represents a single menu item.

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

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | `string` | - | Display text for the item |
| `id` | `string` | auto-generated | Unique identifier |
| `disabled` | `boolean` | `false` | Whether item is disabled |
| `selected` | `boolean` | `false` | Whether item is selected |
| `divider` | `boolean` | `false` | Render as divider |
| `iconSlot` | `string` | - | Name of icon slot |
| `subMenu` | `SubMenu` | - | Nested submenu |
| `showSubMenu` | `boolean` | `false` | Internal state (auto-managed) |

### Usage

```typescript
const items: MenuItem[] = [
  { name: 'New', disabled: false },
  { divider: true },
  { name: 'Exit', disabled: false }
];
```

## Theme

Customizes visual appearance.

```typescript
interface Theme {
  primary?: string;
  textColor?: string;
  menuBgColor?: string;
  textSelectedColor?: string;
  hoverBackground?: string;
}
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `primary` | `string` | Primary accent color (CSS color value) |
| `textColor` | `string` | Menu item text color |
| `menuBgColor` | `string` | Menu background color |
| `textSelectedColor` | `string` | Selected item text color |
| `hoverBackground` | `string` | Hover state background color |

### Usage

```typescript
const theme: Theme = {
  primary: '#6366f1',
  textColor: '#374151',
  menuBgColor: '#ffffff'
};
```

## Position

Menu button position.

```typescript
type Position = 'top left' | 'top right' | 'bottom left' | 'bottom right';
```

### Usage

```typescript
const position: Position = 'top right';
```

## MenuStyle

Visual style of the menu.

```typescript
type MenuStyle = 'slide-out' | 'accordion';
```

### Usage

```typescript
const style: MenuStyle = 'accordion';
```

## FloatMenuProps

Component props interface.

```typescript
interface FloatMenuProps {
  dimension?: number;
  position?: Position;
  fixed?: boolean;
  menuDimension?: {
    width: number;
    height: number;
  };
  menuData: MenuItem[];
  menuStyle?: MenuStyle;
  flipOnEdges?: boolean;
  theme?: Theme;
  preserveMenuPosition?: boolean;
  useCustomContent?: boolean;
}
```

## Type Guards

Useful runtime type checks:

```typescript
function isMenuItem(item: unknown): item is MenuItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    ('name' in item || 'divider' in item)
  );
}

function hasSubMenu(item: MenuItem): boolean {
  return Boolean(item.subMenu?.items?.length);
}
```

## Utility Types

### MenuItemList

```typescript
type MenuItemList = MenuItem[];
```

### ThemeColors

```typescript
type ThemeColors = Required<Theme>;
```

### MenuConfig

```typescript
interface MenuConfig {
  items: MenuItem[];
  theme?: Theme;
  position?: Position;
  style?: MenuStyle;
}
```

## Import

```typescript
import type {
  MenuItem,
  Theme,
  Position,
  MenuStyle,
  FloatMenuProps
} from 'vue-float-menu';
```

## See Also

- [Component Props](/api/props)
- [TypeScript Guide](/guide/typescript)
- [Examples](/examples/basic)
