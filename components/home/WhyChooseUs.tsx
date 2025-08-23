'use client';

import { Shield, Truck, CreditCard, Headphones, Star, Zap } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'M-Pesa integration ensures safe and secure transactions',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Nationwide shipping with real-time tracking',
  },
  {
    icon: CreditCard,
    title: 'Best Prices',
    description: 'Competitive pricing and regular discounts',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Round-the-clock customer service',
  },
  {
    icon: Star,
    title: 'Premium Quality',
    description: 'Curated selection of high-quality products',
  },
  {
    icon: Zap,
    title: 'Instant Updates',
    description: 'Real-time stock and order notifications',
  },
];

export function WhyChooseUs(): JSX.Element {
  return (
    <section className="py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Why Choose LuxiorMall?
        </h2>
        <p className="text-xl text-white/90 max-w-3xl mx-auto">
          We&apos;re committed to providing the best shopping experience with premium products, 
          secure payments, and exceptional service.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
          >
            <div className="w-16 h-16 bg-luxior-peach rounded-full flex items-center justify-center mx-auto mb-6">
              <feature.icon className="w-8 h-8 text-luxior-black" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">
              {feature.title}
            </h3>
            <p className="text-white/80">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}