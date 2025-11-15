<template>
  <div class="app">
    <Navigation />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import Navigation from './components/Navigation.vue';
</script>

<style lang="scss" scoped>
.app {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;

  @media (width <= 768px) {
    padding: 1rem;
  }
}
</style>
