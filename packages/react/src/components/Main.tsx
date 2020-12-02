import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  MainWrapper,
  MenuContainer,
  MenuHead,
  MenuHeadCircle,
} from "./Main.style";
import { Props } from "./MainProps";
import usePosition from "./menuEffect";
import { MenuItemViewModel } from "./MenuItem";
import { MenuItems } from "./MenuItems";

const Main: React.FunctionComponent<Props> = ({
  items,
  children,
  minWidth = 250,
  dimension = 40,
  theme = { primary: "red" },
  onSelection = () => {},
}: Props) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const menuHeadRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [position, open, setOpen] = usePosition(menuHeadRef, menuRef, mainRef);

  const cubic = useMemo(() => "cubic-bezier(0.25, 0.46, 0.45, 0.94)", []);

  useEffect(() => {
    const mainWrapper = mainRef.current;

    if (mainWrapper) {
      // setFlip(position.flip as boolean);
      mainWrapper.style.transition = `left 0.2s ${cubic}, top 0.2s  ${cubic}`;
      mainWrapper.style.left = position.left + "px";
      mainWrapper.style.top = position.top + "px";

      setTimeout(() => {
        mainWrapper.style.transition = "";
      }, 300);
    }
  }, [JSON.stringify(position)]);

  const handleSelection = useCallback(function (name: string) {
    onSelection && onSelection(name);
    setOpen(false);
  }, []);

  return (
    <MainWrapper ref={mainRef}>
      <MenuHead menuStyle={{ minWidth }} flip={position.flip}>
        <MenuHeadCircle
          width={dimension}
          height={dimension}
          theme={theme}
          ref={menuHeadRef}
          draggable
        >
          {children}
        </MenuHeadCircle>
      </MenuHead>
      <MenuContainer
        menuStyle={{ minWidth }}
        ref={menuRef}
        visibility={open ? 1 : 0}
        draggable={false}
        flip={position.flip}
      >
        {open && (
          <MenuItems
            items={items as MenuItemViewModel[]}
            theme={theme}
            onSelection={handleSelection}
            toggleMenu={open}
            flip={position.flip}
          />
        )}
      </MenuContainer>
    </MainWrapper>
  );
};

export default Main;
