import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Cookie,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  Settings,
  Globe,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  Target,
  RefreshCw,
} from 'lucide-react';

interface CookieAnalytics {
  summary: {
    totalConsents: number;
    acceptAllCount: number;
    rejectAllCount: number;
    customizeCount: number;
    acceptanceRate: number;
  };
  categoryOptIns: {
    analytics: { count: number; percentage: string };
    marketing: { count: number; percentage: string };
    preferences: { count: number; percentage: string };
  };
  dailyStats: Array<{
    date: string;
    total_consents: number;
    accept_all_count: number;
    reject_all_count: number;
    acceptance_rate: number;
  }>;
  geoDistribution: Array<{
    country: string;
    total: number;
    accepts: number;
    rejects: number;
  }>;
  recentActivity: Array<{
    id: string;
    consent_action: string;
    consent_date: string;
    country_code: string;
    analytics: boolean;
    marketing: boolean;
    preferences: boolean;
  }>;
}

const CookieComplianceDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<CookieAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/cookie-analytics?timeRange=${timeRange}`);
      const data = await response.json();

      if (data.success) {
        setAnalytics(data);
      } else {
        setError(data.error || 'Failed to fetch analytics');
      }
    } catch (err) {
      console.error('Error fetching cookie analytics:', err);
      setError('Failed to load cookie analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <AdminLayout title="Cookie Compliance">
      <Head>
        <title>Cookie Compliance - Admin Dashboard</title>
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Cookie className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Cookie Compliance</h1>
              <p className="text-gray-400">Monitor cookie consent and GDPR compliance</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={fetchAnalytics}
              disabled={loading}
              className="p-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-gray-300 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {loading && !analytics ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : analytics ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Consents */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-white">
                  {analytics.summary.totalConsents.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">Total Consents</p>
              </div>

              {/* Acceptance Rate */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-white">
                  {analytics.summary.acceptanceRate.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-400">Acceptance Rate</p>
              </div>

              {/* Accept All */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                  <div className="text-xs text-gray-400">
                    {((analytics.summary.acceptAllCount / analytics.summary.totalConsents) * 100).toFixed(1)}%
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">
                  {analytics.summary.acceptAllCount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">Accepted All</p>
              </div>

              {/* Reject All */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <XCircle className="w-8 h-8 text-red-600" />
                  <div className="text-xs text-gray-400">
                    {analytics.summary.totalConsents > 0
                      ? ((analytics.summary.rejectAllCount / analytics.summary.totalConsents) * 100).toFixed(1)
                      : 0}%
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">
                  {analytics.summary.rejectAllCount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">Rejected All</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Category Opt-In Rates */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <PieChart className="w-6 h-6 text-green-600" />
                  <h2 className="text-lg font-bold text-white">Cookie Category Opt-Ins</h2>
                </div>

                <div className="space-y-4">
                  {/* Analytics */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-300">Analytics</span>
                      </div>
                      <span className="text-sm font-bold text-white">
                        {analytics.categoryOptIns.analytics.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 rounded-full h-2 transition-all duration-500"
                        style={{ width: `${analytics.categoryOptIns.analytics.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {analytics.categoryOptIns.analytics.count.toLocaleString()} users opted in
                    </p>
                  </div>

                  {/* Marketing */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-300">Marketing</span>
                      </div>
                      <span className="text-sm font-bold text-white">
                        {analytics.categoryOptIns.marketing.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 rounded-full h-2 transition-all duration-500"
                        style={{ width: `${analytics.categoryOptIns.marketing.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {analytics.categoryOptIns.marketing.count.toLocaleString()} users opted in
                    </p>
                  </div>

                  {/* Preferences */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-gray-300">Preferences</span>
                      </div>
                      <span className="text-sm font-bold text-white">
                        {analytics.categoryOptIns.preferences.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 rounded-full h-2 transition-all duration-500"
                        style={{ width: `${analytics.categoryOptIns.preferences.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {analytics.categoryOptIns.preferences.count.toLocaleString()} users opted in
                    </p>
                  </div>

                  {/* Necessary (always 100%) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-300">Necessary</span>
                      </div>
                      <span className="text-sm font-bold text-white">100%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 rounded-full h-2 w-full" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Always enabled</p>
                  </div>
                </div>
              </div>

              {/* Geographic Distribution */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="w-6 h-6 text-green-600" />
                  <h2 className="text-lg font-bold text-white">Geographic Distribution</h2>
                </div>

                {analytics.geoDistribution.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.geoDistribution.slice(0, 8).map((geo, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold text-green-700">
                              {geo.country || 'Unknown'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {geo.total.toLocaleString()} consents
                            </p>
                            <p className="text-xs text-gray-400">
                              {geo.accepts} accepts • {geo.rejects} rejects
                            </p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {((geo.accepts / geo.total) * 100).toFixed(0)}% accepted
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Globe className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No geographic data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-6 h-6 text-green-600" />
                <h2 className="text-lg font-bold text-white">Recent Consent Activity</h2>
              </div>

              <div className="space-y-3">
                {analytics.recentActivity.length > 0 ? (
                  analytics.recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            activity.consent_action === 'accept_all'
                              ? 'bg-green-100'
                              : activity.consent_action === 'reject_all'
                              ? 'bg-red-100'
                              : 'bg-orange-100'
                          }`}
                        >
                          {activity.consent_action === 'accept_all' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : activity.consent_action === 'reject_all' ? (
                            <XCircle className="w-5 h-5 text-red-600" />
                          ) : (
                            <Settings className="w-5 h-5 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white capitalize">
                            {activity.consent_action.replace('_', ' ')}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{formatRelativeTime(activity.consent_date)}</span>
                            {activity.country_code && (
                              <>
                                <span>•</span>
                                <span>{activity.country_code}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {activity.analytics && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            Analytics
                          </span>
                        )}
                        {activity.marketing && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                            Marketing
                          </span>
                        )}
                        {activity.preferences && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                            Preferences
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Activity className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No recent activity</p>
                  </div>
                )}
              </div>
            </div>

            {/* Daily Trend Chart (Simple visualization) */}
            {analytics.dailyStats.length > 0 && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mt-6">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <h2 className="text-lg font-bold text-white">Daily Consent Trend</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">
                          Date
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-300">
                          Total
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-300">
                          Accepted
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-300">
                          Rejected
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-300">
                          Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.dailyStats.slice(0, 10).map((stat, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-700">
                          <td className="py-3 px-4 text-sm text-white">
                            {formatDate(stat.date)}
                          </td>
                          <td className="py-3 px-4 text-sm text-white text-right">
                            {stat.total_consents}
                          </td>
                          <td className="py-3 px-4 text-sm text-green-600 text-right">
                            {stat.accept_all_count}
                          </td>
                          <td className="py-3 px-4 text-sm text-red-600 text-right">
                            {stat.reject_all_count}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">
                            {stat.acceptance_rate ? stat.acceptance_rate.toFixed(1) : 0}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </AdminLayout>
  );
};

export default CookieComplianceDashboard;
