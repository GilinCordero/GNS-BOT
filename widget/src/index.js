import { createApiClient } from './api.js'
import { createUI } from './ui.js'

const ISPChatWidget = {
  init(config = {}) {
    const { apiUrl, theme, position, agentName } = config
    if (!apiUrl) throw new Error('GNSChatWidget: apiUrl es requerido')

    // Remove existing widget if any
    const existing = document.getElementById('gns-chat-shadow-host')
    if (existing) existing.remove()

    // Create shadow host
    const host = document.createElement('div')
    host.id = 'gns-chat-shadow-host'
    document.body.appendChild(host)

    const shadow = host.attachShadow({ mode: 'open' })

    // Apply theme overrides to host (ShadowRoot has no .style)
    if (theme?.primary) host.style.setProperty('--primary', theme.primary)
    if (theme?.secondary) host.style.setProperty('--secondary', theme.secondary)

    const api = createApiClient(apiUrl)
    let ui = null

    async function connect() {
      console.log('[widget] connect() started')
      try {
        const data = await api.createSession()
        console.log('[widget] connect() success:', data)
        ui.setInputEnabled(true)
      } catch (err) {
        console.error('[widget] connect() error:', err)
        ui.showError('No se pudo conectar al servidor. Intenta más tarde.', true)
      }
    }

    async function handleSend(message) {
      return api.sendMessage(message)
    }

    async function handleReconnect() {
      ui.setInputEnabled(false)
      ui.setTyping(true)
      try {
        await api.createSession()
        ui.setTyping(false)
        ui.addMessage('¡Hola de nuevo! ¿En qué puedo ayudarte?', 'bot')
        ui.setInputEnabled(true)
      } catch (err) {
        ui.setTyping(false)
        ui.showError('No se pudo reconectar. Intenta más tarde.', true)
      }
    }

    ui = createUI(shadow, {
      theme,
      position: position || 'bottom-right',
      agentName: agentName || 'Sofía',
      onSend: handleSend,
      onReconnect: handleReconnect,
    })

    // Auto-connect on first open
    let hasConnected = false
    const originalToggle = ui.togglePanel
    ui.togglePanel = function() {
      originalToggle.call(ui)
      if (ui.isOpen() && !hasConnected) {
        hasConnected = true
        connect()
      }
    }

    return { destroy: () => host.remove() }
  }
}

// Expose globally
if (typeof window !== 'undefined') {
  window.ISPChatWidget = ISPChatWidget
}
