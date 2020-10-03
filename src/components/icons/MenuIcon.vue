<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="50%"
    height="50%"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="feather feather-menu"
  >
    <line
      x1="3"
      y1="12"
      x2="21"
      y2="12"
    />
    <line
      x1="3"
      y1="6"
      x2="21"
      y2="6"
    />
    <line
      x1="3"
      y1="18"
      x2="21"
      y2="18"
    />
  </svg>
</template>


<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MenuIcon",
});
</script>