<template>
  <div
    ref="menuRef"
    class="menu-wrapper"
    tabindex="0"
    @keyup="handleKeyUp"
  >
    <ul
      class="menu-list"
      :style="getTheme"
    >
      <li
        v-for="({ id, selected, name, subMenu, showSubMenu, disabled },
                index) of menuItems"
        :key="id"
        :class="[
          { 'sub-menu': subMenu, selected, disabled, flip },
          'menu-list-item',
        ]"
        :style="getTheme"
        @mousedown="
          handleMenuItemClick($event, id, name, subMenu, index, disabled)
        "
      >
        <span
          :class="['name', { disabled }]"
          @click="$event.stopPropagation()"
        >{{ name }}</span>
        <span
          v-if="subMenu"
          :class="['chev-icon', { disabled }]"
          @click="$event.stopPropagation()"
        >
          <ChevRightIcon />
        </span>
        <span
          v-if="!disabled && showSubMenu"
          class="sub-menu-wrapper"
          :style="getTheme"
        >
          <component
            :is="SubMenuComponent"
            :data="subMenu.items"
            :on-selection="onSelection"
            :theme="theme"
            :on-close="handleSubmenuClose"
            :flip="flip"
          />
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  resolveComponent,
  computed,
  onMounted,
  watch,
  nextTick,
} from "vue";
import { nanoid } from "nanoid";
import ChevRightIcon from "./icons/ChevRightIcon.vue";
import { MenuItem } from "../types";

export default defineComponent({
  name: "Menu",
  components: {
    ChevRightIcon,
  },
  props: {
    data: {
      type: Array as PropType<MenuItem[]>,
      default: [],
    },
    flip: {
      type: Boolean,
      default: false,
    },
    onSelection: {
      type: Function as PropType<(name: string, parent?: string) => void>,
      default: null,
    },
    onClose: {
      type: Function as PropType<(keyCodeUsed?: number) => void>,
      default: null,
      required: true,
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
  },
  setup(props) {
    // tracks the index of the selected menu item
    const activeIndex = ref(-1);

    // gene unique ids for the menu items
    const menuItems = ref<MenuItem[]>(
      props.data.map((item) =>
        Object.assign({}, item, {
          id: nanoid(),
          showSubMenu: false,
        })
      )
    );

    // reference to the menu itself
    const menuRef = ref<HTMLElement>();

    // resolve this component for usage innested menus
    const SubMenuComponent = resolveComponent("Menu");

    const selectMenuItem = (
      name: string,
      id?: string,
      subMenu?: boolean,
      selectFirstItem?: boolean
    ) => {
      if (!subMenu) {
        props.onSelection && props.onSelection(name);
      } else {
        expandMenu(id, selectFirstItem);
      }
    };

    // expands the submenu
    const expandMenu = (id?: string, selectFirstItem?: boolean) => {
      menuItems.value = menuItems.value.map((item) =>
        Object.assign({}, item, {
          showSubMenu: item.id === id,
          subMenu:
            selectFirstItem && item.id === id
              ? {
                  items: item.subMenu?.items.map((x, index) =>
                    Object.assign({}, x, {
                      selected: index === 0,
                    })
                  ),
                }
              : item.subMenu,
        })
      );
    };

    const handleMenuItemClick = (
      event: MouseEvent,
      id: string,
      name: string,
      subMenu: boolean,
      index: number,
      disabled: boolean
    ) => {
      event.stopPropagation();
      event.preventDefault();

      if (disabled) {
        return;
      }

      activeIndex.value = index;

      selectMenuItem(name, id, subMenu, false);
    };

    // gets theme colors
    const getTheme = computed(() => ({
      "--background": props.theme.primary,
      "--menu-background": props.theme.menuBgColor,
      "--menu-text-color": props.theme.textColor,
      "--text-selected-color": props.theme.textSelectedColor,
    }));

    // life cycle mount
    onMounted(() => {
      // focus the menu on mount
      menuRef.value?.focus();

      // reset the activeindex to 0, if first item is already selected.
      // this is mostly the case while navigating via keyboard
      nextTick(() => {
        const isFirstItemSelected = props.data[0].selected;
        if (isFirstItemSelected) {
          activeIndex.value = 0;
        }
      });
    });

    // keyboard nav handler
    const handleKeyUp = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const actvIndex = activeIndex.value;

      // get the active item
      const item = menuItems.value[actvIndex > -1 ? actvIndex : 0];
      const keyCode = event.keyCode;

      // handle down arrow
      if (keyCode === 40) {
        if (actvIndex < props.data.length - 1) {
          activeIndex.value += 1;
        }
        // handle up arrow
      } else if (keyCode === 38) {
        if (actvIndex > 0) {
          activeIndex.value -= 1;
        }
        // handle left arrow
      } else if (keyCode === 37) {
        if (!props.flip) {
          props.onClose(keyCode);
        } else {
          expandMenu(item.id, true);
        }
        // handle enter
      } else if (keyCode === 13) {
        if (item.subMenu) {
          expandMenu(item.id, true);
        } else {
          selectMenuItem(item.name, item.id, !!item.subMenu);
        }
        // handle right arrow
      } else if (keyCode === 39) {
        if (!props.flip) {
          expandMenu(item.id, true);
        } else {
          props.onClose(keyCode);
        }
      } else if (keyCode === 27) {
        props.onClose();
      }
    };

    const handleSubmenuClose = () => {
      menuItems.value = menuItems.value.map((item) => {
        return Object.assign({}, item, {
          showSubMenu: false,
        });
      });
      menuRef.value?.focus();
    };

    watch(activeIndex, (val) => {
      menuItems.value = menuItems.value.map((item, index) => {
        return Object.assign({}, item, {
          selected: index === val,
        });
      });
    });

    return {
      menuItems,
      handleMenuItemClick,
      SubMenuComponent,
      getTheme,
      menuRef,
      handleKeyUp,
      activeIndex,
      handleSubmenuClose,
    };
  },
});
</script>


<style lang="scss" scoped src="./Menu.scss">
</style>