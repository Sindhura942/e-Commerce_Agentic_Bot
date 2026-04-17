import { state } from '../services/state.js';

export function renderChatbot() {
  const { chatOpen, chatLoading, chatMessages, chatInput } = state;
  return `
  <div class="chatbot-container">
    <button id="chatToggle" class="chatbot-toggle" title="Chat with AI">
      ${chatOpen
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`}
    </button>
    ${chatOpen ? `
    <div class="chatbot-window">
      <div class="chatbot-header">
        <div class="chatbot-header-avatar">✦</div>
        <div>
          <p class="chatbot-header-name">LOOM & LUMEN Stylist</p>
          <p class="chatbot-header-status">● Online</p>
        </div>
      </div>
      <div class="chatbot-messages" id="chatMessages">
        ${chatMessages.length === 0 ? `
          <div class="chatbot-welcome">
            <div class="chatbot-welcome-icon">✦</div>
            <p>Hi! I'm your LOOM & LUMEN personal stylist. Ask me to find products, recommend outfits, or help you discover something new!</p>
          </div>
        ` : ''}
        ${chatMessages.map(msg => {
          if (msg.sender === 'user') {
            return `
            <div class="message message-user">
              <p>${msg.text}</p>
            </div>
            `;
          } else if (msg.type === 'text') {
            return `
            <div class="message message-bot">
              <p>${msg.message}</p>
            </div>
            `;
          } else if (msg.type === 'products') {
            return `
            <div class="message message-bot">
              ${msg.message ? `<p class="message-intro">${msg.message}</p>` : ''}
              ${msg.data && msg.data.length === 0 ? '<p class="message-empty">No products found 😢</p>' : ''}
              ${msg.data && msg.data.length > 0 ? `
              <div class="message-products">
                ${msg.data.map(p => `
                <div class="product-recommendation" data-id="${p.id}">
                  <img src="${p.images?.[0] || p.image}" alt="${p.title || p.name}" />
                  <p class="rec-name">${p.title || p.name}</p>
                  <p class="rec-price">₹${p.price}</p>
                </div>
                `).join('')}
              </div>
              ` : ''}
            </div>
            `;
          }
          return '';
        }).join('')}
        ${chatLoading ? '<div class="chatbot-typing"><span></span><span></span><span></span></div>' : ''}
      </div>
      <div class="chatbot-input-row">
        <input type="text" id="chatInput" value="${chatInput}" placeholder="Ask about products, styles..." class="chatbot-input-field" />
        <button id="chatSend" class="chatbot-send-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
    ` : ''}
  </div>
`;
}
