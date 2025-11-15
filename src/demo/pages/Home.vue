<template>
  <div class="home">
    <Menus />

    <div class="hero-header">
      <h1>Vue Float Menu</h1>
      <p class="subtitle">Smart floating menu for Vue 3 applications</p>
    </div>

    <div class="demo-instruction">
      <div class="instruction-card">
        <h2>💡 Try it out!</h2>
        <p>
          Click on any of the floating menu buttons around the screen to see the menu in action.
          You can drag them to reposition! Use the navigation on the left to explore different demos.
        </p>
      </div>
    </div>

    <div class="features-grid">
      <h2 class="features-title">Key Features</h2>
      <div class="features-container">
        <div class="feature-card">
          <div class="feature-icon">🖱️</div>
          <h3>Drag & Drop</h3>
          <p>Drag and place anywhere on screen with smooth animations</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <h3>Smart Positioning</h3>
          <p>Automatically adjusts menu orientation for optimal display</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3>Responsive Design</h3>
          <p>Works seamlessly across desktop and mobile devices</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🗂️</div>
          <h3>Nested Menus</h3>
          <p>Support for multi-level nested menu structures</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">⌨️</div>
          <h3>Keyboard Navigation</h3>
          <p>Full keyboard accessibility with arrow key navigation</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3>Customizable Themes</h3>
          <p>Easy theming system with CSS custom properties</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔧</div>
          <h3>Developer Friendly</h3>
          <p>Intuitive API with data-driven behavior and TypeScript support</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>Vue 3 Powered</h3>
          <p>Built with the latest Vue 3 Composition API for optimal performance</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Menus from '../Menus.vue';
</script>

<style lang="scss" scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-header {
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 3rem;
    font-weight: 700;
    color: white;
    margin: 0 0 1rem;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

    @media (width <= 768px) {
      font-size: 2rem;
    }
  }

  .subtitle {
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
  }
}

.demo-instruction {
  margin-bottom: 3rem;

  .instruction-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

    h2 {
      margin: 0 0 1rem;
      color: #2d3748;
      font-size: 1.5rem;
    }

    p {
      margin: 0;
      color: #4a5568;
      font-size: 1.1rem;
      line-height: 1.6;
    }
  }
}

.features-grid {
  .features-title {
    text-align: center;
    color: white;
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 2rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .features-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;

    @media (width <= 640px) {
      grid-template-columns: 1fr;
    }
  }

  .feature-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    transition: all 0.3s ease;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }

    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #2d3748;
      margin: 0 0 0.75rem;
    }

    p {
      color: #4a5568;
      margin: 0;
      line-height: 1.6;
    }
  }
}
</style>
