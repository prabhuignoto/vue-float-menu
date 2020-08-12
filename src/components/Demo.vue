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
import { Menu, MenuItem } from "./Menu.vue";

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
          { name: "first" },
          {
            name: "second",
            subMenu: {
              name: "popo",
              items: [{ name: "sdsd" }, { name: "ssdsd" }],
            },
          },
          {
            name: "third",
            subMenu: {
              name: "popo",
              items: [
                { name: "sdsd" },
                { name: "ssdsd" },
                {
                  name: "multi",
                  subMenu: {
                    name: "popo",
                    items: [{ name: "sdsd" }, { name: "ssdsd" }],
                  },
                },
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
