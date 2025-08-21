'use client';

import { User, Settings, LogOut, ShoppingBag, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';

export function UserMenu(): JSX.Element {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  if (!user) return <></>;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-luxior-deep-orange transition-colors duration-200"
      >
        <div className="w-8 h-8 bg-luxior-deep-orange rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <span className="hidden md:block text-sm font-medium">
          {user.email?.split('@')[0] || 'User'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user.email}</p>
          </div>
          
          <a
            href="/profile"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-luxior-deep-orange transition-colors duration-200"
          >
            <User className="w-4 h-4 mr-3" />
            Profile
          </a>
          
          <a
            href="/orders"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-luxior-deep-orange transition-colors duration-200"
          >
            <ShoppingBag className="w-4 h-4 mr-3" />
            Orders
          </a>
          
          <a
            href="/wishlist"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-luxior-deep-orange transition-colors duration-200"
          >
            <Heart className="w-4 h-4 mr-3" />
            Wishlist
          </a>
          
          <a
            href="/settings"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-luxior-deep-orange transition-colors duration-200"
          >
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </a>
          
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors duration-200"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
