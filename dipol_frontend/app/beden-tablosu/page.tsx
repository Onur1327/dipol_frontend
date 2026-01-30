import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SizeChartPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Beden Tablosu</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Kadın Giyim Beden Tablosu</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">Beden</th>
                    <th className="border border-gray-300 px-4 py-2">Göğüs (cm)</th>
                    <th className="border border-gray-300 px-4 py-2">Bel (cm)</th>
                    <th className="border border-gray-300 px-4 py-2">Kalça (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 text-center font-semibold">XS</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">80-84</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">60-64</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">88-92</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-center font-semibold">S</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">84-88</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">64-68</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">92-96</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 text-center font-semibold">M</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">88-92</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">68-72</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">96-100</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-center font-semibold">L</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">92-96</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">72-76</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">100-104</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 text-center font-semibold">XL</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">96-100</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">76-80</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">104-108</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-center font-semibold">XXL</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">100-104</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">80-84</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">108-112</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Beden Seçimi İpuçları</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Beden seçerken ölçülerinizi almayı unutmayın. Göğüs, bel ve kalça ölçülerinizi bilmek doğru beden seçimi için önemlidir.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Farklı markalar farklı beden standartları kullanabilir. Ürün açıklamalarını kontrol edin.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Herhangi bir sorunuz varsa, müşteri hizmetlerimizle iletişime geçebilirsiniz.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

