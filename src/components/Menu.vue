<template>
  <div class="menu-wrapper">
    <ul class="menu-list">
      <li
        v-for="item of menuItems"
        :key="item.id"
        :class="[{ selected: item.selected, flip }, 'menu-list-item']"
        :style="getTheme"
        @mousedown="
          handleMenuItemClick($event, item.id, item.name, item.subMenu)
        "
      >
        <span class="name">{{ item.name }}</span>
        <span
          v-if="item.subMenu"
          class="chev-icon"
        >
          <ChevRightIcon />
        </span>
        <span
          v-if="item.subMenu && item.showSubMenu"
          class="sub-menu-wrapper"
        >
          <component
            :is="SubMenuComponent"
            :data="item.subMenu.items"
            :on-selection="onSelection"
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
} from "vue";
import { nanoid } from "nanoid";
import ChevRightIcon from "./icons/ChevRightIcon.vue";

export type Menu = {
  items: MenuItem[];
};

export type MenuItem = {
  name: string;
  subMenu?: Menu;
  id?: string;
  showSubMenu?: boolean;
  selected?: boolean;
};

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
    theme: {
      type: Object as PropType<{ primary: string }>,
      required: false,
      default: { primary: "#0080ff" },
    },
  },
  setup(props) {
    const menuItems = ref<MenuItem[]>(
      props.data.map((item) =>
        Object.assign({}, item, {
          id: nanoid(),
          showSubMenu: false,
        })
      )
    );

    const SubMenuComponent = resolveComponent("Menu");

    const handleMenuItemClick = (
      event: MouseEvent,
      id: string,
      name: string,
      subMenu: boolean
    ) => {
      event.stopPropagation();
      event.preventDefault();

      menuItems.value = menuItems.value.map((item) => {
        const active = item.id === id && item.subMenu && !item.selected;
        return Object.assign({}, item, {
          showSubMenu: active,
          selected: active,
        });
      });

      if (!subMenu) {
        props.onSelection && props.onSelection(name);
      }
    };

    const getTheme = computed(() => ({
      "--background": props.theme.primary,
    }));

    return {
      menuItems,
      handleMenuItemClick,
      SubMenuComponent,
      getTheme,
    };
  },
});
</script>


<style lang="scss" scoped src="./Menu.scss">
</style>