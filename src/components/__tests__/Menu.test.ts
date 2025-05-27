import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Menu from '../Menu.vue';
import { MenuItem } from '../../types';

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
};

// Mock matchMedia for accessibility tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('Menu.vue', () => {
  const mockMenuData: MenuItem[] = [
    {
      name: 'Copy',
      selected: false,
      disabled: false,
    },
    {
      name: 'Paste',
      selected: false,
      disabled: false,
    },
    {
      name: 'Edit',
      selected: false,
      disabled: false,
      subMenu: {
        items: [
          { name: 'Undo', selected: false, disabled: false },
          { name: 'Redo', selected: false, disabled: false },
        ],
      },
    },
    {
      divider: true,
    },
    {
      name: 'Delete',
      selected: false,
      disabled: false,
    },
  ];

  const defaultProps = {
    data: mockMenuData,
    onClose: vi.fn(),
    onSelection: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Mounting', () => {
    it('renders correctly with menu items', () => {
      const wrapper = mount(Menu, {
        props: defaultProps,
      });

      expect(wrapper.find('.menu-wrapper').exists()).toBe(true);
      expect(wrapper.find('.menu-list').exists()).toBe(true);
      expect(wrapper.findAll('.menu-list-item')).toHaveLength(5); // 4 items + 1 divider
    });

    it('applies correct ARIA attributes', () => {
      const wrapper = mount(Menu, {
        props: defaultProps,
      });

      const menuWrapper = wrapper.find('.menu-wrapper');
      expect(menuWrapper.attributes('role')).toBe('menu');
      expect(menuWrapper.attributes('aria-label')).toBe('Context menu');
      expect(menuWrapper.attributes('aria-orientation')).toBe('vertical');

      const menuItems = wrapper.findAll('[role="menuitem"]');
      expect(menuItems).toHaveLength(4); // Excluding divider

      menuItems.forEach((item, index: number) => {
        expect(item.attributes('aria-setsize')).toBe('5');
        expect(item.attributes('aria-posinset')).toBe(String(index + 1));
      });
    });

    it('focuses the menu on mount', async () => {
      const wrapper = mount(Menu, {
        props: defaultProps,
        attachTo: document.body,
      });

      await wrapper.vm.$nextTick();

      // Check if the menu wrapper has focus
      expect(document.activeElement).toBe(wrapper.find('.menu-wrapper').element);

      wrapper.unmount();
    });
  });

  describe('Menu Interactions', () => {
    it('handles menu item clicks correctly', async () => {
      const onSelection = vi.fn();
      const wrapper = mount(Menu, {
        props: {
          ...defaultProps,
          onSelection,
        },
      });

      const firstMenuItem = wrapper.findAll('.menu-list-item')[0];
      await firstMenuItem.trigger('mousedown');

      expect(onSelection).toHaveBeenCalledWith('Copy');
    });

    it('does not trigger selection for disabled items', async () => {
      const onSelection = vi.fn();
      const disabledData = [{ name: 'Disabled Item', selected: false, disabled: true }];

      const wrapper = mount(Menu, {
        props: {
          ...defaultProps,
          data: disabledData,
          onSelection,
        },
      });

      const disabledItem = wrapper.find('.menu-list-item');
      await disabledItem.trigger('mousedown');

      expect(onSelection).not.toHaveBeenCalled();
    });

    it('toggles submenu visibility on click', async () => {
      const wrapper = mount(Menu, {
        props: defaultProps,
      });

      const editMenuItem = wrapper.findAll('.menu-list-item')[2]; // Edit item with submenu
      await editMenuItem.trigger('mousedown');

      // Check if submenu is visible
      expect(wrapper.find('.sub-menu-wrapper').exists()).toBe(true);

      // Click again to hide
      await editMenuItem.trigger('mousedown');

      // Wait for animation to complete
      await new Promise((resolve) => setTimeout(resolve, 250));

      expect(wrapper.find('.sub-menu-wrapper').exists()).toBe(false);
    });
  });

  describe('Keyboard Navigation', () => {
    it('handles arrow down navigation', async () => {
      const wrapper = mount(Menu, {
        props: defaultProps,
        attachTo: document.body,
      });

      const menuWrapper = wrapper.find('.menu-wrapper');

      // Simulate arrow down key
      await menuWrapper.trigger('keyup', { key: 'ArrowDown' });

      // Check if first item is selected
      expect(wrapper.findAll('.menu-list-item')[0].classes()).toContain('selected');

      // Arrow down again
      await menuWrapper.trigger('keyup', { key: 'ArrowDown' });

      // Check if second item is selected
      expect(wrapper.findAll('.menu-list-item')[1].classes()).toContain('selected');

      wrapper.unmount();
    });

    it('skips dividers during navigation', async () => {
      const wrapper = mount(Menu, {
        props: defaultProps,
        attachTo: document.body,
      });

      const menuWrapper = wrapper.find('.menu-wrapper');

      // Navigate to the item before divider
      await menuWrapper.trigger('keyup', { key: 'ArrowDown' }); // Copy
      await menuWrapper.trigger('keyup', { key: 'ArrowDown' }); // Paste
      await menuWrapper.trigger('keyup', { key: 'ArrowDown' }); // Edit
      await menuWrapper.trigger('keyup', { key: 'ArrowDown' }); // Should skip divider and go to Delete

      // Check that Delete item is selected (index 4, skipping divider at index 3)
      expect(wrapper.findAll('.menu-list-item')[4].classes()).toContain('selected');

      wrapper.unmount();
    });

    it('handles escape key to close menu', async () => {
      const onClose = vi.fn();
      const wrapper = mount(Menu, {
        props: {
          ...defaultProps,
          onClose,
        },
        attachTo: document.body,
      });

      const menuWrapper = wrapper.find('.menu-wrapper');
      await menuWrapper.trigger('keyup', { key: 'Escape' });

      expect(onClose).toHaveBeenCalled();

      wrapper.unmount();
    });

    it('handles enter key for selection', async () => {
      const onSelection = vi.fn();
      const wrapper = mount(Menu, {
        props: {
          ...defaultProps,
          onSelection,
        },
        attachTo: document.body,
      });

      const menuWrapper = wrapper.find('.menu-wrapper');

      // Navigate to first item and press enter
      await menuWrapper.trigger('keyup', { key: 'ArrowDown' });
      await menuWrapper.trigger('keyup', { key: 'Enter' });

      expect(onSelection).toHaveBeenCalledWith('Copy');

      wrapper.unmount();
    });

    it('handles submenu navigation with arrow keys', async () => {
      const wrapper = mount(Menu, {
        props: {
          ...defaultProps,
          flip: false,
        },
        attachTo: document.body,
      });

      const menuWrapper = wrapper.find('.menu-wrapper');

      // Navigate to Edit item (has submenu)
      await menuWrapper.trigger('keyup', { key: 'ArrowDown' });
      await menuWrapper.trigger('keyup', { key: 'ArrowDown' });
      await menuWrapper.trigger('keyup', { key: 'ArrowDown' });

      // Press right arrow to open submenu
      await menuWrapper.trigger('keyup', { key: 'ArrowRight' });

      // Check if submenu is visible
      expect(wrapper.find('.sub-menu-wrapper').exists()).toBe(true);

      wrapper.unmount();
    });
  });

  describe('Theming', () => {
    it('applies custom theme correctly', () => {
      const customTheme = {
        primary: '#ff0000',
        menuBgColor: '#ffffff',
        textColor: '#000000',
        textSelectedColor: '#ffffff',
        hoverBackground: '#f0f0f0',
      };

      const wrapper = mount(Menu, {
        props: {
          ...defaultProps,
          theme: customTheme,
        },
      });

      const menuList = wrapper.find('.menu-list');
      const style = menuList.attributes('style');

      expect(style).toContain('--background: #ff0000');
      expect(style).toContain('--menu-background: #ffffff');
      expect(style).toContain('--menu-text-color: #000000');
    });
  });

  describe('Accessibility Features', () => {
    it('respects reduced motion preference', () => {
      // Mock reduced motion preference
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const wrapper = mount(Menu, {
        props: defaultProps,
      });

      // Animation duration should be 0 for reduced motion
      expect(wrapper.vm.animationDuration).toBe(0);
    });

    it('creates screen reader announcements', async () => {
      const wrapper = mount(Menu, {
        props: defaultProps,
        attachTo: document.body,
      });

      const firstMenuItem = wrapper.findAll('.menu-list-item')[0];
      await firstMenuItem.trigger('mousedown');

      // Check if announcement element was created
      const announcements = document.querySelectorAll('[aria-live="polite"]');
      expect(announcements.length).toBeGreaterThan(0);

      wrapper.unmount();
    });
  });

  describe('Performance Optimizations', () => {
    it('memoizes theme calculations', () => {
      const wrapper = mount(Menu, {
        props: defaultProps,
      });

      const firstCall = wrapper.vm.themeStyles;
      const secondCall = wrapper.vm.themeStyles;

      // Should return the same computed reference
      expect(firstCall).toBe(secondCall);
    });
  });

  describe('Error Handling', () => {
    it('handles invalid menu data gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Test with invalid data
      const wrapper = mount(Menu, {
        props: {
          ...defaultProps,
          data: null as unknown,
        },
      });

      // Component should still render without crashing
      expect(wrapper.find('.menu-wrapper').exists()).toBe(true);

      consoleSpy.mockRestore();
    });

    it('catches and logs keyboard navigation errors', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const wrapper = mount(Menu, {
        props: defaultProps,
        attachTo: document.body,
      });

      // Trigger error by setting invalid state
      wrapper.vm.menuItems = null as unknown;

      const menuWrapper = wrapper.find('.menu-wrapper');
      await menuWrapper.trigger('keyup', { key: 'ArrowDown' });

      expect(consoleSpy).toHaveBeenCalledWith('Keyboard navigation failed:', expect.any(Error));

      consoleSpy.mockRestore();
      wrapper.unmount();
    });
  });

  describe('Menu Styles', () => {
    it('applies correct CSS classes for different menu styles', () => {
      const wrapper = mount(Menu, {
        props: {
          ...defaultProps,
          menuStyle: 'accordion',
        },
      });

      expect(wrapper.vm.isAccordion).toBe(true);
      expect(wrapper.vm.subMenuClass).toBe('sub-menu-wrapper accordion');
      expect(wrapper.vm.menuItemClass).toBe('menu-item-wrapper accordion');
    });

    it('handles flip mode correctly', () => {
      const wrapper = mount(Menu, {
        props: {
          ...defaultProps,
          flip: true,
        },
      });

      const menuItems = wrapper.findAll('.menu-list-item');
      menuItems.forEach((item: ReturnType<typeof wrapper.find>) => {
        if (!item.classes().includes('divider')) {
          expect(item.classes()).toContain('flip');
        }
      });
    });
  });
});
