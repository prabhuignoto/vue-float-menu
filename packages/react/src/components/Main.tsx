import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { MenuItemViewModel } from "../models/MenuItemModel";
import {
  MainWrapper,
  MenuContainer,
  MenuHead,
  MenuHeadCircle,
} from "./Main.style";
import { Props } from "./MainProps";
import usePosition from "./menuEffect";
import { MenuItems } from "./MenuItems";

const Main: React.FunctionComponent<Props> = ({
  children,
  dimension = 45,
  fixed = false,
  items,
  minWidth = 250,
  onSelection = () => {},
  theme = { primary: "#0080ff" },
}: Props) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const menuHeadRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [position, open, setOpen] = usePosition(
    menuHeadRef,
    menuRef,
    mainRef,
    fixed
  );

  const cubic = useMemo(() => "cubic-bezier(0.25, 0.46, 0.45, 0.94)", []);

  useEffect(() => {
    const mainWrapper = mainRef.current;

    if (mainWrapper) {
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
      <MenuHead menuStyle={{ minWidth }}>
        <MenuHeadCircle
          width={dimension}
          height={dimension}
          theme={theme}
          ref={menuHeadRef}
          draggable={!fixed}
          tabIndex={0}
        >
          {children}
        </MenuHeadCircle>
        <MenuContainer
          menuStyle={{ minWidth }}
          ref={menuRef}
          draggable={false}
          flip={position.flip}
          visibility={open ? 1 : 0}
        >
          <MenuItems
            items={items as MenuItemViewModel[]}
            theme={theme}
            onSelection={handleSelection}
            toggleMenu={open}
            flip={position.flip}
          />
        </MenuContainer>
      </MenuHead>
    </MainWrapper>
  );
};

export default Main;
