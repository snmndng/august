'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { ProductWithDetails } from '@/lib/services/products';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export function FeaturedProducts(): JSX.Element {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products?featured=true');
        if (!response.ok) {
          throw new Error('Failed to fetch featured products');
        }
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        setError('Failed to fetch featured products');
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No featured products available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.slug}`}
          className="group block"
        >
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden transition-all duration-300 group-hover:shadow-medium group-hover:-translate-y-1">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              {product.images && product.images.length > 0 && product.images[0] ? (
                <img
                  src={product.images[0].imageUrl}
                  alt={product.images[0].altText || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-luxior-deep-orange transition-colors duration-200">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.shortDescription || product.description}
                  </p>
                  <div className="flex items-center justify-center">
                    <span className="text-lg font-bold text-luxior-deep-orange">
                      KSh {typeof product.price === 'string' ? parseFloat(product.price).toLocaleString() : product.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-gray-500">
                    {product.stockQuantity > 0 ? (
                      <span className="text-green-600">In Stock ({product.stockQuantity})</span>
                    ) : (
                      <span className="text-red-600">Out of Stock</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
