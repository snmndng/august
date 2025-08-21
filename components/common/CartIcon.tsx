'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export function CartIcon(): JSX.Element {
  const { state, toggleCart } = useCart();

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
      aria-label="Shopping cart"
    >
      <ShoppingCart size={24} />
      
      {/* Cart item count badge */}
      {state.totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {state.totalItems > 99 ? '99+' : state.totalItems}
        </span>
      )}
    </button>
  );
}
