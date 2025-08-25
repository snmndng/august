
'use client';

import { useState, useEffect } from 'react';
import { useAuth, useIsAdmin } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Download,
  Filter
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const isAdmin = useIsAdmin();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [analytics, setAnalytics] = useState({
    revenue: {
      current: 2450000,
      previous: 2100000,
      change: 16.7
    },
    orders: {
      current: 142,
      previous: 128,
      change: 10.9
    },
    customers: {
      current: 89,
      previous: 75,
      change: 18.7
    },
    products: {
      current: 267,
      previous: 245,
      change: 9.0
    }
  });

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !isAdmin) {
        router.push('/');
        return;
      }
      loadAnalytics();
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      // TODO: Implement analytics loading from API
      // const response = await fetch(`/api/admin/analytics?range=${dateRange}`);
      // const data = await response.json();
      // setAnalytics(data);
      
      setTimeout(() => setLoading(false), 1000);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setLoading(false);
    }
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxior-deep-orange"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-8 h-8 text-luxior-deep-orange" />
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            </div>
            <p className="text-gray-600">Track your business performance and insights</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
            <button className="flex items-center gap-2 bg-luxior-deep-orange text-white px-4 py-2 rounded-lg hover:bg-luxior-orange transition-colors">
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${getChangeColor(analytics.revenue.change)}`}>
              {getChangeIcon(analytics.revenue.change)}
              {Math.abs(analytics.revenue.change)}%
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              KES {analytics.revenue.current.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-xs text-gray-500 mt-1">
              Previous: KES {analytics.revenue.previous.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${getChangeColor(analytics.orders.change)}`}>
              {getChangeIcon(analytics.orders.change)}
              {Math.abs(analytics.orders.change)}%
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{analytics.orders.current}</p>
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-xs text-gray-500 mt-1">Previous: {analytics.orders.previous}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${getChangeColor(analytics.customers.change)}`}>
              {getChangeIcon(analytics.customers.change)}
              {Math.abs(analytics.customers.change)}%
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{analytics.customers.current}</p>
            <p className="text-sm text-gray-600">New Customers</p>
            <p className="text-xs text-gray-500 mt-1">Previous: {analytics.customers.previous}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${getChangeColor(analytics.products.change)}`}>
              {getChangeIcon(analytics.products.change)}
              {Math.abs(analytics.products.change)}%
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{analytics.products.current}</p>
            <p className="text-sm text-gray-600">Total Products</p>
            <p className="text-xs text-gray-500 mt-1">Previous: {analytics.products.previous}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Revenue chart will be displayed here</p>
              <p className="text-sm text-gray-400">Integration with chart library needed</p>
            </div>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Orders Trend</h3>
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Orders trend chart will be displayed here</p>
              <p className="text-sm text-gray-400">Integration with chart library needed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Products */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Products</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { name: 'Premium Laptop', sales: 45, revenue: 3825000, growth: 25.3 },
                { name: 'Running Shoes', sales: 78, revenue: 936000, growth: 18.7 },
                { name: 'Wireless Headphones', sales: 34, revenue: 340000, growth: 12.4 }
              ].map((product, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.sales} units
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    KES {product.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">{product.growth}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { action: 'New order placed', details: 'Order #ORD-1234 for KES 25,000', time: '2 minutes ago' },
              { action: 'Product approved', details: 'Premium Headphones by Tech Store', time: '15 minutes ago' },
              { action: 'New seller registered', details: 'Fashion Hub from Mombasa', time: '1 hour ago' },
              { action: 'Large order completed', details: 'Order #ORD-1230 for KES 150,000', time: '2 hours ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-2 h-2 bg-luxior-deep-orange rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
