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