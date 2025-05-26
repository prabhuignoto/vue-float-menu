import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import FloatMenu from '../index.vue';
import { nextTick } from 'vue';

describe('Menu Close Animation', () => {
  let wrapper;

  beforeEach(() => {
    // Mock the Web Animation API
    Element.prototype.animate = vi.fn().mockReturnValue({
      onfinish: null,
      finished: Promise.resolve(),
    });

    // Create a test component with basic props
    wrapper = mount(FloatMenu, {
      props: {
        dimension: 50,
        menuData: [{ name: 'Test Item 1' }, { name: 'Test Item 2' }],
        position: 'top right',
        onSelected: vi.fn(),
      },
      attachTo: document.body,
    });
  });

  afterEach(() => {
    wrapper.unmount();
    vi.restoreAllMocks();
  });

  it('animates menu closing when close button is clicked', async () => {
    // Open the menu first
    await wrapper.find('.menu-head').trigger('click');
    await nextTick();

    // Verify menu is open
    expect(wrapper.vm.menuActive).toBe(true);

    // Click close button
    await wrapper.find('.close-btn').trigger('mousedown');

    // Verify animation was triggered
    expect(Element.prototype.animate).toHaveBeenCalled();

    // Complete the animation by triggering onfinish
    const animateCall = Element.prototype.animate.mock.results[0];
    if (animateCall.value.onfinish) {
      animateCall.value.onfinish();
    }

    // Verify menu is closed
    expect(wrapper.vm.menuActive).toBe(false);
  });

  it('animates menu closing on swipe gesture', async () => {
    // Mock touch direction
    wrapper.vm.getSwipeDirection = vi.fn().mockReturnValue({
      direction: 'up',
      distance: 50,
    });

    // Open the menu first
    await wrapper.find('.menu-head').trigger('click');
    await nextTick();

    // Verify menu is open
    expect(wrapper.vm.menuActive).toBe(true);

    // Simulate swipe gesture
    await wrapper.find('.menu-head-wrapper').trigger('touchend');

    // Verify animation was triggered
    expect(Element.prototype.animate).toHaveBeenCalled();

    // Complete the animation by triggering onfinish
    const animateCall = Element.prototype.animate.mock.results[0];
    if (animateCall.value.onfinish) {
      animateCall.value.onfinish();
    }

    // Verify menu is closed
    expect(wrapper.vm.menuActive).toBe(false);
  });

  it('animates menu closing when an item is selected', async () => {
    // Open the menu first
    await wrapper.find('.menu-head').trigger('click');
    await nextTick();

    // Verify menu is open
    expect(wrapper.vm.menuActive).toBe(true);

    // Select a menu item
    wrapper.vm.handleMenuItemSelection('Test Item 1');

    // Verify animation was triggered
    expect(Element.prototype.animate).toHaveBeenCalled();

    // Complete the animation by triggering onfinish
    const animateCall = Element.prototype.animate.mock.results[0];
    if (animateCall.value.onfinish) {
      animateCall.value.onfinish();
    }

    // Verify menu is closed
    expect(wrapper.vm.menuActive).toBe(false);

    // Verify callback was triggered
    expect(wrapper.props('onSelected')).toHaveBeenCalledWith('Test Item 1');
  });
});
