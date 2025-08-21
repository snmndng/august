'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Phone, MapPin, CreditCard, Lock } from 'lucide-react';

export function CheckoutForm(): JSX.Element {
  const { state, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (state.items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    try {
      // TODO: Implement M-Pesa payment integration
      console.log('Processing checkout:', { formData, cart: state.items });
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // TODO: Redirect to success page or handle payment response
      alert('Payment processed successfully! (This is a demo)');
      clearCart();
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-luxior-accent rounded-full flex items-center justify-center dark:bg-luxior-black">
          <CreditCard size={24} className="text-luxior-deep-orange" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6 dark:text-gray-400">Add some products to your cart to proceed with checkout</p>
        <a
          href="/products"
          className="btn-primary inline-block w-full py-3 text-lg"
        >
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-background text-foreground dark:bg-luxior-black dark:text-luxior-white">
      {/* Checkout Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-2xl font-semibold mb-6">Shipping Information</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent bg-background text-foreground"
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent bg-background text-foreground"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent bg-background text-foreground"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone Number (M-Pesa) *
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="254700000000"
                required
                className="w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent bg-background text-foreground"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              Address *
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent bg-background text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent bg-background text-foreground"
              />
            </div>
            
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium mb-1">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent bg-background text-foreground"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Lock size={20} />
                Pay with M-Pesa
              </>
            )}
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 h-fit">
  <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
        
        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {state.items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 bg-luxior-accent rounded-lg dark:bg-luxior-black">
              <div className="w-16 h-16 bg-luxior-accent rounded-lg flex items-center justify-center flex-shrink-0 dark:bg-luxior-black">
                <span className="text-gray-400 text-xs dark:text-gray-500">Image</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{item.product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                <p className="text-sm font-medium">
                  {formatPrice(getProductPrice(item.product.price) * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Totals */}
        <div className="border-t border-gray-200 pt-4 space-y-3">
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

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-3">
            <Lock size={20} className="text-luxior-info mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-luxior-info mb-1">Secure Checkout</h3>
              <p className="text-sm text-luxior-info">
                Your payment information is encrypted and secure. We use M-Pesa's secure payment gateway.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
