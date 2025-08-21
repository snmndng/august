import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/types';

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(name, slug),
        product_images(image_url, alt_text, is_primary)
      `)
      .eq('slug', slug)
      .eq('status', 'active')
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    return data as Product;
  } catch (error) {
    console.error('Error in getProductBySlug:', error);
    return null;
  }
}

export async function getProducts(options: {
  categoryId?: string;
  searchQuery?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  filters?: {
    priceRange?: [number, number];
    inStock?: boolean;
    featured?: boolean;
    bestseller?: boolean;
  };
} = {}): Promise<{ products: Product[]; total: number }> {
  try {
    const supabase = createClient();
    
    let query = supabase
      .from('products')
      .select(`
        *,
        categories(name, slug),
        product_images(image_url, alt_text, is_primary)
      `, { count: 'exact' })
      .eq('status', 'active');

    // Apply category filter
    if (options.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }

    // Apply search filter
    if (options.searchQuery) {
      query = query.or(`name.ilike.%${options.searchQuery}%,description.ilike.%${options.searchQuery}%`);
    }

    // Apply price range filter
    if (options.filters?.priceRange) {
      const [min, max] = options.filters.priceRange;
      query = query.gte('price', min).lte('price', max);
    }

    // Apply stock filter
    if (options.filters?.inStock) {
      query = query.gt('stock_quantity', 0);
    }

    // Apply featured filter
    if (options.filters?.featured) {
      query = query.eq('is_featured', true);
    }

    // Apply bestseller filter
    if (options.filters?.bestseller) {
      query = query.eq('is_bestseller', true);
    }

    // Apply sorting
    if (options.sortBy) {
      switch (options.sortBy) {
        case 'price_low':
          query = query.order('price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'popularity':
          // TODO: Implement popularity sorting based on sales/views
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return { products: [], total: 0 };
    }

    return {
      products: data as Product[],
      total: count || 0,
    };
  } catch (error) {
    console.error('Error in getProducts:', error);
    return { products: [], total: 0 };
  }
}

export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(name, slug),
        product_images(image_url, alt_text, is_primary)
      `)
      .eq('status', 'active')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }

    return data as Product[];
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    return [];
  }
}

export async function getBestSellers(limit: number = 8): Promise<Product[]> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(name, slug),
        product_images(image_url, alt_text, is_primary)
      `)
      .eq('status', 'active')
      .eq('is_bestseller', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching best sellers:', error);
      return [];
    }

    return data as Product[];
  } catch (error) {
    console.error('Error in getBestSellers:', error);
    return [];
  }
}

export async function getProductsByCategory(categoryId: string, limit: number = 20): Promise<Product[]> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(name, slug),
        product_images(image_url, alt_text, is_primary)
      `)
      .eq('status', 'active')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }

    return data as Product[];
  } catch (error) {
    console.error('Error in getProductsByCategory:', error);
    return [];
  }
}

export async function searchProducts(query: string, limit: number = 20): Promise<Product[]> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(name, slug),
        product_images(image_url, alt_text, is_primary)
      `)
      .eq('status', 'active')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,short_description.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error searching products:', error);
      return [];
    }

    return data as Product[];
  } catch (error) {
    console.error('Error in searchProducts:', error);
    return [];
  }
}
