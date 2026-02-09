'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => pathname === path || pathname?.startsWith(path + '/');

  return (
    <nav className="bg-gray-800 shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/admin" className="text-xl font-bold text-white">
            Admin Paneli
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/admin"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin') && pathname === '/admin'
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/urunler"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin/urunler')
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              Ürünler
            </Link>
            <Link
              href="/admin/kategoriler"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin/kategoriler')
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              Kategoriler
            </Link>
            <Link
              href="/admin/siparisler"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin/siparisler')
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              Siparişler
            </Link>
            <Link
              href="/admin/kullanicilar"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin/kullanicilar')
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              Kullanıcılar
            </Link>
            <Link
              href="/admin/carousel"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin/carousel')
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              Carousel
            </Link>
            <Link
              href="/admin/iletisim"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin/iletisim')
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              İletişim
            </Link>
            <Link
              href="/admin/stok"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin/stok')
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              Stok Durumu
            </Link>

            <div className="h-6 w-px bg-gray-600 mx-2"></div>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Siteyi Görüntüle
            </Link>

            <div className="flex items-center gap-2 ml-2">
              <span className="text-sm text-gray-300">{user?.name}</span>
              <button
                onClick={logout}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                Çıkış
              </button>
            </div>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link
              href="/admin"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/admin') && pathname === '/admin'
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/urunler"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/admin/urunler')
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              Ürünler
            </Link>
            <Link
              href="/admin/kategoriler"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/admin/kategoriler')
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              Kategoriler
            </Link>
            <Link
              href="/admin/siparisler"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/admin/siparisler')
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              Siparişler
            </Link>
            <Link
              href="/admin/kullanicilar"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/admin/kullanicilar')
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              Kullanıcılar
            </Link>
            <Link
              href="/admin/carousel"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/admin/carousel')
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              Carousel
            </Link>
            <Link
              href="/admin/iletisim"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/admin/iletisim')
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              İletişim
            </Link>
            <Link
              href="/admin/stok"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/admin/stok')
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              Stok Durumu
            </Link>
            <div className="border-t border-gray-600 my-2"></div>
            <Link
              href="/"
              target="_blank"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Siteyi Görüntüle
            </Link>
            <div className="border-t border-gray-600 my-2"></div>
            <span className="block px-3 py-2 text-sm text-gray-400">{user?.name}</span>
            <button
              onClick={logout}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Çıkış
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

