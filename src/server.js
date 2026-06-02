import 'dotenv/config'
import Fastify       from 'fastify'
import cors          from '@fastify/cors'
import rateLimit     from '@fastify/rate-limit'
import staticPlugin  from '@fastify/static'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { PORT, HOST, CORS_ORIGIN, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS, NODE_ENV } from './config/env.js'
import { chatRoute }    from './routes/chat.js'
import { sessionRoute } from './routes/session.js'
import { ticketsRoute } from './routes/tickets.js'
import { healthRoute }  from './routes/health.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { initGlobalCache } from './cache/globalCache.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = Fastify({
  logger: {
    level: NODE_ENV === 'production' ? 'warn' : 'info',
    transport: NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
  },
})

await app.register(cors,      { origin: CORS_ORIGIN })
await app.register(rateLimit, {
  max: RATE_LIMIT_MAX,
  timeWindow: RATE_LIMIT_WINDOW_MS,
  errorResponseBuilder: () => ({ error: 'Demasiadas solicitudes. Espera un momento.' })
})

await app.register(staticPlugin, {
  root: join(__dirname, '../public'),
  prefix: '/',
})

await app.register(staticPlugin, {
  root: join(__dirname, '../widget/dist'),
  prefix: '/widget/',
  decorateReply: false,
})

await app.register(chatRoute,    { prefix: '/api' })
await app.register(sessionRoute, { prefix: '/api' })
await app.register(ticketsRoute, { prefix: '/api' })
await app.register(healthRoute)

app.setErrorHandler(errorHandler)

await initGlobalCache()

try {
  await app.listen({ port: PORT, host: HOST })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
