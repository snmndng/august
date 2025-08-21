import { NextRequest, NextResponse } from 'next/server';
import { ProductsService } from '@/lib/services/products';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const searchQuery = searchParams.get('searchQuery');
    const featured = searchParams.get('featured') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    let products;
    let total = 0;
    let totalPages = 1;

    if (featured) {
      // Get featured products
      products = await ProductsService.getFeaturedProducts();
      total = products.length;
      totalPages = Math.ceil(total / limit);
    } else if (searchQuery) {
      // Search products
      products = await ProductsService.searchProducts(searchQuery);
      total = products.length;
      totalPages = Math.ceil(total / limit);
    } else if (categoryId) {
      // Get products by category
      const category = await ProductsService.getCategoryBySlug(categoryId);
      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }
      products = await ProductsService.getProductsByCategory(categoryId);
      total = products.length;
      totalPages = Math.ceil(total / limit);
    } else {
      // Get all products with pagination
      const result = await ProductsService.getProductsWithPagination(page, limit);
      products = result.products;
      total = result.total;
      totalPages = result.totalPages;
    }

    return NextResponse.json({
      products,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
