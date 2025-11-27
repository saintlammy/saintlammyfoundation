import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { donationService } from '@/lib/donationService';
import {
  Search,
  Filter,
  Download,
  Eye,
  ExternalLink,
  Calendar,
  DollarSign,
  TrendingUp,
  RefreshCw,
  ChevronDown,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  Trash2,
  Check,
  X
} from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  donorName: string;
  donorEmail: string;
  paymentMethod: string;
  txHash?: string;
  createdAt: string;
  category: string;
}

const DonationTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ id: string; amount: number; currency: string } | null>(null);
  const [confirmNotes, setConfirmNotes] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0
  });

  useEffect(() => {
    loadTransactions();
  }, [statusFilter, methodFilter, dateRange]);

  const loadTransactions = async () => {
    try {
      setLoading(true);

      // Fetch real donations from database
      const response = await donationService.getDonations({
        limit: 100,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        paymentMethod: methodFilter !== 'all' ? methodFilter : undefined
      });

      // Transform donations to transactions format
      const transformedTransactions: Transaction[] = response.donations.map((donation: any) => ({
        id: donation.id,
        amount: donation.amount,
        currency: donation.currency,
        status: donation.status as 'completed' | 'pending' | 'failed',
        donorName: donation.donor?.name || 'Anonymous',
        donorEmail: donation.donor?.email || 'N/A',
        paymentMethod: donation.payment_method === 'crypto'
          ? `${donation.currency} (Crypto)`
          : donation.payment_method || 'Unknown',
        txHash: donation.transaction_hash,
        createdAt: donation.created_at,
        category: donation.category || 'general'
      }));

      setTransactions(transformedTransactions);

      // Calculate stats from all donations
      const allDonations = await donationService.getDonations({ limit: 1000 });
      const statsData = {
        total: allDonations.donations.length,
        completed: allDonations.donations.filter((d: any) => d.status === 'completed').length,
        pending: allDonations.donations.filter((d: any) => d.status === 'pending').length,
        failed: allDonations.donations.filter((d: any) => d.status === 'failed').length
      };
      setStats(statsData);

    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDonation = async (donationId: string) => {
    try {
      setDeleting(donationId);

      const response = await fetch(`/api/admin/donations?donationId=${donationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        }
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || 'Failed to delete donation');
        return;
      }

      // Success - reload transactions
      alert('Donation deleted successfully');
      setDeleteConfirm(null);
      await loadTransactions();

    } catch (error) {
      console.error('Error deleting donation:', error);
      alert('Failed to delete donation. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const handleManualConfirm = async () => {
    if (!confirmModal) return;

    try {
      setConfirming(true);

      const response = await fetch('/api/admin/donations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          donationId: confirmModal.id,
          status: 'completed',
          notes: confirmNotes || 'Manually confirmed by admin'
        })
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || 'Failed to confirm donation');
        return;
      }

      // Success - close modal and reload
      alert('Donation manually confirmed successfully');
      setConfirmModal(null);
      setConfirmNotes('');
      await loadTransactions();

    } catch (error) {
      console.error('Error confirming donation:', error);
      alert('Failed to confirm donation. Please try again.');
    } finally {
      setConfirming(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-500/20 text-green-400`;
      case 'pending':
        return `${baseClasses} bg-yellow-500/20 text-yellow-400`;
      case 'failed':
        return `${baseClasses} bg-red-500/20 text-red-400`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400`;
    }
  };

  const getBlockchainExplorerUrl = (txHash: string, currency: string): string | null => {
    const lowerCurrency = currency.toLowerCase();

    if (lowerCurrency.includes('btc') || lowerCurrency === 'bitcoin') {
      return `https://blockstream.info/tx/${txHash}`;
    } else if (lowerCurrency.includes('eth') || lowerCurrency === 'ethereum') {
      return `https://etherscan.io/tx/${txHash}`;
    } else if (lowerCurrency.includes('xrp') || lowerCurrency === 'ripple') {
      return `https://xrpscan.com/tx/${txHash}`;
    } else if (lowerCurrency.includes('sol') || lowerCurrency === 'solana') {
      return `https://explorer.solana.com/tx/${txHash}`;
    } else if (lowerCurrency.includes('bnb') || lowerCurrency.includes('bsc')) {
      return `https://bscscan.com/tx/${txHash}`;
    } else if (lowerCurrency.includes('trx') || lowerCurrency === 'tron') {
      return `https://tronscan.org/#/transaction/${txHash}`;
    }

    return null;
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.donorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || transaction.paymentMethod.toLowerCase().includes(methodFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesMethod;
  });

  return (
    <>
      <Head>
        <title>Donation Transactions - Admin Dashboard</title>
        <meta name="description" content="View and manage all donation transactions" />
      </Head>

      <AdminLayout title="Donation Transactions">
        <div className="space-y-6">
          {/* Stats Cards - Dynamic */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-green-400">{stats.completed.toLocaleString()}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.pending.toLocaleString()}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Failed</p>
                  <p className="text-2xl font-bold text-red-400">{stats.failed.toLocaleString()}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>

              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500"
              >
                <option value="all">All Methods</option>
                <option value="card">Credit Card</option>
                <option value="bitcoin">Bitcoin</option>
                <option value="ethereum">Ethereum</option>
                <option value="paypal">PayPal</option>
              </select>

              <button
                onClick={loadTransactions}
                className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>

              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg flex items-center gap-2 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Donor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-600 dark:text-gray-400">
                        Loading transactions...
                      </td>
                    </tr>
                  ) : filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-600 dark:text-gray-400">
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                        onClick={() => setSelectedTransaction(transaction)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(transaction.status)}
                            <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                              #{transaction.id}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {transaction.donorName}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {transaction.donorEmail}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900 dark:text-white">
                            {transaction.amount} {transaction.currency}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                            {transaction.category}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {transaction.paymentMethod}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(transaction.status)}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {new Date(transaction.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTransaction(transaction);
                              }}
                              className="text-accent-500 hover:text-accent-600 dark:text-accent-400 dark:hover:text-accent-300"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {transaction.txHash && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const explorerUrl = getBlockchainExplorerUrl(transaction.txHash!, transaction.currency);
                                  if (explorerUrl) window.open(explorerUrl, '_blank');
                                }}
                                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                                title="View on Blockchain"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            )}
                            {transaction.status === 'pending' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmModal({
                                    id: transaction.id,
                                    amount: transaction.amount,
                                    currency: transaction.currency
                                  });
                                }}
                                className="text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300"
                                title="Manually Confirm Donation"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            {(transaction.status === 'pending' || transaction.status === 'failed') && (
                              <>
                                {deleteConfirm === transaction.id ? (
                                  <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteDonation(transaction.id);
                                      }}
                                      disabled={deleting === transaction.id}
                                      className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded disabled:opacity-50"
                                      title="Confirm Delete"
                                    >
                                      {deleting === transaction.id ? 'Deleting...' : 'Confirm'}
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteConfirm(null);
                                      }}
                                      disabled={deleting === transaction.id}
                                      className="px-2 py-1 text-xs bg-gray-500 hover:bg-gray-600 text-white rounded disabled:opacity-50"
                                      title="Cancel"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteConfirm(transaction.id);
                                    }}
                                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                                    title="Delete (Pending/Failed only)"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Manual Confirmation Modal */}
        {confirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Manually Confirm Donation
                </h3>
                <button
                  onClick={() => {
                    setConfirmModal(null);
                    setConfirmNotes('');
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-2">
                    ⚠️ You are about to manually confirm this donation without blockchain verification.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This should only be done if you have verified the payment through other means (e.g., bank confirmation, email receipt, etc.)
                  </p>
                </div>

                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Donation Amount</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {confirmModal.amount} {confirmModal.currency}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirmation Notes <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={confirmNotes}
                    onChange={(e) => setConfirmNotes(e.target.value)}
                    placeholder="e.g., Verified via bank statement, Email confirmation received, etc."
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    rows={4}
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Provide details on how you verified this donation
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <button
                    onClick={handleManualConfirm}
                    disabled={confirming || !confirmNotes.trim()}
                    className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {confirming ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Confirm Donation
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setConfirmModal(null);
                      setConfirmNotes('');
                    }}
                    disabled={confirming}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Detail Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Transaction Details
                </h3>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Transaction ID and Status */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Transaction ID</p>
                    <p className="text-lg font-mono text-gray-900 dark:text-white">
                      #{selectedTransaction.id}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedTransaction.status)}
                    <span className={getStatusBadge(selectedTransaction.status)}>
                      {selectedTransaction.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div className="bg-gradient-to-br from-accent-500/10 to-accent-600/10 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {selectedTransaction.amount.toLocaleString()} {selectedTransaction.currency}
                  </p>
                </div>

                {/* Donor Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Donor Name</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {selectedTransaction.donorName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white break-all">
                      {selectedTransaction.donorEmail}
                    </p>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Payment Method</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {selectedTransaction.paymentMethod}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Category</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white capitalize">
                      {selectedTransaction.category}
                    </p>
                  </div>
                </div>

                {/* Transaction Hash */}
                {selectedTransaction.txHash && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Transaction Hash</p>
                      <button
                        onClick={() => {
                          const explorerUrl = getBlockchainExplorerUrl(selectedTransaction.txHash!, selectedTransaction.currency);
                          if (explorerUrl) window.open(explorerUrl, '_blank');
                        }}
                        className="text-accent-500 hover:text-accent-600 dark:text-accent-400 dark:hover:text-accent-300 flex items-center space-x-1 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View on Blockchain</span>
                      </button>
                    </div>
                    <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                      {selectedTransaction.txHash}
                    </p>
                  </div>
                )}

                {/* Timestamp */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Transaction Date</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {new Date(selectedTransaction.createdAt).toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {selectedTransaction.status === 'pending' && (
                    <button
                      onClick={() => {
                        setSelectedTransaction(null);
                        setConfirmModal({
                          id: selectedTransaction.id,
                          amount: selectedTransaction.amount,
                          currency: selectedTransaction.currency
                        });
                      }}
                      className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Manually Confirm
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
};

export default DonationTransactions;