
'use client';

import { useState } from 'react';
import { Bell, TrendingDown } from 'lucide-react';

interface PriceAlertFormProps {
  productId: string;
  currentPrice: number;
  productName: string;
}

export function PriceAlertForm({ productId, currentPrice, productName }: PriceAlertFormProps) {
  const [email, setEmail] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !targetPrice) return;

    setIsLoading(true);
    try {
      // TODO: Implement price alert API
      const response = await fetch('/api/price-alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          email,
          targetPrice: parseFloat(targetPrice),
          currentPrice,
        }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        setEmail('');
        setTargetPrice('');
      }
    } catch (error) {
      console.error('Error setting price alert:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-800">
          <Bell size={20} />
          <span className="font-medium">Price Alert Set!</span>
        </div>
        <p className="text-green-700 text-sm mt-1">
          We'll notify you when {productName} drops to {formatPrice(parseFloat(targetPrice))} or lower.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center gap-2 text-blue-800 mb-3">
        <TrendingDown size={20} />
        <span className="font-medium">Get Price Drop Alerts</span>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxior-orange"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Price (KES)
          </label>
          <input
            type="number"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            placeholder={`Lower than ${currentPrice}`}
            max={currentPrice - 1}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxior-orange"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Current price: {formatPrice(currentPrice)}
          </p>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-luxior-deep-orange text-white py-2 px-4 rounded-md hover:bg-luxior-orange transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Setting Alert...' : 'Set Price Alert'}
        </button>
      </form>
    </div>
  );
}
