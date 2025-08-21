'use client';

import { useState } from 'react';
import { ChevronDown, Grid, List } from 'lucide-react';

interface ProductSortProps {
  onSortChange?: (sortBy: string) => void;
  onViewChange?: (viewMode: 'grid' | 'list') => void;
  totalProducts?: number;
}

export function ProductSort({ onSortChange, onViewChange, totalProducts = 0 }: ProductSortProps): JSX.Element {
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'popularity', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setIsSortOpen(false);
    onSortChange?.(value);
  };

  const handleViewChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    onViewChange?.(mode);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Results Count */}
      <div className="text-sm text-gray-600">
        {totalProducts} product{totalProducts !== 1 ? 's' : ''} found
      </div>

      {/* Sort and View Controls */}
      <div className="flex items-center gap-4">
        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <span>
              {sortOptions.find(option => option.value === sortBy)?.label || 'Sort by'}
            </span>
            <ChevronDown size={16} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSortOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsSortOpen(false)}
              />
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      sortBy === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => handleViewChange('grid')}
            className={`p-2 transition-colors ${
              viewMode === 'grid' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            title="Grid view"
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => handleViewChange('list')}
            className={`p-2 transition-colors ${
              viewMode === 'list' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            title="List view"
          >
            <List size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
