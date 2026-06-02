import { handleChat }      from '../controllers/chatController.js'
import { sessionMiddleware } from '../middlewares/sessionMiddleware.js'

export async function chatRoute(fastify) {
  fastify.post('/chat', {
    preHandler: sessionMiddleware,
    schema: { body: { type: 'object', required: ['message'], properties: { message: { type: 'string', minLength: 1, maxLength: 1000 } } } }
  }, handleChat)
}
