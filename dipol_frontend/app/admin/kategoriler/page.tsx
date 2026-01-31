'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/AdminNavbar';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import Image from 'next/image';
import ImageUpload from '@/components/ImageUpload';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string | Category;
  order?: number;
  active?: boolean;
}

export default function AdminCategoriesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    parent: '',
    order: 0,
    active: true,
  });
  const [subCategories, setSubCategories] = useState<Array<{
    name: string;
    slug: string;
    description: string;
    image: string;
    order: number;
  }>>([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchCategories();
    }
  }, [user]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const [allRes, parentsRes] = await Promise.all([
        api.getCategories(),
        api.getCategories({ parentOnly: true }), // API client kullan
      ]);
      
      if (allRes.ok) {
        const data = await allRes.json();
        const categoriesData = data.categories || data || [];
        // Null/undefined kategorileri filtrele
        const filteredCategories = categoriesData.filter((c: Category) => c && c._id);
        setCategories(filteredCategories);
      }
      
      if (parentsRes.ok) {
        const parentsData = await parentsRes.json();
        const parentsCategories = parentsData.categories || [];
        // Null/undefined kategorileri filtrele
        const filteredParents = parentsCategories.filter((c: Category) => c && c._id);
        setParentCategories(filteredParents);
      } else {
        // Fallback: Tüm kategorilerden parent olmayanları al
        const mainCats = categories.filter((c: Category) => !c.parent || (typeof c.parent === 'object' && !c.parent._id));
        setParentCategories(mainCats);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Kategoriler yüklenemedi:', error);
      }
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let mainCategoryId: string | null = null;
      
      // Ana kategori oluştur/güncelle
      let res;
      if (editingCategory) {
        res = await api.updateCategory(editingCategory._id, formData);
        if (res.ok) {
          const updated = await res.json();
          mainCategoryId = updated._id;
        }
      } else {
        res = await api.createCategory(formData);
        if (res.ok) {
          const created = await res.json();
          mainCategoryId = created._id;
        }
      }

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Bir hata oluştu');
        return;
      }

      // Alt kategorileri işle
      if (mainCategoryId) {
        if (editingCategory) {
          // Düzenleme modunda: Mevcut alt kategorileri al
          const existingSubsRes = await api.getCategories({ parentId: mainCategoryId });
          const existingSubs = existingSubsRes.ok ? (await existingSubsRes.json()).categories || [] : [];
          
          const validSubCategories = subCategories.filter(subCat => subCat.name.trim() && subCat.slug.trim());
          const validSubSlugs = validSubCategories.map(sub => sub.slug);
          
          // Formdan kaldırılan alt kategorileri sil
          for (const existingSub of existingSubs) {
            if (!validSubSlugs.includes(existingSub.slug)) {
              await api.deleteCategory(existingSub._id);
            }
          }
          
          // Her bir alt kategori için güncelle veya oluştur
          for (const subCat of validSubCategories) {
            const existingSub = existingSubs.find((s: Category) => s.slug === subCat.slug);
            if (existingSub) {
              // Mevcut alt kategoriyi güncelle
              await api.updateCategory(existingSub._id, {
                ...subCat,
                parent: mainCategoryId,
                active: true,
              });
            } else {
              // Yeni alt kategori oluştur
              await api.createCategory({
                ...subCat,
                parent: mainCategoryId,
                active: true,
              });
            }
          }
        } else if (subCategories.length > 0) {
          // Yeni kategori modunda: Alt kategorileri oluştur
          const validSubCategories = subCategories.filter(subCat => subCat.name.trim() && subCat.slug.trim());
          const subCategoryPromises = validSubCategories.map((subCat) =>
            api.createCategory({
              ...subCat,
              parent: mainCategoryId,
              active: true,
            })
          );
          
          if (subCategoryPromises.length > 0) {
            await Promise.all(subCategoryPromises);
          }
        }
      }

      alert(editingCategory ? 'Kategori güncellendi' : 'Kategori(ler) eklendi');
      setShowForm(false);
      setEditingCategory(null);
      setFormData({ name: '', slug: '', description: '', image: '', parent: '', order: 0, active: true });
      setSubCategories([]);
      await fetchCategories(); // await ekledik
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Form gönderme hatası:', error);
      }
      alert('Bir hata oluştu');
    }
  };

  const addSubCategory = () => {
    setSubCategories([
      ...subCategories,
      {
        name: '',
        slug: '',
        description: '',
        image: '',
        order: subCategories.length,
      },
    ]);
  };

  const removeSubCategory = (index: number) => {
    setSubCategories(subCategories.filter((_, i) => i !== index));
  };

  const updateSubCategory = (index: number, field: string, value: string | number) => {
    const updated = [...subCategories];
    updated[index] = { ...updated[index], [field]: value };
    setSubCategories(updated);
  };

  const updateSubCategoryFields = (index: number, updates: Partial<typeof subCategories[0]>) => {
    const updated = [...subCategories];
    updated[index] = { ...updated[index], ...updates };
    setSubCategories(updated);
  };

  const handleEdit = async (category: Category) => {
    setEditingCategory(category);
    // parent null kontrolü
    let parentId = '';
    if (category.parent) {
      parentId = typeof category.parent === 'object' && category.parent._id 
        ? category.parent._id 
        : (typeof category.parent === 'string' ? category.parent : '');
    }
    
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image || '',
      parent: parentId,
      order: category.order || 0,
      active: category.active !== false,
    });
    
    // Eğer ana kategori düzenleniyorsa, alt kategorilerini yükle
    if (!parentId) {
      try {
        const subRes = await api.getCategories({ parentId: category._id });
        if (subRes.ok) {
          const subData = await subRes.json();
          const subs = (subData.categories || []).map((sub: Category) => ({
            name: sub.name,
            slug: sub.slug,
            description: sub.description || '',
            image: sub.image || '',
            order: sub.order || 0,
          }));
          setSubCategories(subs);
        }
      } catch (error) {
        console.warn('Alt kategoriler yüklenemedi:', error);
        setSubCategories([]);
      }
    } else {
      setSubCategories([]);
    }
    
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      const res = await api.deleteCategory(id);
      if (res.ok) {
        alert('Kategori silindi');
        await fetchCategories(); // Listeyi yeniden yükle ve await et
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || 'Kategori silinemedi');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Silme hatası:', error);
      }
      alert('Kategori silinemedi');
    }
  };

  if (loading || !user || user.role !== 'admin') {
    return null;
  }

  const mainCategories = categories.filter(c => c && !c.parent);
  
  // Ana kategorileri alt kategorileriyle birlikte grupla
  const categoriesWithSubs = mainCategories
    .filter(mainCat => mainCat && mainCat._id) // null kontrolü
    .map(mainCat => {
      const subs = categories.filter(c => {
        if (!c || !c.parent) return false;
        const parentId = typeof c.parent === 'object' && c.parent 
          ? c.parent._id 
          : (typeof c.parent === 'string' ? c.parent : null);
        return parentId === mainCat._id;
      });
      return { ...mainCat, subCategories: subs };
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Kategori Yönetimi</h1>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingCategory(null);
                setFormData({ name: '', slug: '', description: '', image: '', parent: '', order: 0, active: true });
                setSubCategories([]);
              }}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              + Yeni Kategori Ekle
            </button>
          </div>

          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Kategori Adı *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name
                        .toLowerCase()
                        .replace(/ğ/g, 'g')
                        .replace(/ü/g, 'u')
                        .replace(/ş/g, 's')
                        .replace(/ı/g, 'i')
                        .replace(/ö/g, 'o')
                        .replace(/ç/g, 'c')
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-+|-+$/g, '');
                      setFormData({ ...formData, name, slug });
                    }}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Açıklama</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <ImageUpload
                    value={formData.image}
                    onChange={(value) => setFormData({ ...formData, image: value })}
                    label="Görsel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ana Kategori (Alt kategori için)</label>
                  <select
                    value={formData.parent}
                    onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Ana Kategori (Alt kategori değil)</option>
                    {parentCategories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Sıra</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-8">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="active" className="text-sm font-medium">
                      Aktif
                    </label>
                  </div>
                </div>

                {/* Alt Kategoriler (Ana kategori için) */}
                {formData.parent === '' && (
                  <div className="border-t pt-6 mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold">Alt Kategoriler (Opsiyonel)</h3>
                      <button
                        type="button"
                        onClick={addSubCategory}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        + Alt Kategori Ekle
                      </button>
                    </div>
                    
                    {subCategories.map((subCat, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold">Alt Kategori {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeSubCategory(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Kaldır
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Adı *</label>
                            <input
                              type="text"
                              value={subCat.name}
                              onChange={(e) => {
                                const name = e.target.value;
                                const slug = name
                                  .toLowerCase()
                                  .replace(/ğ/g, 'g')
                                  .replace(/ü/g, 'u')
                                  .replace(/ş/g, 's')
                                  .replace(/ı/g, 'i')
                                  .replace(/ö/g, 'o')
                                  .replace(/ç/g, 'c')
                                  .replace(/[^a-z0-9]+/g, '-')
                                  .replace(/^-+|-+$/g, '');
                                // Her iki field'ı aynı anda güncelle
                                updateSubCategoryFields(index, { name, slug });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Slug *</label>
                            <input
                              type="text"
                              value={subCat.slug}
                              onChange={(e) => updateSubCategory(index, 'slug', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              required
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Açıklama</label>
                            <textarea
                              value={subCat.description}
                              onChange={(e) => updateSubCategory(index, 'description', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <ImageUpload
                              value={subCat.image}
                              onChange={(value) => updateSubCategory(index, 'image', value)}
                              label="Görsel"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Sıra</label>
                            <input
                              type="number"
                              value={subCat.order}
                              onChange={(e) => updateSubCategory(index, 'order', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    {editingCategory ? 'Güncelle' : 'Kaydet'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingCategory(null);
                      setFormData({ name: '', slug: '', description: '', image: '', parent: '', order: 0, active: true });
                      setSubCategories([]);
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
              </div>
            </div>
          )}

          {loadingCategories ? (
            <div className="text-center py-12">Yükleniyor...</div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Ana Kategoriler</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoriesWithSubs.map((category) => (
                    <div key={category._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      {category.image && (
                        <div className="relative h-48">
                          {category.image.startsWith('data:image') ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              unoptimized
                            />
                          )}
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                        {category.description && (
                          <p className="text-gray-600 mb-4 text-sm">{category.description}</p>
                        )}
                        
                        {/* Alt Kategoriler */}
                        {category.subCategories && category.subCategories.length > 0 && (
                          <div className="mb-4 pb-4 border-b border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Alt Kategoriler:</h4>
                            <div className="space-y-2">
                              {category.subCategories
                                .filter((subCat: Category) => subCat && subCat._id) // null kontrolü
                                .map((subCat: Category) => (
                                <div key={subCat._id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                  <div className="flex-1">
                                    <span className="text-sm text-gray-700">{subCat.name || 'İsimsiz'}</span>
                                  </div>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => handleEdit(subCat)}
                                      className="px-2 py-1 text-xs bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                                    >
                                      Düzenle
                                    </button>
                                    <button
                                      onClick={() => handleDelete(subCat._id)}
                                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                    >
                                      Sil
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm"
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleDelete(category._id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

