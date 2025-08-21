import type { Metadata } from 'next';
import { Suspense } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedCategories } from '@/components/home/FeaturedCategories';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export const metadata: Metadata = {
  title: 'LuxiorMall - Premium Ecommerce Platform',
  description: 'Discover premium products at LuxiorMall. Shop shoes, fashion, laptops, and more with secure M-Pesa payments and fast delivery across Kenya.',
  keywords: ['ecommerce', 'shopping', 'Kenya', 'M-Pesa', 'fashion', 'electronics', 'shoes', 'laptops', 'premium'],
  openGraph: {
    title: 'LuxiorMall - Premium Ecommerce Platform',
    description: 'Discover premium products at LuxiorMall. Shop shoes, fashion, laptops, and more with secure M-Pesa payments and fast delivery across Kenya.',
    type: 'website',
    url: '/',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LuxiorMall - Premium Ecommerce Platform',
      },
    ],
  },
  alternates: {
    canonical: '/',
  },
};

export default function HomePage(): JSX.Element {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Categories */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our curated collection of premium products across various categories
            </p>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <FeaturedCategories />
          </Suspense>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked premium products from our top sellers
            </p>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <FeaturedProducts />
          </Suspense>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-gradient-primary text-white">
        <div className="container-max">
          <WhyChooseUs />
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="section-padding bg-gray-900">
        <div className="container-max">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
}
