<template>
  <div class="demo-page">
    <h1 class="page-title">Custom Themes</h1>
    <p class="page-description">
      Customize the visual appearance with built-in theming support. Try different theme presets below.
    </p>

    <div class="theme-selector">
      <button
        v-for="(theme, name) in themes"
        :key="name"
        @click="currentTheme = name"
        :class="{ active: currentTheme === name }"
        class="theme-button"
      >
        {{ name }}
      </button>
    </div>

    <div class="demo-area">
      <float-menu :menu-data="menuItems" :theme="themes[currentTheme]" @select="handleSelection">
        <template #icon>
          <span>🎨</span>
        </template>
      </float-menu>

      <div class="info-card">
        <h3>Current Theme: {{ currentTheme }}</h3>
        <div class="theme-preview">
          <div class="color-swatch">
            <span class="label">Primary:</span>
            <span class="color" :style="{ backgroundColor: themes[currentTheme].primary }">
              {{ themes[currentTheme].primary }}
            </span>
          </div>
          <div class="color-swatch">
            <span class="label">Background:</span>
            <span class="color" :style="{ backgroundColor: themes[currentTheme].menuBgColor }">
              {{ themes[currentTheme].menuBgColor }}
            </span>
          </div>
          <div class="color-swatch">
            <span class="label">Text:</span>
            <span class="color" :style="{ backgroundColor: themes[currentTheme].textColor }">
              {{ themes[currentTheme].textColor }}
            </span>
          </div>
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
import type { MenuItem, Theme } from '../../types';

const currentTheme = ref('Light');
const selectedItem = ref('');

const menuItems: MenuItem[] = [
  { name: 'Dashboard' },
  { name: 'Profile' },
  { name: 'Settings' },
  { divider: true },
  { name: 'Logout' },
];

const themes: Record<string, Theme> = {
  Light: {
    primary: '#6366f1',
    textColor: '#374151',
    menuBgColor: '#ffffff',
    textSelectedColor: '#ffffff',
    hoverBackground: 'rgba(99, 102, 241, 0.1)',
  },
  Dark: {
    primary: '#8b5cf6',
    textColor: '#e5e7eb',
    menuBgColor: '#1f2937',
    textSelectedColor: '#ffffff',
    hoverBackground: 'rgba(139, 92, 246, 0.2)',
  },
  Ocean: {
    primary: '#0ea5e9',
    textColor: '#0f172a',
    menuBgColor: '#f0f9ff',
    textSelectedColor: '#ffffff',
    hoverBackground: 'rgba(14, 165, 233, 0.1)',
  },
  Sunset: {
    primary: '#f59e0b',
    textColor: '#78350f',
    menuBgColor: '#fffbeb',
    textSelectedColor: '#ffffff',
    hoverBackground: 'rgba(245, 158, 11, 0.1)',
  },
};

const handleSelection = (name: string) => {
  selectedItem.value = name;
};

const codeExample = `const customTheme = {
  primary: '#6366f1',
  textColor: '#374151',
  menuBgColor: '#ffffff',
  textSelectedColor: '#ffffff',
  hoverBackground: 'rgba(99, 102, 241, 0.1)',
};

<float-menu
  :menu-data="items"
  :theme="customTheme"
/>`;
</script>

<style lang="scss" scoped>
@import './page-styles';

.theme-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.theme-button {
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

.theme-preview {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.color-swatch {
  display: flex;
  align-items: center;
  gap: 1rem;

  .label {
    font-weight: 600;
    min-width: 100px;
  }

  .color {
    flex: 1;
    padding: 0.75rem;
    border-radius: 8px;
    font-family: monospace;
    font-size: 0.875rem;
    border: 2px solid #e2e8f0;
  }
}
</style>
