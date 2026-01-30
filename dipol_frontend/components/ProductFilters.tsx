'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

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

  const handleCategoryChange = (categoryValue: string) => {
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    params.delete('page');
    router.push(`/urunler?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
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

      {(selectedCategory || searchTerm) && (
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

