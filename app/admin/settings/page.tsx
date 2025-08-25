
'use client';

import { useState, useEffect } from 'react';
import { useAuth, useIsAdmin } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Settings, 
  Save, 
  Globe, 
  DollarSign, 
  Shield, 
  Bell
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const isAdmin = useIsAdmin();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      site_name: 'LuxiorMall',
      site_description: 'Premium e-commerce platform for Kenya',
      contact_email: 'admin@luxiormall.com',
      support_phone: '+254700000000',
      currency: 'KES',
      timezone: 'Africa/Nairobi'
    },
    payments: {
      mpesa_shortcode: '',
      mpesa_passkey: '',
      commission_rate: 10,
      minimum_payout: 1000
    },
    notifications: {
      email_notifications: true,
      sms_notifications: false,
      order_notifications: true,
      low_stock_alerts: true,
      new_seller_alerts: true
    },
    security: {
      require_email_verification: true,
      require_phone_verification: false,
      session_timeout: 24,
      max_login_attempts: 5
    }
  });

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !isAdmin) {
        router.push('/');
        return;
      }
      loadSettings();
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  const loadSettings = async () => {
    try {
      // TODO: Load settings from API
      // const response = await fetch('/api/admin/settings');
      // const data = await response.json();
      // setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // TODO: Save settings to API
      // await fetch('/api/admin/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // });
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (category: keyof typeof settings, key: string, value: any) => {
    setSettings(prev => {
      const currentCategory = prev[category];
      return {
        ...prev,
        [category]: {
          ...currentCategory,
          [key]: value
        }
      };
    });
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'payments', name: 'Payments', icon: DollarSign },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-8 h-8 text-luxior-deep-orange" />
              <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
            </div>
            <p className="text-gray-600">Configure your e-commerce platform</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 bg-luxior-deep-orange text-white px-4 py-2 rounded-lg hover:bg-luxior-orange transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-luxior-deep-orange text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">General Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.general.site_name}
                      onChange={(e) => updateSetting('general', 'site_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={settings.general.contact_email}
                      onChange={(e) => updateSetting('general', 'contact_email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Support Phone
                    </label>
                    <input
                      type="text"
                      value={settings.general.support_phone}
                      onChange={(e) => updateSetting('general', 'support_phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={settings.general.currency}
                      onChange={(e) => updateSetting('general', 'currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
                    >
                      <option value="KES">Kenyan Shilling (KES)</option>
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={settings.general.site_description}
                    onChange={(e) => updateSetting('general', 'site_description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Payment Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      M-Pesa Shortcode
                    </label>
                    <input
                      type="text"
                      value={settings.payments.mpesa_shortcode}
                      onChange={(e) => updateSetting('payments', 'mpesa_shortcode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
                      placeholder="174379"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission Rate (%)
                    </label>
                    <input
                      type="number"
                      value={settings.payments.commission_rate}
                      onChange={(e) => updateSetting('payments', 'commission_rate', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
                      min="0"
                      max="100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Payout (KES)
                    </label>
                    <input
                      type="number"
                      value={settings.payments.minimum_payout}
                      onChange={(e) => updateSetting('payments', 'minimum_payout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
                      min="100"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    M-Pesa Passkey
                  </label>
                  <input
                    type="password"
                    value={settings.payments.mpesa_passkey}
                    onChange={(e) => updateSetting('payments', 'mpesa_passkey', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
                    placeholder="Enter your M-Pesa passkey"
                  />
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Notification Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.email_notifications}
                        onChange={(e) => updateSetting('notifications', 'email_notifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-luxior-deep-orange/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-luxior-deep-orange"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Order Notifications</h4>
                      <p className="text-sm text-gray-600">Get notified about new orders</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.order_notifications}
                        onChange={(e) => updateSetting('notifications', 'order_notifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-luxior-deep-orange/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-luxior-deep-orange"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Low Stock Alerts</h4>
                      <p className="text-sm text-gray-600">Alert when products are running low</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.low_stock_alerts}
                        onChange={(e) => updateSetting('notifications', 'low_stock_alerts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-luxior-deep-orange/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-luxior-deep-orange"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">New Seller Alerts</h4>
                      <p className="text-sm text-gray-600">Notify when new sellers register</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.new_seller_alerts}
                        onChange={(e) => updateSetting('notifications', 'new_seller_alerts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-luxior-deep-orange/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-luxior-deep-orange"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Security Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Require Email Verification</h4>
                      <p className="text-sm text-gray-600">Users must verify their email to register</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.require_email_verification}
                        onChange={(e) => updateSetting('security', 'require_email_verification', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-luxior-deep-orange/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-luxior-deep-orange"></div>
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Timeout (hours)
                      </label>
                      <input
                        type="number"
                        value={settings.security.session_timeout}
                        onChange={(e) => updateSetting('security', 'session_timeout', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
                        min="1"
                        max="168"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        value={settings.security.max_login_attempts}
                        onChange={(e) => updateSetting('security', 'max_login_attempts', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxior-deep-orange focus:border-transparent"
                        min="3"
                        max="10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
