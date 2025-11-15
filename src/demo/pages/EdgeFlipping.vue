<template>
  <div class="demo-page">
    <h1 class="page-title">Edge Flipping</h1>
    <p class="page-description">
      Automatic menu orientation adjustment when near screen edges. Drag the menu to different edges to see it flip.
    </p>

    <div class="demo-area">
      <float-menu :menu-data="menuItems" :flip-on-edges="true" @select="handleSelection">
        <template #icon>
          <span>🔄</span>
        </template>
      </float-menu>

      <div class="info-card">
        <h3>Features Demonstrated:</h3>
        <ul>
          <li>Automatic orientation detection</li>
          <li>Smart edge-aware positioning</li>
          <li>Prevents menu overflow beyond viewport</li>
          <li>Works in all screen corners</li>
        </ul>

        <div class="instructions">
          <strong>Try this:</strong>
          <ol>
            <li>Drag the menu button to the right edge of the screen</li>
            <li>Open the menu - it will flip to open leftward</li>
            <li>Drag to the bottom edge - menu will flip to open upward</li>
            <li>Try all four corners to see different orientations</li>
          </ol>
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
  { name: 'Action 1' },
  { name: 'Action 2' },
  { name: 'Action 3' },
  { divider: true },
  { name: 'Action 4' },
  { name: 'Action 5' },
];

const handleSelection = (name: string) => {
  selectedItem.value = name;
};

const codeExample = `<float-menu
  :menu-data="items"
  :flip-on-edges="true"
>
  <template #icon>🔄</template>
</float-menu>`;
</script>

<style lang="scss" scoped>
@import './page-styles.scss';

.instructions {
  margin-top: 1rem;
  padding: 1rem;
  background: #edf2f7;
  border-radius: 8px;

  strong {
    display: block;
    margin-bottom: 0.5rem;
    color: #2d3748;
  }

  ol {
    margin: 0.5rem 0 0;
    padding-left: 1.5rem;
    color: #4a5568;
    line-height: 1.8;
  }
}
</style>
