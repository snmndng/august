
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductFilters } from '@/components/products/ProductFilters';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ProductsService } from '@/lib/services/products';
import { SEOGenerator } from '@/lib/seo/generator';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const categories = await ProductsService.getAllCategories();
    const category = categories.find(cat => cat.slug === slug);
    
    if (!category) {
      return {
        title: 'Category Not Found - LuxiorMall',
        description: 'The requested category could not be found.',
      };
    }

    // Get products count for this category
    const products = await ProductsService.getProductsByCategory(category.id);
    
    return SEOGenerator.generateCategorySEO(category, products.length);
  } catch (error) {
    console.error('Error generating category metadata:', error);
    return {
      title: 'Category - LuxiorMall',
      description: 'Browse our premium product categories',
    };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps): JSX.Element {
  try {
    const { slug } = await params;
    const categories = await ProductsService.getAllCategories();
    const category = categories.find(cat => cat.slug === slug);
    
    if (!category) {
      notFound();
    }

    // Generate breadcrumb structured data
    const breadcrumbData = SEOGenerator.generateBreadcrumbStructuredData([
      { name: 'Home', url: '/' },
      { name: 'Categories', url: '/categories' },
      { name: category.name, url: `/categories/${category.slug}` },
    ]);

    return (
      <>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
        />

        <div className="min-h-screen bg-gray-50">
          <div className="container-max py-8">
            {/* Category Header */}
            <div className="mb-8">
              <nav>
                <ol className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                  <li>
                    <a href="/" className="hover:text-blue-600">Home</a>
                  </li>
                  <li>
                    <span className="mx-2">/</span>
                  </li>
                  <li>
                    <a href="/categories" className="hover:text-blue-600">Categories</a>
                  </li>
                  <li>
                    <span className="mx-2">/</span>
                  </li>
                  <li className="text-gray-900 font-medium">{category.name}</li>
                </ol>
              </nav>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{category.name}</h1>
              <p className="text-lg text-gray-600">
                Discover our premium {category.name.toLowerCase()} collection
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
                <Suspense fallback={<LoadingSpinner />}>
                  <ProductGrid categoryId={category.id} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading category:', error);
    notFound();
  }
}
