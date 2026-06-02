export function errorHandler(error, request, reply) {
  request.log.error(error)
  if (error.validation) {
    return reply.code(400).send({ error: 'Parámetros inválidos', details: error.validation })
  }
  return reply.code(error.statusCode || 500).send({ error: error.message || 'Error interno del servidor' })
}
