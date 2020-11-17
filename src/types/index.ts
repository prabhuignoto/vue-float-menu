export type Menu = {
  items: MenuItem[];
};

export type MenuItem = {
  /**
   * display name of the Menu item
   *
   * @type {string}
   */
  name: string;
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
};

export type Position = {
  left: number;
  top: number;
}

export type SetupOrientation = (
  head: HTMLElement,
  content: HTMLElement,
  headDimension: number,
  menuDimension: { height: number, width: number }) =>
  ({
    "min-height": string;
    width: string;
    newOrientation: string;
  })

export type SetupMenuPosition = (
  element: HTMLElement,
  position: Position,
  flipOnEdges: boolean,
  menuContainer: HTMLElement) => ({
    position: Position | null;
    flip: boolean;
    reveal: boolean;
  })

export type SetupInitStyle = (dockPosition: string, dimension: number) => ({
  left: string;
  top: string;
  width: string;
  height: string;
})

export type UtilsType = {
  setupMenuOrientation: SetupOrientation;
  setupMenuPosition: SetupMenuPosition;
  setupInitStyle: SetupInitStyle;
  detectDeviceType: () => string;
}