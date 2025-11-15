import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { useErrorHandling } from '../useErrorHandling';
import type { MenuItem, Theme } from '../../../types';

// Helper component to test the composable
const TestComponent = defineComponent({
  setup() {
    const errorHandling = useErrorHandling();
    return { ...errorHandling };
  },
  template: '<div></div>',
});

describe('useErrorHandling', () => {
  let wrapper: ReturnType<typeof mount>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleInfoSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    wrapper = mount(TestComponent);
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    wrapper.unmount();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleInfoSpy.mockRestore();
  });

  describe('addError', () => {
    it('should add an error with type error', () => {
      const id = wrapper.vm.addError('Test error', 'error');

      expect(id).toBeTruthy();
      expect(wrapper.vm.errors.length).toBe(1);
      expect(wrapper.vm.errors[0].message).toBe('Test error');
      expect(wrapper.vm.errors[0].type).toBe('error');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Test error', undefined);
    });

    it('should add a warning', () => {
      wrapper.vm.addError('Test warning', 'warning');

      expect(wrapper.vm.errors.length).toBe(1);
      expect(wrapper.vm.errors[0].type).toBe('warning');
      expect(consoleWarnSpy).toHaveBeenCalledWith('Test warning', undefined);
    });

    it('should add an info message', () => {
      wrapper.vm.addError('Test info', 'info');

      expect(wrapper.vm.errors.length).toBe(1);
      expect(wrapper.vm.errors[0].type).toBe('info');
      expect(consoleInfoSpy).toHaveBeenCalledWith('Test info', undefined);
    });

    it('should default to error type', () => {
      wrapper.vm.addError('Default error');

      expect(wrapper.vm.errors[0].type).toBe('error');
    });

    it('should include context in error', () => {
      const context = { foo: 'bar' };
      wrapper.vm.addError('Error with context', 'error', context);

      expect(wrapper.vm.errors[0].context).toEqual(context);
    });

    it('should limit errors to 10', () => {
      for (let i = 0; i < 15; i++) {
        wrapper.vm.addError(`Error ${i}`);
      }

      expect(wrapper.vm.errors.length).toBe(10);
      expect(wrapper.vm.errors[0].message).toBe('Error 14');
    });

    it('should add timestamp to error', () => {
      wrapper.vm.addError('Test error');

      expect(wrapper.vm.errors[0].timestamp).toBeInstanceOf(Date);
    });

    it('should generate unique IDs', () => {
      const id1 = wrapper.vm.addError('Error 1');
      const id2 = wrapper.vm.addError('Error 2');

      expect(id1).not.toBe(id2);
    });
  });

  describe('removeError', () => {
    it('should remove error by ID', () => {
      const id = wrapper.vm.addError('Test error');
      expect(wrapper.vm.errors.length).toBe(1);

      wrapper.vm.removeError(id);
      expect(wrapper.vm.errors.length).toBe(0);
    });

    it('should do nothing if ID not found', () => {
      wrapper.vm.addError('Test error');
      wrapper.vm.removeError('non-existent-id');

      expect(wrapper.vm.errors.length).toBe(1);
    });
  });

  describe('clearErrors', () => {
    it('should clear all errors', () => {
      wrapper.vm.addError('Error 1');
      wrapper.vm.addError('Error 2');
      wrapper.vm.addError('Error 3');

      expect(wrapper.vm.errors.length).toBe(3);

      wrapper.vm.clearErrors();
      expect(wrapper.vm.errors.length).toBe(0);
    });
  });

  describe('clearErrorsByType', () => {
    beforeEach(() => {
      wrapper.vm.addError('Error 1', 'error');
      wrapper.vm.addError('Warning 1', 'warning');
      wrapper.vm.addError('Info 1', 'info');
      wrapper.vm.addError('Error 2', 'error');
    });

    it('should clear only errors', () => {
      wrapper.vm.clearErrorsByType('error');

      expect(wrapper.vm.errors.length).toBe(2);
      expect(wrapper.vm.errors.every((e) => e.type !== 'error')).toBe(true);
    });

    it('should clear only warnings', () => {
      wrapper.vm.clearErrorsByType('warning');

      expect(wrapper.vm.errors.length).toBe(3);
      expect(wrapper.vm.errors.every((e) => e.type !== 'warning')).toBe(true);
    });

    it('should clear only info', () => {
      wrapper.vm.clearErrorsByType('info');

      expect(wrapper.vm.errors.length).toBe(3);
      expect(wrapper.vm.errors.every((e) => e.type !== 'info')).toBe(true);
    });
  });

  describe('tryAsync', () => {
    it('should execute async function successfully', async () => {
      const asyncFn = vi.fn().mockResolvedValue('success');
      const result = await wrapper.vm.tryAsync(asyncFn);

      expect(result).toBe('success');
      expect(wrapper.vm.errors.length).toBe(0);
    });

    it('should handle async errors', async () => {
      const asyncFn = vi.fn().mockRejectedValue(new Error('Async error'));
      const result = await wrapper.vm.tryAsync(asyncFn);

      expect(result).toBeNull();
      expect(wrapper.vm.errors.length).toBe(1);
      expect(wrapper.vm.errors[0].message).toContain('Async error');
    });

    it('should use custom error message', async () => {
      const asyncFn = vi.fn().mockRejectedValue(new Error('Original error'));
      await wrapper.vm.tryAsync(asyncFn, 'Custom error message');

      expect(wrapper.vm.errors[0].message).toBe('Custom error message');
    });

    it('should call onError callback', async () => {
      const onError = vi.fn();
      const asyncFn = vi.fn().mockRejectedValue(new Error('Test error'));

      await wrapper.vm.tryAsync(asyncFn, undefined, onError);

      expect(onError).toHaveBeenCalled();
      expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    });

    it('should handle non-Error rejections', async () => {
      const asyncFn = vi.fn().mockRejectedValue('string error');
      const result = await wrapper.vm.tryAsync(asyncFn);

      expect(result).toBeNull();
      expect(wrapper.vm.errors.length).toBe(1);
    });
  });

  describe('trySync', () => {
    it('should execute sync function successfully', () => {
      const syncFn = vi.fn().mockReturnValue('success');
      const result = wrapper.vm.trySync(syncFn);

      expect(result).toBe('success');
      expect(wrapper.vm.errors.length).toBe(0);
    });

    it('should handle sync errors', () => {
      const syncFn = vi.fn(() => {
        throw new Error('Sync error');
      });
      const result = wrapper.vm.trySync(syncFn);

      expect(result).toBeNull();
      expect(wrapper.vm.errors.length).toBe(1);
      expect(wrapper.vm.errors[0].message).toContain('Sync error');
    });

    it('should use custom error message', () => {
      const syncFn = vi.fn(() => {
        throw new Error('Original error');
      });
      wrapper.vm.trySync(syncFn, 'Custom error message');

      expect(wrapper.vm.errors[0].message).toBe('Custom error message');
    });

    it('should call onError callback', () => {
      const onError = vi.fn();
      const syncFn = vi.fn(() => {
        throw new Error('Test error');
      });

      wrapper.vm.trySync(syncFn, undefined, onError);

      expect(onError).toHaveBeenCalled();
    });
  });

  describe('validateMenuData', () => {
    it('should validate correct menu data', () => {
      const menuData: MenuItem[] = [{ name: 'Item 1' }, { name: 'Item 2' }, { divider: true }];

      const isValid = wrapper.vm.validateMenuData(menuData);
      expect(isValid).toBe(true);
      expect(wrapper.vm.errors.length).toBe(0);
    });

    it('should reject non-array data', () => {
      const isValid = wrapper.vm.validateMenuData('not an array' as unknown as MenuItem[]);

      expect(isValid).toBe(false);
      expect(wrapper.vm.errors[0].message).toContain('must be an array');
    });

    it('should reject non-object items', () => {
      const menuData = ['string item'] as unknown as MenuItem[];
      const isValid = wrapper.vm.validateMenuData(menuData);

      expect(isValid).toBe(false);
      expect(wrapper.vm.errors[0].message).toContain('must be an object');
    });

    it('should reject items without name or divider', () => {
      const menuData: MenuItem[] = [{} as MenuItem];
      const isValid = wrapper.vm.validateMenuData(menuData);

      expect(isValid).toBe(false);
      expect(wrapper.vm.errors[0].message).toContain('must have a name or be a divider');
    });

    it('should validate nested submenu items', () => {
      const menuData: MenuItem[] = [
        {
          name: 'Parent',
          subMenu: {
            name: 'submenu',
            items: [{ name: 'Child' }],
          },
        },
      ];

      const isValid = wrapper.vm.validateMenuData(menuData);
      expect(isValid).toBe(true);
    });

    it('should reject invalid submenu items', () => {
      const menuData: MenuItem[] = [
        {
          name: 'Parent',
          subMenu: {
            name: 'submenu',
            items: 'not an array' as unknown as MenuItem[],
          },
        },
      ];

      const isValid = wrapper.vm.validateMenuData(menuData);
      expect(isValid).toBe(false);
    });

    it('should recursively validate nested items', () => {
      const menuData: MenuItem[] = [
        {
          name: 'Parent',
          subMenu: {
            name: 'submenu',
            items: [{} as MenuItem],
          },
        },
      ];

      const isValid = wrapper.vm.validateMenuData(menuData);
      expect(isValid).toBe(false);
    });
  });

  describe('validateTheme', () => {
    it('should validate correct theme', () => {
      const theme: Theme = {
        primary: '#000',
        menuBgColor: '#fff',
        textColor: '#333',
        textSelectedColor: '#fff',
        hoverBackground: '#eee',
      };

      const isValid = wrapper.vm.validateTheme(theme);
      expect(isValid).toBe(true);
    });

    it('should reject non-object theme', () => {
      const isValid = wrapper.vm.validateTheme('not an object' as unknown as Theme);

      expect(isValid).toBe(false);
      expect(wrapper.vm.errors[0].message).toContain('must be an object');
    });

    it('should warn about missing required properties', () => {
      const theme: Partial<Theme> = {
        primary: '#000',
      };

      wrapper.vm.validateTheme(theme as Theme);

      expect(wrapper.vm.errors.length).toBeGreaterThan(0);
      expect(wrapper.vm.errors.some((e) => e.message.includes('missing required property'))).toBe(
        true
      );
    });
  });

  describe('handleDOMError', () => {
    it('should handle DOM error', () => {
      const error = new Error('DOM error');
      wrapper.vm.handleDOMError(error);

      expect(wrapper.vm.errors.length).toBe(1);
      expect(wrapper.vm.errors[0].message).toContain('DOM operation failed');
    });

    it('should include element info', () => {
      const error = new Error('DOM error');
      const element = document.createElement('div');

      wrapper.vm.handleDOMError(error, element);

      expect(wrapper.vm.errors[0].context).toHaveProperty('element', 'DIV');
    });
  });

  describe('handleKeyboardError', () => {
    it('should handle keyboard error', () => {
      const error = new Error('Keyboard error');
      wrapper.vm.handleKeyboardError(error, 'Enter');

      expect(wrapper.vm.errors.length).toBe(1);
      expect(wrapper.vm.errors[0].message).toContain('Keyboard navigation error');
      expect(wrapper.vm.errors[0].context).toMatchObject({ keyCode: 'Enter' });
    });
  });

  describe('handleAnimationError', () => {
    it('should handle animation error as warning', () => {
      const error = new Error('Animation error');
      wrapper.vm.handleAnimationError(error, 'fade');

      expect(wrapper.vm.errors.length).toBe(1);
      expect(wrapper.vm.errors[0].type).toBe('warning');
      expect(wrapper.vm.errors[0].message).toContain('Animation error');
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('should return friendly message for menu data error', () => {
      const errorInfo = {
        id: '1',
        message: 'Menu data must be an array',
        type: 'error' as const,
        timestamp: new Date(),
      };

      const friendly = wrapper.vm.getUserFriendlyMessage(errorInfo);
      expect(friendly).toBe('Invalid menu configuration. Please check your menu data.');
    });

    it('should return friendly message for DOM error', () => {
      const errorInfo = {
        id: '1',
        message: 'DOM operation failed: test',
        type: 'error' as const,
        timestamp: new Date(),
      };

      const friendly = wrapper.vm.getUserFriendlyMessage(errorInfo);
      expect(friendly).toBe('Interface error occurred. Please try again.');
    });

    it('should return default message for unknown errors', () => {
      const errorInfo = {
        id: '1',
        message: 'Unknown error type',
        type: 'error' as const,
        timestamp: new Date(),
      };

      const friendly = wrapper.vm.getUserFriendlyMessage(errorInfo);
      expect(friendly).toBe('An unexpected error occurred. Please try again.');
    });
  });

  describe('computed properties', () => {
    it('should compute hasErrors correctly', () => {
      expect(wrapper.vm.hasErrors).toBe(false);

      wrapper.vm.addError('Test error');
      expect(wrapper.vm.hasErrors).toBe(true);

      wrapper.vm.clearErrors();
      expect(wrapper.vm.hasErrors).toBe(false);
    });

    it('should compute errorCount correctly', () => {
      expect(wrapper.vm.errorCount).toBe(0);

      wrapper.vm.addError('Error 1');
      wrapper.vm.addError('Error 2');
      expect(wrapper.vm.errorCount).toBe(2);
    });

    it('should compute latestError correctly', () => {
      expect(wrapper.vm.latestError).toBeNull();

      wrapper.vm.addError('Error 1');
      wrapper.vm.addError('Error 2');

      expect(wrapper.vm.latestError?.message).toBe('Error 2');
    });

    it('should compute errorsByType correctly', () => {
      wrapper.vm.addError('Error 1', 'error');
      wrapper.vm.addError('Warning 1', 'warning');
      wrapper.vm.addError('Info 1', 'info');
      wrapper.vm.addError('Error 2', 'error');

      const byType = wrapper.vm.errorsByType;

      expect(byType.errors.length).toBe(2);
      expect(byType.warnings.length).toBe(1);
      expect(byType.info.length).toBe(1);
    });
  });
});
