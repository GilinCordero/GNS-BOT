import { CUSTOMER_SEARCH_MAX_RESULTS } from '../config/env.js'

/**
 * Normaliza para búsqueda insensible a mayúsculas, tildes y caracteres especiales.
 * Maneja el caso donde GNS almacena nombres en MAYÚSCULAS.
 */
function normalize(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // é→e, ñ→n, ü→u
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
}

/**
 * Busca clientes por nombre en la lista cacheada.
 *
 * Lógica:
 *   - Divide el query en tokens ("jose ramirez" → ["jose", "ramirez"])
 *   - Un cliente hace match si TODOS los tokens aparecen en su nombre completo
 *   - Ejemplos:
 *       "ninive"        → matches "NINIVE ESTEVE SILLER" ✓
 *       "jose ramirez"  → matches "JOSÉ RAMÍREZ ROMERO" ✓
 *       "jose"          → puede devolver múltiples → Gemini pide apellido
 *
 * @returns Array de máximo CUSTOMER_SEARCH_MAX_RESULTS elementos,
 *          solo con los campos necesarios para identificación (sin datos sensibles completos)
 */
export function searchCustomersByName(customers, query) {
  if (!query || query.trim().length < 2) return []

  const tokens = normalize(query).split(/\s+/).filter(t => t.length >= 2)
  if (tokens.length === 0) return []

  const matches = customers.filter(c => {
    const fullName = normalize(`${c.name} ${c.lastname}`)
    return tokens.every(token => fullName.includes(token))
  })

  return matches.slice(0, CUSTOMER_SEARCH_MAX_RESULTS).map(c => ({
    idCustomer:      c.idCustomer,
    name:            c.name,
    lastname:        c.lastname,
    contract_number: c.contract_number,
    city:            c.city,
    phone_hint:      String(c.phone_number || '').slice(-4), // últimos 4 dígitos únicamente
    active:          c.active,
  }))
}
