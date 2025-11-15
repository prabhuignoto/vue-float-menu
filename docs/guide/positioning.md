# Positioning

Control where your float menu appears and how it behaves near screen edges.

## Initial Position

Set the starting position of the menu button:

```vue
<float-menu position="top left" />
<float-menu position="top right" />
<float-menu position="bottom left" />
<float-menu position="bottom right" />
```

## Position Values

| Value | Description |
|-------|-------------|
| `"top left"` | Top-left corner of screen |
| `"top right"` | Top-right corner of screen |
| `"bottom left"` | Bottom-left corner of screen |
| `"bottom right"` | Bottom-right corner of screen |

## Edge Flipping

Enable automatic menu orientation flipping when near edges:

```vue
<float-menu
  :menu-data="items"
  :flip-on-edges="true"
>
```

### How It Works

When `flip-on-edges` is enabled:

- Menu opens **left** if button is near right edge
- Menu opens **right** if button is near left edge
- Menu opens **up** if button is near bottom edge
- Menu opens **down** if button is near top edge

This ensures the menu always remains visible within the viewport.

## Fixed vs Draggable

### Draggable (Default)

User can drag the button anywhere:

```vue
<float-menu :menu-data="items" />
```

### Fixed Position

Lock the button in place:

```vue
<float-menu :menu-data="items" :fixed="true" />
```

## Preserve Position

Maintain button position after dragging:

```vue
<float-menu
  :menu-data="items"
  :preserve-menu-position="true"
>
```

::: warning
Position is preserved in memory only, not in localStorage. Position resets on page reload.
:::

## Menu Offset

The menu opens relative to the button with built-in spacing. The offset is calculated automatically based on:

- Button size (`dimension` prop)
- Menu position
- Screen edges

## Responsive Behavior

The menu automatically adjusts its position on smaller screens to stay within viewport bounds.

### Mobile Considerations

On mobile devices:

- Menu may switch to accordion style for better UX
- Touch targets are automatically enlarged (44px minimum)
- Swipe gestures work for closing

## Custom Positioning Examples

### Always Top-Right

```vue
<float-menu
  position="top right"
  :fixed="true"
>
```

### User Draggable with Edge Awareness

```vue
<float-menu
  position="bottom left"
  :flip-on-edges="true"
  :preserve-menu-position="true"
>
```

### Centered (via CSS)

While there's no "center" position prop, you can use CSS:

```vue
<template>
  <div class="menu-container">
    <float-menu
      :fixed="true"
      :menu-data="items"
    />
  </div>
</template>

<style>
.menu-container :deep(.float-menu-head-wrapper) {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
```

## Z-Index Management

The menu uses appropriate z-index values to stay on top:

```scss
.float-menu-head-wrapper {
  z-index: 1000;
}

.menu-wrapper {
  z-index: 1001;
}
```

Override if needed:

```vue
<style>
:deep(.float-menu-head-wrapper) {
  z-index: 9999;
}
</style>
```

## Multiple Menus

When using multiple float menus, position them in different corners:

```vue
<template>
  <float-menu position="top left" :menu-data="fileMenu" />
  <float-menu position="top right" :menu-data="settingsMenu" />
  <float-menu position="bottom left" :menu-data="helpMenu" />
</template>
```

## Best Practices

1. **Use edge flipping** on draggable menus to prevent overflow
2. **Fix position** for consistent app navigation
3. **Different corners** for multiple menus
4. **Consider mobile** - test on small screens
5. **Don't overlap** - ensure menus don't cover critical UI

## Next Steps

- [Menu Structure](/guide/menu-structure) - Organize your items
- [Theming](/guide/theming) - Style your menu
- [Examples](/examples/edge-flipping) - See edge flipping in action
