
'use client';

import { useAuth, useIsAdmin } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, Package, ShoppingCart, BarChart3, Settings, UserPlus } from 'lucide-react';

export default function AdminPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const isAdmin = useIsAdmin();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSellers: 0
  });

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
        return;
      }
      
      if (!isAdmin) {
        router.push('/');
        return;
      }

      // TODO: Fetch actual stats from API
      setStats({
        totalUsers: 150,
        totalProducts: 75,
        totalOrders: 230,
        totalSellers: 12
      });
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-luxior-deep-orange"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-max py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.first_name}!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-soft p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-soft p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-soft p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-soft p-6">
            <div className="flex items-center">
              <div className="p-2 bg-luxior-orange/20 rounded-lg">
                <UserPlus className="w-6 h-6 text-luxior-deep-orange" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Sellers</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSellers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/users" className="bg-white rounded-lg shadow-soft p-6 hover:shadow-medium transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Manage Users</h3>
                <p className="text-gray-600">View and manage user accounts</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/products" className="bg-white rounded-lg shadow-soft p-6 hover:shadow-medium transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Manage Products</h3>
                <p className="text-gray-600">View and manage all products</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/orders" className="bg-white rounded-lg shadow-soft p-6 hover:shadow-medium transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ShoppingCart className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">View Orders</h3>
                <p className="text-gray-600">Manage all customer orders</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/analytics" className="bg-white rounded-lg shadow-soft p-6 hover:shadow-medium transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <BarChart3 className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                <p className="text-gray-600">View sales and performance data</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/sellers" className="bg-white rounded-lg shadow-soft p-6 hover:shadow-medium transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-luxior-orange/20 rounded-lg">
                <UserPlus className="w-8 h-8 text-luxior-deep-orange" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Manage Sellers</h3>
                <p className="text-gray-600">Convert users to sellers</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/settings" className="bg-white rounded-lg shadow-soft p-6 hover:shadow-medium transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Settings className="w-8 h-8 text-gray-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                <p className="text-gray-600">Configure app settings</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
