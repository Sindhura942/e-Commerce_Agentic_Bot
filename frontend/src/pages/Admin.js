import { state, resetAdminForm } from '../services/state.js';
import { fetchProducts, addProduct, updateProduct, deleteProduct, deleteAllProducts, bulkGenerateProducts } from '../services/api_v2.js';
import { renderHeader } from '../components/Header.js';

export async function renderAdmin() {
  try {
    const data = await fetchProducts();
    state.productList = data.products || [];
    
    document.getElementById('app').innerHTML = `
    ${renderHeader()}
    <div class="admin-page">
      <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; flex-wrap: wrap; gap: 1.5rem;">
          <div>
            <h1 class="admin-title" style="text-align: left; margin: 0;">Product Inventory</h1>
            <p style="color: #94a3b8; margin-top: 0.5rem;">Manage your store's luxury collection</p>
          </div>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <button id="deleteAllBtn" class="btn" style="background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2);">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
               Wipe Store
            </button>
            <button id="bulkGenBtn" class="btn btn-primary" style="background: linear-gradient(135deg, #eab308, #ca8a04); color: #000;">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
               Generate 500 Products
            </button>
          </div>
        </div>

        <div class="admin-form glass-card" style="margin-bottom: 4rem;">
          <h2 class="admin-form-title">${state.isEditing ? '✦ Edit Product' : '✦ Add New Product'}</h2>
          <div class="form-grid">
            <div class="form-group">
               <label class="form-label">Product Name</label>
               <input placeholder="e.g. Silk Midnight Blazer" class="form-input" id="adminName" value="${state.adminForm.title || state.adminForm.name || ''}" />
            </div>
            <div class="form-group">
               <label class="form-label">Short Description</label>
               <input placeholder="e.g. A premium blend of luxury and comfort..." class="form-input" id="adminDesc" value="${state.adminForm.description}" />
            </div>
            <div class="form-group">
               <label class="form-label">Price (USD)</label>
               <input placeholder="2999" type="number" class="form-input" id="adminPrice" value="${state.adminForm.price || ''}" />
            </div>
            <div class="form-group">
               <label class="form-label">Category</label>
               <div class="category-buttons" id="adminCategoryButtons" style="margin: 0; gap: 0.5rem;">
                 ${['men', 'women', 'kids'].map(cat => `
                   <button class="category-btn ${state.adminForm.category === cat ? 'active' : ''}" data-cat="${cat}" style="padding: 0.5rem 1rem; font-size: 0.85rem;">${cat.charAt(0).toUpperCase() + cat.slice(1)}</button>
                 `).join('')}
               </div>
            </div>
            
            <div class="form-col-span" style="background: rgba(255,255,255,0.02); padding: 1.5rem; border-radius: 1rem; border: 1px solid rgba(255,255,255,0.05);">
               <label class="form-label" style="margin-bottom: 1rem;">Available Sizes</label>
               <div class="checkbox-group" style="justify-content: flex-start; gap: 2rem;">
                 ${['S', 'M', 'L', 'XL', 'XXL'].map(size => `
                   <label class="checkbox-label" style="font-weight: 600; color: ${state.adminForm.size?.includes(size) ? '#fff' : '#64748b'}">
                     <input type="checkbox" ${state.adminForm.size?.includes(size) ? 'checked' : ''} data-size="${size}" style="accent-color: #3b82f6; width: 1.2rem; height: 1.2rem;" />
                     <span>${size}</span>
                   </label>
                 `).join('')}
               </div>
            </div>

            <div class="form-group">
              <label class="form-label">Dominant Color</label>
              <input placeholder="Black, Gold, Crimson" class="form-input" id="adminColor" value="${Array.isArray(state.adminForm.color) ? state.adminForm.color.join(', ') : state.adminForm.color || ''}" />
            </div>

            <div class="form-group">
              <label class="form-label">Upload Image</label>
              <input type="file" accept="image/png, image/jpeg, image/jpg" id="adminImage" class="form-input" style="padding: 0.4rem;" />
              ${state.adminForm.image && !state.imageFile ? `<p style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.5rem;">Current: ${state.adminForm.image.split('/').pop()}</p>` : ''}
            </div>
          </div>
          
          <div class="form-actions" style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 2rem;">
            ${state.isEditing ? `
              <button id="updateProductBtn" class="btn btn-primary" style="padding: 0.85rem 3rem;">Update Collection</button>
              <button id="cancelEditBtn" class="btn btn-outline" style="padding: 0.85rem 2rem;">Cancel</button>
            ` : `
              <button id="addProductBtn" class="btn btn-primary" style="padding: 0.85rem 3rem;">Add to Collection</button>
            `}
          </div>
        </div>
        
        <h2 class="section-title" style="text-align: left; font-size: 1.75rem; margin-bottom: 2rem;">Existing Collection</h2>
        <div class="products-grid">
          ${state.productList.length === 0 ? `
            <div style="grid-column: 1/-1; text-align: center; padding: 5rem; background: rgba(255,255,255,0.01); border: 1px dashed rgba(255,255,255,0.1); border-radius: 1.5rem;">
              <p style="color: #64748b;">No products in inventory. Use the form above to add some!</p>
            </div>
          ` : state.productList.map(p => `
            <div class="product-card" style="cursor: default;">
              <div class="product-image" style="height: 12rem;">
                <img src="${(p.images && p.images[0]) || p.image || ''}" alt="${p.title || p.name}" />
              </div>
              <div class="product-info">
                <h3 class="product-name" style="font-size: 1rem;">${p.title || p.name}</h3>
                <div class="product-footer" style="margin-top: 0.5rem; padding-top: 0.5rem;">
                  <span class="product-price">₹${p.price}</span>
                  <span class="product-category" style="font-size: 0.65rem;">${p.category || p.gender}</span>
                </div>
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                  <button class="edit-btn btn" data-id="${p.id}" style="flex: 1; font-size: 0.75rem; padding: 0.5rem; background: rgba(59, 130, 246, 0.1); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.2);">Edit</button>
                  <button class="delete-btn btn" data-id="${p.id}" style="flex: 1; font-size: 0.75rem; padding: 0.5rem; background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2);">Delete</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

    setupAdminEvents();
  } catch (err) {
    console.error("Admin View Crash:", err);
    document.getElementById('app').innerHTML = `
      ${renderHeader()}
      <div class="container" style="padding:10rem 2rem;text-align:center;">
        <h2 style="color:#fff;font-size:2rem;font-weight:700;">Admin Panel Unavailable</h2>
        <p style="color:#94a3b8;margin:1rem 0 2rem;">We couldn't load the product inventory. This might be due to a connection error.</p>
        <button onclick="location.hash='#/'" class="btn btn-outline">Back to Shop</button>
      </div>
    `;
  }
}

function setupAdminEvents() {
  document.querySelectorAll('[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.adminForm.category = btn.dataset.cat;
      renderAdmin();
    });
  });

  document.querySelectorAll('[data-size]').forEach(cb => {
    cb.addEventListener('change', () => {
      const size = cb.dataset.size;
      const currentSizes = state.adminForm.size || [];
      if (cb.checked) {
        state.adminForm.size = [...currentSizes, size];
      } else {
        state.adminForm.size = currentSizes.filter(s => s !== size);
      }
    });
  });

  document.getElementById('addProductBtn')?.addEventListener('click', handleAddProduct);
  document.getElementById('updateProductBtn')?.addEventListener('click', handleUpdateProduct);
  document.getElementById('cancelEditBtn')?.addEventListener('click', () => {
    resetAdminForm();
    renderAdmin();
  });

  document.getElementById('bulkGenBtn')?.addEventListener('click', async () => {
    const btn = document.getElementById('bulkGenBtn');
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spinning" style="margin-right:8px"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg> Generating...';
    btn.disabled = true;
    try {
      await bulkGenerateProducts();
      alert('500 Products Generated Successfully!');
      renderAdmin();
    } catch (e) {
      alert('Failed to generate products.');
      btn.innerHTML = originalHtml;
      btn.disabled = false;
    }
  });

  document.getElementById('deleteAllBtn')?.addEventListener('click', async () => {
    if (confirm("Are you ABSOLUTELY sure? This will wipe the entire store!")) {
      const btn = document.getElementById('deleteAllBtn');
      const originalHtml = btn.innerHTML;
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spinning" style="margin-right:8px"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg> Wiping...';
      btn.disabled = true;
      try {
        await deleteAllProducts();
        alert('All products wiped.');
        renderAdmin();
      } catch (e) {
        alert('Failed to delete products.');
        btn.innerHTML = originalHtml;
        btn.disabled = false;
      }
    }
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = state.productList.find(p => String(p.id) === String(btn.dataset.id));
      if (product) editProduct(product);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => handleDeleteProduct(btn.dataset.id));
  });

  document.getElementById('adminImage')?.addEventListener('change', (e) => {
    state.imageFile = e.target.files?.[0] || null;
  });
}

function editProduct(product) {
  state.isEditing = true;
  state.editId = product.id;
  state.imageFile = null;
  state.adminForm = {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    image: product.image,
    size: product.size || [],
    color: Array.isArray(product.color) ? product.color : (product.color ? [product.color] : [])
  };
  renderAdmin();
}

async function handleAddProduct() {
  const adminForm = state.adminForm;
  adminForm.name = document.getElementById('adminName').value;
  adminForm.description = document.getElementById('adminDesc').value;
  adminForm.price = Number(document.getElementById('adminPrice').value);
  adminForm.color = document.getElementById('adminColor').value.split(',').map(c => c.trim()).filter(c => c);

  if (!adminForm.name || !adminForm.description || !adminForm.price || !adminForm.category) {
    alert('Please fill in Name, Description, Price, and Category');
    return;
  }

  const formData = new FormData();
  formData.append('name', adminForm.name);
  formData.append('description', adminForm.description);
  formData.append('price', String(adminForm.price));
  formData.append('category', adminForm.category);
  formData.append('size', adminForm.size?.join(',') || 'M,L');
  formData.append('color', adminForm.color?.join(', ') || 'Black');
  if (state.imageFile) formData.append('image', state.imageFile);

  try {
    const btn = document.getElementById('addProductBtn');
    btn.disabled = true;
    btn.innerHTML = 'Adding...';
    await addProduct(formData);
    alert('Product Added ✅');
    resetAdminForm();
    renderAdmin();
  } catch (err) {
    alert('Failed to add product');
    const btn = document.getElementById('addProductBtn');
    btn.disabled = false;
    btn.innerHTML = 'Add to Collection';
  }
}

async function handleUpdateProduct() {
  const adminForm = state.adminForm;
  adminForm.name = document.getElementById('adminName').value;
  adminForm.description = document.getElementById('adminDesc').value;
  adminForm.price = Number(document.getElementById('adminPrice').value);
  adminForm.color = document.getElementById('adminColor').value.split(',').map(c => c.trim()).filter(c => c);

  if (!adminForm.name || !adminForm.description || !adminForm.price || !adminForm.category) {
    alert('Please fill in essential fields');
    return;
  }

  try {
    const btn = document.getElementById('updateProductBtn');
    btn.disabled = true;
    btn.innerHTML = 'Updating...';

    if (state.imageFile) {
      const formData = new FormData();
      formData.append('name', adminForm.name);
      formData.append('description', adminForm.description);
      formData.append('price', String(adminForm.price));
      formData.append('category', adminForm.category);
      formData.append('size', adminForm.size?.join(',') || 'M,L');
      formData.append('color', adminForm.color?.join(', ') || 'Black');
      formData.append('image', state.imageFile);
      await updateProduct(state.editId, formData, true);
    } else {
      await updateProduct(state.editId, { ...adminForm, size: adminForm.size || ['M', 'L'], color: adminForm.color || ['Black'] });
    }

    alert('Product Updated ✅');
    resetAdminForm();
    renderAdmin();
  } catch (err) {
    alert('Update failed');
    const btn = document.getElementById('updateProductBtn');
    btn.disabled = false;
    btn.innerHTML = 'Update Collection';
  }
}

async function handleDeleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  try {
    await deleteProduct(id);
    state.productList = state.productList.filter(p => String(p.id) !== String(id));
    renderAdmin();
  } catch (err) {
    alert('Delete failed');
  }
}
