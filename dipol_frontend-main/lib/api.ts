// Backend API URL - Geliştirmede localhost, production'da Vercel backend kullan
const getApiUrl = () => {
  // 1) .env'den gelen değer varsa HER ZAMAN onu kullan (hem lokal hem prod)
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim().length > 0) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 2) Development ortamında çalışıyorsak, varsayılan olarak lokal backend'e bağlan
  if (process.env.NODE_ENV === 'development') {
    // Backend README'ye göre port 3002
    return 'http://localhost:3002';
  }

  // 3) Production için fallback: Vercel backend URL'i
  return 'https://dipol-backend.vercel.app';
};

const API_URL = getApiUrl().replace(/\/+$/, ''); // Sonundaki slash'ları temizle

// Server-side için API isteği
export async function serverApiRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
  // Endpoint'in başındaki slash'ı kontrol et ve URL'i düzgün oluştur
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${cleanEndpoint}`;

  const isDev = process.env.NODE_ENV === 'development';
  const defaultCache: RequestCache = isDev ? 'no-store' : 'force-cache';

  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    },
    // Geliştirmede her istekte fresh data, production'da cache kullan
    cache: options.cache ?? defaultCache,
  });
}

// Client-side için API isteği
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  // Server-side'da token yok, sadece client-side'da localStorage'dan al
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Server-side için absolute URL kullan
  // Endpoint'in başındaki slash'ı kontrol et ve URL'i düzgün oluştur
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_URL}${cleanEndpoint}`;

  // Debug için URL ve header'ları logla (production'da da görmek için)
  if (typeof window !== 'undefined') {
    console.log(`[API Request] ${options.method || 'GET'} ${url}`, { headers, hasToken: !!token });
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Response'u logla
    if (typeof window !== 'undefined') {
      console.log(`[API Response] ${options.method || 'GET'} ${url}`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });
    }

    return response;
  } catch (error) {
    console.error(`[API Error] ${options.method || 'GET'} ${url}`, error);
    throw error;
  }
}

export const api = {
  // Auth
  register: (data: { name: string; email: string; password: string; phone?: string; address?: { street?: string; city?: string; postalCode?: string; country?: string } }) =>
    apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  forgotPassword: (data: { email: string }) =>
    apiRequest('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resetPassword: (data: { token: string; password: string }) =>
    apiRequest('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Products
  getProducts: (params?: { category?: string; featured?: boolean; search?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.featured) query.append('featured', 'true');
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    return apiRequest(`/api/products?${query.toString()}`);
  },

  getProduct: (id: string) => apiRequest(`/api/products/${id}`),

  createProduct: (data: any) =>
    apiRequest('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProduct: (id: string, data: any) =>
    apiRequest(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteProduct: (id: string) =>
    apiRequest(`/api/products/${id}`, {
      method: 'DELETE',
    }),

  // Categories
  getCategories: (params?: { parentOnly?: boolean; parentId?: string; ids?: string }) => {
    const query = new URLSearchParams();
    if (params?.parentOnly) query.append('parentOnly', 'true');
    if (params?.parentId) query.append('parentId', params.parentId);
    if (params?.ids) query.append('ids', params.ids);
    const queryString = query.toString();
    return apiRequest(`/api/categories${queryString ? `?${queryString}` : ''}`);
  },

  createCategory: (data: any) =>
    apiRequest('/api/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateCategory: (id: string, data: any) =>
    apiRequest(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteCategory: (id: string) =>
    apiRequest(`/api/categories/${id}`, {
      method: 'DELETE',
    }),

  // Orders
  getOrders: () => apiRequest('/api/orders'),

  getOrder: (id: string) => apiRequest(`/api/orders/${id}`),

  createOrder: (data: any) =>
    apiRequest('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateOrder: (id: string, data: any) =>
    apiRequest(`/api/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Carousel
  getCarousels: () => apiRequest('/api/carousel'),
  createCarousel: (data: any) =>
    apiRequest('/api/carousel', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCarousel: (id: string, data: any) =>
    apiRequest(`/api/carousel/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCarousel: (id: string) =>
    apiRequest(`/api/carousel/${id}`, {
      method: 'DELETE',
    }),

  // Contact
  getContact: () => apiRequest('/api/contact'),
  updateContact: (data: any) =>
    apiRequest('/api/contact', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Users
  getUsers: (params?: { page?: number; limit?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.search) query.append('search', params.search);
    return apiRequest(`/api/users?${query.toString()}`);
  },
  getUser: (id: string) => apiRequest(`/api/users/${id}`),
  updateUser: (id: string, data: any) =>
    apiRequest(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteUser: (id: string) =>
    apiRequest(`/api/users/${id}`, {
      method: 'DELETE',
    }),

  // Current User
  getCurrentUser: () => apiRequest('/api/users/me'),
  updateCurrentUser: (data: any) =>
    apiRequest('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Returns
  createReturn: (data: any) =>
    apiRequest('/api/returns', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Contact Form
  submitContactForm: (data: { name: string; email: string; subject: string; message: string }) =>
    apiRequest('/api/contact-form', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Payment
  initializePayment: (data: any) =>
    apiRequest('/api/payment/initialize', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

