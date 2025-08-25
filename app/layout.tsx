import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Providers from '@/components/providers'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartSidebar from '@/components/cart/CartSidebar'
import ChatWidget from '@/components/chat/ChatWidget'
import WhatsAppButton from '@/components/common/WhatsAppButton'
import AuthDebug from '@/components/common/AuthDebug'
import ChatSidePanel from '@/components/chat/ChatSidePanel'

export const metadata: Metadata = {
  title: 'LuxiorMall - Premium Shopping Experience',
  description: 'Discover premium products and exceptional shopping experience at LuxiorMall. From electronics to fashion, find everything you need with fast delivery across Kenya.',
  keywords: 'online shopping, ecommerce, electronics, fashion, Kenya, premium products, LuxiorMall',
  authors: [{ name: 'LuxiorMall Team' }],
  creator: 'LuxiorMall',
  publisher: 'LuxiorMall',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://luxiormall.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'LuxiorMall - Premium Shopping Experience',
    description: 'Discover premium products and exceptional shopping experience at LuxiorMall.',
    url: 'https://luxiormall.com',
    siteName: 'LuxiorMall',
    locale: 'en_KE',
    type: 'website',
    images: [
      {
        url: '/api/og?title=LuxiorMall',
        width: 1200,
        height: 630,
        alt: 'LuxiorMall - Premium Shopping Experience',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LuxiorMall - Premium Shopping Experience',
    description: 'Discover premium products and exceptional shopping experience at LuxiorMall.',
    images: ['/api/og?title=LuxiorMall'],
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
    google: 'google-site-verification-code',
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
        <meta name="theme-color" content="#FF6B35" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LuxiorMall" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="LuxiorMall" />
      </head>
      <body className="antialiased bg-white text-gray-900">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>

          {/* Global Components */}
          <CartSidebar />
          <ChatWidget />
          <WhatsAppButton />
          <AuthDebug />
          <ChatSidePanel />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#10B981',
                },
              },
              error: {
                duration: 5000,
                style: {
                  background: '#EF4444',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}