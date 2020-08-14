# float-menu

[![Maintainability](https://api.codeclimate.com/v1/badges/a591487451582a389126/maintainability)](https://codeclimate.com/github/prabhuignoto/float-menu/maintainability)
[![DeepScan grade](https://deepscan.io/api/teams/10074/projects/13372/branches/223016/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=10074&pid=13372&bid=223016)
[![Depfu](https://badges.depfu.com/badges/3597df88718d346a7b41f08e31fe1331/overview.svg)](https://depfu.com/github/prabhuignoto/float-menu?project_id=15010)

> Customizable Floating Menu for Vue 3

![app-home](app-home.png)

## Features

- **Draggable Menu Handle** - Drag and easily place the Menu anywhere on screen.
- **Smart Menu** - Detects the top & bottom edges of the screen and flips the menu automatically.
- **Smart Placement** - The Menu head automatically adjusts itself and always stays inside the viewport.
- **Nested Menus** - Support for Nested menus up to any levels. It is always advisable to keep the nesting to a Minimum to have a good UX.
- **Composition API** - Built using the latest Composition API from Vue 3.
- **Typescript** - Built with Typescript.

## Installation

```sh
yarn run install && yarn run dev
```

## Getting Started

float-menu has some great defaults to get you started quickly. Please check the props list for details on all available options.

```sh
  <FloatMenu
    :position="'top left'"
    :dimension="50"
    :menu="menu"
    menu-direction="bottom"
  >
    <BoxIcon />
  </FloatMenu>
```

## Demo

![demo](demo.gif)

## Props

| Prop             | Type     | Description                                                                                                                      |
| ---------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| dimension        | number   | dimension of the Menu Head.                                                                                                      |
| position         | String   | Initial position of the Menu Head. can be any one of the following values "top left", "top right", "bottom left", "bottom right" |
| fixed            | Boolean  | Disables dragging on the Menu Head.                                                                                              |
| menu-orientation | String   | prop to set the Menu's orientation. can accept top or bottom.                                                                    |
| menu-dimension   | Object   | prop to set the width and minimum height of the Menu.                                                                            |
| menu-data        | Object   | Array data to generate the nested menu.                                                                                          |
| on-selected      | Function | Hook to call on selection.                                                                                                       |
| flip-on-edges    | Boolean  | Flips the Menu content automatically, when there is no space to display nested menus.                                            |

### dimension

`dimension` prop can be used to set the width and height of the menu head. The prop takes a single number value to set the height and width of the Menu Head.

```sh
  <FloatMenu :dimension=50>
    <BoxIcon />
  </FloatMenu>
```

### position

The `position` prop can be used to set the initial position of the Menu Head. The prop can accept any one of the following values.

- `top left` (default)
- `top right`
- `bottom left`
- `bottom right`

```sh
  <FloatMenu :dimension=50 :position="'bottom right'">
    <BoxIcon />
  </FloatMenu>
```

### fixed

To disable dragging and make the Menu Head static, set `fixed` to `true`. This prop is disabled by default.

```sh
  <FloatMenu :dimension=50 :position="'bottom right'" :fixed="true">
    <BoxIcon />
  </FloatMenu>
```

### menu-orientation

sets the default menu orientation. can be set to either `top` or `bottom`.

```sh
  <FloatMenu :dimension=50 :position="'bottom right'" menu-orientation="bottom">
    <BoxIcon />
  </FloatMenu>
```

### menu-dimension

prop to set the `height` and `width` of the menu.

```sh
  <FloatMenu
    :dimension=50
    :position="'bottom right'"
    menu-orientation="bottom"
    :menu-dimension="{height: 400, width: 300}">
    <BoxIcon />
  </FloatMenu>
```

### menu-data

This prop is used to create the nested menu structure. prop accepts an `Array` of type `MenuItem`

`MenuItem type`

```sh
type MenuItem {
  name: string;
  subMenu?: `Menu`;
  id?: string;
  showSubMenu?: boolean;
  selected?: boolean;
}
```

| property    | description                                                           |
| ----------- | --------------------------------------------------------------------- |
| name        | display name of the menu item.                                        |
| id          | unique id of each menu item. this is auto generated by the component. |
| selected    | flag to highlight a sub-menu selection.                               |
| showSubMenu | flag to show/hide the sub-menu.                                       |
| subMenu     | data for the sub-menu                                                 |

`Menu type`

```sh
type Menu = {
  items: MenuItem[];
};
```

| property | description              |
| -------- | ------------------------ |
| items    | collection of menu items |

```sh
  <FloatMenu
    :dimension=50
    :position="'bottom right'"
    :menu-dimension="{height: 400, width: 300}"
    :menu-data="{ items: [{ name: 'File' }, { name: 'Open' }, { name: 'Themes', subMenu: { items: [{  name: 'Dark' }]}}]}"
    menu-orientation="bottom">
    <BoxIcon />
  </FloatMenu>
```

### on-select

hook for the menu item selection event.

```sh
  <FloatMenu
    :dimension=50
    :position="'bottom right'"
    :menu-dimension="{height: 400, width: 300}"
    :menu-data="{items: [{name: 'File'}, {name: 'Open'}]}"
    on-select="handleSelection"
    menu-orientation="bottom">
    <BoxIcon />
  </FloatMenu>
```

### flip-on-edges

setting this prop flips the menu content on the right edges of the screen. This is useful you have nested menus of many levels.

```sh
  <FloatMenu
    :dimension=50
    :position="'bottom right'"
    :flip-on-edges="true"
    on-select="handleSelection"
    menu-orientation="bottom">
    <BoxIcon />
  </FloatMenu>
```

![flip](flip.png)

### custom icon

To customize the icon, simply pass any icon in between the `FloatMenu` tags. The component internally uses a slot to insert the icon.

```sh
  <FloatMenu
    :dimension=50
    menu-orientation="bottom">
    <BoxIcon />
  </FloatMenu>
```

```sh
  <FloatMenu
    :dimension=50
    menu-orientation="bottom">
    <HeartIcon />
  </FloatMenu>
```

## Built with

- [Vue.JS](vue) - The Component is written in Vue + [Typescript](typescript).

## Notes

- The component is built using the RC version of Vue 3 and heavily relies on the composition API.
- The project uses [vite](vite) instead of @vue/cli. I choose vite for speed and i also believe [vite](vite) will be the future.

## Meta

Prabhu Murthy – [@prabhumurthy2](https://twitter.com/prabhumurthy2) – prabhu.m.murthy@gmail.com

Distributed under the MIT license. See `LICENSE` for more information.

[https://github.com/prabhuingoto/](https://github.com/prabhuingoto/)

<!-- Markdown link & img dfn's -->

[vue]: https://vuejs.org
[typescript]: https://typescriptlang.org
[vite]: https://github.com/vitejs/vite
