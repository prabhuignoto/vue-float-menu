import { createApp } from 'vue';
import router from './demo/router';
import App from './demo/App.vue';
import './index.css';

const app = createApp(App);
app.use(router);
app.mount('#app');
