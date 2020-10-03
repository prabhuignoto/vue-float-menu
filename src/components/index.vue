<template>
  <div
    :class="[{ dragActive }, 'menu-head-wrapper']"
    :draggable="!fixed"
    :style="style"
    @dragstart="handleDragStart"
    @touchmove="handleDragStart"
    @dragend="handleDragEnd"
  >
    <div
      ref="menuHead"
      tabindex="0"
      :class="[{ menuActive, dragActive }, 'menu-head']"
      :style="getTheme"
      @mouseup="toggleMenu"
      @mousedown="handleMouseDown"
      @keyup="$event.keyCode === 13 && toggleMenu($event)"
    >
      <span class="menu-head-icon" @click="$event.stopPropagation()">
        <slot />
        <BoxIcon v-if="isSlotEmpty" />
      </span>
    </div>
    <div
      ref="menuContainer"
      :class="[{ menuActive }, 'menu-container']"
      :style="menuStyle"
      @mousedown="handleMenuClick"
    >
      <span class="close-btn" @click="handleMenuClose">
        <XIcon />
      </span>
      <Menu
        v-if="menuActive"
        :data="menuData"
        :flip="flipMenu"
        :on-selection="handleMenuItemSelection"
        :theme="theme"
        :on-close="handleMenuClose"
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
  computed,
  nextTick,
  onUnmounted,
} from "vue";
import Menu from "./Menu.vue";
import XIcon from "./icons/XIcon.vue";
import BoxIcon from "./icons/BoxIcon.vue";
import utils from "../utils";
import Props from "./props";

export default defineComponent({
  name: "FloatMenu",
  components: {
    Menu,
    XIcon,
    BoxIcon,
  },
  props: Props,
  setup(props, { slots }) {
    // position of the circular menu head
    const position = ref<{ left: number; top: number } | null>(null);

    // captures the actual mouse click inside the menu head. this is used to accurately position the menu head
    const relativePostion = ref<{ x: number; y: number }>({ x: 0, y: 0 });

    // reference to the circular menu head
    const menuHead = ref<HTMLDivElement>();

    // enables/disables menu
    const menuActive = ref(false);

    // reference to the menu container
    const menuContainer = ref<HTMLDivElement>();

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
      const position = utils.setupInitStyle(props.position, props.dimension);
      return position;
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
      const menuContDOM = menuContainer.value as HTMLElement;
      const menuHeadDOM = menuHead.value as HTMLElement;
      const { dimension } = props;
      const dir = unref(localMenuOrientation);
      const newStyle = utils.setupMenuOrientation(
        menuHeadDOM,
        menuContDOM,
        dimension,
        dir,
        props.menuDimension
      );

      localMenuOrientation.value = newStyle.newOrientation;
      menuStyle.value = newStyle;
    };

    // this function repositions the menu head whenever it goes out of screen edges.
    const adjustFloatMenuPosition = (element: HTMLElement) => {
      const positionRef = unref(position);

      if (!positionRef) {
        return;
      }

      if (menuContainer.value) {
        const newPosition = utils.setupMenuPosition(
          element,
          positionRef,
          props.flipOnEdges,
          menuContainer.value
        );
        flipMenu.value = newPosition.flip;

        if (newPosition.position) {
          position.value = newPosition.position;
        }
      }
    };

    const onDragOver = (event: DragEvent) => {
      const { pageX, pageY } = event;
      const relPosition = unref(relativePostion);

      if (dragActive.value) {
        // update the menuhead position
        position.value = {
          left: pageX - relPosition.x,
          top: pageY - relPosition.y,
        };
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      const { pageX, pageY } = event.targetTouches[0];

      const relPosition = unref(relativePostion);

      if (dragActive.value) {
        // update the menuhead position
        position.value = {
          left: pageX - relPosition.x,
          top: pageY - relPosition.y,
        };
      }
    };

    const onCloseMenu = (event: MouseEvent) => {
      const classes = Array.from((event.target as HTMLElement).classList);
      if (classes.some((cls) => cls === "sub-menu" || cls === "disabled")) {
        return;
      }
      menuActive.value = false;
    };

    const onWindowResize = () => {
      const intialStyle = utils.setupInitStyle(props.position, props.dimension);

      position.value = {
        left: +intialStyle.left.replace(/px/gi, ""),
        top: +intialStyle.top.replace(/px/gi, ""),
      };
    };

    onMounted(() => {
      const intialStyle = utils.setupInitStyle(props.position, props.dimension);

      position.value = {
        left: +intialStyle.left.replace(/px/gi, ""),
        top: +intialStyle.top.replace(/px/gi, ""),
      };

      // update the menuhead position on drag
      document.addEventListener("dragover", onDragOver);
      document.addEventListener("touchmove", onTouchMove);
      window.addEventListener("click", onCloseMenu);
      window.addEventListener("resize", onWindowResize);
    });

    // liecycle on destroy
    onUnmounted(() => {
      document.removeEventListener("dragover", onDragOver);
      document.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("click", onCloseMenu);
      window.removeEventListener("resize", onWindowResize);
    });

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.currentTarget as HTMLElement;
      const classList = Array.from(target.classList);

      if (
        classList.some((cls) => cls === "menu-head" || cls === "menu-head-icon")
      ) {
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
        adjustFloatMenuPosition(menuHead.value as HTMLElement);
      }

      nextTick(() => {
        menuActive.value = !menuActive.value;
      });
    };

    const handleMenuClose = (keyCode?: number) => {
      if (keyCode === 37 || keyCode === 39) {
        return;
      }
      menuActive.value = false;
      nextTick(() => {
        menuHead.value?.focus();
      });
    };
    // const handleBlur = () => (menuActive.value = false);

    // close the menu while dragging
    const handleDragStart = () => {
      menuActive.value = false;
      dragActive.value = true;
    };

    // set drag active to false
    const handleDragEnd = () => (dragActive.value = false);

    // handler for selection
    const handleMenuItemSelection = (name: string) => {
      menuActive.value = false;
      props.onSelected && props.onSelected(name);
    };

    const handleMenuClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const getTheme = computed(() => ({
      "--background": props.theme.primary,
    }));

    return {
      dragActive,
      flipMenu,
      getInitStyle,
      getTheme,
      handleDragEnd,
      handleDragStart,
      handleMenuClick,
      handleMenuClose,
      handleMenuItemSelection,
      handleMouseDown,
      isSlotEmpty: slots && !slots.default,
      localMenuOrientation,
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

<style lang="scss" scoped src="./index.scss">
</style>