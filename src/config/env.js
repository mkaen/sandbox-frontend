const parsePort = (value, fallback) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const DEV_SERVER_PORT = parsePort(import.meta.env.VITE_DEV_SERVER_PORT, 8080)
export const API_HOST = import.meta.env.VITE_API_HOST || '127.0.0.1'
export const API_PORT = parsePort(import.meta.env.VITE_API_PORT, 8000)
