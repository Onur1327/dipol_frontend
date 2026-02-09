'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/AdminNavbar';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export default function AdminOrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await api.getOrders();
      if (res.ok) {
        const data = await res.json();
        // Array kontrolü yap
        const ordersArray = Array.isArray(data) ? data : (data.orders || []);
        setOrders(ordersArray);
        if (process.env.NODE_ENV === 'development') {
          console.log('Yüklenen sipariş sayısı:', ordersArray.length);
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('Siparişler yüklenemedi:', res.status, errorData);
      }
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await api.updateOrder(orderId, { orderStatus: newStatus });
      if (res.ok) {
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );
        alert('Sipariş durumu güncellendi');
        fetchOrders(); // Siparişleri yeniden yükle
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Sipariş durumu güncellenemedi');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Güncelleme hatası:', error);
      }
      alert('Sipariş durumu güncellenemedi');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Beklemede',
      processing: 'İşleniyor',
      shipped: 'Kargoya Verildi',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi',
    };
    return texts[status];
  };

  if (loading || !user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Sipariş Yönetimi</h1>

          {loadingOrders ? (
            <div className="text-center py-12">Yükleniyor...</div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">Sipariş #{order._id.slice(-6)}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {getStatusText(order.orderStatus)}
                      </span>
                      <p className="text-lg font-bold text-primary mt-2">
                        {order.totalPrice?.toFixed(2) || '0.00'} ₺
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Müşteri Bilgileri</h4>
                    <p className="text-sm text-gray-600">{order.user?.name || 'Silinmiş Kullanıcı'}</p>
                    <p className="text-sm text-gray-600">{order.user?.email || 'Email Yok'}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Teslimat Adresi</h4>
                    <p className="text-sm text-gray-600">{order.shippingAddress?.name || 'İsim Yok'}</p>
                    <p className="text-sm text-gray-600">{order.shippingAddress?.address || 'Adres Yok'}</p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress?.city || ''} {order.shippingAddress?.postalCode || ''}
                    </p>
                    <p className="text-sm text-gray-600">{order.shippingAddress?.country || ''}</p>
                    {order.contactInfo && (
                      <>
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>E-posta:</strong> {order.contactInfo.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Telefon:</strong> {order.contactInfo.phone}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Sipariş Detayları</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <div>
                            <span className="font-medium">{item.product?.name || 'Silinmiş Ürün'}</span>
                            {item.size && <span className="text-gray-500"> - Beden: {item.size}</span>}
                            {item.color && <span className="text-gray-500"> - Renk: {item.color}</span>}
                            <span className="text-gray-500"> x{item.quantity}</span>
                          </div>
                          <span className="font-medium">
                            {(item.price * item.quantity).toFixed(2)} ₺
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <label className="text-sm font-medium text-gray-700">Durum:</label>
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusUpdate(order._id, e.target.value)
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="pending">Beklemede</option>
                      <option value="processing">İşleniyor</option>
                      <option value="shipped">Kargoya Verildi</option>
                      <option value="delivered">Teslim Edildi</option>
                      <option value="cancelled">İptal Edildi</option>
                    </select>
                  </div>
                </div>
              ))}

              {orders.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Henüz sipariş bulunmuyor
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

