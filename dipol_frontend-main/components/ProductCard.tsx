'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    images: string[];
    category?: {
      name: string;
      slug: string;
    };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  // Kullanıcıya özel favoriler key'i
  const getFavoritesKey = () => {
    return user ? `favorites_${user.id}` : 'favorites_guest';
  };

  useEffect(() => {
    try {
      const favoritesKey = getFavoritesKey();
      const savedFavorites = localStorage.getItem(favoritesKey);
      if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites);
        setIsFavorite(favoriteIds.includes(product._id));
      }
    } catch {
      setIsFavorite(false);
    }
  }, [product._id, user]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const favoritesKey = getFavoritesKey();
      const savedFavorites = localStorage.getItem(favoritesKey);
      let favoriteIds = savedFavorites ? JSON.parse(savedFavorites) : [];
      
      if (isFavorite) {
        favoriteIds = favoriteIds.filter((id: string) => id !== product._id);
      } else {
        if (!favoriteIds.includes(product._id)) {
          favoriteIds.push(product._id);
        }
      }
      
      localStorage.setItem(favoritesKey, JSON.stringify(favoriteIds));
      setIsFavorite(!isFavorite);
      // Navbar'daki badge'i güncellemek için event dispatch et
      window.dispatchEvent(new Event('favoritesUpdated'));
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Favori eklenemedi/kaldırılamadı:', error);
      }
    }
  };

  // Fiyatları normalize et: her zaman düşük olanı ana fiyat, yüksek olanı eski fiyat göster
  const hasComparePrice = typeof product.comparePrice === 'number' && product.comparePrice > 0;
  const mainPrice = hasComparePrice
    ? Math.min(product.price, product.comparePrice as number)
    : product.price;
  const oldPrice = hasComparePrice
    ? Math.max(product.price, product.comparePrice as number)
    : undefined;

  const discount =
    hasComparePrice && oldPrice && oldPrice > mainPrice
      ? Math.round(((oldPrice - mainPrice) / oldPrice) * 100)
      : 0;

  return (
    <Link href={`/urunler/${product.slug || product._id}`} className="group h-full">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col min-h-[430px]">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.images && product.images.length > 0 && product.images[0] ? (
            product.images[0].startsWith('data:image') ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                unoptimized
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
              %{discount} İndirim
            </div>
          )}
          <button
            onClick={toggleFavorite}
            className="absolute top-2 left-2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-pink-50 z-10"
            title={isFavorite ? 'Favorilerden Kaldır' : 'Favorilere Ekle'}
          >
            <svg
              className={`w-5 h-5 ${isFavorite ? 'text-pink-500 fill-pink-500' : 'text-gray-700'}`}
              fill={isFavorite ? 'currentColor' : 'none'}
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
          </button>
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
          {product.category && (
            <p className="text-xs font-medium tracking-wide text-gray-500 mb-1 uppercase">
              {product.category.name}
            </p>
          )}
          <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="mt-auto flex items-center gap-2">
            <span className="text-sm font-bold text-primary">
              {mainPrice.toFixed(2)} ₺
            </span>
            {oldPrice !== undefined && oldPrice > mainPrice && (
              <span className="text-xs text-gray-400 line-through">
                {oldPrice.toFixed(2)} ₺
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

