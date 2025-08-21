import { Ruler } from 'lucide-react';

export default function SizeGuidePage() {
  const clothingSizes = [
    { size: "XS", chest: "32-34", waist: "26-28", hips: "34-36", international: "UK 6-8" },
    { size: "S", chest: "34-36", waist: "28-30", hips: "36-38", international: "UK 8-10" },
    { size: "M", chest: "36-38", waist: "30-32", hips: "38-40", international: "UK 10-12" },
    { size: "L", chest: "38-40", waist: "32-34", hips: "40-42", international: "UK 12-14" },
    { size: "XL", chest: "40-42", waist: "34-36", hips: "42-44", international: "UK 14-16" },
    { size: "XXL", chest: "42-44", waist: "36-38", hips: "44-46", international: "UK 16-18" }
  ];

  const shoeSizes = [
    { uk: "3", eu: "36", us: "5", cm: "22.5" },
    { uk: "4", eu: "37", us: "6", cm: "23.5" },
    { uk: "5", eu: "38", us: "7", cm: "24.5" },
    { uk: "6", eu: "39", us: "8", cm: "25.5" },
    { uk: "7", eu: "40", us: "9", cm: "26.5" },
    { uk: "8", eu: "41", us: "10", cm: "27.5" },
    { uk: "9", eu: "42", us: "11", cm: "28.5" },
    { uk: "10", eu: "43", us: "12", cm: "29.5" },
    { uk: "11", eu: "44", us: "13", cm: "30.5" },
    { uk: "12", eu: "45", us: "14", cm: "31.5" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-luxior-black via-gray-900 to-luxior-deep-orange text-white">
        <div className="container-max py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Size Guide</h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Find your perfect fit with our comprehensive size charts
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-max">
          {/* How to Measure */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How to Measure</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-soft text-center">
                <div className="w-16 h-16 bg-luxior-deep-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ruler size={32} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Chest</h3>
                <p className="text-gray-600 text-sm">
                  Measure around the fullest part of your chest, keeping the tape horizontal
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-soft text-center">
                <div className="w-16 h-16 bg-luxior-deep-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ruler size={32} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Waist</h3>
                <p className="text-gray-600 text-sm">
                  Measure around your natural waistline, keeping the tape comfortably loose
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-soft text-center">
                <div className="w-16 h-16 bg-luxior-deep-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ruler size={32} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Hips</h3>
                <p className="text-gray-600 text-sm">
                  Measure around the fullest part of your hips, keeping the tape horizontal
                </p>
              </div>
            </div>
          </div>

          {/* Clothing Size Chart */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Clothing Size Chart</h2>
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-luxior-deep-orange text-white">
                    <tr>
                      <th className="px-6 py-4 text-left">Size</th>
                      <th className="px-6 py-4 text-left">Chest (inches)</th>
                      <th className="px-6 py-4 text-left">Waist (inches)</th>
                      <th className="px-6 py-4 text-left">Hips (inches)</th>
                      <th className="px-6 py-4 text-left">International</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {clothingSizes.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-6 py-4 font-semibold text-gray-900">{item.size}</td>
                        <td className="px-6 py-4 text-gray-600">{item.chest}</td>
                        <td className="px-6 py-4 text-gray-600">{item.waist}</td>
                        <td className="px-6 py-4 text-gray-600">{item.hips}</td>
                        <td className="px-6 py-4 text-gray-600">{item.international}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Shoe Size Chart */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shoe Size Chart</h2>
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-luxior-orange text-white">
                    <tr>
                      <th className="px-6 py-4 text-left">UK</th>
                      <th className="px-6 py-4 text-left">EU</th>
                      <th className="px-6 py-4 text-left">US</th>
                      <th className="px-6 py-4 text-left">CM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {shoeSizes.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-6 py-4 font-semibold text-gray-900">{item.uk}</td>
                        <td className="px-6 py-4 text-gray-600">{item.eu}</td>
                        <td className="px-6 py-4 text-gray-600">{item.us}</td>
                        <td className="px-6 py-4 text-gray-600">{item.cm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-luxior-deep-orange to-luxior-orange rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">Size Tips</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">General Tips</h3>
                <ul className="space-y-2 text-white/90">
                  <li>• Always measure yourself before ordering</li>
                  <li>• Use a flexible measuring tape</li>
                  <li>• Don't pull the tape too tight</li>
                  <li>• Measure over light clothing</li>
                  <li>• When in doubt, size up</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Fit Preferences</h3>
                <ul className="space-y-2 text-white/90">
                  <li>• Slim fit: Choose your exact size</li>
                  <li>• Regular fit: Choose your exact size</li>
                  <li>• Loose fit: Size up by 1-2 sizes</li>
                  <li>• Oversized: Size up by 2-3 sizes</li>
                  <li>• Shoes: Leave 1cm space at the toe</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="text-center mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Unsure About Your Size?</h2>
            <p className="text-gray-600 mb-6">
              Our customer service team can help you find the perfect fit.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-luxior-deep-orange text-white font-semibold rounded-lg hover:bg-luxior-orange transition-colors"
            >
              Contact Us for Help
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
