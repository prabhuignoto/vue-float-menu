<template>
  <div
    ref="menuRef"
    class="menu-wrapper"
    role="menu"
    aria-label="Context menu"
    aria-orientation="vertical"
    tabindex="0"
    @keyup="handleKeyUpWithErrorHandling"
  >
    <ul class="menu-list" :style="themeStyles">
      <li
        v-for="(
          { id, selected, name, subMenu, showSubMenu, disabled, divider, iconSlot }, index
        ) of menuItems"
        :key="id"
        :class="[
          { 'sub-menu': subMenu, selected, disabled, flip, divider },
          'menu-list-item',
          menuStyle,
        ]"
        :style="themeStyles"
        role="menuitem"
        :aria-setsize="menuItems.length"
        :aria-posinset="index + 1"
        :aria-haspopup="subMenu ? 'menu' : undefined"
        :aria-expanded="subMenu ? !!showSubMenu : undefined"
        :aria-disabled="!!disabled"
        :tabindex="-1"
        @mousedown="
          handleMenuItemClickWithErrorHandling(
            $event,
            id || '',
            name || '',
            !!subMenu,
            index,
            !!disabled,
            !!divider
          )
        "
        @mouseenter="!prefersReducedMotion && handleMouseEnter($event)"
        @mouseleave="!prefersReducedMotion && handleMouseLeave($event)"
      >
        <template v-if="!divider">
          <div :class="menuItemClass" @click="$event.stopPropagation()">
            <span v-if="iconSlot" class="menu-item-icon">
              <slot :name="iconSlot" />
            </span>
            <span :class="['name', { disabled }]">{{ name }}</span>
            <span
              v-if="subMenu"
              :class="['chev-icon', { disabled, 'show-submenu': showSubMenu }, menuStyle]"
            >
              <chev-right-icon v-if="!isAccordion" />
              <plus-icon v-if="subMenu && !showSubMenu && isAccordion" />
              <minus-icon v-if="subMenu && showSubMenu && isAccordion" />
            </span>
          </div>
          <transition
            :name="!prefersReducedMotion ? 'submenu' : ''"
            :duration="animationDuration"
            @before-leave="handleBeforeTransitionLeave"
            @after-enter="handleAfterTransitionEnter"
          >
            <div
              v-if="!disabled && showSubMenu"
              :class="[subMenuClass, { 'accordion-submenu': isAccordion }]"
              :style="themeStyles"
              :data-submenu-id="id"
              role="menu"
              aria-label="Submenu"
            >
              <component
                :is="SubMenuComponent"
                :data="subMenu?.items || []"
                :on-selection="onSelection"
                :theme="theme"
                :on-close="handleSubmenuClose"
                :flip="flip"
                :menu-style="menuStyle"
              >
                <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                  <slot :name="slot" v-bind="scope" />
                </template>
              </component>
            </div>
          </transition>
        </template>
        <template v-else>
          <span class="menu-item-divider" />
        </template>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  resolveComponent,
  computed,
  onMounted,
  watch,
  nextTick,
} from 'vue';
import ChevRightIcon from './icons/ChevRightIcon.vue';
import PlusIcon from './icons/PlusIcon.vue';
import MinusIcon from './icons/MinusIcon.vue';
import { MenuItem, Theme, ThemeDefault } from '../types';
import { useMenuState } from './composables/useMenuState';
import { useTouchOptimizations } from './composables/useTouchOptimizations';
import { useBundleOptimizations } from './composables/useBundleOptimizations';

export default defineComponent({
  name: 'FloatMenu',
  components: {
    ChevRightIcon,
    PlusIcon,
    MinusIcon,
  },
  props: {
    data: {
      type: Array as PropType<MenuItem[]>,
      default: () => [],
    },
    flip: {
      type: Boolean,
      default: false,
    },
    onSelection: {
      type: Function as PropType<(name: string, parent?: string) => void>,
      default: null,
    },
    onClose: {
      type: Function as PropType<(keyCodeUsed?: string) => void>,
      default: null,
      required: true,
    },
    theme: {
      type: Object as PropType<Theme>,
      required: false,
      default: ThemeDefault,
    },
    menuStyle: {
      type: String,
      default: 'slide-out',
      required: false,
    },
    isTouchDevice: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    // Bundle optimizations for performance
    const { measurePerformance, markAsUsed } = useBundleOptimizations();

    // Menu state management
    const {
      activeIndex,
      menuItems,
      toggleMenu,
      selectMenuItem,
      setActiveIndex,
      closeAllSubMenus,
      updateSelectedItem,
    } = useMenuState(props.data);

    // Reference to the menu element
    const menuRef = ref<HTMLDivElement>();

    // Resolve this component for usage in nested menus
    const SubMenuComponent = resolveComponent('FloatMenu');

    // Accessibility and animation preferences
    const prefersReducedMotion = ref(false);

    // Ensure the menu is focused when mounted for keyboard navigation
    onMounted(() => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      prefersReducedMotion.value = mediaQuery.matches;

      const handler = (e: MediaQueryListEvent) => {
        prefersReducedMotion.value = e.matches;
      };

      mediaQuery.addEventListener('change', handler);

      // Set focus on the menu when it mounts, with a slight delay to ensure it's ready
      nextTick(() => {
        if (menuRef.value) {
          menuRef.value.focus();

          // If there are menu items, select the first one for keyboard navigation
          if (menuItems.value.length > 0) {
            // Find first non-divider item
            const firstItemIndex = menuItems.value.findIndex((item) => !item.divider);
            if (firstItemIndex !== -1) {
              setActiveIndex(firstItemIndex);
            }
          }
        }
      });
    });

    // Animation duration based on user preferences
    const animationDuration = computed(() => {
      return prefersReducedMotion.value ? 0 : 300;
    });

    // Touch optimizations (conditionally import only if needed)
    const touchOptimizations = props.isTouchDevice
      ? (() => {
          const { triggerHapticFeedback } = useTouchOptimizations();
          return { triggerHapticFeedback };
        })()
      : null;

    // Enhanced menu item click handler with touch support
    const handleMenuItemClickWithErrorHandling = (
      event: MouseEvent | TouchEvent,
      id: string,
      name: string,
      subMenu: boolean,
      index: number,
      disabled: boolean,
      divider: boolean
    ) => {
      measurePerformance('menuItemClick', () => {
        markAsUsed('menuItemClick');

        try {
          event.stopPropagation();
          event.preventDefault();

          if (disabled || divider) {
            return;
          }

          // Provide haptic feedback on touch devices
          if (props.isTouchDevice && touchOptimizations) {
            touchOptimizations.triggerHapticFeedback('light');
          }

          setActiveIndex(index);
          selectMenuItem(name, id, subMenu, false, props.onSelection);

          // Direct style manipulation to remove any focus borders
          const target = event.currentTarget as HTMLElement;
          if (target) {
            // Forcibly remove any focus indicators
            target.style.outline = 'none';
            target.style.border = 'none';

            // Apply a setTimeout to ensure this persists after any CSS transitions
            setTimeout(() => {
              if (target && target.classList.contains('selected')) {
                target.style.outline = 'none';
                target.style.border = 'none';
              }
            }, 10);
          }

          // Announce selection for screen readers
          if (!subMenu && name) {
            // Create announcement for screen reader
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'sr-only';
            announcement.textContent = `Selected ${name}`;
            document.body.appendChild(announcement);
            setTimeout(() => document.body.removeChild(announcement), 1000);
          }
        } catch (error) {
          console.error('Menu item click failed:', error);
        }
      });
    };

    // Enhanced keyboard navigation handler
    const handleKeyUpWithErrorHandling = (event: KeyboardEvent) => {
      try {
        event.preventDefault();
        event.stopPropagation();

        const actvIndex = activeIndex.value;
        const item = menuItems.value[actvIndex > -1 ? actvIndex : 0];
        const keyCode = event.key;
        const len = props.data.length;

        switch (keyCode) {
          case 'ArrowDown':
            if (actvIndex < len - 1) {
              const nextItemIsDivider = menuItems.value[actvIndex + 1]?.divider;

              if (nextItemIsDivider) {
                setActiveIndex(actvIndex + 2 < len ? actvIndex + 2 : 0);
              } else {
                setActiveIndex(actvIndex + 1);
              }
            } else if (actvIndex === len - 1) {
              setActiveIndex(0);
            }
            break;

          case 'ArrowUp':
            const isDivider = menuItems.value[actvIndex - 1]?.divider;
            const nextIndex = isDivider
              ? actvIndex - 2
              : actvIndex - 1 < 0
              ? len - 1
              : actvIndex - 1;
            setActiveIndex(nextIndex);
            break;

          case 'ArrowLeft':
            if (!props.flip) {
              props.onClose('ArrowLeft');
            } else if (item.subMenu) {
              toggleMenu(item.id, true);
            }
            break;

          case 'ArrowRight':
            if (!props.flip && item?.subMenu) {
              toggleMenu(item.id || '', true);
              // Focus handling for keyboard navigation
              handleSubmenuOpen(item.id || '');
            } else if (props.flip) {
              props.onClose?.('ArrowRight');
            }
            break;

          case 'Enter':
            if (item?.subMenu) {
              toggleMenu(item.id || '', true);
              // Focus handling for keyboard navigation
              handleSubmenuOpen(item.id || '');
            } else {
              selectMenuItem(
                item?.name,
                item?.id || '',
                Boolean(item?.subMenu),
                false,
                props.onSelection
              );

              // Announce selection for screen readers
              if (item?.name) {
                const announcement = document.createElement('div');
                announcement.setAttribute('aria-live', 'polite');
                announcement.className = 'sr-only';
                announcement.textContent = `Selected ${item.name}`;
                document.body.appendChild(announcement);
                setTimeout(() => document.body.removeChild(announcement), 1000);
              }
            }
            break;

          case 'Escape':
            // Announce menu closing for screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'sr-only';
            announcement.textContent = 'Menu closed';
            document.body.appendChild(announcement);
            setTimeout(() => document.body.removeChild(announcement), 1000);

            props.onClose?.();
            break;
        }
      } catch (error) {
        console.error('Keyboard navigation failed:', error);
      }
    };

    // Mouse interaction handlers with smooth animations
    const handleMouseEnter = (event: MouseEvent) => {
      if (!prefersReducedMotion.value) {
        const target = event.currentTarget as HTMLElement;
        if (target) {
          target.style.transform = 'scale(1.02)';
          target.style.transition = 'all 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          target.style.backgroundColor = 'var(--hover-background, rgba(0, 0, 0, 0.05))';
        }
      }
    };

    const handleMouseLeave = (event: MouseEvent) => {
      if (!prefersReducedMotion.value) {
        const target = event.currentTarget as HTMLElement;
        if (target) {
          target.style.transform = 'scale(1)';
          target.style.transition = 'all 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          target.style.backgroundColor = '';
        }
      }
    };

    // Enhanced submenu focus handling for accessibility
    const handleSubmenuOpen = (submenuId: string) => {
      try {
        // Allow time for the submenu to render
        nextTick(() => {
          // Find the submenu container
          const submenu = document.querySelector(`[data-submenu-id="${submenuId}"]`) as HTMLElement;
          if (submenu) {
            // Find the first focusable item in the submenu
            const firstItem = submenu.querySelector(
              '[role="menuitem"]:not([aria-disabled="true"])'
            ) as HTMLElement;
            if (firstItem) {
              firstItem.focus();

              // Announce submenu opening to screen readers
              const announcement = document.createElement('div');
              announcement.setAttribute('aria-live', 'polite');
              announcement.className = 'sr-only';
              announcement.textContent = 'Submenu opened';
              document.body.appendChild(announcement);
              setTimeout(() => document.body.removeChild(announcement), 1000);
            }
          }
        });
      } catch (error) {
        console.error('Submenu focus handling failed:', error);
      }
    };

    // Handle submenu close
    const handleSubmenuClose = () => {
      try {
        // Find all open submenus
        const openSubmenus = menuItems.value.filter((item) => item.showSubMenu);

        // If there are open submenus, find their DOM elements
        if (openSubmenus.length > 0) {
          nextTick(() => {
            // Start the animation by triggering the transition classes first
            // This will ensure the CSS transitions run properly
            closeAllSubMenus();

            // Then focus the menu after everything is closed
            setTimeout(() => {
              if (menuRef.value) {
                menuRef.value.focus();
              }
            }, 300); // Wait for the animation to finish
          });
        } else {
          // If no open submenus, just focus the menu
          if (menuRef.value) {
            menuRef.value.focus();
          }
        }
      } catch (error) {
        console.error('Submenu close failed:', error);
      }
    };

    // Enhanced submenu transitions
    const handleBeforeTransitionLeave = (_el: Element) => {
      try {
        // Announce submenu closing to screen readers if needed
        if (!prefersReducedMotion.value) {
          const announcement = document.createElement('div');
          announcement.setAttribute('aria-live', 'polite');
          announcement.className = 'sr-only';
          announcement.textContent = 'Submenu closing';
          document.body.appendChild(announcement);
          setTimeout(() => document.body.removeChild(announcement), 1000);
        }
      } catch (error) {
        console.error('Submenu transition handling failed:', error);
      }
    };

    const handleAfterTransitionEnter = (el: Element) => {
      try {
        // Focus the first item in the submenu
        nextTick(() => {
          const firstItem = el.querySelector(
            '[role="menuitem"]:not([aria-disabled="true"])'
          ) as HTMLElement;
          if (firstItem) {
            firstItem.focus();
          }
        });
      } catch (error) {
        console.error('Submenu transition handling failed:', error);
      }
    };

    // Theme CSS variables (memoized for performance)
    const themeStyles = computed(() => ({
      '--background': props.theme.primary,
      '--menu-background': props.theme.menuBgColor,
      '--menu-text-color': props.theme.textColor,
      '--text-selected-color': props.theme.textSelectedColor,
      '--hover-background': props.theme.hoverBackground,
    }));

    // Computed classes
    const subMenuClass = computed(() => `sub-menu-wrapper ${props.menuStyle}`);
    const menuItemClass = computed(() => `menu-item-wrapper ${props.menuStyle}`);
    const isAccordion = computed(() => props.menuStyle === 'accordion');

    // Lifecycle hooks
    onMounted(() => {
      try {
        // Focus the menu on mount for accessibility
        if (menuRef.value) {
          menuRef.value.focus();
        }

        // Set active index if first item is pre-selected
        nextTick(() => {
          const isFirstItemSelected = props.data[0]?.selected;
          if (isFirstItemSelected) {
            setActiveIndex(0);
          }
        });
      } catch (error) {
        console.error('Menu mount failed:', error);
      }
    });

    // Watch activeIndex changes and update selected items
    watch(activeIndex, (val) => {
      updateSelectedItem(val);
    });

    return {
      menuItems,
      handleMenuItemClickWithErrorHandling,
      SubMenuComponent,
      themeStyles,
      menuRef,
      handleKeyUpWithErrorHandling,
      activeIndex,
      handleSubmenuClose,
      subMenuClass,
      menuItemClass,
      isAccordion,
      handleMouseEnter,
      handleMouseLeave,
      prefersReducedMotion,
      animationDuration,
      handleSubmenuOpen,
      handleBeforeTransitionLeave,
      handleAfterTransitionEnter,
    };
  },
});
</script>

<style lang="scss" scoped>
@use './Menu';
@use './styles/accessibility';
@use './styles/focused-items';

/* Direct fix for the Edit menu item and other focused items */
.menu-list-item {
  &.selected,
  &.highlight {
    /* Remove all focus indicators when the item is already visually highlighted */
    outline: none !important;
    border: none !important;
    box-shadow: none !important;

    &:focus,
    &:focus-visible {
      outline: none !important;
      border: none !important;
      box-shadow: none !important;
    }
  }
}
</style>
