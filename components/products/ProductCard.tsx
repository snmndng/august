'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import type { ProductWithDetails } from '@/lib/services/products';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: ProductWithDetails;
}

export function ProductCard({ product }: ProductCardProps): JSX.Element {
  const { addItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const formatPrice = (price: number | string | any): string => {
    let numericPrice: number;
    if (typeof price === 'string') {
      numericPrice = parseFloat(price);
    } else if (typeof price === 'number') {
      numericPrice = price;
    } else if (price && typeof price === 'object' && 'toNumber' in price) {
      // Handle Prisma Decimal type
      numericPrice = price.toNumber();
    } else {
      numericPrice = 0;
    }
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(numericPrice);
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      addItem(product, 1);
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist functionality
  };

  return (
    <div className="bg-background text-foreground rounded-lg shadow-soft hover:shadow-medium transition-shadow duration-300 group dark:bg-luxior-black dark:text-luxior-white">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        {product.images && product.images.length > 0 && product.images[0] ? (
          <img
            src={product.images[0].imageUrl}
            alt={product.images[0].altText || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 bg-luxior-accent flex items-center justify-center dark:bg-luxior-black">
            <span className="text-gray-400 text-sm dark:text-gray-500">No Image</span>
          </div>
        )}
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button
              onClick={handleWishlist}
              className={`p-2 rounded-full transition-colors ${
                isWishlisted 
                  ? 'bg-luxior-error text-white' 
                  : 'bg-background text-foreground hover:bg-luxior-accent dark:bg-luxior-black dark:text-luxior-white dark:hover:bg-luxior-accent'
              }`}
              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
            <Link
              href={`/products/${product.slug}`}
              className="p-2 rounded-full bg-background text-foreground hover:bg-luxior-accent transition-colors dark:bg-luxior-black dark:text-luxior-white dark:hover:bg-luxior-accent"
              title="View product"
            >
              <Eye size={18} />
            </Link>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isFeatured && (
            <span className="px-2 py-1 bg-luxior-info text-white text-xs rounded-full">
              Featured
            </span>
          )}
          {product.isBestseller && (
            <span className="px-2 py-1 bg-luxior-orange text-white text-xs rounded-full">
              Best Seller
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <div className="text-sm text-gray-500 mb-2 dark:text-gray-400">
            {product.category.name}
          </div>
        )}

        {/* Product Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold mb-2 hover:text-luxior-deep-orange transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-sm text-gray-500 line-through dark:text-gray-400">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          {product.stockQuantity > 0 ? (
            <span className="text-sm text-luxior-success">
              In Stock ({product.stockQuantity} available)
            </span>
          ) : (
            <span className="text-sm text-luxior-error">Out of Stock</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0 || isAddingToCart}
            className={`btn-primary flex-1 flex items-center justify-center gap-2 py-2 text-lg ${
              product.stockQuantity === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isAddingToCart ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
