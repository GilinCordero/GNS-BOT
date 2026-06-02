// ─── Grupo 1: Identificación (phase IDENTIFYING) ─────────────────────────────
export const identificationTools = [
  {
    type: 'function',
    name: 'searchCustomerByName',
    description: `Busca clientes en el sistema por nombre.
Usar cuando el usuario diga cómo se llama.
Devuelve lista de coincidencias con ID, nombre, ciudad y últimos 4 dígitos del teléfono.
Si no hay resultados: pedir nombre completo o apellido.
Si hay más de 5: pedir apellido u otro dato para afinar.`,
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Nombre completo o parcial del usuario' }
      },
      required: ['query']
    }
  },
  {
    type: 'function',
    name: 'confirmAndActivateCustomer',
    description: `Confirma la identidad del cliente y activa la sesión de soporte.
Llamar ÚNICAMENTE cuando el cliente haya respondido correctamente una pregunta de verificación
(últimos 4 dígitos del teléfono, número de contrato, o ciudad).
NO llamar si el cliente no ha confirmado su identidad.`,
    parameters: {
      type: 'object',
      properties: {
        idCustomer: { type: 'integer', description: 'ID del cliente identificado y confirmado' }
      },
      required: ['idCustomer']
    }
  }
]

// ─── Grupo 2: Soporte (phase IDENTIFIED) ─────────────────────────────────────
export const supportTools = [
  {
    type: 'function',
    name: 'getCustomerTickets',
    description: 'Obtiene los tickets de soporte del cliente. Usar cuando pregunte por sus reportes o folios.',
    parameters: {
      type: 'object',
      properties: {
        idCustomer: { type: 'integer', description: 'ID del cliente' }
      },
      required: ['idCustomer']
    }
  },
  {
    type: 'function',
    name: 'createTicket',
    description: `Crea un ticket de soporte. Usar SOLO si:
(a) el troubleshooting no resolvió el problema,
(b) el cliente lo solicita explícitamente, o
(c) el problema requiere visita técnica.`,
    parameters: {
      type: 'object',
      properties: {
        idCategory:        { type: 'integer', description: 'ID de categoría del catálogo en el system prompt' },
        idCustomerPackage: { type: 'integer', description: 'ID del servicio del cliente (en el system prompt)' },
        problem:           { type: 'string',  description: 'Descripción técnica: síntomas + pasos de diagnóstico intentados' },
        contact_name:      { type: 'string',  description: 'Nombre del contacto' },
        phone_number:      { type: 'string',  description: 'Teléfono de contacto' }
      },
      required: ['idCategory', 'idCustomerPackage', 'problem']
    }
  },
  {
    type: 'function',
    name: 'addTicketComment',
    description: 'Agrega comentario de seguimiento a un ticket existente.',
    parameters: {
      type: 'object',
      properties: {
        idTicket: { type: 'integer', description: 'ID numérico del ticket (campo idTicket)' },
        comment:  { type: 'string',  description: 'Texto del comentario' }
      },
      required: ['idTicket', 'comment']
    }
  },
  {
    type: 'function',
    name: 'getCustomerBalance',
    description: 'Consulta saldo pendiente. Usar si el cliente menciona adeudos, pagos, o servicio suspendido.',
    parameters: {
      type: 'object',
      properties: {
        idCustomer: { type: 'integer', description: 'ID del cliente' }
      },
      required: ['idCustomer']
    }
  }
]
