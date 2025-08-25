
import { Clock, Package, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';

interface StockStatusProps {
  stockQuantity: number;
  lowStockThreshold: number;
  allowPreorder?: boolean;
  preorderLimit?: number;
  estimatedRestockDate?: string | Date;
}

export function StockStatus({ 
  stockQuantity, 
  lowStockThreshold, 
  allowPreorder = false,
  preorderLimit,
  estimatedRestockDate
}: StockStatusProps) {
  const formatDate = (date: string | Date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-KE', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(dateObj);
  };

  // Out of stock but preorder available
  if (stockQuantity === 0 && allowPreorder) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-luxior-orange" />
          <span className="font-medium text-luxior-orange">
            Available for Preorder
          </span>
        </div>
        {preorderLimit && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Limited to {preorderLimit} preorders
          </p>
        )}
        {estimatedRestockDate && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Expected: {formatDate(estimatedRestockDate)}</span>
          </div>
        )}
      </div>
    );
  }

  // Out of stock, no preorder
  if (stockQuantity === 0) {
    return (
      <div className="flex items-center gap-2">
        <Package className="w-4 h-4 text-luxior-error" />
        <span className="font-medium text-luxior-error">Out of Stock</span>
        {estimatedRestockDate && (
          <span className="text-sm text-gray-500 ml-2">
            • Expected: {formatDate(estimatedRestockDate)}
          </span>
        )}
      </div>
    );
  }

  // Low stock warning
  if (stockQuantity <= lowStockThreshold) {
    return (
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-luxior-warning" />
        <span className="font-medium text-luxior-warning">
          Only {stockQuantity} left in stock
        </span>
        {stockQuantity === 1 && (
          <span className="text-sm text-luxior-error ml-2">• Last item!</span>
        )}
      </div>
    );
  }

  // In stock
  return (
    <div className="flex items-center gap-2">
      <CheckCircle className="w-4 h-4 text-luxior-success" />
      <span className="font-medium text-luxior-success">
        In Stock ({stockQuantity} available)
      </span>
    </div>
  );
}

export function StockBadge({ 
  stockQuantity, 
  lowStockThreshold,
  allowPreorder = false 
}: Pick<StockStatusProps, 'stockQuantity' | 'lowStockThreshold' | 'allowPreorder'>) {
  if (stockQuantity === 0 && allowPreorder) {
    return (
      <span className="px-2 py-1 bg-luxior-orange/10 text-luxior-orange text-xs font-medium rounded-full">
        Preorder
      </span>
    );
  }

  if (stockQuantity === 0) {
    return (
      <span className="px-2 py-1 bg-luxior-error/10 text-luxior-error text-xs font-medium rounded-full">
        Out of Stock
      </span>
    );
  }

  if (stockQuantity <= lowStockThreshold) {
    return (
      <span className="px-2 py-1 bg-luxior-warning/10 text-luxior-warning text-xs font-medium rounded-full">
        Low Stock
      </span>
    );
  }

  return (
    <span className="px-2 py-1 bg-luxior-success/10 text-luxior-success text-xs font-medium rounded-full">
      In Stock
    </span>
  );
}
