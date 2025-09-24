import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Search,
  Filter,
  Download,
  Eye,
  ExternalLink,
  Calendar,
  DollarSign,
  TrendingUp,
  Heart,
  Users,
  Wallet,
  RefreshCw,
  ChevronDown,
  CheckCircle,
  Clock,
  XCircle,
  Bitcoin,
  CreditCard,
  Repeat,
  Globe,
  ArrowUpRight,
  Mail
} from 'lucide-react';
import { SiBitcoin, SiEthereum, SiPaypal, SiTether, SiRipple, SiBinance } from 'react-icons/si';
import { format } from 'date-fns';

interface Donation {
  id: string;
  donor: {
    name: string;
    email: string;
    avatar?: string;
  };
  amount: number;
  currency: string;
  method: 'paypal' | 'crypto' | 'card' | 'bank' | 'international';
  cryptoCurrency?: 'BTC' | 'ETH' | 'USDT' | 'USDC' | 'XRP' | 'BNB';
  network?: string;
  memo?: string;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  date: Date;
  type?: 'one-time' | 'monthly' | 'yearly' | 'subscription';
  source?: string;
  transactionHash?: string;
  paypalOrderId?: string;
  subscriptionId?: string;
  cryptoAddress?: string;
  cryptoTxHash?: string;
  reference: string;
  receiptNumber?: string;
  campaign?: string;
  message?: string;
  fees?: number;
  netAmount?: number;
}

const DonationsManagement: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  // Mock donations data - Updated to match payment system structure
  const donations: Donation[] = [
    {
      id: '1',
      donor: {
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com'
      },
      amount: 250,
      currency: 'USD',
      method: 'paypal',
      status: 'completed',
      date: new Date('2024-01-15T10:30:00'),
      type: 'monthly',
      source: 'hero-cta',
      reference: 'donation_1705316200000',
      paypalOrderId: 'PAYPAL123456789',
      subscriptionId: 'I-BW452GLLEP1G',
      receiptNumber: 'RCP-1705316200000',
      campaign: 'Orphan Care Program',
      message: 'For the children. Keep up the amazing work!',
      fees: 7.5,
      netAmount: 242.5
    },
    {
      id: '2',
      donor: {
        name: 'Michael Chen',
        email: 'm.chen@techcorp.com'
      },
      amount: 500,
      currency: 'USD',
      method: 'crypto',
      cryptoCurrency: 'BTC',
      status: 'completed',
      date: new Date('2024-01-14T15:45:00'),
      type: 'one-time',
      source: 'crypto-donation',
      reference: 'crypto_1705241100000',
      cryptoAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      cryptoTxHash: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z',
      receiptNumber: 'RCP-1705241100000',
      campaign: 'Emergency Relief',
      message: 'Emergency relief donation',
      fees: 15,
      netAmount: 485
    },
    {
      id: '3',
      donor: {
        name: 'Emma Williams',
        email: 'emma.w@foundation.org'
      },
      amount: 150,
      currency: 'USD',
      method: 'paypal',
      status: 'completed',
      date: new Date('2024-01-13T08:20:00'),
      type: 'one-time',
      source: 'footer',
      reference: 'donation_1705132800000',
      paypalOrderId: 'PAYPAL987654321',
      receiptNumber: 'RCP-1705132800000',
      campaign: 'Widow Support Initiative',
      fees: 4.5,
      netAmount: 145.5
    },
    {
      id: '4',
      donor: {
        name: 'David Brown',
        email: 'david.b@crypto.world'
      },
      amount: 1000,
      currency: 'USD',
      method: 'crypto',
      cryptoCurrency: 'ETH',
      status: 'completed',
      date: new Date('2024-01-12T14:10:00'),
      type: 'one-time',
      source: 'success-stories',
      reference: 'crypto_1705060200000',
      cryptoAddress: '0x742d35Cc6675C6C5A3C4e1A7d8b5c0e6f8a9b0c1',
      cryptoTxHash: '0x9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k3j2i1h0g',
      receiptNumber: 'RCP-1705060200000',
      campaign: 'Family Feeding Program',
      message: 'Keep changing lives!',
      fees: 25,
      netAmount: 975
    },
    {
      id: '5',
      donor: {
        name: 'Anonymous Donor',
        email: 'anonymous@privacymail.com'
      },
      amount: 75,
      currency: 'USD',
      method: 'crypto',
      cryptoCurrency: 'USDT',
      status: 'pending',
      date: new Date('2024-01-11T16:45:00'),
      type: 'one-time',
      source: 'urgent-needs',
      reference: 'crypto_1704988500000',
      cryptoAddress: '0x742d35Cc6675C6C5A3C4e1A7d8b5c0e6f8a9b0c1',
      receiptNumber: 'RCP-1704988500000',
      fees: 2.25,
      netAmount: 72.75
    },
    {
      id: '6',
      donor: {
        name: 'Alice Cooper',
        email: 'alice.cooper@email.com'
      },
      amount: 300,
      currency: 'USD',
      method: 'crypto',
      cryptoCurrency: 'USDC',
      network: 'sol',
      status: 'completed',
      date: new Date('2024-01-10T12:30:00'),
      type: 'one-time',
      source: 'newsletter',
      reference: 'crypto_1704886200000',
      cryptoAddress: 'GKvqsuNcnwWqPzzuhLmGi4rzzh55FhJtGizkhHadjqMX',
      cryptoTxHash: '4k3j2h1g0f9e8d7c6b5a4z3y2x1w0v9u8t7s6r5q4p3o2n1m0l',
      receiptNumber: 'RCP-1704886200000',
      campaign: 'Outreach Sponsorship',
      message: 'Love the work you do!',
      fees: 3,
      netAmount: 297
    },
    {
      id: '7',
      donor: {
        name: 'Bob Martinez',
        email: 'bob.martinez@ripple.com'
      },
      amount: 200,
      currency: 'USD',
      method: 'crypto',
      cryptoCurrency: 'XRP',
      network: 'xrpl',
      memo: '12345678',
      status: 'completed',
      date: new Date('2024-01-09T09:15:00'),
      type: 'one-time',
      source: 'sticky-button',
      reference: 'crypto_1704790500000',
      cryptoAddress: 'rPVMhWBsfF9iMXYj3aAzJVkPDTFNSyWdKy',
      cryptoTxHash: 'A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6',
      receiptNumber: 'RCP-1704790500000',
      campaign: 'Emergency Relief',
      message: 'Fast and efficient donation via XRP',
      fees: 1,
      netAmount: 199
    },
    {
      id: '8',
      donor: {
        name: 'Sarah Kim',
        email: 'sarah.kim@binance.com'
      },
      amount: 450,
      currency: 'USD',
      method: 'crypto',
      cryptoCurrency: 'BNB',
      network: 'bep20',
      status: 'pending',
      date: new Date('2024-01-08T18:45:00'),
      type: 'one-time',
      source: 'hero-cta',
      reference: 'crypto_1704739500000',
      cryptoAddress: 'bnb1xy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      receiptNumber: 'RCP-1704739500000',
      campaign: 'Widow Support Initiative',
      message: 'BNB donation for widow support',
      fees: 4.5,
      netAmount: 445.5
    }
  ];

  const stats = {
    totalAmount: donations
      .filter(d => d.status === 'completed')
      .reduce((sum, d) => sum + (d.currency === 'NGN' ? d.amount : d.amount * 1650), 0),
    totalDonations: donations.length,
    pendingAmount: donations
      .filter(d => d.status === 'pending')
      .reduce((sum, d) => sum + (d.currency === 'NGN' ? d.amount : d.amount * 1650), 0),
    successRate: (donations.filter(d => d.status === 'completed').length / donations.length) * 100
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/10';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'failed':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getMethodIcon = (method: string, cryptoCurrency?: string) => {
    switch (method) {
      case 'paypal':
        return <SiPaypal className="w-5 h-5 text-blue-500" />;
      case 'crypto':
        if (cryptoCurrency === 'BTC') {
          return <SiBitcoin className="w-5 h-5 text-orange-500" />;
        } else if (cryptoCurrency === 'ETH') {
          return <SiEthereum className="w-5 h-5 text-purple-500" />;
        } else if (cryptoCurrency === 'USDT') {
          return <SiTether className="w-5 h-5 text-green-500" />;
        } else if (cryptoCurrency === 'USDC') {
          return <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">$</div>;
        } else if (cryptoCurrency === 'XRP') {
          return <SiRipple className="w-5 h-5 text-indigo-500" />;
        } else if (cryptoCurrency === 'BNB') {
          return <SiBinance className="w-5 h-5 text-yellow-500" />;
        }
        return <SiBitcoin className="w-5 h-5 text-orange-500" />;
      case 'card':
        return <CreditCard className="w-5 h-5 text-gray-400" />;
      case 'bank':
        return '🏦';
      case 'international':
        return <Globe className="w-5 h-5 text-blue-400" />;
      default:
        return <Wallet className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    if (currency === 'NGN') {
      return `₦${amount.toLocaleString()}`;
    } else if (currency === 'USD') {
      return `$${amount.toLocaleString()}`;
    } else if (currency === 'BTC') {
      return `${amount} BTC`;
    } else if (currency === 'USDT') {
      return `${amount} USDT`;
    }
    return `${amount} ${currency}`;
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || donation.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || donation.method === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  return (
    <>
      <Head>
        <title>Donations Management - Admin</title>
        <meta name="description" content="Manage and monitor donation transactions" />
      </Head>

      <AdminLayout title="Donations Overview">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Collected</p>
                  <p className="text-2xl font-bold text-white">₦{stats.totalAmount.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Donations</p>
                  <p className="text-2xl font-bold text-white">{stats.totalDonations}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending Amount</p>
                  <p className="text-2xl font-bold text-white">₦{stats.pendingAmount.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Success Rate</p>
                  <p className="text-2xl font-bold text-white">{stats.successRate.toFixed(1)}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search donations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>

                {/* Method Filter */}
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                >
                  <option value="all">All Methods</option>
                  <option value="paypal">PayPal</option>
                  <option value="crypto">Cryptocurrency</option>
                  <option value="card">Credit Card</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="international">International</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Donations Table */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Donor</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Method</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Reference</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredDonations.map((donation) => (
                    <tr key={donation.id} className="hover:bg-gray-700/20">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-semibold">
                              {donation.donor.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{donation.donor.name}</p>
                            <p className="text-gray-400 text-sm">{donation.donor.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium">
                            {formatAmount(donation.amount, donation.currency)}
                          </p>
                          {donation.campaign && (
                            <p className="text-gray-400 text-sm">{donation.campaign}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="mr-3">{getMethodIcon(donation.method, donation.cryptoCurrency)}</div>
                          <div>
                            <span className="text-white capitalize">
                              {donation.method === 'crypto' && donation.cryptoCurrency
                                ? donation.cryptoCurrency
                                : donation.method}
                            </span>
                            {donation.type && (
                              <p className="text-gray-400 text-xs capitalize">{donation.type}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(donation.status)}`}>
                          {getStatusIcon(donation.status)}
                          <span className="capitalize">{donation.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white text-sm">
                            {format(donation.date, 'MMM dd, yyyy')}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {format(donation.date, 'hh:mm a')}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-300 font-mono text-sm">{donation.reference}</p>
                          {donation.receiptNumber && (
                            <p className="text-gray-400 text-xs">{donation.receiptNumber}</p>
                          )}
                          {donation.cryptoTxHash && (
                            <p className="text-gray-400 text-xs font-mono">
                              Tx: {donation.cryptoTxHash.substring(0, 10)}...
                            </p>
                          )}
                          {donation.paypalOrderId && (
                            <p className="text-blue-400 text-xs font-mono">
                              PayPal: {donation.paypalOrderId.substring(0, 10)}...
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="text-gray-400 hover:text-white transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          {(donation.cryptoTxHash || donation.paypalOrderId) && (
                            <button className="text-gray-400 hover:text-white transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          )}
                          {donation.message && (
                            <button
                              className="text-gray-400 hover:text-white transition-colors"
                              title={donation.message}
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredDonations.length === 0 && (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No donations found</p>
                <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">
              Showing {filteredDonations.length} of {donations.length} donations
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-gray-400 hover:text-white disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 bg-accent-500 text-white rounded">1</button>
              <button className="px-3 py-1 text-gray-400 hover:text-white">2</button>
              <button className="px-3 py-1 text-gray-400 hover:text-white">3</button>
              <button className="px-3 py-1 text-gray-400 hover:text-white">
                Next
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default DonationsManagement;