<template>
  <menu-left />
  <menu-left-bottom />
  <menu-right />
  <menu-right-bottom />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import MenuLeft from "./MenuLeft.vue";
import MenuLeftBottom from "./MenuLeftBottom.vue";
import MenuRight from "./MenuRight.vue";
import MenuRightBottom from "./MenuRightBottom.vue";

export default defineComponent({
  name: "MenuDemos",
  components: {
    MenuLeft,
    MenuLeftBottom,
    MenuRight,
    MenuRightBottom,
  },
});
</script>
