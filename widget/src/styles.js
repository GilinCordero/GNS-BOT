export const styles = `
  :host {
    --primary: #044132;
    --primary-light: #065a45;
    --secondary: #ffffff;
    --bg: #f5f5f5;
    --text: #333333;
    --text-light: #666666;
    --border: #e0e0e0;
    --error: #d32f2f;
    --success: #2e7d32;
    --radius: 16px;
    --shadow: 0 4px 20px rgba(0,0,0,0.15);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .widget-container {
    position: fixed;
    z-index: 9999;
  }

  .widget-container--bottom-right {
    bottom: 20px;
    right: 20px;
  }

  .widget-container--bottom-left {
    bottom: 20px;
    left: 20px;
  }

  .chat-trigger-btn {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    background: var(--primary);
    color: var(--secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow);
    transition: transform 0.2s, background 0.2s;
  }

  .chat-trigger-btn:hover {
    transform: scale(1.05);
    background: var(--primary-light);
  }

  .chat-trigger-btn svg {
    width: 28px;
    height: 28px;
  }

  .chat-panel {
    width: 360px;
    height: 520px;
    background: var(--secondary);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: absolute;
    bottom: 72px;
    right: 0;
    transition: opacity 0.2s, transform 0.2s;
  }

  .widget-container--bottom-left .chat-panel {
    right: auto;
    left: 0;
  }

  .chat-panel--hidden {
    opacity: 0;
    pointer-events: none;
    transform: translateY(10px);
  }

  .chat-header {
    background: var(--primary);
    color: var(--secondary);
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .agent-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
  }

  .agent-info {
    flex: 1;
  }

  .agent-name {
    font-weight: 600;
    font-size: 15px;
  }

  .agent-status {
    font-size: 12px;
    opacity: 0.85;
  }

  .agent-status::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4caf50;
    margin-right: 6px;
  }

  .close-btn {
    background: none;
    border: none;
    color: var(--secondary);
    cursor: pointer;
    padding: 4px;
    opacity: 0.8;
    transition: opacity 0.2s;
  }

  .close-btn:hover {
    opacity: 1;
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .message {
    max-width: 85%;
    padding: 10px 14px;
    border-radius: 14px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
  }

  .message--bot {
    align-self: flex-start;
    background: var(--bg);
    color: var(--text);
    border-bottom-left-radius: 4px;
  }

  .message--user {
    align-self: flex-end;
    background: var(--primary);
    color: var(--secondary);
    border-bottom-right-radius: 4px;
  }

  .message--error {
    align-self: center;
    background: #ffebee;
    color: var(--error);
    font-size: 13px;
    text-align: center;
  }

  .chat-typing {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 10px 14px;
    align-self: flex-start;
  }

  .chat-typing--hidden {
    display: none;
  }

  .typing-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--text-light);
    animation: typingBounce 1.4s infinite ease-in-out both;
  }

  .typing-dot:nth-child(1) { animation-delay: -0.32s; }
  .typing-dot:nth-child(2) { animation-delay: -0.16s; }

  @keyframes typingBounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }

  .chat-input-area {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid var(--border);
  }

  .chat-input {
    flex: 1;
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 10px 16px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  }

  .chat-input:focus {
    border-color: var(--primary);
  }

  .chat-input:disabled {
    background: var(--bg);
    cursor: not-allowed;
  }

  .send-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: var(--primary);
    color: var(--secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }

  .send-btn:hover:not(:disabled) {
    background: var(--primary-light);
  }

  .send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .reconnect-btn {
    background: var(--primary);
    color: var(--secondary);
    border: none;
    border-radius: 20px;
    padding: 8px 20px;
    font-size: 13px;
    cursor: pointer;
    margin-top: 8px;
  }

  @media (max-width: 480px) {
    .chat-panel {
      width: calc(100vw - 40px);
      height: calc(100vh - 100px);
      bottom: 72px;
    }
  }
`;
