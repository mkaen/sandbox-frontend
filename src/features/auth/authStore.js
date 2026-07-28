import { defineStore } from 'pinia';
import router from '@/router';    
import { authApi } from '@/config/api';
import { getProfileImageUrl, uploadProfileImage } from '@/config/r2';
import { useUserStore } from '@/features/users/userStore';
import { startSession, stopSession } from '@/composables/sessionManager';


function userStore() {
    return useUserStore();
}

function applyProfileImage(imageReference) {
    const imageUrl = getProfileImageUrl(imageReference);
    if (imageUrl) {
        userStore().setImage(imageUrl);
    }
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
                    startSession();
                    if (userData.imageReference) {
                        applyProfileImage(userData.imageReference);
                    }
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.error('Login failed', error);
                return false;
            }
        },
        async register(payload, image) {   
            try {
                const response = await authApi.post('/register', payload);
                if (response.status === 201) {
                    const userData = response.data;
                    userStore().setUser(userData);
                    startSession();
                    if (image && userData.imageReference) {
                        try {
                            const imageUrl = await uploadProfileImage(
                                userData.imageReference,
                                image,
                            );
                            userStore().setImage(imageUrl);
                        } catch (uploadError) {
                            console.error('Profile image upload failed', uploadError);
                        }
                    }
                    return true;
                } else {
                    return false;
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
                    startSession();
                    if (userData.imageReference) {
                        applyProfileImage(userData.imageReference);
                    }
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
