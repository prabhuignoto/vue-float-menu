# Events

Vue Float Menu emits events for menu interactions.

## @select

Fired when a menu item is selected.

**Type:** `(itemName: string) => void`

```vue
<script setup>
const handleSelection = (itemName: string) => {
  console.log('User selected:', itemName);
  // Perform action based on selection
};
</script>

<template>
  <float-menu
    :menu-data="items"
    @select="handleSelection"
  />
</template>
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `itemName` | `string` | Name of the selected menu item |

### Example

```ts
const handleSelection = (itemName: string) => {
  switch(itemName) {
    case 'Save':
      saveDocument();
      break;
    case 'Exit':
      closeApplication();
      break;
  }
};
```

## Custom Event Handling

### Multiple Actions

```ts
const actions = {
  'New File': () => createNewFile(),
  'Open': () => openFile(),
  'Save': () => saveFile(),
  'Exit': () => exit()
};

const handleSelection = (itemName: string) => {
  const action = actions[itemName];
  if (action) {
    action();
  }
};
```

### With Metadata

```vue
<script setup>
interface MenuAction {
  name: string;
  handler: () => void;
}

const menuActions: MenuAction[] = [
  { name: 'Save', handler: () => save() },
  { name: 'Exit', handler: () => exit() }
];

const menuItems = menuActions.map(a => ({ name: a.name }));

const handleSelection = (itemName: string) => {
  const action = menuActions.find(a => a.name === itemName);
  action?.handler();
};
</script>
```

### Async Handlers

```ts
const handleSelection = async (itemName: string) => {
  try {
    switch(itemName) {
      case 'Save':
        await saveToServer();
        showSuccess('Saved!');
        break;
      case 'Load':
        await loadFromServer();
        showSuccess('Loaded!');
        break;
    }
  } catch (error) {
    showError('Operation failed');
  }
};
```

## Event Flow

1. User clicks/taps menu item
2. `@select` event is emitted
3. Event handler receives item name
4. Handler performs action
5. Menu closes automatically (if not a submenu parent)

## Best Practices

1. **Type your handlers** - Use TypeScript for safety
2. **Handle errors** - Wrap in try/catch for async operations
3. **Provide feedback** - Show success/error messages
4. **Keep handlers focused** - One responsibility per handler
5. **Avoid side effects** - Keep event handlers pure when possible

## See Also

- [Component Props](/api/props)
- [Slots](/api/slots)
- [Basic Usage](/guide/basic-usage)
