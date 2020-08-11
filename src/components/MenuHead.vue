<template>
  <div
    class="menu-head-wrapper"
    :draggable="!fixed"
    :style="style || getInitStyle"
    @mouseup="toggleMenu"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <div class="menu-head" ref="menuHead" @mousedown="handleMouseDown" :class="{menuActive}">
      <span class="icon">
        <slot></slot>
      </span>
      <div class="menu-container" :class="{menuActive}" :style="menuStyle" ref="menuContainer">
        <Menu />
      </div>
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
} from "vue";
import Menu from "./Menu.vue";

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
  },
  props: {
    dimensions: {
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
  },
  setup(props) {
    const position = ref<{ left: number; top: number }>(null);
    const relativePostion = ref<{ x: number; y: number }>({ x: 0, y: 0 });
    const menuHead = ref(null);
    const menuActive = ref(false);
    const menuContainer = ref(null);
    const menuStyle = ref(null);
    const localMenuDirection = ref(props.menuDirection);

    const getInitStyle = computed(() => {
      let left = 0,
        top = 0;
      switch (props.position) {
        case "top left":
          left = 0;
          top = 0;
          break;
        case "top right":
          left = window.innerWidth - props.dimensions.width;
          top = 0;
          break;
        case "bottom left":
          left = 0;
          top = window.innerHeight - props.dimensions.height;
          break;
        case "bottom right":
          left = window.innerWidth - props.dimensions.width;
          top = window.innerHeight - props.dimensions.height;
      }

      return {
        left: `${left}px`,
        top: `${top}px`,
        width: `${props.dimensions.width}px`,
        height: `${props.dimensions.height}px`,
      };
    });

    const style = computed(() => {
      if (position.value) {
        const pos = unref(position);
        return {
          left: `${pos.left}px`,
          top: `${pos.top}px`,
          width: `${props.dimensions.width}px`,
          height: `${props.dimensions.height}px`,
        };
      }
    });

    const setupMenuOrientation = () => {
      const menuContDOM = menuContainer.value as HTMLElement;
      const menuHeadDOM = menuHead.value as HTMLElement;
      const { top, bottom } = menuHeadDOM.getBoundingClientRect();
      const {
        dimensions: { width, height },
      } = props;
      const left = Math.round((menuContDOM.clientWidth - width) / 2);
      const dir = unref(localMenuDirection);
      const menuHeight = menuContDOM.clientHeight;

      if (dir === "top" && menuHeight > top) {
        menuStyle.value = {
          top: `${height + MENU_SPACE}px`,
          left: `-${left}px`,
        };
        localMenuDirection.value = "top";
      } else if (dir === "top") {
        menuStyle.value = {
          bottom: `${height + MENU_SPACE}px`,
          left: `-${left}px`,
        };
      } else if (dir === "bottom" && window.innerHeight - bottom < menuHeight) {
        menuStyle.value = {
          bottom: `${height + MENU_SPACE}px`,
          left: `-${left}px`,
        };
        localMenuDirection.value = "bottom";
      } else if (dir === "bottom") {
        menuStyle.value = {
          top: `${height + MENU_SPACE}px`,
          left: `-${left}px`,
        };
      }
    };

    onMounted(() => {
      document.addEventListener("dragover", (event: DragEvent) => {
        const { pageX, pageY } = event;
        const relPosition = unref(relativePostion);
        position.value = {
          left: pageX - relPosition.x,
          top: pageY - relPosition.y,
        };
      });
      setupMenuOrientation();
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
    const toggleMenu = () => {
      menuActive.value = !menuActive.value;
    };

    // close the menu while dragging
    const handleDragStart = () => {
      menuActive.value = false;
    };

    const handleDragEnd = (event: DragEvent) => {
      setupMenuOrientation();
    };

    return {
      getInitStyle,
      handleDragEnd,
      handleDragStart,
      handleMouseDown,
      menuActive,
      menuContainer,
      menuHead,
      menuStyle,
      style,
      toggleMenu,
      localMenuDirection,
    };
  },
});
</script>

<style lang="scss" scoped>
.menu-head-wrapper {
  position: fixed;
}

.menu-head {
  align-items: center;
  background: #0080ff;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  height: 100%;
  justify-content: center;
  position: relative;
  width: 100%;

  &.menuActive {
    box-shadow: inset 0px 0px 12px 4px rgba(0, 0, 0, 0.25);
  }
}

.icon {
  align-items: center;
  color: #fff;
  display: flex;
  height: 100%;
  justify-content: center;
  width: 100%;

  svg {
    width: 100%;
    height: 100%;
  }
}

.menu-container {
  border-radius: 0.45rem;
  box-shadow: 2px 2px 12px 4px rgba(0, 0, 0, 0.2);
  max-height: 600px;
  min-height: 350px;
  position: absolute;
  visibility: hidden;
  width: 250px;

  &.menuActive {
    visibility: visible;
  }
}
</style>