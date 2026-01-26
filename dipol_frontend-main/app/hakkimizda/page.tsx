import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Hakkımızda</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Dipol Butik</h2>
            <p className="text-gray-700 mb-4">
              Dipol Butik, modern ve şık kadın giyim koleksiyonu sunan bir e-ticaret platformudur. 
              Müşterilerimize en kaliteli ürünleri, en uygun fiyatlarla sunmayı hedefliyoruz.
            </p>
            <p className="text-gray-700 mb-4">
              Misyonumuz, her kadının kendini özel ve güzel hissetmesini sağlamak ve 
              moda dünyasında kendine özgü tarzını bulmasına yardımcı olmaktır.
            </p>
            <p className="text-gray-700">
              Vizyonumuz, Türkiye'nin önde gelen online butik markalarından biri olmak ve 
              müşteri memnuniyetini her zaman ön planda tutmaktır.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Değerlerimiz</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span><strong>Kalite:</strong> Tüm ürünlerimizde en yüksek kalite standartlarını uyguluyoruz.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span><strong>Müşteri Memnuniyeti:</strong> Müşterilerimizin memnuniyeti bizim için en önemli önceliktir.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span><strong>Hızlı Teslimat:</strong> Siparişlerinizi en kısa sürede kapınıza ulaştırıyoruz.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span><strong>Güvenli Alışveriş:</strong> Tüm ödeme işlemleriniz SSL sertifikası ile korunmaktadır.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

