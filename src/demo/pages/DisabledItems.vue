<template>
  <div class="demo-page">
    <h1 class="page-title">Disabled Items</h1>
    <p class="page-description">
      Menu items can be disabled to prevent user interaction. Disabled items are visually distinct and non-clickable.
    </p>

    <div class="demo-area">
      <float-menu :menu-data="menuItems" @select="handleSelection">
        <template #icon>
          <span>🚫</span>
        </template>
      </float-menu>

      <div class="info-card">
        <h3>Features Demonstrated:</h3>
        <ul>
          <li>Disabled menu items with visual feedback</li>
          <li>Items remain visible but non-interactive</li>
          <li>Grayed out appearance</li>
          <li>No click events fired for disabled items</li>
        </ul>

        <div v-if="selectedItem" class="selection-display">
          <strong>Last Selected:</strong> {{ selectedItem }}
          <p><small>Notice that clicking disabled items does nothing!</small></p>
        </div>
      </div>

      <div class="code-card">
        <h3>Code Example:</h3>
        <pre><code>{{ codeExample }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FloatMenu from '../../components/index.vue';
import type { MenuItem } from '../../types';

const selectedItem = ref('');

const menuItems: MenuItem[] = [
  { name: 'New File', disabled: false },
  { name: 'Open', disabled: false },
  { name: 'Save', disabled: true },
  { name: 'Save As', disabled: true },
  { divider: true },
  { name: 'Print', disabled: true },
  { name: 'Export', disabled: false },
  { divider: true },
  { name: 'Exit', disabled: false },
];

const handleSelection = (name: string) => {
  selectedItem.value = name;
  console.log('Selected:', name);
};

const codeExample = `const menuItems = [
  { name: 'New File', disabled: false },
  { name: 'Save', disabled: true },
  { name: 'Print', disabled: true },
  { name: 'Export', disabled: false },
];

<float-menu
  :menu-data="menuItems"
  @select="handleSelection"
/>`;
</script>

<style lang="scss" scoped>
@import './page-styles.scss';
</style>
