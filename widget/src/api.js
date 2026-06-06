export function createApiClient(apiUrl) {
  let sessionId = null

  async function request(path, options = {}) {
    const url = `${apiUrl}${path}`
    console.log('[widget] fetch:', url, 'sessionId:', sessionId)
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(sessionId ? { 'X-Session-Id': sessionId } : {}), //Session management
        ...options.headers,
      },
    })
    console.log('[widget] response:', url, res.status)
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error('[widget] error response:', url, res.status, text.slice(0, 200))
      let body = {}
      try { body = JSON.parse(text) } catch {}
      const err  = new Error(body.error || `HTTP ${res.status}`)
      err.status = res.status
      throw err
    }
    return res.json()
  }

  return {
    async createSession() {
      const data = await request('/api/session', { method: 'POST', body: '{}' })
      sessionId = data.sessionId
      console.log('[widget] session created:', sessionId)
      return data
    },
    async sendMessage(message) {
      return request('/api/chat', { method: 'POST', body: JSON.stringify({ message }) })
    },
    async getTickets() {
      return request('/api/tickets')
    },
    clearSession() { sessionId = null },
  }
}
