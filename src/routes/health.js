/*
Route to check status of container.
*/

export async function healthRoute(fastify) {
  fastify.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))
}
