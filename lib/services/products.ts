
import { supabase } from '@/lib/supabase';
import { Product, Category } from '@/types';

// Fallback demo data
const demoCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets and electronic devices',
    image_url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
    parent_id: null,
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Trendy clothing and accessories',
    image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    parent_id: null,
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Everything for your home and garden',
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    parent_id: null,
    is_active: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const demoProducts: Product[] = [
  {
    id: '1',
    seller_id: 'demo-seller',
    category_id: '1',
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    description: 'Latest iPhone with advanced features',
    short_description: 'Premium smartphone with A17 chip',
    price: 120000,
    compare_price: 135000,
    cost_price: null,
    stock_quantity: 10,
    low_stock_threshold: 5,
    sku: 'IPHONE15PRO',
    barcode: null,
    weight_kg: 0.2,
    dimensions_cm: null,
    status: 'active' as const,
    is_featured: true,
    is_bestseller: true,
    meta_title: null,
    meta_description: null,
    tags: ['smartphone', 'apple', 'premium'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    seller_id: 'demo-seller',
    category_id: '2',
    name: 'Nike Air Max',
    slug: 'nike-air-max',
    description: 'Comfortable running shoes',
    short_description: 'Premium running shoes for athletes',
    price: 15000,
    compare_price: 18000,
    cost_price: null,
    stock_quantity: 25,
    low_stock_threshold: 5,
    sku: 'NIKEAIRMAX',
    barcode: null,
    weight_kg: 0.5,
    dimensions_cm: null,
    status: 'active' as const,
    is_featured: true,
    is_bestseller: false,
    meta_title: null,
    meta_description: null,
    tags: ['shoes', 'nike', 'running'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export class ProductService {
  // Get all categories
  async getAllCategories(): Promise<Category[]> {
    try {
      if (!supabase) {
        console.log('Supabase not available, using demo data');
        return demoCategories;
      }

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        throw error;
      }

      return data || demoCategories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      console.log('Database not available, using demo data:', error);
      return demoCategories;
    }
  }

  // Get featured products
  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    try {
      if (!supabase) {
        console.log('Supabase not available, using demo data');
        return demoProducts.slice(0, limit);
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .eq('is_featured', true)
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || demoProducts.slice(0, limit);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      console.log('Database not available, using demo data:', error);
      return demoProducts.slice(0, limit);
    }
  }

  // Get products with pagination
  async getProductsWithPagination(
    page: number = 1,
    limit: number = 12,
    categoryId?: string,
    search?: string,
    sortBy?: string
  ): Promise<{ products: Product[]; total: number; hasMore: boolean }> {
    try {
      if (!supabase) {
        console.log('Supabase not available, using demo data');
        const filteredProducts = demoProducts.filter(product => {
          if (categoryId && product.category_id !== categoryId) return false;
          if (search && !product.name.toLowerCase().includes(search.toLowerCase())) return false;
          return true;
        });
        
        return {
          products: filteredProducts.slice(0, limit),
          total: filteredProducts.length,
          hasMore: filteredProducts.length > limit,
        };
      }

      const offset = (page - 1) * limit;
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('status', 'active');

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      // Apply sorting
      switch (sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'name_asc':
          query = query.order('name', { ascending: true });
          break;
        case 'name_desc':
          query = query.order('name', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      return {
        products: data || [],
        total: count || 0,
        hasMore: (count || 0) > offset + limit,
      };
    } catch (error) {
      console.error('Error fetching products with pagination:', error);
      console.log('Database not available, using demo data:', error);
      
      const filteredProducts = demoProducts.filter(product => {
        if (categoryId && product.category_id !== categoryId) return false;
        if (search && !product.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      });
      
      return {
        products: filteredProducts.slice(0, limit),
        total: filteredProducts.length,
        hasMore: filteredProducts.length > limit,
      };
    }
  }

  // Get product by slug
  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      if (!supabase) {
        console.log('Supabase not available, using demo data');
        return demoProducts.find(p => p.slug === slug) || null;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      console.log('Error loading product:', error);
      return demoProducts.find(p => p.slug === slug) || null;
    }
  }

  // Get product by ID
  async getProductById(id: string): Promise<Product | null> {
    try {
      if (!supabase) {
        return demoProducts.find(p => p.id === id) || null;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('status', 'active')
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return demoProducts.find(p => p.id === id) || null;
    }
  }

  // Get related products
  async getRelatedProducts(categoryId: string, excludeId: string, limit: number = 4): Promise<Product[]> {
    try {
      if (!supabase) {
        return demoProducts
          .filter(p => p.category_id === categoryId && p.id !== excludeId)
          .slice(0, limit);
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
        .eq('status', 'active')
        .neq('id', excludeId)
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching related products:', error);
      return demoProducts
        .filter(p => p.category_id === categoryId && p.id !== excludeId)
        .slice(0, limit);
    }
  }

  // Search products
  async searchProducts(query: string, limit: number = 10): Promise<Product[]> {
    try {
      if (!supabase) {
        return demoProducts
          .filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.description?.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, limit);
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error searching products:', error);
      return demoProducts
        .filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, limit);
    }
  }
}

// Export singleton instance
export const productService = new ProductService();
