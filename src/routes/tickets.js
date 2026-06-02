import { getTickets }      from '../controllers/ticketController.js'
import { sessionMiddleware } from '../middlewares/sessionMiddleware.js'

export async function ticketsRoute(fastify) {
  fastify.get('/tickets', { preHandler: sessionMiddleware }, getTickets)
}
