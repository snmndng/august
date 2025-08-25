
import { NextResponse } from 'next/server';

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Disallow admin areas
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/

# Disallow auth pages
Disallow: /auth/

# Allow sitemap
Sitemap: ${process.env.NEXT_PUBLIC_APP_URL || 'https://luxiormall.com'}/sitemap.xml

# Crawl delay
Crawl-delay: 10`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, s-maxage=86400',
    },
  });
}
