export interface Menu {
  items: MenuItem[];
}

export interface MenuItem {
  /**
   * display name of the Menu item
   *
   * @type {string}
   */
  name?: string;
  /**
   * data for the sub menu
   *
   * @type {Menu}
   */
  subMenu?: Menu;
  /**
   * unique id (this is auto generated)
   *
   * @type {string}
   */
  id?: string;
  /**
   * flag to show the sub menu
   *
   * @type {boolean}
   */
  showSubMenu?: boolean;
  /**
   * used to highlight the selection. used for styling purpose.
   *
   * @type {boolean}
   */
  selected?: boolean;
  /**
   * disables the menu item. all interactions are disabled
   *
   * @type {boolean}
   */
  disabled?: boolean;

  divider?: boolean;

  iconSlot?: string;
}

export interface Position {
  left: number;
  top: number;
}

export type SetupOrientation = (
  head: HTMLElement,
  content: HTMLElement,
  headDimension: number,
  menuDimension: { height: number; width: number }
) => {
  "min-height": string;
  width: string;
  newOrientation: string;
};

export type SetupMenuPosition = (
  element: HTMLElement,
  position: Position,
  flipOnEdges: boolean,
  menuContainer: HTMLElement
) => {
  position: Position | null;
  flip: boolean;
  reveal: boolean;
};

export type SetupInitStyle = (
  dockPosition: string,
  dimension: number
) => {
  left: string;
  top: string;
  width: string;
  height: string;
};

export interface UtilsType {
  setupMenuOrientation: SetupOrientation;
  setupMenuPosition: SetupMenuPosition;
  setupInitStyle: SetupInitStyle;
  detectDeviceType: () => string;
}
export interface Theme {
  /**
   * targets the bg color of the menu head and selection highlight for sub menus.
   *
   * @type {string}
   */
  primary: string;

  /**
   * targets the text color
   *
   * @type {string}
   */
  textColor: string;

  /**
   * targets the background color of the menu
   *
   * @type {string}
   */
  menuBgColor: string;

  /**
   * targets the text color of the menu item when the item has a sub menu
   *
   * @type {string}
   */
  textSelectedColor: string;

  hoverBackground: string;
}

export const ThemeDefault = {
  primary: "#0080ff",
  textColor: "#000",
  menuBgColor: "#fff",
  textSelectedColor: "#fff",
  hoverBackground: "#89c4ff",
};
