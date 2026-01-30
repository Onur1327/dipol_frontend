import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası - Dipol Butik',
  description: 'Gizlilik Politikası ve Kişisel Verilerin Korunması',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Gizlilik Politikası</h1>
            
            <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Gizlilik Politikası Hakkında</h2>
                <p>
                  Bu Gizlilik Politikası, www.dipolbutik.com web sitesini ziyaret eden ve hizmetlerimizi kullanan 
                  kişilerin kişisel verilerinin nasıl toplandığı, kullanıldığı, korunduğu ve paylaşıldığı hakkında bilgi vermektedir.
                </p>
                <p className="mt-2">
                  Bu politika, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve ilgili mevzuat hükümlerine uygun olarak hazırlanmıştır.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Veri Sorumlusu</h2>
                <p>
                  <strong>Dipol Butik</strong> olarak, kişisel verilerinizin işlenmesinden sorumluyuz.
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p><strong>İletişim Bilgileri:</strong></p>
                  <p>E-posta: dipolbutik@gmail.com</p>
                  <p>Web Sitesi: www.dipolbutik.com</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Toplanan Kişisel Veriler</h2>
                <p>Web sitemizi kullanırken aşağıdaki kişisel verileriniz toplanabilir:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, TC Kimlik numarası</li>
                  <li><strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası, adres bilgileri</li>
                  <li><strong>Müşteri İşlem Bilgileri:</strong> Sipariş geçmişi, ödeme bilgileri, fatura bilgileri</li>
                  <li><strong>İnternet Sitesi Kullanım Bilgileri:</strong> IP adresi, çerez bilgileri, tarayıcı bilgileri, sayfa görüntüleme bilgileri</li>
                  <li><strong>Pazarlama Bilgileri:</strong> Tercihler, beğeniler, alışveriş alışkanlıkları (açık rıza ile)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Kişisel Verilerin İşlenme Amaçları</h2>
                <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Üyelik işlemlerinin gerçekleştirilmesi</li>
                  <li>Siparişlerinizin işlenmesi ve teslimatının yapılması</li>
                  <li>Ödeme işlemlerinin gerçekleştirilmesi</li>
                  <li>Müşteri hizmetleri faaliyetlerinin yürütülmesi</li>
                  <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                  <li>Pazarlama ve tanıtım faaliyetlerinin yürütülmesi (açık rıza ile)</li>
                  <li>İstatistiksel analizler ve raporlama</li>
                  <li>Web sitesi güvenliğinin sağlanması</li>
                  <li>Kullanıcı deneyiminin iyileştirilmesi</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Kişisel Verilerin İşlenme Hukuki Sebepleri</h2>
                <p>Kişisel verileriniz aşağıdaki hukuki sebeplere dayanarak işlenmektedir:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>KVKK'nın 5. maddesi 2. fıkrası (a) bendi: Açık rızanız</li>
                  <li>KVKK'nın 5. maddesi 2. fıkrası (c) bendi: Sözleşmenin kurulması veya ifası</li>
                  <li>KVKK'nın 5. maddesi 2. fıkrası (e) bendi: Veri sorumlusunun hukuki yükümlülüğünü yerine getirmesi</li>
                  <li>KVKK'nın 5. maddesi 2. fıkrası (f) bendi: Meşru menfaatlerimiz</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Kişisel Verilerin Aktarılması</h2>
                <p>
                  Kişisel verileriniz, yukarıda belirtilen amaçların gerçekleştirilmesi için, yasal yükümlülüklerimiz kapsamında 
                  ve/veya hizmet kalitesinin artırılması amacıyla, aşağıdaki kişi ve kuruluşlara aktarılabilir:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Kargo ve lojistik şirketleri</li>
                  <li>Ödeme hizmet sağlayıcıları (iyzico)</li>
                  <li>Yazılım ve teknoloji hizmet sağlayıcıları</li>
                  <li>Yasal zorunluluklar çerçevesinde ilgili kamu kurum ve kuruluşları</li>
                  <li>Hukuki danışmanlık hizmeti veren kuruluşlar</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Kişisel Verilerin Toplanma Yöntemi</h2>
                <p>
                  Kişisel verileriniz, web sitemiz üzerinden doldurduğunuz formlar, üyelik işlemleri, sipariş süreçleri, 
                  müşteri hizmetleri iletişim kanalları ve çerezler aracılığıyla toplanmaktadır.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Kişisel Verilerin Saklanma Süresi</h2>
                <p>
                  Kişisel verileriniz, işlenme amaçlarının gerektirdiği süre boyunca ve yasal saklama süreleri çerçevesinde saklanmaktadır. 
                  Bu sürelerin sona ermesi halinde, kişisel verileriniz silinir, yok edilir veya anonim hale getirilir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. KVKK Kapsamındaki Haklarınız</h2>
                <p>KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                  <li>İşlenmişse buna ilişkin bilgi talep etme</li>
                  <li>İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                  <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
                  <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
                  <li>KVKK'da öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme</li>
                  <li>Düzeltme, silme, yok etme işlemlerinin, kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
                  <li>Münhasıran otomatik sistemler ile analiz edilmesi nedeniyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
                  <li>Kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Başvuru Yöntemi</h2>
                <p>
                  Yukarıda belirtilen haklarınızı kullanmak için, kimliğinizi tespit edici belgelerle birlikte, 
                  yazılı olarak veya kayıtlı elektronik posta (KEP) adresimiz üzerinden başvuruda bulunabilirsiniz.
                </p>
                <p className="mt-4">
                  <strong>İletişim Bilgileri:</strong><br />
                  E-posta: dipolbutik@gmail.com<br />
                  Web Sitesi: www.dipolbutik.com
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Güvenlik</h2>
                <p>
                  Kişisel verilerinizin güvenliği için teknik ve idari tedbirler alınmış olup, verileriniz güvenli bir şekilde saklanmaktadır. 
                  SSL sertifikası kullanılarak veri aktarımı şifrelenmektedir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Çerezler</h2>
                <p>
                  Web sitemizde çerezler kullanılmaktadır. Çerezler hakkında detaylı bilgi için{' '}
                  <Link href="/cerezler-politikasi" className="text-primary hover:underline">Çerezler Politikası</Link> sayfasını ziyaret edebilirsiniz.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Değişiklikler</h2>
                <p>
                  Bu gizlilik politikası, yasal düzenlemelerdeki değişiklikler ve iş süreçlerimizdeki güncellemeler nedeniyle güncellenebilir. 
                  Güncel politika web sitemizde yayınlanacaktır.
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

