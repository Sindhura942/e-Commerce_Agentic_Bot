import { state } from '../services/state.js';
import { getCart, clearCart } from '../services/api_v2.js';
import { renderHeader } from '../components/Header.js';

export async function renderCart() {
  document.getElementById('app').innerHTML = `
    ${renderHeader()}
    <div style="max-width: 860px; margin: 0 auto; padding: 3rem 1.5rem;">
      <div style="margin-bottom: 2.5rem;">
        <button onclick="window.location.hash='#/'" style="background:none;border:none;color:#94a3b8;cursor:pointer;display:flex;align-items:center;gap:0.5rem;font-family:inherit;font-size:0.95rem;margin-bottom:1.5rem;transition:color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to Shop
        </button>
        <h1 style="font-size:2.5rem;font-weight:800;background:linear-gradient(to right,#fff,#94a3b8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Your Cart</h1>
      </div>
      <div id="cartContent">
        <div style="text-align:center;padding:4rem;color:#64748b;">
          <div style="font-size:2rem;margin-bottom:1rem;">⏳</div>
          <p>Loading your cart...</p>
        </div>
      </div>
    </div>
  `;

  try {
    const cartData = await getCart();
    const cartItems = cartData.items || [];
    const total = cartData.total || 0;

    const contentDiv = document.getElementById('cartContent');

    if (!cartItems.length) {
      contentDiv.innerHTML = `
        <div style="text-align:center;padding:5rem 2rem;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:1.5rem;backdrop-filter:blur(16px);">
          <div style="font-size:5rem;margin-bottom:1.5rem;">🛒</div>
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;margin-bottom:0.75rem;">Your cart is empty</h2>
          <p style="color:#94a3b8;margin-bottom:2rem;">Looks like you haven't added anything yet.</p>
          <a href="#/" class="btn btn-primary" style="text-decoration:none;display:inline-flex;padding:0.9rem 2.5rem;font-size:1.05rem;">
            Explore Collection
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left:8px"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      `;
      state.cartItemCount = 0;
      return;
    }


    state.cartItemCount = cartItems.length;

    contentDiv.innerHTML = `
      <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:1.5rem;backdrop-filter:blur(16px);padding:2rem;margin-bottom:2rem;">
        <div style="display:flex;flex-direction:column;gap:0;">
          ${cartItems.map((item, i) => `
            <div style="display:flex;gap:1.5rem;align-items:center;padding:1.5rem 0;${i !== cartItems.length - 1 ? 'border-bottom:1px solid rgba(255,255,255,0.05);' : ''}">
              <div style="width:90px;height:90px;border-radius:0.875rem;overflow:hidden;flex-shrink:0;background:#1e1e24;">
                <img src="${item.product.images?.[0]}" alt="${item.product.title}" style="width:100%;height:100%;object-fit:cover;" />
              </div>
              <div style="flex:1;">
                <h3 style="font-weight:700;font-size:1.1rem;color:#fff;margin-bottom:0.25rem;">${item.product.title || item.product.brand}</h3>
                <p style="color:#64748b;font-size:0.9rem;">Qty: ${item.quantity}</p>
              </div>
              <div style="font-weight:800;font-size:1.2rem;color:#fff;white-space:nowrap;">₹${item.product.price}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:1.5rem;backdrop-filter:blur(16px);padding:2rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
          <span style="color:#94a3b8;font-size:1rem;">Subtotal</span>
          <span style="color:#fff;font-size:1rem;">₹${total}</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,0.06);">
          <span style="font-size:1.25rem;font-weight:700;color:#fff;">Total</span>
          <span style="font-size:1.75rem;font-weight:800;background:linear-gradient(135deg,#8b5cf6,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">₹${total}</span>
        </div>
        <div style="display:flex;gap:1rem;flex-wrap:wrap;">
          <a href="#/" class="btn btn-outline" style="flex:1;min-width:130px;text-align:center;text-decoration:none;padding:0.85rem 1.5rem;">Keep Shopping</a>
          <button id="clearCartBtn" style="flex:1;min-width:130px;padding:0.85rem 1.5rem;border-radius:0.5rem;background:rgba(239,68,68,0.1);color:#f87171;border:1px solid rgba(239,68,68,0.25);font-family:inherit;font-weight:600;font-size:0.95rem;cursor:pointer;transition:all 0.3s;" onmouseover="this.style.background='rgba(239,68,68,0.2)'" onmouseout="this.style.background='rgba(239,68,68,0.1)'">
            Clear Cart 🗑️
          </button>
          <button id="buyAllBtn" class="btn btn-primary" style="flex:2;min-width:180px;padding:0.85rem 1.5rem;font-size:1.05rem;">
            <span>Place Order 🚀</span>
          </button>
        </div>
      </div>
    `;

    document.getElementById('clearCartBtn')?.addEventListener('click', async (e) => {
      if (!confirm('Are you sure you want to clear your cart?')) return;
      const btn = e.target.closest('button');
      btn.disabled = true;
      btn.innerHTML = 'Clearing... ⏳';
      try {
        await clearCart();
        state.cartItemCount = 0;
        renderCart();
      } catch (err) {
        alert('Failed to clear cart.');
        btn.disabled = false;
        btn.innerHTML = 'Clear Cart 🗑️';
      }
    });

    document.getElementById('buyAllBtn')?.addEventListener('click', async (e) => {
      const btn = e.target.closest('button');
      btn.disabled = true;
      btn.innerHTML = `<span>Processing... ⏳</span>`;
      try {
        const mockShipping = {
          full_name: "Demo User",
          email: "demo@example.com",
          address: "123 Commerce St",
          city: "Tech City",
          zip_code: "12345",
          country: "USA"
        };
        await import('../services/api_v2.js').then(m => m.checkout(mockShipping));
        state.cartItemCount = 0;
        btn.innerHTML = `<span>Order Placed! 🎉</span>`;
        btn.style.background = 'linear-gradient(135deg, #16a34a, #15803d)';
        setTimeout(() => { window.location.hash = '#/'; }, 2000);
      } catch(err) {
        alert('Failed to process order.');
        btn.disabled = false;
        btn.innerHTML = `<span>Place Order 🚀</span>`;
      }
    });

  } catch(err) {
    document.getElementById('cartContent').innerHTML = `
      <div style="text-align:center;padding:3rem;color:#f87171;background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.1);border-radius:1rem;">
        <p>⚠️ Error loading cart. Please try again.</p>
      </div>
    `;
  }
}
