import MenuTheme from "./Theme";

export interface MenuItemModel {
  disable?: boolean;
  divider?: boolean;
  id?: number;
  name?: string;
  selected?: boolean;
  subMenu?: MenuItemModel[];
}

export interface MenuItemViewModel extends MenuItemModel {
  flip?: string;
  onCloseSubMenu: () => void;
  onSelectSubMenu: (name?: string, expandSubMenu?: boolean) => void;
  showSubMenu?: boolean;
  subMenu?: MenuItemViewModel[];
  theme: MenuTheme;
}