import React, { useState } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
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

  // Mock analytics data
  const donationTrends = [
    { date: '2024-01-01', amount: 65000, donors: 120, conversions: 3.2 },
    { date: '2024-01-08', amount: 78000, donors: 145, conversions: 3.8 },
    { date: '2024-01-15', amount: 92000, donors: 170, conversions: 4.1 },
    { date: '2024-01-22', amount: 88000, donors: 165, conversions: 3.9 },
    { date: '2024-01-29', amount: 105000, donors: 190, conversions: 4.5 },
    { date: '2024-02-05', amount: 125000, donors: 220, conversions: 5.1 },
    { date: '2024-02-12', amount: 138000, donors: 245, conversions: 5.3 },
    { date: '2024-02-19', amount: 142000, donors: 260, conversions: 5.7 },
    { date: '2024-02-26', amount: 155000, donors: 280, conversions: 6.2 },
    { date: '2024-03-05', amount: 168000, donors: 295, conversions: 6.5 },
    { date: '2024-03-12', amount: 172000, donors: 310, conversions: 6.8 },
    { date: '2024-03-19', amount: 185000, donors: 325, conversions: 7.1 }
  ];

  const websiteTraffic = [
    { date: '2024-03-01', visitors: 1250, pageviews: 3850, sessions: 1180 },
    { date: '2024-03-02', visitors: 1380, pageviews: 4200, sessions: 1320 },
    { date: '2024-03-03', visitors: 1520, pageviews: 4650, sessions: 1450 },
    { date: '2024-03-04', visitors: 1420, pageviews: 4350, sessions: 1380 },
    { date: '2024-03-05', visitors: 1680, pageviews: 5100, sessions: 1620 },
    { date: '2024-03-06', visitors: 1850, pageviews: 5650, sessions: 1780 },
    { date: '2024-03-07', visitors: 2100, pageviews: 6400, sessions: 2020 }
  ];

  const donationSources = [
    { name: 'Direct Website', value: 45, color: '#3B82F6' },
    { name: 'Social Media', value: 30, color: '#10B981' },
    { name: 'Email Campaign', value: 15, color: '#F59E0B' },
    { name: 'Referrals', value: 10, color: '#EF4444' }
  ];

  const deviceBreakdown = [
    { name: 'Desktop', value: 55, color: '#8B5CF6' },
    { name: 'Mobile', value: 35, color: '#06B6D4' },
    { name: 'Tablet', value: 10, color: '#84CC16' }
  ];

  const topPages = [
    { page: '/donate', visits: 15420, conversions: 8.5 },
    { page: '/', visits: 12350, conversions: 3.2 },
    { page: '/programs', visits: 8940, conversions: 2.1 },
    { page: '/about', visits: 7650, conversions: 1.8 },
    { page: '/volunteer', visits: 5280, conversions: 4.3 }
  ];

  const conversionFunnel = [
    { step: 'Website Visitors', count: 25000, percentage: 100 },
    { step: 'Donation Page Views', count: 8500, percentage: 34 },
    { step: 'Started Donation', count: 3200, percentage: 12.8 },
    { step: 'Completed Donation', count: 1650, percentage: 6.6 }
  ];

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: '₦2,847,592',
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
      period: 'vs last month'
    },
    {
      title: 'Conversion Rate',
      value: '6.8%',
      change: '+0.5%',
      trend: 'up',
      icon: TrendingUp,
      period: 'vs last month'
    },
    {
      title: 'Average Donation',
      value: '₦18,450',
      change: '-2.1%',
      trend: 'down',
      icon: Heart,
      period: 'vs last month'
    },
    {
      title: 'Website Visitors',
      value: '47,284',
      change: '+23.7%',
      trend: 'up',
      icon: Eye,
      period: 'vs last month'
    }
  ];

  const formatCurrency = (value: number) => {
    return `₦${value.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

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
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 3 months</option>
                <option value="1y">Last year</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiCards.map((kpi, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">{kpi.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{kpi.value}</p>
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
                      <span className="text-gray-400 text-sm ml-1">{kpi.period}</span>
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
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-6">Donation Trends</h3>
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
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-6">Website Traffic</h3>
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
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-6">Donation Sources</h3>
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
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-6">Device Breakdown</h3>
              <div className="space-y-4">
                {deviceBreakdown.map((device, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {device.name === 'Desktop' && <Monitor className="w-5 h-5 text-purple-400 mr-3" />}
                      {device.name === 'Mobile' && <Smartphone className="w-5 h-5 text-cyan-400 mr-3" />}
                      {device.name === 'Tablet' && <Globe className="w-5 h-5 text-lime-400 mr-3" />}
                      <span className="text-white">{device.name}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 h-2 bg-gray-700 rounded-full mr-3">
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
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-6">Conversion Funnel</h3>
              <div className="space-y-4">
                {conversionFunnel.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">{step.step}</span>
                      <span className="text-gray-300 text-sm">{step.count.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-3 bg-gray-700 rounded-full">
                      <div
                        className="h-3 bg-gradient-to-r from-accent-500 to-accent-400 rounded-full transition-all duration-500"
                        style={{ width: `${step.percentage}%` }}
                      />
                    </div>
                    <span className="text-gray-400 text-xs">{step.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Pages Table */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Top Performing Pages</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Page</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Visits</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Conversion Rate</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {topPages.map((page, index) => (
                    <tr key={index} className="hover:bg-gray-700/20">
                      <td className="px-6 py-4">
                        <span className="text-white font-mono">{page.page}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300">{page.visits.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300">{page.conversions}%</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-24 h-2 bg-gray-700 rounded-full">
                          <div
                            className="h-2 bg-accent-500 rounded-full"
                            style={{ width: `${(page.conversions / 10) * 100}%` }}
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