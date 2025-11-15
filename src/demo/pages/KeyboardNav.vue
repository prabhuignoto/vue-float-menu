<template>
  <div class="demo-page">
    <h1 class="page-title">Keyboard Navigation</h1>
    <p class="page-description">
      Full keyboard accessibility with arrow keys, Enter, Escape, and Tab. Open the menu and try navigating with your keyboard!
    </p>

    <div class="keyboard-guide">
      <h3>Keyboard Shortcuts:</h3>
      <div class="shortcuts-grid">
        <div class="shortcut">
          <kbd>↑</kbd> <kbd>↓</kbd>
          <span>Navigate menu items</span>
        </div>
        <div class="shortcut">
          <kbd>→</kbd>
          <span>Open submenu</span>
        </div>
        <div class="shortcut">
          <kbd>←</kbd>
          <span>Close submenu</span>
        </div>
        <div class="shortcut">
          <kbd>Enter</kbd>
          <span>Select item</span>
        </div>
        <div class="shortcut">
          <kbd>Esc</kbd>
          <span>Close menu</span>
        </div>
        <div class="shortcut">
          <kbd>Tab</kbd>
          <span>Focus menu button</span>
        </div>
      </div>
    </div>

    <div class="demo-area">
      <float-menu :menu-data="menuItems" @select="handleSelection">
        <template #icon>
          <span>⌨️</span>
        </template>
      </float-menu>

      <div class="info-card">
        <h3>Accessibility Features:</h3>
        <ul>
          <li>Full WCAG 2.1 compliance</li>
          <li>ARIA labels and roles</li>
          <li>Screen reader announcements</li>
          <li>Focus management</li>
          <li>High contrast mode support</li>
        </ul>

        <div v-if="selectedItem" class="selection-display">
          <strong>Last Selected:</strong> {{ selectedItem }}
        </div>
      </div>

      <div class="code-card">
        <h3>Usage:</h3>
        <p>
          Keyboard navigation is enabled by default. No additional configuration needed!
          The component automatically handles all keyboard interactions.
        </p>
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
  { name: 'Dashboard' },
  {
    name: 'Projects',
    subMenu: {
      name: 'projects',
      items: [
        { name: 'Active Projects' },
        { name: 'Archived' },
        { divider: true },
        { name: 'Create New' },
      ],
    },
  },
  {
    name: 'Settings',
    subMenu: {
      name: 'settings',
      items: [
        { name: 'Profile' },
        { name: 'Preferences' },
        { name: 'Privacy' },
      ],
    },
  },
  { divider: true },
  { name: 'Logout' },
];

const handleSelection = (name: string) => {
  selectedItem.value = name;
  console.log('Selected:', name);
};
</script>

<style lang="scss" scoped>
@import './page-styles';

.keyboard-guide {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  h3 {
    margin: 0 0 1.5rem;
    color: #2d3748;
    font-size: 1.25rem;
  }
}

.shortcuts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.shortcut {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f7fafc;
  border-radius: 8px;

  kbd {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    background: #2d3748;
    color: white;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.875rem;
    font-weight: 600;
    min-width: 2rem;
    text-align: center;
  }

  span {
    color: #4a5568;
    font-size: 0.875rem;
  }
}
</style>
