import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductDetail from '@/components/ProductDetail';
import { serverApiRequest } from '@/lib/api';

// Ürün detay sayfasını cache'li yap (1 saatte bir yenilensin)
// Ürün detay
// export const revalidate = 3600; // Kaldırıldı: ISR loop riski nedeniyle

async function getProduct(slug) {
  try {
    // Slug ile direkt ürün getir - server-side için
    const response = await serverApiRequest(`/api/products/${slug}`);

    if (response.ok) {
      return await response.json();
    }

    // Hata durumunda log
    const error = await response.json().catch(() => ({ error: 'Bilinmeyen hata' }));
    console.error('Ürün getirme hatası:', error);
    return null;
  } catch (error) {
    console.error('Ürün getirme exception:', error);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 pb-16">
        <ProductDetail product={product} />
      </div>
      <Footer />
    </div>
  );
}

