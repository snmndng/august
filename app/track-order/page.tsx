'use client';

import { useState } from 'react';
import { Search, Package, Truck, CheckCircle } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !email) return;

    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock tracking result
      setTrackingResult({
        orderNumber,
        status: 'in_transit',
        estimatedDelivery: '2024-01-20',
        currentLocation: 'Nairobi Distribution Center',
        trackingHistory: [
          {
            date: '2024-01-18 10:30 AM',
            status: 'Order Placed',
            description: 'Your order has been confirmed and is being processed',
            icon: CheckCircle
          },
          {
            date: '2024-01-18 2:15 PM',
            status: 'Processing',
            description: 'Your order is being prepared for shipment',
            icon: Package
          },
          {
            date: '2024-01-19 9:00 AM',
            status: 'Shipped',
            description: 'Your order has been shipped from our warehouse',
            icon: Truck
          },
          {
            date: '2024-01-19 3:45 PM',
            status: 'In Transit',
            description: 'Your order is on its way to you',
            icon: Truck
          }
        ]
      });
      setIsSearching(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'in_transit':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'delayed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-luxior-black via-gray-900 to-luxior-deep-orange text-white">
        <div className="container-max py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Track Your Order</h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Stay updated on your order status and delivery progress
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-max">
          {/* Track Order Form */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Enter Order Details</h2>
              <form onSubmit={handleTrackOrder} className="space-y-6">
                <div>
                  <label htmlFor="orderNumber" className="form-label">Order Number</label>
                  <input
                    type="text"
                    id="orderNumber"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    required
                    className="input-field"
                    placeholder="e.g., ORD-2024-001"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-field"
                    placeholder="your.email@example.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="btn-primary w-full py-4 text-lg disabled:opacity-50"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Tracking...
                    </>
                  ) : (
                    <>
                      <Search size={20} className="mr-2" />
                      Track Order
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Tracking Results */}
          {trackingResult && (
            <div className="max-w-4xl mx-auto">
              {/* Order Summary */}
              <div className="bg-white rounded-2xl p-8 shadow-soft mb-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Number</h3>
                    <p className="text-luxior-deep-orange font-mono">{trackingResult.orderNumber}</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Status</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingResult.status)}`}>
                      {trackingResult.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Estimated Delivery</h3>
                    <p className="text-gray-600">{trackingResult.estimatedDelivery}</p>
                  </div>
                </div>
              </div>

              {/* Current Location */}
              <div className="bg-gradient-to-r from-luxior-deep-orange to-luxior-orange rounded-2xl p-6 text-white mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Package size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Current Location</h3>
                    <p className="text-white/90">{trackingResult.currentLocation}</p>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="bg-white rounded-2xl p-8 shadow-soft">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Tracking Timeline</h3>
                <div className="space-y-6">
                  {trackingResult.trackingHistory.map((item: any, index: number) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-luxior-deep-orange rounded-full flex items-center justify-center flex-shrink-0">
                        <item.icon size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{item.status}</h4>
                          <span className="text-sm text-gray-500">{item.date}</span>
                        </div>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="text-center mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-6">
              Can&apos;t find your order or have questions about tracking?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-block px-6 py-3 bg-luxior-deep-orange text-white font-semibold rounded-lg hover:bg-luxior-orange transition-colors"
              >
                Contact Support
              </a>
              <a
                href="tel:+254700000000"
                className="inline-block px-6 py-3 border-2 border-luxior-deep-orange text-luxior-deep-orange font-semibold rounded-lg hover:bg-luxior-deep-orange hover:text-white transition-colors"
              >
                Call Us: +254 700 000 000
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}