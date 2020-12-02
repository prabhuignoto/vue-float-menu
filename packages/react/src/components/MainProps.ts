import MenuTheme from "../models/Theme";
import { MenuItemModel } from "./MenuItem";

export interface Props {
  items: MenuItemModel[];
  children: React.ReactNode;
  minWidth?: number;
  dimension?: number;
  theme?: MenuTheme;
  onSelection: (e: string | React.MouseEvent) => void;
}