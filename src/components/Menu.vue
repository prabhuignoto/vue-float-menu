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
          menuStyle,
        ]"
        :style="getTheme"
        @mousedown="
          handleMenuItemClick($event, id, name, subMenu, index, disabled)
        "
      >
        <div
          :class="menuItemClass"
          @click="$event.stopPropagation()"
        >
          <span :class="['name', { disabled }]">{{ name }}</span>
          <span
            v-if="subMenu"
            :class="[
              'chev-icon',
              { disabled, 'show-submenu': showSubMenu },
              menuStyle,
            ]"
          >
            <chev-right-icon v-if="!isAccordion" />
            <plus-icon v-if="subMenu && !showSubMenu && isAccordion" />
            <minus-icon v-if="subMenu && showSubMenu && isAccordion" />
          </span>
        </div>
        <div
          v-if="!disabled && showSubMenu"
          :class="subMenuClass"
          :style="getTheme"
        >
          <component
            :is="SubMenuComponent"
            :data="subMenu.items"
            :on-selection="onSelection"
            :theme="theme"
            :on-close="handleSubmenuClose"
            :flip="flip"
            :menu-style="menuStyle"
          />
        </div>
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
import ChevRightIcon from "./icons/ChevRightIcon.vue";
import PlusIcon from "./icons/PlusIcon.vue";
import MinusIcon from "./icons/MinusIcon.vue";
import { MenuItem } from "../types";

export default defineComponent({
  name: "Menu",
  components: {
    ChevRightIcon,
    PlusIcon,
    MinusIcon,
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
    menuStyle: {
      type: String,
      default: "slided_out",
      required: false,
    },
  },
  setup(props) {
    // tracks the index of the selected menu item
    const activeIndex = ref(-1);

    // gene unique ids for the menu items
    const menuItems = ref<MenuItem[]>(
      props.data.map((item) =>
        Object.assign({}, item, {
          id: `menu-item-${Math.round(Math.random() * 1000)}`,
          showSubMenu: false,
        })
      )
    );

    // reference to the menu itself
    const menuRef = ref();

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
        toggleMenu(id, selectFirstItem);
      }
    };

    // expands the submenu
    const toggleMenu = (id?: string, selectFirstItem?: boolean) => {
      menuItems.value = menuItems.value.map((item) =>
        Object.assign({}, item, {
          showSubMenu:
            props.menuStyle === "accordion"
              ? item.id === id && !item.showSubMenu
              : item.id === id,
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
      const len = props.data.length;

      // handle down arrow
      if (keyCode === 40) {
        if (actvIndex < len - 1) {
          activeIndex.value += 1;
        } else if (actvIndex === len - 1) {
          activeIndex.value = 0;
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
          toggleMenu(item.id, true);
        }
        // handle enter
      } else if (keyCode === 13) {
        if (item.subMenu) {
          toggleMenu(item.id, true);
        } else {
          selectMenuItem(item.name, item.id, !!item.subMenu);
        }
        // handle right arrow
      } else if (keyCode === 39) {
        if (!props.flip) {
          toggleMenu(item.id, true);
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

    const subMenuClass = computed(() => `sub-menu-wrapper ${props.menuStyle}`);

    const menuItemClass = computed(
      () => `menu-item-wrapper ${props.menuStyle}`
    );

    const isAccordion = computed(() => props.menuStyle === "accordion");

    return {
      menuItems,
      handleMenuItemClick,
      SubMenuComponent,
      getTheme,
      menuRef,
      handleKeyUp,
      activeIndex,
      handleSubmenuClose,
      subMenuClass,
      menuItemClass,
      isAccordion,
    };
  },
});
</script>


<style lang="scss" scoped src="./Menu.scss">
</style>