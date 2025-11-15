# Keyboard Navigation

Full keyboard support for accessible navigation through menus.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Arrow Down** | Move to next menu item |
| **Arrow Up** | Move to previous menu item |
| **Arrow Right** | Open submenu (if available) |
| **Arrow Left** | Close submenu / Go to parent |
| **Enter** | Select current item |
| **Escape** | Close menu |
| **Tab** | Focus menu button |

## Navigating Items

Use arrow keys to move through menu items:

```
[Down] → Next item
[Up]   → Previous item
```

Dividers and disabled items are automatically skipped.

## Opening Submenus

When focused on an item with a submenu:

```
[Right Arrow] → Opens the submenu
[Enter]       → Opens the submenu
```

## Closing Submenus

From within a submenu:

```
[Left Arrow] → Go back to parent menu
[Escape]     → Close all menus
```

## Selecting Items

```
[Enter] → Activates the current item
```

This triggers the `@select` event with the item name.

## Focus Management

The menu maintains focus state:

1. **Initial focus** - Menu gets focus when opened
2. **Visual indicator** - Focused item is highlighted
3. **Focus trap** - Focus stays within open menu
4. **Restore focus** - Returns to button when closed

## Screen Reader Support

Menu items have proper ARIA attributes:

```html
<div role="menu" aria-label="Context menu">
  <div role="menuitem" aria-setsize="5" aria-posinset="1">
    Item 1
  </div>
</div>
```

## Best Practices

1. **Test with keyboard only** - Ensure all features work
2. **Visual feedback** - Highlight focused items
3. **Logical order** - Items in natural reading order
4. **Skip disabled items** - Don't trap focus
5. **Announce changes** - Use screen reader announcements

## Next Steps

- [Accessibility](/guide/accessibility) - Full accessibility guide
- [Touch Optimizations](/guide/touch-optimizations) - Touch support
