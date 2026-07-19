import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './global.css'
import { createPinia } from 'pinia';
import { useAuthStore } from './features/auth/authStore';
import { useUserStore } from './features/users/userStore';
import { setupAuthInterceptors } from '@/config/api';
import BaseCard from '@/components/ui/BaseCard.vue';

const app = createApp(App);
const pinia = createPinia()

app.use(router);
app.use(pinia);

setupAuthInterceptors();

const authStore = useAuthStore();
await authStore.initalizeAuth();

router.beforeEach( async (to) => {
    const userStore = useUserStore();

    if (!authStore.authChecked) {
        await authStore.initalizeAuth();
    }

    if (to.meta.requiresAuth && !userStore.isAuthenticated) {
        return { path: '/login' };
    }

    if (to.meta.requiresAdmin && !userStore.isAdmin) {
        return { path: '/' };
    }

    return true;
});

app.component('base-card', BaseCard);

app.mount('#app');
