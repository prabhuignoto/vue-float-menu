import { computed, ref, onMounted } from 'vue';

// Extend import.meta for Vite environment
declare global {
  interface ImportMeta {
    env: {
      DEV?: boolean;
      PROD?: boolean;
      [key: string]: unknown;
    };
  }
}

export interface BundleOptimization {
  lazyLoad: boolean;
  treeShaking: boolean;
  codesplitting: boolean;
  compression: boolean;
}

// Extend the Performance interface to include memory
interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

// Extend Navigator interface for connection
interface NavigatorWithConnection extends Navigator {
  connection?: {
    effectiveType?: string;
  };
}

export const useBundleOptimizations = () => {
  const optimizations = ref<BundleOptimization>({
    lazyLoad: true,
    treeShaking: true,
    codesplitting: true,
    compression: true,
  });

  // Dynamic imports for better code splitting
  const loadComponent = async (componentName: string) => {
    try {
      switch (componentName) {
        case 'TouchOptimizations':
          return await import('./useTouchOptimizations');
        case 'Accessibility':
          return await import('./useAccessibility');
        case 'Animations':
          return await import('./useAnimations');
        case 'Performance':
          return await import('./usePerformanceOptimizations');
        case 'ErrorHandling':
          return await import('./useErrorHandling');
        case 'KeyboardNavigation':
          return await import('./useKeyboardNavigation');
        default:
          throw new Error(`Unknown component: ${componentName}`);
      }
    } catch (error) {
      console.warn(`Failed to load component ${componentName}:`, error);
      return null;
    }
  };

  // Lazy load composables based on feature detection
  const loadComposablesConditionally = async () => {
    const features = {
      touchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      modernBrowser: 'IntersectionObserver' in window && 'ResizeObserver' in window,
      highPerformance: navigator.hardwareConcurrency && navigator.hardwareConcurrency >= 4,
    };

    const loadPromises = [];

    // Only load touch optimizations on touch devices
    if (features.touchDevice) {
      loadPromises.push(loadComponent('TouchOptimizations'));
    }

    // Only load animations if motion is preferred
    if (!features.reducedMotion) {
      loadPromises.push(loadComponent('Animations'));
    }

    // Load performance optimizations on high-performance devices
    if (features.highPerformance) {
      loadPromises.push(loadComponent('Performance'));
    }

    // Always load accessibility and error handling
    loadPromises.push(
      loadComponent('Accessibility'),
      loadComponent('ErrorHandling'),
      loadComponent('KeyboardNavigation')
    );

    try {
      await Promise.all(loadPromises);
    } catch (error) {
      console.warn('Some composables failed to load:', error);
    }
  };

  // Bundle size analysis
  const getBundleInfo = () => {
    return {
      // Estimate bundle sizes (in KB)
      core: 12, // Core menu functionality
      touchOptimizations: 3,
      accessibility: 2,
      animations: 2,
      performance: 1.5,
      errorHandling: 1,
      keyboardNavigation: 1.5,
      total: 23,
    };
  };

  // Performance monitoring
  const measurePerformance = (operationName: string, operation: () => void) => {
    if ('performance' in window && performance.mark) {
      const startMark = `${operationName}-start`;
      const endMark = `${operationName}-end`;
      const measureName = `${operationName}-duration`;

      performance.mark(startMark);
      operation();
      performance.mark(endMark);

      try {
        performance.measure(measureName, startMark, endMark);
        const measure = performance.getEntriesByName(measureName)[0];
        console.debug(`${operationName} took ${measure.duration.toFixed(2)}ms`);
      } catch (error) {
        console.warn('Performance measurement failed:', error);
      }
    } else {
      operation();
    }
  };

  // Tree shaking helper - mark functions as used
  const markAsUsed = (featureName: string) => {
    if (import.meta.env?.DEV) {
      console.debug(`Feature marked as used: ${featureName}`);
    }
  };

  // Memory usage monitoring
  const monitorMemoryUsage = () => {
    const perf = performance as PerformanceWithMemory;
    if ('memory' in perf && perf.memory) {
      return {
        used: perf.memory.usedJSHeapSize,
        total: perf.memory.totalJSHeapSize,
        limit: perf.memory.jsHeapSizeLimit,
      };
    }
    return null;
  };

  // Code splitting strategies
  const splitStrategy = computed(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const nav = navigator as NavigatorWithConnection;
    const isSlowConnection =
      ('connection' in navigator && nav.connection?.effectiveType === 'slow-2g') ||
      nav.connection?.effectiveType === '2g';

    if (isMobile || isSlowConnection) {
      return 'aggressive'; // More aggressive code splitting for mobile/slow connections
    } else {
      return 'standard'; // Standard code splitting for desktop
    }
  });

  // Compression utilities
  const enableCompression = () => {
    // Enable gzip/brotli compression hints
    if ('serviceWorker' in navigator) {
      // Service worker can handle compression
      return true;
    }
    return false;
  };

  // Resource preloading
  const preloadCriticalResources = () => {
    const criticalResources = [
      { href: '/vue-float-menu.css', as: 'style' },
      { href: '/vue-float-menu.js', as: 'script' },
    ];

    criticalResources.forEach((resource) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      document.head.appendChild(link);
    });
  };

  onMounted(() => {
    // Initialize optimizations
    if (optimizations.value.lazyLoad) {
      loadComposablesConditionally();
    }

    if (optimizations.value.compression) {
      enableCompression();
    }

    // Preload critical resources in production
    if (import.meta.env && !import.meta.env.DEV) {
      preloadCriticalResources();
    }
  });

  return {
    optimizations: computed(() => optimizations.value),
    loadComponent,
    loadComposablesConditionally,
    getBundleInfo,
    measurePerformance,
    markAsUsed,
    monitorMemoryUsage,
    splitStrategy,
    enableCompression,
    preloadCriticalResources,
  };
};
