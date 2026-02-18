import React, { useState } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  CreditCard,
  Building2,
  Smartphone,
  Bitcoin,
  DollarSign,
  Settings,
  Eye,
  EyeOff,
  Copy,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

const PaymentGatewayManagement: React.FC = () => {
  const [showApiKeys, setShowApiKeys] = useState<{ [key: string]: boolean }>({});

  const toggleApiKeyVisibility = (gateway: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [gateway]: !prev[gateway]
    }));
  };

  const paymentGateways = [
    {
      id: 'paystack',
      name: 'Paystack',
      icon: CreditCard,
      status: 'active',
      description: 'Primary payment processor for card payments',
      apiKey: 'pk_test_xxxxxxxxxxxxxxxxxxxxx',
      secretKey: 'sk_test_xxxxxxxxxxxxxxxxxxxxx',
      color: 'text-blue-500 dark:text-blue-400',
      bgColor: 'bg-blue-500/20 dark:bg-blue-500/20'
    },
    {
      id: 'flutterwave',
      name: 'Flutterwave',
      icon: Building2,
      status: 'inactive',
      description: 'Alternative payment processor',
      apiKey: 'FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxx',
      secretKey: 'FLWSECK_TEST-xxxxxxxxxxxxxxxxxxxxx',
      color: 'text-orange-500 dark:text-orange-400',
      bgColor: 'bg-orange-500/20 dark:bg-orange-500/20'
    },
    {
      id: 'monnify',
      name: 'Monnify',
      icon: Smartphone,
      status: 'active',
      description: 'Bank transfer and mobile payments',
      apiKey: 'MK_TEST_xxxxxxxxxxxxxxxxxxxxx',
      secretKey: 'SK_TEST_xxxxxxxxxxxxxxxxxxxxx',
      color: 'text-green-500 dark:text-green-400',
      bgColor: 'bg-green-500/20 dark:bg-green-500/20'
    },
    {
      id: 'coinbase',
      name: 'Coinbase Commerce',
      icon: Bitcoin,
      status: 'active',
      description: 'Cryptocurrency payments',
      apiKey: 'xxxxxxxxxxxxxxxxxxxxx',
      secretKey: 'xxxxxxxxxxxxxxxxxxxxx',
      color: 'text-yellow-500 dark:text-yellow-400',
      bgColor: 'bg-yellow-500/20 dark:bg-yellow-500/20'
    }
  ];

  const stats = [
    {
      title: 'Active Gateways',
      value: '3',
      icon: CheckCircle,
      color: 'text-green-500 dark:text-green-400'
    },
    {
      title: 'Total Transactions',
      value: '₦2.4M',
      icon: DollarSign,
      color: 'text-blue-500 dark:text-blue-400'
    },
    {
      title: 'Success Rate',
      value: '98.5%',
      icon: CheckCircle,
      color: 'text-green-500 dark:text-green-400'
    },
    {
      title: 'Failed Transactions',
      value: '23',
      icon: AlertTriangle,
      color: 'text-red-500 dark:text-red-400'
    }
  ];

  return (
    <>
      <Head>
        <title>Payment Gateway Management - Admin Dashboard</title>
        <meta name="description" content="Manage payment gateway settings and configurations" />
      </Head>

      <AdminLayout title="Payment Gateway Management">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Payment Gateways */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {paymentGateways.map((gateway) => {
              const Icon = gateway.icon;
              return (
                <div key={gateway.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-xl ${gateway.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${gateway.color}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{gateway.name}</h3>
                        <p className="text-sm text-gray-400">{gateway.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        gateway.status === 'active'
                          ? 'bg-green-500/20 text-green-400 dark:bg-green-500/20 dark:text-green-400'
                          : 'bg-gray-500/20 text-gray-400 dark:bg-gray-500/20 dark:text-gray-400'
                      }`}>
                        {gateway.status}
                      </span>
                      <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Public API Key
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type={showApiKeys[`${gateway.id}_public`] ? 'text' : 'password'}
                          value={gateway.apiKey}
                          readOnly
                          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                        />
                        <button
                          onClick={() => toggleApiKeyVisibility(`${gateway.id}_public`)}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showApiKeys[`${gateway.id}_public`] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Secret Key
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type={showApiKeys[`${gateway.id}_secret`] ? 'text' : 'password'}
                          value={gateway.secretKey}
                          readOnly
                          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                        />
                        <button
                          onClick={() => toggleApiKeyVisibility(`${gateway.id}_secret`)}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showApiKeys[`${gateway.id}_secret`] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button className="text-sm text-accent-500 dark:text-accent-400 hover:text-accent-600 dark:hover:text-accent-300">
                        Test Connection
                      </button>
                      <button className="flex items-center space-x-1 text-sm text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                        <RefreshCw className="w-4 h-4" />
                        <span>Refresh Keys</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Configuration Settings */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Global Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Default Currency
                </label>
                <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                  <option value="NGN">Nigerian Naira (NGN)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Transaction Fee Structure
                </label>
                <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                  <option value="absorb">Foundation Absorbs Fees</option>
                  <option value="donor">Donor Pays Fees</option>
                  <option value="split">Split Fees</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Minimum Donation Amount
                </label>
                <input
                  type="number"
                  defaultValue="100"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Maximum Donation Amount
                </label>
                <input
                  type="number"
                  defaultValue="1000000"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-2 rounded-lg transition-colors">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default PaymentGatewayManagement;
