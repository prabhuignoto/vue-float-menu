<template>
  <div class="demo-page">
    <h1 class="page-title">Custom Themes</h1>
    <p class="page-description">
      Customize the visual appearance with built-in theming support. Try different theme presets below.
    </p>

    <div class="theme-selector">
      <button
        v-for="(_, name) in themes"
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
    primary: '#4f46e5', // Deeper indigo for better contrast with white text
    textColor: '#1f2937',
    menuBgColor: '#ffffff',
    textSelectedColor: '#ffffff',
    hoverBackground: 'rgba(79, 70, 229, 0.08)',
  },
  Dark: {
    primary: '#7c3aed', // Deeper purple for better contrast
    textColor: '#f3f4f6',
    menuBgColor: '#111827',
    textSelectedColor: '#ffffff',
    hoverBackground: 'rgba(124, 58, 237, 0.15)',
  },
  Ocean: {
    primary: '#0284c7', // Darker sky blue for better contrast with white text
    textColor: '#0c4a6e',
    menuBgColor: '#f0f9ff',
    textSelectedColor: '#ffffff',
    hoverBackground: 'rgba(2, 132, 199, 0.08)',
  },
  Sunset: {
    primary: '#ea580c', // Deeper orange for better contrast with white text
    textColor: '#7c2d12',
    menuBgColor: '#fff7ed',
    textSelectedColor: '#ffffff',
    hoverBackground: 'rgba(234, 88, 12, 0.08)',
  },
};

const handleSelection = (name: string) => {
  selectedItem.value = name;
};

const codeExample = `const customTheme = {
  primary: '#4f46e5',
  textColor: '#1f2937',
  menuBgColor: '#ffffff',
  textSelectedColor: '#ffffff',
  hoverBackground: 'rgba(79, 70, 229, 0.08)',
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
