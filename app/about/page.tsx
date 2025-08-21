export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-luxior-black via-gray-900 to-luxior-deep-orange text-white">
        <div className="container-max py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About LuxiorMall</h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Your premier destination for premium products in Kenya
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded with a vision to bring premium products closer to Kenyan consumers, 
                LuxiorMall has grown from a small startup to become one of the leading 
                e-commerce platforms in the region.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We believe that quality should be accessible to everyone, and that's why 
                we've partnered with top brands and suppliers to offer you the best products 
                at competitive prices.
              </p>
              <p className="text-lg text-gray-600">
                Our commitment to excellence, secure payments through M-Pesa, and nationwide 
                delivery has made us the trusted choice for thousands of customers across Kenya.
              </p>
            </div>
            <div className="bg-gradient-to-br from-luxior-deep-orange to-luxior-orange rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Premium Product Selection
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Secure M-Pesa Payments
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Nationwide Delivery
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  24/7 Customer Support
                </li>
              </ul>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-luxior-deep-orange mb-2">10K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-luxior-deep-orange mb-2">500+</div>
              <div className="text-gray-600">Premium Products</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-luxior-deep-orange mb-2">47</div>
              <div className="text-gray-600">Counties Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-luxior-deep-orange mb-2">99%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To democratize access to premium products by providing a seamless, 
                secure, and convenient shopping experience for all Kenyans, while 
                supporting local businesses and contributing to the country's digital economy.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To become East Africa's leading e-commerce platform, known for 
                quality, reliability, and innovation, while empowering millions 
                of customers to access world-class products and services.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
