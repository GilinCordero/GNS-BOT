/**
 * Global in-memory cache for categories and customers.
 * Uses node-cache with TTL to automatically refresh data from ISP service.
 * Provides functions to get cached data, which will fetch fresh data if cache is expired.
 */

import NodeCache from 'node-cache'
import { CATEGORIES_TTL_SECONDS, CUSTOMERS_TTL_SECONDS } from '../config/env.js'
import { getCategories, getAllCustomers } from '../services/ispService.js'

const cache = new NodeCache({ useClones: false })

export async function initGlobalCache() {
  try {
    const [cats, customers] = await Promise.all([getCategories(), getAllCustomers()])
    cache.set('categories', cats,      CATEGORIES_TTL_SECONDS)
    cache.set('customers',  customers, CUSTOMERS_TTL_SECONDS)
    console.log(`[cache] Categorías: ${cats.length} | Clientes: ${customers.length}`)
  } catch (err) {
    console.error('[cache] Error en carga inicial:', err.message)
  }
}

export async function getCachedCategories() {
  let data = cache.get('categories')
  if (!data) { data = await getCategories(); cache.set('categories', data, CATEGORIES_TTL_SECONDS) }
  return data
}

export async function getCachedCustomers() {
  let data = cache.get('customers')
  if (!data) { data = await getAllCustomers(); cache.set('customers', data, CUSTOMERS_TTL_SECONDS) }
  return data
}
