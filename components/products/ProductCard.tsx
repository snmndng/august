
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Eye, Star, ArrowRight } from 'lucide-react';
import type { ProductWithDetails } from '@/lib/services/products';
import { useCart } from '@/contexts/CartContext';
import { PriceDropBadge, PriceHistoryIndicator } from '@/components/products/PriceDropBadge';
import { StockBadge } from '@/components/products/StockStatus';

interface ProductCardProps {
  product: ProductWithDetails;
}

export function ProductCard({ product }: ProductCardProps): JSX.Element {
  const { addItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
    <div 
      className="group relative bg-white dark:bg-gray-900 rounded-3xl shadow-soft hover:shadow-strong transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-luxior-orange/20 dark:hover:border-luxior-orange/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-3xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        {product.images && product.images.length > 0 && product.images[0] ? (
          <img
            src={product.images[0].image_url}
            alt={product.images[0].alt_text || product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                <ShoppingCart className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">No Image Available</span>
            </div>
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex items-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleWishlist}
              className={`p-3 rounded-2xl backdrop-blur-md transition-all duration-300 shadow-lg hover:scale-110 ${
                isWishlisted 
                  ? 'bg-luxior-error text-white shadow-luxior-error/25' 
                  : 'bg-white/90 text-gray-700 hover:bg-white hover:text-luxior-error shadow-black/10'
              }`}
              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
            <Link
              href={`/products/${product.slug}`}
              className="p-3 rounded-2xl bg-luxior-deep-orange text-white transition-all duration-300 shadow-lg hover:scale-110 hover:bg-luxior-orange shadow-luxior-deep-orange/25"
              title="View product"
            >
              <Eye size={18} />
            </Link>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <StockBadge 
            stockQuantity={product.stock_quantity} 
            lowStockThreshold={product.low_stock_threshold || 5}
            allowPreorder={product.allow_preorder ?? false}
          />
          <PriceDropBadge product={product} variant="small" showAmount={false} />
          {product.is_featured && (
            <span className="px-3 py-1 bg-luxior-info text-white text-xs font-medium rounded-full shadow-lg">
              Featured
            </span>
          )}
          {product.is_bestseller && (
            <span className="px-3 py-1 bg-luxior-orange text-white text-xs font-medium rounded-full shadow-lg">
              Best Seller
            </span>
          )}
        </div>

        {/* Wishlist Button (top right) */}
        <button
          onClick={handleWishlist}
          className={`absolute top-4 right-4 p-2 rounded-xl backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 ${
            isWishlisted 
              ? 'bg-luxior-error text-white' 
              : 'bg-white/80 text-gray-700 hover:bg-white hover:text-luxior-error'
          }`}
        >
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-4">
        {/* Category & Rating */}
        <div className="flex items-center justify-between">
          {product.category && (
            <span className="text-xs font-medium text-luxior-orange bg-luxior-orange/10 px-2 py-1 rounded-lg">
              {product.category.name}
            </span>
          )}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className="text-yellow-400 fill-current" />
            ))}
            <span className="text-xs text-gray-500 ml-1">(4.5)</span>
          </div>
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white hover:text-luxior-deep-orange dark:hover:text-luxior-orange transition-colors duration-200 line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
            <PriceHistoryIndicator product={product} />
          </div>
          <PriceDropBadge product={product} variant="small" />
        </div>
          
        {/* Stock Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {product.stock_quantity > 0 ? (
              <>
                <div className="w-2 h-2 bg-luxior-success rounded-full"></div>
                <span className="text-sm text-luxior-success font-medium">
                  In Stock {product.stock_quantity <= (product.low_stock_threshold || 5) && `(${product.stock_quantity} left)`}
                </span>
              </>
            ) : (product.allow_preorder ?? false) ? (
              <>
                <div className="w-2 h-2 bg-luxior-orange rounded-full"></div>
                <span className="text-sm text-luxior-orange font-medium">Preorder Available</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-luxior-error rounded-full"></div>
                <span className="text-sm text-luxior-error font-medium">Out of Stock</span>
              </>
            )}
          </div>
          {product.estimated_restock_date && product.stock_quantity === 0 && (
            <span className="text-xs text-gray-500">
              {new Date(product.estimated_restock_date) > new Date() ? 'Coming Soon' : 'Available Now'}
            </span>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleAddToCart}
          disabled={(product.stock_quantity === 0 && !product.allow_preorder) || isAddingToCart}
          className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-300 transform flex items-center justify-center gap-2 ${
            (product.stock_quantity === 0 && !product.allow_preorder)
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : isAddingToCart
                ? 'bg-luxior-orange text-white scale-95'
                : product.stock_quantity === 0 && product.allow_preorder
                  ? 'bg-luxior-orange text-white hover:bg-luxior-deep-orange hover:scale-105 hover:shadow-lg active:scale-95'
                  : 'bg-luxior-deep-orange text-white hover:bg-luxior-orange hover:scale-105 hover:shadow-lg active:scale-95'
          }`}
        >
          {isAddingToCart ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {product.stock_quantity === 0 && product.allow_preorder ? 'Adding to Preorder...' : 'Adding...'}
            </>
          ) : (product.stock_quantity === 0 && !product.allow_preorder) ? (
            'Out of Stock'
          ) : product.stock_quantity === 0 && product.allow_preorder ? (
            <>
              <ShoppingCart size={18} />
              Preorder Now
              <ArrowRight size={16} className={`transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`} />
            </>
          ) : (
            <>
              <ShoppingCart size={18} />
              Add to Cart
              <ArrowRight size={16} className={`transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`} />
            </>
          )}
        </button>
      </div>

      {/* Animated border on hover */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-luxior-deep-orange via-luxior-orange to-luxior-peach opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" style={{padding: '1px'}}>
        <div className="w-full h-full bg-white dark:bg-gray-900 rounded-3xl"></div>
      </div>
    </div>
  );
}
