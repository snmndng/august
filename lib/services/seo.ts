
export interface SEOMetrics {
  pageViews: number;
  organicTraffic: number;
  searchImpressions: number;
  averagePosition: number;
  clickThroughRate: number;
}

export class SEOService {
  static async trackPageView(url: string, title: string) {
    // Track page views for SEO analytics
    try {
      await fetch('/api/analytics/pageview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          title,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }

  static generateMetaKeywords(productName: string, category?: string): string[] {
    const baseKeywords = [
      productName,
      'LuxiorMall',
      'Kenya',
      'online shopping',
      'ecommerce',
      'premium products',
      'fast delivery',
    ];

    if (category) {
      baseKeywords.push(category, `${category} Kenya`, `buy ${category}`);
    }

    // Add product-specific keywords
    const productWords = productName.toLowerCase().split(' ');
    productWords.forEach(word => {
      if (word.length > 3) {
        baseKeywords.push(`${word} Kenya`, `buy ${word}`, `${word} online`);
      }
    });

    return [...new Set(baseKeywords)]; // Remove duplicates
  }

  static generateProductDescription(product: any): string {
    if (product.shortDescription) {
      return product.shortDescription;
    }

    if (product.description) {
      // Extract first 160 characters for meta description
      const description = product.description.replace(/<[^>]*>/g, ''); // Strip HTML
      return description.length > 157 
        ? `${description.substring(0, 157)}...`
        : description;
    }

    return `Shop ${product.name} at LuxiorMall. Premium quality ${product.category?.name || 'products'} with fast delivery across Kenya. Best prices guaranteed.`;
  }
}
