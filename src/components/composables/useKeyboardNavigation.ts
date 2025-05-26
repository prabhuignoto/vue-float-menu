import { ComputedRef } from 'vue';
import type { MenuItem } from '../../types';

interface KeyboardNavigationOptions {
  activeIndex: ComputedRef<number>;
  menuItems: ComputedRef<MenuItem[]>;
  flip: boolean;
  dataLength: number;
  onClose: (keyCodeUsed?: string) => void;
  toggleMenu: (id?: string, selectFirstItem?: boolean) => void;
  selectMenuItem: (name?: string, id?: string, subMenu?: boolean) => void;
  setActiveIndex: (index: number) => void;
}

/**
 * Composable for keyboard navigation in menus
 * Handles arrow keys, Enter, Escape, and other keyboard interactions
 */
export function useKeyboardNavigation(options: KeyboardNavigationOptions) {
  const {
    activeIndex,
    menuItems,
    flip,
    dataLength,
    onClose,
    toggleMenu,
    selectMenuItem,
    setActiveIndex,
  } = options;

  const handleKeyUp = (event: KeyboardEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const actvIndex = activeIndex.value;
    const item = menuItems.value[actvIndex > -1 ? actvIndex : 0];
    const keyCode = event.key;
    const len = dataLength;

    switch (keyCode) {
      case 'ArrowDown':
        handleArrowDown(actvIndex, len);
        break;
      case 'ArrowUp':
        handleArrowUp(actvIndex, len);
        break;
      case 'ArrowLeft':
        handleArrowLeft(item, flip);
        break;
      case 'ArrowRight':
        handleArrowRight(item, flip);
        break;
      case 'Enter':
        handleEnter(item);
        break;
      case 'Escape':
        onClose();
        break;
      default:
        // Handle other keys if needed
        break;
    }
  };

  const handleArrowDown = (actvIndex: number, len: number) => {
    if (actvIndex < len - 1) {
      const nextItemIsDivider = menuItems.value[actvIndex + 1]?.divider;

      if (nextItemIsDivider) {
        // Skip dividers
        setActiveIndex(actvIndex + 2 < len ? actvIndex + 2 : 0);
      } else {
        setActiveIndex(actvIndex + 1);
      }
    } else if (actvIndex === len - 1) {
      // Wrap to top
      setActiveIndex(0);
    }
  };

  const handleArrowUp = (actvIndex: number, len: number) => {
    const isDivider = menuItems.value[actvIndex - 1]?.divider;

    // Check if the previous item is a divider and move 2 steps backward
    const nextIndex = isDivider ? actvIndex - 2 : actvIndex - 1 < 0 ? len - 1 : actvIndex - 1;

    setActiveIndex(nextIndex);
  };

  const handleArrowLeft = (item: MenuItem, flip: boolean) => {
    if (!flip) {
      onClose('ArrowLeft');
    } else if (item.subMenu) {
      // If the menu is flipped, this should toggle the menu
      toggleMenu(item.id, true);
    }
  };

  const handleArrowRight = (item: MenuItem, flip: boolean) => {
    if (!flip && item.subMenu) {
      toggleMenu(item.id, true);
    } else if (flip) {
      onClose('ArrowRight');
    }
  };

  const handleEnter = (item: MenuItem) => {
    if (item.subMenu) {
      toggleMenu(item.id, true);
    } else {
      selectMenuItem(item.name, item.id, Boolean(item.subMenu));
    }
  };

  return {
    handleKeyUp,
  };
}
