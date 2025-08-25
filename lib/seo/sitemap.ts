
import { ProductsService } from '@/lib/services/products';

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export class SitemapGenerator {
  private static baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://luxiormall.com';

  static async generateSitemap(): Promise<SitemapEntry[]> {
    const entries: SitemapEntry[] = [];

    // Static pages
    const staticPages = [
      { url: '/', priority: 1.0, changeFreq: 'daily' as const },
      { url: '/products', priority: 0.9, changeFreq: 'daily' as const },
      { url: '/categories', priority: 0.8, changeFreq: 'weekly' as const },
      { url: '/deals', priority: 0.7, changeFreq: 'daily' as const },
      { url: '/about', priority: 0.5, changeFreq: 'monthly' as const },
      { url: '/contact', priority: 0.5, changeFreq: 'monthly' as const },
      { url: '/help', priority: 0.4, changeFreq: 'monthly' as const },
      { url: '/privacy', priority: 0.3, changeFreq: 'yearly' as const },
      { url: '/terms', priority: 0.3, changeFreq: 'yearly' as const },
    ];

    staticPages.forEach(page => {
      entries.push({
        url: `${this.baseUrl}${page.url}`,
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority,
      });
    });

    try {
      // Dynamic product pages
      const products = await ProductsService.getAllProducts();
      products.forEach(product => {
        entries.push({
          url: `${this.baseUrl}/products/${product.slug}`,
          lastModified: new Date(product.updatedAt || product.createdAt),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });

      // Dynamic category pages
      const categories = await ProductsService.getAllCategories();
      categories.forEach(category => {
        entries.push({
          url: `${this.baseUrl}/categories/${category.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });
    } catch (error) {
      console.error('Error generating dynamic sitemap entries:', error);
    }

    return entries;
  }

  static generateXML(entries: SitemapEntry[]): string {
    const urls = entries.map(entry => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toISOString().split('T')[0]}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }
}
