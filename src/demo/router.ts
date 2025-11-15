import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Home from './pages/Home.vue';
import BasicMenu from './pages/BasicMenu.vue';
import NestedMenus from './pages/NestedMenus.vue';
import CustomThemes from './pages/CustomThemes.vue';
import EdgeFlipping from './pages/EdgeFlipping.vue';
import MenuStyles from './pages/MenuStyles.vue';
import DisabledItems from './pages/DisabledItems.vue';
import KeyboardNav from './pages/KeyboardNav.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Home' },
  },
  {
    path: '/basic',
    name: 'BasicMenu',
    component: BasicMenu,
    meta: { title: 'Basic Menu', icon: '📋' },
  },
  {
    path: '/nested',
    name: 'NestedMenus',
    component: NestedMenus,
    meta: { title: 'Nested Menus', icon: '🗂️' },
  },
  {
    path: '/themes',
    name: 'CustomThemes',
    component: CustomThemes,
    meta: { title: 'Custom Themes', icon: '🎨' },
  },
  {
    path: '/edge-flipping',
    name: 'EdgeFlipping',
    component: EdgeFlipping,
    meta: { title: 'Edge Flipping', icon: '🔄' },
  },
  {
    path: '/menu-styles',
    name: 'MenuStyles',
    component: MenuStyles,
    meta: { title: 'Menu Styles', icon: '📐' },
  },
  {
    path: '/disabled-items',
    name: 'DisabledItems',
    component: DisabledItems,
    meta: { title: 'Disabled Items', icon: '🚫' },
  },
  {
    path: '/keyboard',
    name: 'KeyboardNav',
    component: KeyboardNav,
    meta: { title: 'Keyboard Navigation', icon: '⌨️' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
