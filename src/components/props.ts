import { PropType } from "vue";
import { MenuItem } from '../types';

const MenuProps = {
  /**
  * dimension of the menu head. sets both the width and height
  *
  * @type {number}
  */
  dimension: {
    type: Number,
    default: 45,
  },

  /**
  * sets the initial position of the menu.
  *
  * @type {string}
  */
  position: {
    type: String,
    default: "bottom right",
  },

  /**
  * disables dragging and sets the position to fixed.
  *
  * @type {boolean}
  */
  fixed: {
    type: Boolean,
    default: false,
  },

  /**
  * sets the height and width of the menu.
  *
  * @type {Object}
  */
  menuDimension: {
    type: Object as PropType<{ height: number; width: number }>,
    default: {
      height: 250,
      width: 250,
    },
  },

  /**
  * data to generate the menu. array of type MenuItem
  *
  * @type {array}
  */
  menuData: {
    type: Array as PropType<MenuItem[]>,
    default: [],
  },
  useCustomContent: {
    type: Boolean,
    default: false,
  },

  /**
  * hook that gets called on selection of the menu item.
  *
  * @type {function}
  */
  onSelected: {
    type: Function as PropType<(val: string) => void>,
    default: null,
  },

  /**
  * flips the content of the menu on the right edges of the screen
  *
  * @type {boolean}
  */
  flipOnEdges: {
    type: Boolean,
    default: false,
  },

  /**
  * theme object.
  *
  * @type {boolean}
  */
  theme: {
    type: Object as PropType<{
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
    }>,
    required: false,
    default: {
      primary: "#0080ff",
      textColor: "#000",
      menuBgColor: "#fff",
      textSelectedColor: "#fff",
    },
  },

  preserveMenuPosition: {
    type: Boolean,
    default: true
  },

  menuStyle: {
    type: String,
    default: "slide-out"
  }
}

export default MenuProps;