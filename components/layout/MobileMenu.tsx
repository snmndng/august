'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps): JSX.Element | null {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-strong transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        
        <nav className="p-6">
          <div className="space-y-6">
            {/* Main Navigation */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Shop
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/products"
                    onClick={onClose}
                    className="block py-2 text-gray-700 hover:text-luxior-deep-orange transition-colors duration-200"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    onClick={onClose}
                    className="block py-2 text-gray-700 hover:text-luxior-deep-orange transition-colors duration-200"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/deals"
                    onClick={onClose}
                    className="block py-2 text-gray-700 hover:text-luxior-deep-orange transition-colors duration-200"
                  >
                    Deals & Offers
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* User Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Account
              </h3>
              {user ? (
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/profile"
                      onClick={onClose}
                      className="block py-2 text-gray-700 hover:text-luxior-deep-orange transition-colors duration-200"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/orders"
                      onClick={onClose}
                      className="block py-2 text-gray-700 hover:text-luxior-deep-orange transition-colors duration-200"
                    >
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/wishlist"
                      onClick={onClose}
                      className="block py-2 text-gray-700 hover:text-luxior-deep-orange transition-colors duration-200"
                    >
                      Wishlist
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left py-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </li>
                </ul>
              ) : (
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/auth/signin"
                      onClick={onClose}
                      className="block py-2 text-gray-700 hover:text-luxior-deep-orange transition-colors duration-200"
                    >
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth/signup"
                      onClick={onClose}
                      className="block py-2 text-gray-700 hover:text-luxior-deep-orange transition-colors duration-200"
                    >
                      Sign Up
                    </Link>
                  </li>
                </ul>
              )}
            </div>
            
            {/* Company Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    onClick={onClose}
                    className="block py-2 text-gray-700 hover:text-luxior-deep-orange transition-colors duration-200"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    onClick={onClose}
                    className="block py-2 text-gray-700 hover:text-luxior-deep-orange transition-colors duration-200"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    onClick={onClose}
                    className="block py-2 text-gray-700 hover:text-luxior-deep-orange transition-colors duration-200"
                  >
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
