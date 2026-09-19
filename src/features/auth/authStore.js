import { defineStore } from 'pinia';
import router from '@/router';
import { authApi, setCorrelationId, ensureCorrelationId } from '@/config/api';
import { useUserStore } from '@/features/users/userStore';
import { startSession, stopSession } from '@/composables/sessionManager';
import defaultProfileImage from '@/assets/icons/user.png';

function userStore() {
    return useUserStore();
}

async function applyProfileImage(userId) {
    if (!userId) {
        return;
    }
    await userStore().loadProfileImage(userId);
}


export const useAuthStore = defineStore('auth', {
    state: () => ({
        authChecked: false,
    }),
    actions: {
        async login(payload) {
            try {
                const response = await authApi.post('/login', payload);
                if (response.status === 200) {
                    const userData = response.data;
                    userStore().setUser(userData);
                    setCorrelationId();
                    startSession();
                    await applyProfileImage(userData.id);
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.error('Login failed', error);
                return false;
            }
        },
        async register(payload, image = null) {
            try {
                const response = await authApi.post('/register', payload);
                if (response.status === 201) {
                    const userData = response.data;
                    userStore().setUser(userData);
                    setCorrelationId();
                    startSession();
                    if (image && userData.id) {
                        await userStore().uploadProfileImage(image, userData.id);
                    } else {
                        userStore().setImage(defaultProfileImage);
                    }
                    return userData;
                } else {
                    return;
                }
            } catch (error) {
                console.error('Registration failed', error);
                return false;
            }
        },
        async refreshToken() {
            try {
                const response = await authApi.post('/refresh', null, {
                    skipAuthRefresh: true,
                });
                if (response.status === 200) {
                    const userData = response.data;
                    userStore().setUser(userData);
                    ensureCorrelationId();
                    startSession();
                    await applyProfileImage(userData.id);
                    return true;
                }
                return false;
            } catch (error) {
                console.error('Refresh token failed', error);
                return false;
            }
        },
        async logout() {
            try {
                await authApi.post('/logout');
                const currentRoute = router.currentRoute.value;
                if (currentRoute.meta.requiresAuth) {
                    await router.push('/');
                }
                return true;
            } catch (error) {
                console.error('Logout failed', error);
                return false;
            } finally {
                stopSession();
                userStore().resetUserData();
            }
        },
        async initalizeAuth() {
            try {
                await this.refreshToken();
            } catch {
                console.log('Initialize auth failed');
            } finally {
                this.authChecked = true;
            }
        }
    },
});
