<template>
  <div>
    <float-menu
      :position="'top left'"
      :dimension="50"
      :menu-data="items"
      :on-selected="handleSelection"
      :flip-on-edges="true"
      :theme="{
        primary: '#00539C',
        textColor: '#000',
        menuBgColor: '#fff',
        textSelectedColor: '#fff',
      }"
      menu-orientation="bottom"
    >
      <BoxIcon />
    </float-menu>
  </div>
</template>

<script lang="ts">
import FloatMenu from "../components/index.vue";

import BoxIcon from "../components/icons/BoxIcon.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "HelloWorld",
  components: {
    FloatMenu,
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
          name: "Save",
        },
        {
          name: "Save As",
        },
        {
          name: "Close",
        },
        {
          name: "Exit",
        },
      ],
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
