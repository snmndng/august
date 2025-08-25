'use client';

import { useState, useEffect } from 'react';
import { useAuth, useIsAdmin } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Package,
  Save,
  ArrowLeft,
  DollarSign,
  FileText,
  Zap,
  Star,
  Eye,
  EyeOff,
  ChevronDown,
  Plus,
  X,
  Upload,
  Image,
  Camera,
  ArrowUp,
  ArrowDown,
  SkipForward,
  SkipBack,
  Move,
  Edit3
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
  // Category-specific fields
  specifications: Record<string, string>;
  warranty: string;
  brand: string;
  model: string;
  color: string;
  size: string;
  material: string;
  weight: string;
  // New fields
  lowStockThreshold: number;
  trackStock: boolean;
  allowBackorders: boolean;
  requiresShipping: boolean;
  shippingClass: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  customFields: Record<string, string>;
  availableFrom: string;
  availableTo: string;
  maxQuantityPerOrder: number;
  minimumAge: number;
  requiresPrescription: boolean;
  hazardousMaterial: boolean;
  fragile: boolean;
  perishable: boolean;
  digitalProduct: boolean;
  downloadUrl: string;
  licenseKey: string;
  validityPeriod: number;
  preorderEnabled: boolean;
  preorderDate: string;
  preorderPrice: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryFieldConfig {
  [key: string]: {
    fields: string[];
    icon: string;
    color: string;
  };
}

export default function CreateProductPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const isAdmin = useIsAdmin();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeStep, setActiveStep] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dynamicSpecs, setDynamicSpecs] = useState<Array<{key: string, value: string}>>([]);
  const [images, setImages] = useState<Array<{file: File, preview: string, isPrimary: boolean}>>([]);
  const [dragOver, setDragOver] = useState(false);

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
    sellerId: '',
    specifications: {},
    warranty: '',
    brand: '',
    model: '',
    color: '',
    size: '',
    material: '',
    weight: '',
    // New field defaults
    lowStockThreshold: 10,
    trackStock: true,
    allowBackorders: false,
    requiresShipping: true,
    shippingClass: 'standard',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    customFields: {},
    availableFrom: '',
    availableTo: '',
    maxQuantityPerOrder: 100,
    minimumAge: 0,
    requiresPrescription: false,
    hazardousMaterial: false,
    fragile: false,
    perishable: false,
    digitalProduct: false,
    downloadUrl: '',
    licenseKey: '',
    validityPeriod: 0,
    preorderEnabled: false,
    preorderDate: '',
    preorderPrice: 0
  });

  // Category-specific field configurations
  const categoryConfigs: CategoryFieldConfig = {
    electronics: {
      fields: ['brand', 'model', 'warranty', 'color', 'weight'],
      icon: '⚡',
      color: 'from-blue-500 to-purple-600'
    },
    fashion: {
      fields: ['brand', 'size', 'color', 'material'],
      icon: '👕',
      color: 'from-pink-500 to-rose-600'
    },
    shoes: {
      fields: ['brand', 'size', 'color', 'material'],
      icon: '👟',
      color: 'from-green-500 to-teal-600'
    },
    laptops: {
      fields: ['brand', 'model', 'warranty', 'color', 'weight'],
      icon: '💻',
      color: 'from-indigo-500 to-blue-600'
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Redirect if not admin
  if (!isLoading && (!isAuthenticated || !isAdmin)) {
    router.push('/');
    return null;
  }

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

      if (name === 'name') {
        setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
      }
    }
  };

  const addDynamicSpec = () => {
    setDynamicSpecs([...dynamicSpecs, { key: '', value: '' }]);
  };

  const updateDynamicSpec = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...dynamicSpecs];
    newSpecs[index][field] = value;
    setDynamicSpecs(newSpecs);
  };

  const removeDynamicSpec = (index: number) => {
    setDynamicSpecs(dynamicSpecs.filter((_, i) => i !== index));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const newImages = Array.from(files).map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      isPrimary: images.length === 0 && index === 0 // First image is primary if no images exist
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const handleImageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleImageDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = (index: number) => {
    const imageToRemove = images[index];
    URL.revokeObjectURL(imageToRemove.preview);

    const newImages = images.filter((_, i) => i !== index);

    // If we removed the primary image, make the first remaining image primary
    if (imageToRemove.isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }

    setImages(newImages);
  };

  const setPrimaryImage = (index: number) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      isPrimary: i === index
    })));
  };

  const moveImageToFirst = (index: number) => {
    if (index === 0) return;

    const imageToMove = images[index];
    const newImages = [...images];
    newImages.splice(index, 1);
    newImages.unshift(imageToMove);

    setImages(newImages);
  };

  const moveImageToLast = (index: number) => {
    if (index === images.length - 1) return;

    const imageToMove = images[index];
    const newImages = [...images];
    newImages.splice(index, 1);
    newImages.push(imageToMove);

    setImages(newImages);
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;

    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];

    setImages(newImages);
  };

  const moveImageDown = (index: number) => {
    if (index === images.length - 1) return;

    const newImages = [...images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];

    setImages(newImages);
  };

  const handleImageDrag = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleImageDragOverReorder = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleImageDropReorder = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));

    if (dragIndex === dropIndex) return;

    const newImages = [...images];
    const draggedImage = newImages[dragIndex];
    newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);

    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Combine static specifications with dynamic ones
      const specifications = { ...formData.specifications };
      dynamicSpecs.forEach(spec => {
        if (spec.key && spec.value) {
          specifications[spec.key] = spec.value;
        }
      });

      // Create FormData for file upload
      const submitData = new FormData();

      // Add product data
      submitData.append('productData', JSON.stringify({
        ...formData,
        price: Number(formData.price),
        comparePrice: Number(formData.comparePrice),
        stockQuantity: Number(formData.stockQuantity),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        specifications
      }));

      // Add images
      images.forEach((image, index) => {
        submitData.append('images', image.file);
        submitData.append(`isPrimary_${index}`, image.isPrimary.toString());
      });

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        body: submitData,
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

  // Cleanup image previews on component unmount
  React.useEffect(() => {
    return () => {
      images.forEach(image => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, []);

  const selectedCategory = categories.find(cat => cat.id === formData.categoryId);
  const categoryConfig = selectedCategory ? categoryConfigs[selectedCategory.slug] : null;

  const steps = [
    { id: 1, name: 'Basic Info', icon: FileText },
    { id: 2, name: 'Images', icon: Camera },
    { id: 3, name: 'Category & Specs', icon: Package },
    { id: 4, name: 'Pricing & Stock', icon: DollarSign },
    { id: 5, name: 'Shipping & Digital', icon: Package },
    { id: 6, name: 'SEO & Advanced', icon: Star },
    { id: 7, name: 'Publishing', icon: Star }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-blue-500"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-blue-400 opacity-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="p-3 text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Create Product
                </h1>
                <p className="text-gray-400 mt-1">Design your next bestseller</p>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8 bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700/50">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer ${
                    activeStep >= step.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-slate-700/50 text-gray-400 hover:bg-slate-600/50'
                  }`}
                  onClick={() => setActiveStep(step.id)}
                >
                  <step.icon className="w-5 h-5" />
                  <span className="font-medium">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-16 mx-4 transition-colors duration-300 ${
                    activeStep > step.id ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-slate-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Information */}
          {activeStep === 1 && (
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-semibold">Basic Information</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="Enter an amazing product name..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="auto-generated-slug"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Short Description
                </label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="A compelling one-liner about your product..."
                />
              </div>

              <div className="mt-6 space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Full Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="Tell the world why this product is amazing..."
                />
              </div>
            </div>
          )}

          {/* Step 2: Images */}
          {activeStep === 2 && (
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Camera className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-semibold">Product Images</h2>
                <span className="text-sm text-gray-400">Upload high-quality product photos</span>
              </div>

              {/* Image Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                  dragOver
                    ? 'border-cyan-400 bg-cyan-400/10'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
                onDrop={handleImageDrop}
                onDragOver={handleImageDragOver}
                onDragLeave={handleImageDragLeave}
              >
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Drag & drop images here
                  </h3>
                  <p className="text-gray-400 mb-4">
                    or click to browse your files
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 cursor-pointer"
                  >
                    <Image className="w-5 h-5" />
                    Choose Images
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Supports: JPG, PNG, WebP • Max 10MB per image
                  </p>
                </div>
              </div>

              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <Image className="w-5 h-5" />
                      Uploaded Images ({images.length})
                    </h3>
                    <div className="text-sm text-gray-400">
                      <Move className="w-4 h-4 inline mr-1" />
                      Drag to reorder
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        draggable
                        onDragStart={(e) => handleImageDrag(e, index)}
                        onDragOver={handleImageDragOverReorder}
                        onDrop={(e) => handleImageDropReorder(e, index)}
                        className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-move ${
                          image.isPrimary
                            ? 'border-cyan-400 ring-2 ring-cyan-400/20 shadow-lg shadow-cyan-400/20'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <div className="aspect-square bg-slate-700">
                          <img
                            src={image.preview}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Image Overlay with Enhanced Controls */}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {/* Top Controls */}
                          <div className="absolute top-2 left-2 right-2 flex justify-between">
                            <div className="flex gap-1">
                              {!image.isPrimary && (
                                <button
                                  type="button"
                                  onClick={() => setPrimaryImage(index)}
                                  className="p-1.5 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors duration-200 shadow-lg"
                                  title="Set as primary image"
                                >
                                  <Star className="w-3 h-3 text-white" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="p-1.5 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 shadow-lg"
                                title="Remove image"
                              >
                                <X className="w-3 h-3 text-white" />
                              </button>
                            </div>
                          </div>

                          {/* Center Controls - Movement */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="grid grid-cols-3 gap-1 p-2 bg-black/50 rounded-lg backdrop-blur-sm">
                              {/* First Row */}
                              <button
                                type="button"
                                onClick={() => moveImageToFirst(index)}
                                disabled={index === 0}
                                className="p-1.5 bg-slate-600 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors duration-200"
                                title="Move to first"
                              >
                                <SkipBack className="w-3 h-3 text-white" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveImageUp(index)}
                                disabled={index === 0}
                                className="p-1.5 bg-slate-600 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors duration-200"
                                title="Move up"
                              >
                                <ArrowUp className="w-3 h-3 text-white" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveImageToLast(index)}
                                disabled={index === images.length - 1}
                                className="p-1.5 bg-slate-600 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors duration-200"
                                title="Move to last"
                              >
                                <SkipForward className="w-3 h-3 text-white" />
                              </button>

                              {/* Second Row - Down button centered */}
                              <div></div>
                              <button
                                type="button"
                                onClick={() => moveImageDown(index)}
                                disabled={index === images.length - 1}
                                className="p-1.5 bg-slate-600 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors duration-200"
                                title="Move down"
                              >
                                <ArrowDown className="w-3 h-3 text-white" />
                              </button>
                              <div></div>
                            </div>
                          </div>
                        </div>

                        {/* Primary Badge */}
                        {image.isPrimary && (
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                            <Star className="w-3 h-3" />
                            Primary
                          </div>
                        )}

                        {/* Position Indicator */}
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
                          #{index + 1}
                        </div>

                        {/* Drag Handle */}
                        <div className="absolute bottom-2 left-2 bg-black/80 text-white p-1 rounded-lg backdrop-blur-sm">
                          <Move className="w-3 h-3" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Image Management Features */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Quick Actions */}
                    <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
                      <h4 className="text-sm font-medium text-purple-400 mb-3 flex items-center gap-2">
                        <Edit3 className="w-4 h-4" />
                        Quick Actions
                      </h4>
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => {
                            const shuffled = [...images].sort(() => Math.random() - 0.5);
                            setImages(shuffled);
                          }}
                          className="w-full px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm transition-colors duration-200"
                          disabled={images.length < 2}
                        >
                          🔀 Shuffle Images
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const reversed = [...images].reverse();
                            setImages(reversed);
                          }}
                          className="w-full px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm transition-colors duration-200"
                          disabled={images.length < 2}
                        >
                          🔄 Reverse Order
                        </button>
                      </div>
                    </div>

                    {/* Image Tips */}
                    <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
                      <h4 className="text-sm font-medium text-cyan-400 mb-3">💡 Image Best Practices</h4>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• Use high-resolution images (min 1000x1000px)</li>
                        <li>• Primary image appears first in product listings</li>
                        <li>• Drag images to reorder them easily</li>
                        <li>• Show multiple angles and details</li>
                        <li>• Use consistent lighting and backgrounds</li>
                        <li>• Optimize file sizes for faster loading</li>
                      </ul>
                    </div>
                  </div>

                  {/* Image Statistics */}
                  {images.length > 0 && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-600/50">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-white">📊 Image Statistics</h4>
                        <div className="text-xs text-gray-400">
                          Total size: {Math.round(images.reduce((total, img) => total + img.file.size, 0) / 1024 / 1024 * 100) / 100}MB
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-cyan-400">{images.length}</div>
                          <div className="text-xs text-gray-400">Images</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-400">
                            {images.filter(img => img.isPrimary).length}
                          </div>
                          <div className="text-xs text-gray-400">Primary</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-yellow-400">
                            {Math.round(images.reduce((total, img) => total + img.file.size, 0) / images.length / 1024)}KB
                          </div>
                          <div className="text-xs text-gray-400">Avg Size</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-purple-400">
                            {images.filter(img => img.file.type.includes('jpeg')).length}
                          </div>
                          <div className="text-xs text-gray-400">JPEG</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Category & Specifications */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Package className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-semibold">Category & Organization</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Category
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {categoryConfigs[category.slug]?.icon} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      SKU
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                      placeholder="PROD-001"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="trendy, bestseller, premium, eco-friendly..."
                  />
                </div>
              </div>

              {/* Category-Specific Fields */}
              {selectedCategory && categoryConfig && (
                <div className={`bg-gradient-to-r ${categoryConfig.color} p-0.5 rounded-2xl`}>
                  <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-2xl">{categoryConfig.icon}</span>
                      <h3 className="text-2xl font-semibold">
                        {selectedCategory.name} Specifications
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {categoryConfig.fields.map(field => (
                        <div key={field} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300 capitalize">
                            {field}
                          </label>
                          <input
                            type="text"
                            name={field}
                            value={formData[field as keyof ProductFormData] as string || ''}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                            placeholder={`Enter ${field}...`}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Dynamic Specifications */}
                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-300">Additional Specifications</h4>
                        <button
                          type="button"
                          onClick={addDynamicSpec}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors duration-200"
                        >
                          <Plus className="w-4 h-4" />
                          Add Spec
                        </button>
                      </div>

                      <div className="space-y-3">
                        {dynamicSpecs.map((spec, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <input
                              type="text"
                              placeholder="Specification name"
                              value={spec.key}
                              onChange={(e) => updateDynamicSpec(index, 'key', e.target.value)}
                              className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                            />
                            <input
                              type="text"
                              placeholder="Value"
                              value={spec.value}
                              onChange={(e) => updateDynamicSpec(index, 'value', e.target.value)}
                              className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                            />
                            <button
                              type="button"
                              onClick={() => removeDynamicSpec(index)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Pricing & Stock */}
          {activeStep === 4 && (
            <div className="space-y-6">
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <DollarSign className="w-6 h-6 text-green-400" />
                  <h2 className="text-2xl font-semibold">Pricing & Stock Management</h2>
                </div>

                {/* Pricing */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-300 mb-4">💰 Pricing</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Price (KES) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 font-semibold">KES</span>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          min="0"
                          step="0.01"
                          className="w-full pl-14 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Compare Price (KES)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">KES</span>
                        <input
                          type="number"
                          name="comparePrice"
                          value={formData.comparePrice}
                          onChange={handleInputChange}
                          min="0"
                          step="0.01"
                          className="w-full pl-14 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Max Qty Per Order
                      </label>
                      <input
                        type="number"
                        name="maxQuantityPerOrder"
                        value={formData.maxQuantityPerOrder}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                        placeholder="100"
                      />
                    </div>
                  </div>

                  {formData.comparePrice > formData.price && formData.price > 0 && (
                    <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                      <div className="flex items-center gap-2 text-green-400">
                        <Zap className="w-5 h-5" />
                        <span className="font-medium">
                          {Math.round(((formData.comparePrice - formData.price) / formData.comparePrice) * 100)}% OFF
                        </span>
                      </div>
                      <p className="text-sm text-green-300 mt-1">
                        Customers will save KES {formData.comparePrice - formData.price}
                      </p>
                    </div>
                  )}
                </div>

                {/* Stock Management */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-300 mb-4">📦 Stock Management</h3>

                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/50 mb-4">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-blue-400" />
                      <span className="text-white">Track Stock</span>
                      <span className="text-sm text-gray-400">Monitor inventory levels</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="trackStock"
                        checked={formData.trackStock}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {formData.trackStock && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Stock Quantity *
                        </label>
                        <input
                          type="number"
                          name="stockQuantity"
                          value={formData.stockQuantity}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                          placeholder="100"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Low Stock Threshold
                        </label>
                        <input
                          type="number"
                          name="lowStockThreshold"
                          value={formData.lowStockThreshold}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                          placeholder="10"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Allow Backorders
                        </label>
                        <select
                          name="allowBackorders"
                          value={formData.allowBackorders ? 'true' : 'false'}
                          onChange={(e) => setFormData(prev => ({ ...prev, allowBackorders: e.target.value === 'true' }))}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
                        >
                          <option value="false">❌ No Backorders</option>
                          <option value="true">✅ Allow Backorders</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Preorder Settings */}
                <div>
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/50 mb-4">
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-purple-400" />
                      <span className="text-white">Enable Preorders</span>
                      <span className="text-sm text-gray-400">Allow customers to preorder</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="preorderEnabled"
                        checked={formData.preorderEnabled}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  {formData.preorderEnabled && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Preorder Release Date
                        </label>
                        <input
                          type="date"
                          name="preorderDate"
                          value={formData.preorderDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Preorder Price (KES)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 font-semibold">KES</span>
                          <input
                            type="number"
                            name="preorderPrice"
                            value={formData.preorderPrice}
                            onChange={handleInputChange}
                            min="0"
                            step="0.01"
                            className="w-full pl-14 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Shipping & Digital */}
          {activeStep === 5 && (
            <div className="space-y-6">
              {/* Shipping Settings */}
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Package className="w-6 h-6 text-blue-400" />
                  <h2 className="text-2xl font-semibold">Shipping & Product Type</h2>
                </div>

                {/* Digital Product Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/50 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💾</span>
                    <span className="text-white">Digital Product</span>
                    <span className="text-sm text-gray-400">No physical shipping required</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="digitalProduct"
                      checked={formData.digitalProduct}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                  </label>
                </div>

                {formData.digitalProduct ? (
                  /* Digital Product Fields */
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-300">💾 Digital Product Settings</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Download URL
                        </label>
                        <input
                          type="url"
                          name="downloadUrl"
                          value={formData.downloadUrl}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                          placeholder="https://example.com/download/file.zip"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          License Key
                        </label>
                        <input
                          type="text"
                          name="licenseKey"
                          value={formData.licenseKey}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                          placeholder="XXXX-XXXX-XXXX-XXXX"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Validity Period (days)
                        </label>
                        <input
                          type="number"
                          name="validityPeriod"
                          value={formData.validityPeriod}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                          placeholder="365"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Physical Product Shipping */
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-300">🚚 Shipping Settings</h3>

                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/50 mb-4">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-green-400" />
                        <span className="text-white">Requires Shipping</span>
                        <span className="text-sm text-gray-400">Product needs to be shipped</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="requiresShipping"
                          checked={formData.requiresShipping}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    {formData.requiresShipping && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300">
                            Shipping Class
                          </label>
                          <select
                            name="shippingClass"
                            value={formData.shippingClass}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
                          >
                            <option value="standard">📦 Standard Shipping</option>
                            <option value="express">⚡ Express Shipping</option>
                            <option value="overnight">🚀 Overnight Delivery</option>
                            <option value="free">🎁 Free Shipping</option>
                            <option value="heavy">📏 Heavy/Large Items</option>
                            <option value="fragile">🔒 Fragile Items</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300">
                            Weight (kg)
                          </label>
                          <input
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleInputChange}
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                            placeholder="0.5"
                          />
                        </div>
                      </div>
                    )}

                    {/* Product Handling Flags */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
                      <div className="flex items-center justify-between p-3 bg-slate-700/20 rounded-xl border border-slate-600/30">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🧊</span>
                          <span className="text-white text-sm">Fragile</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="fragile"
                            checked={formData.fragile}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="relative w-8 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-red-500"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-700/20 rounded-xl border border-slate-600/30">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">⚠️</span>
                          <span className="text-white text-sm">Hazardous</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="hazardousMaterial"
                            checked={formData.hazardousMaterial}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="relative w-8 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-700/20 rounded-xl border border-slate-600/30">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🍎</span>
                          <span className="text-white text-sm">Perishable</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="perishable"
                            checked={formData.perishable}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="relative w-8 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-yellow-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Product Restrictions */}
                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-medium text-gray-300">🔒 Product Restrictions</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Minimum Age Requirement
                      </label>
                      <select
                        name="minimumAge"
                        value={formData.minimumAge}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
                      >
                        <option value="0">No Age Restriction</option>
                        <option value="13">13+ Years</option>
                        <option value="16">16+ Years</option>
                        <option value="18">18+ Years (Adult Only)</option>
                        <option value="21">21+ Years</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">💊</span>
                        <span className="text-white text-sm">Requires Prescription</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="requiresPrescription"
                          checked={formData.requiresPrescription}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="relative w-8 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-red-500"></div>
                      </label>
                    </div>
                  </div>

                  {/* Availability Period */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Available From
                      </label>
                      <input
                        type="datetime-local"
                        name="availableFrom"
                        value={formData.availableFrom}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Available Until
                      </label>
                      <input
                        type="datetime-local"
                        name="availableTo"
                        value={formData.availableTo}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: SEO & Advanced */}
          {activeStep === 6 && (
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-6 h-6 text-indigo-400" />
                <h2 className="text-2xl font-semibold">SEO & Advanced Settings</h2>
              </div>

              {/* SEO Settings */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-300 mb-4">🔍 Search Engine Optimization</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleInputChange}
                      maxLength={60}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                      placeholder="SEO title for search engines (60 chars max)"
                    />
                    <p className="text-xs text-gray-400">
                      {formData.metaTitle.length}/60 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Meta Description
                    </label>
                    <textarea
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleInputChange}
                      maxLength={160}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                      placeholder="Brief description for search results (160 chars max)"
                    />
                    <p className="text-xs text-gray-400">
                      {formData.metaDescription.length}/160 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Meta Keywords
                    </label>
                    <input
                      type="text"
                      name="metaKeywords"
                      value={formData.metaKeywords}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                      placeholder="keyword1, keyword2, keyword3..."
                    />
                  </div>
                </div>
              </div>

              {/* Custom Fields */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-300">⚙️ Custom Fields</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const key = prompt('Enter field name:');
                      if (key) {
                        setFormData(prev => ({
                          ...prev,
                          customFields: { ...prev.customFields, [key]: '' }
                        }));
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Field
                  </button>
                </div>

                <div className="space-y-3">
                  {Object.entries(formData.customFields).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={key}
                          readOnly
                          className="px-4 py-2 bg-slate-700/30 border border-slate-600/50 rounded-xl text-gray-300"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              customFields: { ...prev.customFields, [key]: e.target.value }
                            }));
                          }}
                          className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                          placeholder="Enter value..."
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const { [key]: removed, ...rest } = formData.customFields;
                          setFormData(prev => ({ ...prev, customFields: rest }));
                        }}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {Object.keys(formData.customFields).length === 0 && (
                    <p className="text-gray-400 text-center py-4">No custom fields added yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Publishing Options */}
          {activeStep === 7 && (
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-semibold">Publishing & Features</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
                    >
                      <option value="draft">📝 Draft</option>
                      <option value="active">✅ Active</option>
                      <option value="inactive">⏸️ Inactive</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Seller
                    </label>
                    <select
                      name="sellerId"
                      value={formData.sellerId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
                      required
                    >
                      <option value="">Select a seller</option>
                      <option value="seller1">John Doe (john@example.com)</option>
                      <option value="seller2">Jane Smith (jane@example.com)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-300">Product Highlights</h3>

                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
                      <div className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span className="text-white">Featured Product</span>
                        <span className="text-sm text-gray-400">Boost visibility</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="isFeatured"
                          checked={formData.isFeatured}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-orange-400" />
                        <span className="text-white">Bestseller</span>
                        <span className="text-sm text-gray-400">Mark as popular</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="isBestseller"
                          checked={formData.isBestseller}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation and Submit */}
          <div className="flex justify-between items-center mt-8">
            <div className="flex gap-3">
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all duration-200 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all duration-200"
              >
                Cancel
              </button>

              {activeStep < 7 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
                >
                  Next
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  {loading ? 'Creating Product...' : 'Create Product'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}