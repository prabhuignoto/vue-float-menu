import cls from "classnames";
import React, { useCallback, useMemo } from "react";
import { MenuItemViewModel } from "../models/MenuItemModel";
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

const MenuItem: React.FunctionComponent<MenuItemViewModel> = React.memo(({
  disable,
  divider,
  flip,
  name,
  onCloseSubMenu,
  onSelectSubMenu,
  selected,
  showSubMenu,
  subMenu,
  theme,
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

  const dividerContent = useMemo(() => <Divider />, []);
  const dividerClass = useMemo(() => cls({ divider }), [divider]);

  const subMenuClass = useMemo(() => cls(flip === "left" ? "left" : "right"), [
    flip,
  ]);

  const menuContentClass = useMemo(
    () => cls("react-dock-menu-item", { selected, disable }),
    [selected]
  );

  const menuItemIconClass = useMemo(
    () => cls({ "react-dock-menu-nested": subMenu }),
    []
  );

  const menuContent = useMemo(
    () => (
      <MenuItemContent theme={theme} className={menuContentClass}>
        <MenuItemText
          theme={theme}
          align={flip}
          className="react-dock-menu-txt"
        >
          {name}
        </MenuItemText>
        <MenuItemIcon align={flip} className={menuItemIconClass}>
          {subMenu && <ChevronIcon />}
        </MenuItemIcon>
      </MenuItemContent>
    ),
    [flip, selected]
  );

  return (
    <MenuItemMain
      theme={theme}
      className={dividerClass}
      onClick={handleSelection}
    >
      {divider ? dividerContent : menuContent}
      {canShowSubMenu ? (
        <SubMenuWrapper className={subMenuClass}>
          <MenuItems
            flip={flip}
            items={subMenu}
            onCloseSubMenu={onCloseSubMenu}
            onSelection={handleSelection}
            parent={name}
            theme={theme}
          />
        </SubMenuWrapper>
      ) : null}
    </MenuItemMain>
  );
});

MenuItem.displayName = "MenuItem";

export { MenuItem };
