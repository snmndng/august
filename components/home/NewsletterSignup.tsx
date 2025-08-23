'use client';

import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';

export function NewsletterSignup(): JSX.Element {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    
    // Simulate API call - replace with actual newsletter signup
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Newsletter signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">
          Welcome to LuxiorMall!
        </h3>
        <p className="text-white/80 mb-6">
          You've successfully subscribed to our newsletter. Stay tuned for exclusive offers and updates!
        </p>
        <button
          onClick={() => setIsSubscribed(false)}
          className="text-luxior-peach hover:text-white transition-colors duration-200"
        >
          Subscribe another email
        </button>
      </div>
    );
  }

  return (
    <section className="py-20">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Stay Updated
        </h2>
        <p className="text-lg text-white/80 mb-8">
          Subscribe to our newsletter for exclusive offers, new product alerts, and shopping tips.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-luxior-peach focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="px-6 py-3 bg-luxior-peach hover:bg-white text-luxior-black font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              'Subscribing...'
            ) : (
              <>
                Subscribe
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </button>
        </form>
        
        <p className="text-sm text-white/60 mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}