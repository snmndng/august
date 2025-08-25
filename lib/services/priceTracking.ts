
export interface PriceChange {
  id: string;
  product_id: string;
  old_price: number;
  new_price: number;
  change_percentage: number;
  change_amount: number;
  created_at: string;
}

export interface ProductPriceHistory {
  product_id: string;
  current_price: number;
  previous_price?: number;
  lowest_price?: number;
  highest_price?: number;
  price_changes: PriceChange[];
  last_price_drop?: {
    percentage: number;
    amount: number;
    date: string;
  };
}

export class PriceTrackingService {
  static calculatePriceChange(oldPrice: number, newPrice: number) {
    const changeAmount = newPrice - oldPrice;
    const changePercentage = ((changeAmount / oldPrice) * 100);
    
    return {
      changeAmount,
      changePercentage: Math.round(changePercentage * 100) / 100, // Round to 2 decimal places
      isPriceDrop: changeAmount < 0,
      isPriceIncrease: changeAmount > 0
    };
  }

  static getDiscountPercentage(currentPrice: number, comparePrice: number): number {
    if (!comparePrice || comparePrice <= currentPrice) return 0;
    return Math.round(((comparePrice - currentPrice) / comparePrice) * 100);
  }

  static getPriceChangeInfo(product: any) {
    const currentPrice = typeof product.price === 'string' 
      ? parseFloat(product.price) 
      : typeof product.price === 'object' && product.price?.toNumber
        ? product.price.toNumber()
        : Number(product.price) || 0;

    const comparePrice = product.compare_price 
      ? typeof product.compare_price === 'string'
        ? parseFloat(product.compare_price)
        : typeof product.compare_price === 'object' && product.compare_price?.toNumber
          ? product.compare_price.toNumber()
          : Number(product.compare_price)
      : null;

    // Calculate discount from compare price
    const discountPercentage = comparePrice ? this.getDiscountPercentage(currentPrice, comparePrice) : 0;
    const savings = comparePrice ? comparePrice - currentPrice : 0;

    // Mock recent price change data (in a real app, this would come from your database)
    const recentPriceChange = product.recent_price_change || null;
    
    return {
      currentPrice,
      comparePrice,
      discountPercentage,
      savings,
      recentPriceChange,
      hasDiscount: discountPercentage > 0,
      hasPriceDrop: recentPriceChange && recentPriceChange.changePercentage < 0
    };
  }

  static formatPriceChange(changePercentage: number, changeAmount: number): string {
    const sign = changePercentage >= 0 ? '+' : '';
    return `${sign}${changePercentage}% (${sign}KES ${Math.abs(changeAmount).toFixed(2)})`;
  }
}
