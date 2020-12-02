import { Position, UtilsType } from "../types/index";

const utils: UtilsType = {
  setupMenuOrientation: (
    head,
    content,
    headDimension,
    menuDimension
  ) => {
    const { top, bottom } = head.getBoundingClientRect();
    const left = Math.round((content.clientWidth - headDimension) / 2);
    const menuHeight = content.clientHeight;
    let newOrientation = 'bottom';
    const MENU_SPACING = 15;
    let newMenuStyle = null;

    // flip to bottom if there is not enough space on top
    if (menuHeight > top) {
      newMenuStyle = {
        top: `${headDimension + MENU_SPACING}px`,
        left: `-${left}px`,
      };
      newOrientation = "top";
    } else if (window.innerHeight - bottom < menuHeight) {
      newMenuStyle = {
        bottom: `${headDimension + MENU_SPACING}px`,
        left: `-${left}px`,
      };
      newOrientation = "bottom";
    } else {
      newMenuStyle = {
        top: `${headDimension + MENU_SPACING}px`,
        left: `-${left}px`,
      };
      newOrientation = "top";
    }

    return Object.assign({}, newMenuStyle, {
      "min-height": `${menuDimension.height}px`,
      width: `${menuDimension.width}px`,
      newOrientation,
    });
  },
  setupMenuPosition: (element, position, flipOnEdges, menuContainer) => {
    const { top, bottom, left, right } = element.getBoundingClientRect();
    const { innerWidth: screenWidth, innerHeight: screenHeight } = window;
    const menuContWidth = menuContainer.clientWidth;
    const menuContHalfWidth = Math.ceil(menuContWidth / 2);
    let newPosition: Position | null = null;

    let flipMenu = false;
    let reveal = false;

    if (flipOnEdges) {
      flipMenu = false;
    }

    // reposition if the menu head goes below the bottom of the viewport
    if (bottom > screenHeight) {
      newPosition = {
        left: position.left,
        top: position.top - (bottom - screenHeight),
      };
      reveal = true;
    }

    // reposition if the menu head goes above the bottom of the viewport
    if (top < 0) {
      newPosition = {
        left: position.left,
        top: position.top + Math.abs(top),
      };
      reveal = true;
    }

    // reposition if the menu head goes beyond the left side of the viewport
    if (left < 0 || left < menuContHalfWidth) {
      newPosition = {
        left: menuContHalfWidth,
        top: position.top,
      };
      reveal = true;
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
      reveal = true;
    }

    return {
      position: newPosition,
      flip: flipMenu,
      reveal
    }
  },
  setupInitStyle: (position: string, dimension: number) => {
    const MENU_HEAD_SPACING = 15;

    let left = MENU_HEAD_SPACING,
      top = MENU_HEAD_SPACING;
    switch (position) {
      case "top left":
        left = MENU_HEAD_SPACING;
        top = MENU_HEAD_SPACING;
        break;
      case "top right":
        left = (window.innerWidth - dimension) - MENU_HEAD_SPACING;
        top = MENU_HEAD_SPACING;
        break;
      case "bottom left":
        left = MENU_HEAD_SPACING;
        top = (window.innerHeight - dimension) - MENU_HEAD_SPACING;
        break;
      case "bottom right":
        left = (window.innerWidth - dimension) - MENU_HEAD_SPACING;
        top = (window.innerHeight - dimension) - MENU_HEAD_SPACING;
    }

    return {
      left: `${left}px`,
      top: `${top}px`,
      width: `${dimension}px`,
      height: `${dimension}px`,
    };
  },
  detectDeviceType: () => {
    const screenWidth = screen.width;
    if (screenWidth <= 768) {
      return "mobile"
    }
    return "desktop"
  }
}

export default utils;