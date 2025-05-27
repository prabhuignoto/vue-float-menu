import { computed, ref, shallowRef } from 'vue';
import type { MenuItem } from '../../types';

/**
 * Composable for performance optimizations
 * Includes memoization, lazy loading, and efficient reactivity
 */
export function usePerformanceOptimizations() {
  // Use shallowRef for performance when deep reactivity is not needed
  const memoCache = shallowRef(new Map<string, unknown>());

  /**
   * Memoize expensive computations
   */
  const memoize = <T extends (...args: unknown[]) => unknown>(
    fn: T,
    keyGenerator?: (...args: Parameters<T>) => string
  ): T => {
    return ((...args: Parameters<T>): ReturnType<T> => {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);

      if (memoCache.value.has(key)) {
        return memoCache.value.get(key) as ReturnType<T>;
      }

      const result = fn(...args);
      memoCache.value.set(key, result);
      return result as ReturnType<T>;
    }) as T;
  };

  /**
   * Lazy load menu items for better initial performance
   */
  const useLazyMenuItems = (data: MenuItem[]) => {
    const visibleItems = ref<MenuItem[]>([]);
    const batchSize = 10;
    const currentBatch = ref(0);

    const loadNextBatch = () => {
      const start = currentBatch.value * batchSize;
      const end = start + batchSize;
      const newItems = data.slice(start, end);

      visibleItems.value.push(...newItems);
      currentBatch.value++;
    };

    const loadAllItems = () => {
      visibleItems.value = [...data];
    };

    const hasMoreItems = computed(() => {
      return visibleItems.value.length < data.length;
    });

    // Load first batch immediately
    if (data.length > 0) {
      loadNextBatch();
    }

    return {
      visibleItems,
      loadNextBatch,
      loadAllItems,
      hasMoreItems,
    };
  };

  /**
   * Debounce function for performance
   */
  const debounce = <T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: number;

    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = window.setTimeout(() => func(...args), wait);
    };
  };

  /**
   * Throttle function for performance
   */
  const throttle = <T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;

    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  /**
   * Clear memoization cache
   */
  const clearCache = () => {
    memoCache.value.clear();
  };

  /**
   * Get cache size for debugging
   */
  const getCacheSize = () => {
    return memoCache.value.size;
  };

  return {
    memoize,
    useLazyMenuItems,
    debounce,
    throttle,
    clearCache,
    getCacheSize,
  };
}
