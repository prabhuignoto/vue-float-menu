# Edge Flipping

Automatic orientation adjustment near screen edges.

## Example

```vue
<float-menu
  :menu-data="items"
  :flip-on-edges="true"
  position="top right"
/>
```

## How It Works

When menu is near an edge:
- **Right edge** → Opens to the left
- **Left edge** → Opens to the right
- **Bottom edge** → Opens upward
- **Top edge** → Opens downward

## Use Cases

Perfect for:
- Draggable menus
- Responsive layouts
- Unknown screen sizes
- Ensuring visibility

## Demo

Try dragging the menu to different screen edges and opening it. The menu automatically flips to stay visible.

## Related

- [Positioning](/guide/positioning)
- [Basic Usage](/guide/basic-usage)
