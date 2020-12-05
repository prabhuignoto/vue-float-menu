import styled from "@emotion/styled";
import MenuTheme from './../models/Theme';

export const MainWrapper = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  z-index: 99999;
`;

interface MenuContainerModel {
  menuStyle: { minWidth: number };
  visibility?: number;
  flip?: string;
}

interface MenuHeadModel {
  menuStyle: { minWidth: number };
}

interface MenuHeadCircleModel {
  width: number;
  height: number;
  theme: MenuTheme;
}

export const MenuContainer = styled.div<MenuContainerModel>`
  background: #fff;
  border-radius: 4px;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.2));
  min-width: ${p => p.menuStyle.minWidth}px;
  margin-top: 0.5rem;
  visibility: ${p => p.visibility ? "visible" : "hidden"};

  ${p => {
    if (p.flip === 'top') {
      return `
        // position: absolute;
        // bottom: calc(100%);
        // left: 50%;
        // transform: translateX(-50%);
      `;
    }
  }};

  &.flip  {
    border:  1px  solid blue;
  }
`;

export const MenuHead = styled.div<MenuHeadModel>`
  align-items: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

export const MenuHeadCircle = styled.span<MenuHeadCircleModel>`
  align-items: center;
  background-color: ${p => p.theme.primary};
  border-radius: 50%;
  display: flex;
  height: ${p => p.height}px;
  justify-content: center;
  width: ${p => p.width}px;
  color:  #fff;

  &.svg  {
    width:  100%;
    height:  100%;
  }
`;