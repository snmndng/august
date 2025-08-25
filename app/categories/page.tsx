import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CategoriesContent } from '@/components/categories/CategoriesContent';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

// Placeholder for categoryIcons and other necessary imports/definitions if they are used within CategoriesContent or this file.
// Assuming these are defined elsewhere or within the CategoriesContent component.
const categoryIcons = {
  'shoes': ShoppingBag,
  'fashion': ShoppingBag,
  'electronics': ShoppingBag,
  'laptops': ShoppingBag,
};

export const metadata: Metadata = {
  title: 'All Categories - LuxiorMall',
  description: 'Browse all product categories at LuxiorMall. From shoes and fashion to electronics and laptops, find everything you need.',
  keywords: ['categories', 'shopping', 'fashion', 'electronics', 'shoes', 'laptops', 'Kenya'],
  openGraph: {
    title: 'All Categories - LuxiorMall',
    description: 'Browse all product categories at LuxiorMall.',
    type: 'website',
    url: '/categories',
  },
  alternates: {
    canonical: '/categories',
  },
};

export default function CategoriesPage({ error, categories }: { error?: string; categories?: any[] }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-luxior-deep-orange"></div>
        </div>
      }
    >
      {/* CategoriesContent would typically handle fetching or receiving categories data */}
      {/* If CategoriesContent is meant to be rendered here and handle its own state/fetching, it should be called directly. */}
      {/* Assuming CategoriesContent itself handles the error and categories data display */}
      <CategoriesContent />
    </Suspense>
  );
}

// The following JSX was outside the default export function, which is a syntax error in React.
// It seems like an attempt to handle error and display content, but it was misplaced.
// The corrected logic assumes that the error and categories are handled within or passed to CategoriesContent.

// If you intended to have conditional rendering here based on error or categories props passed to CategoriesPage:
/*
export default function CategoriesPage({ error, categories }: { error?: string; categories?: any[] }) {
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Assuming CategoriesContent can accept categories and render them
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-luxior-deep-orange"></div>
          </div>
        }
      >
        <CategoriesContent categories={categories} />
      </Suspense>
    </div>
  );
}
*/