import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
export const metadata = {
  title: 'Çerezler Politikası - Dipol Butik',
  description: 'Çerezler Politikası ve Kullanımı',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Çerezler Politikası</h1>

            <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Çerez Nedir?</h2>
                <p>
                  Çerezler, web sitelerini ziyaret ettiğinizde cihazınıza (bilgisayar, tablet, akıllı telefon vb.) kaydedilen küçük metin dosyalarıdır. Çerezler, web sitemizin düzgün çalışmasını sağlar ve kullanıcı deneyimini iyileştirir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Çerezlerin Kullanım Amacı</h2>
                <p>Web sitemizde çerezler aşağıdaki amaçlarla kullanılmaktadır:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Zorunlu Çerezler:</strong> Web sitemizin temel işlevlerinin çalışması için gereklidir (oturum yönetimi, güvenlik, sepet işlemleri)</li>
                  <li><strong>Performans Çerezleri:</strong> Web sitemizin performansını analiz etmek ve kullanıcı deneyimini iyileştirmek için kullanılır</li>
                  <li><strong>Fonksiyonel Çerezler:</strong> Tercihlerinizi hatırlamak ve kişiselleştirilmiş deneyim sunmak için kullanılır (dil tercihi, tema seçimi)</li>
                  <li><strong>Pazarlama Çerezleri:</strong> İlgi alanlarınıza göre reklam ve içerik sunmak için kullanılır (açık rıza ile)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Kullandığımız Çerez Türleri</h2>

                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Zorunlu Çerezler</h3>
                    <p className="mb-2">Bu çerezler web sitemizin çalışması için zorunludur ve devre dışı bırakılamaz:</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li><strong>Oturum Çerezleri:</strong> Giriş yaptığınızda oturumunuzu korur</li>
                      <li><strong>Güvenlik Çerezleri:</strong> Güvenli alışveriş için gerekli</li>
                      <li><strong>Sepet Çerezleri:</strong> Sepetinizdeki ürünleri hatırlar</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Performans Çerezleri</h3>
                    <p className="mb-2">Web sitemizin performansını analiz etmek için kullanılır:</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Sayfa görüntüleme istatistikleri</li>
                      <li>Kullanıcı davranış analizi</li>
                      <li>Hata takibi</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Fonksiyonel Çerezler</h3>
                    <p className="mb-2">Kullanıcı tercihlerini hatırlamak için kullanılır:</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Dil tercihi</li>
                      <li>Favori ürünler</li>
                      <li>Son görüntülenen ürünler</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Pazarlama Çerezleri</h3>
                    <p className="mb-2">Kişiselleştirilmiş reklam ve içerik için kullanılır (açık rıza ile):</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>İlgi alanlarına göre reklam gösterimi</li>
                      <li>E-posta pazarlama kampanyaları</li>
                      <li>Sosyal medya entegrasyonları</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Çerezleri Yönetme</h2>
                <p>
                  Tarayıcı ayarlarınızdan çerezleri yönetebilir veya silebilirsiniz. Ancak, zorunlu çerezleri devre dışı bırakmanız durumunda web sitemizin bazı özellikleri düzgün çalışmayabilir.
                </p>
                <p className="mt-4">
                  <strong>Tarayıcı Ayarları:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Chrome:</strong> Ayarlar → Gizlilik ve güvenlik → Çerezler ve diğer site verileri</li>
                  <li><strong>Firefox:</strong> Seçenekler → Gizlilik ve Güvenlik → Çerezler ve Site Verileri</li>
                  <li><strong>Safari:</strong> Tercihler → Gizlilik → Çerezler ve web sitesi verileri</li>
                  <li><strong>Edge:</strong> Ayarlar → Gizlilik, arama ve hizmetler → Çerezler ve site izinleri</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Üçüncü Taraf Çerezler</h2>
                <p>
                  Web sitemizde, hizmet kalitesini artırmak ve analiz yapmak amacıyla üçüncü taraf çerezler de kullanılmaktadır. Bu çerezler, ilgili üçüncü tarafın gizlilik politikasına tabidir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Çerez Süreleri</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Oturum Çerezleri:</strong> Tarayıcı kapatıldığında silinir</li>
                  <li><strong>Kalıcı Çerezler:</strong> Belirli bir süre boyunca (maksimum 2 yıl) cihazınızda kalır</li>
                  <li><strong>Çerez Süreleri:</strong> Kullanım amacına göre değişiklik gösterebilir</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. İletişim</h2>
                <p>
                  Çerezler hakkında sorularınız için bizimle iletişime geçebilirsiniz:
                </p>
                <p className="mt-4">
                  <strong>E-posta:</strong> dipolbutik@gmail.com
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Değişiklikler</h2>
                <p>
                  Bu çerezler politikası, yasal düzenlemelerdeki değişiklikler ve teknolojik gelişmeler nedeniyle güncellenebilir. Güncel politika web sitemizde yayınlanacaktır.
                </p>
                <p className="mt-4 text-sm text-gray-500">
                  Son güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

