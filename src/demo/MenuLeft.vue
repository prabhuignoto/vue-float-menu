<template>
  <float-menu
    :position="'top left'"
    :menu-data="items"
    :on-selected="handleSelection"
    flip-on-edges
    :theme="{
      primary: '#00539C',
      textColor: '#000',
      menuBgColor: '#fff',
      textSelectedColor: '#00539C',
      hoverBackground: '#e5edf5'
    }"
    menu-orientation="top"
  >
    <template #icon>
      <box-icon />
    </template>
    <template #edit>
      <img
        src="../assets/edit.svg"
        alt="edit"
        :style="computedStyle"
      >
    </template>
    <template #new>
      <img
        src="../assets/plus-circle.svg"
        alt="edit"
        :style="computedStyle"
      >
    </template>
    <template #theme>
      <img
        src="../assets/paint-brush.svg"
        alt="edit"
        :style="computedStyle"
      >
    </template>
    <template #settings>
      <img
        src="../assets/cog.svg"
        alt="edit"
        :style="computedStyle"
      >
    </template>
    <template #save>
      <img
        src="../assets/save.svg"
        alt="edit"
        :style="computedStyle"
      >
    </template>
    <template #close>
      <img
        src="../assets/window-close.svg"
        alt="edit"
        :style="computedStyle"
      >
    </template>
    <template #exit>
      <img
        src="../assets/sign-out-alt.svg"
        alt="edit"
        :style="computedStyle"
      >
    </template>
    <template #recent>
      <img
        src="../assets/clock.svg"
        alt="edit"
        :style="computedStyle"
      >
    </template>
  </float-menu>
</template>

<script lang="ts">
import FloatMenu from "../components/index.vue";

import BoxIcon from "./assets/BoxIcon.vue";
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "MenuLeft",
  components: {
    FloatMenu,
    BoxIcon,
  },
  setup() {
    const handleSelection = (name: string) => {
      console.log(name);
    };

    const computedStyle = computed(() => ({
      width: "100%",
      height: "100%",
    }));

    return {
      handleSelection,
      computedStyle,
    };
  },
  data() {
    return {
      count: 0,
      items: [
        { name: "New", iconSlot: "new" },
        {
          name: "Edit",
          iconSlot: "edit",
          subMenu: {
            name: "edit-items",
            items: [{ name: "Copy" }, { name: "Paste" }],
          },
        },
        {
          name: "Open Recent",
          iconSlot: "recent",
          subMenu: {
            name: "recent-items",
            items: [{ name: "Document 1" }, { name: "Document 2" }],
          },
        },
        {
          divider: true,
        },
        {
          name: "Settings",
          iconSlot: "settings",
          subMenu: {
            name: "settings",
            items: [
              {
                name: "Themes",
                iconSlot: "theme",
                disabled: false,
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
          divider: true,
        },
        {
          name: "Save",
          iconSlot: "save",
          disabled: true,
        },
        {
          name: "Save As",
          iconSlot: "save",
          disabled: true,
        },
        {
          divider: true,
        },
        {
          name: "Close",
          iconSlot: "close",
        },
        {
          name: "Exit",
          iconSlot: "exit",
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