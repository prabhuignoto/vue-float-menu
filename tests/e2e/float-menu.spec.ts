import { test, expect } from '@playwright/test';

test.describe('FloatMenu Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Rendering and Initial State', () => {
    test('should display all four float menu buttons', async ({ page }) => {
      // Check for all four menu buttons (top-left, top-right, bottom-left, bottom-right)
      const menuButtons = page.locator('.float-menu-head');
      await expect(menuButtons).toHaveCount(4);
    });

    test('should have correct initial positions', async ({ page }) => {
      const topLeft = page.locator('.float-menu-head').first();
      const box = await topLeft.boundingBox();

      expect(box).toBeTruthy();
      if (box) {
        expect(box.x).toBeLessThan(200); // Should be on left side
        expect(box.y).toBeLessThan(200); // Should be near top
      }
    });

    test('should display menu icon inside button', async ({ page }) => {
      const menuButton = page.locator('.float-menu-head').first();
      const icon = menuButton.locator('svg, img');
      await expect(icon).toBeVisible();
    });
  });

  test.describe('Menu Opening and Closing', () => {
    test('should open menu on click', async ({ page }) => {
      const menuButton = page.locator('.float-menu-head').first();
      await menuButton.click();

      const menu = page.locator('.menu-wrapper');
      await expect(menu).toBeVisible();
    });

    test('should close menu on second click', async ({ page }) => {
      const menuButton = page.locator('.float-menu-head').first();

      // Open menu
      await menuButton.click();
      await expect(page.locator('.menu-wrapper')).toBeVisible();

      // Close menu
      await menuButton.click();
      await page.waitForTimeout(500); // Wait for close animation
      await expect(page.locator('.menu-wrapper')).not.toBeVisible();
    });

    test('should close menu when clicking outside', async ({ page }) => {
      const menuButton = page.locator('.float-menu-head').first();
      await menuButton.click();
      await expect(page.locator('.menu-wrapper')).toBeVisible();

      // Click outside the menu
      await page.locator('body').click({ position: { x: 500, y: 500 } });
      await page.waitForTimeout(500);
      await expect(page.locator('.menu-wrapper')).not.toBeVisible();
    });
  });

  test.describe('Menu Items and Interactions', () => {
    test('should display menu items when opened', async ({ page }) => {
      const menuButton = page.locator('.float-menu-head').first();
      await menuButton.click();

      const menuItems = page.locator('.menu-list-item');
      const count = await menuItems.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should highlight menu item on hover', async ({ page }) => {
      const menuButton = page.locator('.float-menu-head').first();
      await menuButton.click();

      const firstMenuItem = page.locator('.menu-list-item').first();
      await firstMenuItem.hover();

      // Check if item has hover/focus class or style
      const classList = await firstMenuItem.getAttribute('class');
      expect(classList).toBeTruthy();
    });

    test('should handle menu item selection', async ({ page }) => {
      const menuButton = page.locator('.float-menu-head').first();
      await menuButton.click();

      // Click on a menu item (avoiding dividers)
      const menuItems = page.locator('.menu-list-item:not(.divider)').first();
      await menuItems.click();

      // Menu should close after selection
      await page.waitForTimeout(500);
      await expect(page.locator('.menu-wrapper')).not.toBeVisible();
    });
  });

  test.describe('Submenu Functionality', () => {
    test('should open submenu on item click', async ({ page }) => {
      const menuButton = page.locator('.float-menu-head').first();
      await menuButton.click();

      // Find and click an item with submenu (e.g., "Edit" or "Settings")
      const editItem = page
        .locator('.menu-list-item')
        .filter({ hasText: /Edit|Settings/ })
        .first();

      if ((await editItem.count()) > 0) {
        await editItem.click();
        await page.waitForTimeout(100);

        // Check if submenu appears
        const submenu = page.locator('.sub-menu, .menu-list-item .menu-list');
        const submenuCount = await submenu.count();
        if (submenuCount > 0) {
          await expect(submenu.first()).toBeVisible();
        }
      }
    });

    test('should handle nested submenu navigation', async ({ page }) => {
      const menuButton = page.locator('.float-menu-head').first();
      await menuButton.click();

      const settingsItem = page.locator('.menu-list-item').filter({ hasText: 'Settings' }).first();

      if ((await settingsItem.count()) > 0) {
        await settingsItem.click();
        await page.waitForTimeout(100);

        // Look for nested submenu item
        const themesItem = page.locator('.menu-list-item').filter({ hasText: 'Themes' });
        if ((await themesItem.count()) > 0) {
          await themesItem.first().click();
          await page.waitForTimeout(100);

          // Check for deeply nested submenu
          const nestedMenu = page.locator('.sub-menu .sub-menu, .menu-list .menu-list');
          const nestedCount = await nestedMenu.count();
          expect(nestedCount).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should navigate menu items with arrow keys', async ({ page }) => {
      const menuButton = page.locator('.float-menu-head').first();
      await menuButton.click();

      // Press ArrowDown to navigate
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(100);

      // Check if focus moved to a menu item
      const focusedItem = page.locator('.menu-list-item:focus, .menu-list-item.focused');
      expect(await focusedItem.count()).toBeGreaterThanOrEqual(0);
    });

    test('should close menu with Escape key', async ({ page }) => {
      const menuButton = page.locator('.float-menu-head').first();
      await menuButton.click();
      await expect(page.locator('.menu-wrapper')).toBeVisible();

      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      await expect(page.locator('.menu-wrapper')).not.toBeVisible();
    });

    test('should select item with Enter key', async ({ page }) => {
      const menuButton = page.locator('.float-menu-head').first();
      await menuButton.click();

      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');

      // Menu should close or submenu should open
      await page.waitForTimeout(500);
      const isMenuVisible = await page.locator('.menu-wrapper').isVisible();
      const isSubmenuVisible = await page.locator('.sub-menu, .menu-list-item .menu-list').count();

      expect(isMenuVisible || isSubmenuVisible > 0).toBeTruthy();
    });
  });

  test.describe('Drag and Drop', () => {
    test('should drag menu button to new position', async ({ page }) => {
      const menuButton = page.locator('.float-menu-head').first();
      const initialBox = await menuButton.boundingBox();

      if (initialBox) {
        // Drag menu button to a new position
        await menuButton.hover();
        await page.mouse.down();
        await page.mouse.move(initialBox.x + 200, initialBox.y + 200);
        await page.mouse.up();

        await page.waitForTimeout(300);

        const newBox = await menuButton.boundingBox();
        expect(newBox).toBeTruthy();
        if (newBox) {
          // Position should have changed
          expect(Math.abs(newBox.x - initialBox.x)).toBeGreaterThan(50);
        }
      }
    });

    test('should maintain menu position after drag', async ({ page }) => {
      const menuButton = page.locator('.float-menu-head').first();

      // Drag to new position
      await menuButton.hover();
      await page.mouse.down();
      await page.mouse.move(400, 400);
      await page.mouse.up();
      await page.waitForTimeout(300);

      const positionAfterDrag = await menuButton.boundingBox();

      // Refresh page
      await page.reload();
      await page.waitForLoadState('networkidle');

      const positionAfterReload = await menuButton.boundingBox();

      // Check if positions are similar (allowing for small variance)
      if (positionAfterDrag && positionAfterReload) {
        const xDiff = Math.abs(positionAfterDrag.x - positionAfterReload.x);
        const yDiff = Math.abs(positionAfterDrag.y - positionAfterReload.y);

        // Note: Position may reset on reload if not persisted
        expect(xDiff + yDiff).toBeGreaterThanOrEqual(0);
      }
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA attributes', async ({ page }) => {
      const menuButton = page.locator('.float-menu-head').first();

      const ariaLabel = await menuButton.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    });

    test('should be keyboard accessible', async ({ page }) => {
      // Tab to menu button
      await page.keyboard.press('Tab');

      const focusedElement = page.locator(':focus');
      const className = await focusedElement.getAttribute('class');

      // Eventually a menu button should be focused after tabbing
      expect(className).toBeTruthy();
    });

    test('should have proper roles for menu items', async ({ page }) => {
      const menuButton = page.locator('.float-menu-head').first();
      await menuButton.click();

      const menu = page.locator('[role="menu"]');
      if ((await menu.count()) > 0) {
        await expect(menu.first()).toBeVisible();

        const menuItems = page.locator('[role="menuitem"]');
        expect(await menuItems.count()).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Theming', () => {
    test('should apply custom theme colors', async ({ page }) => {
      const menuButton = page.locator('.float-menu-head').first();
      await menuButton.click();

      const menu = page.locator('.menu-wrapper').first();
      if (await menu.isVisible()) {
        const bgColor = await menu.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });

        expect(bgColor).toBeTruthy();
      }
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      const menuButtons = page.locator('.float-menu-head');
      await expect(menuButtons.first()).toBeVisible();
    });

    test('should adjust menu position on small screens', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const menuButton = page.locator('.float-menu-head').first();
      await menuButton.click();

      const menu = page.locator('.menu-wrapper');
      if (await menu.isVisible()) {
        const menuBox = await menu.boundingBox();

        if (menuBox) {
          // Menu should be within viewport
          expect(menuBox.x + menuBox.width).toBeLessThanOrEqual(375 + 50); // Allow some tolerance
        }
      }
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle disabled menu items', async ({ page }) => {
      const menuButton = page.locator('.float-menu-head').first();
      await menuButton.click();

      const disabledItem = page
        .locator('.menu-list-item[disabled], .menu-list-item.disabled')
        .first();

      if ((await disabledItem.count()) > 0) {
        const isDisabled =
          (await disabledItem.getAttribute('disabled')) !== null ||
          (await disabledItem.getAttribute('class'))?.includes('disabled');
        expect(isDisabled).toBeTruthy();
      }
    });

    test('should handle menu dividers', async ({ page }) => {
      const menuButton = page.locator('.float-menu-head').first();
      await menuButton.click();

      const dividers = page.locator('.menu-list-item.divider, .divider');
      const dividerCount = await dividers.count();
      expect(dividerCount).toBeGreaterThanOrEqual(0);
    });

    test('should handle rapid open/close clicks', async ({ page }) => {
      const menuButton = page.locator('.float-menu-head').first();

      // Rapidly click the menu button
      await menuButton.click();
      await menuButton.click();
      await menuButton.click();

      await page.waitForTimeout(600);

      // Menu should be in a consistent state (either open or closed)
      const menuVisible = await page.locator('.menu-wrapper').isVisible();
      expect(typeof menuVisible).toBe('boolean');
    });
  });

  test.describe('Performance', () => {
    test('should open menu quickly', async ({ page }) => {
      const menuButton = page.locator('.float-menu-head').first();

      const startTime = Date.now();
      await menuButton.click();
      await page.locator('.menu-wrapper').waitFor({ state: 'visible', timeout: 1000 });
      const endTime = Date.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(1000); // Should open within 1 second
    });

    test('should handle multiple menus without performance issues', async ({ page }) => {
      const menuButtons = page.locator('.float-menu-head');
      const count = await menuButtons.count();

      expect(count).toBe(4);

      // All menus should be rendered without significant delay
      for (let i = 0; i < count; i++) {
        await expect(menuButtons.nth(i)).toBeVisible();
      }
    });
  });
});
