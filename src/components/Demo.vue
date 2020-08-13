<template>
  <MenuHead
    :position="'top left'"
    :dimensions="{width: 50, height: 50}"
    :menu="menu"
    menu-direction="bottom"
  >
    <BoxIcon />
  </MenuHead>
</template>

<script lang="ts">
import MenuHead from "./MenuHead.vue";
import { Menu } from "./Menu.vue";

import BoxIcon from "./BoxIcon.vue";

export default {
  name: "HelloWorld",
  components: {
    MenuHead,
    BoxIcon,
  },
  data() {
    return {
      count: 0,
      menu: {
        items: [
          { name: "New" },
          {
            name: "Edit",
            subMenu: {
              name: "edit-items",
              items: [{ name: "Copy" }, { name: "Paste" }],
            },
          },
          {
            name: "Open Recent",
            subMenu: {
              name: "recent-items",
              items: [{ name: "Document 1" }, { name: "Document 2" }],
            },
          },
          {
            name: "Settings",
            subMenu: {
              name: "settings",
              items: [
                {
                  name: "Themes",
                  subMenu: {
                    name: "sub-themes",
                    items: [
                      { name: "Dark" },
                      { name: "Light" },
                      { name: "Blue" },
                      { name: "Green" },
                    ],
                  },
                },
                { name: "Keymaps" },
              ],
            },
          },
        ],
      } as Menu,
    };
  },
};
</script>

<style lang="scss" scoped>
img {
  width: 100%;
  height: 100%;
}
</style>
