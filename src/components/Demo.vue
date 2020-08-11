<template>
  <MenuHead :position="'bottom left'" :dimensions="{width: 50, height: 50}" menu-direction="bottom">
    <HeartIcon />
  </MenuHead>
</template>

<script lang="ts">
import MenuHead from "./MenuHead.vue";
import HeartIcon from "./HeartIcon.vue";

export default {
  name: "HelloWorld",
  components: {
    MenuHead,
    HeartIcon,
  },
  props: {
    msg: String,
  },
  data() {
    return {
      count: 0,
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
