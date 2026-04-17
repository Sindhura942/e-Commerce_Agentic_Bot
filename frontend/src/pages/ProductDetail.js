import { state } from '../services/state.js';
import { fetchProducts, addToCart } from '../services/api_v2.js';
import { renderHeader } from '../components/Header.js';
import { renderChatbot } from '../components/Chatbot.js';

export async function renderProductDetail(id) {
  // Load products if not available
  if (state.products.length === 0) {
    const data = await fetchProducts();
    state.products = data.products || [];
  }
  
  const product = state.products.find(p => String(p.id) === String(id));
  
  if (!product) {
    document.getElementById('app').innerHTML = `
      ${renderHeader()}
      <div class="container" style="padding: 10rem 2rem; text-align: center;">
        <h1 style="color: #fff; font-size: 2.5rem; margin-bottom: 1rem;">Product Not Found</h1>
        <p style="color: #94a3b8; margin-bottom: 2rem;">The item you're looking for might have been removed or doesn't exist.</p>
        <a href="#/" class="btn btn-primary" style="text-decoration: none;">Back to Collection</a>
      </div>
    `;
    return;
  }

  document.getElementById('app').innerHTML = `
    ${renderHeader()}
    <main class="product-detail">
      <div class="container">
        <button onclick="window.location.hash='#/'" class="back-btn" style="background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:0.5rem;font-family:inherit;transition:all 0.2s;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to Shop
        </button>

        <div class="product-detail-grid">
          <div class="product-detail-image">
            <img src="${product.images?.[0]}" alt="${product.title || product.brand}" />
          </div>
          
          <div class="product-detail-info">
            <span class="product-detail-category">${product.gender || 'unisex'}</span>
            <h1>${product.title || product.brand}</h1>
            <p class="product-detail-price">₹${product.price}</p>
            <div class="product-detail-desc">${product.description}</div>
            
            <div style="margin-bottom: 2.5rem;">
               <div class="option-group">
                 <span class="option-label">Select Size</span>
                 <div class="option-values">
                    <span class="option-value">S</span>
                    <span class="option-value">M</span>
                    <span class="option-value">L</span>
                    <span class="option-value">XL</span>
                 </div>
               </div>
            </div>

            <div class="detail-actions">
              <button id="detailAddToCart" class="btn btn-primary" style="flex: 2; padding: 1.25rem; font-size: 1.1rem; gap: 0.75rem;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                Add to Cart
              </button>
              <button class="icon-btn" style="width: 4rem; height: 4rem; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05);">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </button>
            </div>

            <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.05); display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;">
               <div style="display: flex; gap: 1rem; align-items: center;">
                  <div style="width: 2.5rem; height: 2.5rem; border-radius: 50%; background: rgba(59, 130, 246, 0.1); color: #3b82f6; display: flex; align-items: center; justify-content: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                  </div>
                  <div>
                    <p style="color: #fff; font-size: 0.85rem; font-weight: 700; margin: 0;">Free Shipping</p>
                    <p style="color: #94a3b8; font-size: 0.75rem; margin: 0;">On orders over ₹2000</p>
                  </div>
               </div>
               <div style="display: flex; gap: 1rem; align-items: center;">
                  <div style="width: 2.5rem; height: 2.5rem; border-radius: 50%; background: rgba(139, 92, 246, 0.1); color: #8b5cf6; display: flex; align-items: center; justify-content: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  </div>
                  <div>
                    <p style="color: #fff; font-size: 0.85rem; font-weight: 700; margin: 0;">Secure Payment</p>
                    <p style="color: #94a3b8; font-size: 0.75rem; margin: 0;">100% encryption</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    ${renderChatbot()}
  `;

  // Add event listeners
  document.getElementById('detailAddToCart')?.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    try {
      btn.disabled = true;
      btn.innerHTML = 'Adding...';
      await addToCart(product.id, 1);
      state.cartItemCount++;
      btn.innerHTML = 'Added to Cart! ✅';
      btn.style.background = '#22c55e';
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg> Add to Cart`;
        btn.style.background = '';
      }, 2000);
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = 'Failed to Add ❌';
    }
  });

  // Size selection
  document.querySelectorAll('.option-value').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.option-value').forEach(o => o.style.borderColor = '');
      opt.style.borderColor = '#3b82f6';
      opt.style.background = 'rgba(59, 130, 246, 0.1)';
    });
  });

  // Toggle chatbot
  document.getElementById('chatToggle')?.addEventListener('click', () => {
    state.chatOpen = !state.chatOpen;
    renderProductDetail(id);
  });
}
