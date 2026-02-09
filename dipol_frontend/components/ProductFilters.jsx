'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [onSale, setOnSale] = useState(searchParams.get('onSale') === 'true');

  useEffect(() => {
    async function fetchCategories() {
      try {
        // Ana kategorileri öncelikli getir (backend parentOnly parametresini destekliyor)
        const res = await api.getCategories({ parentOnly: true });
        if (res.ok) {
          const data = await res.json();
          const all = data.categories || data || [];
          setCategories(all);
        }
      } catch (error) {
        console.error('Kategoriler yüklenemedi:', error);
      }
    }
    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryValue) => {
    setSelectedCategory(categoryValue);
    const params = new URLSearchParams(searchParams.toString());
    if (categoryValue) {
      // URL'de slug veya id kullanabiliriz; backend her ikisini de destekliyor
      params.set('category', categoryValue);
    } else {
      params.delete('category');
    }
    params.delete('page');
    router.push(`/urunler?${params.toString()}`);
  };



  const handleOnSaleChange = (e) => {
    const isChecked = e.target.checked;
    setOnSale(isChecked);
    const params = new URLSearchParams(searchParams.toString());
    if (isChecked) {
      params.set('onSale', 'true');
    } else {
      params.delete('onSale');
    }
    params.delete('page');
    router.push(`/urunler?${params.toString()}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    if (onSale) {
      params.set('onSale', 'true');
    }
    params.delete('page');
    router.push(`/urunler?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
    setOnSale(false);
    router.push('/urunler');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Filtreler</h2>

      <form onSubmit={handleSearch} className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Ürün ara..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="w-full mt-2 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Ara
        </button>
      </form>

      <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={onSale}
            onChange={handleOnSaleChange}
            className="w-5 h-5 text-red-600 rounded focus:ring-red-500 border-gray-300"
          />
          <span className="ml-2 text-red-700 font-medium">Sadece İndirimli Ürünler</span>
        </label>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Kategoriler</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value=""
              checked={!selectedCategory}
              onChange={() => handleCategoryChange('')}
              className="mr-2"
            />
            <span>Tümü</span>
          </label>
          {categories.map((category) => (
            <label key={category._id} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category.slug || category._id}
                // URL'den gelen değer id veya slug olabilir, her ikisine de bak
                checked={
                  selectedCategory === (category.slug || category._id) ||
                  selectedCategory === category._id
                }
                onChange={() => handleCategoryChange(category.slug || category._id)}
                className="mr-2"
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {(selectedCategory || searchTerm || onSale) && (
        <button
          onClick={clearFilters}
          className="w-full text-sm text-gray-600 hover:text-primary transition-colors"
        >
          Filtreleri Temizle
        </button>
      )}
    </div>
  );
}

