import NodeCache from 'node-cache'
import { SESSION_TTL_SECONDS } from '../config/env.js'

const store = new NodeCache({ stdTTL: SESSION_TTL_SECONDS, checkperiod: 120, useClones: false })

const key = (id) => `session:${id}`

export const setSession     = (id, data) => store.set(key(id), data)
export const getSession     = (id)       => store.get(key(id)) ?? null
export const deleteSession  = (id)       => store.del(key(id))
export const refreshSession = (id)       => store.ttl(key(id), SESSION_TTL_SECONDS)
