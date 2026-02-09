'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function FavorilerPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Kullanıcıya özel favoriler key'i
  const getFavoritesKey = () => {
    return user ? `favorites_${user.id}` : 'favorites_guest';
  };

  useEffect(() => {
    loadFavorites();
  }, [user]);

  const loadFavorites = () => {
    try {
      // localStorage'dan favorileri yükle
      const favoritesKey = getFavoritesKey();
      const savedFavorites = localStorage.getItem(favoritesKey);
      if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites);
        if (favoriteIds.length > 0) {
          fetchFavoriteProducts(favoriteIds);
        } else {
          setFavorites([]);
          setLoading(false);
        }
      } else {
        setFavorites([]);
        setLoading(false);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Favoriler yüklenemedi:', error);
      }
      setFavorites([]);
      setLoading(false);
    }
  };

  const fetchFavoriteProducts = async (productIds) => {
    try {
      setLoading(true);
      const products = await Promise.all(
        productIds.map(async (id) => {
          try {
            const res = await api.getProduct(id);
            if (res.ok) {
              return await res.json();
            }
            return null;
          } catch {
            return null;
          }
        })
      );
      const validProducts = products.filter((p) => p !== null);
      setFavorites(validProducts);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Favori ürünler yüklenemedi:', error);
      }
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (productId) => {
    try {
      const favoritesKey = getFavoritesKey();
      const savedFavorites = localStorage.getItem(favoritesKey);
      if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites);
        const updatedFavorites = favoriteIds.filter((id) => id !== productId);
        localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));
        setFavorites(favorites.filter((p) => p._id !== productId));
        // Navbar'daki badge'i güncellemek için event dispatch et
        window.dispatchEvent(new Event('favoritesUpdated'));
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Favori kaldırılamadı:', error);
      }
    }
  };

  const getFavoriteCount = () => {
    try {
      const favoritesKey = getFavoritesKey();
      const savedFavorites = localStorage.getItem(favoritesKey);
      if (savedFavorites) {
        return JSON.parse(savedFavorites).length;
      }
      return 0;
    } catch {
      return 0;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-40 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Favorilerim</h1>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Yükleniyor...</p>
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-24 h-24 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <p className="text-gray-500 text-lg mb-4">Henüz favori ürününüz bulunmamaktadır.</p>
              <Link
                href="/urunler"
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Alışverişe Başla
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  {favorites.length} ürün favorilerinizde
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {favorites.map((product) => {
                  const discount = product.comparePrice
                    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                    : 0;
                  const mainImage = product.images[0] || '/placeholder.jpg';
                  const isBase64 = mainImage.startsWith('data:image');

                  return (
                    <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow relative group">
                      <button
                        onClick={() => removeFavorite(product._id)}
                        className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                        title="Favorilerden Kaldır"
                      >
                        <svg
                          className="w-5 h-5 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                      <Link href={`/urunler/${product.slug || product._id}`}>
                        <div className="relative aspect-square overflow-hidden">
                          {isBase64 ? (
                            <img
                              src={mainImage}
                              alt={product.name}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <Image
                              src={mainImage}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                          )}
                          {discount > 0 && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                              %{discount} İndirim
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          {product.category && (
                            <p className="text-sm text-gray-500 mb-1">{product.category.name}</p>
                          )}
                          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-primary">
                              {product.price.toFixed(2)} ₺
                            </span>
                            {product.comparePrice && (
                              <span className="text-sm text-gray-400 line-through">
                                {product.comparePrice.toFixed(2)} ₺
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

