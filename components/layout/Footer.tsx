'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-max py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-luxior-peach mb-4">
              LuxiorMall
            </h3>
            <p className="text-gray-300 mb-6 max-w-md">
              Your premier destination for premium products. We bring you the best in fashion, 
              electronics, and lifestyle with secure M-Pesa payments and nationwide delivery.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-luxior-deep-orange transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-luxior-deep-orange transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-luxior-deep-orange transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-300 hover:text-luxior-peach transition-colors duration-200">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-luxior-peach transition-colors duration-200">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-gray-300 hover:text-luxior-peach transition-colors duration-200">
                  Deals & Offers
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-luxior-peach transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-luxior-peach transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-luxior-peach transition-colors duration-200">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-luxior-peach transition-colors duration-200">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-luxior-peach transition-colors duration-200">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-gray-300 hover:text-luxior-peach transition-colors duration-200">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-gray-300 hover:text-luxior-peach transition-colors duration-200">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-luxior-peach" />
              <span className="text-gray-300">+254 700 000 000</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-luxior-peach" />
              <span className="text-gray-300">support@luxiormall.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-luxior-peach" />
              <span className="text-gray-300">Nairobi, Kenya</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} LuxiorMall. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-luxior-peach text-sm transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-luxior-peach text-sm transition-colors duration-200">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-luxior-peach text-sm transition-colors duration-200">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
