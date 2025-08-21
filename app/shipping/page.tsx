import { Truck, MapPin, Clock, Package, Shield } from 'lucide-react';

export default function ShippingPage() {
  const shippingZones = [
    {
      zone: "Nairobi & Surrounding Areas",
      counties: ["Nairobi", "Kiambu", "Machakos", "Kajiado"],
      deliveryTime: "1-2 business days",
      cost: "Free for orders above KES 5,000"
    },
    {
      zone: "Central & Eastern Kenya",
      counties: ["Nakuru", "Nyeri", "Embu", "Meru", "Tharaka Nithi"],
      deliveryTime: "2-3 business days",
      cost: "KES 500"
    },
    {
      zone: "Coast & Western Kenya",
      counties: ["Mombasa", "Kwale", "Kisumu", "Kakamega", "Bungoma"],
      deliveryTime: "3-4 business days",
      cost: "KES 800"
    },
    {
      zone: "Northern & Rift Valley",
      counties: ["Eldoret", "Nakuru", "Narok", "Baringo", "Turkana"],
      deliveryTime: "4-5 business days",
      cost: "KES 1,000"
    }
  ];

  const deliveryOptions = [
    {
      icon: Truck,
      title: "Standard Delivery",
      description: "Regular delivery within the specified timeframe",
      timeframe: "2-5 business days",
      cost: "From KES 500"
    },
    {
      icon: Package,
      title: "Express Delivery",
      description: "Priority handling and faster delivery",
      timeframe: "1-2 business days",
      cost: "From KES 1,500"
    },
    {
      icon: Shield,
      title: "Same Day Delivery",
      description: "Delivery within Nairobi on the same day",
      timeframe: "Same day (orders before 12 PM)",
      cost: "KES 2,500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-luxior-black via-gray-900 to-luxior-deep-orange text-white">
        <div className="container-max py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Shipping Information</h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Fast, reliable delivery across all 47 counties in Kenya
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-max">
          {/* Delivery Options */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Delivery Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {deliveryOptions.map((option, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-soft text-center">
                  <div className="w-16 h-16 bg-luxior-deep-orange rounded-full flex items-center justify-center mx-auto mb-6">
                    <option.icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{option.title}</h3>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Clock size={16} className="text-luxior-deep-orange" />
                      <span className="text-sm text-gray-600">{option.timeframe}</span>
                    </div>
                    <div className="text-lg font-semibold text-luxior-deep-orange">{option.cost}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Zones */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shipping Zones & Costs</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {shippingZones.map((zone, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-soft">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-luxior-deep-orange rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{zone.zone}</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Counties:</span> {zone.counties.join(", ")}
                        </div>
                        <div>
                          <span className="font-medium">Delivery Time:</span> {zone.deliveryTime}
                        </div>
                        <div>
                          <span className="font-medium">Cost:</span> {zone.cost}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Policies */}
          <div className="bg-white rounded-2xl p-8 shadow-soft">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Policies</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Order Processing</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Orders are processed within 24 hours</li>
                  <li>• Orders placed after 2 PM are processed the next business day</li>
                  <li>• Weekend orders are processed on Monday</li>
                  <li>• You'll receive tracking information via email and SMS</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Delivery Information</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Delivery is available Monday to Saturday</li>
                  <li>• We'll contact you before delivery to confirm</li>
                  <li>• Someone must be present to receive the package</li>
                  <li>• ID verification may be required for high-value items</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
