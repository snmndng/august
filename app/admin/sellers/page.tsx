
'use client';

import { useState, useEffect } from 'react';
import { useAuth, useIsAdmin } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit,
  Store,
  TrendingUp,
  Package,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export default function AdminSellersPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const isAdmin = useIsAdmin();
  const router = useRouter();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !isAdmin) {
        router.push('/');
        return;
      }
      loadSellers();
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  const loadSellers = async () => {
    try {
      setLoading(true);
      // TODO: Implement seller loading from API
      // const response = await fetch('/api/admin/sellers');
      // const data = await response.json();
      // setSellers(data);
      
      // Mock data for now
      setSellers([
        {
          id: '1',
          business_name: 'Tech Solutions Kenya',
          owner: {
            name: 'Alice Johnson',
            email: 'alice@techsolutions.co.ke',
            phone: '+254701234567'
          },
          status: 'active',
          products_count: 25,
          total_sales: 450000,
          commission_rate: 10,
          location: 'Nairobi, Kenya',
          joined_date: '2024-01-15',
          last_active: '2024-01-20T10:30:00Z'
        },
        {
          id: '2',
          business_name: 'Fashion Hub',
          owner: {
            name: 'David Kimani',
            email: 'david@fashionhub.co.ke',
            phone: '+254707654321'
          },
          status: 'pending',
          products_count: 0,
          total_sales: 0,
          commission_rate: 10,
          location: 'Mombasa, Kenya',
          joined_date: '2024-01-18',
          last_active: '2024-01-19T14:20:00Z'
        },
        {
          id: '3',
          business_name: 'Sports World',
          owner: {
            name: 'Sarah Wanjiku',
            email: 'sarah@sportsworld.co.ke',
            phone: '+254712345678'
          },
          status: 'active',
          products_count: 18,
          total_sales: 280000,
          commission_rate: 12,
          location: 'Kisumu, Kenya',
          joined_date: '2024-01-10',
          last_active: '2024-01-20T09:15:00Z'
        }
      ]);
    } catch (error) {
      console.error('Error loading sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <UserPlus className="w-8 h-8 text-luxior-deep-orange" />
              <h1 className="text-3xl font-bold text-gray-900">Seller Management</h1>
            </div>
            <p className="text-gray-600">Manage seller accounts and approvals</p>
          </div>
          <button className="flex items-center gap-2 bg-luxior-deep-orange text-white px-4 py-2 rounded-lg hover:bg-luxior-orange transition-colors">
            <Plus className="w-5 h-5" />
            Add Seller
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sellers</p>
              <p className="text-2xl font-bold text-gray-900">{sellers.length}</p>
            </div>
            <Store className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Sellers</p>
              <p className="text-2xl font-bold text-green-600">
                {sellers.filter(s => s.status === 'active').length}
              </p>
            </div>
            <UserPlus className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600">
                {sellers.filter(s => s.status === 'pending').length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-green-600">
                KES {sellers.reduce((sum, seller) => sum + seller.total_sales, 0).toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search sellers by name or business..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sellers Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 bg-gradient-to-br from-luxior-deep-orange to-luxior-orange rounded-lg flex items-center justify-center">
                        <Store className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {seller.business_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Owner: {seller.owner.name}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <MapPin className="w-3 h-3" />
                          {seller.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {seller.owner.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {seller.owner.phone}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Package className="w-4 h-4 text-blue-500" />
                        {seller.products_count} products
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        KES {seller.total_sales.toLocaleString()}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {seller.commission_rate}%
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(seller.status)}`}>
                      {seller.status}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(seller.joined_date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Last active: {new Date(seller.last_active).toLocaleDateString()}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900 p-1 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      {seller.status === 'pending' && (
                        <button className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-xs font-medium hover:bg-green-200">
                          Approve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {sellers.length === 0 && (
          <div className="text-center py-12">
            <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No sellers found</p>
            <p className="text-gray-400">Sellers will appear here when they register</p>
          </div>
        )}
      </div>
    </div>
  );
}
