'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import type { ProductWithDetails } from '@/lib/services/products';

export default function DealsPage() {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        // Fetch featured products as deals for now
        const response = await fetch('/api/products?featured=true&limit=12');
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-luxior-deep-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 via-pink-600 to-purple-600 text-white">
        <div className="container-max py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">🔥 Hot Deals</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Don&apos;t miss out on these amazing limited-time offers!
            </p>
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Deals</h2>
            <p className="text-lg text-gray-600">
              Handpicked products with special pricing
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No deals available at the moment.</p>
              <Link
                href="/products"
                className="inline-block mt-4 px-6 py-3 bg-luxior-deep-orange text-white rounded-lg hover:bg-luxior-orange transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}