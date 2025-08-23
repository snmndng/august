import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';

export const metadata: Metadata = {
  title: 'Checkout - LuxiorMall',
  description: 'Complete your purchase with secure M-Pesa payment',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-luxior-black via-gray-900 to-luxior-deep-orange text-white">
        <div className="container-max py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-luxior-peach bg-clip-text text-transparent">
              Checkout
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Complete your purchase with our secure M-Pesa payment system
            </p>
            <div className="flex items-center justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-luxior-peach">
                <div className="w-2 h-2 bg-luxior-peach rounded-full"></div>
                <span className="text-sm">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-luxior-peach">
                <div className="w-2 h-2 bg-luxior-peach rounded-full"></div>
                <span className="text-sm">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-luxior-peach">
                <div className="w-2 h-2 bg-luxior-peach rounded-full"></div>
                <span className="text-sm">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-max py-12">
        <CheckoutForm />
      </div>
    </div>
  );
}