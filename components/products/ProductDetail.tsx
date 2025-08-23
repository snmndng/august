'use client';

import { useState } from 'react';
import { Heart, ShoppingCart, Share2, MessageCircle, Truck, Shield, RotateCcw } from 'lucide-react';
import type { ProductWithDetails } from '@/lib/services/products';
import { useCart } from '@/contexts/CartContext';

interface ProductDetailProps {
  product: ProductWithDetails;
}

export function ProductDetail({ product }: ProductDetailProps): JSX.Element {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Helper function to safely get product price
  const getProductPrice = (price: number | string | any): number => {
    if (typeof price === 'string') {
      return parseFloat(price);
    } else if (typeof price === 'number') {
      return price;
    } else if (price && typeof price === 'object' && 'toNumber' in price) {
      // Handle Prisma Decimal type
      return price.toNumber();
    } else {
      return 0;
    }
  };

  // Helper function to safely get numeric values from Prisma fields
  const getNumericValue = (value: any): number | string => {
    if (value && typeof value === 'object' && 'toNumber' in value) {
      return value.toNumber();
    }
    return value;
  };

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
    if (product.stock_quantity === 0) return;

    setIsAddingToCart(true);
    try {
      addItem(product, quantity);
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.short_description || product.description || `Check out ${product.name} at LuxiorMall`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleWhatsApp = () => {
    const message = `Hi! I'm interested in ${product.name} (${window.location.href})`;
    const whatsappUrl = `https://wa.me/254700000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Mock product images - replace with actual product images
  const productImages = [
    '/product-placeholder-1.jpg',
    '/product-placeholder-2.jpg',
    '/product-placeholder-3.jpg',
    '/product-placeholder-4.jpg',
  ];

  return (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-background text-foreground dark:bg-luxior-black dark:text-luxior-white">
      {/* Product Images */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-lg dark:text-gray-500">Product Image {selectedImage + 1}</span>
          </div>
        </div>

        {/* Thumbnail Images */}
        <div className="grid grid-cols-4 gap-2">
          {productImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square bg-luxior-accent rounded-lg overflow-hidden border-2 transition-colors dark:bg-luxior-black ${
                selectedImage === index ? 'border-luxior-info' : 'border-transparent'
              }`}
            >
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400 text-xs dark:text-gray-500">Thumb {index + 1}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        {/* Product Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">{product.short_description}</p>
        </div>

        {/* Price */}
        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold">
            {formatPrice(product.price)}
          </span>
          {product.compare_price && product.compare_price > product.price && (
            <>
              <span className="text-xl text-gray-500 line-through dark:text-gray-400">
                {formatPrice(product.compare_price)}
              </span>
              <span className="px-2 py-1 bg-luxior-error/10 text-luxior-error text-sm font-medium rounded">
                {Math.round(((getProductPrice(product.compare_price) - getProductPrice(product.price)) / getProductPrice(product.compare_price)) * 100)}% OFF
              </span>
            </>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          {product.stock_quantity > 0 ? (
            <span className="text-luxior-success font-medium">
              ✓ In Stock ({product.stock_quantity} available)
            </span>
          ) : (
            <span className="text-luxior-error font-medium">✗ Out of Stock</span>
          )}
        </div>

        {/* Quantity Selector */}
        {product.stock_quantity > 0 && (
          <div className="flex items-center gap-4">
            <label className="font-medium">Quantity:</label>
            <div className="flex items-center border border-border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-foreground hover:bg-luxior-accent dark:hover:bg-luxior-black"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-2 border-x border-border">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                className="px-3 py-2 text-foreground hover:bg-luxior-accent dark:hover:bg-luxior-black"
                disabled={quantity >= product.stock_quantity}
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {product.stock_quantity > 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className={`btn-primary flex-1 flex items-center justify-center gap-2 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isAddingToCart ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart size={20} />
                  Add to Cart
                </>
              )}
            </button>
          ) : (
            <button className="btn-secondary flex-1 py-3 text-lg opacity-50 cursor-not-allowed">
              Out of Stock
            </button>
          )}

          <button
            onClick={handleWishlist}
            className={`p-3 rounded-lg border transition-colors ${
              isWishlisted
                ? 'border-luxior-error text-luxior-error bg-luxior-error/10'
                : 'border-border text-foreground hover:border-luxior-error hover:text-luxior-error'
            }`}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={handleShare}
            className="p-3 rounded-lg border border-border text-foreground hover:border-luxior-info hover:text-luxior-info transition-colors"
            title="Share product"
          >
            <Share2 size={20} />
          </button>
        </div>

        {/* WhatsApp Support */}
        <button
          onClick={handleWhatsApp}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-lg"
        >
          <MessageCircle size={20} />
          Contact via WhatsApp
        </button>

        {/* Product Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-luxior-info">
            <Truck size={16} />
            <span>Free Delivery</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-luxior-success">
            <Shield size={16} />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-luxior-warning">
            <RotateCcw size={16} />
            <span>Easy Returns</span>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="pt-6 border-t border-border">
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed dark:text-gray-400">{product.description}</p>
            </div>
          </div>
        )}

        {/* Product Details */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-3">Product Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">SKU:</span>
              <span className="ml-2 text-gray-900">{product.sku || 'N/A'}</span>
            </div>
                         <div>
               <span className="text-gray-500">Category:</span>
               <span className="ml-2 text-gray-900">{product.category?.name || 'Uncategorized'}</span>
             </div>
             {product.weight_kg && (
               <div>
                 <span className="text-gray-500">Weight:</span>
                 <span className="ml-2 text-gray-900">{getNumericValue(product.weight_kg)} kg</span>
               </div>
             )}
             {product.dimensions_cm && (
               <div>
                 <span className="text-gray-500">Dimensions:</span>
                 <span className="ml-2 text-gray-900">{getNumericValue(product.dimensions_cm)}</span>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}