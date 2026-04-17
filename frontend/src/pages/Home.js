import { state } from '../services/state.js';
import { fetchProducts, sendChatMessage, addToCart } from '../services/api_v2.js';
import { renderHeader } from '../components/Header.js';
import { renderHero } from '../components/Hero.js';
import { renderChatbot } from '../components/Chatbot.js';
import { navigate } from '../services/navigation.js';

// Price range options shown in the filter bar
const PRICE_RANGES = [
  { label: 'All Prices', min: null, max: null },
  { label: 'Under ₹500',  min: null, max: 500 },
  { label: '₹500–₹1000',  min: 500,  max: 1000 },
  { label: '₹1000–₹2000', min: 1000, max: 2000 },
  { label: '₹2000–₹5000', min: 2000, max: 5000 },
  { label: 'Above ₹5000', min: 5000, max: null },
];

export async function renderHome() {
  try {
    const { min, max } = state.priceFilter;
    const data = await fetchProducts(state.currentCategory, min, max);
    state.products = data.products || [];

    document.getElementById('app').innerHTML = `
    ${renderHeader()}
    <main>
      ${renderHero()}
      <section class="products-section">
        <div class="container">
          <h2 class="section-title">Exclusive Collection</h2>
          
          <div class="price-filter-bar" id="price-filter-container">
            ${PRICE_RANGES.map((r, i) => {
              const isActive = state.priceFilter.min === r.min && state.priceFilter.max === r.max;
              return `<button
                class="price-filter-btn ${isActive ? 'active' : ''}"
                data-min="${r.min ?? ''}"
                data-max="${r.max ?? ''}"
              >${r.label}</button>`;
            }).join('')}
          </div>

          <div class="products-grid">
            ${state.products.length === 0
              ? `<div style="grid-column:1/-1;text-align:center;padding:100px 0;background:rgba(255,255,255,0.02);border-radius:2rem;border:1px dashed rgba(255,255,255,0.1)">
                  <div style="font-size:3rem;margin-bottom:1rem;">🔍</div>
                  <h3 style="color:#fff;font-size:1.5rem;font-weight:700;margin-bottom:0.5rem;">No matches found</h3>
                  <p style="color:#94a3b8">Try adjusting your price filters or category.</p>
                 </div>`
              : state.products.map(p => `
                <div class="product-card" data-id="${p.id}">
                  <div class="product-image">
                    ${p.images && p.images.length > 0
                      ? `<img src="${p.images[0]}" alt="${p.title || p.brand}" loading="lazy" />`
                      : `<div class="product-placeholder">L&L</div>`}
                    <div style="position:absolute;top:1rem;right:1rem;z-index:10;">
                       <span class="product-category">${p.gender || 'unisex'}</span>
                    </div>
                  </div>
                  <div class="product-info">
                    <h3 class="product-name">${p.title || p.brand}</h3>
                    <p class="product-desc">${p.description || ''}</p>
                    <div class="product-footer">
                      <span class="product-price">₹${p.price}</span>
                      <button class="add-to-cart-btn btn-primary" data-id="${p.id}" style="width:auto;padding:0.6rem 1rem;margin:0;">
                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
              `).join('')}
          </div>
        </div>
      </section>
    </main>
    ${renderChatbot()}
  `;

    setupHomeEvents();
  } catch (err) {
    console.error("Home View Crash:", err);
    document.getElementById('app').innerHTML = `
      ${renderHeader()}
      <div class="container" style="padding:10rem 2rem;text-align:center;">
        <div style="font-size:4rem;margin-bottom:1.5rem;">🚧</div>
        <h2 style="color:#fff;font-size:2rem;font-weight:700;margin-bottom:1rem;">Failed to load Store</h2>
        <p style="color:#94a3b8;margin-bottom:0.5rem;">We had trouble connecting to the inventory server.</p>
        <p style="color:#ef4444;font-family:monospace;font-size:0.85rem;margin-bottom:2rem;opacity:0.8;">Error: ${err.message || err}</p>
        <button onclick="location.reload()" class="btn btn-primary">Retry Loading</button>
      </div>
    `;
  }
}

/** Called by navbar buttons and inline onclick attributes */
window.handleCatClick = async function(cat) {
  state.currentCategory = cat;
  state.priceFilter = { min: null, max: null }; // reset price filter on category change
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderHome();
};

function setupHomeEvents() {
  // Highlight active nav button
  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.toLowerCase() === (state.currentCategory || 'all')) {
      btn.classList.add('active');
    }
  });

  // Price filter buttons
  document.querySelectorAll('#price-filter-container .price-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const min = btn.dataset.min !== '' ? Number(btn.dataset.min) : null;
      const max = btn.dataset.max !== '' ? Number(btn.dataset.max) : null;
      state.priceFilter = { min, max };
      renderHome();
    });
  });

  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', async (e) => {
      if (e.target.closest('.add-to-cart-btn')) {
        e.stopPropagation();
        const buyBtn = e.target.closest('.add-to-cart-btn');
        
        try {
          const product = state.products.find(p => String(p.id) === String(card.dataset.id)) || { title: 'Unknown Product' };
          buyBtn.disabled = true;
          buyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spinning"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>';
          
          await addToCart(product.id, 1);
          
          state.cartItemCount++;
          buyBtn.innerHTML = '✅';
          buyBtn.style.background = '#22c55e';
          
          // Update cart badge in header without full re-render
          const cartBadge = document.querySelector('.cart-badge');
          if (cartBadge) {
            cartBadge.textContent = state.cartItemCount;
          } else {
            const cartBtn = document.getElementById('cartBtn');
            if (cartBtn) {
              cartBtn.innerHTML += `<span class="cart-badge">${state.cartItemCount}</span>`;
            }
          }
          
          setTimeout(() => {
            buyBtn.disabled = false;
            buyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>';
            buyBtn.style.background = '';
          }, 1500);
        } catch (err) {
          console.error('Failed to add to cart:', err);
          buyBtn.disabled = false;
          buyBtn.innerHTML = '❌';
        }
      } else {
        navigate(`#/product/${card.dataset.id}`);
      }
    });
  });

  // Chatbot toggle
  document.getElementById('chatToggle')?.addEventListener('click', () => {
    state.chatOpen = !state.chatOpen;
    renderHome();
  });

  document.getElementById('chatSend')?.addEventListener('click', handleChatSend);
  document.getElementById('chatInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChatSend();
  });

  document.querySelectorAll('.product-recommendation').forEach(el => {
    el.addEventListener('click', (e) => {
       e.stopPropagation();
       navigate(`#/product/${el.dataset.id}`);
    });
  });
}

async function handleChatSend() {
  const input = document.getElementById('chatInput');
  const chatVal = input.value;
  if (!chatVal) return;

  state.chatMessages = [...state.chatMessages, { sender: 'user', text: chatVal }];
  state.chatLoading = true;
  renderHome();

  try {
    const data = await sendChatMessage(chatVal);
    state.chatMessages = [...state.chatMessages, {
      sender: 'bot',
      type: data.type || 'text',
      data: data.data,
      message: data.message || data.detail || 'An unexpected error occurred.'
    }];
  } catch (err) {
    console.error(err);
    state.chatMessages = [...state.chatMessages, {
      sender: 'bot',
      type: 'text',
      message: "I'm having a bit of trouble connecting to my brain. Please try again in a moment!"
    }];
  } finally {
    state.chatLoading = false;
    state.chatInput = '';
    renderHome();
    
    // Scroll to bottom of chat
    const msgContainer = document.getElementById('chatMessages');
    if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
  }
}
