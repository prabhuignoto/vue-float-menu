<template>
  <div class="menu-wrapper">
    <ul class="menu-list">
      <li
        v-for="item of menuItems"
        :key="item.id"
        class="menu-list-item"
        :class="{selected: item.selected, flip}"
        @mousedown="handleMenuItemClick($event, item.id, item.name, item.subMenu)"
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
          <SubMenu
            :data="item.subMenu"
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
  defineAsyncComponent,
  unref,
} from "vue";
import { nanoid } from "nanoid";
import ChevRightIcon from "./ChevRightIcon.vue";
const SubMenu = defineAsyncComponent(() => import("./Menu.vue"));

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
    SubMenu,
    ChevRightIcon,
  },
  props: {
    data: {
      type: Object as PropType<Menu>,
      default: {
        items: [],
      },
    },
    flip: {
      type: Boolean,
      default: false,
    },
    // eslint-disable-next-line vue/require-default-prop
    onSelection: {
      type: Function as PropType<(id: string, name: string, parent?: string) => void>
    }
  },
  setup(props) {
    const menuItems = ref<MenuItem[]>(
      props.data.items.map((item) =>
        Object.assign({}, item, {
          id: nanoid(),
          showSubMenu: false,
        })
      )
    );

    const handleMenuItemClick = (event: MouseEvent, id: string, name: string, subMenu: boolean) => {
      event.stopPropagation();
      event.preventDefault();

      menuItems.value = unref(menuItems).map((item) => {
        const active = item.id === id && item.subMenu && !item.selected;
        return Object.assign({}, item, {
          showSubMenu: active,
          selected: active,
        });
      });

      const selectedItem = menuItems

      if(!subMenu) {
        props.onSelection(id, name);
      }
    };

    return {
      menuItems,
      handleMenuItemClick,
    };
  },
});
</script>


<style lang="scss" scoped>
.menu-wrapper {
  align-items: flex-start;
  display: flex;
  height: 100%;
  justify-content: flex-start;
  width: 100%;
}

.menu-list {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;

  .menu-list-item {
    align-items: center;
    color: #000;
    display: flex;
    height: 2.5rem;
    justify-content: flex-start;
    position: relative;
    width: 100%;
    cursor: pointer;

    &:first-child {
      border-top-left-radius: 0.25rem;
      border-top-right-radius: 0.25rem;
    }

    &.selected {
      background: #0080ff;
      color: #fff;
    }

    &:hover:not(.selected) {
      background: #e5e5e5;
      color: #000;
    }

    &.flip {

      .name {
        order: 2;
        margin-left: auto;
        padding-left: 0;
        padding-right: 0.5rem;
      }

      .chev-icon {
        order: 1;
        margin-left: 0;
        transform: rotate(-180deg);
      }

      .sub-menu-wrapper {
        right: 102%;
        left: auto;
      }
    }
  }

  .name {
    padding-left: 0.5rem;
  }
}

.sub-menu-wrapper {
  animation: show 0.1s ease-in;
  background: #fff;
  border-radius: 0.45rem;
  box-shadow: rgba(0, 0, 0, 0.2) 2px 2px 10px 2px;
  left: 102%;
  min-width: 150px;
  position: absolute;
  top: 0;
}

.chev-icon {
  margin-left: auto;
}

@keyframes show {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>