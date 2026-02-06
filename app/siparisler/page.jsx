'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.getOrders();
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Siparişler yüklenemedi:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/giris');
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [user, loading, router]);

  const handleCancelOrder = async (orderId) => {
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

  if (loading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Siparişlerim</h1>

          {ordersLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Yükleniyor...</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-semibold">Sipariş #{order._id.slice(-8)}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{order.totalPrice.toFixed(2)} ₺</p>
                      <p className={`text-sm ${order.orderStatus === 'delivered' ? 'text-green-600' :
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

                  <div className="border-t pt-4">
                    <p className="font-semibold mb-2">Ürünler:</p>
                    <ul className="space-y-2">
                      {order.items.map((item, index) => (
                        <li key={index} className="flex justify-between text-sm">
                          <span>{item.name} x {item.quantity}</span>
                          <span>{item.price.toFixed(2)} ₺</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* İptal Butonu - Sadece pending veya processing durumundaki siparişler için */}
                  {(order.orderStatus === 'pending' || order.orderStatus === 'processing') && (
                    <div className="border-t pt-4 mt-4">
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                      >
                        Siparişi İptal Et
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">Henüz siparişiniz yok</p>
              <a
                href="/urunler"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Alışverişe Başla
              </a>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

