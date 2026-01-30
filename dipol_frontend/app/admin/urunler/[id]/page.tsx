'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import ProductForm from '@/components/admin/ProductForm';

export default function EditProductPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role === 'admin' && params.id) {
      fetchProduct();
    }
  }, [user, params.id]);

  const fetchProduct = async () => {
    try {
      setLoadingProduct(true);
      const res = await api.getProduct(params.id as string);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
      } else {
        alert('Ürün bulunamadı');
        router.push('/admin/urunler');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Ürün yüklenemedi:', error);
      }
      router.push('/admin/urunler');
    } finally {
      setLoadingProduct(false);
    }
  };

  if (loading || loadingProduct || !user || user.role !== 'admin') {
    return null;
  }

  if (!product) {
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
            <h1 className="text-4xl font-bold text-gray-800">Ürün Düzenle</h1>
          </div>
          <ProductForm product={product} />
        </div>
      </div>
    </div>
  );
}

