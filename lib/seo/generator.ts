
import type { Metadata } from 'next';
import type { Product, Category } from '@prisma/client';

interface SEOConfig {
  siteName: string;
  siteUrl: string;
  defaultImage: string;
  twitterHandle?: string;
}

const seoConfig: SEOConfig = {
  siteName: 'LuxiorMall',
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://luxiormall.com',
  defaultImage: '/og-default.jpg',
  twitterHandle: '@LuxiorMall',
};

export class SEOGenerator {
  static generateProductSEO(product: Product & { category?: Category }): Metadata {
    const title = `${product.name} - ${seoConfig.siteName}`;
    const description = product.shortDescription || 
      product.description?.slice(0, 160) || 
      `Shop ${product.name} at ${seoConfig.siteName}. Premium quality products with fast delivery across Kenya.`;
    
    const keywords = [
      product.name,
      product.category?.name || '',
      'shopping',
      'ecommerce',
      'Kenya',
      'premium products',
      seoConfig.siteName
    ].filter(Boolean);

    const imageUrl = product.images?.[0] || seoConfig.defaultImage;
    const url = `${seoConfig.siteUrl}/products/${product.slug}`;

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: 'website',
        url,
        siteName: seoConfig.siteName,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        site: seoConfig.twitterHandle,
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: url,
      },
    };
  }

  static generateCategorySEO(category: Category, productsCount?: number): Metadata {
    const title = `${category.name} - ${seoConfig.siteName}`;
    const description = `Browse ${productsCount ? `${productsCount}+ ` : ''}premium ${category.name.toLowerCase()} products at ${seoConfig.siteName}. Quality guaranteed with fast delivery across Kenya.`;
    
    const keywords = [
      category.name,
      `${category.name} shopping`,
      'ecommerce',
      'Kenya',
      'premium products',
      seoConfig.siteName
    ];

    const url = `${seoConfig.siteUrl}/categories/${category.slug}`;

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: 'website',
        url,
        siteName: seoConfig.siteName,
        images: [
          {
            url: seoConfig.defaultImage,
            width: 1200,
            height: 630,
            alt: `${category.name} - ${seoConfig.siteName}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        site: seoConfig.twitterHandle,
        title,
        description,
        images: [seoConfig.defaultImage],
      },
      alternates: {
        canonical: url,
      },
    };
  }

  static generateStructuredData(product: Product & { category?: Category }) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      sku: product.sku || product.id,
      brand: {
        '@type': 'Brand',
        name: seoConfig.siteName,
      },
      category: product.category?.name,
      image: product.images || [],
      offers: {
        '@type': 'Offer',
        price: parseFloat(product.price.toString()),
        priceCurrency: product.currency || 'KES',
        availability: product.stockQuantity > 0 
          ? 'https://schema.org/InStock' 
          : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: seoConfig.siteName,
        },
        url: `${seoConfig.siteUrl}/products/${product.slug}`,
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.5',
        reviewCount: '127',
      },
    };
  }

  static generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: `${seoConfig.siteUrl}${crumb.url}`,
      })),
    };
  }
}
