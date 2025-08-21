import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/common/WhatsAppButton'
import { CartSidebar } from '@/components/cart/CartSidebar'

// Fallback to system fonts to avoid build issues
const fontClasses = 'font-sans'

export const metadata: Metadata = {
  title: {
    default: 'LuxiorMall - Premium Ecommerce Platform',
    template: '%s | LuxiorMall'
  },
  description: 'Modern ecommerce platform for premium products with M-Pesa payments. Shop shoes, fashion, laptops, and more with secure checkout and fast delivery.',
  keywords: ['ecommerce', 'shopping', 'Kenya', 'M-Pesa', 'fashion', 'electronics', 'shoes', 'laptops'],
  authors: [{ name: 'LuxiorMall Team' }],
  creator: 'LuxiorMall',
  publisher: 'LuxiorMall',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'LuxiorMall - Premium Ecommerce Platform',
    description: 'Modern ecommerce platform for premium products with M-Pesa payments.',
    siteName: 'LuxiorMall',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LuxiorMall - Premium Ecommerce Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LuxiorMall - Premium Ecommerce Platform',
    description: 'Modern ecommerce platform for premium products with M-Pesa payments.',
    images: ['/og-image.jpg'],
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
    google: 'your-google-verification-code',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LuxiorMall',
  },
  applicationName: 'LuxiorMall',
  referrer: 'origin-when-cross-origin',
}

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: '#ff7900',
    colorScheme: 'light',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={fontClasses}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LuxiorMall" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#ff7900" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={`${fontClasses} antialiased bg-gray-50`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <WhatsAppButton />
            <CartSidebar />
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
