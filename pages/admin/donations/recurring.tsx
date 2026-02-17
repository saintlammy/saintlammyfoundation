import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { donationService } from '@/lib/donationService';
import {
  Search,
  Filter,
  Calendar,
  DollarSign,
  Users,
  Repeat,
  Play,
  Pause,
  MoreVertical,
  Plus,
  RefreshCw,
  TrendingUp
} from 'lucide-react';

interface RecurringDonation {
  id: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  status: 'active' | 'paused' | 'cancelled';
  nextPayment: string;
  startDate: string;
  totalCollected: number;
  successfulPayments: number;
  failedPayments: number;
}

const RecurringDonations: React.FC = () => {
  const [donations, setDonations] = useState<RecurringDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [frequencyFilter, setFrequencyFilter] = useState('all');

  useEffect(() => {
    loadRecurringDonations();
  }, []);

  const loadRecurringDonations = async () => {
    try {
      setLoading(true);

      // Fetch real donations from database
      const response = await donationService.getDonations({
        limit: 500
      });

      // Filter for recurring donations (monthly, weekly, yearly, quarterly)
      const recurringOnly = response.donations.filter((d: any) =>
        d.frequency && d.frequency !== 'one-time'
      );

      // Group donations by donor to calculate recurring stats
      const donorMap = new Map<string, any>();

      recurringOnly.forEach((donation: any) => {
        const donorKey = donation.donor?.email || donation.donor_id || donation.id;
        if (!donorMap.has(donorKey)) {
          donorMap.set(donorKey, {
            id: donation.donor_id || donation.id,
            donorName: donation.donor?.name || 'Anonymous',
            donorEmail: donation.donor?.email || 'N/A',
            amount: donation.amount,
            currency: donation.currency,
            frequency: donation.frequency,
            status: donation.status === 'completed' ? 'active' : 'paused',
            startDate: donation.created_at,
            donations: [donation]
          });
        } else {
          const existing = donorMap.get(donorKey);
          existing.donations.push(donation);
        }
      });

      // Calculate stats for each recurring donor
      const transformedDonations: RecurringDonation[] = Array.from(donorMap.values()).map((donor: any) => {
        const successfulPayments = donor.donations.filter((d: any) => d.status === 'completed').length;
        const failedPayments = donor.donations.filter((d: any) => d.status === 'failed').length;
        const totalCollected = donor.donations
          .filter((d: any) => d.status === 'completed')
          .reduce((sum: number, d: any) => sum + d.amount, 0);

        // Calculate next payment based on frequency
        const lastPayment = new Date(donor.donations[donor.donations.length - 1].created_at);
        const nextPayment = new Date(lastPayment);

        switch (donor.frequency) {
          case 'weekly':
            nextPayment.setDate(nextPayment.getDate() + 7);
            break;
          case 'monthly':
            nextPayment.setMonth(nextPayment.getMonth() + 1);
            break;
          case 'quarterly':
            nextPayment.setMonth(nextPayment.getMonth() + 3);
            break;
          case 'yearly':
            nextPayment.setFullYear(nextPayment.getFullYear() + 1);
            break;
        }

        return {
          id: donor.id,
          donorName: donor.donorName,
          donorEmail: donor.donorEmail,
          amount: donor.amount,
          currency: donor.currency,
          frequency: donor.frequency,
          status: donor.status,
          nextPayment: nextPayment.toISOString(),
          startDate: donor.startDate,
          totalCollected,
          successfulPayments,
          failedPayments
        };
      });

      setDonations(transformedDonations);
    } catch (error) {
      console.error('Error loading recurring donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-500/20 text-green-400`;
      case 'paused':
        return `${baseClasses} bg-yellow-500/20 text-yellow-400`;
      case 'cancelled':
        return `${baseClasses} bg-red-500/20 text-red-400`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-600 dark:text-gray-400`;
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels = {
      weekly: 'Weekly',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      yearly: 'Yearly'
    };
    return labels[frequency as keyof typeof labels] || frequency;
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.donorEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || donation.status === statusFilter;
    const matchesFrequency = frequencyFilter === 'all' || donation.frequency === frequencyFilter;

    return matchesSearch && matchesStatus && matchesFrequency;
  });

  const totalActive = donations.filter(d => d.status === 'active').length;
  const totalMonthlyValue = donations
    .filter(d => d.status === 'active')
    .reduce((sum, d) => {
      // Convert to monthly equivalent
      const multiplier = d.frequency === 'weekly' ? 4 : d.frequency === 'monthly' ? 1 : d.frequency === 'quarterly' ? 1/3 : 1/12;
      return sum + (d.amount * multiplier);
    }, 0);

  // Calculate success rate from all donations
  const totalPayments = donations.reduce((sum, d) => sum + d.successfulPayments + d.failedPayments, 0);
  const successfulPayments = donations.reduce((sum, d) => sum + d.successfulPayments, 0);
  const successRate = totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 0;

  return (
    <>
      <Head>
        <title>Recurring Donations - Admin Dashboard</title>
        <meta name="description" content="Manage recurring donation subscriptions" />
      </Head>

      <AdminLayout title="Recurring Donations">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalActive}</p>
                </div>
                <Repeat className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Monthly Value</p>
                  <p className="text-2xl font-bold text-green-400">₦{totalMonthlyValue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Success Rate</p>
                  <p className="text-2xl font-bold text-blue-400">{successRate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Subscribers</p>
                  <p className="text-2xl font-bold text-purple-400">{donations.length}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search recurring donations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={frequencyFilter}
                onChange={(e) => setFrequencyFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500"
              >
                <option value="all">All Frequencies</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>

              <button
                onClick={loadRecurringDonations}
                className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-gray-900 dark:text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Recurring Donations Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Donor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Amount & Frequency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Next Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Total Collected
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-600 dark:text-gray-400">
                        Loading recurring donations...
                      </td>
                    </tr>
                  ) : filteredDonations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-600 dark:text-gray-400">
                        No recurring donations found
                      </td>
                    </tr>
                  ) : (
                    filteredDonations.map((donation) => (
                      <tr key={donation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {donation.donorName}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {donation.donorEmail}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-bold text-gray-900 dark:text-white">
                              {donation.amount} {donation.currency}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {getFrequencyLabel(donation.frequency)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(donation.status)}>
                            {donation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="text-green-400">
                              ✓ {donation.successfulPayments} successful
                            </div>
                            <div className="text-red-400">
                              ✗ {donation.failedPayments} failed
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(donation.nextPayment).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900 dark:text-white">
                            {donation.totalCollected} {donation.currency}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {donation.status === 'active' ? (
                              <button className="text-yellow-400 hover:text-yellow-300" title="Pause">
                                <Pause className="w-4 h-4" />
                              </button>
                            ) : (
                              <button className="text-green-400 hover:text-green-300" title="Resume">
                                <Play className="w-4 h-4" />
                              </button>
                            )}
                            <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white">
                              <MoreVertical className="w-4 h-4" />
                            </button>
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
      </AdminLayout>
    </>
  );
};

export default RecurringDonations;