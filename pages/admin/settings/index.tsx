import React, { useState } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Settings,
  Save,
  Globe,
  Wallet,
  Shield,
  Mail,
  Bell,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Key,
  Lock,
  Database,
  Server
} from 'lucide-react';

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    donations: true,
    users: false,
    security: true
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'payment', label: 'Payment Gateway', icon: Wallet },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'backup', label: 'Backup & Data', icon: Database }
  ];

  const renderGeneralSettings = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Organization Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Organization Name</label>
              <input
                type="text"
                defaultValue="Saintlammy Foundation"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Registration Number</label>
              <input
                type="text"
                defaultValue="CAC/IT/NO/12345678"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Primary Email</label>
              <input
                type="email"
                defaultValue="contact@saintlammy.org"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
              <input
                type="tel"
                defaultValue="+234 800 123 4567"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
              <textarea
                rows={3}
                defaultValue="123 Foundation Street, Victoria Island, Lagos, Nigeria"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Website Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-gray-900 dark:text-white font-medium">Maintenance Mode</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Display a maintenance page to visitors</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-gray-900 dark:text-white font-medium">Public Registration</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Allow new users to register on the website</p>
              </div>
              <button className="bg-accent-500 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPaymentSettings = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Payment Gateways</h3>
          <div className="space-y-4">
            {[
              { name: 'Stripe', enabled: true, status: 'Connected', fees: '2.9% + ₦50' },
              { name: 'Paystack', enabled: true, status: 'Connected', fees: '1.5% + ₦100' },
              { name: 'Flutterwave', enabled: false, status: 'Not Connected', fees: '1.4% + ₦20' },
              { name: 'Interswitch', enabled: false, status: 'Not Connected', fees: '1.5% + ₦50' }
            ].map((gateway) => (
              <div key={gateway.name} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-gray-300" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 dark:text-white font-medium">{gateway.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{gateway.fees}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    gateway.enabled
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                  }`}>
                    {gateway.status}
                  </span>
                  <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                    gateway.enabled ? 'bg-accent-500' : 'bg-gray-600'
                  }`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      gateway.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Currency Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Primary Currency</label>
              <select className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500">
                <option>Nigerian Naira (₦)</option>
                <option>US Dollar ($)</option>
                <option>Euro (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Donation</label>
              <input
                type="number"
                defaultValue="1000"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSecuritySettings = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Access Control</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-gray-900 dark:text-white font-medium">Two-Factor Authentication</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Require 2FA for all admin accounts</p>
              </div>
              <button className="bg-accent-500 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-gray-900 dark:text-white font-medium">Session Timeout</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Auto-logout after 30 minutes of inactivity</p>
              </div>
              <button className="bg-accent-500 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">API Keys</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">API Key</label>
              <div className="flex space-x-3">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value="sk_live_abcdef123456789..."
                  readOnly
                  className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-300 hover:text-gray-900 dark:text-white transition-colors"
                >
                  {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNotificationSettings = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Email Notifications</h3>
          <div className="space-y-4">
            {[
              { key: 'email', label: 'Email Notifications', description: 'Receive email notifications' },
              { key: 'donations', label: 'New Donations', description: 'Notify when new donations are received' },
              { key: 'users', label: 'New Users', description: 'Notify when new users register' },
              { key: 'security', label: 'Security Alerts', description: 'Critical security notifications' }
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between">
                <div>
                  <h4 className="text-gray-900 dark:text-white font-medium">{setting.label}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{setting.description}</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({
                    ...prev,
                    [setting.key]: !prev[setting.key as keyof typeof notifications]
                  }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                    notifications[setting.key as keyof typeof notifications] ? 'bg-accent-500' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications[setting.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderIntegrationsSettings = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Third-party Integrations</h3>
          <div className="space-y-4">
            {[
              { name: 'Google Analytics', enabled: true, status: 'Connected' },
              { name: 'Mailchimp', enabled: false, status: 'Not Connected' },
              { name: 'Slack', enabled: true, status: 'Connected' },
              { name: 'Facebook Pixel', enabled: false, status: 'Not Connected' }
            ].map((integration) => (
              <div key={integration.name} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-gray-300" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 dark:text-white font-medium">{integration.name}</h4>
                    <span className={`text-xs font-medium ${
                      integration.enabled ? 'text-green-400' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {integration.status}
                    </span>
                  </div>
                </div>
                <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                  integration.enabled ? 'bg-accent-500' : 'bg-gray-600'
                }`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    integration.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderBackupSettings = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Backup & Recovery</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-gray-900 dark:text-white font-medium">Automatic Backups</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Daily automated database backups</p>
              </div>
              <button className="bg-accent-500 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
              </button>
            </div>
            <div className="pt-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-gray-900 dark:text-white rounded-lg transition-colors">
                <Database className="w-4 h-4" />
                Create Backup Now
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Backups</h3>
          <div className="space-y-3">
            {[
              { date: '2024-01-16 03:00 AM', size: '125 MB', status: 'Success' },
              { date: '2024-01-15 03:00 AM', size: '123 MB', status: 'Success' },
              { date: '2024-01-14 03:00 AM', size: '121 MB', status: 'Success' }
            ].map((backup, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="text-gray-900 dark:text-white text-sm font-medium">{backup.date}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">{backup.size}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400 text-xs font-medium">{backup.status}</span>
                  <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">
                    <Database className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'payment':
        return renderPaymentSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'integrations':
        return renderIntegrationsSettings();
      case 'backup':
        return renderBackupSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <>
      <Head>
        <title>Settings - Saintlammy Foundation Admin</title>
        <meta name="description" content="Admin settings and configuration" />
      </Head>

      <AdminLayout title="Settings">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <nav className="p-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors mb-1 ${
                      activeTab === tab.id
                        ? 'bg-accent-500 text-gray-900 dark:text-white'
                        : 'text-gray-300 hover:bg-gray-50 dark:bg-gray-700 hover:text-gray-900 dark:text-white'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button className="flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-gray-900 dark:text-white rounded-lg transition-colors">
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminSettings;