import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { analyticsService } from '@/lib/analyticsService';
import { donationService } from '@/lib/donationService';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  Eye,
  Calendar,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
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
  Legend,
  ComposedChart
} from 'recharts';

const Analytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [realtimeMetrics, setRealtimeMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
    const interval = setInterval(() => {
      loadRealtimeMetrics();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [timeframe]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [analytics, realtime] = await Promise.all([
        analyticsService.getAnalyticsData(),
        analyticsService.getRealtimeMetrics()
      ]);
      setAnalyticsData(analytics);
      setRealtimeMetrics(realtime);
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Keep mock data as fallback
    } finally {
      setLoading(false);
    }
  };

  const loadRealtimeMetrics = async () => {
    try {
      const realtime = await analyticsService.getRealtimeMetrics();
      setRealtimeMetrics(realtime);
    } catch (error) {
      console.error('Error loading realtime metrics:', error);
    }
  };

  // Use real data from analytics service
  const donationTrends = analyticsData?.donations?.monthlyTrend?.map((item: any) => ({
    date: item.month,
    amount: item.amount,
    donors: item.count,
    conversions: analyticsData?.traffic?.conversionRate || 0
  })) || [];

  const websiteTraffic = analyticsData?.traffic?.dailyStats?.map((item: any) => ({
    date: item.date,
    visitors: item.visitors || 0,
    pageviews: item.pageviews || 0,
    sessions: item.sessions || item.visitors || 0
  })) || [];

  const donationSources = analyticsData?.donations?.byMethod ?
    Object.entries(analyticsData.donations.byMethod).map(([name, value], idx) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: value as number,
      color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][idx % 5]
    })) : [];

  const deviceBreakdown = analyticsData?.traffic?.deviceBreakdown ?
    Object.entries(analyticsData.traffic.deviceBreakdown).map(([name, value], idx) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: value as number,
      color: ['#8B5CF6', '#06B6D4', '#84CC16'][idx % 3]
    })) : [];

  const topPages = analyticsData?.traffic?.topPages?.map((item: any) => ({
    page: item.page,
    visits: item.views,
    conversions: (item.uniqueViews / item.views * 100) || 0
  })) || [];

  const conversionFunnel = analyticsData?.traffic?.funnel || [];

  // Helper functions for formatting
  const formatCurrency = (value: number) => {
    return `₦${value.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(analyticsData?.donations?.totalAmount || 0),
      change: `${analyticsData?.donations?.monthlyGrowth >= 0 ? '+' : ''}${analyticsData?.donations?.monthlyGrowth?.toFixed(1) || 0}%`,
      trend: (analyticsData?.donations?.monthlyGrowth || 0) >= 0 ? 'up' : 'down',
      icon: DollarSign,
      period: 'vs last month'
    },
    {
      title: 'Conversion Rate',
      value: formatPercentage(analyticsData?.traffic?.conversionRate || 0),
      change: '+0.5%',
      trend: 'up',
      icon: TrendingUp,
      period: 'vs last month'
    },
    {
      title: 'Average Donation',
      value: formatCurrency(analyticsData?.donations?.averageAmount || 0),
      change: '-2.1%',
      trend: 'down',
      icon: Heart,
      period: 'vs last month'
    },
    {
      title: 'Website Visitors',
      value: (analyticsData?.traffic?.uniqueVisitors || 0).toLocaleString(),
      change: '+23.7%',
      trend: 'up',
      icon: Eye,
      period: 'vs last month'
    }
  ];

  return (
    <>
      <Head>
        <title>Analytics Dashboard - Admin</title>
        <meta name="description" content="Analytics and reporting dashboard" />
      </Head>

      <AdminLayout title="Analytics Dashboard">
        <div className="space-y-8">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 3 months</option>
                <option value="1y">Last year</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors border border-gray-200 dark:border-gray-700">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-gray-900 dark:text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiCards.map((kpi, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{kpi.value}</p>
                    <div className="flex items-center mt-2">
                      {kpi.trend === 'up' ? (
                        <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-400 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {kpi.change}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">{kpi.period}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center">
                    <kpi.icon className="w-6 h-6 text-accent-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Donation Trends */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Donation Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={donationTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" tick={{fontSize: 12}} />
                  <YAxis yAxisId="left" stroke="#9CA3AF" tick={{fontSize: 12}} />
                  <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" tick={{fontSize: 12}} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value, name) => [
                      name === 'amount' ? formatCurrency(Number(value)) : value,
                      name
                    ]}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="amount"
                    fill="url(#donationGradient)"
                    stroke="#3B82F6"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="donors"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: '#10B981', r: 4 }}
                  />
                  <defs>
                    <linearGradient id="donationGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Website Traffic */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Website Traffic</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={websiteTraffic}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" tick={{fontSize: 12}} />
                  <YAxis stroke="#9CA3AF" tick={{fontSize: 12}} />
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
                    dataKey="visitors"
                    stackId="1"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="sessions"
                    stackId="1"
                    stroke="#06B6D4"
                    fill="#06B6D4"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Donation Sources */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Donation Sources</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={donationSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {donationSources.map((entry, index) => (
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
            </div>

            {/* Device Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Device Breakdown</h3>
              <div className="space-y-4">
                {deviceBreakdown.map((device, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {device.name === 'Desktop' && <Monitor className="w-5 h-5 text-purple-400 mr-3" />}
                      {device.name === 'Mobile' && <Smartphone className="w-5 h-5 text-cyan-400 mr-3" />}
                      {device.name === 'Tablet' && <Globe className="w-5 h-5 text-lime-400 mr-3" />}
                      <span className="text-gray-900 dark:text-white">{device.name}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 h-2 bg-gray-50 dark:bg-gray-700 rounded-full mr-3">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${device.value}%`, backgroundColor: device.color }}
                        />
                      </div>
                      <span className="text-gray-300 text-sm">{device.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversion Funnel */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Conversion Funnel</h3>
              <div className="space-y-4">
                {conversionFunnel.map((step: { step: string; count: number; percentage: number }, index: number) => (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-900 dark:text-white text-sm">{step.step}</span>
                      <span className="text-gray-300 text-sm">{step.count.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-3 bg-gray-50 dark:bg-gray-700 rounded-full">
                      <div
                        className="h-3 bg-gradient-to-r from-accent-500 to-accent-400 rounded-full transition-all duration-500"
                        style={{ width: `${step.percentage}%` }}
                      />
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 text-xs">{step.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Pages Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performing Pages</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Page</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Visits</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Conversion Rate</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {topPages.map((page: { page: string; views: number; uniqueVisitors: number; avgTimeOnPage: string; conversionRate: string }, index: number) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/20">
                      <td className="px-6 py-4">
                        <span className="text-gray-900 dark:text-white font-mono">{page.page}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300">{page.views.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300">{page.conversionRate}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-24 h-2 bg-gray-50 dark:bg-gray-700 rounded-full">
                          <div
                            className="h-2 bg-accent-500 rounded-full"
                            style={{ width: page.conversionRate }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default Analytics;