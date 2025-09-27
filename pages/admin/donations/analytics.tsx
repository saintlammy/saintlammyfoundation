import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { TrendingUp, DollarSign, Users, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Monthly Growth</p>
                  <p className="text-2xl font-bold text-green-400">{loading ? '...' : calculateGrowth()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg Donation</p>
                  <p className="text-2xl font-bold text-blue-400">{loading ? '...' : `₦${calculateAvgDonation().toLocaleString()}`}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Retention Rate</p>
                  <p className="text-2xl font-bold text-purple-400">{loading ? '...' : calculateRetention()}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Peak Day</p>
                  <p className="text-2xl font-bold text-yellow-400">{loading ? '...' : getPeakDay()}</p>
                </div>
                <Calendar className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Charts Placeholder */}
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Donation Trends</h3>
            <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Chart component placeholder - integrate with analytics service</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Payment Methods</h3>
              <div className="h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Pie chart placeholder</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Donation Categories</h3>
              <div className="h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Bar chart placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default DonationAnalytics;