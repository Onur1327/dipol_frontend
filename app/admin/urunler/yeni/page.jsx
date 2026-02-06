'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/admin/urunler"
              className="text-primary hover:text-primary-dark mb-4 inline-block"
            >
              ← Ürünlere Dön
            </Link>
            <h1 className="text-4xl font-bold text-gray-800">Yeni Ürün Ekle</h1>
          </div>
          <ProductForm />
        </div>
      </div>
    </div>
  );
}

