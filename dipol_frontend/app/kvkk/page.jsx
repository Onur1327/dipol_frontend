import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'KVKK Aydınlatma Metni - Dipol Butik',
  description: 'Kişisel Verilerin Korunması Kanunu Aydınlatma Metni',
};

export default function KVKKPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">KVKK Aydınlatma Metni</h1>

            <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Veri Sorumlusu</h2>
                <p>
                  <strong>Dipol Butik</strong> olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatıyla, kişisel verileriniz aşağıda açıklanan çerçevede işlenecektir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. İşlenen Kişisel Veriler</h2>
                <p>Tarafımızca işlenen kişisel verileriniz şunlardır:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, doğum tarihi</li>
                  <li><strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası, adres bilgileri</li>
                  <li><strong>Müşteri İşlem Bilgileri:</strong> Sipariş geçmişi, ödeme bilgileri, fatura bilgileri</li>
                  <li><strong>İnternet Sitesi Kullanım Bilgileri:</strong> IP adresi, çerez bilgileri, tarayıcı bilgileri</li>
                  <li><strong>Pazarlama Bilgileri:</strong> Tercihler, beğeniler, alışveriş alışkanlıkları</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Kişisel Verilerin İşlenme Amaçları</h2>
                <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Üyelik işlemlerinin gerçekleştirilmesi</li>
                  <li>Siparişlerinizin işlenmesi ve teslimatının yapılması</li>
                  <li>Ödeme işlemlerinin gerçekleştirilmesi</li>
                  <li>Müşteri hizmetleri faaliyetlerinin yürütülmesi</li>
                  <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                  <li>Pazarlama ve tanıtım faaliyetlerinin yürütülmesi (açık rıza ile)</li>
                  <li>İstatistiksel analizler ve raporlama</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Kişisel Verilerin İşlenme Hukuki Sebepleri</h2>
                <p>Kişisel verileriniz aşağıdaki hukuki sebeplere dayanarak işlenmektedir:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>KVKK'nın 5. maddesi 2. fıkrası (a) bendi: Açık rızanız</li>
                  <li>KVKK'nın 5. maddesi 2. fıkrası (c) bendi: Sözleşmenin kurulması veya ifası</li>
                  <li>KVKK'nın 5. maddesi 2. fıkrası (e) bendi: Veri sorumlusunun hukuki yükümlülüğünü yerine getirmesi</li>
                  <li>KVKK'nın 5. maddesi 2. fıkrası (f) bendi: Meşru menfaatlerimiz</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Kişisel Verilerin Aktarılması</h2>
                <p>
                  Kişisel verileriniz, yukarıda belirtilen amaçların gerçekleştirilmesi için, yasal yükümlülüklerimiz kapsamında ve/veya hizmet kalitesinin artırılması amacıyla, aşağıdaki kişi ve kuruluşlara aktarılabilir:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Kargo ve lojistik şirketleri</li>
                  <li>Ödeme hizmet sağlayıcıları</li>
                  <li>Yazılım ve teknoloji hizmet sağlayıcıları</li>
                  <li>Yasal zorunluluklar çerçevesinde ilgili kamu kurum ve kuruluşları</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Kişisel Verilerin Toplanma Yöntemi</h2>
                <p>
                  Kişisel verileriniz, web sitemiz üzerinden doldurduğunuz formlar, üyelik işlemleri, sipariş süreçleri, müşteri hizmetleri iletişim kanalları ve çerezler aracılığıyla toplanmaktadır.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. KVKK Kapsamındaki Haklarınız</h2>
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
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Başvuru Yöntemi</h2>
                <p>
                  Yukarıda belirtilen haklarınızı kullanmak için, kimliğinizi tespit edici belgelerle birlikte, yazılı olarak veya kayıtlı elektronik posta (KEP) adresimiz üzerinden başvuruda bulunabilirsiniz.
                </p>
                <p className="mt-4">
                  <strong>İletişim Bilgileri:</strong><br />
                  E-posta: dipolbutik@gmail.com<br />
                  Adres: [İletişim bilgileri admin panelinden alınacak]
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Güvenlik</h2>
                <p>
                  Kişisel verilerinizin güvenliği için teknik ve idari tedbirler alınmış olup, verileriniz güvenli bir şekilde saklanmaktadır.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Değişiklikler</h2>
                <p>
                  Bu aydınlatma metni, yasal düzenlemelerdeki değişiklikler ve iş süreçlerimizdeki güncellemeler nedeniyle güncellenebilir. Güncel metin web sitemizde yayınlanacaktır.
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

