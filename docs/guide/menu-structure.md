# Menu Structure

Learn how to create complex menu hierarchies with nested submenus and organize your menu items effectively.

## Menu Item Interface

Each menu item can have the following properties:

```typescript
interface MenuItem {
  name?: string;           // Display text
  id?: string;             // Unique identifier (auto-generated if omitted)
  disabled?: boolean;      // Disable the item
  selected?: boolean;      // Mark as selected
  divider?: boolean;       // Render as divider
  iconSlot?: string;       // Custom icon slot name
  subMenu?: {              // Nested submenu
    name?: string;
    items: MenuItem[];
  };
  showSubMenu?: boolean;   // Internal state (managed automatically)
}
```

## Basic Menu

Simple flat menu structure:

```ts
const menuItems = [
  { name: 'Cut' },
  { name: 'Copy' },
  { name: 'Paste' }
];
```

## Nested Menus

Create multi-level menu hierarchies:

```ts
const menuItems = [
  { name: 'New File' },
  {
    name: 'Open Recent',
    subMenu: {
      name: 'recent-files',
      items: [
        { name: 'document-1.txt' },
        { name: 'document-2.txt' },
        { name: 'document-3.txt' }
      ]
    }
  },
  { name: 'Save' }
];
```

## Deep Nesting

You can nest menus multiple levels deep:

```ts
const menuItems = [
  {
    name: 'Settings',
    subMenu: {
      name: 'settings',
      items: [
        {
          name: 'Appearance',
          subMenu: {
            name: 'appearance',
            items: [
              {
                name: 'Theme',
                subMenu: {
                  name: 'theme',
                  items: [
                    { name: 'Light' },
                    { name: 'Dark' },
                    { name: 'Auto' }
                  ]
                }
              },
              { name: 'Font Size' }
            ]
          }
        },
        { name: 'Privacy' },
        { name: 'Security' }
      ]
    }
  }
];
```

## Dividers

Use dividers to visually separate menu sections:

```ts
const menuItems = [
  { name: 'Cut' },
  { name: 'Copy' },
  { name: 'Paste' },
  { divider: true },  // Horizontal line
  { name: 'Select All' }
];
```

## Disabled Items

Make items non-clickable:

```ts
const menuItems = [
  { name: 'Save', disabled: false },      // Enabled (default)
  { name: 'Save As', disabled: true },    // Grayed out
  { name: 'Export', disabled: true }
];
```

## Custom Icons

Assign custom icons to menu items:

```vue
<script setup>
const menuItems = [
  { name: 'New', iconSlot: 'new-icon' },
  { name: 'Open', iconSlot: 'open-icon' },
  { name: 'Save', iconSlot: 'save-icon' }
];
</script>

<template>
  <float-menu :menu-data="menuItems">
    <template #icon>☰</template>

    <!-- Custom icons for menu items -->
    <template #new-icon>
      <svg><!-- new icon --></svg>
    </template>
    <template #open-icon>
      <svg><!-- open icon --></svg>
    </template>
    <template #save-icon>
      <svg><!-- save icon --></svg>
    </template>
  </float-menu>
</template>
```

## Dynamic Menu Structure

Update menu structure reactively:

```vue
<script setup>
import { ref, computed } from 'vue';

const userRole = ref('admin');

const menuItems = computed(() => {
  const items = [
    { name: 'Dashboard' },
    { name: 'Profile' }
  ];

  if (userRole.value === 'admin') {
    items.push(
      { divider: true },
      {
        name: 'Admin',
        subMenu: {
          items: [
            { name: 'Users' },
            { name: 'Settings' },
            { name: 'Logs' }
          ]
        }
      }
    );
  }

  return items;
});
</script>
```

## Best Practices

### 1. Keep It Simple

Don't nest too deeply - 2-3 levels is usually sufficient:

```ts
// Good
const menu = [
  {
    name: 'File',
    subMenu: {
      items: [
        { name: 'New' },
        { name: 'Open' }
      ]
    }
  }
];

// Avoid (too deep)
// 5+ levels of nesting
```

### 2. Group Related Items

Use dividers to create logical groups:

```ts
const menu = [
  // File operations
  { name: 'New' },
  { name: 'Open' },
  { divider: true },

  // Edit operations
  { name: 'Cut' },
  { name: 'Copy' },
  { divider: true },

  // Application
  { name: 'Exit' }
];
```

### 3. Meaningful Names

Use clear, action-oriented names:

```ts
// Good
{ name: 'Save Document' }
{ name: 'Export as PDF' }

// Avoid
{ name: 'Do stuff' }
{ name: 'Thing' }
```

### 4. Consistent Naming

Within submenus, name them descriptively:

```ts
{
  name: 'Recent Files',
  subMenu: {
    name: 'recent-files-submenu',  // Descriptive
    items: [...]
  }
}
```

## Complex Example

A complete real-world menu structure:

```ts
const menuItems = [
  {
    name: 'File',
    iconSlot: 'file-icon',
    subMenu: {
      items: [
        { name: 'New File', iconSlot: 'new-icon' },
        {
          name: 'Open Recent',
          subMenu: {
            items: [
              { name: 'project-1.vue' },
              { name: 'project-2.vue' },
              { divider: true },
              { name: 'Clear Recent' }
            ]
          }
        },
        { divider: true },
        { name: 'Save', disabled: false },
        { name: 'Save As' },
        { divider: true },
        { name: 'Close' }
      ]
    }
  },
  {
    name: 'Edit',
    iconSlot: 'edit-icon',
    subMenu: {
      items: [
        { name: 'Undo', disabled: true },
        { name: 'Redo', disabled: true },
        { divider: true },
        { name: 'Cut' },
        { name: 'Copy' },
        { name: 'Paste' }
      ]
    }
  },
  {
    name: 'View',
    subMenu: {
      items: [
        {
          name: 'Zoom',
          subMenu: {
            items: [
              { name: 'Zoom In' },
              { name: 'Zoom Out' },
              { name: 'Reset Zoom' }
            ]
          }
        },
        { divider: true },
        { name: 'Full Screen' }
      ]
    }
  },
  { divider: true },
  { name: 'Settings', iconSlot: 'settings-icon' },
  { name: 'Help', iconSlot: 'help-icon' }
];
```

## Next Steps

- [Positioning](/guide/positioning) - Control menu placement
- [Nested Menus](/guide/nested-menus) - Advanced nesting techniques
- [Examples](/examples/nested) - See nested menus in action
