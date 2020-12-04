import React from "react";
import { render } from "react-dom";
import Main from "./components/Main";

import BoxIcon from "./assets/BoxIcon";

const Application = () => (
  <div>
    <Main
      items={[
        { name: "New" },
        {
          name: "Edit",
          subMenu: [{ name: "Copy" }, { name: "Paste" }],
        },
        {
          name: "Open Recent",
          subMenu: [{ name: "Document 1" }, { name: "Document 2" }],
        },
        {
          divider: true,
        },
        {
          name: "Settings",
          subMenu: [
            {
              name: "Themes",
              subMenu: [
                { name: "Dark" },
                { name: "Light" },
                { name: "Blue" },
                { name: "Green" },
              ],
            },
            { name: "Keymaps" },
          ],
        },
        {
          divider: true,
        },
        {
          name: "Save",
          disable:  true,
        },
        {
          name: "Save As",
        },
        {
          divider: true,
        },
        {
          name: "Close",
        },
        {
          name: "Exit",
        },
      ]}
      onSelection={(name) => alert(name)}
    >
      <BoxIcon />
    </Main>
  </div>
);

render(<Application />, document.getElementById("root"));
