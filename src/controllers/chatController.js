/**
 * Handles user request and 
 */

import { refreshSession, setSession } from '../cache/sessionStore.js'
import { sendMessage }                from '../services/geminiService.js'
import { getCachedCategories }        from '../cache/globalCache.js'

export async function handleChat(request, reply) {
  const { session }  = request
  const { message }  = request.body

  if (!message?.trim()) return reply.code(400).send({ error: 'El mensaje no puede estar vacío' })
  if (message.length > 1000) return reply.code(400).send({ error: 'Mensaje demasiado largo (máx. 1000 caracteres)' })

  const categories = await getCachedCategories()
  const { replyText, lastCreatedTicket } = await sendMessage(session, message.trim(), categories)

  session.lastActivity = new Date().toISOString()
  setSession(session.sessionId, session)
  refreshSession(session.sessionId)

  const response = {
    reply: replyText || 'Lo siento, no pude procesar tu solicitud. Intenta de nuevo.',
    phase: session.phase,
  }
  if (lastCreatedTicket) response.ticketCreated = { idTicket: lastCreatedTicket }

  return reply.send(response)
}
