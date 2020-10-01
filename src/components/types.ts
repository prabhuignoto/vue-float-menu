export type Menu = {
  items: MenuItem[];
};

export type MenuItem = {
  name: string;
  subMenu?: Menu;
  id?: string;
  showSubMenu?: boolean;
  selected?: boolean;
};