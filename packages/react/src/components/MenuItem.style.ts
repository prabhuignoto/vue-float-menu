import styled from "@emotion/styled";
import MenuTheme from "../models/Theme";

export const MenuItemContent = styled.div<{ theme: MenuTheme; flip?: string }>`
  width: 100%;
  display: flex;
  padding-left: 0.2em;
  align-items: center;
  justify-content: center;
  height: 100%;
  user-select: none;
  font-size: 1rem;

  &:hover {
    background: ${p => p.theme.primary};
    color: #fff;
  }

  &.selected  {
    background: #f2f2f2;
  }
`;

export const MenuItemMain = styled.li<{ theme: MenuTheme, flip?: string }>`
  &:not(.divider) {
    min-height: 2.5rem;
    height: 0;
  }
  height: 5px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const MenuItemText = styled.span<{ align?: string, theme: MenuTheme }>`
  color: ${p => p.theme.textColor};
  ${p => p.align === 'left' ? 'padding-right:3px' : 'padding-left:3px'};
  ${p => {
    if (p.align === "left") {
      return `order: 2;`
    } else {
      return `order: 1;`
    }
  }}
`;

export const MenuItemIcon = styled.span<{ align?: string }>`
  ${p => {
    if (p.align === "left") {
      return `order: 1; margin-right: auto;padding-left:3px;`
    } else {
      return `order: 2; margin-left: auto;`
    }
  }}
`;

export const SubMenuWrapper = styled.div<{ align?: string }>`
  position: absolute;
  top: 0;
  min-width: 150px;
  background: #fff;
  border-radius: 3px;

  ${p => {
    if (p.align === "left") {
      return `
        right: 102%;
      `
    } else {
      return `
        left: 102%;
      `
    }
  }}
`;

export const Divider = styled.span`
  width: 95%;
  background: rgba(0,0,0,0.1);
  height: 1px;
`;