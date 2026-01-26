import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import HeroCarousel from '@/components/HeroCarousel';
import ProductCarousel from '@/components/ProductCarousel';
import { serverApiRequest } from '@/lib/api';

// Anasayfayı cache'li yap (60 saniyede bir yenilensin)
export const revalidate = 60;

async function getFeaturedProducts() {
  try {
    // Önce featured ürünleri dene
    let res = await serverApiRequest('/api/products?featured=true&limit=8');
    if (res.ok) {
      const data = await res.json();
      // Eğer featured ürün varsa onları döndür
      if (data.products && data.products.length > 0) {
        return data;
      }
    }
    
    // Featured ürün yoksa tüm aktif ürünlerden son 8'ini al
    res = await serverApiRequest('/api/products?limit=8');
    if (!res.ok) return { products: [] };
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Ürünler yüklenirken hata:', error);
    return { products: [] };
  }
}

async function getCarousels() {
  try {
    const res = await serverApiRequest('/api/carousel?active=true');
    if (!res.ok) return [];
    const data = await res.json();
    return data.carousels || [];
  } catch {
    return [];
  }
}

async function getFeaturedCategories() {
  try {
    // Önce iletişim bilgilerinden öne çıkan kategorileri al
    const contactRes = await serverApiRequest('/api/contact');
    if (contactRes.ok) {
      const contactData = await contactRes.json();
      if (contactData.featuredCategories && contactData.featuredCategories.length > 0) {
        // Öne çıkan kategoriler varsa onları getir
        const categoryIds = contactData.featuredCategories
          .map((id: any) => (typeof id === 'string' ? id : id.toString()))
          .filter(Boolean)
          .join(',');
        if (categoryIds) {
          const res = await serverApiRequest(`/api/categories?ids=${categoryIds}`);
        if (res.ok) {
          const data = await res.json();
          const categories = data.categories || data || [];
          // İlk 3'ünü al
          return categories.slice(0, 3);
        }
        }
      }
    }
    
    // Öne çıkan kategori yoksa, ana kategorilerden ilk 3'ünü al
    const res = await serverApiRequest('/api/categories?active=true');
    if (!res.ok) return [];
    const data = await res.json();
    const mainCategories = (data.categories || data || [])
      .filter((cat: any) => !cat.parent || !cat.parent._id)
      .slice(0, 3);
    return mainCategories;
  } catch {
    return [];
  }
}

export default async function Home() {
  const { products } = await getFeaturedProducts();
  const carousels = await getCarousels();
  const categories = await getFeaturedCategories();

  // Hero carousel slides - Backend'den geliyorsa onları kullan, yoksa varsayılanları
  const heroSlides = carousels.length > 0
    ? carousels.map((c: any) => ({
        id: c._id,
        image: c.image,
        title: c.title,
        subtitle: c.subtitle,
        link: c.link || '/urunler',
        buttonText: c.buttonText || 'Keşfet',
      }))
    : [
        {
          id: '1',
          image: '/hero-1.jpg',
          title: 'Tarzınızı Keşfedin',
          subtitle: 'Modern ve şık kadın giyim koleksiyonu ile her anınızda özel hissedin',
          link: '/urunler',
          buttonText: 'Koleksiyonu Keşfet',
        },
        {
          id: '2',
          image: '/hero-2.jpg',
          title: 'Yeni Sezon Koleksiyonu',
          subtitle: 'En yeni trendleri keşfedin ve gardırobunuzu yenileyin',
          link: '/urunler',
          buttonText: 'Alışverişe Başla',
        },
        {
          id: '3',
          image: '/hero-3.jpg',
          title: 'Özel İndirimler',
          subtitle: 'Seçili ürünlerde %50\'ye varan indirimler',
          link: '/urunler',
          buttonText: 'İndirimleri Gör',
        },
      ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Carousel */}
      <section>
        <HeroCarousel slides={heroSlides} />
      </section>

      {/* Category Cards */}
      {categories.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
              Öne Çıkanlar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((category: any) => {
                const isBase64 = category.image?.startsWith('data:image');
                return (
                  <Link
                    key={category._id}
                    href={`/urunler?category=${category.slug || category._id}`}
                    className="group block"
                  >
                    <div className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02]">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        {category.image ? (
                          isBase64 ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          )
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 flex items-center justify-center">
                            <span className="text-gray-500 text-xl font-semibold">{category.name}</span>
                          </div>
                        )}
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        {/* Category Name Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                            {category.name}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Yeni Ürünler */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length > 0 ? (
            <>
              <ProductCarousel
                products={products}
                title="Yeni Ürünler"
                subtitle="En yeni eklenen ürünlerimiz"
                slidesPerView={4}
                autoplay={false}
              />
              <div className="text-center mt-12">
                <Link
                  href="/urunler"
                  className="inline-block px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-semibold"
                >
                  Tüm Ürünleri Gör
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">Henüz ürün bulunmamaktadır.</p>
              <Link
                href="/urunler"
                className="inline-block px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-semibold"
              >
                Tüm Ürünleri Gör
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Ücretsiz Kargo</h3>
              <p className="text-gray-600">2500 TL ve üzeri alışverişlerde</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Hızlı Teslimat</h3>
              <p className="text-gray-600">2-3 iş günü içinde kapınızda</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Güvenli Alışveriş</h3>
              <p className="text-gray-600">256-bit SSL şifreleme</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
