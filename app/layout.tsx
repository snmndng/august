
import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartSidebar } from '@/components/cart/CartSidebar'
import { ChatWidget } from '@/components/chat/ChatWidget'
import { WhatsAppButton } from '@/components/common/WhatsAppButton'

export const metadata: Metadata = {
  title: 'LuxiorMall - Premium Electronics & Fashion',
  description: 'Discover premium electronics, fashion, and lifestyle products at LuxiorMall. Quality guaranteed, fast delivery, exceptional service.',
  keywords: 'electronics, fashion, premium, luxury, online shopping, Kenya',
  authors: [{ name: 'LuxiorMall Team' }],
  creator: 'LuxiorMall',
  publisher: 'LuxiorMall',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'LuxiorMall - Premium Electronics & Fashion',
    description: 'Discover premium electronics, fashion, and lifestyle products at LuxiorMall.',
    url: '/',
    siteName: 'LuxiorMall',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LuxiorMall - Premium Electronics & Fashion',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LuxiorMall - Premium Electronics & Fashion',
    description: 'Discover premium electronics, fashion, and lifestyle products at LuxiorMall.',
    creator: '@luxiormall',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-144x144.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FF6B35" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="min-h-screen bg-gray-50">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          
          {/* Chat Widget */}
          <ChatWidget />
          
          {/* Additional Components */}
          <CartSidebar />
          <WhatsAppButton />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
