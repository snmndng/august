export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-luxior-black via-gray-900 to-luxior-deep-orange text-white">
        <div className="container-max py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Terms and conditions for using LuxiorMall services
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
                <h2>Terms of Service</h2>
                <p><strong>Last updated:</strong> January 2024</p>
                
                <h3>1. Acceptance of Terms</h3>
                <p>By accessing and using LuxiorMall&apos;s website, you accept and agree to be bound by the terms and provision of this agreement.</p>
                
                <h3>2. Use License</h3>
                <p>Permission is granted to temporarily download one copy of the materials on LuxiorMall for personal, non-commercial transitory viewing only.</p>
                
                <h3>3. Disclaimer</h3>
                <p>The materials on LuxiorMall are provided on an 'as is' basis. LuxiorMall makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                
                <h3>4. Limitations</h3>
                <p>In no event shall LuxiorMall or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on LuxiorMall.</p>
                
                <h3>5. Accuracy of Materials</h3>
                <p>The materials appearing on LuxiorMall could include technical, typographical, or photographic errors. LuxiorMall does not warrant that any of the materials on its website are accurate, complete or current.</p>
                
                <h3>6. Links</h3>
                <p>LuxiorMall has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by LuxiorMall of the site.</p>
                
                <h3>7. Modifications</h3>
                <p>LuxiorMall may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms of Service.</p>
                
                <h3>8. Contact Information</h3>
                <p>If you have any questions about these Terms of Service, please contact us at legal@luxiormall.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}