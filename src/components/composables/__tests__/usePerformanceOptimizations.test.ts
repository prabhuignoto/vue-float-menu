import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { usePerformanceOptimizations } from '../usePerformanceOptimizations';
import type { MenuItem } from '../../../types';

// Helper component to test the composable
const TestComponent = defineComponent({
  setup() {
    const performance = usePerformanceOptimizations();
    return { ...performance };
  },
  template: '<div></div>',
});

describe('usePerformanceOptimizations', () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    wrapper = mount(TestComponent);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  describe('memoize', () => {
    it('should memoize function results', () => {
      const expensiveFn = vi.fn((x: number) => x * 2);
      const memoized = wrapper.vm.memoize(expensiveFn);

      const result1 = memoized(5);
      const result2 = memoized(5);

      expect(result1).toBe(10);
      expect(result2).toBe(10);
      expect(expensiveFn).toHaveBeenCalledTimes(1);
    });

    it('should cache different argument combinations', () => {
      const fn = vi.fn((a: number, b: number) => a + b);
      const memoized = wrapper.vm.memoize(fn);

      memoized(1, 2);
      memoized(2, 3);
      memoized(1, 2);

      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should use custom key generator', () => {
      const fn = vi.fn((obj: { id: number }) => obj.id * 2);
      const keyGen = (obj: { id: number }) => `id-${obj.id}`;
      const memoized = wrapper.vm.memoize(fn, keyGen);

      const obj1 = { id: 1 };
      const obj2 = { id: 1 }; // Different object, same id

      memoized(obj1);
      memoized(obj2);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should handle complex return types', () => {
      const fn = vi.fn((x: number) => ({ value: x, doubled: x * 2 }));
      const memoized = wrapper.vm.memoize(fn);

      const result1 = memoized(5);
      const result2 = memoized(5);

      expect(result1).toEqual({ value: 5, doubled: 10 });
      expect(result2).toBe(result1); // Same reference
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('useLazyMenuItems', () => {
    it('should load items in batches', () => {
      const menuData: MenuItem[] = Array.from({ length: 25 }, (_, i) => ({
        name: `Item ${i + 1}`,
      }));

      const lazy = wrapper.vm.useLazyMenuItems(menuData);

      expect(lazy.visibleItems.value.length).toBe(10);
      expect(lazy.hasMoreItems.value).toBe(true);
    });

    it('should load next batch', () => {
      const menuData: MenuItem[] = Array.from({ length: 25 }, (_, i) => ({
        name: `Item ${i + 1}`,
      }));

      const lazy = wrapper.vm.useLazyMenuItems(menuData);

      expect(lazy.visibleItems.value.length).toBe(10);

      lazy.loadNextBatch();

      expect(lazy.visibleItems.value.length).toBe(20);
    });

    it('should load all items at once', () => {
      const menuData: MenuItem[] = Array.from({ length: 25 }, (_, i) => ({
        name: `Item ${i + 1}`,
      }));

      const lazy = wrapper.vm.useLazyMenuItems(menuData);

      expect(lazy.visibleItems.value.length).toBe(10);

      lazy.loadAllItems();

      expect(lazy.visibleItems.value.length).toBe(25);
      expect(lazy.hasMoreItems.value).toBe(false);
    });

    it('should handle empty data', () => {
      const menuData: MenuItem[] = [];
      const lazy = wrapper.vm.useLazyMenuItems(menuData);

      expect(lazy.visibleItems.value.length).toBe(0);
      expect(lazy.hasMoreItems.value).toBe(false);
    });

    it('should handle data smaller than batch size', () => {
      const menuData: MenuItem[] = Array.from({ length: 5 }, (_, i) => ({
        name: `Item ${i + 1}`,
      }));

      const lazy = wrapper.vm.useLazyMenuItems(menuData);

      expect(lazy.visibleItems.value.length).toBe(5);
      expect(lazy.hasMoreItems.value).toBe(false);
    });

    it('should maintain item order', () => {
      const menuData: MenuItem[] = Array.from({ length: 15 }, (_, i) => ({
        name: `Item ${i + 1}`,
      }));

      const lazy = wrapper.vm.useLazyMenuItems(menuData);

      expect(lazy.visibleItems.value[0].name).toBe('Item 1');
      expect(lazy.visibleItems.value[9].name).toBe('Item 10');

      lazy.loadNextBatch();

      expect(lazy.visibleItems.value[10].name).toBe('Item 11');
      expect(lazy.visibleItems.value[14].name).toBe('Item 15');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should delay function execution', () => {
      const fn = vi.fn();
      const debounced = wrapper.vm.debounce(fn, 300);

      debounced();
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should reset delay on subsequent calls', () => {
      const fn = vi.fn();
      const debounced = wrapper.vm.debounce(fn, 300);

      debounced();
      vi.advanceTimersByTime(200);

      debounced();
      vi.advanceTimersByTime(200);

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to debounced function', () => {
      const fn = vi.fn();
      const debounced = wrapper.vm.debounce(fn, 100);

      debounced('arg1', 'arg2');
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should use latest arguments', () => {
      const fn = vi.fn();
      const debounced = wrapper.vm.debounce(fn, 100);

      debounced('first');
      debounced('second');
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('second');
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should execute immediately on first call', () => {
      const fn = vi.fn();
      const throttled = wrapper.vm.throttle(fn, 300);

      throttled();
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should ignore calls within throttle period', () => {
      const fn = vi.fn();
      const throttled = wrapper.vm.throttle(fn, 300);

      throttled();
      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should allow calls after throttle period', () => {
      const fn = vi.fn();
      const throttled = wrapper.vm.throttle(fn, 300);

      throttled();
      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(300);

      throttled();
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should pass arguments to throttled function', () => {
      const fn = vi.fn();
      const throttled = wrapper.vm.throttle(fn, 100);

      throttled('arg1', 'arg2');

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should handle rapid successive calls correctly', () => {
      const fn = vi.fn();
      const throttled = wrapper.vm.throttle(fn, 100);

      throttled('call1');
      throttled('call2');
      throttled('call3');

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('call1');

      vi.advanceTimersByTime(100);

      throttled('call4');
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenCalledWith('call4');
    });
  });

  describe('clearCache', () => {
    it('should clear memoization cache', () => {
      const fn = vi.fn((x: number) => x * 2);
      const memoized = wrapper.vm.memoize(fn);

      memoized(5);
      expect(fn).toHaveBeenCalledTimes(1);

      wrapper.vm.clearCache();

      memoized(5);
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should reset cache size to zero', () => {
      const fn = vi.fn((x: number) => x * 2);
      const memoized = wrapper.vm.memoize(fn);

      memoized(1);
      memoized(2);
      memoized(3);

      expect(wrapper.vm.getCacheSize()).toBe(3);

      wrapper.vm.clearCache();

      expect(wrapper.vm.getCacheSize()).toBe(0);
    });
  });

  describe('getCacheSize', () => {
    it('should return zero for empty cache', () => {
      expect(wrapper.vm.getCacheSize()).toBe(0);
    });

    it('should track cache size correctly', () => {
      const fn = vi.fn((x: number) => x * 2);
      const memoized = wrapper.vm.memoize(fn);

      expect(wrapper.vm.getCacheSize()).toBe(0);

      memoized(1);
      expect(wrapper.vm.getCacheSize()).toBe(1);

      memoized(2);
      expect(wrapper.vm.getCacheSize()).toBe(2);

      memoized(1); // Already cached
      expect(wrapper.vm.getCacheSize()).toBe(2);
    });
  });

  describe('integration tests', () => {
    it('should combine memoization with lazy loading', () => {
      const processItem = vi.fn((item: MenuItem) => ({
        ...item,
        processed: true,
      }));
      const memoized = wrapper.vm.memoize(processItem, (item) => item.name || '');

      const menuData: MenuItem[] = Array.from({ length: 15 }, (_, i) => ({
        name: `Item ${i + 1}`,
      }));

      const lazy = wrapper.vm.useLazyMenuItems(menuData);

      // Process first batch
      lazy.visibleItems.value.forEach((item) => memoized(item));
      expect(processItem).toHaveBeenCalledTimes(10);

      // Process same items again (should use cache)
      lazy.visibleItems.value.forEach((item) => memoized(item));
      expect(processItem).toHaveBeenCalledTimes(10);

      // Load next batch and process
      lazy.loadNextBatch();
      lazy.visibleItems.value.slice(10).forEach((item) => memoized(item));
      expect(processItem).toHaveBeenCalledTimes(15);
    });

    it('should use debounce for search optimization', () => {
      vi.useFakeTimers();

      const search = vi.fn();
      const debouncedSearch = wrapper.vm.debounce(search, 300);

      // Simulate rapid typing
      debouncedSearch('a');
      vi.advanceTimersByTime(100);
      debouncedSearch('ab');
      vi.advanceTimersByTime(100);
      debouncedSearch('abc');
      vi.advanceTimersByTime(100);
      debouncedSearch('abcd');

      expect(search).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);

      expect(search).toHaveBeenCalledTimes(1);
      expect(search).toHaveBeenCalledWith('abcd');

      vi.useRealTimers();
    });

    it('should use throttle for scroll optimization', () => {
      vi.useFakeTimers();

      const onScroll = vi.fn();
      const throttledScroll = wrapper.vm.throttle(onScroll, 100);

      // First call executes immediately
      throttledScroll(0);
      expect(onScroll).toHaveBeenCalledTimes(1);

      // Calls within throttle period are ignored
      throttledScroll(1);
      throttledScroll(2);
      expect(onScroll).toHaveBeenCalledTimes(1);

      // After throttle period, next call executes
      vi.advanceTimersByTime(100);
      throttledScroll(3);

      expect(onScroll).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
    });
  });
});
