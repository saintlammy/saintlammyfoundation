import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  Wallet,
  DollarSign,
  Calendar,
  Award,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { useAuth } from '@/contexts/AuthContext';

// Custom CSS for chart tooltips
const chartStyles = `
  :root {
    --tooltip-bg: #ffffff;
    --tooltip-border: #e5e7eb;
    --tooltip-text: #111827;
  }

  .dark {
    --tooltip-bg: #1f2937;
    --tooltip-border: #374151;
    --tooltip-text: #ffffff;
  }
`;

const AdminDashboard: React.FC = () => {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, [session]);

  const loadStats = async () => {
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
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Default/fallback data
  const donationTrends = stats?.donationTrends || [
    { month: 'Jan', amount: 0, donors: 0 },
    { month: 'Feb', amount: 0, donors: 0 },
    { month: 'Mar', amount: 0, donors: 0 },
    { month: 'Apr', amount: 0, donors: 0 },
    { month: 'May', amount: 0, donors: 0 },
    { month: 'Jun', amount: 0, donors: 0 },
  ];

  const donationMethods = stats?.donationMethods || [
    { name: 'Bank Transfer', value: 0, color: '#3B82F6' },
    { name: 'Card Payment', value: 0, color: '#10B981' },
    { name: 'Cryptocurrency', value: 0, color: '#F59E0B' },
    { name: 'Other', value: 0, color: '#EF4444' },
  ];

  const recentActivities = stats?.recentActivities || [];

  const statsCards = [
    {
      title: 'Total Donations',
      value: stats ? `$${stats.totalDonations.toLocaleString()}` : '$0',
      subtitle: stats?.completedCount ? `${stats.completedCount} completed` : undefined,
      change: '+0%',
      trend: 'up',
      icon: Heart,
      color: 'bg-gradient-to-r from-pink-500 to-rose-500'
    },
    {
      title: 'Pending Donations',
      value: stats ? `$${stats.pendingDonations?.toLocaleString() || '0'}` : '$0',
      subtitle: stats?.pendingCount ? `${stats.pendingCount} awaiting verification` : undefined,
      change: '+0%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-gradient-to-r from-orange-500 to-amber-500'
    },
    {
      title: 'Active Donors',
      value: stats ? stats.donorCount.toLocaleString() : '0',
      change: '+0%',
      trend: 'up',
      icon: Users,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    {
      title: 'Monthly Revenue',
      value: stats ? `$${stats.monthlyDonations.toLocaleString()}` : '$0',
      change: '+0%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500'
    }
  ];

  const quickActions = [
    {
      title: 'Generate Wallet',
      description: 'Create new crypto wallet address',
      icon: Wallet,
      href: '/admin/wallet-management',
      color: 'bg-gradient-to-r from-purple-500 to-purple-600'
    },
    {
      title: 'View Donations',
      description: 'Check recent donation activity',
      icon: Heart,
      href: '/admin/donations',
      color: 'bg-gradient-to-r from-pink-500 to-rose-500'
    },
    {
      title: 'Manage Users',
      description: 'Add or edit user accounts',
      icon: Users,
      href: '/admin/users',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    {
      title: 'Analytics',
      description: 'View detailed reports',
      icon: TrendingUp,
      href: '/admin/analytics',
      color: 'bg-gradient-to-r from-green-500 to-emerald-500'
    }
  ];

  return (
    <>
      <Head>
        <title>Admin Dashboard - Saintlammy Foundation</title>
        <meta name="description" content="Admin dashboard for managing Saintlammy Foundation operations" />
      </Head>

      <AdminLayout title="Dashboard Overview">
        <style dangerouslySetInnerHTML={{ __html: chartStyles }} />
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    {(stat as any).subtitle && (
                      <p className="text-xs text-gray-400 mt-1">{(stat as any).subtitle}</p>
                    )}
                    {!(stat as any).subtitle && (
                      <div className="flex items-center mt-2">
                        {stat.trend === 'up' ? (
                          <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-400 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${
                          stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {stat.change}
                        </span>
                        <span className="text-gray-400 text-sm ml-1">vs last month</span>
                      </div>
                    )}
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Donation Trends */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Donation Trends</h3>
                <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm">
                  <option>Last 6 months</option>
                  <option>Last year</option>
                  <option>All time</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={donationTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-600" />
                  <XAxis dataKey="month" stroke="#6B7280" className="dark:stroke-gray-400" />
                  <YAxis stroke="#6B7280" className="dark:stroke-gray-400" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--tooltip-bg)',
                      border: '1px solid var(--tooltip-border)',
                      borderRadius: '8px',
                      color: 'var(--tooltip-text)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#3B82F6"
                    fill="url(#donationGradient)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="donationGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Donation Methods */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-6">Donation Methods</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={donationMethods}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {donationMethods.map((entry: { name: string; value: number; color: string }, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--tooltip-bg)',
                      border: '1px solid var(--tooltip-border)',
                      borderRadius: '8px',
                      color: 'var(--tooltip-text)'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                <a href="/admin/donations/transactions" className="text-accent-400 text-sm hover:text-accent-300 transition-colors">
                  View all
                </a>
              </div>
              <div className="space-y-4">
                {recentActivities.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No recent activity</p>
                ) : (
                  recentActivities.map((activity: { id: string; type: string; title: string; description: string; time: string; status?: string; user?: string; amount?: number; method?: string }) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'donation' ?
                          ((activity as any).status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400') :
                        activity.type === 'volunteer' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {activity.type === 'donation' ? <Heart className="w-5 h-5" /> :
                         activity.type === 'volunteer' ? <Users className="w-5 h-5" /> :
                         <Users className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          {activity.user}
                          {activity.type === 'donation' && (
                            <>
                              <span className={(activity as any).status === 'completed' ? 'text-green-400 ml-2' : 'text-orange-400 ml-2'}>
                                donated ${activity.amount?.toLocaleString()}
                              </span>
                              {(activity as any).status === 'pending' && (
                                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                  Pending
                                </span>
                              )}
                              {(activity as any).status === 'completed' && (
                                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                                  Completed
                                </span>
                              )}
                            </>
                          )}
                          {activity.type === 'volunteer' && (
                            <span className="text-blue-400 ml-2">volunteered for {(activity as any).program}</span>
                          )}
                          {activity.type === 'user' && (
                            <span className="text-purple-400 ml-2">{(activity as any).action}</span>
                          )}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {activity.method && `via ${activity.method} • `}{activity.time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <a
                    key={index}
                    href={action.href}
                    className="block p-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{action.title}</p>
                        <p className="text-gray-400 text-xs">{action.description}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-6">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-white">{stats ? `${stats.successRate}%` : '0%'}</p>
                <p className="text-gray-400 text-sm">Donation Success Rate</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-3">
                  <Heart className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-white">{stats ? `₦${(stats.totalDonations / 6).toFixed(0)}K` : '₦0'}</p>
                <p className="text-gray-400 text-sm">Average Monthly Donations</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center mb-3">
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-white">{stats ? (stats.donorCount + stats.volunteerCount).toLocaleString() : '0'}</p>
                <p className="text-gray-400 text-sm">Active Community Members</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;