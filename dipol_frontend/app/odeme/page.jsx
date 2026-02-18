'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export default function CheckoutPage() {
  const { items, total, shippingCost, finalTotal, clearCart } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Türkiye',
    identityNumber: '',
  });

  const [cardData, setCardData] = useState({
    cardHolderName: '',
    cardNumber: '',
    expireMonth: '',
    expireYear: '',
    cvc: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const error = searchParams.get('error');
    if (error) {
      const messages = {
        'DogrulamaHatasi': 'Ödeme doğrulanamadı. Lütfen bankanızla iletişime geçin veya tekrar deneyin.',
        'OdemeBasarisiz': 'Ödeme işlemi başarısız oldu.',
        'SiparisBulunamadi': 'Sipariş bulunamadı.',
        'SistemselHata': 'Sistemsel bir hata oluştu.',
        'SiparisIDBulunamadi': 'Sipariş numarası bulunamadı.'
      };
      alert(messages[error] || 'Bir hata oluştu: ' + error);
      // Temizlemek için URL'i güncelle (isteğe bağlı ama kullanıcı deneyimi için iyi)
      // router.replace('/odeme', { scroll: false }); 
    }
  }, [searchParams]);

  const fetchUserData = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.getCurrentUser();
      if (res.ok) {
        const userData = await res.json();
        setFormData(prev => ({
          ...prev,
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address?.street || '',
          city: userData.address?.city || '',
          postalCode: userData.address?.postalCode || '',
          country: userData.address?.country || 'Türkiye',
          identityNumber: userData.identityNumber || '',
        }));
        setCardData(prev => ({
          ...prev,
          cardHolderName: (userData.name || '').toUpperCase(),
        }));
      }
    } catch (error) {
      console.error('Kullanıcı bilgileri yüklenemedi:', error);
    }
  }, [user]);

  useEffect(() => {
    if (loading || !isClient) return;

    if (!user) {
      router.push('/giris');
      return;
    }

    // Redirect logic with check for already being at checkout
    if (items.length === 0) {
      router.push('/sepet');
      return;
    }

    fetchUserData();
  }, [user, items.length, router, loading, isClient, fetchUserData]);

  const formatCardNumber = useCallback((value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  }, []);

  const handleIdentityNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    setFormData(prev => ({ ...prev, identityNumber: value }));
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardData(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);

      const paymentData = {
        items: items.map(item => ({
          product: item.product,
          name: item.name,
          image: item.image || '',
          price: Number(item.price.toFixed(2)),
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        shippingAddress: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        contactInfo: {
          email: formData.email,
          phone: formData.phone,
        },
        identityNumber: formData.identityNumber,
        paymentCard: {
          cardHolderName: cardData.cardHolderName,
          cardNumber: cardData.cardNumber,
          expireMonth: cardData.expireMonth,
          expireYear: cardData.expireYear,
          cvc: cardData.cvc,
        },
        totalPrice: Number(finalTotal.toFixed(2)),
        shippingCost: Number(shippingCost.toFixed(2)),
      };

      console.log('Payment submission started');

      // 30 saniyelik zaman aşımı (Timeout) kontrolü
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Payment timeout')), 30000);
      });

      console.log('Sending request to backend...');
      // Race between payment request and timeout
      const res = await Promise.race([
        api.initializePayment(paymentData),
        timeoutPromise
      ]);

      console.log('Backend response received', res.status);
      const result = await res.json();
      console.log('Backend result parsed', result);

      if (res.ok && result.success) {
        if (result.threeDSHtmlContent) {
          console.log('3D Secure content received, rendering...');
          const newDoc = document.open('text/html', 'replace');
          newDoc.write(result.threeDSHtmlContent);
          newDoc.close();
          return;
        }

        clearCart();
        alert('Ödemeniz başarıyla tamamlandı!');
        router.push('/siparisler');
      } else {
        console.error('Payment failed with result:', result);
        alert(result.error || 'Ödeme işlemi başarısız oldu. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Ödeme hatası:', error);
      if (error.message === 'Payment timeout') {
        alert('Ödeme işlemi zaman aşımına uğradı. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.');
      } else {
        alert('Bir hata oluştu. Lütfen tekrar deneyin: ' + error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const orderSummary = useMemo(() => (
    <div className="space-y-3 mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between text-sm">
          <span>{item.name} x {item.quantity}</span>
          <span>{(item.price * item.quantity).toFixed(2)} ₺</span>
        </div>
      ))}
    </div>
  ), [items]);

  if (!isClient || loading || !user || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Ödeme</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                <h2 className="text-2xl font-bold mb-4">Teslimat Bilgileri</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adres *</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Şehir *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Posta Kodu *</label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ülke *</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">Kimlik Bilgileri</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">TC Kimlik Numarası *</label>
                    <input
                      type="text"
                      value={formData.identityNumber}
                      onChange={handleIdentityNumberChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="11 haneli TC Kimlik numaranız"
                      maxLength={11}
                      required
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">Kredi Kartı Bilgileri</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kart Sahibi Adı Soyadı *</label>
                    <input
                      type="text"
                      value={cardData.cardHolderName}
                      onChange={(e) => setCardData({ ...cardData, cardHolderName: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="AD SOYAD"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kart Numarası *</label>
                    <input
                      type="text"
                      value={cardData.cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ay *</label>
                      <input
                        type="text"
                        value={cardData.expireMonth}
                        onChange={(e) => setCardData({ ...cardData, expireMonth: e.target.value.replace(/\D/g, '').slice(0, 2) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="MM"
                        maxLength={2}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Yıl *</label>
                      <input
                        type="text"
                        value={cardData.expireYear}
                        onChange={(e) => setCardData({ ...cardData, expireYear: e.target.value.replace(/\D/g, '').slice(0, 2) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="YY"
                        maxLength={2}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
                      <input
                        type="text"
                        value={cardData.cvc}
                        onChange={(e) => setCardData({ ...cardData, cvc: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="123"
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 font-semibold"
                >
                  {submitting ? 'Ödeme İşleniyor...' : `${finalTotal.toFixed(2)} ₺ Öde`}
                </button>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-4">Sipariş Özeti</h2>
                {orderSummary}
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span>Ara Toplam:</span>
                    <span>{total.toFixed(2)} ₺</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kargo:</span>
                    <span>{shippingCost === 0 ? 'ÜCRETSİZ' : `${shippingCost.toFixed(2)} ₺`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-3">
                    <span>Toplam:</span>
                    <span className="text-primary">{finalTotal.toFixed(2)} ₺</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
