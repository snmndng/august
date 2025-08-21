export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-luxior-black via-gray-900 to-luxior-deep-orange text-white">
        <div className="container-max py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Cookie Policy</h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              How we use cookies and similar technologies
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
                <h2>Cookie Policy</h2>
                <p><strong>Last updated:</strong> January 2024</p>
                
                <h3>What Are Cookies</h3>
                <p>Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience and allow certain features to work properly.</p>
                
                <h3>How We Use Cookies</h3>
                <p>We use cookies for several purposes:</p>
                <ul>
                  <li><strong>Essential cookies:</strong> Required for the website to function properly</li>
                  <li><strong>Performance cookies:</strong> Help us understand how visitors interact with our website</li>
                  <li><strong>Functionality cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Targeting cookies:</strong> Used to deliver relevant advertisements</li>
                </ul>
                
                <h3>Types of Cookies We Use</h3>
                <h4>Session Cookies</h4>
                <p>These cookies are temporary and are deleted when you close your browser. They help maintain your session while you browse our website.</p>
                
                <h4>Persistent Cookies</h4>
                <p>These cookies remain on your device for a set period or until you delete them. They help us remember your preferences and provide personalized content.</p>
                
                <h3>Third-Party Cookies</h3>
                <p>We may use third-party services that place cookies on your device. These services help us analyze website traffic, provide social media features, and deliver advertisements.</p>
                
                <h3>Managing Cookies</h3>
                <p>You can control and manage cookies in several ways:</p>
                <ul>
                  <li>Browser settings: Most browsers allow you to refuse or accept cookies</li>
                  <li>Cookie consent: We provide options to accept or decline non-essential cookies</li>
                  <li>Third-party opt-outs: Many third-party services provide opt-out mechanisms</li>
                </ul>
                
                <h3>Your Choices</h3>
                <p>By using our website, you consent to our use of cookies. You can withdraw this consent at any time by changing your browser settings or contacting us.</p>
                
                <h3>Updates to This Policy</h3>
                <p>We may update this cookie policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
                
                <h3>Contact Us</h3>
                <p>If you have questions about our use of cookies, please contact us at privacy@luxiormall.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
