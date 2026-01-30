'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { apiRequest } from '@/lib/api';
import Link from 'next/link';

function EmailVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Doğrulama token\'ı bulunamadı');
      return;
    }

    async function verifyEmail() {
      try {
        // apiRequest kullanarak doğru API URL'ini kullan
        const res = await apiRequest(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setMessage(data.message || 'E-posta adresiniz başarıyla doğrulandı');
        } else {
          setStatus('error');
          setMessage(data.error || 'E-posta doğrulanamadı');
        }
      } catch (error: any) {
        console.error('Email doğrulama hatası:', error);
        setStatus('error');
        setMessage(error?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            {status === 'loading' && (
              <>
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">E-posta Doğrulanıyor...</h1>
                <p className="text-gray-600">Lütfen bekleyin</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="text-green-500 text-6xl mb-4">✓</div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">E-posta Doğrulandı!</h1>
                <p className="text-gray-600 mb-6">{message}</p>
                <Link
                  href="/giris"
                  className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Giriş Yap
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="text-red-500 text-6xl mb-4">✗</div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Doğrulama Başarısız</h1>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="space-y-3">
                  <Link
                    href="/giris"
                    className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors mr-3"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/"
                    className="inline-block border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Ana Sayfaya Dön
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function EmailVerificationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    }>
      <EmailVerificationContent />
    </Suspense>
  );
}

