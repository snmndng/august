'use client';

import { useState } from 'react';
import { useAuth, useIsAdmin } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Package,
  Save,
  ArrowLeft,
  DollarSign,
  Tag,
  FileText
} from 'lucide-react';

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice: number;
  stockQuantity: number;
  categoryId: string;
  sku: string;
  tags: string;
  status: 'draft' | 'active' | 'inactive';
  isFeatured: boolean;
  isBestseller: boolean;
  sellerId: string;
}



export default function CreateProductPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const isAdmin = useIsAdmin();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: 0,
    comparePrice: 0,
    stockQuantity: 0,
    categoryId: '',
    sku: '',
    tags: '',
    status: 'draft',
    isFeatured: false,
    isBestseller: false,
    sellerId: ''
  });

  // Redirect if not admin
  if (!isLoading && (!isAuthenticated || !isAdmin)) {
    router.push('/');
    return null;
  }

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));

      // Auto-generate slug when name changes
      if (name === 'name') {
        setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          comparePrice: Number(formData.comparePrice),
          stockQuantity: Number(formData.stockQuantity),
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        }),
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to create product'}`);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxior-deep-orange"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-luxior-deep-orange" />
            <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
          </div>
        </div>
        <p className="text-gray-600">Add a new product to your inventory</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Basic Information
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
              placeholder="Brief product description..."
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
              placeholder="Detailed product description..."
            />
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Pricing & Inventory
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (KES) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compare Price (KES)
              </label>
              <input
                type="number"
                name="comparePrice"
                value={formData.comparePrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
              placeholder="Product SKU..."
            />
          </div>
        </div>

        {/* Organization */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Organization
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
              >
                <option value="">Select a category</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="shoes">Shoes</option>
                <option value="laptops">Laptops</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seller
              </label>
              <select
                name="sellerId"
                value={formData.sellerId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
                required
              >
                <option value="">Select a seller</option>
                <option value="seller1">John Doe (john@example.com)</option>
                <option value="seller2">Jane Smith (jane@example.com)</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
              placeholder="electronics, smartphone, android..."
            />
          </div>
        </div>

        {/* Status & Features */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Status & Features</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="h-4 w-4 text-luxior-deep-orange focus:ring-luxior-deep-orange border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Featured Product
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isBestseller"
                checked={formData.isBestseller}
                onChange={handleInputChange}
                className="h-4 w-4 text-luxior-deep-orange focus:ring-luxior-deep-orange border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Bestseller
              </label>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-luxior-deep-orange text-white rounded-lg hover:bg-luxior-orange disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}