'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface CartItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  maxStock?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  total: number;
  shippingCost: number;
  finalTotal: number;
  itemCount: number;
  freeShippingThreshold: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [shippingSettings, setShippingSettings] = useState<{
    shippingCost: number;
    freeShippingThreshold: number;
  }>({
    shippingCost: 50,
    freeShippingThreshold: 2500,
  });

  // Kullanıcıya özel sepet key'i
  const getCartKey = () => {
    return user ? `cart_${user.id}` : 'cart_guest';
  };

  useEffect(() => {
    // Kullanıcı değiştiğinde sepeti yükle
    const cartKey = getCartKey();
    const stored = localStorage.getItem(cartKey);
    if (stored) {
      setItems(JSON.parse(stored));
    } else {
      // Eğer kullanıcı giriş yaptıysa ve guest sepeti varsa, onu kullanıcı sepetine taşı
      if (user) {
        const guestCart = localStorage.getItem('cart_guest');
        if (guestCart) {
          const guestItems = JSON.parse(guestCart);
          setItems(guestItems);
          localStorage.removeItem('cart_guest');
        }
      } else {
        setItems([]);
      }
    }
  }, [user]);

  useEffect(() => {
    // Sepeti kullanıcıya özel key ile kaydet
    const cartKey = getCartKey();
    localStorage.setItem(cartKey, JSON.stringify(items));
  }, [items, user]);

  // Kargo ayarlarını backend'den al
  useEffect(() => {
    async function fetchShippingSettings() {
      try {
        const res = await api.getContact();
        if (res.ok) {
          const data = await res.json();
          setShippingSettings({
            shippingCost: data.shippingCost || 50,
            freeShippingThreshold: data.freeShippingThreshold || 2500,
          });
        }
      } catch (error) {
        // Hata durumunda varsayılan değerler kullanılacak
        console.warn('Kargo ayarları yüklenemedi, varsayılan değerler kullanılıyor');
      }
    }
    fetchShippingSettings();
  }, []);

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.product === item.product && i.size === item.size && i.color === item.color
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        const increaseBy = item.quantity || 1;
        const current = updated[existingIndex];
        const maxStock = item.maxStock ?? current.maxStock;

        if (maxStock !== undefined && maxStock >= 0) {
          const newQuantity = Math.min(current.quantity + increaseBy, maxStock);
          if (newQuantity === current.quantity) {
            if (typeof window !== 'undefined') {
              alert(`Bu ürün için en fazla ${maxStock} adet ekleyebilirsiniz`);
            }
            return prev;
          }
          updated[existingIndex] = { ...current, quantity: newQuantity, maxStock };
        } else {
          updated[existingIndex].quantity = current.quantity + increaseBy;
        }
        return updated;
      }

      const quantity = item.quantity || 1;
      const maxStock = item.maxStock;
      const finalQuantity =
        maxStock !== undefined && maxStock >= 0 ? Math.min(quantity, maxStock) : quantity;

      if (maxStock !== undefined && maxStock >= 0 && finalQuantity <= 0) {
        if (typeof window !== 'undefined') {
          alert('Bu ürün için stok bulunmamaktadır');
        }
        return prev;
      }

      return [...prev, { ...item, quantity: finalQuantity, maxStock }];
    });
  };

  const removeItem = (productId: string, size?: string, color?: string) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.product === productId && item.size === size && item.color === color)
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeItem(productId, size, color);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.product === productId && item.size === size && item.color === color) {
          const maxStock = item.maxStock;
          const finalQuantity =
            maxStock !== undefined && maxStock >= 0 ? Math.min(quantity, maxStock) : quantity;

          if (maxStock !== undefined && maxStock >= 0 && quantity > maxStock) {
            if (typeof window !== 'undefined') {
              alert(`Bu ürün için en fazla ${maxStock} adet ekleyebilirsiniz`);
            }
          }

          return { ...item, quantity: finalQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Admin panelinden gelen kargo ayarlarını kullan
  const shippingCost = total >= shippingSettings.freeShippingThreshold ? 0 : shippingSettings.shippingCost;
  const finalTotal = total + shippingCost;

  return (
    <CartContext.Provider
      value={{ 
        items, 
        addItem, 
        removeItem, 
        updateQuantity, 
        clearCart, 
        total, 
        shippingCost, 
        finalTotal, 
        itemCount,
        freeShippingThreshold: shippingSettings.freeShippingThreshold,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

