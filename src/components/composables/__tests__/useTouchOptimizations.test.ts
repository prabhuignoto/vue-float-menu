import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';
import { useTouchOptimizations } from '../useTouchOptimizations';

// Helper component to test the composable
const TestComponent = defineComponent({
  setup() {
    const touch = useTouchOptimizations();
    return { ...touch };
  },
  template: '<div></div>',
});

describe('useTouchOptimizations', () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    // Mock user agent for touch device detection
    Object.defineProperty(window.navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    });

    Object.defineProperty(window.navigator, 'maxTouchPoints', {
      writable: true,
      value: 0,
    });

    wrapper = mount(TestComponent);
  });

  afterEach(() => {
    wrapper.unmount();
    document.body.classList.remove('touch-device');
  });

  describe('isTouchDevice detection', () => {
    it('should detect non-touch device', async () => {
      await nextTick();
      expect(wrapper.vm.isTouchDevice).toBe(false);
    });

    it('should detect touch device via maxTouchPoints', async () => {
      Object.defineProperty(window.navigator, 'maxTouchPoints', {
        writable: true,
        value: 1,
      });

      const wrapper2 = mount(TestComponent);
      await nextTick();

      expect(wrapper2.vm.isTouchDevice).toBe(true);
      wrapper2.unmount();
    });

    it('should detect mobile device via user agent - iPhone', async () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      });

      const wrapper2 = mount(TestComponent);
      await nextTick();

      expect(wrapper2.vm.isTouchDevice).toBe(true);
      wrapper2.unmount();
    });

    it('should detect Android device', async () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (Linux; Android 10)',
      });

      const wrapper2 = mount(TestComponent);
      await nextTick();

      expect(wrapper2.vm.isTouchDevice).toBe(true);
      wrapper2.unmount();
    });
  });

  describe('getSwipeDirection', () => {
    it('should return null initially', () => {
      const direction = wrapper.vm.getSwipeDirection();
      expect(direction).toBeNull();
    });
  });

  describe('triggerHapticFeedback', () => {
    it('should trigger vibration on supported devices', () => {
      const vibrateSpy = vi.fn();
      Object.defineProperty(window.navigator, 'vibrate', {
        writable: true,
        value: vibrateSpy,
      });

      wrapper.vm.triggerHapticFeedback('light');
      expect(vibrateSpy).toHaveBeenCalledWith([10]);

      wrapper.vm.triggerHapticFeedback('medium');
      expect(vibrateSpy).toHaveBeenCalledWith([20]);

      wrapper.vm.triggerHapticFeedback('heavy');
      expect(vibrateSpy).toHaveBeenCalledWith([30]);
    });

    it('should handle missing vibrate API gracefully', () => {
      const navigatorWithoutVibrate = { ...window.navigator };
      delete (navigatorWithoutVibrate as any).vibrate;

      Object.defineProperty(window, 'navigator', {
        writable: true,
        value: navigatorWithoutVibrate,
      });

      expect(() => wrapper.vm.triggerHapticFeedback()).not.toThrow();
    });
  });

  describe('ensureTouchTarget', () => {
    it('should handle ensureTouchTarget calls', () => {
      const element = document.createElement('div');
      element.style.width = '50px';
      element.style.height = '50px';
      document.body.appendChild(element);

      expect(() => wrapper.vm.ensureTouchTarget(element, 44)).not.toThrow();

      document.body.removeChild(element);
    });

    it('should increase small touch targets', () => {
      const element = document.createElement('div');
      element.style.width = '20px';
      element.style.height = '20px';
      document.body.appendChild(element);

      wrapper.vm.ensureTouchTarget(element, 44);

      expect(element.style.minWidth).toBe('44px');
      expect(element.style.minHeight).toBe('44px');

      document.body.removeChild(element);
    });
  });

  describe('getOptimalMenuOrientation', () => {
    let menuElement: HTMLElement;
    let triggerElement: HTMLElement;

    beforeEach(() => {
      menuElement = document.createElement('div');
      triggerElement = document.createElement('div');
      document.body.appendChild(menuElement);
      document.body.appendChild(triggerElement);
    });

    afterEach(() => {
      document.body.removeChild(menuElement);
      document.body.removeChild(triggerElement);
    });

    it('should prefer bottom orientation on mobile with space', () => {
      Object.defineProperty(window.navigator, 'maxTouchPoints', {
        writable: true,
        value: 1,
      });

      const wrapper2 = mount(TestComponent);

      // Mock getBoundingClientRect
      vi.spyOn(triggerElement, 'getBoundingClientRect').mockReturnValue({
        top: 100,
        bottom: 150,
        left: 0,
        right: 0,
        width: 0,
        height: 50,
        x: 0,
        y: 100,
        toJSON: () => ({}),
      });

      vi.spyOn(menuElement, 'getBoundingClientRect').mockReturnValue({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: 200,
        height: 300,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

      const viewport = { width: 600, height: 800 };
      const orientation = wrapper2.vm.getOptimalMenuOrientation(
        menuElement,
        triggerElement,
        viewport
      );

      expect(orientation).toBe('bottom');

      wrapper2.unmount();
    });

    it('should use desktop logic for non-touch devices', () => {
      vi.spyOn(triggerElement, 'getBoundingClientRect').mockReturnValue({
        top: 600,
        bottom: 650,
        left: 0,
        right: 0,
        width: 0,
        height: 50,
        x: 0,
        y: 600,
        toJSON: () => ({}),
      });

      vi.spyOn(menuElement, 'getBoundingClientRect').mockReturnValue({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: 200,
        height: 300,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

      const viewport = { width: 1200, height: 1000 };
      const orientation = wrapper.vm.getOptimalMenuOrientation(
        menuElement,
        triggerElement,
        viewport
      );

      expect(orientation).toBe('top');
    });
  });

  describe('enhanceAccessibility', () => {
    it('should add touch-action style', () => {
      const element = document.createElement('div');
      wrapper.vm.enhanceAccessibility(element);

      expect(element.style.touchAction).toBe('manipulation');
    });

    it('should add tabindex if missing', () => {
      const element = document.createElement('div');
      wrapper.vm.enhanceAccessibility(element);

      expect(element.getAttribute('tabindex')).toBe('0');
    });

    it('should not override existing tabindex', () => {
      const element = document.createElement('div');
      element.setAttribute('tabindex', '5');

      wrapper.vm.enhanceAccessibility(element);

      expect(element.getAttribute('tabindex')).toBe('5');
    });

    it('should add aria-label if missing', () => {
      const element = document.createElement('div');
      wrapper.vm.enhanceAccessibility(element);

      expect(element.getAttribute('aria-label')).toBe('Interactive menu item');
    });

    it('should not override existing aria-label', () => {
      const element = document.createElement('div');
      element.setAttribute('aria-label', 'Custom label');

      wrapper.vm.enhanceAccessibility(element);

      expect(element.getAttribute('aria-label')).toBe('Custom label');
    });

    it('should add role if missing', () => {
      const element = document.createElement('div');
      wrapper.vm.enhanceAccessibility(element);

      expect(element.getAttribute('role')).toBe('button');
    });

    it('should not override existing role', () => {
      const element = document.createElement('div');
      element.setAttribute('role', 'menuitem');

      wrapper.vm.enhanceAccessibility(element);

      expect(element.getAttribute('role')).toBe('menuitem');
    });
  });

  describe('lifecycle hooks', () => {
    it('should add touch-device class on mount for touch devices', async () => {
      Object.defineProperty(window.navigator, 'maxTouchPoints', {
        writable: true,
        value: 1,
      });

      const wrapper2 = mount(TestComponent);
      await nextTick();

      expect(document.body.classList.contains('touch-device')).toBe(true);

      wrapper2.unmount();
    });

    it('should inject touch-friendly CSS on mount', async () => {
      await nextTick();

      const styles = Array.from(document.head.querySelectorAll('style'));
      const hasTouchStyles = styles.some((style) =>
        style.textContent?.includes('.touch-device .menu-list-item')
      );

      expect(hasTouchStyles).toBe(true);
    });

    it('should remove touch-device class on unmount', async () => {
      Object.defineProperty(window.navigator, 'maxTouchPoints', {
        writable: true,
        value: 1,
      });

      const wrapper2 = mount(TestComponent);
      await nextTick();

      expect(document.body.classList.contains('touch-device')).toBe(true);

      wrapper2.unmount();

      expect(document.body.classList.contains('touch-device')).toBe(false);
    });
  });
});
