<template>
  <div class="demo-page">
    <h1 class="page-title">Basic Menu</h1>
    <p class="page-description">
      A simple floating menu with flat structure. Click the menu button to see basic functionality.
    </p>

    <div class="demo-area">
      <float-menu :menu-data="menuItems" @select="handleSelection">
        <template #icon>
          <span>☰</span>
        </template>
      </float-menu>

      <div class="info-card">
        <h3>Features Demonstrated:</h3>
        <ul>
          <li>Basic menu structure with simple items</li>
          <li>Click handling and selection events</li>
          <li>Draggable positioning</li>
          <li>Default theming</li>
        </ul>

        <div v-if="selectedItem" class="selection-display">
          <strong>Last Selected:</strong> {{ selectedItem }}
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
  { name: 'New File' },
  { name: 'Open' },
  { name: 'Save' },
  { divider: true },
  { name: 'Export' },
  { name: 'Print' },
  { divider: true },
  { name: 'Exit' },
];

const handleSelection = (name: string) => {
  selectedItem.value = name;
  console.log('Selected:', name);
};

const codeExample = `const menuItems = [
  { name: 'New File' },
  { name: 'Open' },
  { name: 'Save' },
  { divider: true },
  { name: 'Export' },
  { name: 'Print' },
];

<float-menu
  :menu-data="menuItems"
  @select="handleSelection"
>
  <template #icon>☰</template>
</float-menu>`;
</script>

<style lang="scss" scoped>
.demo-page {
  max-width: 1000px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.5rem;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.page-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.demo-area {
  min-height: 500px;
  position: relative;
}

.info-card,
.code-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  h3 {
    margin: 0 0 1rem;
    color: #2d3748;
    font-size: 1.25rem;
  }

  ul {
    margin: 0;
    padding-left: 1.5rem;
    color: #4a5568;
    line-height: 1.8;
  }

  .selection-display {
    margin-top: 1rem;
    padding: 1rem;
    background: #edf2f7;
    border-radius: 8px;
    color: #2d3748;
  }

  pre {
    margin: 0;
    padding: 1rem;
    background: #2d3748;
    color: #e2e8f0;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 0.875rem;
    line-height: 1.6;

    code {
      font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
    }
  }
}
</style>
