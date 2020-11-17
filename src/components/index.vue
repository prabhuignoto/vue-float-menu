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
        <MenuIcon v-if="isSlotEmpty" />
      </span>
    </div>
    <div
      ref="menuContainer"
      :class="[{ menuActive }, 'menu-container']"
      :style="menuCSS"
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
        :menu-style="menuStyle"
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
import MenuIcon from "./icons/MenuIcon.vue";
import utils from "../utils";
import Props from "./props";
import interact from "interactjs";

interface Position {
  left: number;
  top: number;
}
export default defineComponent({
  name: "FloatMenu",
  components: {
    Menu,
    XIcon,
    MenuIcon,
  },
  props: Props,
  setup(props, { slots }) {
    // position of the circular menu head
    const position = ref<Position | null>(null);

    const previousPosition = ref<Position | null>(null);

    // reference to the circular menu head
    const menuHead = ref();

    const menuHeadContainer = ref();

    // enables/disables menu
    const menuActive = ref(false);

    // reference to the menu container
    const menuContainer = ref();

    // generates style for the menu
    const menuCSS = ref<{ "min-height": string; width: string } | null>(null);

    // local reference of the menu direction
    const menuOrientation = ref("top");

    // flip menu content
    const flipMenu = ref(false);

    // drag active
    const dragActive = ref(false);

    // sets the initial style
    const getInitStyle = computed(() => {
      const position = utils.setupInitStyle(props.position, props.dimension);
      return position;
    });

    const isRevealing = ref(false);

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
      menuOrientation.value = newStyle.newOrientation;
      menuCSS.value = newStyle;
    };

    // manages the position of the menu head. make sure the menu stays within the screen bounds
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
        isRevealing.value = newPosition.reveal;

        if (newPosition.position) {
          position.value = newPosition.position;
        }
      }
    };

    const onCloseMenu = (event: MouseEvent | TouchEvent) => {
      if (menuActive.value) {
        if (isRevealing.value) {
          position.value = previousPosition.value;
        }
        const classes = Array.from((event.target as HTMLElement).classList);
        if (classes.some((cls) => cls === "sub-menu" || cls === "disabled")) {
          return;
        }
        menuActive.value = false;
      }
    };

    // handler for window resize event
    const onWindowResize = () => {
      const intialStyle = utils.setupInitStyle(props.position, props.dimension);

      position.value = {
        left: +intialStyle.left.replace(/px/gi, ""),
        top: +intialStyle.top.replace(/px/gi, ""),
      };
    };

    onMounted(() => {
      // setup the initial style on load
      const intialStyle = utils.setupInitStyle(props.position, props.dimension);
      const initPosition = {
        left: +intialStyle.left.replace(/px/gi, ""),
        top: +intialStyle.top.replace(/px/gi, ""),
      };
      position.value = initPosition;
      previousPosition.value = initPosition;

      // close the menu when clicked outside
      window.addEventListener("click", onCloseMenu);

      // attach handler for window resize event
      window.addEventListener("resize", onWindowResize);

      // initialize interact js
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
            end(event) {
              const { pageX, pageY } = event;
              previousPosition.value = {
                left: pageX - Math.round(props.dimension / 2),
                top: pageY - Math.round(props.dimension / 2),
              };
              setTimeout(() => {
                dragActive.value = false;
              }, 100);
            },
          },
        });
      }
    });

    // cleanup
    onUnmounted(() => {
      window.removeEventListener("click", onCloseMenu);
      window.removeEventListener("resize", onWindowResize);
    });

    // open/close the menu
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
      } else {
        if (isRevealing.value) {
          position.value = previousPosition.value;
        }
      }

      nextTick(() => {
        menuActive.value = !menuActive.value;
      });
    };

    // close the menu from child component (./menu.vue)
    const handleMenuClose = (keyCode?: number) => {
      if (keyCode === 37 || keyCode === 39) {
        return;
      }
      menuActive.value = false;
      if (isRevealing.value) {
        position.value = previousPosition.value;
      }

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
      menuOrientation,
      menuActive,
      menuContainer,
      menuHead,
      menuCSS,
      style,
      toggleMenu,
      menuHeadContainer,
    };
  },
});
</script>

<style lang="scss" scoped src="./index.scss">
</style>