<template>
  <Demo />
</template>

<script lang="ts">
import Demo from "./components/Demo.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  components: {
    Demo,
  },
});
</script>
