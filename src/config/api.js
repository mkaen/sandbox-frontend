import { API_HOST, API_PORT } from './env.js'

export const API_BASE_URL = `http://${API_HOST}:${API_PORT}`

export const API_PREFIX = {
    user: '/users'
}

export const ENDPOINT_VERSION = {
    v1: '/v1'
}
