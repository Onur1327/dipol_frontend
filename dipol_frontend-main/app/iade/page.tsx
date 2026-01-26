'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export default function ReturnPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    orderNumber: '',
    reason: '',
    description: '',
    contactPhone: '',
    contactEmail: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/giris');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      const res = await api.createReturn({
        orderNumber: formData.orderNumber,
        reason: formData.reason,
        description: formData.description,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
      });

      if (res.ok) {
        const data = await res.json();
        alert(data.message || 'İade talebiniz alınmıştır. En kısa sürede size dönüş yapacağız.');
        setFormData({
          orderNumber: '',
          reason: '',
          description: '',
          contactPhone: '',
          contactEmail: user.email || '',
        });
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('İade talebi hatası:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">İade ve Değişim</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">İade Koşulları</h2>
            <div className="space-y-3 text-gray-700">
              <p>• Ürünleriniz teslim tarihinden itibaren 14 gün içinde iade edilebilir.</p>
              <p>• İade edilecek ürünler orijinal ambalajında, kullanılmamış ve hasarsız olmalıdır.</p>
              <p>• İç çamaşırı, mayo, bikini gibi kişisel ürünler sağlık nedenleriyle iade edilemez.</p>
              <p>• İade kargo ücreti müşteriye aittir.</p>
              <p>• İade işlemi onaylandıktan sonra ödeme 3-5 iş günü içinde hesabınıza iade edilir.</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">İade Talebi Oluştur</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sipariş Numarası *
                </label>
                <input
                  type="text"
                  value={formData.orderNumber}
                  onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Sipariş numaranızı girin"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İade Nedeni *
                </label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="size">Beden uyumsuzluğu</option>
                  <option value="color">Renk uyumsuzluğu</option>
                  <option value="defect">Ürün hatası</option>
                  <option value="wrong">Yanlış ürün gönderildi</option>
                  <option value="other">Diğer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={4}
                  placeholder="İade talebiniz hakkında detaylı bilgi verin"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İletişim Telefonu *
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="05XX XXX XX XX"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {submitting ? 'Gönderiliyor...' : 'İade Talebi Gönder'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

