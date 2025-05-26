import { ref, computed } from 'vue';

/**
 * Composable for accessibility features
 * Includes ARIA attributes, focus management, and keyboard navigation
 */
export function useAccessibility() {
  const focusedElement = ref<HTMLElement | null>(null);
  const announcements = ref<string[]>([]);

  /**
   * Generate ARIA attributes for menu items
   */
  const getMenuItemAria = (
    index: number,
    totalItems: number,
    hasSubMenu: boolean,
    isExpanded: boolean,
    isDisabled: boolean
  ) => {
    return {
      role: 'menuitem',
      'aria-setsize': totalItems,
      'aria-posinset': index + 1,
      'aria-haspopup': hasSubMenu ? 'menu' : undefined,
      'aria-expanded': hasSubMenu ? isExpanded : undefined,
      'aria-disabled': isDisabled,
      tabindex: -1,
    };
  };

  /**
   * Generate ARIA attributes for the menu container
   */
  const getMenuAria = (menuId: string, label?: string) => {
    return {
      role: 'menu',
      'aria-label': label || 'Context menu',
      'aria-orientation': 'vertical',
      id: menuId,
    };
  };

  /**
   * Generate ARIA attributes for submenus
   */
  const getSubMenuAria = (parentId: string, label?: string) => {
    return {
      role: 'menu',
      'aria-label': label || 'Submenu',
      'aria-labelledby': parentId,
      'aria-orientation': 'vertical',
    };
  };

  /**
   * Manage focus for keyboard navigation
   */
  const manageFocus = (element: HTMLElement | null) => {
    if (element) {
      focusedElement.value = element;
      element.focus();
    }
  };

  /**
   * Focus the first focusable element in a container
   */
  const focusFirstItem = (container: HTMLElement) => {
    const firstItem = container.querySelector(
      '[role="menuitem"]:not([aria-disabled="true"])'
    ) as HTMLElement;
    if (firstItem) {
      manageFocus(firstItem);
    }
  };

  /**
   * Focus the last focusable element in a container
   */
  const focusLastItem = (container: HTMLElement) => {
    const items = container.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])');
    const lastItem = items[items.length - 1] as HTMLElement;
    if (lastItem) {
      manageFocus(lastItem);
    }
  };

  /**
   * Focus the next item in the menu
   */
  const focusNextItem = (container: HTMLElement, currentElement: HTMLElement) => {
    const items = Array.from(
      container.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])')
    );
    const currentIndex = items.indexOf(currentElement);
    const nextIndex = (currentIndex + 1) % items.length;
    const nextItem = items[nextIndex] as HTMLElement;

    if (nextItem) {
      manageFocus(nextItem);
    }
  };

  /**
   * Focus the previous item in the menu
   */
  const focusPreviousItem = (container: HTMLElement, currentElement: HTMLElement) => {
    const items = Array.from(
      container.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])')
    );
    const currentIndex = items.indexOf(currentElement);
    const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    const prevItem = items[prevIndex] as HTMLElement;

    if (prevItem) {
      manageFocus(prevItem);
    }
  };

  /**
   * Announce text to screen readers
   */
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announcements.value.push(message);

    // Create a temporary announcement element
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  /**
   * Handle escape key to close menus
   */
  const handleEscape = (onClose: () => void) => {
    return (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };
  };

  /**
   * Trap focus within a container
   */
  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  };

  /**
   * Get reduced motion preference
   */
  const prefersReducedMotion = computed(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  return {
    getMenuItemAria,
    getMenuAria,
    getSubMenuAria,
    manageFocus,
    focusFirstItem,
    focusLastItem,
    focusNextItem,
    focusPreviousItem,
    announce,
    handleEscape,
    trapFocus,
    prefersReducedMotion,
    focusedElement: computed(() => focusedElement.value),
    announcements: computed(() => announcements.value),
  };
}
