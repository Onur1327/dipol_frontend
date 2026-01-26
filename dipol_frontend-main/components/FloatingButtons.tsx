'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function FloatingButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [instagramUrl, setInstagramUrl] = useState('https://www.instagram.com/dipolbutik');
  const [whatsappNumber, setWhatsappNumber] = useState('905551234567');

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Admin panelinden iletişim bilgilerini çek
    const fetchContactInfo = async () => {
      try {
        const res = await api.getContact();
        if (res.ok) {
          const data = await res.json();
          if (data.socialMedia?.instagram) {
            setInstagramUrl(data.socialMedia.instagram);
          }
          if (data.whatsappNumber) {
            setWhatsappNumber(data.whatsappNumber);
          }
        }
      } catch (error) {
        // Hata durumunda varsayılan değerler kullanılacak
        console.warn('İletişim bilgileri yüklenemedi:', error);
      }
    };

    fetchContactInfo();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark transition-all duration-300 hover:scale-110 flex items-center justify-center"
          aria-label="Sayfa başına dön"
          title="Sayfa başına dön"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}

      {/* WhatsApp Button */}
      {whatsappNumber && (
        <a
          href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-0 rounded-full shadow-lg hover:opacity-90 transition-all duration-300 hover:scale-110 flex items-center justify-center overflow-hidden"
          aria-label="WhatsApp ile iletişime geç"
          title="WhatsApp ile iletişime geç"
        >
          <svg
            className="w-14 h-14"
            viewBox="0 0 1000 1000"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m500 1000c-276.1 0-500-223.9-500-500 0-276.1 223.9-500 500-500 276.1 0 500 223.9 500 500 0 276.1-223.9 500-500 500z" fill="#25d366"/>
            <g>
              <path clipRule="evenodd" d="m733.9 267.2c-62-62.1-144.6-96.3-232.5-96.4-181.1 0-328.6 147.4-328.6 328.6 0 57.9 15.1 114.5 43.9 164.3l-46.6 170.3 174.2-45.7c48 26.2 102 40 157 40h.1c181.1 0 328.5-147.4 328.6-328.6.1-87.8-34-170.4-96.1-232.5zm-232.4 505.6h-.1c-49 0-97.1-13.2-139-38.1l-10-5.9-103.4 27.1 27.6-100.8-6.5-10.3c-27.3-43.5-41.8-93.7-41.8-145.4.1-150.6 122.6-273.1 273.3-273.1 73 0 141.5 28.5 193.1 80.1s80 120.3 79.9 193.2c0 150.7-122.6 273.2-273.1 273.2zm149.8-204.6c-8.2-4.1-48.6-24-56.1-26.7s-13-4.1-18.5 4.1-21.2 26.7-26 32.2-9.6 6.2-17.8 2.1-34.7-12.8-66-40.8c-24.4-21.8-40.9-48.7-45.7-56.9s-.5-12.7 3.6-16.8c3.7-3.7 8.2-9.6 12.3-14.4s5.5-8.2 8.2-13.7 1.4-10.3-.7-14.4-18.5-44.5-25.3-61c-6.7-16-13.4-13.8-18.5-14.1-4.8-.2-10.3-.3-15.7-.3-5.5 0-14.4 2.1-21.9 10.3s-28.7 28.1-28.7 68.5 29.4 79.5 33.5 84.9c4.1 5.5 57.9 88.4 140.3 124 19.6 8.5 34.9 13.5 46.8 17.3 19.7 6.3 37.6 5.4 51.7 3.3 15.8-2.4 48.6-19.9 55.4-39 6.8-19.2 6.8-35.6 4.8-39s-7.5-5.4-15.7-9.6z" fill="#fff" fillRule="evenodd"/>
            </g>
          </svg>
        </a>
      )}

      {/* Instagram Button */}
      {instagramUrl && (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white p-4 rounded-full shadow-lg hover:opacity-90 transition-all duration-300 hover:scale-110 flex items-center justify-center"
          aria-label="Instagram'ı ziyaret et"
          title="Instagram'ı ziyaret et"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>
      )}
    </div>
  );
}

