import { getSession } from '../cache/sessionStore.js'

export async function sessionMiddleware(request, reply) {
  const sessionId = request.headers['x-session-id']
  if (!sessionId) return reply.code(401).send({ error: 'Header X-Session-Id requerido' })

  const session = getSession(sessionId)
  if (!session) return reply.code(401).send({ error: 'Sesión inválida o expirada', code: 'SESSION_EXPIRED' })

  request.session = session
}
