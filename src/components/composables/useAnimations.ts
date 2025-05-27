import { ref, computed, onMounted, onUnmounted } from 'vue';

/**
 * Composable for enhanced animations and transitions
 * Includes reduced motion support and smooth animations
 */
export function useAnimations() {
  const prefersReducedMotion = ref(false);
  const animationQueue = ref<Array<() => void>>([]);
  const isAnimating = ref(false);

  // Check for reduced motion preference
  onMounted(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.value = mediaQuery.matches;

    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotion.value = e.matches;
    };

    mediaQuery.addEventListener('change', handler);

    onUnmounted(() => {
      mediaQuery.removeEventListener('change', handler);
    });
  });

  /**
   * Get animation duration based on user preferences
   */
  const getAnimationDuration = (normalDuration: number, reducedDuration: number = 0) => {
    return prefersReducedMotion.value ? reducedDuration : normalDuration;
  };

  /**
   * Get transition timing function
   */
  const getTimingFunction = (
    type: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce' = 'ease-out'
  ) => {
    if (prefersReducedMotion.value) {
      return 'ease';
    }

    const timingFunctions = {
      ease: 'ease',
      'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
      'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
      'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    };

    return timingFunctions[type];
  };

  /**
   * Animate element with smooth transitions
   */
  const animateElement = (
    element: HTMLElement,
    properties: Record<string, string | number>,
    options: {
      duration?: number;
      delay?: number;
      easing?: string;
      onComplete?: () => void;
    } = {}
  ) => {
    const {
      duration = 300,
      delay = 0,
      easing = getTimingFunction('ease-out'),
      onComplete,
    } = options;

    const finalDuration = getAnimationDuration(duration);

    if (finalDuration === 0) {
      // Apply styles immediately if reduced motion
      Object.entries(properties).forEach(([prop, value]) => {
        element.style.setProperty(prop, String(value));
      });
      onComplete?.();
      return;
    }

    // Set transition
    const transition = `all ${finalDuration}ms ${easing}`;
    element.style.transition = transition;

    // Apply delay if specified
    if (delay > 0) {
      setTimeout(() => applyStyles(), delay);
    } else {
      applyStyles();
    }

    function applyStyles() {
      Object.entries(properties).forEach(([prop, value]) => {
        element.style.setProperty(prop, String(value));
      });

      // Clean up after animation
      if (onComplete) {
        setTimeout(() => {
          element.style.transition = '';
          onComplete();
        }, finalDuration);
      }
    }
  };

  /**
   * Slide animation for menu items
   */
  const slideIn = (
    element: HTMLElement,
    direction: 'left' | 'right' | 'up' | 'down' = 'right',
    duration: number = 200
  ) => {
    const transforms = {
      left: 'translateX(-100%)',
      right: 'translateX(100%)',
      up: 'translateY(-100%)',
      down: 'translateY(100%)',
    };

    // Set initial state
    element.style.transform = transforms[direction];
    element.style.opacity = '0';

    // Animate to final state
    requestAnimationFrame(() => {
      animateElement(
        element,
        {
          transform: 'translateX(0) translateY(0)',
          opacity: '1',
        },
        {
          duration: getAnimationDuration(duration),
          easing: getTimingFunction('ease-out'),
        }
      );
    });
  };

  /**
   * Fade animation
   */
  const fadeIn = (element: HTMLElement, duration: number = 150) => {
    element.style.opacity = '0';

    requestAnimationFrame(() => {
      animateElement(
        element,
        {
          opacity: '1',
        },
        {
          duration: getAnimationDuration(duration),
          easing: getTimingFunction('ease-out'),
        }
      );
    });
  };

  const fadeOut = (element: HTMLElement, duration: number = 150, onComplete?: () => void) => {
    // Add a scale animation along with the fade for a more polished effect
    animateElement(
      element,
      {
        opacity: '0',
        transform: 'scale(0.95)',
      },
      {
        duration: getAnimationDuration(duration),
        easing: getTimingFunction('ease-in'),
        onComplete,
      }
    );
  };

  /**
   * Scale animation for hover effects
   */
  const scaleAnimation = (element: HTMLElement, scale: number = 1.05, duration: number = 100) => {
    animateElement(
      element,
      {
        transform: `scale(${scale})`,
      },
      {
        duration: getAnimationDuration(duration),
        easing: getTimingFunction('ease-out'),
      }
    );
  };

  /**
   * Reset scale animation
   */
  const resetScale = (element: HTMLElement, duration: number = 100) => {
    animateElement(
      element,
      {
        transform: 'scale(1)',
      },
      {
        duration: getAnimationDuration(duration),
        easing: getTimingFunction('ease-out'),
      }
    );
  };

  /**
   * Ripple effect animation
   */
  const createRipple = (element: HTMLElement, event: MouseEvent) => {
    if (prefersReducedMotion.value) return;

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      pointer-events: none;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      transform: scale(0);
      animation: ripple 600ms ease-out;
    `;

    // Add ripple keyframes if not already added
    if (!document.querySelector('#ripple-keyframes')) {
      const style = document.createElement('style');
      style.id = 'ripple-keyframes';
      style.textContent = `
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  };

  /**
   * Queue animations for sequential execution
   */
  const queueAnimation = (animationFn: () => void) => {
    animationQueue.value.push(animationFn);

    if (!isAnimating.value) {
      processQueue();
    }
  };

  const processQueue = async () => {
    if (animationQueue.value.length === 0) {
      isAnimating.value = false;
      return;
    }

    isAnimating.value = true;
    const nextAnimation = animationQueue.value.shift();

    if (nextAnimation) {
      nextAnimation();
      // Wait for animation to complete before processing next
      setTimeout(processQueue, getAnimationDuration(100));
    }
  };

  /**
   * CSS transition classes for Vue transitions
   */
  const transitionClasses = computed(() => ({
    'menu-enter-active': `transition-all duration-${getAnimationDuration(200)} ${getTimingFunction(
      'ease-out'
    )}`,
    'menu-leave-active': `transition-all duration-${getAnimationDuration(150)} ${getTimingFunction(
      'ease-in'
    )}`,
    'menu-enter-from': 'opacity-0 transform scale-95',
    'menu-enter-to': 'opacity-100 transform scale-100',
    'menu-leave-from': 'opacity-100 transform scale-100',
    'menu-leave-to': 'opacity-0 transform scale-95',
  }));

  return {
    prefersReducedMotion: computed(() => prefersReducedMotion.value),
    getAnimationDuration,
    getTimingFunction,
    animateElement,
    slideIn,
    fadeIn,
    fadeOut,
    scaleAnimation,
    resetScale,
    createRipple,
    queueAnimation,
    transitionClasses,
  };
}
