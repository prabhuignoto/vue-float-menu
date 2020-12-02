import React, { useCallback, useEffect, useMemo, useState } from "react";
import MenuTheme from "../models/Theme";
import { MenuItem, MenuItemViewModel } from "./MenuItem";
import { MenuItemsMain, MenuItemsWrapper } from "./MenuItems.style";

interface MenuItemsModel {
  items?: MenuItemViewModel[];
  theme: MenuTheme;
}

interface MenuItemsViewModel extends MenuItemsModel {
  onSelection(e: React.MouseEvent | string): void;
  toggleMenu?: boolean;
  flip?: string;
}

const MenuItems: React.FunctionComponent<MenuItemsViewModel> = ({
  items,
  theme,
  onSelection,
  toggleMenu,
  flip
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

  useEffect(() => {
    if (!toggleMenu) {
      setMenuItems((prev) =>
        prev.map((item) =>
          Object.assign({}, item, {
            showSubMenu: false,
          })
        )
      );
    }
  }, [toggleMenu]);

  return (
    <MenuItemsWrapper>
      <MenuItemsMain>
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            flip={flip}
            {...item}
            onSelectSubMenu={handleSelectSubMenu}
            theme={theme}
          />
        ))}
      </MenuItemsMain>
    </MenuItemsWrapper>
  );
};

export { MenuItems };
