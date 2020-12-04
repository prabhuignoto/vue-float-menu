import React, { useCallback, useEffect, useRef, useState } from "react";
import { MenuItemViewModel } from "../models/MenuItemModel";
import MenuTheme from "../models/Theme";
import { MenuItem } from "./MenuItem";
import { MenuItemsMain, MenuItemsWrapper } from "./MenuItems.style";

interface MenuItemsModel {
  items?: MenuItemViewModel[];
  theme: MenuTheme;
}

interface MenuItemsViewModel extends MenuItemsModel {
  onSelection(e: React.MouseEvent | string): void;
  toggleMenu?: boolean;
  flip?: string;
  onCloseSubMenu?: () => void;
  parent?: string;
}

const MenuItems: React.FunctionComponent<MenuItemsViewModel> = ({
  items,
  theme,
  onSelection,
  toggleMenu,
  flip,
  parent,
  onCloseSubMenu,
}: MenuItemsViewModel) => {
  const [menuItems, setMenuItems] = useState(
    items
      ? items.map((item) =>
          Object.assign({}, item, {
            id: Math.floor(Math.random() * 1000),
            showSubMenu: false,
          })
        )
      : []
  );

  const menuItemsRef = useRef<HTMLUListElement>(null);
  const menuItemsWrapperRef = useRef<HTMLDivElement>(null);
  const activeIndex = useRef<number>(-1);

  const handleSelectSubMenu = useCallback(
    (name?: string, expandSubMenu?: boolean) => {
      if (expandSubMenu) {
        setMenuItems((prev) =>
          prev.map((item) =>
            Object.assign({}, item, {
              showSubMenu: name === item.name && !item.showSubMenu,
            })
          )
        );
      } else {
        name && onSelection(name);
      }
    },
    []
  );

  const reset = useCallback(
    () =>
      setMenuItems((prev) =>
        prev.map((item) =>
          Object.assign({}, item, {
            showSubMenu: false,
          })
        )
      ),
    []
  );

  useEffect(() => {
    if (!toggleMenu) {
      reset();
    }
  }, [toggleMenu]);

  useEffect(() => {
    if (menuItemsRef.current) {
      menuItemsRef.current.focus();
    }
  }, []);

  const closeSubMenu = useCallback(() => reset(), []);

  const handleKeyUp = (event: React.KeyboardEvent) => {
    event.stopPropagation();

    let newIndex = 0;
    let menuItemsLen = menuItems.length;
    const selectedItem = menuItems[activeIndex.current];
    const closeKey = flip === "left" ? "ArrowRight" : "ArrowLeft";
    const expandKey = flip === "left" ? "ArrowLeft" : "ArrowRight";

    if (event.key === "ArrowUp") {
      newIndex = activeIndex.current - 1;
    } else if (event.key === "ArrowDown") {
      newIndex = activeIndex.current + 1;
    } else if (
      event.key === "Enter" ||
      (event.key === expandKey && selectedItem?.subMenu)
    ) {
      if (selectedItem) {
        const { subMenu, name } = selectedItem;
        handleSelectSubMenu(name, !!subMenu);
      }

      return;
    } else if (event.key === closeKey && parent) {
      const wrapper = menuItemsWrapperRef.current;

      if (wrapper) {
        const parentList = wrapper.closest("ul");

        if (parentList) {
          parentList.focus();

          onCloseSubMenu && onCloseSubMenu();
        }
      }
    } else if (!selectedItem?.subMenu) {
      return;
    }

    if (newIndex < 0) {
      newIndex = menuItemsLen - 1;
    } else if (newIndex >= menuItems.length) {
      newIndex = 0;
    } else if (menuItems[newIndex].divider) {
      if (event.key === "ArrowUp") {
        newIndex -= 1;
      } else {
        newIndex += 1;
      }
    }

    if (newIndex !== activeIndex.current) {
      activeIndex.current = newIndex;

      setMenuItems((prev) => {
        return prev.map((item, index) =>
          Object.assign({}, item, {
            selected: index === newIndex,
          })
        );
      });
    }
  };

  return (
    <MenuItemsWrapper ref={menuItemsWrapperRef}>
      <MenuItemsMain ref={menuItemsRef} tabIndex={0} onKeyUp={handleKeyUp}>
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            flip={flip}
            {...item}
            onSelectSubMenu={
              !item.disable && !item.divider ? handleSelectSubMenu : () => {}
            }
            theme={theme}
            selected={item.selected}
            onCloseSubMenu={closeSubMenu}
            disable={item.disable}
          />
        ))}
      </MenuItemsMain>
    </MenuItemsWrapper>
  );
};

export { MenuItems };
