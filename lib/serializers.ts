
import { Decimal } from '@prisma/client/runtime/library';

export function serializeProduct(product: any) {
  return {
    ...product,
    price: product.price ? Number(product.price) : 0,
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
    weightKg: product.weightKg ? Number(product.weightKg) : null,
    createdAt: product.createdAt?.toISOString(),
    updatedAt: product.updatedAt?.toISOString(),
  };
}

export function serializeProducts(products: any[]) {
  return products.map(serializeProduct);
}

export function serializeDecimal(value: Decimal | null | undefined): number | null {
  if (!value) return null;
  return Number(value);
}
