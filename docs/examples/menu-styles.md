# Menu Styles

Different visual styles for different use cases.

## Slide-out (Default)

```vue
<float-menu
  :menu-data="items"
  menu-style="slide-out"
/>
```

Best for:
- Desktop applications
- Traditional dropdown menus
- Submenus that expand to the side

## Accordion

```vue
<float-menu
  :menu-data="items"
  menu-style="accordion"
/>
```

Best for:
- Mobile devices
- Touch interfaces
- Limited screen space
- Inline expansion

## Comparison

| Feature | Slide-out | Accordion |
|---------|-----------|-----------|
| Space Usage | More | Less |
| Mobile | Good | Better |
| Desktop | Better | Good |
| Submenus | Fly-out | Inline |

## Related

- [Basic Usage](/guide/basic-usage)
- [Positioning](/guide/positioning)
