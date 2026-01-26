'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

function OrdersPreview() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.getOrders();
      if (res.ok) {
        const data = await res.json();
        // Son 3 siparişi göster
        setOrders(data.slice(0, 3));
      }
    } catch (error) {
      console.error('Siparişler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Bu siparişi iptal etmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const res = await api.updateOrder(orderId, { orderStatus: 'cancelled' });
      if (res.ok) {
        alert('Sipariş iptal edildi');
        fetchOrders(); // Siparişleri yeniden yükle
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Sipariş iptal edilemedi');
      }
    } catch (error) {
      console.error('Sipariş iptal hatası:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  if (loading) {
    return <p className="text-gray-500">Yükleniyor...</p>;
  }

  if (orders.length === 0) {
    return (
      <div>
        <p className="text-gray-500 mb-4">Henüz siparişiniz yok.</p>
        <Link
          href="/siparisler"
          className="text-primary hover:underline"
        >
          Tüm siparişleri görüntüle →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4 mb-4">
        {orders.map((order) => (
          <div key={order._id} className="border-b pb-4 last:border-b-0">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">Sipariş #{order._id.slice(-8)}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{order.totalPrice.toFixed(2)} ₺</p>
                <p className={`text-sm ${
                  order.orderStatus === 'delivered' ? 'text-green-600' :
                  order.orderStatus === 'cancelled' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {order.orderStatus === 'pending' && 'Beklemede'}
                  {order.orderStatus === 'processing' && 'İşleniyor'}
                  {order.orderStatus === 'shipped' && 'Kargoda'}
                  {order.orderStatus === 'delivered' && 'Teslim Edildi'}
                  {order.orderStatus === 'cancelled' && 'İptal Edildi'}
                </p>
              </div>
            </div>
            {/* İptal Butonu - Sadece pending veya processing durumundaki siparişler için */}
            {(order.orderStatus === 'pending' || order.orderStatus === 'processing') && (
              <div className="mt-3">
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                >
                  İptal Et
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <Link
        href="/siparisler"
        className="text-primary hover:underline font-semibold"
      >
        Tüm siparişleri görüntüle →
      </Link>
    </div>
  );
}

export default function AccountPage() {
  const { user: authUser, loading, logout } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'Türkiye',
    },
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !authUser) {
      router.push('/giris');
    }
  }, [authUser, loading, router]);

  useEffect(() => {
    if (authUser) {
      fetchUserData();
    }
  }, [authUser]);

  const fetchUserData = async () => {
    try {
      setLoadingUser(true);
      const res = await api.getCurrentUser();
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          address: {
            street: data.address?.street || '',
            city: data.address?.city || '',
            postalCode: data.address?.postalCode || '',
            country: data.address?.country || 'Türkiye',
          },
        });
      }
    } catch (error) {
      console.error('Kullanıcı bilgileri yüklenemedi:', error);
    } finally {
      setLoadingUser(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await api.updateCurrentUser(formData);
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setEditing(false);
        alert('Bilgileriniz güncellendi');
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Güncelleme başarısız');
      }
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      alert('Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingUser || !authUser || !user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Hesabım</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Bilgilerim</h2>
              <div className="flex gap-3">
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Düzenle
                  </button>
                )}
                <button
                  onClick={() => {
                    logout();
                    router.push('/');
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Çıkış Yap
                </button>
              </div>
            </div>
            
            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    value={user.email}
                    disabled
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">E-posta adresi değiştirilemez</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="05XX XXX XX XX"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">Adres Bilgileri</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Adres
                      </label>
                      <textarea
                        value={formData.address.street}
                        onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                        placeholder="Mahalle, Sokak, Bina No, Daire No"
                        rows={3}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Şehir
                        </label>
                        <input
                          type="text"
                          value={formData.address.city}
                          onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                          placeholder="İstanbul"
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Posta Kodu
                        </label>
                        <input
                          type="text"
                          value={formData.address.postalCode}
                          onChange={(e) => setFormData({ ...formData, address: { ...formData.address, postalCode: e.target.value } })}
                          placeholder="34000"
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ülke
                      </label>
                      <input
                        type="text"
                        value={formData.address.country}
                        onChange={(e) => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      fetchUserData();
                    }}
                    className="flex-1 border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p><span className="font-semibold">Ad Soyad:</span> {user.name}</p>
                <p><span className="font-semibold">E-posta:</span> {user.email}</p>
                {user.phone && <p><span className="font-semibold">Telefon:</span> {user.phone}</p>}
                <p><span className="font-semibold">Rol:</span> {user.role === 'admin' ? 'Admin' : 'Kullanıcı'}</p>
                {user.address && (user.address.street || user.address.city) && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="font-semibold mb-2">Adres:</p>
                    <p className="text-gray-700">
                      {user.address.street && <>{user.address.street}<br /></>}
                      {user.address.city && user.address.postalCode && (
                        <>{user.address.city} {user.address.postalCode}<br /></>
                      )}
                      {user.address.country && <>{user.address.country}</>}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Hızlı Linkler</h2>
            <div className="space-y-2">
              <Link
                href="/siparisler"
                className="block text-primary hover:underline"
              >
                Siparişlerim
              </Link>
              <Link
                href="/sepet"
                className="block text-primary hover:underline"
              >
                Sepetim
              </Link>
              <Link
                href="/iade"
                className="block text-primary hover:underline"
              >
                İade ve Değişim
              </Link>
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="block text-primary hover:underline"
                >
                  Admin Paneli
                </Link>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Son Siparişlerim</h2>
            <OrdersPreview />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

