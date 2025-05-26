# Touch Optimizations Guide

This document provides a comprehensive guide to the touch optimization features in Vue Float Menu.

## Overview

Vue Float Menu includes advanced touch optimizations designed specifically for mobile and touch-enabled devices. These features enhance the user experience on smartphones, tablets, and touch-enabled desktop devices.

## Features

### 1. Touch Device Detection

The menu automatically detects touch-capable devices and applies appropriate optimizations:

```javascript
const { isTouchDevice } = useTouchOptimizations();
```

### 2. Gesture Recognition

#### Tap Detection

- **Single Tap**: Normal menu activation
- **Long Press**: Alternative menu activation with haptic feedback
- **Touch Target Size**: Minimum 44px touch targets for accessibility

#### Swipe Gestures

- **Swipe Up/Down**: Close the menu when active
- **Swipe Detection**: Configurable distance and velocity thresholds

### 3. Haptic Feedback

Enhanced tactile feedback for touch interactions:

```javascript
// Light feedback for simple interactions
triggerHapticFeedback('light');

// Medium feedback for long press
triggerHapticFeedback('medium');

// Heavy feedback for important actions
triggerHapticFeedback('heavy');
```

#### Feedback Types:

- **Light**: Menu item selection, simple taps
- **Medium**: Long press activation, submenu opening
- **Heavy**: Error states, important confirmations

### 4. Enhanced Accessibility

Touch-specific accessibility improvements:

- **Touch Target Sizing**: Ensures minimum 44px touch targets
- **Focus Management**: Enhanced keyboard and touch navigation
- **Screen Reader Support**: Proper ARIA attributes for touch interactions
- **High Contrast**: Improved visual feedback for touch states

### 5. Performance Optimizations

Touch-specific performance enhancements:

- **Throttled Touch Events**: Prevents excessive event firing
- **Gesture Debouncing**: Smooth gesture recognition
- **Memory Management**: Efficient touch event cleanup

## Usage

### Basic Integration

The touch optimizations are automatically enabled when touch devices are detected:

```vue
<template>
  <float-menu :menu-data="menuItems" :dimension="50" position="bottom right">
    <template #icon>
      <MenuIcon />
    </template>
  </float-menu>
</template>
```

### Advanced Configuration

For custom touch behavior, access the touch composable directly:

```javascript
import { useTouchOptimizations } from './composables/useTouchOptimizations';

export default {
  setup() {
    const {
      isTouchDevice,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      triggerHapticFeedback,
      getSwipeDirection,
    } = useTouchOptimizations();

    return {
      isTouchDevice,
      // ... other exports
    };
  },
};
```

### Custom Touch Handlers

Implement custom touch event handling:

```javascript
const handleCustomTouch = (event) => {
  handleTouchStart(event, (touchEvent) => {
    switch (touchEvent.type) {
      case 'tap':
        // Handle tap
        break;
      case 'longpress':
        // Handle long press
        triggerHapticFeedback('medium');
        break;
      case 'swipe':
        // Handle swipe
        const direction = getSwipeDirection();
        if (direction) {
          console.log('Swipe direction:', direction.direction);
        }
        break;
    }
  });
};
```

## Configuration Options

### Touch Event Thresholds

```typescript
interface TouchEventConfig {
  longPressThreshold: number; // Default: 500ms
  swipeThreshold: number; // Default: 50px
  velocityThreshold: number; // Default: 0.5px/ms
  touchTargetSize: number; // Default: 44px
}
```

### Haptic Feedback Settings

```typescript
interface HapticConfig {
  enabled: boolean; // Default: true
  lightIntensity: number; // Default: 0.1
  mediumIntensity: number; // Default: 0.5
  heavyIntensity: number; // Default: 1.0
}
```

## Browser Support

| Feature           | Chrome | Firefox | Safari | Edge |
| ----------------- | ------ | ------- | ------ | ---- |
| Touch Events      | ✅     | ✅      | ✅     | ✅   |
| Haptic Feedback   | ✅     | ❌      | ✅     | ✅   |
| Pointer Events    | ✅     | ✅      | ✅     | ✅   |
| Touch Target Size | ✅     | ✅      | ✅     | ✅   |

## Best Practices

### 1. Touch Target Sizing

- Ensure all interactive elements are at least 44px in both dimensions
- Provide adequate spacing between touch targets

### 2. Gesture Feedback

- Always provide immediate visual feedback for touch interactions
- Use haptic feedback sparingly and meaningfully

### 3. Accessibility

- Test with assistive technologies on touch devices
- Ensure all functionality is available without gestures

### 4. Performance

- Throttle touch event handlers to maintain smooth interactions
- Clean up event listeners properly to prevent memory leaks

## Examples

### Example 1: Basic Touch Menu

```vue
<template>
  <float-menu :menu-data="menuItems" :dimension="60" position="bottom right" flip-on-edges>
    <template #icon>
      <TouchIcon />
    </template>
  </float-menu>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        { name: 'Touch Action 1', action: 'tap' },
        { name: 'Long Press Action', action: 'longpress' },
        { name: 'Swipe Action', action: 'swipe' },
      ],
    };
  },
};
</script>
```

### Example 2: Custom Touch Handling

```vue
<template>
  <div
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    @touchmove="handleTouchMove"
    class="custom-touch-area"
  >
    Custom Touch Area
  </div>
</template>

<script>
import { useTouchOptimizations } from '@/composables/useTouchOptimizations';

export default {
  setup() {
    const {
      handleTouchStart: startHandler,
      handleTouchEnd: endHandler,
      handleTouchMove: moveHandler,
      triggerHapticFeedback,
    } = useTouchOptimizations();

    const handleTouchStart = (event) => {
      startHandler(event, (touchEvent) => {
        if (touchEvent.type === 'longpress') {
          triggerHapticFeedback('medium');
          // Custom long press logic
        }
      });
    };

    const handleTouchEnd = (event) => {
      endHandler(event, (touchEvent) => {
        if (touchEvent.type === 'tap') {
          triggerHapticFeedback('light');
          // Custom tap logic
        }
      });
    };

    const handleTouchMove = (event) => {
      moveHandler(event);
    };

    return {
      handleTouchStart,
      handleTouchEnd,
      handleTouchMove,
    };
  },
};
</script>
```

## Troubleshooting

### Common Issues

1. **Haptic Feedback Not Working**

   - Check if the device supports haptic feedback
   - Ensure the user has enabled vibration in browser settings
   - Some browsers require HTTPS for haptic feedback

2. **Touch Events Not Detected**

   - Verify touch event listeners are properly attached
   - Check if `touchstart` event is being prevented elsewhere
   - Ensure proper event delegation

3. **Performance Issues**
   - Check if touch event handlers are throttled
   - Verify proper cleanup of event listeners
   - Monitor memory usage during touch interactions

### Debugging

Enable debug mode to see touch event details:

```javascript
const { enableDebugMode } = useTouchOptimizations();
enableDebugMode(true);
```

This will log touch events and gesture recognition to the console.

## Contributing

To contribute to touch optimizations:

1. Test on multiple touch devices
2. Follow accessibility guidelines
3. Ensure cross-browser compatibility
4. Add appropriate tests for new features
5. Update documentation for any API changes

## Resources

- [MDN Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/Understanding/)
- [Haptic Feedback API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate)
- [Pointer Events Specification](https://www.w3.org/TR/pointerevents/)
