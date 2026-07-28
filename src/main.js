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
import ConfirmationButton from '@/components/buttons/ConfirmationButton.vue';
import BaseNotificationModal from './components/modals/BaseNotificationModal.vue'

const app = createApp(App);
const pinia = createPinia()

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

    if (['/login', '/register'].includes(to.path) && userStore.isAuthenticated) {
        return { path: '/' };
    }

    if (to.meta.requiresAdmin && !userStore.isAdmin) {
        return { path: '/' };
    }

    if (to.meta.requiresSelfOrAdmin) {
        const isSelf = userStore.isAuthenticated && userStore.id === String(to.params.id);
        if (!isSelf && !userStore.isAdmin) {
            return { path: '/' };
        }
    }

    return true;
});

app.use(router);
app.component('base-card', BaseCard);
app.component('confirmation-button', ConfirmationButton);
app.component('notification-modal', BaseNotificationModal);
app.mount('#app');
