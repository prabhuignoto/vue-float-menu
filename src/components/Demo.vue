<template>
  <div>
    <MenuHead
      :position="'top left'"
      :dimension="50"
      :menu-data="menu"
      :on-selected="handleSelection"
      :flip-on-edges="true"
      menu-orientation="bottom"
    >
      <BoxIcon />
    </MenuHead>
  </div>
</template>

<script lang="ts">
import MenuHead from "./MenuHead.vue";
import { Menu } from "./Menu.vue";

import BoxIcon from "./BoxIcon.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "HelloWorld",
  components: {
    MenuHead,
    BoxIcon,
  },
  setup() {
    const handleSelection = (name: string) => {
      console.log(name);
    };

    return {
      handleSelection,
    };
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
          {
            name: "Save"
          },
          {
            name: "Save As"
          },
          {
            name: "Close"
          },
          {
            name: "Exit"
          }
        ],
      } as Menu,
    };
  },
});
</script>

<style lang="scss" scoped>
img {
  width: 100%;
  height: 100%;
}
</style>
