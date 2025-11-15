import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import utils from '../index';

describe('utils', () => {
  describe('setupMenuOrientation', () => {
    let headElement: HTMLElement;
    let contentElement: HTMLElement;

    beforeEach(() => {
      headElement = document.createElement('div');
      contentElement = document.createElement('div');
      document.body.appendChild(headElement);
      document.body.appendChild(contentElement);

      // Mock window size
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 1000,
      });
    });

    afterEach(() => {
      document.body.removeChild(headElement);
      document.body.removeChild(contentElement);
    });

    it('should position menu at bottom when not enough space on top', () => {
      // Mock getBoundingClientRect for head element near top of screen
      vi.spyOn(headElement, 'getBoundingClientRect').mockReturnValue({
        top: 50,
        bottom: 100,
        left: 0,
        right: 0,
        width: 50,
        height: 50,
        x: 0,
        y: 50,
        toJSON: () => ({}),
      });

      // Mock content with large height
      Object.defineProperty(contentElement, 'clientWidth', { value: 200, writable: true });
      Object.defineProperty(contentElement, 'clientHeight', { value: 400, writable: true });

      const result = utils.setupMenuOrientation(
        headElement,
        contentElement,
        50,
        { width: 200, height: 300 }
      );

      expect(result.newOrientation).toBe('top');
      expect(result.top).toBe('65px'); // 50 (dimension) + 15 (spacing)
    });

    it('should position menu at top when not enough space on bottom', () => {
      // Mock getBoundingClientRect for head element near bottom
      vi.spyOn(headElement, 'getBoundingClientRect').mockReturnValue({
        top: 900,
        bottom: 950,
        left: 0,
        right: 0,
        width: 50,
        height: 50,
        x: 0,
        y: 900,
        toJSON: () => ({}),
      });

      Object.defineProperty(contentElement, 'clientWidth', { value: 200, writable: true });
      Object.defineProperty(contentElement, 'clientHeight', { value: 400, writable: true });

      const result = utils.setupMenuOrientation(
        headElement,
        contentElement,
        50,
        { width: 200, height: 300 }
      );

      expect(result.newOrientation).toBe('bottom');
      expect(result.bottom).toBe('65px'); // 50 + 15
    });

    it('should position menu at top when enough space available', () => {
      // Mock element in middle of screen with space above
      vi.spyOn(headElement, 'getBoundingClientRect').mockReturnValue({
        top: 500,
        bottom: 550,
        left: 0,
        right: 0,
        width: 50,
        height: 50,
        x: 0,
        y: 500,
        toJSON: () => ({}),
      });

      Object.defineProperty(contentElement, 'clientWidth', { value: 200, writable: true });
      Object.defineProperty(contentElement, 'clientHeight', { value: 200, writable: true });

      const result = utils.setupMenuOrientation(
        headElement,
        contentElement,
        50,
        { width: 200, height: 300 }
      );

      expect(result.newOrientation).toBe('top');
      expect(result.top).toBe('65px');
    });

    it('should include menu dimensions in result', () => {
      vi.spyOn(headElement, 'getBoundingClientRect').mockReturnValue({
        top: 100,
        bottom: 150,
        left: 0,
        right: 0,
        width: 50,
        height: 50,
        x: 0,
        y: 100,
        toJSON: () => ({}),
      });

      Object.defineProperty(contentElement, 'clientWidth', { value: 250, writable: true });
      Object.defineProperty(contentElement, 'clientHeight', { value: 350, writable: true });

      const result = utils.setupMenuOrientation(
        headElement,
        contentElement,
        50,
        { width: 250, height: 350 }
      );

      expect(result['min-height']).toBe('350px');
      expect(result.width).toBe('250px');
    });

    it('should center menu horizontally relative to head button', () => {
      vi.spyOn(headElement, 'getBoundingClientRect').mockReturnValue({
        top: 200,
        bottom: 250,
        left: 0,
        right: 0,
        width: 50,
        height: 50,
        x: 0,
        y: 200,
        toJSON: () => ({}),
      });

      Object.defineProperty(contentElement, 'clientWidth', { value: 200, writable: true });
      Object.defineProperty(contentElement, 'clientHeight', { value: 300, writable: true });

      const result = utils.setupMenuOrientation(
        headElement,
        contentElement,
        50,
        { width: 200, height: 300 }
      );

      // left should be -((200 - 50) / 2) = -75
      expect(result.left).toBe('-75px');
    });
  });

  describe('setupMenuPosition', () => {
    let element: HTMLElement;
    let menuContainer: HTMLElement;

    beforeEach(() => {
      element = document.createElement('div');
      menuContainer = document.createElement('div');
      document.body.appendChild(element);
      document.body.appendChild(menuContainer);

      // Mock window size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1200,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 1000,
      });
    });

    afterEach(() => {
      document.body.removeChild(element);
      document.body.removeChild(menuContainer);
    });

    it('should not reposition when element is within viewport', () => {
      vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        top: 100,
        bottom: 150,
        left: 100,
        right: 150,
        width: 50,
        height: 50,
        x: 100,
        y: 100,
        toJSON: () => ({}),
      });

      Object.defineProperty(menuContainer, 'clientWidth', { value: 200, writable: true });

      const result = utils.setupMenuPosition(
        element,
        { left: 100, top: 100 },
        false,
        menuContainer
      );

      expect(result.position).toBeNull();
      expect(result.flip).toBe(false);
      expect(result.reveal).toBe(false);
    });

    it('should reposition when element goes below bottom', () => {
      vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        top: 950,
        bottom: 1050,
        left: 100,
        right: 150,
        width: 50,
        height: 100,
        x: 100,
        y: 950,
        toJSON: () => ({}),
      });

      Object.defineProperty(menuContainer, 'clientWidth', { value: 200, writable: true });

      const result = utils.setupMenuPosition(
        element,
        { left: 100, top: 950 },
        false,
        menuContainer
      );

      expect(result.position).not.toBeNull();
      expect(result.position?.top).toBe(900); // 950 - (1050 - 1000)
      expect(result.reveal).toBe(true);
    });

    it('should reposition when element goes above top', () => {
      vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        top: -50,
        bottom: 0,
        left: 100,
        right: 150,
        width: 50,
        height: 50,
        x: 100,
        y: -50,
        toJSON: () => ({}),
      });

      Object.defineProperty(menuContainer, 'clientWidth', { value: 200, writable: true });

      const result = utils.setupMenuPosition(
        element,
        { left: 100, top: -50 },
        false,
        menuContainer
      );

      expect(result.position).not.toBeNull();
      expect(result.position?.top).toBe(0); // -50 + 50
      expect(result.reveal).toBe(true);
    });

    it('should reposition when element goes beyond left edge', () => {
      vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        top: 100,
        bottom: 150,
        left: -10,
        right: 40,
        width: 50,
        height: 50,
        x: -10,
        y: 100,
        toJSON: () => ({}),
      });

      Object.defineProperty(menuContainer, 'clientWidth', { value: 200, writable: true });

      const result = utils.setupMenuPosition(
        element,
        { left: -10, top: 100 },
        false,
        menuContainer
      );

      expect(result.position).not.toBeNull();
      expect(result.position?.left).toBe(100); // menuContHalfWidth (200/2)
      expect(result.reveal).toBe(true);
    });

    it('should reposition when element goes beyond right edge', () => {
      vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        top: 100,
        bottom: 150,
        left: 1150,
        right: 1250,
        width: 100,
        height: 50,
        x: 1150,
        y: 100,
        toJSON: () => ({}),
      });

      Object.defineProperty(menuContainer, 'clientWidth', { value: 200, writable: true });

      const result = utils.setupMenuPosition(
        element,
        { left: 1150, top: 100 },
        false,
        menuContainer
      );

      expect(result.position).not.toBeNull();
      expect(result.position?.left).toBe(1000); // 1200 - 200
      expect(result.reveal).toBe(true);
    });

    it('should set flip flag when going beyond right edge with flipOnEdges enabled', () => {
      vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        top: 100,
        bottom: 150,
        left: 1150,
        right: 1250,
        width: 100,
        height: 50,
        x: 1150,
        y: 100,
        toJSON: () => ({}),
      });

      Object.defineProperty(menuContainer, 'clientWidth', { value: 200, writable: true });

      const result = utils.setupMenuPosition(
        element,
        { left: 1150, top: 100 },
        true, // flipOnEdges enabled
        menuContainer
      );

      expect(result.flip).toBe(true);
      expect(result.reveal).toBe(true);
    });

    it('should not flip when flipOnEdges is disabled', () => {
      vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        top: 100,
        bottom: 150,
        left: 1150,
        right: 1250,
        width: 100,
        height: 50,
        x: 1150,
        y: 100,
        toJSON: () => ({}),
      });

      Object.defineProperty(menuContainer, 'clientWidth', { value: 200, writable: true });

      const result = utils.setupMenuPosition(
        element,
        { left: 1150, top: 100 },
        false, // flipOnEdges disabled
        menuContainer
      );

      expect(result.flip).toBe(false);
    });
  });

  describe('setupInitStyle', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1200,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 1000,
      });
    });

    it('should position at top left', () => {
      const style = utils.setupInitStyle('top left', 50);

      expect(style.left).toBe('15px');
      expect(style.top).toBe('15px');
      expect(style.width).toBe('50px');
      expect(style.height).toBe('50px');
    });

    it('should position at top right', () => {
      const style = utils.setupInitStyle('top right', 50);

      expect(style.left).toBe('1135px'); // 1200 - 50 - 15
      expect(style.top).toBe('15px');
      expect(style.width).toBe('50px');
      expect(style.height).toBe('50px');
    });

    it('should position at bottom left', () => {
      const style = utils.setupInitStyle('bottom left', 50);

      expect(style.left).toBe('15px');
      expect(style.top).toBe('935px'); // 1000 - 50 - 15
      expect(style.width).toBe('50px');
      expect(style.height).toBe('50px');
    });

    it('should position at bottom right', () => {
      const style = utils.setupInitStyle('bottom right', 50);

      expect(style.left).toBe('1135px'); // 1200 - 50 - 15
      expect(style.top).toBe('935px'); // 1000 - 50 - 15
      expect(style.width).toBe('50px');
      expect(style.height).toBe('50px');
    });

    it('should handle different button dimensions', () => {
      const style = utils.setupInitStyle('top left', 80);

      expect(style.width).toBe('80px');
      expect(style.height).toBe('80px');
    });

    it('should default to top left for unknown position', () => {
      const style = utils.setupInitStyle('unknown position' as any, 50);

      expect(style.left).toBe('15px');
      expect(style.top).toBe('15px');
    });

    it('should maintain consistent spacing', () => {
      const SPACING = 15;

      const topLeft = utils.setupInitStyle('top left', 50);
      expect(parseInt(topLeft.left)).toBe(SPACING);
      expect(parseInt(topLeft.top)).toBe(SPACING);

      const topRight = utils.setupInitStyle('top right', 50);
      expect(parseInt(topRight.left)).toBe(window.innerWidth - 50 - SPACING);
      expect(parseInt(topRight.top)).toBe(SPACING);

      const bottomLeft = utils.setupInitStyle('bottom left', 50);
      expect(parseInt(bottomLeft.left)).toBe(SPACING);
      expect(parseInt(bottomLeft.top)).toBe(window.innerHeight - 50 - SPACING);

      const bottomRight = utils.setupInitStyle('bottom right', 50);
      expect(parseInt(bottomRight.left)).toBe(window.innerWidth - 50 - SPACING);
      expect(parseInt(bottomRight.top)).toBe(window.innerHeight - 50 - SPACING);
    });
  });

  describe('detectDeviceType', () => {
    it('should detect mobile device when width <= 768', () => {
      Object.defineProperty(window.screen, 'width', {
        writable: true,
        value: 375,
      });

      const deviceType = utils.detectDeviceType();
      expect(deviceType).toBe('mobile');
    });

    it('should detect mobile device at exactly 768px', () => {
      Object.defineProperty(window.screen, 'width', {
        writable: true,
        value: 768,
      });

      const deviceType = utils.detectDeviceType();
      expect(deviceType).toBe('mobile');
    });

    it('should detect desktop device when width > 768', () => {
      Object.defineProperty(window.screen, 'width', {
        writable: true,
        value: 1920,
      });

      const deviceType = utils.detectDeviceType();
      expect(deviceType).toBe('desktop');
    });

    it('should detect desktop device at 769px', () => {
      Object.defineProperty(window.screen, 'width', {
        writable: true,
        value: 769,
      });

      const deviceType = utils.detectDeviceType();
      expect(deviceType).toBe('desktop');
    });

    it('should handle tablet sizes correctly', () => {
      // iPad width
      Object.defineProperty(window.screen, 'width', {
        writable: true,
        value: 1024,
      });

      const deviceType = utils.detectDeviceType();
      expect(deviceType).toBe('desktop');
    });
  });

  describe('integration tests', () => {
    it('should work together for complete menu setup', () => {
      const headElement = document.createElement('div');
      const contentElement = document.createElement('div');
      const menuContainer = document.createElement('div');

      document.body.appendChild(headElement);
      document.body.appendChild(contentElement);
      document.body.appendChild(menuContainer);

      Object.defineProperty(window, 'innerWidth', { writable: true, value: 1200 });
      Object.defineProperty(window, 'innerHeight', { writable: true, value: 1000 });

      // Step 1: Setup initial position
      const initStyle = utils.setupInitStyle('top right', 50);
      expect(initStyle.left).toBe('1135px');
      expect(initStyle.top).toBe('15px');

      // Step 2: Detect device type
      Object.defineProperty(window.screen, 'width', { writable: true, value: 1200 });
      const deviceType = utils.detectDeviceType();
      expect(deviceType).toBe('desktop');

      // Step 3: Setup menu orientation
      vi.spyOn(headElement, 'getBoundingClientRect').mockReturnValue({
        top: 15,
        bottom: 65,
        left: 1135,
        right: 1185,
        width: 50,
        height: 50,
        x: 1135,
        y: 15,
        toJSON: () => ({}),
      });

      Object.defineProperty(contentElement, 'clientWidth', { value: 200, writable: true });
      Object.defineProperty(contentElement, 'clientHeight', { value: 300, writable: true });

      const orientation = utils.setupMenuOrientation(
        headElement,
        contentElement,
        50,
        { width: 200, height: 300 }
      );

      expect(orientation.newOrientation).toBe('top');

      // Step 4: Setup menu position (edge detection)
      Object.defineProperty(menuContainer, 'clientWidth', { value: 200, writable: true });

      const position = utils.setupMenuPosition(
        headElement,
        { left: parseInt(initStyle.left), top: parseInt(initStyle.top) },
        true,
        menuContainer
      );

      // At top right, should trigger flip on edges
      expect(position.flip).toBe(true);

      document.body.removeChild(headElement);
      document.body.removeChild(contentElement);
      document.body.removeChild(menuContainer);
    });
  });
});
