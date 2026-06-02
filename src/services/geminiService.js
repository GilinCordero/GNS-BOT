import { genai }                         from '../api/gemini/geminiClient.js'
import { GEMINI_MODEL }                  from '../config/env.js'
import { identificationTools, supportTools } from '../tools/ispTools.js'
import * as ispService                   from './ispService.js'
import { getCachedCustomers }            from '../cache/globalCache.js'
import { searchCustomersByName }         from './customerSearch.js'
import { setSession }                    from '../cache/sessionStore.js'

// ─── System Prompts ───────────────────────────────────────────────────────────

export function buildIdentifyingSystemPrompt() {
  return `Eres Sofía, asistente virtual de soporte de GNS (proveedor de internet).
Eres amable, profesional y hablas siempre en español.

TU ÚNICO OBJETIVO EN ESTE MOMENTO: identificar al cliente antes de ayudarlo.

PROCESO:
1. En tu primer mensaje, saluda y pide el nombre completo del cliente.
2. Cuando diga su nombre, usa searchCustomerByName.
3. Según los resultados:
   - Sin resultados: pide que intente con su nombre completo o apellido.
   - 1 resultado: confirma el nombre y pide UNA verificación:
       "¿Cuáles son los últimos 4 dígitos de tu número de teléfono registrado?"
       o "¿Cuál es tu número de contrato?"
   - 2–5 resultados: muestra las opciones con ciudad y pregunta cuál es.
       Ejemplo: "Encontré estas personas: 1. [Nombre] de [Ciudad]  2. [Nombre] de [Ciudad]  ¿Cuál eres tú?"
   - Más de 5: pide apellido u otro dato para afinar la búsqueda.
4. Cuando el cliente confirme (respondió correctamente la verificación), llama confirmAndActivateCustomer.
5. NO puedes abrir tickets, ver información de cuenta, ni dar soporte técnico hasta identificar al cliente.
6. NO inventes resultados. Usa siempre las herramientas.
7. Responde en español, sin markdown.`
}

export function buildIdentifiedSystemPrompt(session, categories) {
  const { customer, services } = session
  const svc         = services[0] || {}
  const fullName    = `${customer.name} ${customer.lastname}`.trim()
  const accountStatus = customer.payment_status === 1 ? 'Al corriente' : 'Con adeudo pendiente'
  const categoryList  = categories.map(c => `  - ID ${c.idCategory}: ${c.category}`).join('\n')

  return `Eres Sofía, asistente virtual de soporte técnico de GNS.
Eres amable, profesional, empática y hablas siempre en español.

CLIENTE IDENTIFICADO:
- Nombre: ${fullName}
- Contrato: ${customer.contract_number}
- Paquete: ${svc.package || 'N/A'} — ${svc.service || 'N/A'}
- Estado del servicio: ${svc.status || 'Desconocido'}
- Estado de cuenta: ${accountStatus}
- Ciudad: ${customer.city || 'N/A'}

REGLAS:
1. El cliente ya está identificado — NO vuelvas a pedirle que se identifique.
2. Antes de abrir un ticket, SIEMPRE intenta diagnosticar con pasos de troubleshooting.
3. Solo abre un ticket si: el troubleshooting falló, el cliente lo pide, o requiere visita técnica.
4. Al crear un ticket: redacta descripción técnica con síntomas y pasos ya intentados.
5. Consulta tickets cuando el cliente pregunte por sus reportes.
6. Si hay adeudo, informa que debe regularizar el pago para restablecer el servicio.
7. NO inventes datos. Usa las herramientas disponibles.
8. Responde en español. Sin markdown. Sé conciso pero completo.

REGLAS DE TROUBLESHOOTING:
- Solo sugiere pasos genéricos, lógicos y seguros: reiniciar el router (desconectar 30 segundos), verificar que los cables estén bien conectados, revisar ajustes básicos de red.
- NO sugieras manipulación física de equipos de red externos, cambios de firmware, configuraciones avanzadas, ni nada fuera de lo común.
- Si el troubleshooting no resuelve el problema después de 1-2 intentos, o el cliente indica que ya lo intentó todo, crea un ticket inmediatamente.
- Si el usuario menciona un ticket existente que sigue abierto para el mismo problema, agrega un comentario al ticket existente describiendo qué sucede ahora en lugar de crear uno nuevo.

CATEGORÍAS DISPONIBLES:
${categoryList}

DATOS TÉCNICOS (para crear tickets):
- idCustomerPackage: ${svc.idCustomerPackage || 'N/A'}
- idCustomer: ${customer.idCustomer || session.customerId}`
}

// ─── Helpers para extraer de outputs (esquema @google/genai v1.52.0) ─────────

/**
 * Extrae el texto del primer output de tipo 'text'.
 */
function extractText(outputs = []) {
  for (const content of outputs) {
    if (content.type === 'text' && content.text) {
      return content.text
    }
  }
  return null
}

/**
 * Extrae todas las function calls de los outputs.
 * Cada function call: { id, name, arguments }
 */
function extractFunctionCalls(outputs = []) {
  return outputs.filter(c => c.type === 'function_call')
}

// ─── Ejecutores por fase ──────────────────────────────────────────────────────

async function executeIdentifyingTool(name, args, session) {
  if (name === 'searchCustomerByName') {
    const allCustomers = await getCachedCustomers()
    const results      = searchCustomersByName(allCustomers, args.query)
    session._searchCandidates = results
    setSession(session.sessionId, session)
    return JSON.stringify({
      found: results.length,
      customers: results,
      message: results.length === 0 ? 'Sin resultados' : `${results.length} coincidencia(s)`,
    })
  }

  if (name === 'confirmAndActivateCustomer') {
    const [customer, services] = await Promise.all([
      ispService.getCustomerById(args.idCustomer),
      ispService.getServicesByCustomer(args.idCustomer),
    ])
    if (!customer) return JSON.stringify({ success: false, error: 'Cliente no encontrado' })

    const activeServices = services.filter(s => s.status === 'Activo')
    // Activar sesión
    session.phase             = 'IDENTIFIED'
    session.customerId        = args.idCustomer
    session.customer          = customer
    session.services          = activeServices
    session._searchCandidates = null
    setSession(session.sessionId, session)
    return JSON.stringify({
      success: true,
      customer: { name: customer.name, lastname: customer.lastname, package: activeServices[0]?.package || 'N/A' }
    })
  }

  return JSON.stringify({ error: `Tool no disponible en fase IDENTIFYING: ${name}` })
}

async function executeSupportTool(name, args, session) {
  if (name === 'getCustomerTickets') {
    return JSON.stringify(await ispService.getTicketsByCustomer(session.customerId))
  }
  if (name === 'createTicket') {
    const idTicket = await ispService.createTicket(args)
    session._lastCreatedTicket = idTicket
    return JSON.stringify({ idTicket, success: true })
  }
  if (name === 'addTicketComment') {
    const idComment = await ispService.addComment(args)
    return JSON.stringify({ idComment, success: true })
  }
  if (name === 'getCustomerBalance') {
    return JSON.stringify(await ispService.getCustomerBalance(session.customerId))
  }
  return JSON.stringify({ error: `Tool desconocida: ${name}` })
}

// ─── Función principal ────────────────────────────────────────────────────────

/**
 * Envía un mensaje y maneja el loop completo de function calling.
 * La fase de la sesión determina qué tools y qué prompt se usan.
 */
export async function sendMessage(session, userMessage, categories) {
  const isFirst      = !session.geminiInteractionId
  const phaseAtStart = session.phase
  const isIdentifying = phaseAtStart === 'IDENTIFYING'

  const systemText = isIdentifying
    ? buildIdentifyingSystemPrompt()
    : buildIdentifiedSystemPrompt(session, categories)

  const tools = isIdentifying ? identificationTools : supportTools

  const baseParams = {
    model:              GEMINI_MODEL,
    tools,
    system_instruction: systemText,
  }

  let interaction = await genai.interactions.create({
    ...baseParams,
    ...(isFirst ? {} : { previous_interaction_id: session.geminiInteractionId }),
    input: userMessage,
  })
  session.geminiInteractionId = interaction.id

  // Loop de function calling (máx. 5 iteraciones)
  for (let i = 0; i < 5; i++) {
    const calls = extractFunctionCalls(interaction.outputs)
    if (calls.length === 0) break

    const toolResults = []
    for (const call of calls) {
      const result = session.phase === 'IDENTIFYING'
        ? await executeIdentifyingTool(call.name, call.arguments, session)
        : await executeSupportTool(call.name, call.arguments, session)
      toolResults.push({
        type: 'function_result',
        call_id: call.id,
        name: call.name,
        result,
      })
    }

    // Enviar resultados de vuelta a Gemini
    // Según el SDK v1.52.0, los tool results se envían como input de tipo FunctionResultContent
    interaction = await genai.interactions.create({
      model:                    GEMINI_MODEL,
      previous_interaction_id:  session.geminiInteractionId,
      input:                    toolResults,
      tools,
      system_instruction:       systemText,
    })
    session.geminiInteractionId = interaction.id

    // Si la sesión se activó en este loop, el siguiente turn usará otro prompt
    if (session.phase !== phaseAtStart) break
  }

  const replyText         = extractText(interaction.outputs)
  const lastCreatedTicket = session._lastCreatedTicket ?? null
  delete session._lastCreatedTicket

  return { replyText, lastCreatedTicket }
}
