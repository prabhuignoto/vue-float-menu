import { PropType } from 'vue';

import { MenuItem, Theme, ThemeDefault } from '../types';

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
    default: 'bottom right',
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
    type: Object as PropType<Theme>,
    required: false,
    default: ThemeDefault,
  },

  preserveMenuPosition: {
    type: Boolean,
    default: true,
  },

  menuStyle: {
    type: String,
    default: 'slide-out',
    required: false,
  },
};

export default MenuProps;
