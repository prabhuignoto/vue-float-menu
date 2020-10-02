import { PropType } from 'vue';
import { MenuItem } from '../types';

export default {
  dimension: {
    type: Number,
    default: 3,
  },
  position: {
    type: String,
    default: "bottom right",
  },
  fixed: {
    type: Boolean,
    default: false,
  },
  menuOrientation: {
    type: String,
    default: "top",
  },
  menuDimension: {
    type: Object as PropType<{ height: number; width: number }>,
    default: {
      height: 250,
      width: 250,
    },
  },
  menuData: {
    type: Array as PropType<MenuItem[]>,
    default: [],
  },
  useCustomContent: {
    type: Boolean,
    default: false,
  },
  onSelected: {
    type: Function as PropType<(val: string) => void>,
    default: null,
  },
  flipOnEdges: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: Object as PropType<{
      primary: string;
      textColor: string;
      menuBgColor: string;
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
}