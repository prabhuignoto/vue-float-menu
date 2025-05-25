<template>
  <div ref="menuRef" class="menu-wrapper" tabindex="0" @keyup="handleKeyUp">
    <ul class="menu-list" :style="getTheme">
      <li
        v-for="(
          { id, selected, name, subMenu, showSubMenu, disabled, divider, iconSlot }, index
        ) of menuItems"
        :key="id"
        :class="[
          { 'sub-menu': subMenu, selected, disabled, flip, divider },
          'menu-list-item',
          menuStyle,
        ]"
        :style="getTheme"
        @mousedown="
          handleMenuItemClick($event, id || '', name || '', !!subMenu, index, !!disabled, !!divider)
        "
      >
        <template v-if="!divider">
          <div :class="menuItemClass" @click="$event.stopPropagation()">
            <span v-if="iconSlot" class="menu-item-icon">
              <slot :name="iconSlot" />
            </span>
            <span :class="['name', { disabled }]">{{ name }}</span>
            <span
              v-if="subMenu"
              :class="['chev-icon', { disabled, 'show-submenu': showSubMenu }, menuStyle]"
            >
              <chev-right-icon v-if="!isAccordion" />
              <plus-icon v-if="subMenu && !showSubMenu && isAccordion" />
              <minus-icon v-if="subMenu && showSubMenu && isAccordion" />
            </span>
          </div>
          <div v-if="!disabled && showSubMenu" :class="subMenuClass" :style="getTheme">
            <component
              :is="SubMenuComponent"
              :data="subMenu?.items || []"
              :on-selection="onSelection"
              :theme="theme"
              :on-close="handleSubmenuClose"
              :flip="flip"
              :menu-style="menuStyle"
            >
              <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                <slot :name="slot" v-bind="scope" />
              </template>
            </component>
          </div>
        </template>
        <template v-else>
          <span class="menu-item-divider" />
        </template>
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
} from 'vue';
import ChevRightIcon from './icons/ChevRightIcon.vue';
import PlusIcon from './icons/PlusIcon.vue';
import MinusIcon from './icons/MinusIcon.vue';
import { MenuItem, Theme, ThemeDefault } from '../types';

export default defineComponent({
  name: 'FloatMenu',
  components: {
    ChevRightIcon,
    PlusIcon,
    MinusIcon,
  },
  props: {
    data: {
      type: Array as PropType<MenuItem[]>,
      default: () => [],
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
      type: Function as PropType<(keyCodeUsed?: string) => void>,
      default: null,
      required: true,
    },
    theme: {
      type: Object as PropType<Theme>,
      required: false,
      default: ThemeDefault,
    },
    menuStyle: {
      type: String,
      default: 'slided_out',
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
          id: `menu-item-${Math.random().toString(16)}`,
          showSubMenu: false,
        })
      )
    );

    // reference to the menu itself
    const menuRef = ref();

    // resolve this component for usage innested menus
    const SubMenuComponent = resolveComponent('FloatMenu');

    const selectMenuItem = (
      name?: string,
      id?: string,
      subMenu?: boolean,
      selectFirstItem?: boolean
    ) => {
      if (!subMenu) {
        name && props?.onSelection(name);
      } else {
        toggleMenu(id, selectFirstItem);
      }
    };

    // expands the submenu
    const toggleMenu = (id?: string, selectFirstItem?: boolean) => {
      menuItems.value = menuItems.value.map((item) =>
        Object.assign({}, item, {
          showSubMenu: item.id === id && !item.showSubMenu,
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
      disabled: boolean,
      divider: boolean
    ) => {
      event.stopPropagation();
      event.preventDefault();

      if (disabled || divider) {
        return;
      }

      activeIndex.value = index;

      selectMenuItem(name, id, subMenu, false);
    };

    // gets theme colors
    const getTheme = computed(() => ({
      '--background': props.theme.primary,
      '--menu-background': props.theme.menuBgColor,
      '--menu-text-color': props.theme.textColor,
      '--text-selected-color': props.theme.textSelectedColor,
      '--hover-background': props.theme.hoverBackground,
    }));

    // life cycle mount
    onMounted(() => {
      // focus the menu on mount
      menuRef.value?.focus();

      // reset the activeindex to 0, if first item is already selected.
      // this is mostly the case while navigating via keyboard
      nextTick(() => {
        const isFirstItemSelected = props.data[0]?.selected;
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
      const keyCode = event.key;
      const len = props.data.length;
      const flip = props.flip;

      // handle down arrow
      if (keyCode === 'ArrowDown') {
        if (actvIndex < len - 1) {
          const nextItemIsDivider = menuItems.value[actvIndex + 1]?.divider;
          // check if the next item is a divider and move 2 steps forward.

          if (nextItemIsDivider) {
            activeIndex.value = actvIndex + 2 < len ? actvIndex + 2 : 0;
          } else {
            // normal increment
            activeIndex.value += 1;
          }
        } else if (actvIndex === len - 1) {
          // move to the top once the end is reached
          activeIndex.value = 0;
        }
        // handle up arrow
      } else if (keyCode === 'ArrowUp') {
        const isDivider = menuItems.value[actvIndex - 1]?.divider;

        // check if the previous item is a divider and move 2 steps backward
        const nextIndex = isDivider ? actvIndex - 2 : actvIndex - 1 < 0 ? len - 1 : actvIndex - 1;

        activeIndex.value = nextIndex;
        // handle left arrow
      } else if (keyCode === 'ArrowLeft') {
        if (!flip) {
          props.onClose('ArrowLeft');
        } else if (item.subMenu) {
          // if the menu is flipped this should toggle the menu
          toggleMenu(item.id, true);
        }
        // handle enter
      } else if (keyCode === 'Enter') {
        if (item.subMenu) {
          toggleMenu(item.id, true);
        } else {
          selectMenuItem(item.name, item.id, !!item.subMenu);
        }
        // handle right arrow
      } else if (keyCode === 'ArrowRight') {
        if (!flip && item.subMenu) {
          toggleMenu(item.id, true);
        } else if (flip) {
          props.onClose('ArrowRight');
        }
      } else if (keyCode === 'Escape') {
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

    const menuItemClass = computed(() => `menu-item-wrapper ${props.menuStyle}`);

    const isAccordion = computed(() => props.menuStyle === 'accordion');

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

<style lang="scss" scoped src="./Menu.scss"></style>
