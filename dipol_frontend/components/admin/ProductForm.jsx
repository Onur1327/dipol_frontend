'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import Image from 'next/image';
import ImageUpload from '@/components/ImageUpload';

export default function ProductForm({ product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || 0,
    comparePrice: product?.comparePrice || '',
    category: product?.category?._id || product?.category || '',
    sizes: product?.sizes || [],
    colors: product?.colors || [],
    stock: product?.stock || 0,
    featured: product?.featured || false,
    status: product?.status || 'active',
  });

  const [images, setImages] = useState(product?.images || []);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [tempImageUrl, setTempImageUrl] = useState('');

  // MongoDB Map'i object'e dönüştür
  const parseColorImages = (colorImagesData) => {
    if (!colorImagesData) return {};

    // Eğer zaten object ise
    if (typeof colorImagesData === 'object' && !Array.isArray(colorImagesData)) {
      // Map ise entries'e çevir
      if (colorImagesData instanceof Map || colorImagesData.constructor?.name === 'Map') {
        return Object.fromEntries(colorImagesData);
      }
      // Normal object ise direkt dön
      return colorImagesData;
    }

    return {};
  };

  const [colorImages, setColorImages] = useState(
    parseColorImages(product?.colorImages)
  );
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newColorImageUrl, setNewColorImageUrl] = useState({});
  const [tempColorImageUrl, setTempColorImageUrl] = useState({});

  // Renk/Beden kombinasyonuna göre stok yönetimi
  const parseColorSizeStock = (colorSizeStockData) => {
    if (!colorSizeStockData) return {};

    // MongoDB Map yapısını object'e dönüştür
    if (colorSizeStockData instanceof Map || colorSizeStockData.constructor?.name === 'Map') {
      const result = {};
      colorSizeStockData.forEach((sizeMap, color) => {
        if (sizeMap instanceof Map) {
          result[color] = Object.fromEntries(sizeMap);
        } else {
          result[color] = sizeMap;
        }
      });
      return result;
    }

    // Normal object ise direkt dön
    if (typeof colorSizeStockData === 'object') {
      const result = {};
      Object.entries(colorSizeStockData).forEach(([color, sizeMap]) => {
        if (sizeMap instanceof Map) {
          result[color] = Object.fromEntries(sizeMap);
        } else {
          result[color] = sizeMap;
        }
      });
      return result;
    }

    return {};
  };

  const [colorSizeStock, setColorSizeStock] = useState(
    parseColorSizeStock(product?.colorSizeStock)
  );

  useEffect(() => {
    fetchCategories();
    if (product) {
      // Slug'ı otomatik oluştur
      if (!product.slug && product.name) {
        const slug = product.name
          .toLowerCase()
          .replace(/ğ/g, 'g')
          .replace(/ü/g, 'u')
          .replace(/ş/g, 's')
          .replace(/ı/g, 'i')
          .replace(/ö/g, 'o')
          .replace(/ç/g, 'c')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        setFormData((prev) => ({ ...prev, slug }));
      }

      // colorImages'ı güncelle
      setColorImages(parseColorImages(product.colorImages));
    }
  }, [product]);

  const fetchCategories = async () => {
    try {
      const res = await api.getCategories();
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || data || []);
      }
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const checked = e.target.checked;

    if (name === 'name') {
      // Otomatik slug oluştur
      const slug = value
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        slug,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value,
      }));
    }
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()],
      }));
      setNewSize('');
    }
  };

  const removeSize = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== size),
    }));
  };

  const addColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, newColor.trim()],
      }));
      setColorImages((prev) => ({
        ...prev,
        [newColor.trim()]: [],
      }));
      setNewColor('');
    }
  };

  const removeColor = (color) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
    setColorImages((prev) => {
      const newColorImages = { ...prev };
      delete newColorImages[color];
      return newColorImages;
    });
  };

  const addColorImage = (color) => {
    const url = newColorImageUrl[color];
    if (url && url.trim()) {
      setColorImages((prev) => ({
        ...prev,
        [color]: [...(prev[color] || []), url.trim()],
      }));
      setNewColorImageUrl((prev) => ({ ...prev, [color]: '' }));
    }
  };

  const removeColorImage = (color, index) => {
    setColorImages((prev) => ({
      ...prev,
      [color]: prev[color].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Bekleyen (Ekle butonuna basılmamış) görselleri otomatik ekle
      let finalImages = [...images];
      if (tempImageUrl && tempImageUrl.trim()) {
        finalImages.push(tempImageUrl.trim());
      }

      // Bekleyen renkli görselleri otomatik ekle
      const finalColorImages = { ...colorImages };
      Object.entries(tempColorImageUrl).forEach(([color, url]) => {
        if (url && url.trim()) {
          finalColorImages[color] = [...(finalColorImages[color] || []), url.trim()];
        }
      });

      // colorSizeStock'u object olarak gönder (JSON serialize edilebilir)
      // Backend'de Map formatına dönüştürülecek
      const submitData = {
        ...formData,
        images: finalImages,
        colorImages: Object.keys(finalColorImages).length > 0 ? finalColorImages : undefined,
        colorSizeStock: Object.keys(colorSizeStock).length > 0 ? colorSizeStock : undefined,
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
      };

      let res;
      if (product) {
        res = await api.updateProduct(product._id, submitData);
      } else {
        res = await api.createProduct(submitData);
      }

      if (res.ok) {
        alert(product ? 'Ürün güncellendi' : 'Ürün eklendi');
        router.push('/admin/urunler');
      } else {
        const error = await res.json();
        alert(error.error || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Form gönderme hatası:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Temel Bilgiler */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Temel Bilgiler</h2>

        <div>
          <label className="block text-sm font-medium mb-2">Ürün Adı *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Slug *</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Açıklama *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Kategori *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Kategori Seçin</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fiyat Bilgileri */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Fiyat Bilgileri</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Fiyat (₺) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">İndirimli Fiyat (₺)</label>
            <input
              type="number"
              name="comparePrice"
              value={formData.comparePrice}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Genel Stok *</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            required
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">Renk/Beden bazlı stok girişi aşağıda yapılabilir</p>
        </div>
      </div>

      {/* Renk/Beden Bazlı Stok Yönetimi */}
      {formData.colors.length > 0 && formData.sizes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Renk/Beden Bazlı Stok Yönetimi</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Renk / Beden</th>
                  {formData.sizes.map((size) => (
                    <th key={size} className="border border-gray-300 px-4 py-2 text-center">
                      {size}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {formData.colors.map((color) => (
                  <tr key={color}>
                    <td className="border border-gray-300 px-4 py-2 font-semibold bg-gray-50">
                      {color}
                    </td>
                    {formData.sizes.map((size) => (
                      <td key={`${color}-${size}`} className="border border-gray-300 px-2 py-2">
                        <input
                          type="number"
                          min="0"
                          value={colorSizeStock[color]?.[size] || 0}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            setColorSizeStock((prev) => ({
                              ...prev,
                              [color]: {
                                ...(prev[color] || {}),
                                [size]: value,
                              },
                            }));
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Görseller */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Genel Görseller</h2>

        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <ImageUpload
                value={tempImageUrl}
                onChange={(value) => setTempImageUrl(value)}
                label=""
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (tempImageUrl.trim()) {
                  setImages([...images, tempImageUrl.trim()]);
                  setTempImageUrl('');
                }
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark self-end"
            >
              Ekle
            </button>
          </div>
          <div className="text-sm text-gray-500">
            Veya URL ile ekle:
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Görsel URL'si ekle"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="button"
              onClick={addImage}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Ekle
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => {
            const isBase64 = image.startsWith('data:image');
            return (
              <div key={index} className="relative group">
                <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                  {isBase64 ? (
                    <img
                      src={image}
                      alt={`Görsel ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={image}
                      alt={`Görsel ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 12.5vw"
                      unoptimized
                    />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Renk Bazlı Görseller */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Renk Bazlı Görseller</h2>

        {formData.colors.map((color) => (
          <div key={color} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">{color}</h3>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <ImageUpload
                    value={tempColorImageUrl[color] || ''}
                    onChange={(value) => setTempColorImageUrl((prev) => ({ ...prev, [color]: value }))}
                    label=""
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (tempColorImageUrl[color]?.trim()) {
                      setColorImages((prev) => ({
                        ...prev,
                        [color]: [...(prev[color] || []), tempColorImageUrl[color].trim()],
                      }));
                      setTempColorImageUrl((prev) => ({ ...prev, [color]: '' }));
                    }
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark self-end"
                >
                  Ekle
                </button>
              </div>
              <div className="text-sm text-gray-500">
                Veya URL ile ekle:
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newColorImageUrl[color] || ''}
                  onChange={(e) => setNewColorImageUrl((prev) => ({ ...prev, [color]: e.target.value }))}
                  placeholder={`${color} rengi için görsel URL'si`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => addColorImage(color)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Ekle
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {colorImages[color]?.map((image, index) => {
                const isBase64 = image.startsWith('data:image');
                return (
                  <div key={index} className="relative group">
                    <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                      {isBase64 ? (
                        <img
                          src={image}
                          alt={`${color} görsel ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={image}
                          alt={`${color} görsel ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 25vw, 12.5vw"
                          unoptimized
                        />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeColorImage(color, index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bedenler */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Bedenler</h2>

        <div className="flex gap-2">
          <input
            type="text"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            placeholder="Beden ekle (örn: S, M, L)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            type="button"
            onClick={addSize}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Ekle
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.sizes.map((size) => (
            <span
              key={size}
              className="px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-2"
            >
              {size}
              <button
                type="button"
                onClick={() => removeSize(size)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Renkler */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Renkler</h2>

        <div className="flex gap-2">
          <input
            type="text"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            placeholder="Renk ekle (örn: Siyah, Kırmızı)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            type="button"
            onClick={addColor}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Ekle
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.colors.map((color) => (
            <span
              key={color}
              className="px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-2"
            >
              {color}
              <button
                type="button"
                onClick={() => removeColor(color)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Diğer Ayarlar */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Diğer Ayarlar</h2>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="w-5 h-5"
            />
            <span>Öne Çıkan Ürün</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Durum</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
          </select>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {loading ? 'Kaydediliyor...' : product ? 'Güncelle' : 'Kaydet'}
        </button>
        <Link
          href="/admin/urunler"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          İptal
        </Link>
      </div>
    </form>
  );
}

