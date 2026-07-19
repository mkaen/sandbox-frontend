import axios from 'axios';
import { API_HOST, API_PORT } from './env.js';


export const API_BASE_URL = `http://${API_HOST}:${API_PORT}`;

export const API_PREFIX = {
    user: '/users',
    auth: '/auth'
};

export const ENDPOINT_VERSION = {
    v1: '/v1'
};

export const API_ENDPOINT_PREFIX = {
    auth: `${API_BASE_URL}${ENDPOINT_VERSION.v1}${API_PREFIX.auth}`,
    user: `${API_BASE_URL}${ENDPOINT_VERSION.v1}${API_PREFIX.user}`
};

export const authApi = axios.create({
    baseURL: API_ENDPOINT_PREFIX.auth,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

export const userApi = axios.create({
    baseURL: API_ENDPOINT_PREFIX.user,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

const AUTH_ENDPOINTS_WITHOUT_REFRESH = ['/login', '/register', '/refresh', '/logout'];

let isRefreshing = false;
let failedQueue = [];

function processQueue(error) {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve();
        }
    });
    failedQueue = [];
}

function shouldSkipAuthRefresh(config) {
    if (!config || config.skipAuthRefresh || config._retry) {
        return true;
    }

    const url = config.url || '';
    return AUTH_ENDPOINTS_WITHOUT_REFRESH.some((endpoint) => url.includes(endpoint));
}

function attachAuthInterceptor(api) {
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status !== 401 || shouldSkipAuthRefresh(originalRequest)) {
                throw error;
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => api(originalRequest));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { useAuthStore } = await import('@/features/auth/authStore');
                const refreshed = await useAuthStore().refreshToken();

                if (!refreshed) {
                    throw error;
                }

                processQueue(null);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);

                const { useAuthStore } = await import('@/features/auth/authStore');
                const { default: router } = await import('@/router');
                await useAuthStore().logout();
                router.push('/login');

                throw refreshError;
            } finally {
                isRefreshing = false;
            }
        }
    );
}

export function setupAuthInterceptors() {
    attachAuthInterceptor(authApi);
    attachAuthInterceptor(userApi);
}
