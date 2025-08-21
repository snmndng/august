import { HelpCircle, ShoppingBag, CreditCard, Truck, RotateCcw, Shield } from 'lucide-react';

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I place an order?",
      answer: "Browse our products, add items to your cart, and proceed to checkout. You can pay securely using M-Pesa or other available payment methods."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept M-Pesa, bank transfers, and credit/debit cards. All payments are processed securely through our payment partners."
    },
    {
      question: "How long does delivery take?",
      answer: "Standard delivery takes 2-5 business days within Nairobi and 3-7 business days for other counties. Express delivery options are also available."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Products must be unused and in original packaging. Contact our customer service for return authorization."
    },
    {
      question: "Do you ship nationwide?",
      answer: "Yes, we deliver to all 47 counties in Kenya. Shipping costs vary by location and delivery speed."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email and SMS. You can also track your order in your account dashboard."
    }
  ];

  const supportCategories = [
    {
      icon: ShoppingBag,
      title: "Ordering",
      description: "Help with placing orders, tracking, and order management"
    },
    {
      icon: CreditCard,
      title: "Payments",
      description: "Payment methods, security, and billing questions"
    },
    {
      icon: Truck,
      title: "Shipping",
      description: "Delivery options, costs, and shipping policies"
    },
    {
      icon: RotateCcw,
      title: "Returns",
      description: "Return process, refunds, and exchange policies"
    },
    {
      icon: Shield,
      title: "Security",
      description: "Account security and data protection"
    },
    {
      icon: HelpCircle,
      title: "General",
      description: "Other questions and general support"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-luxior-black via-gray-900 to-luxior-deep-orange text-white">
        <div className="container-max py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Help Center</h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Find answers to common questions and get the support you need
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-max">
          {/* Support Categories */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How can we help you?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supportCategories.map((category, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-300">
                  <div className="w-12 h-12 bg-luxior-deep-orange rounded-lg flex items-center justify-center mb-4">
                    <category.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-soft">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-br from-luxior-deep-orange to-luxior-orange rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
            <p className="text-xl mb-6">
              Our customer support team is here to help you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-block px-8 py-3 bg-white text-luxior-deep-orange font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="tel:+254700000000"
                className="inline-block px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-luxior-deep-orange transition-colors"
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
