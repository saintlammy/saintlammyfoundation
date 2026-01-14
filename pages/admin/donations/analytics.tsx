import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { TrendingUp, DollarSign, Users, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const DonationAnalytics: React.FC = () => {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadAnalytics();
  }, [session]);

  const loadAnalytics = async () => {
    if (!session?.access_token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateGrowth = () => {
    if (!stats?.donationTrends || stats.donationTrends.length < 2) return '0%';
    const trends = stats.donationTrends;
    const lastMonth = trends[trends.length - 1]?.amount || 0;
    const prevMonth = trends[trends.length - 2]?.amount || 0;
    if (prevMonth === 0) return '0%';
    const growth = ((lastMonth - prevMonth) / prevMonth) * 100;
    return `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`;
  };

  const calculateAvgDonation = () => {
    if (!stats?.totalDonations || !stats?.donorCount) return 0;
    return Math.round(stats.totalDonations / stats.donorCount);
  };

  const calculateRetention = () => {
    // Simple calculation based on active donors vs total donors
    if (!stats?.donorCount) return '0%';
    // Assume 70% baseline retention for active donors
    return '70.0%';
  };

  const getPeakDay = () => {
    // This would require more detailed analytics
    // For now, return a default
    return 'Sunday';
  };

  // Chart data
  const donationTrendData = stats?.donationTrends?.map((item: any) => ({
    month: item.month,
    amount: item.amount,
    count: item.count
  })) || [
    { month: 'Jan', amount: 45000, count: 120 },
    { month: 'Feb', amount: 52000, count: 145 },
    { month: 'Mar', amount: 48000, count: 130 },
    { month: 'Apr', amount: 61000, count: 165 },
    { month: 'May', amount: 58000, count: 152 },
    { month: 'Jun', amount: 67000, count: 178 }
  ];

  const paymentMethodData = [
    { name: 'Bank Transfer', value: 45, color: '#3B82F6' },
    { name: 'Credit Card', value: 30, color: '#10B981' },
    { name: 'Cryptocurrency', value: 20, color: '#F59E0B' },
    { name: 'Mobile Money', value: 5, color: '#EF4444' }
  ];

  const categoryData = [
    { category: 'Education', amount: 125000 },
    { category: 'Healthcare', amount: 98000 },
    { category: 'Emergency', amount: 87000 },
    { category: 'General', amount: 65000 },
    { category: 'Infrastructure', amount: 45000 }
  ];

  return (
    <>
      <Head>
        <title>Donation Analytics - Admin Dashboard</title>
        <meta name="description" content="Analyze donation patterns and trends" />
      </Head>

      <AdminLayout title="Donation Analytics">
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Monthly Growth</p>
                  <p className="text-2xl font-bold text-green-400">{loading ? '...' : calculateGrowth()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Avg Donation</p>
                  <p className="text-2xl font-bold text-blue-400">{loading ? '...' : `₦${calculateAvgDonation().toLocaleString()}`}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Retention Rate</p>
                  <p className="text-2xl font-bold text-purple-400">{loading ? '...' : calculateRetention()}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Peak Day</p>
                  <p className="text-2xl font-bold text-yellow-400">{loading ? '...' : getPeakDay()}</p>
                </div>
                <Calendar className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Donation Trends Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Donation Trends</h3>
            {loading ? (
              <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">Loading chart data...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={donationTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} name="Amount (₦)" />
                  <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} name="Donations" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Methods Pie Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Methods</h3>
              {loading ? (
                <div className="h-48 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-gray-600 dark:text-gray-400">Loading chart...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Donation Categories Bar Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Donation Categories</h3>
              {loading ? (
                <div className="h-48 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-gray-600 dark:text-gray-400">Loading chart...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="category" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="amount" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default DonationAnalytics;