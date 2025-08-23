'use client';

import { X, Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

export function CartSidebar(): JSX.Element | null {
  const { state, removeItem, updateQuantity, clearCart, closeCart } = useCart();

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

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (!state.isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-luxior-black bg-opacity-50 z-40 dark:bg-opacity-70"
        onClick={closeCart}
      />
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-background text-foreground shadow-soft z-50 transform transition-transform duration-300 ease-in-out dark:bg-luxior-black dark:text-luxior-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Shopping Cart</h2>
          <button
            onClick={closeCart}
            className="p-2 text-foreground hover:text-luxior-deep-orange transition-colors"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-luxior-orange scrollbar-track-gray-100 dark:scrollbar-track-gray-800 hover:scrollbar-thumb-luxior-deep-orange">
          <div className="p-6">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-luxior-accent rounded-full flex items-center justify-center dark:bg-luxior-black">
                  <ShoppingCart size={24} className="text-luxior-deep-orange" />
                </div>
                <p className="text-gray-500 text-lg mb-4 dark:text-gray-400">Your cart is empty</p>
                <button
                  onClick={closeCart}
                  className="btn-primary w-full py-3 text-lg disabled:opacity-50"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-luxior-accent rounded-lg dark:bg-luxior-black">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-400 text-xs dark:text-gray-500">Image</span>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{item.product.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">{formatPrice(item.product.price)}</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          className="p-1 text-gray-500 hover:text-luxior-deep-orange transition-colors dark:hover:text-luxior-orange"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          className="p-1 text-gray-500 hover:text-luxior-deep-orange transition-colors dark:hover:text-luxior-orange"
                          aria-label="Increase quantity"
                          disabled={item.quantity >= item.product.stockQuantity}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="p-2 text-red-500 hover:text-luxior-error transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t border-border p-6 mt-auto">
            {/* Cart Summary */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal ({state.totalItems} items):</span>
                <span className="font-medium">{formatPrice(state.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Delivery:</span>
                <span className="font-medium text-luxior-success">Free</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(state.totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="btn-primary w-full py-3 text-lg text-center block"
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={clearCart}
                className="btn-secondary w-full py-2 text-lg"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}