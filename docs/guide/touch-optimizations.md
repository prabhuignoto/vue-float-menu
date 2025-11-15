# Touch Optimizations

Enhanced touch support for mobile and tablet devices.

For comprehensive details, see [TOUCH_FEATURES.md](https://github.com/prabhuignoto/vue-float-menu/blob/master/TOUCH_FEATURES.md) in the repository.

## Overview

Vue Float Menu includes built-in touch optimizations:

- **Touch detection** - Automatically detects touch devices
- **Gesture recognition** - Tap, long press, swipe gestures  
- **Haptic feedback** - Vibration feedback on supported devices
- **Touch targets** - Minimum 44px touch targets for accessibility
- **Swipe to close** - Swipe up/down to dismiss menu

## Touch Gestures

### Tap

Single tap opens/closes the menu:

```ts
// Triggers on quick tap
triggerHapticFeedback('light');
```

### Long Press

Long press (500ms) activates alternative actions:

```ts
// Triggers after 500ms hold
triggerHapticFeedback('medium');
```

### Swipe

Swipe gestures close the menu:

- **Swipe Up** - Close menu
- **Swipe Down** - Close menu
- **Configurable thresholds** - Distance and velocity

## Haptic Feedback

Tactile feedback enhances touch interactions:

```ts
// Light feedback - menu item selection
triggerHapticFeedback('light');

// Medium feedback - long press
triggerHapticFeedback('medium');

// Heavy feedback - important actions
triggerHapticFeedback('heavy');
```

::: info
Haptic feedback requires:
- Device with vibration support
- User permission for vibration
- HTTPS connection (on some browsers)
:::

## Touch Target Sizing

All interactive elements meet WCAG 2.1 requirements:

- **Minimum size** - 44x44 pixels
- **Adequate spacing** - Between touch targets
- **Visual feedback** - On touch/press states

## Mobile-Specific Features

### Accordion Style

Better for mobile devices:

```vue
<float-menu
  :menu-data="items"
  menu-style="accordion"
/>
```

### Responsive Dimensions

Adjust sizing for mobile:

```vue
<script setup>
import { ref, onMounted } from 'vue';

const isMobile = ref(false);

onMounted(() => {
  isMobile.value = window.innerWidth < 768;
});

const dimension = computed(() => 
  isMobile.value ? 60 : 50
);
</script>

<template>
  <float-menu :dimension="dimension" />
</template>
```

## Performance

Touch optimizations include:

- **Throttled events** - Prevents excessive firing
- **Debounced gestures** - Smooth recognition
- **Memory management** - Efficient cleanup

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Touch Events | ✅ | ✅ | ✅ | ✅ |
| Haptic Feedback | ✅ | ❌ | ✅ | ✅ |
| Pointer Events | ✅ | ✅ | ✅ | ✅ |

## Testing

Test on actual devices:

1. **iOS devices** - iPhone, iPad
2. **Android devices** - Various manufacturers
3. **Tablets** - Both orientations
4. **Touch laptops** - Windows/Chromebook

## Best Practices

1. **Test on real devices** - Simulators don't show everything
2. **Provide alternatives** - Don't rely only on gestures
3. **Visual feedback** - Show touch states clearly
4. **Consider ergonomics** - Place menus in reach
5. **Avoid small targets** - Keep 44px minimum

## Next Steps

- [Accessibility](/guide/accessibility) - Inclusive design
- [Examples](/examples/basic) - Touch-friendly examples
