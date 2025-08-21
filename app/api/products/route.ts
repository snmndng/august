import { NextRequest, NextResponse } from 'next/server';
import { ProductsService } from '@/lib/services/products';
import { demoProducts } from '@/lib/demo-data';

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
      try {
        const featuredProducts = await ProductsService.getFeaturedProducts();
        return NextResponse.json(featuredProducts);
      } catch (dbError) {
        console.warn('Database not available, using demo data:', dbError);
        const demoFeaturedProducts = demoProducts.filter(p => p.is_featured);
        return NextResponse.json(demoFeaturedProducts);
      }
    } else if (searchQuery) {
      // Search products
      try {
        products = await ProductsService.searchProducts(searchQuery);
        total = products.length;
        totalPages = Math.ceil(total / limit);
      } catch (dbError) {
        console.warn('Database not available, using demo data:', dbError);
        products = demoProducts.filter(p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        total = products.length;
        totalPages = Math.ceil(total / limit);
      }
    } else if (categoryId) {
      // Get products by category
      let category;
      try {
        category = await ProductsService.getCategoryBySlug(categoryId);
      } catch (dbError) {
        console.warn('Database not available, using demo data:', dbError);
        category = { id: categoryId, name: categoryId }; // Mock category for demo data
      }

      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }

      try {
        products = await ProductsService.getProductsByCategory(categoryId);
        total = products.length;
        totalPages = Math.ceil(total / limit);
      } catch (dbError) {
        console.warn('Database not available, using demo data:', dbError);
        products = demoProducts.filter(p => p.category === categoryId);
        total = products.length;
        totalPages = Math.ceil(total / limit);
      }
    } else {
      // Get all products with pagination
      try {
        const result = await ProductsService.getProductsWithPagination(page, limit);
        products = result.products;
        total = result.total;
        totalPages = result.totalPages;
      } catch (dbError) {
        console.warn('Database not available, using demo data:', dbError);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        products = demoProducts.slice(startIndex, endIndex);
        total = demoProducts.length;
        totalPages = Math.ceil(total / limit);
      }
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
    // Fallback to demo data if any unexpected error occurs
    try {
      const startIndex = (parseInt(new URL(request.url).searchParams.get('page') || '1') - 1) * parseInt(new URL(request.url).searchParams.get('limit') || '12');
      const endIndex = startIndex + parseInt(new URL(request.url).searchParams.get('limit') || '12');
      const fallbackProducts = demoProducts.slice(startIndex, endIndex);
      const fallbackTotalPages = Math.ceil(demoProducts.length / parseInt(new URL(request.url).searchParams.get('limit') || '12'));

      return NextResponse.json({
        products: fallbackProducts,
        pagination: {
          total: demoProducts.length,
          totalPages: fallbackTotalPages,
          currentPage: parseInt(new URL(request.url).searchParams.get('page') || '1'),
          limit: parseInt(new URL(request.url).searchParams.get('limit') || '12')
        }
      });
    } catch (demoError) {
      console.error('Error fetching demo products as fallback:', demoError);
      return NextResponse.json(
        { error: 'Failed to fetch products, and demo data fallback also failed.' },
        { status: 500 }
      );
    }
  }
}