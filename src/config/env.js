import 'dotenv/config'

const required = ['GNS_BASE_URL', 'GNS_API_USER', 'GNS_API_PASS', 'GEMINI_API_KEY']
for (const key of required) {
  if (!process.env[key]) throw new Error(`[config] Falta variable de entorno: ${key}`)
}

export const GNS_BASE_URL = process.env.GNS_BASE_URL
export const GNS_API_USER = process.env.GNS_API_USER
export const GNS_API_PASS = process.env.GNS_API_PASS
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY
export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash' //fallback model
export const PORT = parseInt(process.env.PORT || '3000', 10)
export const HOST = process.env.HOST || '0.0.0.0'
export const NODE_ENV = process.env.NODE_ENV || 'development'
export const CORS_ORIGIN = process.env.CORS_ORIGIN || '*' //if GNS wants the widget in server different from the CRM s
export const SESSION_TTL_SECONDS = parseInt(process.env.SESSION_TTL_SECONDS || '1800',10) //30 minutes of ttl per session per user
export const CATEGORIES_TTL_SECONDS = parseInt(process.env.CATEGORIES_TTL_SECONDS || '3600',10)//categories retrieved data ttl
export const CUSTOMERS_TTL_SECONDS = parseInt(process.env.CUSTOMERS_TTL_SECONDS || '300',10)//Just about 5 minutes of persistance for customers data retrieval
export const CUSTOMER_SEARCH_MAX_RESULTS = parseInt(process.env.CUSTOMER_SEARCH_MAX_RESULTS || '5',10)
export const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '30',10) //Prevent request overload to api
export const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000',10)
