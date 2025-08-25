import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/products/ProductDetail';
import { RelatedProducts } from '@/components/products/RelatedProducts';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ProductsService } from '@/lib/services/products';
import { serializeProduct } from '@/lib/serializers';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const product = await ProductsService.getProductBySlug(slug);
    
    if (!product) {
      return {
        title: 'Product Not Found - LuxiorMall',
        description: 'The requested product could not be found.',
      };
    }

    return {
      title: `${product.name} - LuxiorMall`,
      description: product.shortDescription || product.description || `Shop ${product.name} at LuxiorMall`,
      keywords: [product.name, 'shopping', 'ecommerce', 'Kenya'],
      openGraph: {
        title: product.name,
        description: product.shortDescription || product.description || `Shop ${product.name} at LuxiorMall`,
        type: 'website',
        url: `/products/${product.slug}`,
        images: [
          {
            url: '/og-product-image.jpg', // TODO: Use actual product image
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
      },
      alternates: {
        canonical: `/products/${product.slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product - LuxiorMall',
      description: 'Browse our premium products',
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps): Promise<JSX.Element> {
  try {
    const { slug } = await params;
    const product = await ProductsService.getProductBySlug(slug);
    
    if (!product) {
      notFound();
    }

    // Generate structured data for SEO
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      sku: product.sku,
      brand: {
        '@type': 'Brand',
        name: 'LuxiorMall',
      },
      offers: {
        '@type': 'Offer',
        price: parseFloat(product.price.toString()), // Ensure price is a number
        priceCurrency: 'KES',
        availability: product.stockQuantity > 0 
          ? 'https://schema.org/InStock' 
          : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'LuxiorMall',
        },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.5', // Placeholder, ideally from product data
        reviewCount: '127', // Placeholder, ideally from product data
      },
    };
    
    const serializedProduct = serializeProduct(product);

    return (
      <>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <div className="min-h-screen bg-gray-50">
          <div className="container-max py-8">
            {/* Back Button and Breadcrumb */}
            <div className="mb-6 space-y-4">
              {/* Back Button */}
              <button 
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors group"
              >
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              {/* Breadcrumb */}
              <nav>
                <ol className="flex items-center space-x-2 text-sm text-gray-600">
                  <li>
                    <a href="/" className="hover:text-blue-600">Home</a>
                  </li>
                  <li>
                    <span className="mx-2">/</span>
                  </li>
                  <li>
                    <a href="/products" className="hover:text-blue-600">Products</a>
                  </li>
                  <li>
                    <span className="mx-2">/</span>
                  </li>
                  <li className="text-gray-900 font-medium">{product.name}</li>
                </ol>
              </nav>
            </div>

            {/* Product Detail */}
            <Suspense fallback={<LoadingSpinner />}>
              <ProductDetail product={serializedProduct} />
            </Suspense>

            {/* Related Products */}
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
              <Suspense fallback={<LoadingSpinner />}>
                                <RelatedProducts
                  currentProductId={product.id}
                  categoryId={product.categoryId || undefined}
                />
              </Suspense>
            </section>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading product:', error);
    notFound();
  }
}