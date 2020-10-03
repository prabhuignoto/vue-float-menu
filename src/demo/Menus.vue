<template>
  <div>
    <float-menu
      :position="'top left'"
      :dimension="55"
      :menu-data="items"
      :on-selected="handleSelection"
      :flip-on-edges="true"
      :theme="{
        primary: '#00539C',
        textColor: '#000',
        menuBgColor: '#fff',
        textSelectedColor: '#fff',
      }"
      menu-orientation="top"
    >
      <BoxIcon />
    </float-menu>
    <float-menu
      :position="'top right'"
      :dimension="55"
      :menu-data="items"
      :on-selected="handleSelection"
      :flip-on-edges="true"
      :theme="{
        primary: '#FF1493',
        textColor: '#000',
        menuBgColor: '#fff',
        textSelectedColor: '#fff',
      }"
      menu-orientation="bottom"
    >
      <heart-icon />
    </float-menu>
    <float-menu
      :position="'bottom left'"
      :dimension="55"
      :menu-data="items"
      :on-selected="handleSelection"
      :flip-on-edges="true"
      :theme="{
        primary: '#DC143C',
        textColor: '#000',
        menuBgColor: '#fff',
        textSelectedColor: '#fff',
      }"
      menu-orientation="bottom"
    >
      <heart-icon />
    </float-menu>
    <float-menu
      :position="'bottom right'"
      :dimension="55"
      :menu-data="items"
      :on-selected="handleSelection"
      :flip-on-edges="true"
      :theme="{
        primary: '#228B22',
        textColor: '#000',
        menuBgColor: '#fff',
        textSelectedColor: '#fff',
      }"
      menu-orientation="bottom"
    >
      <menu-icon />
    </float-menu>
  </div>
</template>

<script lang="ts">
import FloatMenu from "../components/index.vue";

import BoxIcon from "../components/icons/BoxIcon.vue";
import HeartIcon from "../components/icons/HeartIcon.vue";
import MenuIcon from "../components/icons/MenuIcon.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Menus",
  components: {
    FloatMenu,
    BoxIcon,
    HeartIcon,
    MenuIcon,
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
                disabled: true,
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
          disabled: true,
        },
        {
          name: "Save As",
          disabled: true,
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
