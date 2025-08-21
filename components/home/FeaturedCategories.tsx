'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Category } from '@prisma/client';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export function FeaturedCategories(): JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (err) {
        setError('Failed to fetch categories');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No categories available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.slice(0, 4).map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          className="group block"
        >
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden transition-all duration-300 group-hover:shadow-medium group-hover:-translate-y-1">
            <div className="aspect-square bg-gradient-to-br from-luxior-peach to-luxior-orange flex items-center justify-center">
              <div className="text-center p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-white/90 text-sm">
                  {category.description}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
