# Accessibility

Vue Float Menu is built with WCAG 2.1 Level AA compliance in mind.

## Keyboard Support

Full keyboard navigation without requiring a mouse:

- All functionality accessible via keyboard
- Logical tab order
- Clear focus indicators
- Arrow key navigation through menu items

See [Keyboard Navigation](/guide/keyboard-navigation) for details.

## Screen Reader Support

### ARIA Attributes

Proper semantic markup for assistive technologies:

```html
<div role="menu" aria-label="Context menu" aria-orientation="vertical">
  <div role="menuitem" aria-setsize="5" aria-posinset="1">
    Menu Item
  </div>
</div>
```

### Live Regions

Announces changes to screen readers:

```ts
// Selection announcement
announcement.setAttribute('aria-live', 'polite');
announcement.textContent = `Selected ${itemName}`;
```

### Submenu Attributes

```html
<div role="menuitem" aria-haspopup="menu" aria-expanded="false">
  Settings
</div>
```

## Color Contrast

Meets WCAG AA contrast requirements:

- **Normal text** - Minimum 4.5:1 ratio
- **Large text** - Minimum 3:1 ratio
- **UI components** - Minimum 3:1 ratio

## Focus Management

### Visible Focus Indicators

```css
:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}
```

### Focus Trap

When menu is open:
1. Focus enters menu
2. Tab cycles within menu
3. Escape returns focus to button

## Touch Targets

All interactive elements meet size requirements:

- **Minimum size** - 44x44 pixels
- **Adequate spacing** - Between targets
- **Touch feedback** - Visual and haptic

## Motion & Animation

### Reduced Motion

Respects user preferences:

```ts
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Disable animations if preferred
const animationDuration = prefersReducedMotion ? 0 : 300;
```

```vue
<float-menu :menu-data="items" />
<!-- Automatically respects prefers-reduced-motion -->
```

## High Contrast Mode

Support for high contrast themes:

```css
@media (prefers-contrast: high) {
  .menu-item {
    border: 2px solid currentColor;
  }
}
```

## Semantic HTML

Uses appropriate semantic elements:

```html
<button role="button" aria-label="Open menu">
  Menu
</button>

<ul role="menu">
  <li role="menuitem">Item 1</li>
  <li role="menuitem">Item 2</li>
</ul>
```

## Testing Tools

### Automated Testing

- **axe DevTools** - Browser extension
- **WAVE** - Web accessibility evaluation
- **Lighthouse** - Built into Chrome DevTools

### Screen Readers

Test with actual screen readers:

- **NVDA** - Windows (free)
- **JAWS** - Windows (commercial)
- **VoiceOver** - macOS/iOS (built-in)
- **TalkBack** - Android (built-in)

### Keyboard Testing

1. Unplug mouse
2. Navigate entire app with keyboard only
3. Ensure all features work
4. Check focus is always visible

## Best Practices

1. **Test early and often** - Don't wait until end
2. **Use real assistive tech** - Not just automated tools
3. **Include users with disabilities** - In testing
4. **Provide alternatives** - Multiple ways to interact
5. **Keep updated** - WCAG guidelines evolve

## Common Issues to Avoid

### ❌ Don't

```vue
<!-- Missing ARIA labels -->
<button @click="openMenu"></button>

<!-- Inaccessible icons -->
<div>☰</div>

<!-- Hidden from screen readers -->
<span aria-hidden="true">Important info</span>
```

### ✅ Do

```vue
<!-- Proper labels -->
<button @click="openMenu" aria-label="Open menu">
  <MenuIcon aria-hidden="true" />
</button>

<!-- Semantic markup -->
<button>
  <span aria-hidden="true">☰</span>
  <span class="sr-only">Menu</span>
</button>
```

## WCAG Checklist

- ✅ **1.1.1** - Non-text content has alternatives
- ✅ **1.4.3** - Minimum contrast ratios met
- ✅ **2.1.1** - Keyboard accessible
- ✅ **2.1.2** - No keyboard trap
- ✅ **2.4.7** - Focus visible
- ✅ **3.2.1** - On focus, no surprise changes
- ✅ **4.1.2** - Name, role, value available

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)
- [The A11Y Project](https://www.a11yproject.com/)

## Next Steps

- [Keyboard Navigation](/guide/keyboard-navigation) - Keyboard support
- [Touch Optimizations](/guide/touch-optimizations) - Touch accessibility
