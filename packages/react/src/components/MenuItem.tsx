import React, { useCallback, useMemo } from "react";
import MenuTheme from "../models/Theme";
import ChevronIcon from "./ChevRight";
import {
  Divider,
  MenuItemContent,
  MenuItemIcon,
  MenuItemMain,
  MenuItemText,
  SubMenuWrapper,
} from "./MenuItem.style";
import { MenuItems } from "./MenuItems";

export interface MenuItemModel {
  divider?: boolean;
  id?: number;
  name?: string;
  subMenu?: MenuItemModel[];
  selected?: boolean;
}

export interface MenuItemViewModel extends MenuItemModel {
  flip?: string;
  onSelectSubMenu: (name?: string, expandSubMenu?: boolean) => void;
  showSubMenu?: boolean;
  subMenu?: MenuItemViewModel[];
  theme: MenuTheme;
  onCloseSubMenu:  (name: string) => void;
}

const MenuItem: React.FunctionComponent<MenuItemViewModel> = ({
  name,
  subMenu,
  showSubMenu,
  onSelectSubMenu,
  theme,
  divider,
  flip,
  selected,
  onCloseSubMenu
}: MenuItemViewModel) => {
  const canShowSubMenu = useMemo(() => {
    return subMenu && showSubMenu;
  }, [showSubMenu]);

  const handleSelection = useCallback((evt: React.MouseEvent | string) => {
    if ((evt as React.MouseEvent).target) {
      (evt as React.MouseEvent).stopPropagation();
      onSelectSubMenu(name, !!subMenu);
    } else if (typeof evt === "string") {
      onSelectSubMenu(evt, false);
    }
  }, []);

  const menuContent = useMemo(
    () => (
      <MenuItemContent
        theme={theme}
        className={
          selected ? "react-dock-menu-item selected" : "react-dock-menu-item"
        }
      >
        <MenuItemText
          theme={theme}
          align={flip}
          className="react-dock-menu-txt"
        >
          {name}
        </MenuItemText>
        <MenuItemIcon
          align={flip}
          className={subMenu ? "react-dock-menu-nested" : ""}
        >
          {subMenu && <ChevronIcon />}
        </MenuItemIcon>
      </MenuItemContent>
    ),
    [flip, selected]
  );

  const dividerContent = useMemo(() => <Divider />, []);

  return (
    <MenuItemMain
      theme={theme}
      className={divider ? "divider" : ""}
      onClick={handleSelection}
    >
      {divider ? dividerContent : menuContent}
      {canShowSubMenu ? (
        <SubMenuWrapper align={flip === "left" ? flip : ""}>
          <MenuItems
            items={subMenu}
            theme={theme}
            onSelection={handleSelection}
            flip={flip}
            onCloseSubMenu={onCloseSubMenu}
            parent={name}
          />
        </SubMenuWrapper>
      ) : null}
    </MenuItemMain>
  );
};

MenuItem.displayName = "MenuItem";

export { MenuItem };
