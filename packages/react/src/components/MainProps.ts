import { MenuItemModel } from "../models/MenuItemModel";
import MenuTheme from "../models/Theme";

export interface Props {
  children: React.ReactNode;
  dimension?: number;
  fixed?:  boolean;
  items: MenuItemModel[];
  minWidth?: number;
  onSelection: (e: string | React.MouseEvent) => void;
  theme?: MenuTheme;
}