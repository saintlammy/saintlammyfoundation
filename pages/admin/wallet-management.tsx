import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Wallet,
  Plus,
  Copy,
  Eye,
  EyeOff,
  TrendingUp,
  Download,
  RefreshCw,
  Settings,
  Shield,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Bitcoin,
  Coins
} from 'lucide-react';

interface WalletAddress {
  id: string;
  currency: string;
  address: string;
  label: string;
  balance: number;
  balanceUSD: number;
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  qrCode?: string;
}

const WalletManagement: React.FC = () => {
  const [showPrivateKeys, setShowPrivateKeys] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [wallets, setWallets] = useState<WalletAddress[]>([]);

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    setLoading(true);
    try {
      // Mock data for now - replace with actual API call
      const mockWallets: WalletAddress[] = [
        {
          id: '1',
          currency: 'Bitcoin',
          address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          label: 'Primary Bitcoin Wallet',
          balance: 0.05432,
          balanceUSD: 2341.67,
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          lastUsed: '2024-01-20T14:22:00Z'
        },
        {
          id: '2',
          currency: 'Ethereum',
          address: '0x742d35Cc6634C0532925a3b8D04Cc3dc2D9BB6C',
          label: 'Primary Ethereum Wallet',
          balance: 1.2345,
          balanceUSD: 3456.78,
          isActive: true,
          createdAt: '2024-01-15T10:35:00Z',
          lastUsed: '2024-01-19T09:15:00Z'
        },
        {
          id: '3',
          currency: 'Solana',
          address: 'DQmMDc5HQRX7X8j9fRkXmZqN4h2k3B7L1m5Y6vA8sT9',
          label: 'Primary Solana Wallet',
          balance: 125.67,
          balanceUSD: 1234.56,
          isActive: true,
          createdAt: '2024-01-15T10:40:00Z'
        },
        {
          id: '4',
          currency: 'Cardano',
          address: 'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2qd4a6gtmjps6s99',
          label: 'Secondary Cardano Wallet',
          balance: 500.0,
          balanceUSD: 567.89,
          isActive: false,
          createdAt: '2024-01-10T16:20:00Z'
        }
      ];
      setWallets(mockWallets);
    } catch (error) {
      console.error('Error loading wallets:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePrivateKeyVisibility = (walletId: string) => {
    setShowPrivateKeys(prev => ({
      ...prev,
      [walletId]: !prev[walletId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Add toast notification here
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400 dark:bg-green-500/20 dark:text-green-400">
        Active
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-400 dark:bg-red-500/20 dark:text-red-400">
        Inactive
      </span>
    );
  };

  const getCurrencyIcon = (currency: string) => {
    switch (currency.toLowerCase()) {
      case 'bitcoin':
        return <Bitcoin className="w-6 h-6 text-orange-500 dark:text-orange-400" />;
      case 'ethereum':
        return <Coins className="w-6 h-6 text-blue-500 dark:text-blue-400" />;
      case 'solana':
        return <Coins className="w-6 h-6 text-purple-500 dark:text-purple-400" />;
      case 'cardano':
        return <Coins className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      default:
        return <Wallet className="w-6 h-6 text-gray-500 dark:text-gray-400" />;
    }
  };

  const totalBalanceUSD = wallets.reduce((sum, wallet) => sum + wallet.balanceUSD, 0);
  const activeWallets = wallets.filter(wallet => wallet.isActive).length;

  const stats = [
    {
      title: 'Total Crypto Value',
      value: `$${totalBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-green-500 dark:text-green-400'
    },
    {
      title: 'Active Wallets',
      value: activeWallets.toString(),
      icon: Wallet,
      color: 'text-blue-500 dark:text-blue-400'
    },
    {
      title: 'Total Wallets',
      value: wallets.length.toString(),
      icon: Shield,
      color: 'text-purple-500 dark:text-purple-400'
    },
    {
      title: 'Last Activity',
      value: '2 hours ago',
      icon: Clock,
      color: 'text-yellow-500 dark:text-yellow-400'
    }
  ];

  return (
    <>
      <Head>
        <title>Crypto Wallet Management - Admin Dashboard</title>
        <meta name="description" content="Manage cryptocurrency wallets and addresses" />
      </Head>

      <AdminLayout title="Crypto Wallet Management">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-3">
              <button className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Generate New Wallet</span>
              </button>
              <button
                onClick={loadWallets}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Balances</span>
              </button>
            </div>
            <div className="flex gap-3">
              <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export Addresses</span>
              </button>
              <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {/* Wallet List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cryptocurrency Wallets</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your foundation's crypto wallet addresses</p>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="px-6 py-12 text-center text-gray-600 dark:text-gray-400">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                  Loading wallets...
                </div>
              ) : wallets.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-600 dark:text-gray-400">
                  No wallets found. Generate your first wallet to get started.
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {wallets.map((wallet) => (
                    <div key={wallet.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                            {getCurrencyIcon(wallet.currency)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{wallet.label}</h4>
                              {getStatusBadge(wallet.isActive)}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{wallet.currency}</p>

                            <div className="space-y-2">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Wallet Address
                                </label>
                                <div className="flex items-center space-x-2">
                                  <code className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm font-mono">
                                    {wallet.address}
                                  </code>
                                  <button
                                    onClick={() => copyToClipboard(wallet.address)}
                                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    title="Copy address"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-right ml-4">
                          <div className="mb-2">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              {wallet.balance} {wallet.currency.slice(0, 3).toUpperCase()}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              ${wallet.balanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                          </div>

                          <div className="flex items-center space-x-1">
                            {getStatusIcon(wallet.isActive)}
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {wallet.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>

                          {wallet.lastUsed && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Last used: {new Date(wallet.lastUsed).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Security Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Auto-generate New Addresses
                </label>
                <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white">
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="daily">Daily</option>
                  <option value="manual">Manual Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Balance Check Frequency
                </label>
                <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white">
                  <option value="realtime">Real-time</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                </select>
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

export default WalletManagement;