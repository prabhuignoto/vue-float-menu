export type Menu = {
  items: MenuItem[];
};

export type MenuItem = {
  name: string;
  subMenu?: Menu;
  id?: string;
  showSubMenu?: boolean;
  selected?: boolean;
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