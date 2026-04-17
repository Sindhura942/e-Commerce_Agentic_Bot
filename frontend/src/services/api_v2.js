// Base URL for FastAPI backend
export const API_BASE = window.location.origin + "/api";

/* ─────────────────────────────
   PRODUCTS
───────────────────────────── */

/**
 * Fetch products with optional filters
 */
export async function fetchProducts(category = '', minPrice = null, maxPrice = null) {
  const params = new URLSearchParams();

  if (category) {
    if (category.toLowerCase() === 'all') params.delete('gender');
    else params.set('gender', category);
  }
  if (minPrice !== null) params.set('min_price', minPrice);
  if (maxPrice !== null) params.set('max_price', maxPrice);

  const query = params.toString() ? `?${params.toString()}` : '';

  // Rigorous trailing slash before query params
  const res = await fetch(`${API_BASE}/products/${query}`);
  return await res.json();
}

/**
 * Add product
 */
export async function addProduct(formData) {
  const res = await fetch(`${API_BASE}/products/`, {
    method: 'POST',
    body: formData
  });

  return await res.json();
}

/**
 * Update product
 */
export async function updateProduct(id, body, isFormData = false) {
  const res = await fetch(`${API_BASE}/products/${id}/`, {
    method: 'PUT',
    headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
    body: isFormData ? body : JSON.stringify(body)
  });

  return await res.json();
}

/**
 * Delete single product
 */
export async function deleteProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}/`, {
    method: 'DELETE'
  });

  return await res.json();
}

/**
 * Delete all products
 */
export async function deleteAllProducts() {
  const res = await fetch(`${API_BASE}/products/`, {
    method: 'DELETE'
  });

  return await res.json();
}

/**
 * Bulk generate products
 */
export async function bulkGenerateProducts() {
  const res = await fetch(`${API_BASE}/products/bulk-generate/`, {
    method: 'POST'
  });

  return await res.json();
}

/* ─────────────────────────────
   CHATBOT
───────────────────────────── */

export async function sendChatMessage(message) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  return await res.json();
}

/* ─────────────────────────────
   CART
───────────────────────────── */

export async function addToCart(productId, quantity = 1) {
  const res = await fetch(`${API_BASE}/cart/add`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product_id: productId,
      quantity
    })
  });

  return await res.json();
}

export async function getCart() {
  const res = await fetch(`${API_BASE}/cart/`, { credentials: 'same-origin' });
  return await res.json();
}

export async function clearCart() {
  const res = await fetch(`${API_BASE}/cart/`, {
    method: 'DELETE',
    credentials: 'same-origin'
  });

  return await res.json();
}

/* ─────────────────────────────
   ORDERS
───────────────────────────── */

export async function checkout(shippingData) {
  const res = await fetch(`${API_BASE}/orders/checkout/`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      shipping: shippingData
    })
  });

  return await res.json();
}