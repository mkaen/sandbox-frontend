import axios from 'axios';
import { API_HOST, API_PORT } from './env.js';
import { generateUuid } from '../utils/index.js';
import { showApiErrorToast } from '../utils/toastUtils.js';


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


const CORRELATION_ID_STORAGE_KEY = 'x-correlation-id';
const CORRELATION_ID_GLOBAL_KEY = '__sandboxCorrelationId';

let xCorrelationId = null;

function persistCorrelationId() {
    if (!xCorrelationId) {
        return;
    }

    globalThis[CORRELATION_ID_GLOBAL_KEY] = xCorrelationId;

    try {
        sessionStorage.setItem(CORRELATION_ID_STORAGE_KEY, xCorrelationId);
    } catch {
        // sessionStorage may be unavailable; global fallback still applies
    }
}

function getActiveCorrelationId() {
    if (xCorrelationId) {
        return xCorrelationId;
    }

    const globalCorrelationId = globalThis[CORRELATION_ID_GLOBAL_KEY];
    if (typeof globalCorrelationId === 'string' && globalCorrelationId) {
        xCorrelationId = globalCorrelationId;
        return xCorrelationId;
    }

    try {
        const storedCorrelationId = sessionStorage.getItem(CORRELATION_ID_STORAGE_KEY);
        if (storedCorrelationId) {
            xCorrelationId = storedCorrelationId;
            globalThis[CORRELATION_ID_GLOBAL_KEY] = storedCorrelationId;
            return xCorrelationId;
        }
    } catch {
        // ignore
    }

    return null;
}

export function setCorrelationId() {
    xCorrelationId = generateUuid();
    persistCorrelationId();
}

export function ensureCorrelationId() {
    const existingCorrelationId = getActiveCorrelationId();
    if (existingCorrelationId) {
        return existingCorrelationId;
    }

    setCorrelationId();
    return xCorrelationId;
}

export function clearCorrelationId() {
    xCorrelationId = null;
    delete globalThis[CORRELATION_ID_GLOBAL_KEY];

    try {
        sessionStorage.removeItem(CORRELATION_ID_STORAGE_KEY);
    } catch {
        // ignore
    }
}

function applyTracingHeaders(headers) {
    if (!headers) {
        return;
    }

    const correlationId = getActiveCorrelationId();

    if (typeof headers.set === 'function') {
        headers.set('X-Request-ID', generateUuid());

        if (correlationId) {
            headers.set('X-Correlation-ID', correlationId);
        }

        return;
    }

    headers['X-Request-ID'] = generateUuid();

    if (correlationId) {
        headers['X-Correlation-ID'] = correlationId;
    }
}

function tracingTransformRequest(data, headers) {
    applyTracingHeaders(headers);
    return data;
}

const defaultTransformRequest = axios.defaults.transformRequest;
let axiosTransformRequest = [];
if (Array.isArray(defaultTransformRequest)) {
    axiosTransformRequest = defaultTransformRequest;
} else if (defaultTransformRequest) {
    axiosTransformRequest = [defaultTransformRequest];
}

const transformRequest = [
    tracingTransformRequest,
    ...axiosTransformRequest,
];

const sharedApiConfig = {
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
    transformRequest,
};

export const authApi = axios.create({
    baseURL: API_ENDPOINT_PREFIX.auth,
    ...sharedApiConfig,
});

export const userApi = axios.create({
    baseURL: API_ENDPOINT_PREFIX.user,
    ...sharedApiConfig,
});

const AUTH_ENDPOINTS_WITHOUT_REFRESH = ['/login', '/register', '/refresh', '/logout'];
const USER_FACING_AUTH_ENDPOINTS = ['/login', '/register'];

let isRefreshing = false;
let failedQueue = [];
let authInterceptorsAttached = false;

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

function requestUrlIncludes(config, endpoints) {
    const url = config?.url || '';
    return endpoints.some((endpoint) => url.includes(endpoint));
}

function shouldSkipAuthRefresh(config) {
    if (!config || config.skipAuthRefresh || config._retry) {
        return true;
    }

    return requestUrlIncludes(config, AUTH_ENDPOINTS_WITHOUT_REFRESH);
}

function readNotificationCode(error) {
    const data = error?.response?.data;
    if (!data || typeof data !== 'object' || typeof data.notificationCode !== 'string') {
        return null;
    }

    return data.notificationCode || null;
}

function shouldSkipErrorToast(error) {
    const config = error?.config;
    if (config?.skipErrorToast) {
        return true;
    }

    const status = error?.response?.status;
    if (
        status &&
        Array.isArray(config?.silentErrorStatuses) &&
        config.silentErrorStatuses.includes(status)
    ) {
        return true;
    }

    return status === 401 && !requestUrlIncludes(config, USER_FACING_AUTH_ENDPOINTS);
}

function attachErrorToastInterceptor(api) {
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (!shouldSkipErrorToast(error)) {
                showApiErrorToast(readNotificationCode(error));
            }

            throw error;
        }
    );
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
    if (authInterceptorsAttached) {
        return;
    }

    authInterceptorsAttached = true;
    attachErrorToastInterceptor(authApi);
    attachErrorToastInterceptor(userApi);
    attachAuthInterceptor(authApi);
    attachAuthInterceptor(userApi);
}

setupAuthInterceptors();
