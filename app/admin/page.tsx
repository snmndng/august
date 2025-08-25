'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import UserRoleManager from '@/components/admin/UserRoleManager';
import Link from 'next/link';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3 
} from 'lucide-react';

export default function AdminPage() {
  const { user, userRole, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isLoading && (!user || userRole !== 'admin')) {
      router.push('/');
    }
  }, [user, userRole, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || userRole !== 'admin') {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your e-commerce platform</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview' },
            { id: 'products', name: 'Products' },
            { id: 'orders', name: 'Orders' },
            { id: 'users', name: 'User Roles' },
            { id: 'analytics', name: 'Analytics' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
                    <p className="text-3xl font-bold text-indigo-600 mt-2">267</p>
                    <p className="text-sm text-green-600 mt-1">+12 this week</p>
                  </div>
                  <Package className="w-12 h-12 text-indigo-500 opacity-20" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">1,432</p>
                    <p className="text-sm text-green-600 mt-1">+18% from last month</p>
                  </div>
                  <ShoppingCart className="w-12 h-12 text-green-500 opacity-20" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">8,429</p>
                    <p className="text-sm text-blue-600 mt-1">+245 new users</p>
                  </div>
                  <Users className="w-12 h-12 text-blue-500 opacity-20" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
                    <p className="text-3xl font-bold text-purple-600 mt-2">KES 2.4M</p>
                    <p className="text-sm text-purple-600 mt-1">+25% growth</p>
                  </div>
                  <BarChart3 className="w-12 h-12 text-purple-500 opacity-20" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/admin/users" className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">Manage Users</p>
                    <p className="text-sm text-gray-600">View and update user roles</p>
                  </div>
                </Link>
                
                <Link href="/admin/products" className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Package className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">Product Management</p>
                    <p className="text-sm text-gray-600">Add and manage products</p>
                  </div>
                </Link>
                
                <Link href="/admin/orders" className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <ShoppingCart className="w-8 h-8 text-purple-500" />
                  <div>
                    <p className="font-medium text-gray-900">Order Processing</p>
                    <p className="text-sm text-gray-600">Track and manage orders</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New order placed</p>
                    <p className="text-xs text-gray-600">Order #ORD-1234 for KES 25,000 • 2 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New user registered</p>
                    <p className="text-xs text-gray-600">john.doe@example.com joined as customer • 15 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Product approved</p>
                    <p className="text-xs text-gray-600">Premium Headphones by Tech Store • 1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <UserRoleManager />
        )}

        {/* Add other tab content as needed */}
        {activeTab !== 'overview' && activeTab !== 'users' && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} management coming soon...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}