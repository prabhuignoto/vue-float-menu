import { ref, computed } from 'vue';
import type { MenuItem, Theme } from '../../types';

interface ErrorInfo {
  id: string;
  message: string;
  type: 'warning' | 'error' | 'info';
  timestamp: Date;
  context?: unknown;
}

/**
 * Composable for comprehensive error handling
 * Provides error tracking, logging, and user-friendly error messages
 */
export function useErrorHandling() {
  const errors = ref<ErrorInfo[]>([]);
  const maxErrors = 10; // Keep only the last 10 errors

  /**
   * Add a new error
   */
  const addError = (
    message: string,
    type: 'warning' | 'error' | 'info' = 'error',
    context?: unknown
  ) => {
    const error: ErrorInfo = {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      type,
      timestamp: new Date(),
      context,
    };

    errors.value.unshift(error);

    // Keep only the most recent errors
    if (errors.value.length > maxErrors) {
      errors.value = errors.value.slice(0, maxErrors);
    }

    // Log to console for debugging
    if (type === 'error') {
      console.error(message, context);
    } else if (type === 'warning') {
      console.warn(message, context);
    } else {
      console.info(message, context);
    }

    return error.id;
  };

  /**
   * Remove an error by ID
   */
  const removeError = (id: string) => {
    const index = errors.value.findIndex((error) => error.id === id);
    if (index > -1) {
      errors.value.splice(index, 1);
    }
  };

  /**
   * Clear all errors
   */
  const clearErrors = () => {
    errors.value = [];
  };

  /**
   * Clear errors of a specific type
   */
  const clearErrorsByType = (type: 'warning' | 'error' | 'info') => {
    errors.value = errors.value.filter((error) => error.type !== type);
  };

  /**
   * Try-catch wrapper with error handling
   */
  const tryAsync = async <T>(
    asyncFn: () => Promise<T>,
    errorMessage?: string,
    onError?: (error: Error) => void
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      const message =
        errorMessage ||
        `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`;
      addError(message, 'error', error);
      onError?.(error instanceof Error ? error : new Error(String(error)));
      return null;
    }
  };

  /**
   * Synchronous try-catch wrapper
   */
  const trySync = <T>(
    syncFn: () => T,
    errorMessage?: string,
    onError?: (error: Error) => void
  ): T | null => {
    try {
      return syncFn();
    } catch (error) {
      const message =
        errorMessage ||
        `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`;
      addError(message, 'error', error);
      onError?.(error instanceof Error ? error : new Error(String(error)));
      return null;
    }
  };

  /**
   * Validate menu data structure
   */
  const validateMenuData = (data: MenuItem[]): boolean => {
    if (!Array.isArray(data)) {
      addError('Menu data must be an array', 'error');
      return false;
    }

    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      if (!item || typeof item !== 'object') {
        addError(`Menu item at index ${i} must be an object`, 'error');
        return false;
      }

      if (!item.name && !item.divider) {
        addError(`Menu item at index ${i} must have a name or be a divider`, 'error');
        return false;
      }

      if (item.subMenu && !Array.isArray(item.subMenu.items)) {
        addError(`Submenu items at index ${i} must be an array`, 'error');
        return false;
      }

      // Recursively validate submenu items
      if (item.subMenu?.items) {
        const isValid = validateMenuData(item.subMenu.items);
        if (!isValid) {
          return false;
        }
      }
    }

    return true;
  };

  /**
   * Validate theme object
   */
  const validateTheme = (theme: Theme): boolean => {
    if (!theme || typeof theme !== 'object') {
      addError('Theme must be an object', 'error');
      return false;
    }

    const requiredProps = [
      'primary',
      'menuBgColor',
      'textColor',
      'textSelectedColor',
      'hoverBackground',
    ];

    for (const prop of requiredProps) {
      if (!(prop in theme)) {
        addError(`Theme is missing required property: ${prop}`, 'warning');
      }
    }

    return true;
  };

  /**
   * Handle DOM errors gracefully
   */
  const handleDOMError = (error: Error, element?: HTMLElement) => {
    addError(`DOM operation failed: ${error.message}`, 'error', {
      error,
      element: element?.tagName,
    });
  };

  /**
   * Handle keyboard event errors
   */
  const handleKeyboardError = (error: Error, keyCode?: string) => {
    addError(`Keyboard navigation error: ${error.message}`, 'error', { error, keyCode });
  };

  /**
   * Handle animation errors
   */
  const handleAnimationError = (error: Error, animationType?: string) => {
    addError(`Animation error: ${error.message}`, 'warning', { error, animationType });
  };

  /**
   * Get user-friendly error message
   */
  const getUserFriendlyMessage = (error: ErrorInfo): string => {
    const friendlyMessages: Record<string, string> = {
      'Menu data must be an array': 'Invalid menu configuration. Please check your menu data.',
      'DOM operation failed': 'Interface error occurred. Please try again.',
      'Keyboard navigation error': 'Navigation issue detected. Please use mouse or try again.',
      'Animation error': 'Display issue occurred. Functionality is not affected.',
    };

    for (const [pattern, message] of Object.entries(friendlyMessages)) {
      if (error.message.includes(pattern)) {
        return message;
      }
    }

    return 'An unexpected error occurred. Please try again.';
  };

  // Computed properties
  const hasErrors = computed(() => errors.value.length > 0);
  const errorCount = computed(() => errors.value.length);
  const latestError = computed(() => errors.value[0] || null);
  const errorsByType = computed(() => {
    return {
      errors: errors.value.filter((e) => e.type === 'error'),
      warnings: errors.value.filter((e) => e.type === 'warning'),
      info: errors.value.filter((e) => e.type === 'info'),
    };
  });

  return {
    errors: computed(() => errors.value),
    hasErrors,
    errorCount,
    latestError,
    errorsByType,
    addError,
    removeError,
    clearErrors,
    clearErrorsByType,
    tryAsync,
    trySync,
    validateMenuData,
    validateTheme,
    handleDOMError,
    handleKeyboardError,
    handleAnimationError,
    getUserFriendlyMessage,
  };
}
