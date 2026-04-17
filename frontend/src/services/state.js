// Global application state

// Generate a random guest session email if one doesn't exist
const getSessionId = () => {
  try {
    let id = localStorage.getItem('loom_lumen_session');
    if (!id) {
      id = `guest_${Math.random().toString(36).substring(2, 9)}@loomlumen.com`;
      localStorage.setItem('loom_lumen_session', id);
    }
    return id;
  } catch (err) {
    console.warn('LocalStorage unavailable, using temporary session ID.');
    return `guest_temp_${Math.random().toString(36).substring(2, 9)}@loomlumen.com`;
  }
};

export const state = {
  sessionId: getSessionId(),
  cartItemCount: 0,
  chatOpen: false,
  chatMessages: [],
  chatInput: '',
  chatLoading: false,
  currentCategory: '',
  priceFilter: { min: null, max: null },  // price range filter
  products: [],
  productList: [],
  
  // State for admin
  isEditing: false,
  editId: null,
  adminForm: {
    name: '',
    description: '',
    price: 0,
    category: 'men',
    image: '',
    size: [],
    color: []
  },
  imageFile: null
};


export function resetAdminForm() {
  state.isEditing = false;
  state.editId = null;
  state.imageFile = null;
  state.adminForm = {
    name: '',
    description: '',
    price: 0,
    category: 'men',
    image: '',
    size: [],
    color: []
  };
}

