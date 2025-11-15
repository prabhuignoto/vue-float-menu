# Nested Menus

Create multi-level menu hierarchies for complex navigation structures.

## Basic Nesting

Add a `subMenu` property to create nested menus:

```ts
const menuItems = [
  {
    name: 'File',
    subMenu: {
      name: 'file-menu',
      items: [
        { name: 'New' },
        { name: 'Open' },
        { name: 'Save' }
      ]
    }
  }
];
```

## Multiple Levels

Nest menus as deep as needed:

```ts
const menuItems = [
  {
    name: 'Edit',
    subMenu: {
      items: [
        {
          name: 'Transform',
          subMenu: {
            items: [
              { name: 'Rotate' },
              { name: 'Scale' },
              { name: 'Flip' }
            ]
          }
        }
      ]
    }
  }
];
```

## Opening Behavior

Submenus can be opened by:
- **Click** - Click the parent item
- **Hover** - Hover over the parent (if enabled)
- **Keyboard** - Press right arrow when focused

## Closing Behavior

Submenus close when:
- **Clicking outside** - Click anywhere outside the menu
- **Escape key** - Press ESC
- **Selection** - Select an item (configurable)
- **Left arrow** - Press left arrow in submenu

## Menu Styles

### Slide-out (Default)

Submenus slide out to the side:

```vue
<float-menu
  :menu-data="items"
  menu-style="slide-out"
/>
```

### Accordion

Submenus expand inline (better for mobile):

```vue
<float-menu
  :menu-data="items"
  menu-style="accordion"
/>
```

## Navigation

Keyboard navigation works across nested levels:

- **Down Arrow** - Next item
- **Up Arrow** - Previous item
- **Right Arrow** - Open submenu / go deeper
- **Left Arrow** - Close submenu / go up
- **Enter** - Select item
- **Escape** - Close all menus

## Best Practices

1. **Limit depth** - Keep to 2-3 levels maximum
2. **Group logically** - Related items together
3. **Use accordion on mobile** - Better UX for touch
4. **Clear labels** - Make parent items obvious
5. **Visual indicators** - Use chevron icons for submenus

## Next Steps

- [Keyboard Navigation](/guide/keyboard-navigation) - Navigate with keyboard
- [Examples](/examples/nested) - See nesting in action
