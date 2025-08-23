import { Decimal } from '@prisma/client/runtime/library';

export function serializeProduct(product: any) {
  return {
    ...product,
    price: product.price ? parseFloat(product.price.toString()) : 0,
    comparePrice: product.comparePrice ? parseFloat(product.comparePrice.toString()) : null,
    costPrice: product.costPrice ? parseFloat(product.costPrice.toString()) : null,
    category: product.category || null,
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