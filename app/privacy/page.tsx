export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-luxior-black via-gray-900 to-luxior-deep-orange text-white">
        <div className="container-max py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              How we collect, use, and protect your personal information
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <div className="prose prose-lg max-w-none">
                <h2>Privacy Policy</h2>
                <p><strong>Last updated:</strong> January 2024</p>
                
                <h3>1. Information We Collect</h3>
                <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
                
                <h3>2. How We Use Your Information</h3>
                <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
                
                <h3>3. Information Sharing</h3>
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
                
                <h3>4. Data Security</h3>
                <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                
                <h3>5. Your Rights</h3>
                <p>You have the right to access, update, or delete your personal information. Contact us to exercise these rights.</p>
                
                <h3>6. Contact Us</h3>
                <p>If you have questions about this privacy policy, please contact us at privacy@luxiormall.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
