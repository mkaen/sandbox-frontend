const parsePort = (value, fallback) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const DEV_SERVER_PORT = parsePort(import.meta.env.VITE_DEV_SERVER_PORT, 8080)
export const API_HOST = import.meta.env.VITE_API_HOST || '127.0.0.1'
export const API_PORT = parsePort(import.meta.env.VITE_API_PORT, 8000)

/** Cloudflare R2 Worker base URL (no trailing slash). */
export const R2_WORKER_URL = (import.meta.env.VITE_R2_WORKER_URL || '').replace(/\/$/, '')
/**
 * Non-prod only: upload secret is visible in the browser bundle.
 * Move upload behind the backend before production.
 */
export const R2_UPLOAD_KEY = import.meta.env.VITE_R2_UPLOAD_KEY || ''
