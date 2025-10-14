import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { Search, Heart, Mail, Phone, Calendar, TrendingUp } from 'lucide-react';
import { getTypedSupabaseClient } from '@/lib/supabase';

interface DonorStats {
  totalDonors: number;
  activeThisMonth: number;
  recurringDonors: number;
  avgLifetimeValue: number;
}

interface Donor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  total_donated: number;
  last_donation_date?: string;
  created_at: string;
}

const DonorsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState<DonorStats>({
    totalDonors: 0,
    activeThisMonth: 0,
    recurringDonors: 0,
    avgLifetimeValue: 0
  });
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDonorData();
  }, []);

  const loadDonorData = async () => {
    try {
      setLoading(true);
      const client = getTypedSupabaseClient();

      // Fetch all donors
      const { data: donorsData, error: donorsError } = await (client as any)
        .from('donors')
        .select('*')
        .order('created_at', { ascending: false });

      if (donorsError) {
        console.error('Error fetching donors:', donorsError);
        setStats(getFallbackStats());
        setDonors([]);
        return;
      }

      const allDonors = donorsData || [];
      setDonors(allDonors);

      // Calculate stats
      const totalDonors = allDonors.length;

      // Active this month - donors who donated in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const activeThisMonth = allDonors.filter((donor: Donor) => {
        if (!donor.last_donation_date) return false;
        const lastDonation = new Date(donor.last_donation_date);
        return lastDonation >= thirtyDaysAgo;
      }).length;

      // Fetch recurring donations to count recurring donors
      const { data: recurringData, error: recurringError } = await (client as any)
        .from('recurring_donations')
        .select('donor_id')
        .eq('status', 'active');

      const recurringDonors = recurringError ? 0 : (recurringData?.length || 0);

      // Calculate average lifetime value
      const totalValue = allDonors.reduce((sum: number, donor: Donor) =>
        sum + (donor.total_donated || 0), 0
      );
      const avgLifetimeValue = totalDonors > 0 ? Math.round(totalValue / totalDonors) : 0;

      setStats({
        totalDonors,
        activeThisMonth,
        recurringDonors,
        avgLifetimeValue
      });
    } catch (error) {
      console.error('Error loading donor data:', error);
      setStats(getFallbackStats());
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackStats = (): DonorStats => {
    return {
      totalDonors: 0,
      activeThisMonth: 0,
      recurringDonors: 0,
      avgLifetimeValue: 0
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredDonors = donors.filter(donor =>
    donor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Donors Management - Admin Dashboard</title>
        <meta name="description" content="Manage donor relationships and history" />
      </Head>

      <AdminLayout title="Donors Management">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Donors</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {loading ? '...' : stats.totalDonors.toLocaleString()}
                  </p>
                </div>
                <Heart className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Active This Month</p>
                  <p className="text-2xl font-bold text-green-400">
                    {loading ? '...' : stats.activeThisMonth.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Recurring Donors</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {loading ? '...' : stats.recurringDonors.toLocaleString()}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Avg Lifetime Value</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {loading ? '...' : formatCurrency(stats.avgLifetimeValue)}
                  </p>
                </div>
                <Heart className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search donors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Donors Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Donor Directory ({loading ? '...' : filteredDonors.length})
              </h3>
              {loading ? (
                <div className="text-gray-600 dark:text-gray-400 text-center py-12">
                  Loading donors...
                </div>
              ) : filteredDonors.length === 0 ? (
                <div className="text-gray-600 dark:text-gray-400 text-center py-12">
                  {searchTerm ? 'No donors found matching your search.' : 'No donors yet.'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Name</th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Email</th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Phone</th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Total Donated</th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Last Donation</th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Member Since</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDonors.map((donor) => (
                        <tr key={donor.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {donor.name?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <span className="text-gray-900 dark:text-white font-medium">{donor.name || 'Unknown'}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              {donor.email || 'No email'}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {donor.phone || 'N/A'}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white font-semibold">
                            {formatCurrency(donor.total_donated || 0)}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {donor.last_donation_date
                              ? new Date(donor.last_donation_date).toLocaleDateString('en-NG', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })
                              : 'Never'}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {new Date(donor.created_at).toLocaleDateString('en-NG', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default DonorsManagement;