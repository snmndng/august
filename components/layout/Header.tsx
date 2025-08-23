'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Menu, X, Sun, Moon, Monitor } from 'lucide-react';
import { SearchBar } from '@/components/common/SearchBar';
import UserMenu from '@/components/common/UserMenu';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { CartIcon } from '@/components/common/CartIcon';

export function Header(): JSX.Element {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleSearch = (query: string): void => {
    // TODO: Implement search functionality
    console.log('Search query:', query);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-medium' 
        : 'bg-white'
    }`}>
      <div className="container-max">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-luxior-deep-orange to-luxior-orange rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              LuxiorMall
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              href="/products" 
              className="text-gray-700 hover:text-luxior-deep-orange transition-colors duration-200 font-medium"
            >
              Shop
            </Link>
            <Link 
              href="/categories" 
              className="text-gray-700 hover:text-luxior-deep-orange transition-colors duration-200 font-medium"
            >
              Categories
            </Link>
            <Link 
              href="/deals" 
              className="text-gray-700 hover:text-luxior-deep-orange transition-colors duration-200 font-medium"
            >
              Deals
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-luxior-deep-orange transition-colors duration-200 font-medium"
            >
              About
            </Link>
            {isAuthenticated && (
              <Link 
                href="/admin" 
                className="text-gray-700 hover:text-luxior-deep-orange transition-colors duration-200 font-medium"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 hover:text-luxior-deep-orange transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' && <Sun className="w-5 h-5" />}
              {theme === 'dark' && <Moon className="w-5 h-5" />}
              {theme === 'system' && <Monitor className="w-5 h-5" />}
            </button>

            {/* Cart */}
            <CartIcon />

            {/* User Menu / Auth */}
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="hidden sm:flex items-center space-x-4">
                <Link 
                  href="/auth/login" 
                  className="text-gray-700 hover:text-luxior-deep-orange transition-colors duration-200 font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/register" 
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-luxior-deep-orange transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}