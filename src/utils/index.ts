type Position = {
  left: number;
  top: number;
}

type SetupOrientation = (
  head: HTMLElement,
  content: HTMLElement,
  headDimension: number,
  dir: string,
  menuDimension: { height: number, width: number }) =>
  ({
    "min-height": string;
    width: string;
    newOrientation: string;
  })

type SetupMenuPosition = (
  element: HTMLElement,
  position: Position,
  flipOnEdges: boolean,
  menuContainer: HTMLElement) => ({
    position: Position | null;
    flip: boolean;
  })

type SetupInitStyle = (dockPosition: string, dimension: number) => ({
  left: string;
  top: string;
  width: string;
  height: string;
})

type UtilsType = {
  setupMenuOrientation: SetupOrientation;
  setupMenuPosition: SetupMenuPosition;
  setupInitStyle: SetupInitStyle;
}

const utils: UtilsType = {
  setupMenuOrientation: (
    head,
    content,
    headDimension,
    dir,
    menuDimension
  ) => {

    const { top, bottom } = head.getBoundingClientRect();
    const left = Math.round((content.clientWidth - headDimension) / 2);
    const menuHeight = content.clientHeight;
    let newOrientation = 'bottom';
    const MENU_SPACING = 15;
    let newMenuStyle = null;

    // flip to bottom if there is not enough space on top
    if (dir === "top" && menuHeight > top) {
      newMenuStyle = {
        top: `${headDimension + MENU_SPACING}px`,
        left: `-${left}px`,
      };
      newOrientation = "top";
    } else if (dir === "top") {
      newMenuStyle = {
        bottom: `${headDimension + MENU_SPACING}px`,
        left: `-${left}px`,
      };
      // flip menu to top if there is no enough space at bottom
    } else if (dir === "bottom" && window.innerHeight - bottom < menuHeight) {
      newMenuStyle = {
        bottom: `${headDimension + MENU_SPACING}px`,
        left: `-${left}px`,
      };
      newOrientation = "bottom";
    } else if (dir === "bottom") {
      newMenuStyle = {
        top: `${headDimension + MENU_SPACING}px`,
        left: `-${left}px`,
      };
    }

    return Object.assign({}, newMenuStyle, {
      "min-height": `${menuDimension.height}px`,
      width: `${menuDimension.width}px`,
      newOrientation
    });
  },
  setupMenuPosition: (element, position, flipOnEdges, menuContainer) => {

    const { top, bottom, left, right } = element.getBoundingClientRect();
    const { innerWidth: screenWidth, innerHeight: screenHeight } = window;
    const menuContWidth = menuContainer.clientWidth;
    const menuContHalfWidth = Math.ceil(menuContWidth / 2);
    let newPosition: Position | null = null;

    let flipMenu = false; 

    if (flipOnEdges) {
      flipMenu = false;
    }

    // reposition if the menu head goes below the bottom of the viewport
    if (bottom > screenHeight) {
      newPosition = {
        left: position.left,
        top: position.top - (bottom - screenHeight),
      };
    }

    // reposition if the menu head goes above the bottom of the viewport
    if (top < 0) {
      newPosition = {
        left: position.left,
        top: position.top + Math.abs(top),
      };
    }

    // reposition if the menu head goes beyond the left side of the viewport
    if (left < 0 || left < menuContHalfWidth) {
      newPosition = {
        left: menuContHalfWidth,
        top: position.top,
      };
    }

    // reposition if the menu head goes beyond the right side of the viewport
    if (right > screenWidth || screenWidth - right < menuContWidth) {
      newPosition = {
        left: screenWidth - menuContWidth,
        top: position.top,
      };

      if (flipOnEdges) {
        flipMenu = true;
      }
    }

    return {
      position: newPosition,
      flip: flipMenu
    }
  },
  setupInitStyle: (position: string, dimension: number) => {
    const MENU_HEAD_SPACING = 10;

    let left = 0,
      top = 0;
    switch (position) {
      case "top left":
        left = MENU_HEAD_SPACING;
        top = MENU_HEAD_SPACING;
        break;
      case "top right":
        left = window.innerWidth - dimension;
        top = MENU_HEAD_SPACING;
        break;
      case "bottom left":
        left = MENU_HEAD_SPACING;
        top = window.innerHeight - dimension;
        break;
      case "bottom right":
        left = window.innerWidth - dimension;
        top = window.innerHeight - dimension;
    }

    return {
      left: `${left}px`,
      top: `${top}px`,
      width: `${dimension}px`,
      height: `${dimension}px`,
    };
  }
}

export default utils;