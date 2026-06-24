import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './global.css'
import { createPinia } from 'pinia';
import BaseCard from './shared/components/ui/BaseCard.vue';

const app = createApp(App);
const pinia = createPinia()

app.use(router);
app.use(pinia);

app.component('base-card', BaseCard);

app.mount('#app');
