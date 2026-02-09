'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.login({ email, password });
    const data = await response.json();

    if (!response.ok) {
      console.error('Login failed:', response.status, data);
      throw new Error(data.error || 'Giriş başarısız');
    }

    // User bilgisini kontrol et
    if (!data.user) {
      console.error('Login response missing user data:', data);
      throw new Error('Kullanıcı bilgileri alınamadı');
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);

    console.log('Login successful, user role:', data.user.role);
  };

  const register = async (name, email, password, phone, address) => {
    const response = await api.register({ name, email, password, phone, address });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Kayıt başarısız');
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    // Kullanıcıya özel sepet ve favorileri temizle
    const currentUser = user;
    if (currentUser) {
      localStorage.removeItem(`cart_${currentUser.id}`);
      localStorage.removeItem(`favorites_${currentUser.id}`);
    }
    // Guest sepet ve favorileri de temizle
    localStorage.removeItem('cart_guest');
    localStorage.removeItem('favorites_guest');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Fallback: Provider dışındayken misafir kullanıcı gibi davran
    if (process.env.NODE_ENV === 'development') {
      console.warn('useAuth AuthProvider dışında kullanılıyor. Varsayılan (guest) context dönüyor.');
    }
    return {
      user: null,
      token: null,
      loading: false,
      login: async () => {
        throw new Error('AuthProvider dışında login çağrıldı');
      },
      register: async () => {
        throw new Error('AuthProvider dışında register çağrıldı');
      },
      logout: () => {
        // no-op
      },
    };
  }
  return context;
}

