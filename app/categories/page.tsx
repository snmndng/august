import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CategoriesContent } from '@/components/categories/CategoriesContent';

export const metadata: Metadata = {
  title: 'All Categories - LuxiorMall',
  description: 'Browse all product categories at LuxiorMall. From shoes and fashion to electronics and laptops, find everything you need.',
  keywords: ['categories', 'shopping', 'fashion', 'electronics', 'shoes', 'laptops', 'Kenya'],
  openGraph: {
    title: 'All Categories - LuxiorMall',
    description: 'Browse all product categories at LuxiorMall.',
    type: 'website',
    url: '/categories',
  },
  alternates: {
    canonical: '/categories',
  },
};

export default function CategoriesPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-luxior-deep-orange"></div>
        </div>
      }
    >
      <CategoriesContent />
    </Suspense>
  );
}

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-luxior-black via-gray-900 to-luxior-deep-orange text-white">
        <div className="container-max py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Shop by Category</h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Discover our curated collection of premium products across various categories
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories && categories.length > 0 ? categories.map((category) => {
              const IconComponent = categoryIcons[category.slug] || ShoppingBag;
              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group"
                >
                  <div className="category-card">
                    <div className="category-icon">
                      <IconComponent size={48} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {category.description || `Explore our ${category.name} collection`}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-luxior-deep-orange font-medium">
                        Browse Products
                      </span>
                      <svg
                        className="w-5 h-5 text-luxior-deep-orange group-hover:translate-x-1 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            }) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg">No categories available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}