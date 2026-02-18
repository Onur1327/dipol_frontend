// Backend API URL - Geliştirmede localhost, production'da Vercel backend kullan
const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim().length > 0) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3002';
  }

  return 'https://dipol-backend.vercel.app';
};

const rawApiUrl = getApiUrl().trim();
const FINAL_API_URL = rawApiUrl.replace(/\/+$/, '');

// Client-side cache storage
const apiCache = new Map();
const pendingRequests = new Map();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

// Server-side için API isteği
export async function serverApiRequest(endpoint, options = {}) {
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  const url = endpoint.startsWith('http') ? endpoint : `${FINAL_API_URL}/${cleanEndpoint}`;

  const isDev = process.env.NODE_ENV === 'development';
  const defaultCache = isDev ? 'no-store' : 'force-cache';

  // if (isDev) {
  //   console.log('[Server API Request]', options.method || 'GET', url);
  // }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      cache: options.cache ?? defaultCache,
    });

    // if (isDev) {
    //   console.log('[Server API Response]', options.method || 'GET', url, response.status, response.ok);
    // }

    return response;
  } catch (error) {
    if (isDev) {
      console.error('[Server API Error]', options.method || 'GET', url, error?.message);
    }
    throw error;
  }
}

// Client-side için API isteği
export async function apiRequest(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  const url = endpoint.startsWith('http') ? endpoint : `${FINAL_API_URL}/${cleanEndpoint}`;

  // 1. Önce tamamlanmış önbelleğe bak (Sadece GET için)
  if (options.enableCache && (!options.method || options.method === 'GET')) {
    const cachedItem = apiCache.get(url);
    if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_DURATION) {
      return cachedItem.response.clone();
    }
  }

  // 2. Devam eden bir istek var mı kontrol et (Sadece GET için)
  if (!options.method || options.method === 'GET') {
    if (pendingRequests.has(url)) {
      const response = await pendingRequests.get(url);
      return response.clone();
    }
  }

  // Yeni bir istek başlat
  const fetchPromise = (async () => {
    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      if (options.enableCache && response.ok && (!options.method || options.method === 'GET')) {
        apiCache.set(url, {
          timestamp: Date.now(),
          response: response.clone(),
        });
      }

      return response;
    } finally {
      // İstek tamamlandığında bekleyenler listesinden çıkar
      pendingRequests.delete(url);
    }
  })();

  // Sadece GET isteklerini bekleyenlere ekle
  if (!options.method || options.method === 'GET') {
    pendingRequests.set(url, fetchPromise);
  }

  try {
    const response = await fetchPromise;

    if (typeof window !== 'undefined') {
      const logData = {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      };

      if (!response.ok) {
        try {
          const errorData = await response.clone().json();
          logData.errorData = errorData;
        } catch (e) {
          try {
            logData.errorText = await response.clone().text();
          } catch (e2) { }
        }
      }

      // console.log(`[API Response] ${options.method || 'GET'} ${url}`, JSON.stringify(logData, null, 2));
    }

    return response;
  } catch (error) {
    console.error(`[API Error] ${options.method || 'GET'} ${url}`, {
      error: error?.message || error,
      name: error?.name,
      stack: error?.stack,
    });

    if (error?.message?.includes('Failed to fetch') || error?.name === 'TypeError') {
      console.error(`[API Error] Backend'e bağlanılamıyor. Backend URL: ${FINAL_API_URL}`);
      console.error(`[API Error] Backend'in çalıştığından emin olun: http://localhost:3002`);
    }

    throw error;
  }
}

export const api = {
  // Auth
  register: (data) =>
    apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data) =>
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  forgotPassword: (data) =>
    apiRequest('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resetPassword: (data) =>
    apiRequest('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Products
  getProducts: (params) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.featured) query.append('featured', 'true');
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    return apiRequest(`/api/products?${query.toString()}`);
  },

  getProduct: (id) => apiRequest(`/api/products/${id}`),

  createProduct: (data) =>
    apiRequest('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProduct: (id, data) =>
    apiRequest(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteProduct: (id) =>
    apiRequest(`/api/products/${id}`, {
      method: 'DELETE',
    }),

  // Categories
  getCategories: (params) => {
    const query = new URLSearchParams();
    if (params?.parentOnly) query.append('parentOnly', 'true');
    if (params?.parentId) query.append('parentId', params.parentId);
    if (params?.ids) query.append('ids', params.ids);
    const queryString = query.toString();
    return apiRequest(`/api/categories${queryString ? `?${queryString}` : ''}`, { enableCache: true });
  },

  createCategory: (data) =>
    apiRequest('/api/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateCategory: (id, data) =>
    apiRequest(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteCategory: (id) =>
    apiRequest(`/api/categories/${id}`, {
      method: 'DELETE',
    }),

  // Orders
  getOrders: () => apiRequest('/api/orders'),

  getOrder: (id) => apiRequest(`/api/orders/${id}`),

  createOrder: (data) =>
    apiRequest('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateOrder: (id, data) =>
    apiRequest(`/api/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Carousel
  getCarousels: () => apiRequest('/api/carousel', { enableCache: true }),
  createCarousel: (data) =>
    apiRequest('/api/carousel', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCarousel: (id, data) =>
    apiRequest(`/api/carousel/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCarousel: (id) =>
    apiRequest(`/api/carousel/${id}`, {
      method: 'DELETE',
    }),

  // Contact
  getContact: () => apiRequest('/api/contact', { enableCache: true }),
  updateContact: (data) =>
    apiRequest('/api/contact', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Users
  getUsers: (params) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.search) query.append('search', params.search);
    return apiRequest(`/api/users?${query.toString()}`);
  },
  getUser: (id) => apiRequest(`/api/users/${id}`),
  updateUser: (id, data) =>
    apiRequest(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteUser: (id) =>
    apiRequest(`/api/users/${id}`, {
      method: 'DELETE',
    }),

  // Current User
  getCurrentUser: () => apiRequest('/api/users/me'),
  updateCurrentUser: (data) =>
    apiRequest('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Returns
  createReturn: (data) =>
    apiRequest('/api/returns', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Contact Form
  submitContactForm: (data) =>
    apiRequest('/api/contact-form', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Payment
  initializePayment: (data) =>
    apiRequest('/api/payment/initialize', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

