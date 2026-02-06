'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    totalRevenue: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const [productsRes, categoriesRes, ordersRes] = await Promise.all([
        api.getProducts({ limit: 1 }),
        api.getCategories(),
        api.getOrders(),
      ]);

      let productsCount = 0;
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        productsCount = productsData.pagination?.total || productsData.products?.length || 0;
      } else {
        const errorData = await productsRes.json().catch(() => ({}));
        console.error('Ürünler yüklenemedi:', productsRes.status, errorData);
      }

      let categoriesCount = 0;
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        categoriesCount = categoriesData.categories?.length || categoriesData.length || 0;
      } else {
        const errorData = await categoriesRes.json().catch(() => ({}));
        console.error('Kategoriler yüklenemedi:', categoriesRes.status, errorData);
      }

      let ordersCount = 0;
      let totalRevenue = 0;
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        const orders = ordersData.orders || ordersData || [];
        ordersCount = orders.length;
        totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      } else {
        const errorData = await ordersRes.json().catch(() => ({}));
        console.error('Siparişler yüklenemedi:', ordersRes.status, errorData);
      }

      setStats({
        products: productsCount,
        categories: categoriesCount,
        orders: ordersCount,
        totalRevenue,
      });
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading || !user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>

          {/* İstatistikler */}
          {loadingStats ? (
            <div className="text-center py-12">Yükleniyor...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Toplam Ürün</h3>
                <p className="text-3xl font-bold text-primary">{stats.products}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Kategoriler</h3>
                <p className="text-3xl font-bold text-primary">{stats.categories}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Toplam Sipariş</h3>
                <p className="text-3xl font-bold text-primary">{stats.orders}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Toplam Gelir</h3>
                <p className="text-3xl font-bold text-primary">{stats.totalRevenue.toFixed(2)} ₺</p>
              </div>
            </div>
          )}

          {/* Hızlı Erişim */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/admin/urunler"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border-l-4 border-blue-500"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold">Ürünler</h2>
              </div>
              <p className="text-gray-600 text-sm">Ürünleri yönet, ekle, düzenle veya sil</p>
            </Link>

            <Link
              href="/admin/kategoriler"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border-l-4 border-green-500"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold">Kategoriler</h2>
              </div>
              <p className="text-gray-600 text-sm">Kategorileri ve alt kategorileri yönet</p>
            </Link>

            <Link
              href="/admin/siparisler"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border-l-4 border-purple-500"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold">Siparişler</h2>
              </div>
              <p className="text-gray-600 text-sm">Siparişleri görüntüle ve durumlarını yönet</p>
            </Link>

            <Link
              href="/admin/kullanicilar"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border-l-4 border-yellow-500"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold">Kullanıcılar</h2>
              </div>
              <p className="text-gray-600 text-sm">Kullanıcıları görüntüle ve yönet</p>
            </Link>

            <Link
              href="/admin/carousel"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border-l-4 border-pink-500"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold">Carousel</h2>
              </div>
              <p className="text-gray-600 text-sm">Ana sayfa carousel görsellerini yönet</p>
            </Link>

            <Link
              href="/admin/iletisim"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border-l-4 border-indigo-500"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold">İletişim</h2>
              </div>
              <p className="text-gray-600 text-sm">İletişim bilgilerini güncelle</p>
            </Link>

            <Link
              href="/admin/stok"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border-l-4 border-red-500"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold">Stok Durumu</h2>
              </div>
              <p className="text-gray-600 text-sm">Ürün stok durumlarını görüntüle ve yönet</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

