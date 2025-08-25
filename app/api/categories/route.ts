import { NextResponse } from 'next/server';
import { ProductsService } from '@/lib/services/products';

export async function GET() {
  try {
    const categories = await ProductsService.getAllCategories();

    return NextResponse.json({
      categories: categories || [],
      total: categories ? categories.length : 0
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return empty array as fallback instead of error
    return NextResponse.json({
      categories: [],
      total: 0,
      error: 'Failed to fetch categories'
    });
  }
}