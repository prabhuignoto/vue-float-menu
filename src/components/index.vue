<template>
  <div
    ref="menuHeadContainer"
    :class="[{ dragActive }, 'menu-head-wrapper']"
    :style="style"
    :draggable="!fixed"
    @click="toggleMenu"
  >
    <div
      ref="menuHead"
      tabindex="0"
      :class="[{ menuActive, dragActive }, 'menu-head']"
      :style="getTheme"
      draggable="false"
      @keyup="$event.keyCode === 13 && toggleMenu($event)"
    >
      <span class="menu-head-icon">
        <slot />
        <BoxIcon v-if="isSlotEmpty" />
      </span>
    </div>
    <div
      ref="menuContainer"
      :class="[{ menuActive }, 'menu-container']"
      :style="menuStyle"
      draggable="false"
    >
      <span
        class="close-btn"
        @mousedown="$event.stopPropagation() && handleMenuClose()"
      >
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
import interact from "interactjs";

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

    // reference to the circular menu head
    const menuHead = ref<HTMLElement>();

    const menuHeadContainer = ref<HTMLElement>();

    // enables/disables menu
    const menuActive = ref(false);

    // reference to the menu container
    const menuContainer = ref<HTMLElement>();

    // generates style for the menu
    const menuStyle = ref<{ "min-height": string; width: string } | null>(null);

    // local reference of the menu direction
    const localMenuOrientation = ref("top");

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
      const menuContDOM = menuContainer.value;
      const menuHeadDOM = menuHeadContainer.value;
      const { dimension } = props;

      if (!menuContDOM || !menuHeadDOM) {
        return;
      }

      const newStyle = utils.setupMenuOrientation(
        menuHeadDOM,
        menuContDOM,
        dimension,
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

    const onCloseMenu = (event: MouseEvent | TouchEvent) => {
      if (menuActive.value) {
        const classes = Array.from((event.target as HTMLElement).classList);
        if (classes.some((cls) => cls === "sub-menu" || cls === "disabled")) {
          return;
        }
        menuActive.value = false;
      }
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

      window.addEventListener("click", onCloseMenu);
      window.addEventListener("touchmove", onCloseMenu);
      window.addEventListener("resize", onWindowResize);

      if (menuHeadContainer.value) {
        interact(menuHeadContainer.value).draggable({
          listeners: {
            start() {
              dragActive.value = true;
              menuActive.value = false;
            },
            move(event) {
              const { pageX, pageY } = event;

              if (menuHeadContainer.value && menuContainer.value) {
                // update the menuhead position
                position.value = {
                  left: pageX - Math.round(props.dimension / 2),
                  top: pageY - Math.round(props.dimension / 2),
                };
              }
            },
            end() {
              setTimeout(() => {
                dragActive.value = false;
              }, 100);
            },
          },
        });
      }
    });

    onUnmounted(() => {
      window.removeEventListener("click", onCloseMenu);
      window.removeEventListener("resize", onWindowResize);
    });

    const toggleMenu = (event: MouseEvent) => {
      if (dragActive.value) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

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

    // handler for selection
    const handleMenuItemSelection = (name: string) => {
      menuActive.value = false;
      props.onSelected && props.onSelected(name);
    };

    const getTheme = computed(() => ({
      "--background": props.theme.primary,
    }));

    return {
      dragActive,
      flipMenu,
      getInitStyle,
      getTheme,
      handleMenuClose,
      handleMenuItemSelection,
      isSlotEmpty: slots && !slots.default,
      localMenuOrientation,
      menuActive,
      menuContainer,
      menuHead,
      menuStyle,
      style,
      toggleMenu,
      menuHeadContainer,
    };
  },
});
</script>

<style lang="scss" scoped src="./index.scss">
</style>