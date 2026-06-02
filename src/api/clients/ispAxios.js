import axios from 'axios'
import { GNS_BASE_URL, GNS_API_USER, GNS_API_PASS } from '../../config/env.js'

const credentials = Buffer.from(`${GNS_API_USER}:${GNS_API_PASS}`).toString('base64')

const ispAxios = axios.create({
  baseURL: GNS_BASE_URL,
  headers: {
    'Authorization': `Basic ${credentials}`,
    'Content-Type':  'application/json',
  },
  timeout: 10000,
})

ispAxios.interceptors.response.use(
  (res) => res,
  (err) => {
    const status  = err.response?.status || 500
    const message = err.response?.data?.message || err.message
    const error   = new Error(`GNS API ${status}: ${message}`)
    error.statusCode = status
    return Promise.reject(error)
  }
)

export default ispAxios
