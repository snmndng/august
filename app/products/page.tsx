import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductSort } from '@/components/products/ProductSort';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export const metadata: Metadata = {
  title: 'All Products - LuxiorMall',
  description: 'Browse our complete collection of premium products including shoes, fashion, laptops, and more.',
  keywords: ['products', 'shopping', 'fashion', 'electronics', 'shoes', 'laptops'],
};

export default function ProductsPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-max py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Products</h1>
          <p className="text-lg text-gray-600">
            Discover our complete collection of premium products
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-4">
              <Suspense fallback={<LoadingSpinner />}>
                <ProductFilters />
              </Suspense>
            </div>
          </div>

          {/* Products Section */}
          <div className="lg:w-3/4">
            {/* Sort and View Options */}
            <div className="mb-6">
              <Suspense fallback={<LoadingSpinner />}>
                <ProductSort />
              </Suspense>
            </div>

            {/* Products Grid */}
            <Suspense fallback={<LoadingSpinner />}>
              <ProductGrid />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
