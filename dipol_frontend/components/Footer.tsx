'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Footer() {
  const [contactInfo, setContactInfo] = useState<any>(null);

  useEffect(() => {
    async function fetchContact() {
      try {
        const res = await api.getContact();
        if (res.ok) {
          const data = await res.json();
          setContactInfo(data);
        }
      } catch (error) {
        console.error('İletişim bilgileri yüklenemedi:', error);
      }
    }
    fetchContact();
  }, []);

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">{contactInfo?.companyName || 'Dipol Butik'}</h3>
            <p className="text-gray-400">
              Modern ve şık kadın giyim koleksiyonu
            </p>
            {contactInfo?.socialMedia && (
              <div className="flex gap-4 mt-4">
                {contactInfo.socialMedia.instagram && (
                  <a
                    href={contactInfo.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Instagram"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
                {contactInfo.socialMedia.facebook && (
                  <a
                    href={contactInfo.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Facebook"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-semibold mb-4">Hızlı Linkler</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/urunler" className="hover:text-white transition-colors">
                  Ürünler
                </Link>
              </li>
              <li>
                <Link href="/kategoriler" className="hover:text-white transition-colors">
                  Kategoriler
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Müşteri Hizmetleri</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/iletisim" className="hover:text-white transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" className="hover:text-white transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iade" className="hover:text-white transition-colors">
                  Teslimat ve İade
                </Link>
              </li>
              <li>
                <Link href="/beden-tablosu" className="hover:text-white transition-colors">
                  Beden Tablosu
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Yasal</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/mesafeli-satis-sozlesmesi" className="hover:text-white transition-colors">
                  Mesafeli Satış Sözleşmesi
                </Link>
              </li>
              <li>
                <Link href="/gizlilik-politikasi" className="hover:text-white transition-colors">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/kvkk" className="hover:text-white transition-colors">
                  KVKK Aydınlatma Metni
                </Link>
              </li>
              <li>
                <Link href="/cerezler-politikasi" className="hover:text-white transition-colors">
                  Çerezler Politikası
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">İletişim</h4>
            <div className="space-y-2 text-gray-400">
              {contactInfo?.email && (
                <p>
                  <span className="text-white">Email:</span> {contactInfo.email}
                </p>
              )}
              {contactInfo?.phone && (
                <p>
                  <span className="text-white">Tel:</span> {contactInfo.phone}
                </p>
              )}
              {contactInfo?.whatsappNumber && (
                <p>
                  <span className="text-white">WhatsApp:</span> {contactInfo.whatsappNumber}
                </p>
              )}
              {contactInfo?.address && (
                <p className="mt-2">
                  <span className="text-white">Adres:</span><br />
                  {contactInfo.address}
                  {contactInfo.city && `, ${contactInfo.city}`}
                  {contactInfo.postalCode && ` ${contactInfo.postalCode}`}
                </p>
              )}
              {contactInfo?.businessHours && (
                <div className="mt-4">
                  <p className="text-white mb-1">Çalışma Saatleri:</p>
                  {contactInfo.businessHours.weekdays && (
                    <p className="text-sm">Hafta İçi: {contactInfo.businessHours.weekdays}</p>
                  )}
                  {contactInfo.businessHours.weekend && (
                    <p className="text-sm">Hafta Sonu: {contactInfo.businessHours.weekend}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-center md:text-left">
              &copy; 2024 Dipol Butik. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <img 
                  src="/iyzico.png" 
                  alt="iyzico ile Öde" 
                  className="h-8 object-contain"
                  onError={(e) => {
                    // Görsel yüklenemezse metin göster
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      parent.innerHTML = '<span class="text-xs font-semibold text-gray-700">iyzico ile Öde</span>';
                    }
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white rounded px-3 py-2 h-6 flex items-center">
                  <span className="text-sm font-bold text-blue-600">VISA</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white rounded px-3 py-2 h-6 flex items-center">
                  <span className="text-sm font-bold" style={{ color: '#EB001B' }}>Master</span>
                  <span className="text-sm font-bold" style={{ color: '#F79E1B' }}>card</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

