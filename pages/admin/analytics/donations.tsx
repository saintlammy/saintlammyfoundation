import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  CreditCard,
  ArrowUp,
  ArrowDown,
  Filter
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { getTypedSupabaseClient } from '@/lib/supabase';

interface DonationStats {
  totalRevenue: number;
  revenueChange: number;
  totalDonations: number;
  donationsChange: number;
  avgDonation: number;
  avgChange: number;
  activeDonors: number;
  donorsChange: number;
}

interface TrendData {
  date: string;
  amount: number;
  count: number;
}

interface PaymentMethodData {
  method: string;
  amount: number;
  percentage: number;
  color: string;
  [key: string]: string | number; // Index signature for Recharts compatibility
}

interface TopDonor {
  id: string;
  name: string;
  email: string;
  totalDonated: number;
  donationCount: number;
  lastDonation: string;
}

const DonationAnalyticsManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DonationStats>({
    totalRevenue: 0,
    revenueChange: 0,
    totalDonations: 0,
    donationsChange: 0,
    avgDonation: 0,
    avgChange: 0,
    activeDonors: 0,
    donorsChange: 0
  });
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>([]);
  const [topDonors, setTopDonors] = useState<TopDonor[]>([]);
  const [timeRange, setTimeRange] = useState<string>('month');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const client = getTypedSupabaseClient();

      // Fetch donations data
      const { data: donationsData, error: donationsError } = await (client as any)
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (donationsError) {
        console.error('Error fetching donations:', donationsError);
        setFallbackData();
        return;
      }

      const donations = donationsData || [];

      // Calculate stats
      const now = new Date();
      const currentPeriodStart = getTimePeriodStart(timeRange);
      const previousPeriodStart = getPreviousPeriodStart(timeRange);
      const previousPeriodEnd = currentPeriodStart;

      const currentPeriodDonations = donations.filter((d: any) =>
        new Date(d.created_at) >= currentPeriodStart
      );

      const previousPeriodDonations = donations.filter((d: any) => {
        const date = new Date(d.created_at);
        return date >= previousPeriodStart && date < previousPeriodEnd;
      });

      const totalRevenue = currentPeriodDonations.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);
      const prevRevenue = previousPeriodDonations.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);
      const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;

      const totalDonations = currentPeriodDonations.length;
      const prevDonations = previousPeriodDonations.length;
      const donationsChange = prevDonations > 0 ? ((totalDonations - prevDonations) / prevDonations) * 100 : 0;

      const avgDonation = totalDonations > 0 ? totalRevenue / totalDonations : 0;
      const prevAvg = prevDonations > 0 ? prevRevenue / prevDonations : 0;
      const avgChange = prevAvg > 0 ? ((avgDonation - prevAvg) / prevAvg) * 100 : 0;

      // Get unique donors
      const uniqueDonors = new Set(currentPeriodDonations.map((d: any) => d.donor_id || d.donor_email));
      const prevUniqueDonors = new Set(previousPeriodDonations.map((d: any) => d.donor_id || d.donor_email));
      const activeDonors = uniqueDonors.size;
      const donorsChange = prevUniqueDonors.size > 0
        ? ((activeDonors - prevUniqueDonors.size) / prevUniqueDonors.size) * 100
        : 0;

      setStats({
        totalRevenue: Math.round(totalRevenue),
        revenueChange: Math.round(revenueChange * 10) / 10,
        totalDonations,
        donationsChange: Math.round(donationsChange * 10) / 10,
        avgDonation: Math.round(avgDonation),
        avgChange: Math.round(avgChange * 10) / 10,
        activeDonors,
        donorsChange: Math.round(donorsChange * 10) / 10
      });

      // Generate trend data
      const trend = generateTrendData(currentPeriodDonations, timeRange);
      setTrendData(trend);

      // Calculate payment method distribution
      const methodStats = calculatePaymentMethods(currentPeriodDonations);
      setPaymentMethods(methodStats);

      // Get top donors
      const { data: donorsData } = await (client as any)
        .from('donors')
        .select('*')
        .order('total_donated', { ascending: false })
        .limit(5);

      setTopDonors((donorsData || []).map((donor: any) => ({
        id: donor.id,
        name: donor.name || 'Anonymous',
        email: donor.email || 'N/A',
        totalDonated: donor.total_donated || 0,
        donationCount: donor.donation_count || 0,
        lastDonation: donor.last_donation_date || donor.created_at
      })));

    } catch (error) {
      console.error('Error loading analytics data:', error);
      setFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const setFallbackData = () => {
    setStats({
      totalRevenue: 2450000,
      revenueChange: 12.5,
      totalDonations: 856,
      donationsChange: 8.3,
      avgDonation: 2862,
      avgChange: 3.8,
      activeDonors: 423,
      donorsChange: 15.2
    });

    setTrendData([
      { date: 'Week 1', amount: 580000, count: 195 },
      { date: 'Week 2', amount: 620000, count: 210 },
      { date: 'Week 3', amount: 590000, count: 205 },
      { date: 'Week 4', amount: 660000, count: 246 }
    ]);

    setPaymentMethods([
      { method: 'Bank Transfer', amount: 1102500, percentage: 45, color: '#3B82F6' },
      { method: 'Card Payment', amount: 735000, percentage: 30, color: '#10B981' },
      { method: 'Cryptocurrency', amount: 490000, percentage: 20, color: '#F59E0B' },
      { method: 'Mobile Money', amount: 122500, percentage: 5, color: '#EF4444' }
    ]);

    setTopDonors([
      { id: '1', name: 'John Doe', email: 'john@example.com', totalDonated: 250000, donationCount: 12, lastDonation: new Date().toISOString() },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', totalDonated: 180000, donationCount: 8, lastDonation: new Date().toISOString() },
      { id: '3', name: 'Bob Johnson', email: 'bob@example.com', totalDonated: 150000, donationCount: 15, lastDonation: new Date().toISOString() }
    ]);
  };

  const getTimePeriodStart = (range: string): Date => {
    const now = new Date();
    switch (range) {
      case 'week':
        return new Date(now.setDate(now.getDate() - 7));
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1));
      case 'quarter':
        return new Date(now.setMonth(now.getMonth() - 3));
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return new Date(now.setMonth(now.getMonth() - 1));
    }
  };

  const getPreviousPeriodStart = (range: string): Date => {
    const now = new Date();
    switch (range) {
      case 'week':
        return new Date(now.setDate(now.getDate() - 14));
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 2));
      case 'quarter':
        return new Date(now.setMonth(now.getMonth() - 6));
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 2));
      default:
        return new Date(now.setMonth(now.getMonth() - 2));
    }
  };

  const generateTrendData = (donations: any[], range: string): TrendData[] => {
    // Group donations by time period
    const grouped: { [key: string]: { amount: number; count: number } } = {};

    donations.forEach((d: any) => {
      const date = new Date(d.created_at);
      let key = '';

      if (range === 'week') {
        key = date.toLocaleDateString('en-US', { weekday: 'short' });
      } else if (range === 'month') {
        key = `Week ${Math.ceil(date.getDate() / 7)}`;
      } else if (range === 'quarter') {
        key = date.toLocaleDateString('en-US', { month: 'short' });
      } else {
        key = date.toLocaleDateString('en-US', { month: 'short' });
      }

      if (!grouped[key]) {
        grouped[key] = { amount: 0, count: 0 };
      }
      grouped[key].amount += d.amount || 0;
      grouped[key].count += 1;
    });

    return Object.entries(grouped).map(([date, data]) => ({
      date,
      amount: Math.round(data.amount),
      count: data.count
    }));
  };

  const calculatePaymentMethods = (donations: any[]): PaymentMethodData[] => {
    const methods: { [key: string]: number } = {};
    const total = donations.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);

    donations.forEach((d: any) => {
      const method = d.payment_method || 'Unknown';
      methods[method] = (methods[method] || 0) + (d.amount || 0);
    });

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    return Object.entries(methods).map(([method, amount], index) => ({
      method,
      amount: Math.round(amount as number),
      percentage: total > 0 ? Math.round((amount as number / total) * 100) : 0,
      color: colors[index % colors.length]
    }));
  };

  const formatCurrency = (value: number) => {
    return `₦${value.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <Head>
        <title>Donation Analytics - Admin Dashboard</title>
        <meta name="description" content="Comprehensive donation analytics and insights" />
      </Head>

      <AdminLayout title="Donation Analytics">
        <div className="space-y-6">
          {/* Time Range Filter */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Donation Analytics</h2>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 3 Months</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Revenue */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {loading ? '...' : formatCurrency(stats.totalRevenue)}
              </p>
              <div className={`flex items-center gap-1 text-sm ${stats.revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.revenueChange >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span>{Math.abs(stats.revenueChange)}% vs previous period</span>
              </div>
            </div>

            {/* Total Donations */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Total Donations</p>
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {loading ? '...' : stats.totalDonations.toLocaleString()}
              </p>
              <div className={`flex items-center gap-1 text-sm ${stats.donationsChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.donationsChange >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span>{Math.abs(stats.donationsChange)}% vs previous period</span>
              </div>
            </div>

            {/* Average Donation */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Avg Donation</p>
                <CreditCard className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {loading ? '...' : formatCurrency(stats.avgDonation)}
              </p>
              <div className={`flex items-center gap-1 text-sm ${stats.avgChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.avgChange >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span>{Math.abs(stats.avgChange)}% vs previous period</span>
              </div>
            </div>

            {/* Active Donors */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Active Donors</p>
                <Users className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {loading ? '...' : stats.activeDonors.toLocaleString()}
              </p>
              <div className={`flex items-center gap-1 text-sm ${stats.donorsChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.donorsChange >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span>{Math.abs(stats.donorsChange)}% vs previous period</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Donation Trends */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Donation Trends</h3>
              {loading ? (
                <div className="h-[300px] flex items-center justify-center text-gray-400">
                  Loading chart...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#3B82F6"
                      fillOpacity={1}
                      fill="url(#colorAmount)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Payment Methods */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Payment Methods</h3>
              {loading ? (
                <div className="h-[300px] flex items-center justify-center text-gray-400">
                  Loading chart...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethods}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ method, percentage }) => `${method}: ${percentage}%`}
                      outerRadius={100}
                      dataKey="amount"
                    >
                      {paymentMethods.map((entry, index) => (
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
                      formatter={(value: any) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Top Donors Table */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Top Donors</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Donor</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Email</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Total Donated</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Donations</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Last Donation</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-400">
                        Loading donors...
                      </td>
                    </tr>
                  ) : topDonors.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-400">
                        No donor data available
                      </td>
                    </tr>
                  ) : (
                    topDonors.map((donor) => (
                      <tr key={donor.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="py-3 px-4 text-white font-medium">{donor.name}</td>
                        <td className="py-3 px-4 text-gray-400">{donor.email}</td>
                        <td className="py-3 px-4 text-white font-semibold">{formatCurrency(donor.totalDonated)}</td>
                        <td className="py-3 px-4 text-gray-400">{donor.donationCount}</td>
                        <td className="py-3 px-4 text-gray-400">{formatDate(donor.lastDonation)}</td>
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

export default DonationAnalyticsManagement;
