<template>
  <div
    ref="menuHeadContainer"
    :class="[{ dragActive, 'touch-device': isTouchDevice }, 'menu-head-wrapper']"
    :style="style"
    @mousedown="handleDragStart"
    @mouseup="handleDragEnd"
    @mousemove="handleDragMove"
    @touchstart="handleEnhancedTouchStart"
    @touchend="handleEnhancedTouchEnd"
    @touchmove="handleEnhancedTouchMove"
    @click="toggleMenu"
  >
    <div
      ref="menuHead"
      tabindex="0"
      :class="[{ 'menu-active': menuActive, 'drag-active': dragActive }, 'menu-head']"
      :style="getTheme"
      draggable="false"
      aria-haspopup="menu"
      :aria-expanded="menuActive"
      aria-label="Menu"
      @keydown="handleKeyboardMenuActivation"
    >
      <span class="menu-head-icon">
        <slot name="icon" />
        <slot />
        <MenuIcon v-if="slotsEmpty" />
      </span>
    </div>
    <div
      ref="menuContainer"
      :class="[{ 'menu-active': menuActive }, 'menu-container']"
      :style="menuCSS"
      draggable="false"
    >
      <span class="close-btn" @mousedown="handleCloseClick" @touchstart="handleCloseClick">
        <XIcon />
      </span>
      <MenuComponent
        v-if="menuActive"
        :data="menuData"
        :flip="flipMenu"
        :on-selection="handleMenuItemSelection"
        :theme="theme"
        :on-close="handleMenuClose"
        :menu-style="computedMenuStyle"
        :is-touch-device="isTouchDevice"
      >
        <template v-for="slot in Object.keys($slots)" #[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </MenuComponent>
    </div>
  </div>
</template>

<script lang="ts">
import 'focus-visible';
import { computed, defineComponent, nextTick, onMounted, onUnmounted, ref, unref } from 'vue';
import utils from '../utils';
import MenuIcon from './icons/MenuIcon.vue';
import XIcon from './icons/XIcon.vue';
import MenuComponent from './Menu.vue';
import Props from './props';
import { useTouchOptimizations } from './composables/useTouchOptimizations';
import { useBundleOptimizations } from './composables/useBundleOptimizations';
import type { Position } from '../types';

export default defineComponent({
  name: 'FloatMenu',
  components: {
    MenuIcon,
    MenuComponent,
    XIcon,
  },
  props: Props,
  setup(props, { slots }) {
    // Bundle optimizations for performance
    const { measurePerformance, markAsUsed } = useBundleOptimizations();

    // Touch optimizations
    const {
      isTouchDevice,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      getSwipeDirection,
      triggerHapticFeedback,
      ensureTouchTarget,
    } = useTouchOptimizations();

    // position of the circular menu head
    const position = ref<Position | null>(null);

    // tracks  the  last position of the menu head.
    // this will be used when the menu head need to moved from the edges of the screen to a more optimal position
    const previousPosition = ref<Position | null>(null);

    // // reference to the circular menu head
    const menuHead = ref();

    const menuHeadContainer = ref();

    // enables/disables menu
    const menuActive = ref(false);

    // reference to the menu container
    const menuContainer = ref();

    // generates style for the menu
    const menuCSS = ref<{ 'min-height': string; width: string } | undefined>(undefined);

    // local reference of the menu direction
    const menuOrientation = ref('top');

    // flip menu content
    const flipMenu = ref(false);

    // drag active
    const dragActive = ref(false);
    const dragStart = ref(false);

    const isTouch = ref(window.ontouchstart !== undefined);

    const moveEvent = computed(() => (unref(isTouch) ? 'touchmove' : 'mousemove'));

    const computedMenuStyle = computed(() =>
      unref(moveEvent) === 'touchmove' ? 'accordion' : props.menuStyle
    );

    const isRevealing = ref(false);

    // compute the style
    const style = computed(() => {
      const pos = unref(position);

      if (pos) {
        return {
          left: `${pos.left}px`,
          top: `${pos.top}px`,
          width: `${props.dimension}px`,
          height: `${props.dimension}px`,
        };
      } else {
        return {};
      }
    });

    // Check if slots are empty
    const slotsEmpty = computed(() => !Object.keys(slots).length);

    // manages the orientation of the menu (top or bottom)
    // when enough space is not available on either top or bottom, the menu is automatically flipped
    const setupMenuOrientation = () => {
      const menuContDOM = menuContainer.value;
      const menuHeadDOM = menuHeadContainer.value;
      const { dimension } = props;

      if (!menuContDOM || !menuHeadDOM) {
        return;
      }

      const newStyle = utils.setupMenuOrientation(
        menuHeadDOM,
        menuContDOM,
        dimension,
        props.menuDimension
      );
      menuOrientation.value = newStyle.newOrientation;
      menuCSS.value = newStyle;
    };

    // manages the position of the menu head. make sure the menu stays within the screen bounds
    const adjustFloatMenuPosition = (element: HTMLElement) => {
      const positionRef = unref(position);

      if (!positionRef) {
        return;
      }

      if (menuContainer.value) {
        const newPosition = utils.setupMenuPosition(
          element,
          positionRef,
          props.flipOnEdges,
          menuContainer.value
        );
        flipMenu.value = newPosition.flip;
        isRevealing.value = newPosition.reveal;

        if (newPosition.position) {
          position.value = newPosition.position;
        }
      }
    };

    const onCloseMenu = (event: MouseEvent | TouchEvent) => {
      if (menuActive.value) {
        if (isRevealing.value) {
          position.value = previousPosition.value;
        }
        const classes = Array.from((event.target as HTMLElement).classList);
        if (classes.some((cls) => cls === 'sub-menu' || cls === 'disabled')) {
          return;
        }
        menuActive.value = false;
      }
    };

    // handler for window resize event
    const onWindowResize = () => {
      const intialStyle = utils.setupInitStyle(props.position, props.dimension);

      position.value = {
        left: Number(intialStyle.left.replace(/px/gi, '')),
        top: Number(intialStyle.top.replace(/px/gi, '')),
      };
    };

    const handleMove = (event: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if (event instanceof MouseEvent) {
        clientX = event.clientX;
        clientY = event.clientY;
      } else if (event instanceof TouchEvent) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      }

      if (dragActive.value) {
        const top = clientY - Math.round(props.dimension / 2);

        position.value = {
          left: clientX - Math.round(props.dimension / 2),
          top:
            top > 0 && top < window.innerHeight - props.dimension
              ? top
              : top < 0
                ? 0
                : top - props.dimension,
        };
      }
    };

    onMounted(() => {
      // setup the initial style on load
      const intialStyle = utils.setupInitStyle(props.position, props.dimension);
      const initPosition = {
        left: Number(intialStyle.left.replace(/px/gi, '')),
        top: Number(intialStyle.top.replace(/px/gi, '')),
      };
      position.value = initPosition;
      previousPosition.value = initPosition;

      // close the menu when clicked outside
      window.addEventListener('click', onCloseMenu);

      // attach handler for window resize event
      window.addEventListener('resize', onWindowResize);

      window.addEventListener(
        'mouseup',
        (event: MouseEvent) => {
          const nodeName = (event.target as HTMLElement).nodeName;
          const canStopDrag = nodeName === '#document' || nodeName === 'HTML';

          if (canStopDrag) {
            dragStart.value = false;
            dragActive.value = false;
            previousPosition.value = position.value;
          }
        },
        { capture: true }
      );

      if (!props.fixed && menuHeadContainer.value) {
        document.addEventListener(moveEvent.value, handleMove);
      }
    });

    // cleanup
    onUnmounted(() => {
      window.removeEventListener('click', onCloseMenu);
      window.removeEventListener('resize', onWindowResize);
      document.removeEventListener(moveEvent.value, handleMove);
    });

    // open/close the menu
    const toggleMenu = (event: MouseEvent | KeyboardEvent) => {
      measurePerformance('toggleMenu', () => {
        markAsUsed('menuToggle');

        if (dragActive.value) {
          return;
        }

        event.stopPropagation();
        event.preventDefault();

        const classes = Array.from((event.target as HTMLElement).classList);

        if (classes.some((cls) => cls === 'menu-list-item')) {
          return;
        }

        if (!menuActive.value) {
          // Clean up any existing state first
          dragStart.value = false;
          dragActive.value = false;

          setupMenuOrientation();
          adjustFloatMenuPosition(menuHead.value as HTMLElement);

          const menuContainerEl = menuContainer.value;
          if (menuContainerEl && menuContainerEl.getAnimations) {
            // Cancel any lingering animations
            menuContainerEl.getAnimations().forEach((anim: Animation) => anim.cancel());
          }

          // Set menu active
          menuActive.value = true;

          // Focus the menu container after it's been activated
          nextTick(() => {
            if (menuContainer.value) {
              const menuElement = menuContainer.value.querySelector('.menu-wrapper');
              if (menuElement) {
                menuElement.focus();

                // Announce menu opening to screen readers
                const announcement = document.createElement('div');
                announcement.setAttribute('aria-live', 'polite');
                announcement.className = 'sr-only';
                announcement.textContent = 'Menu opened';
                document.body.appendChild(announcement);
                setTimeout(() => document.body.removeChild(announcement), 1000);
              }
            }
          });
        } else {
          menuActive.value = false;
          if (isRevealing.value) {
            position.value = previousPosition.value;
          }
        }

        // No longer needed as we're setting menuActive directly above
        // nextTick(() => {
        //   menuActive.value = !menuActive.value;
        // });
      });
    };

    // close the menu from child component (./menu.vue)
    const handleMenuClose = (keyCode?: string) => {
      if (keyCode === 'ArrowLeft' || keyCode === 'ArrowRight') {
        return;
      }

      // Get the menu container element
      const menuContainerEl = menuContainer.value;

      if (menuContainerEl) {
        // Apply closing animation with Web Animation API
        const animation = menuContainerEl.animate(
          [
            { opacity: 1, transform: 'scale(1)' },
            { opacity: 0, transform: 'scale(0.95)' },
          ],
          {
            duration: 250,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'forwards',
          }
        ); // Clean up any existing animations
        if (menuContainerEl.getAnimations) {
          const existingAnimations = menuContainerEl.getAnimations();
          existingAnimations.forEach((anim: Animation) => {
            if (anim !== animation) anim.cancel();
          });
        }

        animation.onfinish = () => {
          menuActive.value = false;
          if (isRevealing.value) {
            position.value = previousPosition.value;
          }
          // Reset menu state after animation
          dragStart.value = false;
          dragActive.value = false;

          nextTick(() => {
            if (menuHead.value) {
              menuHead.value.focus();
            }
          });
        };
      } else {
        // Fallback if container element isn't available
        menuActive.value = false;
        dragStart.value = false;
        dragActive.value = false;
        if (isRevealing.value) {
          position.value = previousPosition.value;
        }

        nextTick(() => {
          menuHead.value?.focus();
        });
      }
    };

    // handle close button click
    const handleCloseClick = (event: MouseEvent | TouchEvent) => {
      event.stopPropagation();
      event.preventDefault();

      // Provide haptic feedback for touch devices
      if (isTouchDevice.value) {
        triggerHapticFeedback('light');
      }

      handleMenuClose();
    };

    // handler for selection
    const handleMenuItemSelection = (name: string) => {
      measurePerformance('menuItemSelection', () => {
        markAsUsed('menuItemSelection');

        // Get the menu container element
        const menuContainerEl = menuContainer.value;

        if (menuContainerEl) {
          // Apply closing animation with Web Animation API
          const animation = menuContainerEl.animate(
            [
              { opacity: 1, transform: 'scale(1)' },
              { opacity: 0, transform: 'scale(0.95)' },
            ],
            {
              duration: 250,
              easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              fill: 'forwards',
            }
          );

          animation.onfinish = () => {
            menuActive.value = false;

            if (props.onSelected) {
              props.onSelected(name);
            }
          };
        } else {
          // Fallback if container element isn't available
          menuActive.value = false;

          if (props.onSelected) {
            props.onSelected(name);
          }
        }
      });
    };

    const getTheme = computed(() => ({
      '--background': props.theme.primary,
    }));

    const handleDragStart = (event: MouseEvent | TouchEvent) => {
      if (!isTouch.value) {
        event.preventDefault();
      }
      dragStart.value = true;
    };

    const handleDragMove = () => {
      if (dragStart.value) {
        menuActive.value = false;
        dragActive.value = true;
      }
    };

    const handleDragEnd = (event: MouseEvent | TouchEvent) => {
      let clientX: number, clientY: number;

      if ('touches' in event && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else if ('changedTouches' in event && event.changedTouches.length > 0) {
        clientX = event.changedTouches[0].clientX;
        clientY = event.changedTouches[0].clientY;
      } else {
        clientX = (event as MouseEvent).clientX;
        clientY = (event as MouseEvent).clientY;
      }

      if (dragActive.value) {
        previousPosition.value = {
          left: clientX - Math.round(props.dimension / 2),
          top: clientY - Math.round(props.dimension / 2),
        };
        setTimeout(() => {
          dragActive.value = false;
        }, 100);
      }
      dragStart.value = false;
    };

    // Handle keyboard activation of menu (Space and Enter keys)
    const handleKeyboardMenuActivation = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'Space') {
        event.preventDefault();
        toggleMenu(event);
      }
    };

    // Enhanced touch handlers
    const handleEnhancedTouchStart = (event: TouchEvent) => {
      handleTouchStart(event, (touchEvent) => {
        if (touchEvent.type === 'longpress') {
          // Long press opens menu and provides haptic feedback
          triggerHapticFeedback('medium');
          if (!menuActive.value) {
            toggleMenu(event as any);
          }
        }
      });

      // Also handle normal drag functionality
      handleDragStart(event);
    };

    const handleEnhancedTouchMove = (event: TouchEvent) => {
      handleTouchMove(event);
      handleDragMove();
    };

    const handleEnhancedTouchEnd = (event: TouchEvent) => {
      handleTouchEnd(event, (touchEvent) => {
        if (touchEvent.type === 'tap') {
          // Provide light haptic feedback for taps
          triggerHapticFeedback('light');
        } else if (touchEvent.type === 'swipe') {
          // Handle swipe gestures
          const swipe = getSwipeDirection();
          if (swipe && menuActive.value) {
            // Use our enhanced swipe to close handler
            handleSwipeToClose(swipe.direction);
          }
        }
      });

      // Also handle normal drag functionality
      handleDragEnd(event);
    };

    // Enhanced swipe handling for menu closing
    const handleSwipeToClose = (swipeDirection: string) => {
      if (
        menuActive.value &&
        (swipeDirection === 'up' || swipeDirection === 'down' || swipeDirection === 'left')
      ) {
        const menuContainerEl = menuContainer.value;

        if (menuContainerEl) {
          // Determine animation based on swipe direction
          const transformEnd =
            swipeDirection === 'up'
              ? 'translateY(-20px)'
              : swipeDirection === 'down'
                ? 'translateY(20px)'
                : 'translateX(-20px)';

          // Apply closing animation with Web Animation API
          const animation = menuContainerEl.animate(
            [
              { opacity: 1, transform: 'scale(1)' },
              { opacity: 0, transform: `scale(0.95) ${transformEnd}` },
            ],
            {
              duration: 250,
              easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              fill: 'forwards',
            }
          );

          animation.onfinish = () => {
            menuActive.value = false;
            if (isRevealing.value) {
              position.value = previousPosition.value;
            }

            nextTick(() => {
              menuHead.value?.focus();
            });
          };

          // Provide haptic feedback
          if (isTouchDevice.value) {
            triggerHapticFeedback('light');
          }

          return true;
        }
      }

      return false;
    };

    // Enhanced accessibility for touch devices
    nextTick(() => {
      if (menuHeadContainer.value) {
        ensureTouchTarget(menuHeadContainer.value);
      }
    });

    return {
      // Expose refs
      menuHead,
      menuHeadContainer,
      menuContainer,
      position,
      menuActive,
      dragActive,
      isTouchDevice,
      slotsEmpty,
      menuOrientation,
      menuCSS,
      flipMenu,
      // Expose computed
      style,
      computedMenuStyle,
      getTheme,
      // Expose methods
      toggleMenu,
      handleMenuClose,
      handleCloseClick,
      handleMenuItemSelection,
      handleDragStart,
      handleDragMove,
      handleDragEnd,
      handleEnhancedTouchStart,
      handleEnhancedTouchMove,
      handleEnhancedTouchEnd,
      handleKeyboardMenuActivation,
      handleSwipeToClose,
    };
  },
});
</script>

<style lang="scss">
@use './index';
@use './styles/accessibility';
</style>
