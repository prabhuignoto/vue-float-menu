import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const animate = keyframes`
  0%{
    opacity: 0;
  }
  100%  {
    opacity: 1;
  }
`

export const MenuItemsWrapper = styled.div`
  width: 100%;
  outline: 0;
  animation: ${animate} 0.1s ease-in;
`;

export const MenuItemsMain = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  outline: 0;
`;

