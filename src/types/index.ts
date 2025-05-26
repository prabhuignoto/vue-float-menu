export type Menu = {
  items: MenuItem[];
};

export type MenuItem = {
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
};

export type Position = {
  left: number;
  top: number;
};

export type SetupOrientation = (
  head: HTMLElement,
  content: HTMLElement,
  headDimension: number,
  menuDimension: { height: number; width: number }
) => {
  'min-height': string;
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

export type UtilsType = {
  setupMenuOrientation: SetupOrientation;
  setupMenuPosition: SetupMenuPosition;
  setupInitStyle: SetupInitStyle;
  detectDeviceType: () => string;
};
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
  primary: '#4f46e5', // Modern indigo
  textColor: '#374151', // Professional gray
  menuBgColor: 'rgba(255, 255, 255, 0.95)', // Semi-transparent white
  textSelectedColor: '#1f2937', // Dark gray for selected text
  hoverBackground: 'rgba(79, 70, 229, 0.1)', // Light indigo for hover
};

// Bundle optimization types
export interface BundleOptimization {
  memory?: {
    used: number;
    total: number;
    limit: number;
  };
  isSlowNetwork?: boolean;
  isDevelopment?: boolean;
  isProduction?: boolean;
}

// Component instance type for Vue
export interface FloatMenuInstance {
  toggleMenu: () => void;
  closeMenu: () => void;
  openMenu: () => void;
  isMenuActive: () => boolean;
}

// Props interface for the component
export interface FloatMenuProps {
  dimension?: number;
  position?: string;
  fixed?: boolean;
  menuDimension?: { height: number; width: number };
  menuData?: MenuItem[];
  useCustomContent?: boolean;
  onSelected?: (val: string) => void;
  flipOnEdges?: boolean;
  theme?: Theme;
  preserveMenuPosition?: boolean;
  menuStyle?: string;
}
