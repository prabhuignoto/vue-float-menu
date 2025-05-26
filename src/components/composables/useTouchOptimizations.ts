import { ref, computed, onMounted, onUnmounted } from 'vue';

export interface TouchEvent {
  type: 'tap' | 'longpress' | 'swipe' | 'pinch';
  target: HTMLElement;
  startPosition: { x: number; y: number };
  endPosition?: { x: number; y: number };
  duration: number;
  force?: number;
}

export interface SwipeDirection {
  direction: 'up' | 'down' | 'left' | 'right';
  velocity: number;
  distance: number;
}

export const useTouchOptimizations = () => {
  const isTouchDevice = ref(false);
  const isLongPress = ref(false);
  const touchStartTime = ref(0);
  const touchStartPosition = ref({ x: 0, y: 0 });
  const touchEndPosition = ref({ x: 0, y: 0 });

  // Touch configuration
  const LONG_PRESS_DURATION = 500; // ms
  const TAP_THRESHOLD = 10; // pixels
  const SWIPE_THRESHOLD = 50; // pixels
  const SWIPE_VELOCITY_THRESHOLD = 0.3; // pixels per ms

  // Device detection
  const detectTouchDevice = () => {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  };

  // Touch event handlers
  const handleTouchStart = (
    event: globalThis.TouchEvent,
    callback?: (touchEvent: TouchEvent) => void
  ) => {
    const touch = event.touches[0];
    touchStartTime.value = Date.now();
    touchStartPosition.value = { x: touch.clientX, y: touch.clientY };
    touchEndPosition.value = { x: touch.clientX, y: touch.clientY };

    // Start long press detection
    const longPressTimer = setTimeout(() => {
      if (isLongPress.value) return;

      isLongPress.value = true;
      const touchEvent: TouchEvent = {
        type: 'longpress',
        target: event.target as HTMLElement,
        startPosition: touchStartPosition.value,
        duration: Date.now() - touchStartTime.value,
        force: touch.force || 1,
      };

      callback?.(touchEvent);
    }, LONG_PRESS_DURATION);

    // Store timer for cleanup
    (
      event.target as HTMLElement & { _longPressTimer?: ReturnType<typeof setTimeout> }
    )._longPressTimer = longPressTimer;
  };

  const handleTouchMove = (event: globalThis.TouchEvent) => {
    const touch = event.touches[0];
    touchEndPosition.value = { x: touch.clientX, y: touch.clientY };

    // Calculate distance moved
    const distance = Math.sqrt(
      Math.pow(touchEndPosition.value.x - touchStartPosition.value.x, 2) +
        Math.pow(touchEndPosition.value.y - touchStartPosition.value.y, 2)
    );

    // Cancel long press if moved too much
    const target = event.target as HTMLElement & { _longPressTimer?: number };
    if (distance > TAP_THRESHOLD && target._longPressTimer) {
      clearTimeout(target._longPressTimer);
      isLongPress.value = false;
    }
  };

  const handleTouchEnd = (
    event: globalThis.TouchEvent,
    callback?: (touchEvent: TouchEvent) => void
  ) => {
    const touchEndTime = Date.now();
    const duration = touchEndTime - touchStartTime.value;

    // Clean up long press timer
    const target = event.target as HTMLElement & { _longPressTimer?: number };
    if (target._longPressTimer) {
      clearTimeout(target._longPressTimer);
    }

    // Skip if this was a long press
    if (isLongPress.value) {
      isLongPress.value = false;
      return;
    }

    const distance = Math.sqrt(
      Math.pow(touchEndPosition.value.x - touchStartPosition.value.x, 2) +
        Math.pow(touchEndPosition.value.y - touchStartPosition.value.y, 2)
    );

    const velocity = distance / duration;

    let touchEvent: TouchEvent;

    // Determine touch event type
    if (distance < TAP_THRESHOLD) {
      // Tap
      touchEvent = {
        type: 'tap',
        target: event.target as HTMLElement,
        startPosition: touchStartPosition.value,
        endPosition: touchEndPosition.value,
        duration,
      };
    } else if (distance > SWIPE_THRESHOLD && velocity > SWIPE_VELOCITY_THRESHOLD) {
      // Swipe
      touchEvent = {
        type: 'swipe',
        target: event.target as HTMLElement,
        startPosition: touchStartPosition.value,
        endPosition: touchEndPosition.value,
        duration,
      };
    } else {
      // Regular tap with some movement
      touchEvent = {
        type: 'tap',
        target: event.target as HTMLElement,
        startPosition: touchStartPosition.value,
        endPosition: touchEndPosition.value,
        duration,
      };
    }

    callback?.(touchEvent);
  };

  // Swipe direction detection
  const getSwipeDirection = (): SwipeDirection | null => {
    const deltaX = touchEndPosition.value.x - touchStartPosition.value.x;
    const deltaY = touchEndPosition.value.y - touchStartPosition.value.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < SWIPE_THRESHOLD) return null;

    const duration = Date.now() - touchStartTime.value;
    const velocity = distance / duration;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return {
        direction: deltaX > 0 ? 'right' : 'left',
        velocity,
        distance,
      };
    } else {
      return {
        direction: deltaY > 0 ? 'down' : 'up',
        velocity,
        distance,
      };
    }
  };

  // Haptic feedback (if supported)
  const triggerHapticFeedback = (intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
      };
      navigator.vibrate(patterns[intensity]);
    }
  };

  // Enhanced touch target sizing
  const ensureTouchTarget = (element: HTMLElement, minSize: number = 44) => {
    const rect = element.getBoundingClientRect();
    const currentSize = Math.min(rect.width, rect.height);

    if (currentSize < minSize) {
      const padding = (minSize - currentSize) / 2;
      element.style.padding = `${padding}px`;
      element.style.minWidth = `${minSize}px`;
      element.style.minHeight = `${minSize}px`;
    }
  };

  // Touch-friendly menu orientation
  const getOptimalMenuOrientation = (
    menuElement: HTMLElement,
    triggerElement: HTMLElement,
    viewport: { width: number; height: number }
  ) => {
    const triggerRect = triggerElement.getBoundingClientRect();
    const menuRect = menuElement.getBoundingClientRect();

    // On mobile, prefer bottom orientation for easier thumb access
    if (isTouchDevice.value && viewport.width < 768) {
      const spaceBelow = viewport.height - triggerRect.bottom;
      const spaceAbove = triggerRect.top;

      // If there's enough space below, use bottom orientation
      if (spaceBelow >= menuRect.height + 20) {
        return 'bottom';
      }
      // Otherwise use top if there's space
      else if (spaceAbove >= menuRect.height + 20) {
        return 'top';
      }
      // Fallback to bottom with scrolling
      else {
        return 'bottom-scroll';
      }
    }

    // Desktop logic remains the same
    return triggerRect.top > viewport.height / 2 ? 'top' : 'bottom';
  };

  // Enhanced accessibility for touch
  const enhanceAccessibility = (element: HTMLElement) => {
    // Add touch-action for better performance
    element.style.touchAction = 'manipulation';

    // Ensure proper focus handling
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }

    // Add ARIA labels for screen readers
    if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      element.setAttribute('aria-label', 'Interactive menu item');
    }

    // Add role if not present
    if (!element.hasAttribute('role')) {
      element.setAttribute('role', 'button');
    }
  };

  // Initialize touch optimizations
  onMounted(() => {
    isTouchDevice.value = detectTouchDevice();

    // Add CSS class for touch devices
    if (isTouchDevice.value) {
      document.body.classList.add('touch-device');
    }

    // Add touch-friendly CSS
    const style = document.createElement('style');
    style.textContent = `
      .touch-device .menu-list-item {
        min-height: 44px !important;
        padding: 12px 16px !important;
        touch-action: manipulation;
      }
      
      .touch-device .menu-head {
        min-width: 44px !important;
        min-height: 44px !important;
        touch-action: manipulation;
      }
      
      .touch-device .chev-icon {
        min-width: 44px !important;
        min-height: 44px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      
      @media (hover: none) and (pointer: coarse) {
        .menu-list-item:hover {
          background-color: transparent !important;
        }
        
        .menu-list-item:active {
          background-color: var(--hover-background) !important;
          transform: scale(0.98) !important;
        }
      }
    `;
    document.head.appendChild(style);
  });

  onUnmounted(() => {
    // Cleanup
    document.body.classList.remove('touch-device');
  });

  return {
    isTouchDevice: computed(() => isTouchDevice.value),
    isLongPress: computed(() => isLongPress.value),
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    getSwipeDirection,
    triggerHapticFeedback,
    ensureTouchTarget,
    getOptimalMenuOrientation,
    enhanceAccessibility,
  };
};
