import { styles } from './styles.js'

const ICONS = {
  chat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
}

export function createUI(shadow, { theme, position, agentName, onSend, onReconnect }) {
  const container = document.createElement('div')
  container.className = `widget-container widget-container--${position || 'bottom-right'}`

  // Trigger button
  const triggerBtn = document.createElement('button')
  triggerBtn.className = 'chat-trigger-btn'
  triggerBtn.innerHTML = ICONS.chat
  triggerBtn.setAttribute('aria-label', 'Abrir chat')

  // Chat panel
  const panel = document.createElement('div')
  panel.className = 'chat-panel chat-panel--hidden'

  // Header
  const header = document.createElement('div')
  header.className = 'chat-header'
  header.innerHTML = `
    <div class="agent-avatar">${(agentName || 'S').charAt(0)}</div>
    <div class="agent-info">
      <div class="agent-name">${agentName || 'Genesis'}</div>
      <span class="agent-status">En línea</span>
    </div>
    <button class="close-btn" aria-label="Cerrar chat">${ICONS.close}</button>
  `

  // Messages area
  const messagesArea = document.createElement('div')
  messagesArea.className = 'chat-messages'

  // Typing indicator
  const typing = document.createElement('div')
  typing.className = 'chat-typing chat-typing--hidden'
  typing.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`

  // Input area
  const inputArea = document.createElement('div')
  inputArea.className = 'chat-input-area'
  const input = document.createElement('input')
  input.className = 'chat-input'
  input.type = 'text'
  input.placeholder = 'Conectando...'
  input.disabled = true
  input.setAttribute('aria-label', 'Mensaje')
  const sendBtn = document.createElement('button')
  sendBtn.className = 'send-btn'
  sendBtn.innerHTML = ICONS.send
  sendBtn.disabled = true
  sendBtn.setAttribute('aria-label', 'Enviar')
  inputArea.append(input, sendBtn)

  panel.append(header, messagesArea, typing, inputArea)
  container.append(triggerBtn, panel)

  // Shadow DOM styles
  const styleEl = document.createElement('style')
  styleEl.textContent = styles
  shadow.append(styleEl, container)

  // State
  let isOpen = false
  let isSending = false

  function togglePanel() {
    isOpen = !isOpen
    panel.classList.toggle('chat-panel--hidden', !isOpen)
    triggerBtn.setAttribute('aria-label', isOpen ? 'Cerrar chat' : 'Abrir chat')
    if (isOpen) input.focus()
  }

  function addMessage(text, sender) {
    const msg = document.createElement('div')
    msg.className = `message message--${sender}`
    msg.textContent = text
    messagesArea.appendChild(msg)
    messagesArea.scrollTop = messagesArea.scrollHeight
    return msg
  }

  function showError(text, withReconnect = false) {
    const msg = document.createElement('div')
    msg.className = 'message message--error'
    msg.innerHTML = text
    if (withReconnect) {
      const btn = document.createElement('button')
      btn.className = 'reconnect-btn'
      btn.textContent = 'Reconectar'
      btn.onclick = () => { onReconnect?.(); msg.remove() }
      msg.appendChild(document.createElement('br'))
      msg.appendChild(btn)
    }
    messagesArea.appendChild(msg)
    messagesArea.scrollTop = messagesArea.scrollHeight
  }

  function setTyping(show) {
    typing.classList.toggle('chat-typing--hidden', !show)
    if (show) messagesArea.scrollTop = messagesArea.scrollHeight
  }

  function setInputEnabled(enabled) {
    input.disabled = !enabled
    sendBtn.disabled = !enabled
    input.placeholder = enabled ? 'Escribe tu mensaje...' : 'Conectando...'
    isSending = !enabled
  }

  async function handleSend() {
    const text = input.value.trim()
    if (!text || isSending) return
    addMessage(text, 'user')
    input.value = ''
    setInputEnabled(false)
    setTyping(true)
    try {
      const response = await onSend(text)
      setTyping(false)
      addMessage(response.reply, 'bot')
      if (response.ticketCreated) {
        addMessage(`📋 Ticket creado: #${response.ticketCreated.idTicket}`, 'bot')
      }
    } catch (err) {
      setTyping(false)
      if (err.status === 401) {
        showError('Tu sesión expiró.', true)
      } else {
        showError(err.message || 'Error de conexión. Intenta de nuevo.', true)
      }
    } finally {
      setInputEnabled(true)
      input.focus()
    }
  }

  let ui

  // Event listeners
  triggerBtn.addEventListener('click', () => ui.togglePanel())
  header.querySelector('.close-btn').addEventListener('click', () => ui.togglePanel())
  sendBtn.addEventListener('click', handleSend)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend()
  })

  ui = {
    addMessage,
    showError,
    setTyping,
    setInputEnabled,
    togglePanel,
    isOpen: () => isOpen,
  }

  return ui
}
