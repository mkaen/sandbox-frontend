import { createApp, watch } from 'vue'
import App from './App.vue'
import router from './router'
import { buildLoginLocation } from './router/redirect'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './global.css'
import { createPinia } from 'pinia';
import { useAuthStore } from './features/auth/authStore';
import { useUserStore } from './features/users/userStore';
import { setupAuthInterceptors } from '@/config/api';
import BaseCard from '@/components/ui/BaseCard.vue';
import BasicBadge from '@/components/badges/BasicBadge.vue';
import ConfirmationButton from '@/components/buttons/ConfirmationButton.vue';
import BaseNotificationModal from './components/modals/BaseNotificationModal.vue';
import { i18n } from '@/config/i18n';
import { registerAppToast, showApiErrorToast } from '@/utils/toastUtils';
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice';
import { preset } from './preset.js'

const app = createApp(App);
const pinia = createPinia()

app.use(i18n);
app.use(pinia);

setupAuthInterceptors();

const authStore = useAuthStore();
await authStore.initalizeAuth();

const userStore = useUserStore();

// Returns the location to redirect to, or `null` when the user may see the route.
function findAccessRedirect(route) {
    if (route.meta.requiresAuth && !userStore.isAuthenticated) {
        return buildLoginLocation(route.fullPath);
    }

    if (route.meta.requiresAdmin && !userStore.isAdmin) {
        return { path: '/' };
    }

    if (route.meta.requiresSelfOrAdmin) {
        const isSelf = userStore.isAuthenticated && userStore.id === String(route.params.id);
        if (!isSelf && !userStore.isAdmin) {
            return { path: '/' };
        }
    }

    return null;
}


router.beforeEach( async (to) => {
    if (!authStore.authChecked) {
        await authStore.initalizeAuth();
    }

    if (['/login', '/register'].includes(to.path) && userStore.isAuthenticated) {
        return { path: '/' };
    }
    const redirect = findAccessRedirect(to);
    if (redirect && userStore.isAuthenticated) {
        showApiErrorToast('FORBIDDEN_ACTION');
    }

    return redirect ?? true;
});

// Guards only run on navigation. When the session ends or the role changes while
// the user stays on a protected page (logout, expired session), re-check the current route.
watch(
    () => [userStore.isAuthenticated, userStore.isAdmin],
    async () => {
        const redirect = findAccessRedirect(router.currentRoute.value);
        if (redirect) {
            await router.replace(redirect);
        }
    }
);

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: preset,
        options: {
            prefix: 'p',
            darkModeSelector: false,
            cssLayer: false
        }
    }
})
app.component('basic-badge', BasicBadge);
app.component('base-card', BaseCard);
app.component('confirmation-button', ConfirmationButton);
app.component('notification-modal', BaseNotificationModal);
app.use(ToastService);
registerAppToast(app.config.globalProperties.$toast);
app.mount('#app');
