/**
 * API Service
 * Handles all communication with the backend
 */

const API_BASE = '/api';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Une erreur est survenue');
    }
    
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// =====================================
// Products API
// =====================================

export async function getProducts() {
  return fetchAPI('/products');
}

export async function getProduct(id) {
  return fetchAPI(`/products/${id}`);
}

export async function updateProduct(id, data) {
  return fetchAPI(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// =====================================
// Orders API
// =====================================

export async function createOrder(orderData) {
  return fetchAPI('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
}

export async function getOrders(params = {}) {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/orders${query ? `?${query}` : ''}`);
}

export async function getOrder(id) {
  return fetchAPI(`/orders/${id}`);
}

export async function getOrdersByPhone(phone) {
  return fetchAPI(`/orders/phone/${encodeURIComponent(phone)}`);
}

export async function updateOrderStatus(id, status) {
  return fetchAPI(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });
}

export async function markOrderPaid(id) {
  return fetchAPI(`/orders/${id}/paid`, {
    method: 'PUT'
  });
}

// =====================================
// Settings API
// =====================================

export async function getSettings() {
  return fetchAPI('/settings');
}

export async function updateSettings(settings) {
  return fetchAPI('/settings', {
    method: 'PUT',
    body: JSON.stringify(settings)
  });
}

// =====================================
// Time Slots API
// =====================================

export async function getTimeSlots() {
  return fetchAPI('/timeslots');
}

export async function updateTimeSlots(slots) {
  return fetchAPI('/timeslots', {
    method: 'PUT',
    body: JSON.stringify({ slots })
  });
}

export default {
  getProducts,
  getProduct,
  updateProduct,
  createOrder,
  getOrders,
  getOrder,
  getOrdersByPhone,
  updateOrderStatus,
  markOrderPaid,
  getSettings,
  updateSettings,
  getTimeSlots,
  updateTimeSlots
};
