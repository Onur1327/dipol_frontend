'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/AdminNavbar';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import Image from 'next/image';
import ImageUpload from '@/components/ImageUpload';

export default function CarouselPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [carousels, setCarousels] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCarousel, setEditingCarousel] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    buttonText: '',
    order: 0,
    active: true,
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchCarousels();
    }
  }, [user]);

  const fetchCarousels = async () => {
    try {
      setLoadingData(true);
      const res = await api.getCarousels();
      if (res.ok) {
        const data = await res.json();
        setCarousels(data.carousels || data || []);
      } else if (res.status !== 404) {
        // 404 hatası normal (henüz deploy edilmemiş olabilir), diğer hataları logla
        if (process.env.NODE_ENV === 'development') {
          console.warn('Carousel verileri yüklenemedi:', res.status);
        }
      }
    } catch (error) {
      // Sadece development'ta detaylı log
      if (process.env.NODE_ENV === 'development') {
        console.warn('Carousel fetch error:', error);
      }
    } finally {
      setLoadingData(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCarousel) {
        const res = await api.updateCarousel(editingCarousel._id, formData);
        if (res.ok) {
          alert('Carousel güncellendi');
          await fetchCarousels();
          resetForm();
        } else {
          const error = await res.json().catch(() => ({ error: 'Güncelleme başarısız' }));
          alert(error.error || 'Güncelleme başarısız');
        }
      } else {
        const res = await api.createCarousel(formData);
        if (res.ok) {
          alert('Carousel oluşturuldu');
          await fetchCarousels();
          resetForm();
        } else {
          const error = await res.json().catch(() => ({ error: 'Oluşturma başarısız' }));
          alert(error.error || 'Oluşturma başarısız');
        }
      }
    } catch (error) {
      // Sadece development'ta detaylı log
      if (process.env.NODE_ENV === 'development') {
        console.warn('Carousel submit error:', error);
      }
      alert(error.message || 'Bir hata oluştu');
    }
  };

  const handleEdit = (carousel) => {
    setEditingCarousel(carousel);
    setFormData({
      title: carousel.title || '',
      subtitle: carousel.subtitle || '',
      image: (carousel.image ?? '').toString(), // Always string
      link: carousel.link || '',
      buttonText: carousel.buttonText || '',
      order: carousel.order || 0,
      active: carousel.active !== false,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu carousel öğesini silmek istediğinize emin misiniz?')) return;

    try {
      const res = await api.deleteCarousel(id);
      if (res.ok) {
        await fetchCarousels();
      } else {
        alert('Silme başarısız');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Carousel delete error:', error);
      }
      alert('Bir hata oluştu');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      image: '',
      link: '',
      buttonText: '',
      order: 0,
      active: true,
    });
    setEditingCarousel(null);
    setShowForm(false);
  };

  if (loading || !user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Carousel Yönetimi</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              {showForm ? 'İptal' : '+ Yeni Carousel'}
            </button>
          </div>

          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-bold mb-4">
                {editingCarousel ? 'Carousel Düzenle' : 'Yeni Carousel Ekle'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Başlık
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alt Başlık
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <ImageUpload
                      onChange={(value) => setFormData({ ...formData, image: value })}
                      label="Görsel"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link (opsiyonel)
                    </label>
                    <input
                      type="url"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Buton Metni (opsiyonel)
                    </label>
                    <input
                      type="text"
                      value={formData.buttonText}
                      onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sıra
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="active" className="text-sm font-medium text-gray-700">
                    Aktif
                  </label>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    {editingCarousel ? 'Güncelle' : 'Oluştur'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          )}

          {loadingData ? (
            <div className="text-center py-12">Yükleniyor...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {carousels.map((carousel) => (
                <div key={carousel._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-48">
                    {carousel.image ? (
                      carousel.image.startsWith('data:image') ? (
                        <img
                          src={carousel.image}
                          alt={carousel.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={carousel.image}
                          alt={carousel.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Görsel Yok</span>
                      </div>
                    )}
                    {!carousel.active && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                        Pasif
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{carousel.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{carousel.subtitle}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-gray-500">Sıra: {carousel.order}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(carousel)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(carousel._id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loadingData && carousels.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">Henüz carousel öğesi eklenmemiş</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

