<template>
  <div class="home-main">
    <Menus />
    <div class="hero">
      <div class="hero-header">
        <div class="logo-container">
          <!-- <img src="/social-media-logo-small.png" alt="Vue Float Menu Logo" /> -->
          <div class="hero-title">
            <h1>Vue Float Menu</h1>
            <p class="hero-subtitle">Smart floating menu for Vue 3 applications</p>
          </div>
        </div>
        <div class="github-badges">
          <iframe
            src="https://ghbtns.com/github-btn.html?user=prabhuignoto&repo=vue-float-menu&type=star&count=true&size=large"
            frameborder="0"
            scrolling="0"
            width="150"
            height="30"
            title="GitHub Stars"
          />
          <iframe
            src="https://ghbtns.com/github-btn.html?user=prabhuignoto&repo=vue-float-menu&type=fork&count=true&size=large"
            frameborder="0"
            scrolling="0"
            width="170"
            height="30"
            title="GitHub Forks"
          />
        </div>
      </div>

      <div class="demo-instruction">
        <div class="instruction-card">
          <h2>💡 Try it out!</h2>
          <p>
            Click on any of the floating menu buttons around the screen to see the menu in action.
            You can drag them to reposition!
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

      <footer class="footer">
        <div class="footer-content">
          <p>&copy; {{ new Date().getFullYear() }} Vue Float Menu</p>
          <a href="https://www.prabhumurthy.com" target="_blank" rel="noopener">
            Made with ❤️ by Prabhu Murthy
          </a>
        </div>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import Menus from './Menus.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HelloWorld',
  components: {
    Menus,
  },
  setup() {
    const handleSelection = (name: string) => {
      console.log(name);
    };

    return {
      handleSelection,
    };
  },
});
</script>

<style lang="scss" scoped>
.home-main {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.hero {
  max-width: 1200px;
  width: 100%;

  .hero-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    margin-bottom: 3rem;

    @media (width >= 768px) {
      flex-direction: row;
      justify-content: space-between;
    }
  }

  .logo-container {
    display: flex;
    align-items: center;
    gap: 1.5rem;

    img {
      width: 80px;
      height: 80px;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  .hero-title {
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: white;
      margin: 0 0 0.5rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

      @media (width <= 768px) {
        font-size: 2rem;
        text-align: center;
      }
    }

    .hero-subtitle {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.9);
      margin: 0;
      font-weight: 400;

      @media (width <= 768px) {
        text-align: center;
      }
    }
  }

  .github-badges {
    display: flex;
    gap: 1rem;
    align-items: center;

    iframe {
      border-radius: 4px;
    }
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
    border: 1px solid rgba(255, 255, 255, 0.2);

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
  margin-bottom: 4rem;

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
    border: 1px solid rgba(255, 255, 255, 0.2);
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
      font-size: 0.95rem;
    }
  }
}

.footer {
  text-align: center;
  padding: 2rem 0;

  .footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;

    @media (width >= 640px) {
      flex-direction: row;
      justify-content: center;
      gap: 2rem;
    }

    p {
      margin: 0;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
    }

    a {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.3s ease;

      &:hover {
        color: white;
        text-decoration: underline;
      }
    }
  }
}
</style>
