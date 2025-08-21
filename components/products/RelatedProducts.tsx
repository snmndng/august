'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import type { ProductWithDetails } from '@/lib/services/products';

interface RelatedProductsProps {
  currentProductId: string;
  categoryId?: string | undefined;
}

export function RelatedProducts({ currentProductId, categoryId }: RelatedProductsProps): JSX.Element {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        
        if (categoryId) {
          // Fetch products from the same category, excluding the current product
          const response = await fetch(`/api/products?categoryId=${categoryId}&limit=4`);
          const data = await response.json();
          
          // Filter out the current product
          const filteredProducts = data.products.filter((product: ProductWithDetails) => product.id !== currentProductId);
          setProducts(filteredProducts.slice(0, 4)); // Limit to 4 products
        } else {
          // If no category, fetch some featured products instead
          const response = await fetch('/api/products?featured=true&limit=4');
          const data = await response.json();
          
          // Filter out the current product
          const filteredProducts = data.products.filter((product: ProductWithDetails) => product.id !== currentProductId);
          setProducts(filteredProducts.slice(0, 4)); // Limit to 4 products
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, categoryId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No related products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
