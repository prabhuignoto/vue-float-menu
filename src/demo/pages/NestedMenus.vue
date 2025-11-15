<template>
  <div class="demo-page">
    <h1 class="page-title">Nested Menus</h1>
    <p class="page-description">
      Multi-level menu hierarchies with unlimited nesting depth. Hover or click submenu items to reveal nested options.
    </p>

    <div class="demo-area">
      <float-menu :menu-data="menuItems" @select="handleSelection">
        <template #icon>
          <span>📂</span>
        </template>
      </float-menu>

      <div class="info-card">
        <h3>Features Demonstrated:</h3>
        <ul>
          <li>Multi-level nested menu structures</li>
          <li>Submenu indicators and navigation</li>
          <li>Unlimited nesting depth</li>
          <li>Automatic submenu positioning</li>
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
  { name: 'New' },
  {
    name: 'Open Recent',
    subMenu: {
      items: [
        { name: 'project-1.vue' },
        { name: 'project-2.vue' },
        { divider: true },
        { name: 'Clear Recent' },
      ],
    },
  },
  {
    name: 'Settings',
    subMenu: {
      items: [
        {
          name: 'Appearance',
          subMenu: {
            items: [
              { name: 'Light Theme' },
              { name: 'Dark Theme' },
              { name: 'System' },
            ],
          },
        },
        {
          name: 'Editor',
          subMenu: {
            items: [
              { name: 'Font Size' },
              { name: 'Tab Size' },
              { name: 'Line Numbers' },
            ],
          },
        },
        { name: 'Privacy' },
      ],
    },
  },
  { divider: true },
  { name: 'Exit' },
];

const handleSelection = (name: string) => {
  selectedItem.value = name;
  console.log('Selected:', name);
};

const codeExample = `const menuItems = [
  { name: 'New' },
  {
    name: 'Open Recent',
    subMenu: {
      items: [
        { name: 'project-1.vue' },
        { name: 'project-2.vue' },
      ],
    },
  },
  {
    name: 'Settings',
    subMenu: {
      items: [
        {
          name: 'Appearance',
          subMenu: {
            items: [
              { name: 'Light' },
              { name: 'Dark' },
            ],
          },
        },
      ],
    },
  },
];`;
</script>

<style lang="scss" scoped>
@import './page-styles';
</style>
