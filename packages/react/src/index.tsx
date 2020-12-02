import React from "react";
import { render } from "react-dom";
import Main from "./components/Main";

const Application = () => (
  <div>
    <Main
      items={[
        { id: 12, name: "test" },
        { id: 22, name: "red" },
        { id: 13, name: "blue" },
        { divider: true },
        { id: 13, name: "orange" },
        { id: 13, name: "black" },
        { id: 13, name: "violet" },
        { divider: true },
        {
          id: 11,
          name: "prdasdd",
          subMenu: [{ name: "test" }, { name: "test2" }],
        },
        {
          id: 11,
          name: "erer",
          subMenu: [
            { name: "3434" },
            { name: "t3434est2", subMenu: [{ id: 13, name: "red" }] },
          ],
        },
      ]}
      onSelection={(name) => alert(name)}
    >
      Menu
    </Main>
  </div>
);

render(<Application />, document.getElementById("root"));
