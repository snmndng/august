'use client';

import { useState, useEffect } from 'react';
import { useAuth, useIsAdmin } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Plus,
  BarChart3,
  Settings,
  Eye
} from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  activeProducts: number;
  pendingOrders: number;
  lowStockProducts: number;
  newUsersThisMonth: number;
}

export default function AdminDashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const isAdmin = useIsAdmin();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activeProducts: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    newUsersThisMonth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !isAdmin) {
        router.push('/');
        return;
      }
      loadDashboardStats();
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  const loadDashboardStats = async () => {
    try {
      // Mock data for now - replace with actual API calls
      setStats({
        totalProducts: 245,
        totalOrders: 1234,
        totalUsers: 5678,
        totalRevenue: 892000,
        activeProducts: 220,
        pendingOrders: 45,
        lowStockProducts: 12,
        newUsersThisMonth: 186
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxior-deep-orange"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your e-commerce platform</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/products/create"
            className="flex items-center gap-2 bg-luxior-deep-orange text-white px-4 py-2 rounded-lg hover:bg-luxior-orange transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            Analytics
          </Link>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalProducts}</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +12 this week
              </p>
            </div>
            <Package className="w-12 h-12 text-blue-500 opacity-80" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalOrders}</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +23 today
              </p>
            </div>
            <ShoppingCart className="w-12 h-12 text-green-500 opacity-80" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalUsers}</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +{stats.newUsersThisMonth} this month
              </p>
            </div>
            <Users className="w-12 h-12 text-purple-500 opacity-80" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-3xl font-bold text-luxior-deep-orange">
                KES {(stats.totalRevenue / 1000).toFixed(0)}K
              </p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +8.2% vs last month
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-orange-500 opacity-80" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/products" className="group">
            <div className="p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Products</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">Manage product inventory</p>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-green-600">{stats.activeProducts} active</span>
                <span className="text-red-600">{stats.lowStockProducts} low stock</span>
              </div>
            </div>
          </Link>

          <Link href="/admin/orders" className="group">
            <div className="p-6 bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Orders</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">Process and track orders</p>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-yellow-600">{stats.pendingOrders} pending</span>
                <span className="text-green-600">Track deliveries</span>
              </div>
            </div>
          </Link>

          <Link href="/admin/users" className="group">
            <div className="p-6 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">User Roles</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">Manage user accounts & roles</p>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-blue-600">Convert to sellers</span>
                <span className="text-gray-600">View profiles</span>
              </div>
            </div>
          </Link>

          <Link href="/admin/analytics" className="group">
            <div className="p-6 bg-white border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Analytics</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">View detailed reports</p>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-green-600">Sales trends</span>
                <span className="text-blue-600">User insights</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Alerts & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Alerts
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Low Stock Alert</p>
                <p className="text-xs text-yellow-600">{stats.lowStockProducts} products need restocking</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">Pending Reviews</p>
                <p className="text-xs text-blue-600">5 products awaiting approval</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Order #1234 completed</p>
                <p className="text-xs text-green-600">KES 2,500 - 2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">New product added</p>
                <p className="text-xs text-blue-600">Gaming Laptop Pro - 5 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}