
'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Phone, MapPin, Lock, Shield, Package, CheckCircle } from 'lucide-react';

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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-luxior-orange to-luxior-deep-orange rounded-full flex items-center justify-center shadow-lg">
            <Package size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">Your cart is empty</h2>
          <p className="text-gray-600 mb-8 text-lg dark:text-gray-400">
            Add some amazing products to your cart to proceed with checkout
          </p>
          <a
            href="/products"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-luxior-orange to-luxior-deep-orange text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Package size={20} />
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-luxior-orange to-luxior-deep-orange p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <MapPin size={20} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Shipping Information</h2>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-luxior-orange focus:border-luxior-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                      placeholder="Enter your first name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-luxior-orange focus:border-luxior-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-luxior-orange focus:border-luxior-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Phone Number (M-Pesa) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="254700000000"
                        required
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-luxior-orange focus:border-luxior-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      We'll use this number for M-Pesa payment and delivery updates
                    </p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <MapPin size={20} className="text-luxior-orange" />
                    Shipping Address
                  </h3>
                  
                  <div className="space-y-2">
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-luxior-orange focus:border-luxior-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                      placeholder="Enter your full address"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="city" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-luxior-orange focus:border-luxior-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                        placeholder="Nairobi"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="postalCode" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-luxior-orange focus:border-luxior-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                        placeholder="00100"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-luxior-orange to-luxior-deep-orange text-white py-4 px-6 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 focus:ring-4 focus:ring-luxior-orange/30"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock size={22} />
                        Complete Order with M-Pesa
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Order Summary - Takes 1 column */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-luxior-deep-orange to-luxior-orange p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Package size={20} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Order Summary</h2>
              </div>
            </div>

            <div className="p-6">
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600">
                    <div className="w-16 h-16 bg-gradient-to-br from-luxior-peach to-luxior-orange rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Package size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm">{item.product.name}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</span>
                        <span className="text-sm font-bold text-luxior-deep-orange">
                          {formatPrice(getProductPrice(item.product.price) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal ({state.totalItems} {state.totalItems === 1 ? 'item' : 'items'}):</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(state.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Delivery:</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">Included</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-gray-900 dark:text-white">Total:</span>
                    <span className="text-luxior-deep-orange">{formatPrice(state.totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Shield size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1 text-sm">100% Secure Checkout</h3>
                    <p className="text-xs text-blue-700 dark:text-blue-200">
                      Your payment is protected by 256-bit SSL encryption and M-Pesa's secure gateway.
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 flex items-center justify-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-600">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle size={16} className="text-green-500" />
                  M-Pesa Verified
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Shield size={16} className="text-blue-500" />
                  SSL Secured
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
