import { NextResponse } from 'next/server';
import { ProductsService } from '@/lib/services/products';
import { demoCategories } from '@/lib/demo-data';

export async function GET() {
  try {
    const categories = await ProductsService.getAllCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.warn('Database not available, using demo data:', error);
    return NextResponse.json(demoCategories);
  }
}