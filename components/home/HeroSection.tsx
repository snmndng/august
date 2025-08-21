'use client';

import { ArrowRight, ShoppingBag, Shield, Truck } from 'lucide-react';
import Link from 'next/link';

export function HeroSection(): JSX.Element {
  return (
    <section className="relative bg-gradient-to-br from-luxior-black via-gray-900 to-luxior-deep-orange text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      
      <div className="relative z-20 container-max py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Discover Premium
              <span className="text-luxior-peach block">Products</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto lg:mx-0">
              Shop the latest trends in fashion, electronics, and lifestyle with secure M-Pesa payments and fast delivery across Kenya.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/products"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center group"
              >
                Shop Now
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                href="/categories"
                className="btn-secondary text-lg px-8 py-4"
              >
                Browse Categories
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <ShoppingBag className="w-12 h-12 text-luxior-peach mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Premium Selection</h3>
                  <p className="text-gray-300 text-sm">Curated products from top brands</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <Shield className="w-12 h-12 text-luxior-peach mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
                  <p className="text-gray-300 text-sm">M-Pesa integration for safety</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <Truck className="w-12 h-12 text-luxior-peach mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
                  <p className="text-gray-300 text-sm">Nationwide shipping</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
