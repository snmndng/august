import { RotateCcw, Package, CreditCard, Clock, AlertCircle } from 'lucide-react';

export default function ReturnsPage() {
  const returnSteps = [
    {
      step: 1,
      title: "Contact Customer Service",
      description: "Reach out to our support team within 30 days of delivery",
      icon: Package
    },
    {
      step: 2,
      title: "Get Return Authorization",
      description: "We'll provide you with a return label and instructions",
      icon: RotateCcw
    },
    {
      step: 3,
      title: "Package and Ship",
      description: "Securely package the item and ship it back to us",
      icon: Package
    },
    {
      step: 4,
      title: "Refund Processed",
      description: "Once we receive and inspect the item, refund is processed",
      icon: CreditCard
    }
  ];

  const returnPolicies = [
    {
      category: "Electronics",
      timeframe: "30 days",
      condition: "Must be in original packaging with all accessories",
      notes: "No physical damage, must be fully functional"
    },
    {
      category: "Fashion & Apparel",
      timeframe: "30 days",
      condition: "Unworn, unwashed, with original tags attached",
      notes: "No signs of wear, stains, or alterations"
    },
    {
      category: "Shoes & Accessories",
      timeframe: "30 days",
      condition: "Unworn, in original packaging",
      notes: "No scuffs, dirt, or signs of use"
    },
    {
      category: "Home & Lifestyle",
      timeframe: "30 days",
      condition: "Unused, in original packaging",
      notes: "No damage, missing parts, or signs of use"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-luxior-black via-gray-900 to-luxior-deep-orange text-white">
        <div className="container-max py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Returns & Refunds</h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Hassle-free returns and refunds for your peace of mind
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-max">
          {/* Return Process */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How Returns Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {returnSteps.map((step) => (
                <div key={step.step} className="bg-white rounded-2xl p-6 shadow-soft text-center">
                  <div className="w-16 h-16 bg-luxior-deep-orange rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">{step.step}</span>
                  </div>
                  <div className="w-12 h-12 bg-luxior-orange rounded-lg flex items-center justify-center mx-auto mb-4">
                    <step.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Return Policies */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Return Policies by Category</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {returnPolicies.map((policy, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-soft">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{policy.category}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-luxior-deep-orange" />
                      <span className="text-sm text-gray-600">
                        <span className="font-medium">Timeframe:</span> {policy.timeframe}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Package size={16} className="text-luxior-deep-orange mt-0.5" />
                      <span className="text-sm text-gray-600">
                        <span className="font-medium">Condition:</span> {policy.condition}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertCircle size={16} className="text-luxior-deep-orange mt-0.5" />
                      <span className="text-sm text-gray-600">
                        <span className="font-medium">Notes:</span> {policy.notes}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-gradient-to-br from-red-600 to-pink-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">Important Information</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">What Cannot Be Returned</h3>
                <ul className="space-y-2 text-white/90">
                  <li>• Personalized or custom items</li>
                  <li>• Items marked as "Final Sale"</li>
                  <li>• Damaged items due to misuse</li>
                  <li>• Items without original packaging</li>
                  <li>• Digital products and gift cards</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Refund Information</h3>
                <ul className="space-y-2 text-white/90">
                  <li>• Refunds are processed within 5-7 business days</li>
                  <li>• Original payment method will be credited</li>
                  <li>• Return shipping costs are customer's responsibility</li>
                  <li>• Restocking fees may apply to certain items</li>
                  <li>• Contact us for damaged items during shipping</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="text-center mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help with a Return?</h2>
            <p className="text-gray-600 mb-6">
              Our customer service team is here to help you with any return-related questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-block px-8 py-3 bg-luxior-deep-orange text-white font-semibold rounded-lg hover:bg-luxior-orange transition-colors"
              >
                Contact Support
              </a>
              <a
                href="tel:+254700000000"
                className="inline-block px-8 py-3 border-2 border-luxior-deep-orange text-luxior-deep-orange font-semibold rounded-lg hover:bg-luxior-deep-orange hover:text-white transition-colors"
              >
                Call Us: +254 700 000 000
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
