import { defineStore } from 'pinia';    
import { authApi } from '@/config/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: null,
        user: null
    }),
    actions: {
        async login(payload) {
            try {
                const response = await authApi.post('/login', payload);
                if (response.status === 200) {
                    console.log('Login successful');
                    this.token = response.data.token;
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.error('Login failed', error);
                return false;
            }
        },
        async register(payload) {   
            try {
                const response = await authApi.post('/register', payload);
                if (response.status === 200) {
                    console.log('Registration successful');
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.error('Registration failed', error);
                return false;
            }
        }
    }
});