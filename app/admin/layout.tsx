'use client';

import { useAuth, useIsAdmin } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  UserPlus,
  Home
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const isAdmin = useIsAdmin();
  const router = useRouter();
  const pathname = usePathname();

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

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home, description: 'Overview & stats' },
    { name: 'Users', href: '/admin/users', icon: Users, description: 'Manage user roles' },
    { name: 'Products', href: '/admin/products', icon: Package, description: 'Product management' },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, description: 'Track orders' },
    { name: 'Sellers', href: '/admin/sellers', icon: UserPlus, description: 'Seller accounts' },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, description: 'Business insights' },
    { name: 'Settings', href: '/admin/settings', icon: Settings, description: 'Platform config' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex min-h-0 flex-1 flex-col bg-white shadow-soft">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center px-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-luxior-deep-orange to-luxior-orange rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">L</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">Admin</span>
                </div>
              </div>
              <nav className="mt-8 flex-1 space-y-1 px-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-luxior-deep-orange text-white shadow-lg'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                      }`}
                      title={item.description}
                    >
                      <Icon
                        className={`mr-3 flex-shrink-0 h-5 w-5 ${
                          isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
                      <div className="flex flex-col">
                        <span>{item.name}</span>
                        {!isActive && (
                          <span className="text-xs text-gray-400 group-hover:text-gray-500">
                            {item.description}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col md:pl-0">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}