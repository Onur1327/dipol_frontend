import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mesafeli Satış Sözleşmesi - Dipol Butik',
  description: 'Mesafeli Satış Sözleşmesi ve Şartları',
};

export default function DistanceSalesAgreementPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Mesafeli Satış Sözleşmesi</h1>
            
            <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Taraflar</h2>
                <p>
                  Bu Mesafeli Satış Sözleşmesi, aşağıda kimlik bilgileri belirtilen <strong>SATICI</strong> ile 
                  internet sitesi üzerinden alışveriş yapan <strong>ALICI</strong> arasında aşağıdaki şartlara göre düzenlenmiştir.
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p><strong>SATICI:</strong></p>
                  <p>Dipol Butik</p>
                  <p>E-posta: dipolbutik@gmail.com</p>
                  <p>Web Sitesi: www.dipolbutik.com</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Konu</h2>
                <p>
                  Bu sözleşmenin konusu, ALICI'nın www.dipolbutik.com adresindeki internet sitesinden 
                  satın almayı talep ettiği ürünlerin satışı ve teslimi ile ilgili tarafların hak ve yükümlülüklerinin belirlenmesidir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Sözleşmenin Kurulması</h2>
                <p>
                  ALICI, internet sitesinde yer alan ürünleri inceleyerek sepetine ekler ve ödeme adımlarını tamamlar. 
                  ALICI'nın ödeme işlemini tamamlaması ile sözleşme kurulmuş sayılır.
                </p>
                <p className="mt-2">
                  SATICI, ALICI'nın siparişini onayladıktan sonra sipariş onay e-postası gönderir. 
                  Sipariş onay e-postası, sözleşmenin kurulduğunu ve siparişin alındığını gösterir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Ürün Bilgileri ve Fiyatlar</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Ürün bilgileri, özellikleri ve fiyatları internet sitesinde açıkça belirtilmiştir.</li>
                  <li>Fiyatlar, KDV dahil olarak gösterilmiştir.</li>
                  <li>SATICI, yanlış fiyatlandırma durumunda siparişi iptal etme hakkını saklı tutar.</li>
                  <li>Kargo ücreti, sepet tutarına göre belirlenir ve sipariş özetinde gösterilir.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Ödeme</h2>
                <p>Ödeme yöntemleri:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Kredi kartı ile ödeme (Visa, Mastercard)</li>
                  <li>Ödeme işlemleri iyzico ödeme altyapısı üzerinden güvenli bir şekilde gerçekleştirilir.</li>
                  <li>Ödeme işlemi tamamlandıktan sonra sipariş onaylanır.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Teslimat</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Ürünler, ALICI'nın belirttiği adrese kargo ile teslim edilir.</li>
                  <li>Teslimat süresi, sipariş onayından itibaren 1-3 iş günü içerisindedir.</li>
                  <li>Kargo firması tarafından teslimat yapılırken ALICI veya ALICI'nın gösterdiği kişi bulunmazsa, 
                      kargo firması ile iletişime geçilmesi gerekmektedir.</li>
                  <li>Kargo ücreti, sepet tutarına göre belirlenir. Belirli tutarın üzerindeki siparişlerde kargo ücretsizdir.</li>
                  <li>Teslimat sırasında ürünlerin hasarlı olması durumunda, ALICI kargo firmasına tutanak tutturmalıdır.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cayma Hakkı</h2>
                <p>
                  ALICI, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Satışlar Yönetmeliği uyarınca, 
                  ürünü teslim aldığı tarihten itibaren <strong>14 gün</strong> içinde hiçbir gerekçe göstermeksizin 
                  cayma hakkını kullanabilir.
                </p>
                <p className="mt-2">Cayma hakkı kullanılamayacak ürünler:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>İç çamaşırı, mayo, bikini gibi kişisel kullanım ürünleri</li>
                  <li>Kullanılmış, hasarlı veya orijinal ambalajından çıkarılmış ürünler</li>
                  <li>Hazırlanmasına özel olarak başlanmış veya kişiselleştirilmiş ürünler</li>
                </ul>
                <p className="mt-4">
                  Cayma hakkını kullanmak isteyen ALICI, iade formunu doldurarak talebini bildirmelidir. 
                  İade kargo ücreti ALICI'ya aittir. Ürün orijinal ambalajında, kullanılmamış ve hasarsız olmalıdır.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. İade ve Değişim</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>İade edilecek ürünler, orijinal ambalajında, etiketli, kullanılmamış ve hasarsız olmalıdır.</li>
                  <li>İade işlemi onaylandıktan sonra, ödeme 3-5 iş günü içinde ALICI'nın hesabına iade edilir.</li>
                  <li>Değişim talepleri, ürün stok durumuna göre değerlendirilir.</li>
                  <li>İade ve değişim işlemleri için <Link href="/iade" className="text-primary hover:underline">İade ve Değişim</Link> sayfasını ziyaret edebilirsiniz.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Garanti ve Sorumluluk</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>SATICI, ürünlerin ayıplı olmamasından sorumludur.</li>
                  <li>Ürünlerde ayıp tespit edilmesi durumunda, ALICI'nın ayıplı mal hakkı saklıdır.</li>
                  <li>SATICI, ürünlerin yasal mevzuata uygun olmasından sorumludur.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Kişisel Verilerin Korunması</h2>
                <p>
                  ALICI'nın kişisel verileri, 6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca işlenmektedir. 
                  Detaylı bilgi için <Link href="/kvkk" className="text-primary hover:underline">KVKK Aydınlatma Metni</Link> sayfasını ziyaret edebilirsiniz.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Uyuşmazlıkların Çözümü</h2>
                <p>
                  Bu sözleşmeden kaynaklanan uyuşmazlıkların çözümünde, Türkiye Cumhuriyeti yasaları uygulanır. 
                  İstanbul Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. İletişim</h2>
                <p>
                  Sipariş, teslimat, iade ve diğer konularda sorularınız için:
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p><strong>E-posta:</strong> dipolbutik@gmail.com</p>
                  <p><strong>Web Sitesi:</strong> www.dipolbutik.com</p>
                </div>
              </section>

              <section>
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

