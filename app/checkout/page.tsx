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
    <div className="min-h-screen bg-gray-50">
      <div className="container-max py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Checkout</h1>
          <p className="text-lg text-gray-600">
            Complete your purchase with secure M-Pesa payment
          </p>
        </div>

        <CheckoutForm />
      </div>
    </div>
  );
}
