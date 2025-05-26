import { ref, computed, unref } from 'vue';
import type { MenuItem } from '../../types';

/**
 * Composable for menu state management
 * Provides a clean API for menu interactions and state
 */
export function useMenuState(data: MenuItem[]) {
  // tracks the index of the selected menu item
  const activeIndex = ref(-1);

  // generate unique ids for the menu items
  const menuItems = ref<MenuItem[]>(
    data.map((item) =>
      Object.assign({}, item, {
        id: `menu-item-${Math.random().toString(16)}`,
        showSubMenu: false,
      })
    )
  );

  // expands/collapses the submenu
  const toggleMenu = (id?: string, selectFirstItem?: boolean) => {
    const targetItem = menuItems.value.find((item) => item.id === id);
    const wasOpen = targetItem?.showSubMenu;

    // If closing target submenu, do it instantly
    if (wasOpen) {
      menuItems.value = menuItems.value.map((item) => {
        if (item.id === id) {
          return Object.assign({}, item, { showSubMenu: false });
        }
        return item;
      });
      return;
    }

    // First close any open submenus that are not the target
    menuItems.value = menuItems.value.map((item) => {
      if (item.id !== id && item.showSubMenu) {
        return Object.assign({}, item, { showSubMenu: false });
      }
      return item;
    });

    // After a small delay, open the target submenu if it was closed
    if (!wasOpen) {
      setTimeout(() => {
        menuItems.value = menuItems.value.map((item) =>
          Object.assign({}, item, {
            showSubMenu: item.id === id ? !item.showSubMenu : item.showSubMenu,
            subMenu:
              selectFirstItem && item.id === id
                ? {
                    items: item.subMenu?.items.map((x, index) =>
                      Object.assign({}, x, {
                        selected: index === 0,
                      })
                    ),
                  }
                : item.subMenu,
          })
        );
      }, 50); // Small delay to ensure a smooth transition
    }
  };

  const selectMenuItem = (
    name?: string,
    id?: string,
    subMenu?: boolean,
    selectFirstItem?: boolean,
    onSelection?: (name: string) => void
  ) => {
    if (!subMenu) {
      if (name && onSelection) {
        onSelection(name);
      }
    } else {
      toggleMenu(id, selectFirstItem);
    }
  };

  const setActiveIndex = (index: number) => {
    activeIndex.value = index;
  };

  const resetActiveIndex = () => {
    activeIndex.value = -1;
  };

  const updateMenuItems = (newData: MenuItem[]) => {
    menuItems.value = newData.map((item) =>
      Object.assign({}, item, {
        id: `menu-item-${Math.random().toString(16)}`,
        showSubMenu: false,
      })
    );
  };

  const closeAllSubMenus = () => {
    // Use a small delay to ensure the animation has time to run
    setTimeout(() => {
      menuItems.value = menuItems.value.map((item) => {
        return Object.assign({}, item, {
          showSubMenu: false,
        });
      });
    }, 30); // Shorter delay for closing
  };

  const updateSelectedItem = (index: number) => {
    menuItems.value = menuItems.value.map((item, i) => {
      return Object.assign({}, item, {
        selected: i === index,
      });
    });
  };

  return {
    activeIndex: computed(() => unref(activeIndex)),
    menuItems: computed(() => unref(menuItems)),
    toggleMenu,
    selectMenuItem,
    setActiveIndex,
    resetActiveIndex,
    updateMenuItems,
    closeAllSubMenus,
    updateSelectedItem,
  };
}
