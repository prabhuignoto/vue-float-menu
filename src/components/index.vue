<template>
  <div
    class="menu-head-wrapper"
    :draggable="!fixed"
    :style="style || getInitStyle"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <div
      ref="menuHead"
      tabindex="0"
      class="menu-head"
      :class="{menuActive, dragActive}"
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
import Menu, { MenuItem } from "./Menu.vue";
import XIcon from "./icons/XIcon.vue";

const MENU_SPACE = 10;

export default defineComponent({
  name: "FloatMenu",
  components: {
    Menu,
    XIcon,
  },
  props: {
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
  },
  setup(props) {
    // position of the circular menu head
    const position = ref<{ left: number; top: number } | null>(null);

    // captures the actual mouse click inside the menu head. this is used to accurately position the menu head
    const relativePostion = ref<{ x: number; y: number }>({ x: 0, y: 0 });

    // reference to the circular menu head
    const menuHead = ref(null);

    // enables/disables menu
    const menuActive = ref(false);

    // reference to the menu container
    const menuContainer = ref(null);

    // generates style for the menu
    const menuStyle = ref<{ "min-height": string; width: string } | null>(null);

    // local reference of the menu direction
    const localMenuOrientation = ref(props.menuOrientation);

    // flip menu content
    const flipMenu = ref(false);

    // drag active
    const dragActive = ref(false);

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
          left = window.innerWidth - props.dimension;
          top = 20;
          break;
        case "bottom left":
          left = 20;
          top = window.innerHeight - props.dimension;
          break;
        case "bottom right":
          left = window.innerWidth - props.dimension;
          top = window.innerHeight - props.dimension;
      }

      return {
        left: `${left}px`,
        top: `${top}px`,
        width: `${props.dimension}px`,
        height: `${props.dimension}px`,
      };
    });

    // compute the style
    const style = computed(() => {
      if (position.value) {
        const pos = unref(position);

        if (pos) {
          return {
            left: `${pos.left}px`,
            top: `${pos.top}px`,
            width: `${props.dimension}px`,
            height: `${props.dimension}px`,
          };
        }
      }
    });

    // manages the orientation of the menu (top or bottom)
    // when enough space is not available on either top or bottom, the menu is automatically flipped
    const setupMenuOrientation = () => {
      const menuContDOM = (menuContainer.value as unknown) as HTMLElement;
      const menuHeadDOM = (menuHead.value as unknown) as HTMLElement;

      const { top, bottom } = menuHeadDOM.getBoundingClientRect();
      const { dimension } = props;
      const left = Math.round((menuContDOM.clientWidth - dimension) / 2);
      const dir = unref(localMenuOrientation);
      const menuHeight = menuContDOM.clientHeight;

      let newMenuStyle = null;

      // flip to bottom if there is not enough space on top
      if (dir === "top" && menuHeight > top) {
        newMenuStyle = {
          top: `${dimension + MENU_SPACE}px`,
          left: `-${left}px`,
        };
        localMenuOrientation.value = "top";
      } else if (dir === "top") {
        newMenuStyle = {
          bottom: `${dimension + MENU_SPACE}px`,
          left: `-${left}px`,
        };
        // flip menu to top if there is no enough space at bottom
      } else if (dir === "bottom" && window.innerHeight - bottom < menuHeight) {
        newMenuStyle = {
          bottom: `${dimension + MENU_SPACE}px`,
          left: `-${left}px`,
        };
        localMenuOrientation.value = "bottom";
      } else if (dir === "bottom") {
        newMenuStyle = {
          top: `${dimension + MENU_SPACE}px`,
          left: `-${left}px`,
        };
      }

      menuStyle.value = Object.assign({}, newMenuStyle, {
        "min-height": `${props.menuDimension}px`,
        width: `${props.menuDimension}px`,
      });
    };

    // this function repositions the menu head whenever it goes out of screen edges.
    const adjustFloatMenuPosition = (element: HTMLElement) => {
      const { top, bottom, left, right } = element.getBoundingClientRect();
      const { innerWidth: screenWidth, innerHeight: screenHeight } = window;
      const positionValue = unref(position);
      const menuContWidth = ((menuContainer.value as unknown) as HTMLElement)
        .clientWidth;
      const menuContHalfWidth = Math.ceil(menuContWidth / 2);

      if (!positionValue) {
        return;
      }

      if (props.flipOnEdges) {
        flipMenu.value = false;
      }

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

        if (props.flipOnEdges) {
          flipMenu.value = true;
        }
      }
    };

    onMounted(() => {
      // update the menuhead position on drag
      document.addEventListener("dragover", (event: DragEvent) => {
        const { pageX, pageY } = event;
        const relPosition = unref(relativePostion);

        if (dragActive.value) {
          // update the menuhead position
          position.value = {
            left: pageX - relPosition.x,
            top: pageY - relPosition.y,
          };
        }
      });

      // adjust menu orientation on load
      setupMenuOrientation();
      adjustFloatMenuPosition((menuHead.value as unknown) as HTMLElement);

      nextTick(() => ((menuHead.value as unknown) as HTMLElement).focus());
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
        adjustFloatMenuPosition((menuHead.value as unknown) as HTMLElement);
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
      dragActive.value = true;
    };

    const handleDragEnd = () => {
      dragActive.value = false;
    };

    const handleMenuItemSelection = (id: string, name: string) => {
      menuActive.value = false;
      props.onSelected && props.onSelected(name);
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
      handleDragEnd,
      handleDragStart,
      handleMenuClick,
      handleMenuClose,
      handleMenuItemSelection,
      handleMouseDown,
      localMenuOrientation,
      menuActive,
      menuContainer,
      menuHead,
      menuStyle,
      style,
      toggleMenu,
      dragActive,
    };
  },
});
</script>

<style lang="scss" scoped src="./index.scss">
</style>