import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import { serverApiRequest } from '@/lib/api';

// Ürün listesi sayfasını cache'li yap (1 saatte bir yenilensin)
// Ürün listesi
// export const revalidate = 3600; // Kaldırıldı: ISR loop riski nedeniyle

async function getProducts(searchParams) {
  const params = await searchParams;
  try {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    query.append('page', (params.page || '1').toString());
    query.append('limit', '12');

    const res = await serverApiRequest(`/api/products?${query.toString()}`);
    if (!res.ok) {
      console.error('Ürünler API hatası:', res.status, res.statusText);
      return { products: [], pagination: {} };
    }
    const data = await res.json();

    // Debug için
    if (process.env.NODE_ENV === 'development') {
      console.log('Kategori:', params.category);
      console.log('Ürün sayısı:', data.products?.length || 0);
    }

    return data;
  } catch (error) {
    console.error('Ürünler yüklenirken hata:', error);
    return { products: [], pagination: {} };
  }
}

export default async function ProductsPage({
  searchParams,
}) {
  const data = await getProducts(searchParams);
  const products = data?.products || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Tüm Ürünler
            </h1>
            <p className="mt-2 text-sm md:text-base text-gray-500">
              Kategorilere göre filtreleyerek aradığınız ürünü kolayca bulun.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[260px,minmax(0,1fr)] gap-8 lg:gap-10">
            <aside className="lg:sticky lg:top-32 self-start">
              <Suspense fallback={<div className="bg-white rounded-lg shadow-sm p-4">Yükleniyor...</div>}>
                <ProductFilters />
              </Suspense>
            </aside>

            <main className="flex-1">
              <div className="bg-white rounded-2xl shadow-sm px-4 py-5 sm:px-6 sm:py-6">
                {products.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                      {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>

                    {pagination.pages > 1 && (
                      <div className="mt-8 flex justify-center gap-2">
                        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                          <a
                            key={page}
                            href={`/urunler?page=${page}`}
                            className={`px-4 py-2 rounded-full text-sm font-medium ${pagination.page === page
                              ? 'bg-primary text-white shadow-sm'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                          >
                            {page}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Ürün bulunamadı</p>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

