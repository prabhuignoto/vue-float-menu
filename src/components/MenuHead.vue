<template>
  <div
    class="menu-head-wrapper"
    :draggable="!fixed"
    :style="style || getInitStyle"
    @dragstart="handleDragStart"
  >
    <div
      ref="menuHead"
      tabindex="0"
      class="menu-head"
      :class="{menuActive}"
      @mouseup="toggleMenu($event)"
      @mousedown="handleMouseDown"
      @blur="handleBlur($event)"
    >
      <span class="icon">
        <slot />
      </span>
    </div>
    <div
      ref="menuContainer"
      class="menu-container"
      :class="{menuActive}"
      :style="menuStyle"
      @mousedown="handleMenuClick($event)"
    >
      <span
        class="close-btn"
        @click="handleMenuClose"
      >
        <XIcon />
      </span>
      <Menu
        v-if="menuActive"
        :data="menuData"
        :flip="flipMenu"
        :on-selection="handleMenuItemSelection"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  unref,
  PropType,
  computed,
  nextTick,
} from "vue";
import Menu from "./Menu.vue";
import { Menu as MenuModel } from "./Menu.vue";
import XIcon from "./XIcon.vue";

const MENU_SPACE = 10;

interface HeadPosition {
  "top left";
  "top right";
  "bottom left";
  "bottom right";
}

export default defineComponent({
  name: "MenuHead",
  components: {
    Menu,
    XIcon,
  },
  props: {
    dimension: {
      type: Object as PropType<{ width: number; height: number }>,
      default: {
        width: 3,
        height: 3,
      },
    },
    position: {
      type: String,
      default: "bottom right",
    },
    fixed: {
      type: Boolean,
      default: false,
    },
    menuDirection: {
      type: String,
      default: "top",
    },
    menuDimensions: {
      type: Object as PropType<{ height: number; width: number }>,
      default: {
        height: 250,
        width: 250,
      },
    },
    menuData: {
      type: Object as PropType<MenuModel>,
      default: {
        items: [],
      },
    },
    useCustomContent: {
      type: Boolean,
      default: false,
    },
    // eslint-disable-next-line vue/require-default-prop
    onSelected: {
      type: Function as PropType<(val: string) => void>
    }
  },
  setup(props) {
    // position of the circular menu head
    const position = ref<{ left: number; top: number }>(null);

    // captures the actual mouse click inside the menu head. this is used to accurately position the menu head
    const relativePostion = ref<{ x: number; y: number }>({ x: 0, y: 0 });

    // reference to the circular menu head
    const menuHead = ref(null);

    // enables/disables menu
    const menuActive = ref(false);

    // reference to the menu container
    const menuContainer = ref(null);

    // generates style for the menu
    const menuStyle = ref(null);

    // local reference of the menu direction
    const localMenuDirection = ref(props.menuDirection);

    // flip menu content
    const flipMenu = ref(false);

    // sets the initial style
    const getInitStyle = computed(() => {
      let left = 0,
        top = 0;
      switch (props.position) {
        case "top left":
          left = 20;
          top = 20;
          break;
        case "top right":
          left = window.innerWidth - props.dimension.width;
          top = 20;
          break;
        case "bottom left":
          left = 20;
          top = window.innerHeight - props.dimension.height;
          break;
        case "bottom right":
          left = window.innerWidth - props.dimension.width;
          top = window.innerHeight - props.dimension.height;
      }

      return {
        left: `${left}px`,
        top: `${top}px`,
        width: `${props.dimension.width}px`,
        height: `${props.dimension.height}px`,
      };
    });

    // compute the style
    const style = computed(() => {
      if (position.value) {
        const pos = unref(position);
        return {
          left: `${pos.left}px`,
          top: `${pos.top}px`,
          width: `${props.dimension.width}px`,
          height: `${props.dimension.height}px`,
        };
      }
    });

    // manages the orientation of the menu (top or bottom)
    // when enough space is not available on either top or bottom, the menu is automatically flipped
    const setupMenuOrientation = () => {
      const menuContDOM = menuContainer.value as HTMLElement;
      const menuHeadDOM = menuHead.value as HTMLElement;

      const { top, bottom } = menuHeadDOM.getBoundingClientRect();
      const {
        dimension: { width, height },
      } = props;
      const left = Math.round((menuContDOM.clientWidth - width) / 2);
      const dir = unref(localMenuDirection);
      const menuHeight = menuContDOM.clientHeight;

      let newMenuStyle = null;

      // flip to bottom if there is not enough space on top
      if (dir === "top" && menuHeight > top) {
        newMenuStyle = {
          top: `${height + MENU_SPACE}px`,
          left: `-${left}px`,
        };
        localMenuDirection.value = "top";
      } else if (dir === "top") {
        newMenuStyle = {
          bottom: `${height + MENU_SPACE}px`,
          left: `-${left}px`,
        };
        // flip menu to top if there is no enough space at bottom
      } else if (dir === "bottom" && window.innerHeight - bottom < menuHeight) {
        newMenuStyle = {
          bottom: `${height + MENU_SPACE}px`,
          left: `-${left}px`,
        };
        localMenuDirection.value = "bottom";
      } else if (dir === "bottom") {
        newMenuStyle = {
          top: `${height + MENU_SPACE}px`,
          left: `-${left}px`,
        };
      }

      menuStyle.value = Object.assign({}, newMenuStyle, {
        "min-height": `${props.menuDimensions.height}px`,
        width: `${props.menuDimensions.width}px`,
      });
    };

    // this function repositions the menu head whenever it goes out of screen edges.
    const adjustMenuHeadPosition = (element: HTMLElement) => {
      const { top, bottom, left, right } = element.getBoundingClientRect();
      const { innerWidth: screenWidth, innerHeight: screenHeight } = window;
      const positionValue = unref(position);
      const menuContWidth = (menuContainer.value as HTMLElement).clientWidth;
      const menuContHalfWidth = Math.ceil(menuContWidth / 2);

      if (!positionValue) {
        return;
      }

      flipMenu.value = false;

      // resposition if the menuhead goes below the bottom of the viewport
      if (bottom > screenHeight) {
        position.value = {
          left: positionValue.left,
          top: positionValue.top - (bottom - screenHeight),
        };
      }

      // resposition if the menuhead goes above the bottom of the viewport
      if (top < 0) {
        position.value = {
          left: positionValue.left,
          top: positionValue.top + Math.abs(top),
        };
      }

      // resposition if the menuhead goes beyond the leftside of the viewport
      if (left < 0 || left < menuContHalfWidth) {
        position.value = {
          left: menuContHalfWidth,
          top: positionValue.top,
        };
      }

      // resposition if the menuhead goes beyond the rightside of the viewport
      if (right > screenWidth || screenWidth - right < menuContWidth) {
        position.value = {
          left: screenWidth - menuContWidth,
          top: positionValue.top,
        };
        flipMenu.value = true;
      }
    };

    onMounted(() => {
      // update the menuhead position on drag
      document.addEventListener("dragover", (event: DragEvent) => {
        const { pageX, pageY } = event;
        const relPosition = unref(relativePostion);

        // update the menuhead position
        position.value = {
          left: pageX - relPosition.x,
          top: pageY - relPosition.y,
        };
      });

      // adjust menu orientation on load
      setupMenuOrientation();
      adjustMenuHeadPosition(menuHead.value as HTMLElement);

      nextTick(() => (menuHead.value as HTMLElement).focus());
    });

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.currentTarget as HTMLElement;
      const classList = Array.from(target.classList);

      if (classList.some((cls) => cls === "menu-head" || cls === "icon")) {
        const rect = target.getBoundingClientRect();
        relativePostion.value = {
          x: event.clientX - rect.x,
          y: event.clientY - rect.y,
        };
      }
    };

    // toggles the menu
    const toggleMenu = (event: MouseEvent) => {
      const classes = Array.from((event.target as HTMLElement).classList);
      if (classes.some((cls) => cls === "menu-list-item")) {
        return;
      }

      if (!menuActive.value) {
        setupMenuOrientation();
        adjustMenuHeadPosition(menuHead.value as HTMLElement);
      }

      nextTick(() => {
        menuActive.value = !menuActive.value;
      });
    };

    const handleMenuClose = () => {
      menuActive.value = false;
    };

    // close the menu while dragging
    const handleDragStart = () => {
      menuActive.value = false;
    };

    const handleMenuItemSelection = (id: string, name: string) => {
      menuActive.value = false;
      props.onSelected(name);
    };

    const handleBlur = (event: MouseEvent) => {
      menuActive.value = false;
    };

    const handleMenuClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };

    return {
      flipMenu,
      getInitStyle,
      handleBlur,
      handleDragStart,
      handleMenuClick,
      handleMenuClose,
      handleMenuItemSelection,
      handleMouseDown,
      localMenuDirection,
      menuActive,
      menuContainer,
      menuHead,
      menuStyle,
      style,
      toggleMenu,
    };
  },
});
</script>

<style lang="scss" scoped src="./MenuHead.scss">
</style>