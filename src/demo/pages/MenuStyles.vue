<template>
  <div class="demo-page">
    <h1 class="page-title">Menu Styles</h1>
    <p class="page-description">
      Different menu presentation styles. Switch between slide-out and accordion modes.
    </p>

    <div class="style-selector">
      <button
        @click="menuStyle = 'slide-out'"
        :class="{ active: menuStyle === 'slide-out' }"
        class="style-button"
      >
        Slide Out
      </button>
      <button
        @click="menuStyle = 'accordion'"
        :class="{ active: menuStyle === 'accordion' }"
        class="style-button"
      >
        Accordion
      </button>
    </div>

    <div class="demo-area">
      <float-menu
        :menu-data="menuItems"
        :menu-style="menuStyle"
        @select="handleSelection"
      >
        <template #icon>
          <span>📐</span>
        </template>
      </float-menu>

      <div class="info-card">
        <h3>Current Style: {{ menuStyle }}</h3>
        <p v-if="menuStyle === 'slide-out'">
          <strong>Slide Out:</strong> Nested menus appear as separate panels sliding from the side.
          Best for desktop applications with deep menu hierarchies.
        </p>
        <p v-else>
          <strong>Accordion:</strong> Nested menus expand inline within the parent menu.
          Best for mobile devices and compact interfaces.
        </p>
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

const menuStyle = ref<'slide-out' | 'accordion'>('slide-out');
const selectedItem = ref('');

const menuItems: MenuItem[] = [
  { name: 'File' },
  {
    name: 'Edit',
    subMenu: {
      name: 'edit',
      items: [
        { name: 'Undo' },
        { name: 'Redo' },
        { divider: true },
        { name: 'Cut' },
        { name: 'Copy' },
        { name: 'Paste' },
      ],
    },
  },
  {
    name: 'View',
    subMenu: {
      name: 'view',
      items: [
        { name: 'Zoom In' },
        { name: 'Zoom Out' },
        { divider: true },
        { name: 'Full Screen' },
      ],
    },
  },
  { name: 'Help' },
];

const handleSelection = (name: string) => {
  selectedItem.value = name;
};

const codeExample = `<float-menu
  :menu-data="items"
  menu-style="slide-out"
  <!-- or menu-style="accordion" -->
/>`;
</script>

<style lang="scss" scoped>
@import './page-styles';

.style-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.style-button {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  &.active {
    background: white;
    color: #667eea;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}
</style>
