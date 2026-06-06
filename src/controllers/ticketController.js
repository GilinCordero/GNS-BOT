import { getTicketsByCustomer } from '../services/ispService.js'
import { refreshSession }       from '../cache/sessionStore.js'

export async function getTickets(req, res) {
  const { session } = req
  if (session.phase !== 'IDENTIFIED') {
    return res.code(403).send({ error: 'Debe identificarse antes de consultar tickets' })
  }
  const tickets = await getTicketsByCustomer(session.customerId)
  refreshSession(session.sessionId)
  return reply.send({ tickets })
}
