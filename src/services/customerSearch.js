import { CUSTOMER_SEARCH_MAX_RESULTS } from '../config/env.js'

//Manejo de strings para normalizar busquedas que sean inputs de usuario
function normalize(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // é→e, ñ→n, ü→u
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
}

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
