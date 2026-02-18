import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  DollarSign,
  Users,
  Mail,
  Calendar,
  TrendingUp,
  X,
  Eye,
  Trash2,
  Filter,
  Clock
} from 'lucide-react';
import { getTypedSupabaseClient } from '@/lib/supabase';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  category: 'donation' | 'user' | 'system' | 'event' | 'message';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

interface NotificationStats {
  unreadCount: number;
  totalToday: number;
  successCount: number;
  warningCount: number;
}

const NotificationsManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    unreadCount: 0,
    totalToday: 0,
    successCount: 0,
    warningCount: 0
  });
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const client = getTypedSupabaseClient();

      // In production, fetch from database
      // const { data, error } = await client.from('notifications').select('*').order('timestamp', { ascending: false });

      // Using fallback data
      await new Promise(resolve => setTimeout(resolve, 500));

      const allNotifications: Notification[] = [
        {
          id: '1',
          type: 'success',
          category: 'donation',
          title: 'New Donation Received',
          message: 'John Doe donated ₦50,000 to the Educational Excellence program',
          timestamp: new Date().toISOString(),
          read: false,
          actionUrl: '/admin/donations'
        },
        {
          id: '2',
          type: 'info',
          category: 'user',
          title: 'New Volunteer Application',
          message: 'Jane Smith submitted a volunteer application for community outreach',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          read: false,
          actionUrl: '/admin/volunteers'
        },
        {
          id: '3',
          type: 'warning',
          category: 'system',
          title: 'Payment Gateway Issue',
          message: 'Temporary connectivity issue with payment gateway. Monitoring the situation.',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          read: false
        },
        {
          id: '4',
          type: 'success',
          category: 'donation',
          title: 'Recurring Donation Processed',
          message: 'Monthly donation of ₦25,000 from Sarah Johnson processed successfully',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: true,
          actionUrl: '/admin/donations/recurring'
        },
        {
          id: '5',
          type: 'info',
          category: 'message',
          title: 'New Message Received',
          message: 'Partnership inquiry from ABC Corporation',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          read: true,
          actionUrl: '/admin/communications/messages'
        },
        {
          id: '6',
          type: 'success',
          category: 'event',
          title: 'Event Registration',
          message: '15 new registrations for upcoming community outreach event',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          read: true,
          actionUrl: '/admin/events'
        },
        {
          id: '7',
          type: 'error',
          category: 'donation',
          title: 'Failed Payment',
          message: 'Payment of ₦10,000 failed - insufficient funds. Donor notified.',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          read: true
        },
        {
          id: '8',
          type: 'warning',
          category: 'system',
          title: 'Database Backup Needed',
          message: 'Last backup was 6 days ago. Schedule backup soon.',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          read: true
        },
        {
          id: '9',
          type: 'info',
          category: 'user',
          title: 'User Account Created',
          message: 'New admin account created for Michael Brown',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          read: true,
          actionUrl: '/admin/users/admins'
        },
        {
          id: '10',
          type: 'success',
          category: 'donation',
          title: 'Campaign Milestone',
          message: 'Healthcare Access campaign reached 75% of funding goal!',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          read: true,
          actionUrl: '/admin/campaigns'
        }
      ];

      setNotifications(allNotifications);

      // Calculate stats
      const unreadCount = allNotifications.filter(n => !n.read).length;
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const totalToday = allNotifications.filter(n => new Date(n.timestamp) >= todayStart).length;
      const successCount = allNotifications.filter(n => n.type === 'success').length;
      const warningCount = allNotifications.filter(n => n.type === 'warning' || n.type === 'error').length;

      setStats({
        unreadCount,
        totalToday,
        successCount,
        warningCount
      });

    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filterType !== 'all' && notification.type !== filterType) return false;
    if (filterCategory !== 'all' && notification.category !== filterCategory) return false;
    return true;
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
    setStats({ ...stats, unreadCount: stats.unreadCount - 1 });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setStats({ ...stats, unreadCount: 0 });
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.read) {
      setStats({ ...stats, unreadCount: stats.unreadCount - 1 });
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
      setStats({ unreadCount: 0, totalToday: 0, successCount: 0, warningCount: 0 });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'donation':
        return <DollarSign className="w-4 h-4" />;
      case 'user':
        return <Users className="w-4 h-4" />;
      case 'message':
        return <Mail className="w-4 h-4" />;
      case 'event':
        return <Calendar className="w-4 h-4" />;
      case 'system':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationBgColor = (type: string, read: boolean) => {
    if (read) return 'bg-gray-700/30';

    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'bg-gray-700/30';
    }
  };

  return (
    <>
      <Head>
        <title>Notifications Management - Admin Dashboard</title>
        <meta name="description" content="Manage and view system notifications" />
      </Head>

      <AdminLayout title="Notifications Management">
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Unread</p>
                <Bell className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-white">
                {loading ? '...' : stats.unreadCount}
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Today</p>
                <Clock className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-white">
                {loading ? '...' : stats.totalToday}
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Success</p>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-white">
                {loading ? '...' : stats.successCount}
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Warnings</p>
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-white">
                {loading ? '...' : stats.warningCount}
              </p>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-300">Filters:</span>
                </div>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                  <option value="all">All Types</option>
                  <option value="success">Success</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                  <option value="all">All Categories</option>
                  <option value="donation">Donations</option>
                  <option value="user">Users</option>
                  <option value="message">Messages</option>
                  <option value="event">Events</option>
                  <option value="system">System</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={stats.unreadCount === 0}
                  className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mark All Read
                </button>
                <button
                  onClick={handleClearAll}
                  disabled={notifications.length === 0}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Recent Notifications ({filteredNotifications.length})
              </h3>

              {loading ? (
                <div className="text-center py-12 text-gray-400">
                  Loading notifications...
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Bell className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>No notifications found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border border-gray-600 transition-all ${getNotificationBgColor(notification.type, notification.read)}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              <h4 className={`font-semibold text-white ${!notification.read ? 'font-bold' : ''}`}>
                                {notification.title}
                              </h4>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-300 text-xs rounded-full">
                                {getCategoryIcon(notification.category)}
                                {notification.category}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>

                          <p className="text-sm text-gray-300 mb-3">
                            {notification.message}
                          </p>

                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium transition-colors flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                Mark as Read
                              </button>
                            )}
                            {notification.actionUrl && (
                              <button className="px-3 py-1 bg-accent-500 hover:bg-accent-600 text-white rounded text-xs font-medium transition-colors">
                                View Details
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(notification.id)}
                              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs font-medium transition-colors flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default NotificationsManagement;
