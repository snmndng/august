
import { NextResponse } from 'next/server';
import { SitemapGenerator } from '@/lib/seo/sitemap';

export async function GET() {
  try {
    const entries = await SitemapGenerator.generateSitemap();
    const xml = SitemapGenerator.generateXML(entries);

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
