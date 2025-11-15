import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue';
import type { Position } from '../../types';

interface DragOptions {
  element: Ref<HTMLElement | null>;
  dimension: number;
  initialPosition?: Position | null;
  onDragStart?: () => void;
  onDragMove?: (position: Position) => void;
  onDragEnd?: (position: Position) => void;
  dragThreshold?: number; // Minimum pixels moved to trigger drag
  enableMomentum?: boolean; // Enable momentum scrolling
  constrainToViewport?: boolean; // Keep element within viewport
}

interface Velocity {
  x: number;
  y: number;
}

export function useDrag(options: DragOptions) {
  const {
    element,
    dimension,
    initialPosition = null,
    onDragStart,
    onDragMove,
    onDragEnd,
    dragThreshold = 5, // 5px threshold to distinguish click from drag
    enableMomentum = true,
    constrainToViewport = true,
  } = options;

  // State
  const isDragging = ref(false);
  const dragStarted = ref(false);
  const position = ref<Position | null>(initialPosition);
  const startPosition = ref<Position>({ left: 0, top: 0 });
  const currentPointer = ref<Position>({ left: 0, top: 0 });
  const velocity = ref<Velocity>({ x: 0, y: 0 });
  const lastMoveTime = ref(0);
  const lastPosition = ref<Position>({ left: 0, top: 0 });
  const animationFrameId = ref<number | null>(null);

  // Get viewport boundaries
  const getViewportBounds = () => {
    return {
      minX: 0,
      minY: 0,
      maxX: window.innerWidth - dimension,
      maxY: window.innerHeight - dimension,
    };
  };

  // Constrain position to viewport
  const constrainPosition = (pos: Position): Position => {
    if (!constrainToViewport) return pos;

    const bounds = getViewportBounds();
    return {
      left: Math.max(bounds.minX, Math.min(bounds.maxX, pos.left)),
      top: Math.max(bounds.minY, Math.min(bounds.maxY, pos.top)),
    };
  };

  // Calculate velocity for momentum
  const calculateVelocity = (
    currentPos: Position,
    lastPos: Position,
    deltaTime: number
  ): Velocity => {
    if (deltaTime === 0) return { x: 0, y: 0 };

    return {
      x: (currentPos.left - lastPos.left) / deltaTime,
      y: (currentPos.top - lastPos.top) / deltaTime,
    };
  };

  // Apply momentum animation
  const applyMomentum = () => {
    if (!enableMomentum || !position.value) return;

    const friction = 0.95; // Friction coefficient
    const minVelocity = 0.1; // Minimum velocity threshold

    const step = () => {
      if (!position.value) return;

      // Apply friction
      velocity.value.x *= friction;
      velocity.value.y *= friction;

      // Stop if velocity is too low
      if (Math.abs(velocity.value.x) < minVelocity && Math.abs(velocity.value.y) < minVelocity) {
        velocity.value = { x: 0, y: 0 };
        if (animationFrameId.value) {
          cancelAnimationFrame(animationFrameId.value);
          animationFrameId.value = null;
        }
        return;
      }

      // Update position
      const newPos = constrainPosition({
        left: position.value.left + velocity.value.x * 16, // ~60fps
        top: position.value.top + velocity.value.y * 16,
      });

      position.value = newPos;
      onDragMove?.(newPos);

      animationFrameId.value = requestAnimationFrame(step);
    };

    if (animationFrameId.value) {
      cancelAnimationFrame(animationFrameId.value);
    }
    animationFrameId.value = requestAnimationFrame(step);
  };

  // Get pointer position from event
  const getPointerPosition = (event: MouseEvent | TouchEvent): Position => {
    if ('touches' in event && event.touches.length > 0) {
      return {
        left: event.touches[0].clientX,
        top: event.touches[0].clientY,
      };
    } else if ('changedTouches' in event && event.changedTouches.length > 0) {
      return {
        left: event.changedTouches[0].clientX,
        top: event.changedTouches[0].clientY,
      };
    } else {
      return {
        left: (event as MouseEvent).clientX,
        top: (event as MouseEvent).clientY,
      };
    }
  };

  // Handle drag start
  const handlePointerDown = (event: MouseEvent | TouchEvent) => {
    if (!element.value) return;

    // Prevent default only for mouse events (not touch to allow scrolling)
    if (event.type === 'mousedown') {
      event.preventDefault();
    }

    dragStarted.value = true;
    const pointerPos = getPointerPosition(event);
    currentPointer.value = pointerPos;
    startPosition.value = pointerPos;
    lastPosition.value = position.value || {
      left: pointerPos.left - dimension / 2,
      top: pointerPos.top - dimension / 2,
    };
    lastMoveTime.value = Date.now();

    // Cancel any ongoing momentum
    if (animationFrameId.value) {
      cancelAnimationFrame(animationFrameId.value);
      animationFrameId.value = null;
    }
  };

  // Handle drag move
  const handlePointerMove = (event: MouseEvent | TouchEvent) => {
    if (!dragStarted.value || !element.value) return;

    const pointerPos = getPointerPosition(event);
    currentPointer.value = pointerPos;

    // Check if we've exceeded the drag threshold
    const deltaX = Math.abs(pointerPos.left - startPosition.value.left);
    const deltaY = Math.abs(pointerPos.top - startPosition.value.top);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (!isDragging.value && distance < dragThreshold) {
      return; // Not dragging yet
    }

    if (!isDragging.value) {
      // First drag movement - trigger onDragStart
      isDragging.value = true;
      onDragStart?.();
    }

    // Prevent default for all events once dragging
    event.preventDefault();

    // Calculate new position
    const newPos = constrainPosition({
      left: pointerPos.left - dimension / 2,
      top: pointerPos.top - dimension / 2,
    });

    // Calculate velocity
    const currentTime = Date.now();
    const deltaTime = currentTime - lastMoveTime.value;

    if (deltaTime > 0) {
      velocity.value = calculateVelocity(newPos, lastPosition.value, deltaTime);
      lastPosition.value = newPos;
      lastMoveTime.value = currentTime;
    }

    // Update position
    position.value = newPos;
    onDragMove?.(newPos);
  };

  // Handle drag end
  const handlePointerUp = (event: MouseEvent | TouchEvent) => {
    if (!dragStarted.value) return;

    const wasDragging = isDragging.value;

    if (wasDragging) {
      const pointerPos = getPointerPosition(event);
      const finalPos = constrainPosition({
        left: pointerPos.left - dimension / 2,
        top: pointerPos.top - dimension / 2,
      });

      position.value = finalPos;
      onDragEnd?.(finalPos);

      // Apply momentum if enabled
      if (
        enableMomentum &&
        (Math.abs(velocity.value.x) > 0.5 || Math.abs(velocity.value.y) > 0.5)
      ) {
        applyMomentum();
      }
    }

    // Reset drag state
    dragStarted.value = false;
    isDragging.value = false;
    velocity.value = { x: 0, y: 0 };
  };

  // Add global event listeners
  onMounted(() => {
    if (!element.value) return;

    // Mouse events
    document.addEventListener('mousemove', handlePointerMove, { passive: false });
    document.addEventListener('mouseup', handlePointerUp);

    // Touch events
    document.addEventListener('touchmove', handlePointerMove, { passive: false });
    document.addEventListener('touchend', handlePointerUp);
    document.addEventListener('touchcancel', handlePointerUp);
  });

  // Clean up
  onUnmounted(() => {
    document.removeEventListener('mousemove', handlePointerMove);
    document.removeEventListener('mouseup', handlePointerUp);
    document.removeEventListener('touchmove', handlePointerMove);
    document.removeEventListener('touchend', handlePointerUp);
    document.removeEventListener('touchcancel', handlePointerUp);

    if (animationFrameId.value) {
      cancelAnimationFrame(animationFrameId.value);
    }
  });

  // Computed properties
  const dragStyle = computed(() => {
    if (!position.value) return {};

    return {
      left: `${position.value.left}px`,
      top: `${position.value.top}px`,
    };
  });

  return {
    position,
    isDragging,
    dragStyle,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
