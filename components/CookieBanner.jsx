'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Zorunlu çerezler her zaman aktif
    performance: false,
    functional: false,
    marketing: false,
  });

  useEffect(() => {
    // Çerez tercihlerini kontrol et
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Eğer daha önce onay verilmemişse banner'ı göster
      setShowBanner(true);
    } else {
      // Daha önce verilen tercihleri yükle
      try {
        const preferences = JSON.parse(cookieConsent);
        setCookiePreferences(preferences);
      } catch (error) {
        // Hatalı veri varsa banner'ı tekrar göster
        setShowBanner(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      performance: true,
      functional: true,
      marketing: true,
    };
    setCookiePreferences(allAccepted);
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      performance: false,
      functional: false,
      marketing: false,
    };
    setCookiePreferences(onlyNecessary);
    localStorage.setItem('cookieConsent', JSON.stringify(onlyNecessary));
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(cookiePreferences));
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleCustomize = () => {
    setShowSettings(true);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white border-t-2 border-gray-200 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!showSettings ? (
          // Ana Banner
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Çerezler Hakkında</h3>
              <p className="text-sm text-gray-700 mb-2">
                Web sitemiz, size en iyi deneyimi sunmak için çerezler kullanmaktadır. Zorunlu çerezler web sitemizin çalışması için gereklidir. 
                Diğer çerezler için tercihlerinizi seçebilirsiniz.
              </p>
              <p className="text-xs text-gray-600">
                Detaylı bilgi için{' '}
                <Link href="/cerezler-politikasi" className="text-primary hover:underline font-semibold">
                  Çerezler Politikası
                </Link>
                {' '}sayfasını ziyaret edebilirsiniz.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={handleRejectAll}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold whitespace-nowrap"
              >
                Reddet
              </button>
              <button
                onClick={handleCustomize}
                className="px-6 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-semibold whitespace-nowrap"
              >
                Özelleştir
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold whitespace-nowrap"
              >
                Tümünü Kabul Et
              </button>
            </div>
          </div>
        ) : (
          // Ayarlar Paneli
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Çerez Tercihleri</h3>
            <p className="text-sm text-gray-600">
              Aşağıdaki çerez kategorilerinden istediklerinizi seçebilirsiniz. Zorunlu çerezler web sitemizin çalışması için gereklidir ve devre dışı bırakılamaz.
            </p>

            <div className="space-y-4">
              {/* Zorunlu Çerezler */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Zorunlu Çerezler</h4>
                    <p className="text-sm text-gray-600">Web sitemizin çalışması için gereklidir</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cookiePreferences.necessary}
                      disabled
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Oturum yönetimi, güvenlik, sepet işlemleri
                </p>
              </div>

              {/* Performans Çerezleri */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Performans Çerezleri</h4>
                    <p className="text-sm text-gray-600">Web sitemizin performansını analiz etmek için</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cookiePreferences.performance}
                      onChange={(e) =>
                        setCookiePreferences({
                          ...cookiePreferences,
                          performance: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                      cookiePreferences.performance ? 'bg-primary' : 'bg-gray-300'
                    }`}></div>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Sayfa görüntüleme istatistikleri, kullanıcı davranış analizi
                </p>
              </div>

              {/* Fonksiyonel Çerezler */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Fonksiyonel Çerezler</h4>
                    <p className="text-sm text-gray-600">Tercihlerinizi hatırlamak için</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cookiePreferences.functional}
                      onChange={(e) =>
                        setCookiePreferences({
                          ...cookiePreferences,
                          functional: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                      cookiePreferences.functional ? 'bg-primary' : 'bg-gray-300'
                    }`}></div>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Dil tercihi, favori ürünler, son görüntülenen ürünler
                </p>
              </div>

              {/* Pazarlama Çerezleri */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Pazarlama Çerezleri</h4>
                    <p className="text-sm text-gray-600">Kişiselleştirilmiş reklam ve içerik için</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cookiePreferences.marketing}
                      onChange={(e) =>
                        setCookiePreferences({
                          ...cookiePreferences,
                          marketing: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                      cookiePreferences.marketing ? 'bg-primary' : 'bg-gray-300'
                    }`}></div>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  İlgi alanlarına göre reklam gösterimi, e-posta pazarlama kampanyaları
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t">
              <button
                onClick={() => {
                  setShowSettings(false);
                }}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                İptal
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold"
              >
                Tercihleri Kaydet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

