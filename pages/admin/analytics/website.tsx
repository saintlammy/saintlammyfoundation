import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Users,
  Eye,
  MousePointer,
  Clock,
  TrendingUp,
  TrendingDown,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
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

interface WebsiteStats {
  totalVisitors: number;
  visitorsChange: number;
  pageViews: number;
  pageViewsChange: number;
  avgSessionDuration: string;
  durationChange: number;
  bounceRate: number;
  bounceRateChange: number;
}

interface TrafficData {
  date: string;
  visitors: number;
  pageViews: number;
}

interface DeviceData {
  device: string;
  visitors: number;
  percentage: number;
  color: string;
  [key: string]: string | number; // Index signature for Recharts compatibility
}

interface TopPage {
  path: string;
  views: number;
  uniqueVisitors: number;
  avgDuration: string;
  bounceRate: number;
}

interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  color: string;
}

const WebsiteAnalyticsManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<WebsiteStats>({
    totalVisitors: 0,
    visitorsChange: 0,
    pageViews: 0,
    pageViewsChange: 0,
    avgSessionDuration: '0:00',
    durationChange: 0,
    bounceRate: 0,
    bounceRateChange: 0
  });
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
  const [timeRange, setTimeRange] = useState<string>('month');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      // In production, this would fetch from analytics service (Google Analytics, Plausible, etc.)
      // For now, using calculated fallback data
      await new Promise(resolve => setTimeout(resolve, 500));
      setFallbackData();
    } catch (error) {
      console.error('Error loading website analytics:', error);
      setFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const setFallbackData = () => {
    // Stats based on time range
    const rangeMultiplier = {
      week: 0.2,
      month: 1,
      quarter: 3,
      year: 12
    }[timeRange] || 1;

    setStats({
      totalVisitors: Math.round(12450 * rangeMultiplier),
      visitorsChange: 18.5,
      pageViews: Math.round(45230 * rangeMultiplier),
      pageViewsChange: 12.3,
      avgSessionDuration: '3:42',
      durationChange: 8.7,
      bounceRate: 42.3,
      bounceRateChange: -5.2
    });

    // Traffic trends
    if (timeRange === 'week') {
      setTrafficData([
        { date: 'Mon', visitors: 1850, pageViews: 6420 },
        { date: 'Tue', visitors: 2120, pageViews: 7180 },
        { date: 'Wed', visitors: 1980, pageViews: 6890 },
        { date: 'Thu', visitors: 2340, pageViews: 8150 },
        { date: 'Fri', visitors: 2180, pageViews: 7620 },
        { date: 'Sat', visitors: 1420, pageViews: 4980 },
        { date: 'Sun', visitors: 1320, pageViews: 4650 }
      ]);
    } else if (timeRange === 'month') {
      setTrafficData([
        { date: 'Week 1', visitors: 2850, pageViews: 10240 },
        { date: 'Week 2', visitors: 3120, pageViews: 11580 },
        { date: 'Week 3', visitors: 2980, pageViews: 10890 },
        { date: 'Week 4', visitors: 3500, pageViews: 12520 }
      ]);
    } else if (timeRange === 'quarter') {
      setTrafficData([
        { date: 'Jan', visitors: 11200, pageViews: 41280 },
        { date: 'Feb', visitors: 10800, pageViews: 39650 },
        { date: 'Mar', visitors: 12450, pageViews: 45230 }
      ]);
    } else {
      setTrafficData([
        { date: 'Jan', visitors: 9800, pageViews: 36240 },
        { date: 'Feb', visitors: 10200, pageViews: 37680 },
        { date: 'Mar', visitors: 11500, pageViews: 42350 },
        { date: 'Apr', visitors: 12100, pageViews: 44580 },
        { date: 'May', visitors: 11800, pageViews: 43420 },
        { date: 'Jun', visitors: 13200, pageViews: 48590 },
        { date: 'Jul', visitors: 12900, pageViews: 47530 },
        { date: 'Aug', visitors: 11600, pageViews: 42760 },
        { date: 'Sep', visitors: 12800, pageViews: 47120 },
        { date: 'Oct', visitors: 13500, pageViews: 49750 },
        { date: 'Nov', visitors: 12700, pageViews: 46810 },
        { date: 'Dec', visitors: 11350, pageViews: 41820 }
      ]);
    }

    setDeviceData([
      { device: 'Desktop', visitors: 5820, percentage: 46.7, color: '#3B82F6' },
      { device: 'Mobile', visitors: 4980, percentage: 40.0, color: '#10B981' },
      { device: 'Tablet', visitors: 1650, percentage: 13.3, color: '#F59E0B' }
    ]);

    setTopPages([
      { path: '/', views: 15420, uniqueVisitors: 12350, avgDuration: '2:15', bounceRate: 35.2 },
      { path: '/donate', views: 8920, uniqueVisitors: 7240, avgDuration: '4:32', bounceRate: 28.5 },
      { path: '/about', views: 6730, uniqueVisitors: 5890, avgDuration: '3:18', bounceRate: 41.8 },
      { path: '/programs', views: 5640, uniqueVisitors: 4820, avgDuration: '3:45', bounceRate: 38.2 },
      { path: '/contact', views: 4180, uniqueVisitors: 3650, avgDuration: '2:52', bounceRate: 45.6 },
      { path: '/success-stories', views: 3920, uniqueVisitors: 3420, avgDuration: '4:05', bounceRate: 32.1 }
    ]);

    setTrafficSources([
      { source: 'Direct', visitors: 4360, percentage: 35, color: '#3B82F6' },
      { source: 'Organic Search', visitors: 3860, percentage: 31, color: '#10B981' },
      { source: 'Social Media', visitors: 2490, percentage: 20, color: '#F59E0B' },
      { source: 'Referral', visitors: 1245, percentage: 10, color: '#EF4444' },
      { source: 'Email', visitors: 495, percentage: 4, color: '#8B5CF6' }
    ]);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'desktop':
        return Monitor;
      case 'mobile':
        return Smartphone;
      case 'tablet':
        return Tablet;
      default:
        return Monitor;
    }
  };

  return (
    <>
      <Head>
        <title>Website Analytics - Admin Dashboard</title>
        <meta name="description" content="Comprehensive website traffic and behavior analytics" />
      </Head>

      <AdminLayout title="Website Analytics">
        <div className="space-y-6">
          {/* Header with Filter */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Website Analytics</h2>
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
            {/* Total Visitors */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Total Visitors</p>
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {loading ? '...' : formatNumber(stats.totalVisitors)}
              </p>
              <div className={`flex items-center gap-1 text-sm ${stats.visitorsChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.visitorsChange >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span>{Math.abs(stats.visitorsChange)}% vs previous period</span>
              </div>
            </div>

            {/* Page Views */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Page Views</p>
                <Eye className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {loading ? '...' : formatNumber(stats.pageViews)}
              </p>
              <div className={`flex items-center gap-1 text-sm ${stats.pageViewsChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.pageViewsChange >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span>{Math.abs(stats.pageViewsChange)}% vs previous period</span>
              </div>
            </div>

            {/* Avg Session Duration */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Avg Session Duration</p>
                <Clock className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {loading ? '...' : stats.avgSessionDuration}
              </p>
              <div className={`flex items-center gap-1 text-sm ${stats.durationChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.durationChange >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span>{Math.abs(stats.durationChange)}% vs previous period</span>
              </div>
            </div>

            {/* Bounce Rate */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Bounce Rate</p>
                <MousePointer className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {loading ? '...' : `${stats.bounceRate}%`}
              </p>
              <div className={`flex items-center gap-1 text-sm ${stats.bounceRateChange <= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.bounceRateChange <= 0 ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                <span>{Math.abs(stats.bounceRateChange)}% vs previous period</span>
              </div>
            </div>
          </div>

          {/* Traffic Trends Chart */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Traffic Overview</h3>
            {loading ? (
              <div className="h-[350px] flex items-center justify-center text-gray-400">
                Loading chart...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
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
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorVisitors)"
                    strokeWidth={2}
                    name="Visitors"
                  />
                  <Area
                    type="monotone"
                    dataKey="pageViews"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorPageViews)"
                    strokeWidth={2}
                    name="Page Views"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Device & Traffic Sources Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Device Breakdown */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Devices</h3>
              {loading ? (
                <div className="h-[300px] flex items-center justify-center text-gray-400">
                  Loading chart...
                </div>
              ) : (
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="visitors"
                        label={({ percentage }) => `${percentage}%`}
                      >
                        {deviceData.map((entry, index) => (
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
                  <div className="space-y-2">
                    {deviceData.map((device) => {
                      const IconComponent = getDeviceIcon(device.device);
                      return (
                        <div key={device.device} className="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-5 h-5" style={{ color: device.color }} />
                            <span className="text-white font-medium">{device.device}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-semibold">{formatNumber(device.visitors)}</p>
                            <p className="text-xs text-gray-400">{device.percentage}%</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Traffic Sources */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Traffic Sources</h3>
              {loading ? (
                <div className="h-[300px] flex items-center justify-center text-gray-400">
                  Loading chart...
                </div>
              ) : (
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={trafficSources} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis type="number" stroke="#9CA3AF" />
                      <YAxis dataKey="source" type="category" stroke="#9CA3AF" width={100} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Bar dataKey="visitors" radius={[0, 8, 8, 0]}>
                        {trafficSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {trafficSources.map((source) => (
                      <div key={source.source} className="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                          <span className="text-white font-medium">{source.source}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">{formatNumber(source.visitors)}</p>
                          <p className="text-xs text-gray-400">{source.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Top Pages Table */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Top Pages</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Page</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Views</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Unique Visitors</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Avg Duration</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Bounce Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-400">
                        Loading pages...
                      </td>
                    </tr>
                  ) : (
                    topPages.map((page) => (
                      <tr key={page.path} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="py-3 px-4 text-white font-medium">{page.path}</td>
                        <td className="py-3 px-4 text-white font-semibold">{formatNumber(page.views)}</td>
                        <td className="py-3 px-4 text-gray-400">{formatNumber(page.uniqueVisitors)}</td>
                        <td className="py-3 px-4 text-gray-400">{page.avgDuration}</td>
                        <td className="py-3 px-4">
                          <span className={`${page.bounceRate < 40 ? 'text-green-500' : page.bounceRate < 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {page.bounceRate}%
                          </span>
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

export default WebsiteAnalyticsManagement;
