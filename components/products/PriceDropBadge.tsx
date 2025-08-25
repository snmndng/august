
'use client';

import { TrendingDown, TrendingUp, Tag } from 'lucide-react';
import { PriceTrackingService } from '@/lib/services/priceTracking';

interface PriceDropBadgeProps {
  product: any;
  variant?: 'small' | 'medium' | 'large';
  showAmount?: boolean;
}

export function PriceDropBadge({ product, variant = 'medium', showAmount = true }: PriceDropBadgeProps) {
  const priceInfo = PriceTrackingService.getPriceChangeInfo(product);
  
  if (!priceInfo.hasDiscount && !priceInfo.hasPriceDrop) {
    return null;
  }

  const getSizeClasses = () => {
    switch (variant) {
      case 'small':
        return 'px-2 py-1 text-xs';
      case 'large':
        return 'px-4 py-2 text-sm';
      default:
        return 'px-3 py-1.5 text-xs';
    }
  };

  const getIconSize = () => {
    switch (variant) {
      case 'small':
        return 12;
      case 'large':
        return 18;
      default:
        return 14;
    }
  };

  // Show recent price drop if available
  if (priceInfo.hasPriceDrop && priceInfo.recentPriceChange) {
    const { changePercentage, changeAmount } = priceInfo.recentPriceChange;
    
    return (
      <div className={`inline-flex items-center gap-1 bg-green-100 text-green-800 font-semibold rounded-full ${getSizeClasses()}`}>
        <TrendingDown size={getIconSize()} />
        <span>
          {Math.abs(changePercentage)}% OFF
          {showAmount && ` (KES ${Math.abs(changeAmount).toFixed(0)} less)`}
        </span>
      </div>
    );
  }

  // Show discount from compare price
  if (priceInfo.hasDiscount) {
    return (
      <div className={`inline-flex items-center gap-1 bg-red-100 text-red-800 font-semibold rounded-full ${getSizeClasses()}`}>
        <Tag size={getIconSize()} />
        <span>
          {priceInfo.discountPercentage}% OFF
          {showAmount && ` (Save KES ${priceInfo.savings.toFixed(0)})`}
        </span>
      </div>
    );
  }

  return null;
}

interface PriceHistoryIndicatorProps {
  product: any;
  className?: string;
}

export function PriceHistoryIndicator({ product, className = '' }: PriceHistoryIndicatorProps) {
  const priceInfo = PriceTrackingService.getPriceChangeInfo(product);

  if (!priceInfo.recentPriceChange) {
    return null;
  }

  const { changePercentage } = priceInfo.recentPriceChange;
  const isPriceDrop = changePercentage < 0;
  const isSmallChange = Math.abs(changePercentage) < 5;

  if (isSmallChange) {
    return null; // Don't show indicator for small changes
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {isPriceDrop ? (
        <TrendingDown className="text-green-600" size={16} />
      ) : (
        <TrendingUp className="text-red-600" size={16} />
      )}
      <span className={`text-sm font-medium ${isPriceDrop ? 'text-green-600' : 'text-red-600'}`}>
        {Math.abs(changePercentage)}%
      </span>
    </div>
  );
}
