# Theming

Customize the visual appearance of your float menu with built-in theming support.

## Theme Interface

```typescript
interface Theme {
  primary?: string;           // Primary accent color
  textColor?: string;         // Menu item text color
  menuBgColor?: string;       // Menu background color
  textSelectedColor?: string; // Selected item text color
  hoverBackground?: string;   // Hover state background
}
```

## Default Theme

```ts
const defaultTheme = {
  primary: '#6366f1',              // Indigo-500
  textColor: '#374151',            // Gray-700
  menuBgColor: '#ffffff',          // White
  textSelectedColor: '#ffffff',    // White
  hoverBackground: 'rgba(99, 102, 241, 0.1)', // Light indigo
};
```

## Custom Theme

Apply a custom theme using the `theme` prop:

```vue
<script setup>
const customTheme = {
  primary: '#ef4444',              // Red
  textColor: '#1f2937',            // Dark gray
  menuBgColor: '#f9fafb',          // Light gray
  textSelectedColor: '#ffffff',    // White
  hoverBackground: 'rgba(239, 68, 68, 0.1)', // Light red
};
</script>

<template>
  <float-menu :theme="customTheme" :menu-data="items">
    <template #icon>☰</template>
  </float-menu>
</template>
```

## Preset Themes

### Dark Theme

```ts
const darkTheme = {
  primary: '#8b5cf6',
  textColor: '#e5e7eb',
  menuBgColor: '#1f2937',
  textSelectedColor: '#ffffff',
  hoverBackground: 'rgba(139, 92, 246, 0.2)',
};
```

### Ocean Theme

```ts
const oceanTheme = {
  primary: '#0ea5e9',
  textColor: '#0f172a',
  menuBgColor: '#f0f9ff',
  textSelectedColor: '#ffffff',
  hoverBackground: 'rgba(14, 165, 233, 0.1)',
};
```

### Forest Theme

```ts
const forestTheme = {
  primary: '#10b981',
  textColor: '#064e3b',
  menuBgColor: '#f0fdf4',
  textSelectedColor: '#ffffff',
  hoverBackground: 'rgba(16, 185, 129, 0.1)',
};
```

### Sunset Theme

```ts
const sunsetTheme = {
  primary: '#f59e0b',
  textColor: '#78350f',
  menuBgColor: '#fffbeb',
  textSelectedColor: '#ffffff',
  hoverBackground: 'rgba(245, 158, 11, 0.1)',
};
```

## Dynamic Theming

Switch themes dynamically:

```vue
<script setup>
import { ref } from 'vue';

const currentTheme = ref('light');

const themes = {
  light: {
    primary: '#6366f1',
    textColor: '#374151',
    menuBgColor: '#ffffff',
    textSelectedColor: '#ffffff',
  },
  dark: {
    primary: '#8b5cf6',
    textColor: '#e5e7eb',
    menuBgColor: '#1f2937',
    textSelectedColor: '#ffffff',
  }
};

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
};
</script>

<template>
  <button @click="toggleTheme">Toggle Theme</button>

  <float-menu
    :theme="themes[currentTheme]"
    :menu-data="items"
  >
    <template #icon>☰</template>
  </float-menu>
</template>
```

## CSS Custom Properties

The theme is applied using CSS custom properties:

```css
--background: /* primary */
--menu-background: /* menuBgColor */
--menu-text-color: /* textColor */
--selected-text-color: /* textSelectedColor */
--hover-background: /* hoverBackground */
```

## Advanced Customization

### Override Specific Styles

```vue
<style scoped>
:deep(.menu-list-item) {
  font-weight: 600;
  letter-spacing: 0.5px;
}

:deep(.menu-list-item:hover) {
  transform: translateX(4px);
  transition: transform 0.2s;
}
</style>
```

### Custom Menu Button

```vue
<template>
  <float-menu :theme="customTheme" :menu-data="items">
    <template #icon>
      <div class="custom-button">
        <span class="hamburger"></span>
        <span class="text">Menu</span>
      </div>
    </template>
  </float-menu>
</template>

<style scoped>
.custom-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  color: white;
}
</style>
```

## Glassmorphism Effect

```ts
const glassTheme = {
  primary: '#8b5cf6',
  textColor: '#1f2937',
  menuBgColor: 'rgba(255, 255, 255, 0.7)',
  textSelectedColor: '#ffffff',
  hoverBackground: 'rgba(139, 92, 246, 0.15)',
};
```

```vue
<style>
:deep(.menu-wrapper) {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
</style>
```

## Brand Color Integration

Match your application's brand:

```vue
<script setup>
// Import from your design system
import { colors } from '@/design-system';

const brandTheme = {
  primary: colors.brand.primary,
  textColor: colors.text.primary,
  menuBgColor: colors.background.surface,
  textSelectedColor: colors.text.inverse,
  hoverBackground: colors.brand.primaryLight,
};
</script>
```

## Accessibility Considerations

### Contrast Ratios

Ensure sufficient contrast for readability:

```ts
// Good contrast
const accessibleTheme = {
  primary: '#0066cc',
  textColor: '#1a1a1a',
  menuBgColor: '#ffffff',
  textSelectedColor: '#ffffff',
};

// Poor contrast (avoid)
const poorTheme = {
  textColor: '#cccccc',
  menuBgColor: '#d0d0d0',
};
```

### High Contrast Mode

Support system high contrast mode:

```vue
<style>
@media (prefers-contrast: high) {
  :deep(.menu-list-item) {
    border: 2px solid currentColor;
  }
}
</style>
```

## Responsive Theming

Adjust theme based on screen size:

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isMobile = ref(false);

const desktopTheme = {
  primary: '#6366f1',
  menuBgColor: '#ffffff',
};

const mobileTheme = {
  primary: '#8b5cf6',
  menuBgColor: '#f9fafb',
};

const theme = computed(() =>
  isMobile.value ? mobileTheme : desktopTheme
);

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768;
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);
  onUnmounted(() => window.removeEventListener('resize', checkMobile));
});
</script>
```

## Best Practices

1. **Maintain contrast** - Ensure text is readable
2. **Test in dark mode** - Verify appearance in both modes
3. **Use semantic colors** - Primary for actions, gray for text
4. **Consistent hover states** - Make interactive elements obvious
5. **Brand alignment** - Match your application's visual language

## Next Steps

- [Accessibility](/guide/accessibility) - Ensure inclusive design
- [Examples](/examples/custom-themes) - See theme examples
- [TypeScript](/guide/typescript) - Type-safe theming
