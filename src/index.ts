import type { App } from 'vue';
import FloatMenuComponent from './components/index.vue';

// Export the component directly
export const FloatMenu = FloatMenuComponent;

// Export types separately
export type {
  MenuItem,
  Theme,
  BundleOptimization,
  FloatMenuProps,
  FloatMenuInstance,
} from './types';

// Export theme default
export { ThemeDefault } from './types';

// Vue plugin install function
export function install(app: App): void {
  app.component('FloatMenu', FloatMenuComponent);
}

// Default export for Vue plugin usage
export default {
  install,
  FloatMenu: FloatMenuComponent,
};
