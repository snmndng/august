'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import type { Category } from '@/types';

interface ProductFiltersProps {
  onFiltersChange?: (filters: FilterState) => void;
}

interface FilterState {
  priceRange: [number, number];
  categories: string[];
  inStock: boolean;
  featured: boolean;
  bestseller: boolean;
}

export function ProductFilters({ onFiltersChange }: ProductFiltersProps): JSX.Element {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 100000],
    categories: [],
    inStock: false,
    featured: false,
    bestseller: false,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    categories: true,
    features: true,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/categories');
        // const data = await response.json();
        
        // Mock data for now
        const mockCategories: Category[] = [
          { id: 'cat1', name: 'Shoes', slug: 'shoes', is_active: true, sort_order: 1, created_at: '', updated_at: '' },
          { id: 'cat2', name: 'Electronics', slug: 'electronics', is_active: true, sort_order: 2, created_at: '', updated_at: '' },
          { id: 'cat3', name: 'Fashion', slug: 'fashion', is_active: true, sort_order: 3, created_at: '', updated_at: '' },
          { id: 'cat4', name: 'Home & Garden', slug: 'home-garden', is_active: true, sort_order: 4, created_at: '', updated_at: '' },
        ];
        
        setCategories(mockCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceChange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [min, max],
    }));
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      categories: checked
        ? [...prev.categories, categoryId]
        : prev.categories.filter(id => id !== categoryId),
    }));
  };

  const handleFeatureChange = (feature: keyof Pick<FilterState, 'inStock' | 'featured' | 'bestseller'>) => {
    setFilters(prev => ({
      ...prev,
      [feature]: !prev[feature],
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 100000],
      categories: [],
      inStock: false,
      featured: false,
      bestseller: false,
    });
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Filter size={20} className="text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
      </div>

      {/* Price Range */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          Price Range
          <ChevronDown 
            size={16} 
            className={`transition-transform ${expandedSections.price ? 'rotate-180' : ''}`}
          />
        </button>
        
        {expandedSections.price && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Min:</span>
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange(Number(e.target.value), filters.priceRange[1])}
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Max:</span>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(filters.priceRange[0], Number(e.target.value))}
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="100000"
              />
            </div>
            <div className="text-xs text-gray-500">
              Range: {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
            </div>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          Categories
          <ChevronDown 
            size={16} 
            className={`transition-transform ${expandedSections.categories ? 'rotate-180' : ''}`}
          />
        </button>
        
        {expandedSections.categories && (
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category.id)}
                  onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{category.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Features */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          onClick={() => toggleSection('features')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          Features
          <ChevronDown 
            size={16} 
            className={`transition-transform ${expandedSections.features ? 'rotate-180' : ''}`}
          />
        </button>
        
        {expandedSections.features && (
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={() => handleFeatureChange('inStock')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">In Stock Only</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.featured}
                onChange={() => handleFeatureChange('featured')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Featured Products</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.bestseller}
                onChange={() => handleFeatureChange('bestseller')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Best Sellers</span>
            </label>
          </div>
        )}
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="w-full py-2 px-4 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}
