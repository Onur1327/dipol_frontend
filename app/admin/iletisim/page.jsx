'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/AdminNavbar';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export default function ContactPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Türkiye',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
    },
    businessHours: {
      weekdays: '',
      weekend: '',
    },
    shippingCost: 50,
    freeShippingThreshold: 2500,
    featuredCategories: [],
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchContact();
      fetchCategories();
    }
  }, [user]);

  const fetchCategories = async () => {
    try {
      const res = await api.getCategories();
      if (res.ok) {
        const data = await res.json();
        const categories = data.categories || data || [];
        setAllCategories(categories);
      }
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    }
  };

  const fetchContact = async () => {
    try {
      setLoadingData(true);
      const res = await api.getContact();
      if (res.ok) {
        const data = await res.json();
        setFormData({
          companyName: data.companyName || '',
          email: data.email || '',
          phone: data.phone || '',
          whatsappNumber: data.whatsappNumber || '',
          address: data.address || '',
          city: data.city || '',
          postalCode: data.postalCode || '',
          country: data.country || 'Türkiye',
          socialMedia: data.socialMedia || {
            facebook: '',
            instagram: '',
            twitter: '',
            linkedin: '',
          },
          businessHours: data.businessHours || {
            weekdays: '',
            weekend: '',
          },
          shippingCost: data.shippingCost || 50,
          freeShippingThreshold: data.freeShippingThreshold || 2500,
          featuredCategories: data.featuredCategories || [],
        });
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('İletişim bilgileri yüklenemedi:', error);
      }
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.updateContact(formData);
      if (res.ok) {
        alert('İletişim bilgileri güncellendi');
      } else {
        alert('Güncelleme başarısız');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Contact update error:', error);
      }
      alert('Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">İletişim Bilgileri</h1>

          {loadingData ? (
            <div className="text-center py-12">Yükleniyor...</div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Şirket Adı
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Numarası
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsappNumber || ''}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="905551234567 (ülke kodu ile, boşluk olmadan)"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Örnek: 905551234567</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Şehir
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adres
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Posta Kodu
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ülke
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-xl font-bold mb-4">Sosyal Medya</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={formData.socialMedia?.facebook || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialMedia: { ...formData.socialMedia, facebook: e.target.value },
                      })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={formData.socialMedia?.instagram || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialMedia: { ...formData.socialMedia, instagram: e.target.value },
                      })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Twitter
                    </label>
                    <input
                      type="url"
                      value={formData.socialMedia?.twitter || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialMedia: { ...formData.socialMedia, twitter: e.target.value },
                      })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={formData.socialMedia?.linkedin || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialMedia: { ...formData.socialMedia, linkedin: e.target.value },
                      })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-xl font-bold mb-4">Çalışma Saatleri</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hafta İçi
                    </label>
                    <input
                      type="text"
                      value={formData.businessHours?.weekdays || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        businessHours: { ...formData.businessHours, weekdays: e.target.value },
                      })}
                      placeholder="Örn: 09:00 - 18:00"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hafta Sonu
                    </label>
                    <input
                      type="text"
                      value={formData.businessHours?.weekend || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        businessHours: { ...formData.businessHours, weekend: e.target.value },
                      })}
                      placeholder="Örn: 10:00 - 16:00"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-xl font-bold mb-4">Öne Çıkan Kategoriler</h2>
                <p className="text-sm text-gray-600 mb-4">Ana sayfada gösterilecek 3 kategoriyi seçin (en fazla 3)</p>
                <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-4">
                  {allCategories
                    .filter((cat) => !cat.parent || !cat.parent._id) // Sadece ana kategoriler
                    .map((category) => {
                      const isSelected = formData.featuredCategories?.includes(category._id);
                      const canSelect = !isSelected && (formData.featuredCategories?.length || 0) < 3;
                      return (
                        <label
                          key={category._id}
                          className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${isSelected ? 'bg-primary/10' : canSelect ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed'
                            }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={!canSelect && !isSelected}
                            onChange={(e) => {
                              const current = formData.featuredCategories || [];
                              if (e.target.checked) {
                                if (current.length < 3) {
                                  setFormData({
                                    ...formData,
                                    featuredCategories: [...current, category._id],
                                  });
                                }
                              } else {
                                setFormData({
                                  ...formData,
                                  featuredCategories: current.filter((id) => id !== category._id),
                                });
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{category.name}</span>
                        </label>
                      );
                    })}
                </div>
                {formData.featuredCategories && formData.featuredCategories.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Seçili: {formData.featuredCategories.length}/3
                  </p>
                )}
              </div>

              <div className="border-t pt-6">
                <h2 className="text-xl font-bold mb-4">Kargo Ayarları</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kargo Ücreti (₺)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.shippingCost || 50}
                      onChange={(e) => setFormData({
                        ...formData,
                        shippingCost: parseFloat(e.target.value) || 0,
                      })}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">2500 TL altındaki siparişler için uygulanacak kargo ücreti</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ücretsiz Kargo Eşiği (₺)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.freeShippingThreshold || 2500}
                      onChange={(e) => setFormData({
                        ...formData,
                        freeShippingThreshold: parseFloat(e.target.value) || 0,
                      })}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Bu tutar ve üzeri alışverişlerde kargo ücretsiz olacak</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

