import { createSession, destroySession } from '../controllers/sessionController.js'
import { sessionMiddleware }             from '../middlewares/sessionMiddleware.js'

export async function sessionRoute(fastify) {
  fastify.post('/session', createSession)
  fastify.delete('/session', { preHandler: sessionMiddleware }, destroySession)
}
