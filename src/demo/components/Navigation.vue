<template>
  <nav class="navigation" :class="{ open: mobileMenuOpen }">
    <div class="nav-header">
      <h1 class="nav-title">Vue Float Menu</h1>
      <button class="mobile-toggle" @click="toggleMobileMenu" aria-label="Toggle menu">
        <span v-if="!mobileMenuOpen">☰</span>
        <span v-else>✕</span>
      </button>
    </div>

    <ul class="nav-links">
      <li v-for="route in navRoutes" :key="route.path">
        <RouterLink :to="route.path" @click="closeMobileMenu" active-class="active">
          <span v-if="route.meta?.icon" class="nav-icon">{{ route.meta.icon }}</span>
          <span>{{ route.meta?.title }}</span>
        </RouterLink>
      </li>
    </ul>

    <div class="nav-footer">
      <a href="https://github.com/prabhuignoto/vue-float-menu" target="_blank" rel="noopener" class="github-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <span>GitHub</span>
      </a>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const router = useRouter();
const mobileMenuOpen = ref(false);

const navRoutes = computed(() =>
  router.getRoutes().filter(route => route.path !== '/')
);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};
</script>

<style lang="scss" scoped>
.navigation {
  width: 280px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem 1.5rem;
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;

  @media (width <= 768px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
    transform: translateX(-100%);

    &.open {
      transform: translateX(0);
    }
  }
}

.nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e2e8f0;

  .nav-title {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
  }

  .mobile-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    color: #2d3748;

    @media (width <= 768px) {
      display: block;
    }
  }
}

.nav-links {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;

  li {
    margin-bottom: 0.5rem;
  }

  a {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    border-radius: 12px;
    text-decoration: none;
    color: #4a5568;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      transform: translateX(4px);
    }

    &.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .nav-icon {
      font-size: 1.25rem;
    }
  }
}

.nav-footer {
  padding-top: 1.5rem;
  border-top: 2px solid #e2e8f0;

  .github-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    border-radius: 12px;
    text-decoration: none;
    color: #2d3748;
    font-weight: 500;
    background: #f7fafc;
    transition: all 0.2s ease;

    &:hover {
      background: #2d3748;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    svg {
      flex-shrink: 0;
    }
  }
}

// Mobile menu toggle button (fixed position)
@media (width <= 768px) {
  .mobile-toggle-fixed {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 999;
    background: white;
    border: none;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.5rem;
  }
}
</style>
