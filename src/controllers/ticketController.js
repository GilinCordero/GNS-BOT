import { getTicketsByCustomer } from '../services/ispService.js'
import { refreshSession }       from '../cache/sessionStore.js'

export async function getTickets(request, reply) {
  const { session } = request
  if (session.phase !== 'IDENTIFIED') {
    return reply.code(403).send({ error: 'Debe identificarse antes de consultar tickets' })
  }
  const tickets = await getTicketsByCustomer(session.customerId)
  refreshSession(session.sessionId)
  return reply.send({ tickets })
}
