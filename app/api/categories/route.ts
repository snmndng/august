import { NextResponse } from 'next/server';
import { ProductsService } from '@/lib/services/products';

export async function GET() {
  try {
    const categories = await ProductsService.getAllCategories();
    
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
