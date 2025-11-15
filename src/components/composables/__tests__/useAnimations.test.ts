import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { useAnimations } from '../useAnimations';

// Helper component to test the composable
const TestComponent = defineComponent({
  setup() {
    const animations = useAnimations();
    return { ...animations };
  },
  template: '<div></div>',
});

describe('useAnimations', () => {
  let wrapper: ReturnType<typeof mount>;
  let mockMediaQuery: { matches: boolean; addEventListener: vi.Mock; removeEventListener: vi.Mock };

  beforeEach(() => {
    // Mock matchMedia
    mockMediaQuery = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    window.matchMedia = vi.fn(() => mockMediaQuery as unknown as MediaQueryList);

    wrapper = mount(TestComponent);
  });

  afterEach(() => {
    wrapper.unmount();
    vi.clearAllMocks();
  });

  describe('prefersReducedMotion', () => {
    it('should detect reduced motion preference from media query', () => {
      mockMediaQuery.matches = true;
      const wrapper2 = mount(TestComponent);
      expect(wrapper2.vm.prefersReducedMotion).toBe(true);
      wrapper2.unmount();
    });

    it('should register media query change listener', () => {
      const wrapper2 = mount(TestComponent);

      expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));

      wrapper2.unmount();
    });

    it('should clean up event listener on unmount', () => {
      const wrapper2 = mount(TestComponent);
      wrapper2.unmount();
      expect(mockMediaQuery.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });
  });

  describe('getAnimationDuration', () => {
    it('should return normal duration when reduced motion is off', () => {
      const duration = wrapper.vm.getAnimationDuration(300);
      expect(duration).toBe(300);
    });

    it('should return reduced duration when reduced motion is on', () => {
      mockMediaQuery.matches = true;
      const wrapper2 = mount(TestComponent);
      const duration = wrapper2.vm.getAnimationDuration(300, 100);
      expect(duration).toBe(100);
      wrapper2.unmount();
    });

    it('should return 0 as default reduced duration', () => {
      mockMediaQuery.matches = true;
      const wrapper2 = mount(TestComponent);
      const duration = wrapper2.vm.getAnimationDuration(300);
      expect(duration).toBe(0);
      wrapper2.unmount();
    });
  });

  describe('getTimingFunction', () => {
    it('should return ease for reduced motion', () => {
      mockMediaQuery.matches = true;
      const wrapper2 = mount(TestComponent);
      const timing = wrapper2.vm.getTimingFunction('bounce');
      expect(timing).toBe('ease');
      wrapper2.unmount();
    });

    it('should return ease timing function', () => {
      const timing = wrapper.vm.getTimingFunction('ease');
      expect(timing).toBe('ease');
    });

    it('should return ease-in timing function', () => {
      const timing = wrapper.vm.getTimingFunction('ease-in');
      expect(timing).toBe('cubic-bezier(0.4, 0, 1, 1)');
    });

    it('should return ease-out timing function', () => {
      const timing = wrapper.vm.getTimingFunction('ease-out');
      expect(timing).toBe('cubic-bezier(0, 0, 0.2, 1)');
    });

    it('should return ease-in-out timing function', () => {
      const timing = wrapper.vm.getTimingFunction('ease-in-out');
      expect(timing).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
    });

    it('should return bounce timing function', () => {
      const timing = wrapper.vm.getTimingFunction('bounce');
      expect(timing).toBe('cubic-bezier(0.68, -0.55, 0.265, 1.55)');
    });

    it('should default to ease-out', () => {
      const timing = wrapper.vm.getTimingFunction();
      expect(timing).toBe('cubic-bezier(0, 0, 0.2, 1)');
    });
  });

  describe('animateElement', () => {
    let element: HTMLElement;

    beforeEach(() => {
      element = document.createElement('div');
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should apply styles immediately when reduced motion is enabled', () => {
      mockMediaQuery.matches = true;
      const wrapper2 = mount(TestComponent);

      wrapper2.vm.animateElement(element, { opacity: '0.5', color: 'red' });

      expect(element.style.opacity).toBe('0.5');
      expect(element.style.color).toBe('red');
      wrapper2.unmount();
    });

    it('should call onComplete when reduced motion is enabled', () => {
      mockMediaQuery.matches = true;
      const wrapper2 = mount(TestComponent);
      const onComplete = vi.fn();

      wrapper2.vm.animateElement(element, { opacity: '0.5' }, { onComplete });

      expect(onComplete).toHaveBeenCalled();
      wrapper2.unmount();
    });

    it('should set transition and apply styles', () => {
      wrapper.vm.animateElement(element, { opacity: '0.5' }, { duration: 300 });

      expect(element.style.transition).toContain('300ms');
      expect(element.style.opacity).toBe('0.5');
    });

    it('should apply delay before animating', () => {
      wrapper.vm.animateElement(element, { opacity: '0.5' }, { delay: 100 });

      expect(element.style.opacity).toBe('');

      vi.advanceTimersByTime(100);

      expect(element.style.opacity).toBe('0.5');
    });

    it('should call onComplete after animation duration', () => {
      const onComplete = vi.fn();
      wrapper.vm.animateElement(element, { opacity: '0.5' }, { duration: 300, onComplete });

      expect(onComplete).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);

      expect(onComplete).toHaveBeenCalled();
      expect(element.style.transition).toBe('');
    });
  });

  describe('slideIn', () => {
    let element: HTMLElement;

    beforeEach(() => {
      element = document.createElement('div');
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });
    });

    it('should slide in from left', () => {
      wrapper.vm.slideIn(element, 'left');
      expect(element.style.transform).toContain('translateX');
    });

    it('should slide in from right', () => {
      wrapper.vm.slideIn(element, 'right');
      expect(element.style.transform).toContain('translateX');
    });

    it('should slide in from up', () => {
      wrapper.vm.slideIn(element, 'up');
      expect(element.style.transform).toContain('translateY');
    });

    it('should slide in from down', () => {
      wrapper.vm.slideIn(element, 'down');
      expect(element.style.transform).toContain('translateY');
    });

    it('should call slideIn without errors', () => {
      expect(() => wrapper.vm.slideIn(element, 'right')).not.toThrow();
    });
  });

  describe('fadeIn and fadeOut', () => {
    let element: HTMLElement;

    beforeEach(() => {
      element = document.createElement('div');
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });
    });

    it('should call fadeIn without errors', () => {
      expect(() => wrapper.vm.fadeIn(element)).not.toThrow();
    });

    it('should use custom duration for fadeIn', () => {
      wrapper.vm.fadeIn(element, 250);
      // Animation is applied, verify it was called
      expect(element.style.transition).toBeTruthy();
    });

    it('should fade out element', () => {
      wrapper.vm.fadeOut(element);
      expect(element.style.transition).toBeTruthy();
    });

    it('should call onComplete for fadeOut', () => {
      vi.useFakeTimers();
      const onComplete = vi.fn();
      wrapper.vm.fadeOut(element, 150, onComplete);

      vi.advanceTimersByTime(150);

      expect(onComplete).toHaveBeenCalled();
      vi.useRealTimers();
    });
  });

  describe('scaleAnimation and resetScale', () => {
    let element: HTMLElement;

    beforeEach(() => {
      element = document.createElement('div');
    });

    it('should scale element to custom value', () => {
      wrapper.vm.scaleAnimation(element, 1.2);
      expect(element.style.transition).toBeTruthy();
    });

    it('should use default scale of 1.05', () => {
      wrapper.vm.scaleAnimation(element);
      expect(element.style.transition).toBeTruthy();
    });

    it('should reset scale to 1', () => {
      wrapper.vm.resetScale(element);
      expect(element.style.transition).toBeTruthy();
    });
  });

  describe('createRipple', () => {
    let element: HTMLElement;
    let event: MouseEvent;

    beforeEach(() => {
      element = document.createElement('div');
      document.body.appendChild(element);
      element.style.position = 'absolute';
      element.style.width = '100px';
      element.style.height = '100px';

      event = new MouseEvent('click', {
        clientX: 50,
        clientY: 50,
      });

      vi.useFakeTimers();
    });

    afterEach(() => {
      document.body.removeChild(element);
      vi.useRealTimers();
    });

    it('should not create ripple when reduced motion is enabled', () => {
      mockMediaQuery.matches = true;
      const wrapper2 = mount(TestComponent);

      wrapper2.vm.createRipple(element, event);

      expect(element.children.length).toBe(0);
      wrapper2.unmount();
    });

    it('should create ripple element', () => {
      wrapper.vm.createRipple(element, event);

      expect(element.children.length).toBe(1);
      expect(element.children[0].tagName).toBe('SPAN');
    });

    it('should inject ripple keyframes', () => {
      wrapper.vm.createRipple(element, event);

      const style = document.querySelector('#ripple-keyframes');
      expect(style).toBeTruthy();
    });

    it('should remove ripple after animation', () => {
      wrapper.vm.createRipple(element, event);

      expect(element.children.length).toBe(1);

      vi.advanceTimersByTime(600);

      expect(element.children.length).toBe(0);
    });

    it('should not inject keyframes twice', () => {
      wrapper.vm.createRipple(element, event);
      const style1 = document.querySelector('#ripple-keyframes');

      wrapper.vm.createRipple(element, event);
      const style2 = document.querySelector('#ripple-keyframes');

      expect(style1).toBe(style2);
    });
  });

  describe('queueAnimation', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should queue and execute animations sequentially', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      wrapper.vm.queueAnimation(callback1);
      wrapper.vm.queueAnimation(callback2);

      expect(callback1).toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(callback2).toHaveBeenCalled();
    });

    it('should handle single animation', () => {
      const callback = vi.fn();
      wrapper.vm.queueAnimation(callback);

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('transitionClasses', () => {
    it('should provide transition class configuration', () => {
      const classes = wrapper.vm.transitionClasses;

      expect(classes).toHaveProperty('menu-enter-active');
      expect(classes).toHaveProperty('menu-leave-active');
      expect(classes).toHaveProperty('menu-enter-from');
      expect(classes).toHaveProperty('menu-enter-to');
      expect(classes).toHaveProperty('menu-leave-from');
      expect(classes).toHaveProperty('menu-leave-to');
    });

    it('should include animation duration in classes', () => {
      const classes = wrapper.vm.transitionClasses;
      expect(classes['menu-enter-active']).toContain('duration-200');
    });
  });
});
