'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProductDetail({ product }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '');
  const [quantity, setQuantity] = useState(1);
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

  // Renk seçimine göre görselleri belirle
  const getDisplayImages = () => {
    if (selectedColor && product.colorImages) {
      const colorImages = product.colorImages[selectedColor];
      if (colorImages && colorImages.length > 0) {
        return colorImages;
      }
    }
    return product.images;
  };

  const displayImages = getDisplayImages();
  const [selectedImage, setSelectedImage] = useState(0);

  // Fiyatları normalize et: her zaman düşük olanı ana fiyat, yüksek olanı eski fiyat göster
  const hasComparePrice = typeof product.comparePrice === 'number' && product.comparePrice > 0;
  const mainPrice = hasComparePrice
    ? Math.min(product.price, product.comparePrice)
    : product.price;
  const oldPrice = hasComparePrice
    ? Math.max(product.price, product.comparePrice)
    : undefined;

  const discount =
    hasComparePrice && oldPrice && oldPrice > mainPrice
      ? Math.round(((oldPrice - mainPrice) / oldPrice) * 100)
      : 0;

  // Renk/beden seçilmesi gerekiyor mu?
  const requiresColorSizeSelection = product.colorSizeStock && Object.keys(product.colorSizeStock).length > 0;

  // Seçilen renk ve bedene göre stok bilgisini al
  const availableStock = useMemo(() => {
    // Eğer colorSizeStock varsa, mutlaka renk ve beden seçilmeli
    if (requiresColorSizeSelection) {
      if (!selectedColor || !selectedSize) {
        return 0; // Renk veya beden seçilmediyse stok yok
      }
      const colorStock = product.colorSizeStock?.[selectedColor];
      if (colorStock && colorStock[selectedSize] !== undefined) {
        return colorStock[selectedSize];
      }
      return 0; // Bu renk/beden kombinasyonu için stok yok
    }
    // Renk/beden bazlı stok yoksa genel stok döndür
    return product.stock;
  }, [product.colorSizeStock, selectedColor, selectedSize, requiresColorSizeSelection, product.stock]);

  const hasValidSelection = requiresColorSizeSelection ? (selectedColor && selectedSize) : true;

  const handleAddToCart = () => {
    if (!user) {
      router.push('/giris');
      return;
    }

    // Beden kontrolü
    if (product.sizes.length > 0 && !selectedSize) {
      alert('Lütfen bir beden seçiniz');
      return;
    }

    // Renk kontrolü
    if (product.colors.length > 0 && !selectedColor) {
      alert('Lütfen bir renk seçiniz');
      return;
    }

    // Renk/beden bazlı stok kontrolü
    if (requiresColorSizeSelection) {
      if (!selectedColor || !selectedSize) {
        alert('Lütfen renk ve beden seçiniz');
        return;
      }

      const colorStock = product.colorSizeStock?.[selectedColor];
      const sizeStock = colorStock?.[selectedSize];

      if (sizeStock === undefined || sizeStock === null) {
        alert('Bu renk ve beden kombinasyonu için stok bulunmamaktadır');
        return;
      }

      if (quantity > sizeStock) {
        alert(`Bu renk ve beden için sadece ${sizeStock} adet stokta bulunmaktadır`);
        setQuantity(sizeStock);
        return;
      }
    } else {
      // Genel stok kontrolü
      if (quantity > product.stock) {
        alert(`Sadece ${product.stock} adet stokta bulunmaktadır`);
        setQuantity(product.stock);
        return;
      }
    }

    addItem({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      maxStock: availableStock,
    });

    alert('Ürün sepete eklendi!');
  };

  const toggleFavorite = () => {
    try {
      const favoritesKey = getFavoritesKey();
      const savedFavorites = localStorage.getItem(favoritesKey);
      let favoriteIds = savedFavorites ? JSON.parse(savedFavorites) : [];

      if (isFavorite) {
        favoriteIds = favoriteIds.filter((id) => id !== product._id);
        alert('Ürün favorilerden kaldırıldı');
      } else {
        if (!favoriteIds.includes(product._id)) {
          favoriteIds.push(product._id);
        }
        alert('Ürün favorilere eklendi');
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="aspect-square relative mb-4 rounded-lg overflow-hidden bg-gray-100">
            {(() => {
              const mainImage = displayImages[selectedImage] || displayImages[0];
              if (mainImage) {
                const isBase64 = mainImage.startsWith('data:image');
                return isBase64 ? (
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    unoptimized
                  />
                );
              }
              return (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                  <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              );
            })()}
          </div>
          {displayImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {displayImages.map((image, index) => {
                const isBase64 = image.startsWith('data:image');
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square relative rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-primary' : 'border-transparent'
                      }`}
                  >
                    {isBase64 ? (
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 25vw, 12.5vw"
                        unoptimized
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {product.category && (
            <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>
          )}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-primary">
              {mainPrice.toFixed(2)} ₺
            </span>
            {oldPrice !== undefined && oldPrice > mainPrice && (
              <>
                <span className="text-xl text-gray-400 line-through">
                  {oldPrice.toFixed(2)} ₺
                </span>
                {discount > 0 && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold">
                    %{discount} İndirim
                  </span>
                )}
              </>
            )}
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Beden: <span className="text-primary font-normal">{selectedSize}</span>
                {selectedColor && product.colorSizeStock?.[selectedColor]?.[selectedSize] !== undefined && (
                  <span className="text-xs text-gray-500 ml-2">
                    (Stok: {product.colorSizeStock[selectedColor][selectedSize]} adet)
                  </span>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  // Bu beden için stok kontrolü
                  const sizeStock = selectedColor && product.colorSizeStock?.[selectedColor]?.[size];
                  const isOutOfStock = sizeStock !== undefined && sizeStock === 0;

                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={isOutOfStock}
                      className={`px-5 py-3 border-2 rounded-lg font-semibold transition-all relative ${isSelected
                          ? 'border-primary bg-primary text-white shadow-md scale-105'
                          : isOutOfStock
                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                            : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                        }`}
                      title={isOutOfStock ? 'Stokta yok' : `${size} beden`}
                    >
                      {size}
                      {isOutOfStock && (
                        <span className="absolute top-0 right-0 text-xs bg-red-500 text-white px-1 rounded">Tükendi</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Renk: <span className="text-primary font-normal">{selectedColor}</span>
                {selectedSize && product.colorSizeStock?.[selectedColor]?.[selectedSize] !== undefined && (
                  <span className="text-xs text-gray-500 ml-2">
                    (Stok: {product.colorSizeStock[selectedColor][selectedSize]} adet)
                  </span>
                )}
              </label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => {
                  // Renk isimlerini hex kodlarına çevir
                  const getColorHex = (colorName) => {
                    const colorMap = {
                      'Siyah': '#000000',
                      'Beyaz': '#FFFFFF',
                      'Kırmızı': '#DC2626',
                      'Mavi': '#2563EB',
                      'Lacivert': '#1E3A8A',
                      'Pembe': '#EC4899',
                      'Sarı': '#FBBF24',
                      'Turuncu': '#F97316',
                      'Yeşil': '#10B981',
                      'Gri': '#6B7280',
                      'Krem': '#FEF3C7',
                      'Bej': '#F5F5DC',
                      'Bordo': '#991B1B',
                      'Kahverengi': '#92400E',
                      'Açık Mavi': '#93C5FD',
                    };
                    return colorMap[colorName] || '#CCCCCC';
                  };

                  const colorHex = getColorHex(color);
                  const isSelected = selectedColor === color;
                  // Bu renk için toplam stok kontrolü (seçili beden varsa)
                  const colorTotalStock = selectedSize && product.colorSizeStock?.[color]?.[selectedSize];
                  const isOutOfStock = colorTotalStock !== undefined && colorTotalStock === 0;

                  return (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        setSelectedImage(0); // Renk değiştiğinde ilk görsele dön
                      }}
                      disabled={isOutOfStock}
                      className={`relative w-12 h-12 rounded-full border-2 transition-all ${isSelected
                          ? 'border-primary scale-110 shadow-lg'
                          : isOutOfStock
                            ? 'border-gray-200 opacity-50 cursor-not-allowed'
                            : 'border-gray-300 hover:border-primary hover:scale-105'
                        }`}
                      style={{ backgroundColor: colorHex }}
                      title={isOutOfStock ? `${color} - Stokta yok` : color}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-white drop-shadow-lg"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                      {isOutOfStock && !isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs text-red-600 font-bold">×</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Seçilen renk: {selectedColor}
                {selectedSize && product.colorSizeStock?.[selectedColor]?.[selectedSize] !== undefined ? (
                  <span className="ml-2 font-semibold">
                    - {selectedSize} beden: {product.colorSizeStock[selectedColor][selectedSize]} adet stokta
                  </span>
                ) : selectedColor && !selectedSize ? (
                  <span className="ml-2 text-gray-400 text-xs">(Lütfen beden seçin)</span>
                ) : null}
              </p>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Adet</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={!hasValidSelection || availableStock === 0}
                className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span className="text-lg font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                disabled={!hasValidSelection || availableStock === 0}
                className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
              <span className="text-sm text-gray-500 ml-4">
                {requiresColorSizeSelection ? (
                  selectedColor && selectedSize && product.colorSizeStock?.[selectedColor]?.[selectedSize] !== undefined
                    ? `Stok: ${availableStock} adet (${selectedColor} - ${selectedSize})`
                    : selectedColor && !selectedSize
                      ? 'Lütfen beden seçin'
                      : !selectedColor && selectedSize
                        ? 'Lütfen renk seçin'
                        : 'Lütfen renk ve beden seçin'
                ) : (
                  `Stok: ${availableStock} adet`
                )}
              </span>
            </div>
          </div>

          {/* Add to Cart and Favorite */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={!hasValidSelection || availableStock === 0}
              className={`flex-1 py-4 rounded-lg font-semibold text-lg transition-colors ${!hasValidSelection || availableStock === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-dark'
                }`}
            >
              {!hasValidSelection
                ? (requiresColorSizeSelection ? 'Renk ve Beden Seçin' : 'Sepete Ekle')
                : availableStock === 0
                  ? 'Stokta Yok'
                  : 'Sepete Ekle'}
            </button>
            <button
              onClick={toggleFavorite}
              className={`px-6 py-4 rounded-lg font-semibold text-lg transition-colors border-2 ${isFavorite
                  ? 'border-pink-500 text-pink-500 bg-pink-50 hover:bg-pink-100'
                  : 'border-gray-300 text-gray-700 hover:border-pink-500 hover:text-pink-500'
                }`}
              title={isFavorite ? 'Favorilerden Kaldır' : 'Favorilere Ekle'}
            >
              <svg
                className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`}
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
        </div>
      </div>
    </div>
  );
}

