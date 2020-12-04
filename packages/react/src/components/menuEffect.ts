import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from "react";

export interface Position {
  left: number;
  top: number;
  flip?: 'top' | 'left' | 'none';
}

type Ref = MutableRefObject<HTMLSpanElement | null>;
type returnType = [data: Position, open: boolean, setOpen: (s: boolean) => void];

export default function usePosition(headRef: Ref, menuRef: Ref, mainRef: Ref): returnType {
  const [data, setData] = useState<Position>({ left: 0, top: 0, flip: 'none' });
  const [open, setOpen] = useState(false);
  const marginGap = 20;

  const isDragged = useRef(false);
  const isDragStart = useRef(false);
  const isOpen = useRef(false);

  const isTouch = window.ontouchstart !== undefined;

  const dragStartEvent = isTouch ? 'touchstart' : 'mousedown';
  const dragEvent = isTouch ? "touchmove" : "mousemove";
  const dragEndEvent = isTouch ? 'touchend' : 'mouseup';

  useEffect(() => {
    isOpen.current = open;
  }, [open])

  useLayoutEffect(() => {
    const head = headRef.current;
    const menu = menuRef.current;
    const main = mainRef.current;

    const mouseUpHandler = function (event: MouseEvent | TouchEvent) {
      if (!head || !menu || !main) {
        return;
      }

      if (isDragged.current) {
        // cancel out if this was part of a drag motion.
        isDragStart.current = false;
        return;
      } else if (isDragStart.current) {
        // this handles the menu toggling operation.
        // isOpen.current = !isOpen.current;
        setOpen(!isOpen.current);
      } else {

        const class2Check = ['item', 'txt', 'icon', 'nested'].map(t => `react-dock-menu-${t}`);
        const classList = Array.from((event.target as HTMLElement).classList);

        if (!class2Check.some(cls => classList.indexOf(cls) > -1)) {
          // isOpen.current = false;
          setOpen(false);
        }
        isDragStart.current = false;
        return;
      }

      isDragStart.current = false;

      const { left, right, bottom } = menu.getBoundingClientRect();
      const { top: headTop } = head.getBoundingClientRect();
      const { top: mainTop } = main.getBoundingClientRect();

      const winWidth = window.innerWidth;
      const winHeight = window.innerHeight;

      const menuWidth = menu.clientWidth;

      const headHeight = head.offsetHeight;

      let newPos: Position = {
        left,
        top: mainTop,
        flip: 'none',
      };

      if (left < 0) {
        newPos = { left: marginGap, top: headTop - Math.round(headHeight / 2) };
      }

      if (headTop < 0) {
        newPos = { left, top: marginGap };
        return;
      }

      if (right > winWidth) {
        newPos = { left: winWidth - (menuWidth + marginGap), top: headTop - Math.round(headHeight / 2), flip: 'left' };
      }

      if (bottom > winHeight) {
        newPos = { left: newPos.left, top: headTop - headHeight, flip: 'top' }

        // newPos = { left: newPos.left, top: headTop, flip: 'top' }
      }
      setData(newPos);
    };

    const mouseDownHandler = function (event: MouseEvent | TouchEvent) {
      event.preventDefault();
      isDragged.current = false;
      isDragStart.current = true;
    };

    const dragHandler = (event: MouseEvent | TouchEvent) => {
      event.stopPropagation();

      // grab hold of head, menu and main refs.
      const head = headRef.current as HTMLElement;
      const menu = menuRef.current as HTMLElement;
      const main = mainRef.current as HTMLElement;

      const round = Math.round;

      // grab hold of window dimensions, menu head's width and height
      const { innerHeight: winHeight, innerWidth: winWidth } = window;
      const { clientWidth: headWidth, clientHeight: headHeight } = head;

      if (!isDragStart.current || !main || !menu || !head) {
        // cancel out the operation if the drag is not started
        return;
      } else {
        isDragged.current = true;
        // close the menu when dragging starts
        // isOpen.current = false;
        setOpen(false);
      }

      const menuHalfWidth = round(menu.clientWidth / 2);
      const headHalfWidth = round(headWidth / 2);
      const headHalfHeight = round(headHeight / 2);

      let x: number = 0, y: number = 0;

      if (event instanceof MouseEvent) {
        [x, y] = [event.clientX, event.clientY];
      } else if (event instanceof TouchEvent) {
        const { clientX, clientY } = event.touches[0];
        [x, y] = [clientX, clientY];
      }

      // check if the menu head is within the screen bounds (horizontal axis)
      if (x > 0 && x < winWidth) {
        main.style.left = `${x - menuHalfWidth}px`;
      }

      // check if the menu head is within the screen bounds (vertical axis)
      if (y > 0 && y < winHeight - headHalfHeight) {
        main.style.top = `${y - headHalfHeight}px`;
      }

    };

    document.addEventListener(dragEvent, dragHandler);

    if (headRef.current) {

      const head = headRef.current;

      // setup the mousedown handler
      head.addEventListener(dragStartEvent, mouseDownHandler);

      // setup the mouseup handler
      document.addEventListener(dragEndEvent, mouseUpHandler);

    }

    return () => {
      if (head) {
        document.removeEventListener(dragEvent, dragHandler);
        head.removeEventListener(dragStartEvent, mouseUpHandler);
        document.removeEventListener(dragEndEvent, mouseDownHandler);
      }
    }
  }, []);

  return [
    data,
    open,
    setOpen
  ]

}