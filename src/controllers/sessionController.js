import { v4 as uuidv4 } from 'uuid'
import { setSession, deleteSession } from '../cache/sessionStore.js'

export async function createSession(request, reply) {
  const sessionId = uuidv4()
  const now       = new Date().toISOString()
  setSession(sessionId, {
    sessionId,
    phase:               'IDENTIFYING',
    customerId:          null,
    geminiInteractionId: null,
    customer:            null,
    services:            null,
    _searchCandidates:   null,
    createdAt:           now,
    lastActivity:        now,
  })
  return reply.code(201).send({ sessionId })
}

export async function destroySession(request, reply) {
  deleteSession(request.headers['x-session-id'])
  return reply.send({ success: true })
}
