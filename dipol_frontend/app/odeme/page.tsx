'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export default function CheckoutPage() {
  const { items, total, shippingCost, finalTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Türkiye',
    identityNumber: '', // TC Kimlik Numarası
  });
  const [cardData, setCardData] = useState({
    cardHolderName: '',
    cardNumber: '',
    expireMonth: '',
    expireYear: '',
    cvc: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [showDemoInfo, setShowDemoInfo] = useState(true);

  const fetchUserData = async () => {
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
        // Kart sahibi adını da doldur
        setCardData(prev => ({
          ...prev,
          cardHolderName: userData.name || '',
        }));
      }
    } catch (error) {
      console.error('Kullanıcı bilgileri yüklenemedi:', error);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/giris');
      return;
    }
    if (items.length === 0) {
      router.push('/sepet');
      return;
    }
    fetchUserData();
  }, [user, items, router]);

  // Kart numarası formatlama
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // TC Kimlik numarası formatlama ve doğrulama
  const handleIdentityNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    setFormData({ ...formData, identityNumber: value });
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardData({ ...cardData, cardNumber: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      const paymentData = {
        items: items.map(item => ({
          product: item.product,
          name: item.name,
          image: item.image || '',
          price: item.price,
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
        totalPrice: finalTotal,
        shippingCost: shippingCost,
      };

      const res = await api.initializePayment(paymentData);
      const result = await res.json();
      
      if (res.ok && result.success) {
        clearCart();
        alert('Ödemeniz başarıyla tamamlandı!');
        router.push('/siparisler');
      } else {
        alert(result.error || 'Ödeme işlemi başarısız oldu. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Ödeme hatası:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Ödeme</h1>
          
          {/* Demo Kart Bilgileri */}
          {showDemoInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Test Kartı Bilgileri (İyzico Sandbox)</h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>Kart Numarası:</strong> 5528 7900 0000 0008</p>
                    <p><strong>Son Kullanma Tarihi:</strong> 12/30</p>
                    <p><strong>CVV:</strong> 123</p>
                    <p><strong>Kart Sahibi:</strong> Test Kullanıcı</p>
                    <p className="text-xs mt-2 text-blue-600">Bu bilgiler test ortamı için geçerlidir. Gerçek ödeme yapılmaz.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDemoInfo(false)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                <h2 className="text-2xl font-bold mb-4">Teslimat Bilgileri</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Soyad *
                  </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon *
                    </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adres *
                  </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Şehir *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Posta Kodu *
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ülke *
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      TC Kimlik Numarası *
                    </label>
                    <input
                      type="text"
                      value={formData.identityNumber}
                      onChange={handleIdentityNumberChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="11 haneli TC Kimlik numaranız"
                      maxLength={11}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">TC Kimlik numaranız sadece ödeme işlemi için kullanılacaktır.</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">Kredi Kartı Bilgileri</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kart Sahibi Adı Soyadı *
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kart Numarası *
                    </label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ay *
                      </label>
                      <input
                        type="text"
                        value={cardData.expireMonth}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                          if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 12)) {
                            setCardData({ ...cardData, expireMonth: value });
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="MM"
                        maxLength={2}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Yıl *
                      </label>
                      <input
                        type="text"
                        value={cardData.expireYear}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                          setCardData({ ...cardData, expireYear: value });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="YY"
                        maxLength={2}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV *
                      </label>
                      <input
                        type="text"
                        value={cardData.cvc}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                          setCardData({ ...cardData, cvc: value });
                        }}
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

                {/* Ödeme Logoları */}
                <div className="border-t pt-6 mt-6">
                  <p className="text-sm text-gray-600 mb-3 text-center">Güvenli Ödeme</p>
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 bg-white border border-gray-300 rounded px-3 py-2">
                      <span className="text-sm font-semibold text-gray-700">iyzico ile Öde</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-white border border-gray-300 rounded px-3 py-2 h-8 flex items-center">
                        <span className="text-lg font-bold text-blue-600">VISA</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-white border border-gray-300 rounded px-3 py-2 h-8 flex items-center">
                        <span className="text-lg font-bold" style={{ color: '#EB001B' }}>Master</span>
                        <span className="text-lg font-bold" style={{ color: '#F79E1B' }}>card</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Ödeme işlemleriniz SSL sertifikası ile korunmaktadır.
                  </p>
                </div>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-4">Sipariş Özeti</h2>
                <div className="space-y-3 mb-6">
                  {items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} x {item.quantity}</span>
                      <span>{(item.price * item.quantity).toFixed(2)} ₺</span>
                    </div>
                  ))}
                </div>
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
