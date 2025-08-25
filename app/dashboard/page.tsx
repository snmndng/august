
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingBag, User, Heart, Package, Settings, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxior-deep-orange"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please log in to access your dashboard.</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container-max py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.first_name}!
              </h1>
              <p className="text-gray-600">
                Manage your account and orders from your dashboard
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-max py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-luxior-deep-orange to-luxior-orange rounded-full flex items-center justify-center">
                <User className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Profile</h3>
                <p className="text-sm text-gray-600">Manage your information</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {user.first_name} {user.last_name}</p>
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">Role:</span> {user.role}</p>
              {user.phone && (
                <p><span className="font-medium">Phone:</span> {user.phone}</p>
              )}
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Package className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Orders</h3>
                <p className="text-sm text-gray-600">Track your purchases</p>
              </div>
            </div>
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">No orders yet</p>
              <button
                onClick={() => router.push('/products')}
                className="btn-secondary mt-3"
              >
                Start Shopping
              </button>
            </div>
          </div>

          {/* Wishlist Card */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <Heart className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Wishlist</h3>
                <p className="text-sm text-gray-600">Your favorite items</p>
              </div>
            </div>
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">No items in wishlist</p>
              <button
                onClick={() => router.push('/products')}
                className="btn-secondary mt-3"
              >
                Browse Products
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-soft p-6 md:col-span-2 lg:col-span-3">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => router.push('/products')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-luxior-deep-orange hover:bg-orange-50 transition-colors"
              >
                <ShoppingBag className="text-luxior-deep-orange" size={32} />
                <span className="text-sm font-medium">Shop Now</span>
              </button>
              
              <button
                onClick={() => router.push('/categories')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-luxior-deep-orange hover:bg-orange-50 transition-colors"
              >
                <Package className="text-luxior-deep-orange" size={32} />
                <span className="text-sm font-medium">Categories</span>
              </button>
              
              <button
                onClick={() => router.push('/deals')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-luxior-deep-orange hover:bg-orange-50 transition-colors"
              >
                <Heart className="text-luxior-deep-orange" size={32} />
                <span className="text-sm font-medium">Deals</span>
              </button>
              
              <button
                onClick={() => router.push('/contact')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-luxior-deep-orange hover:bg-orange-50 transition-colors"
              >
                <Settings className="text-luxior-deep-orange" size={32} />
                <span className="text-sm font-medium">Support</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
