
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url, title, timestamp } = await request.json();
    
    // In a real application, you would save this to your analytics database
    // For now, we'll just log it
    console.log('Page view tracked:', {
      url,
      title,
      timestamp,
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking page view:', error);
    return NextResponse.json(
      { error: 'Failed to track page view' },
      { status: 500 }
    );
  }
}
