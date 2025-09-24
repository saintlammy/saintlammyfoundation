import React, { useState } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Plus,
  Search,
  Filter,
  Send,
  Edit,
  Trash2,
  Eye,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Globe,
  Calendar,
  Clock,
  Users,
  Target,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Pause,
  Play,
  Copy,
  Download,
  MoreHorizontal,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'email' | 'sms' | 'push' | 'in-app';
  category: 'donation' | 'volunteer' | 'program' | 'general' | 'emergency';
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  priority: 'high' | 'medium' | 'low';
  recipients: {
    type: 'all' | 'donors' | 'volunteers' | 'specific' | 'segment';
    count: number;
    criteria?: string;
  };
  scheduledFor?: Date;
  sentAt?: Date;
  createdAt: Date;
  author: {
    name: string;
    email: string;
  };
  metrics?: {
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
  template?: string;
  attachments?: string[];
}

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'email' | 'sms' | 'push';
  category: string;
  isActive: boolean;
  usageCount: number;
  lastUsed?: Date;
  createdAt: Date;
}

const AdminNotifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'templates' | 'settings'>('notifications');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Monthly Newsletter - January 2024',
      message: 'Your monthly update on our programs, impact stories, and upcoming events.',
      type: 'email',
      category: 'general',
      status: 'sent',
      priority: 'medium',
      recipients: { type: 'all', count: 2450 },
      sentAt: new Date('2024-01-15T09:00:00'),
      createdAt: new Date('2024-01-14'),
      author: { name: 'Sarah Johnson', email: 'sarah@saintlammy.org' },
      metrics: {
        delivered: 2445,
        opened: 1856,
        clicked: 342,
        bounced: 5,
        unsubscribed: 12
      },
      template: 'newsletter-template'
    },
    {
      id: '2',
      title: 'Emergency School Reconstruction Campaign',
      message: 'Urgent: Help us rebuild the school damaged by recent floods. Every donation counts.',
      type: 'email',
      category: 'emergency',
      status: 'sent',
      priority: 'high',
      recipients: { type: 'donors', count: 1245 },
      sentAt: new Date('2024-01-10T14:30:00'),
      createdAt: new Date('2024-01-10'),
      author: { name: 'Michael Chen', email: 'michael@saintlammy.org' },
      metrics: {
        delivered: 1242,
        opened: 1089,
        clicked: 456,
        bounced: 3,
        unsubscribed: 8
      }
    },
    {
      id: '3',
      title: 'Volunteer Training Reminder',
      message: 'Don\'t forget about tomorrow\'s training session at 2 PM. Location details attached.',
      type: 'sms',
      category: 'volunteer',
      status: 'sent',
      priority: 'medium',
      recipients: { type: 'volunteers', count: 45 },
      sentAt: new Date('2024-01-14T16:00:00'),
      createdAt: new Date('2024-01-14'),
      author: { name: 'Emma Williams', email: 'emma@saintlammy.org' },
      metrics: {
        delivered: 45,
        opened: 42,
        clicked: 0,
        bounced: 0,
        unsubscribed: 1
      }
    },
    {
      id: '4',
      title: 'New Healthcare Program Launch',
      message: 'We\'re excited to announce the launch of our new mobile health clinic serving remote communities.',
      type: 'push',
      category: 'program',
      status: 'scheduled',
      priority: 'medium',
      recipients: { type: 'all', count: 3200 },
      scheduledFor: new Date('2024-01-20T10:00:00'),
      createdAt: new Date('2024-01-16'),
      author: { name: 'David Brown', email: 'david@saintlammy.org' }
    },
    {
      id: '5',
      title: 'Donation Receipt & Thank You',
      message: 'Thank you for your generous donation! Here\'s your receipt and impact update.',
      type: 'email',
      category: 'donation',
      status: 'draft',
      priority: 'low',
      recipients: { type: 'specific', count: 1 },
      createdAt: new Date('2024-01-16'),
      author: { name: 'Lisa Anderson', email: 'lisa@saintlammy.org' },
      template: 'donation-receipt-template'
    }
  ];

  const templates: NotificationTemplate[] = [
    {
      id: '1',
      name: 'Monthly Newsletter',
      subject: 'Your Monthly Update from Saintlammy Foundation',
      content: 'Dear {{name}}, here\'s your monthly update...',
      type: 'email',
      category: 'general',
      isActive: true,
      usageCount: 12,
      lastUsed: new Date('2024-01-15'),
      createdAt: new Date('2023-06-01')
    },
    {
      id: '2',
      name: 'Donation Thank You',
      subject: 'Thank you for your generous donation!',
      content: 'Dear {{name}}, thank you for your donation of {{amount}}...',
      type: 'email',
      category: 'donation',
      isActive: true,
      usageCount: 156,
      lastUsed: new Date('2024-01-16'),
      createdAt: new Date('2023-05-15')
    },
    {
      id: '3',
      name: 'Volunteer Welcome',
      subject: 'Welcome to our volunteer family!',
      content: 'Welcome {{name}}! We\'re excited to have you join...',
      type: 'email',
      category: 'volunteer',
      isActive: true,
      usageCount: 34,
      lastUsed: new Date('2024-01-12'),
      createdAt: new Date('2023-07-20')
    },
    {
      id: '4',
      name: 'Emergency Alert SMS',
      subject: '',
      content: 'URGENT: {{message}} - Saintlammy Foundation',
      type: 'sms',
      category: 'emergency',
      isActive: true,
      usageCount: 8,
      lastUsed: new Date('2024-01-10'),
      createdAt: new Date('2023-09-01')
    }
  ];

  const typeColors = {
    email: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    sms: 'bg-green-500/20 text-green-400 border-green-500/30',
    push: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'in-app': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  };

  const statusColors = {
    draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    sent: 'bg-green-500/20 text-green-400 border-green-500/30',
    failed: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const priorityColors = {
    high: 'text-red-400',
    medium: 'text-yellow-400',
    low: 'text-green-400'
  };

  const typeIcons = {
    email: Mail,
    sms: MessageSquare,
    push: Bell,
    'in-app': Volume2
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || notification.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || notification.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalNotifications = notifications.length;
  const sentNotifications = notifications.filter(n => n.status === 'sent').length;
  const scheduledNotifications = notifications.filter(n => n.status === 'scheduled').length;
  const totalRecipients = notifications.reduce((sum, n) => sum + n.recipients.count, 0);

  const toggleNotificationSelection = (notificationId: string) => {
    setSelectedNotifications(prev =>
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedNotifications(
      selectedNotifications.length === filteredNotifications.length
        ? []
        : filteredNotifications.map(notification => notification.id)
    );
  };

  const getDeliveryRate = (metrics: any) => {
    if (!metrics) return 0;
    return Math.round((metrics.delivered / (metrics.delivered + metrics.bounced)) * 100);
  };

  const getOpenRate = (metrics: any) => {
    if (!metrics) return 0;
    return Math.round((metrics.opened / metrics.delivered) * 100);
  };

  const getClickRate = (metrics: any) => {
    if (!metrics) return 0;
    return Math.round((metrics.clicked / metrics.delivered) * 100);
  };

  return (
    <>
      <Head>
        <title>Notification Management - Saintlammy Foundation Admin</title>
        <meta name="description" content="Manage notifications, messages and communication" />
      </Head>

      <AdminLayout title="Notification Management">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Notification Management</h1>
              <p className="text-gray-400 mt-1">Manage notifications, messages and communication</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Notification</span>
            </button>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Notifications</p>
                  <p className="text-2xl font-bold text-white mt-1">{totalNotifications}</p>
                  <p className="text-green-400 text-sm mt-2">{sentNotifications} sent</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Recipients</p>
                  <p className="text-2xl font-bold text-white mt-1">{totalRecipients.toLocaleString()}</p>
                  <p className="text-blue-400 text-sm mt-2">Reached this month</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Scheduled</p>
                  <p className="text-2xl font-bold text-white mt-1">{scheduledNotifications}</p>
                  <p className="text-yellow-400 text-sm mt-2">Pending delivery</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Avg. Open Rate</p>
                  <p className="text-2xl font-bold text-white mt-1">76%</p>
                  <p className="text-green-400 text-sm mt-2">+3% this month</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'notifications'
                    ? 'border-accent-500 text-accent-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Notifications ({totalNotifications})
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'templates'
                    ? 'border-accent-500 text-accent-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Templates ({templates.length})
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'settings'
                    ? 'border-accent-500 text-accent-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Settings
              </button>
            </nav>
          </div>

          {activeTab === 'notifications' && (
            <>
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    <option value="all">All Types</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="push">Push</option>
                    <option value="in-app">In-App</option>
                  </select>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="sent">Sent</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedNotifications.length > 0 && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">
                      {selectedNotifications.length} notification{selectedNotifications.length !== 1 ? 's' : ''} selected
                    </span>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
                        Send Now
                      </button>
                      <button className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm transition-colors">
                        Schedule
                      </button>
                      <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications List */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedNotifications.length === filteredNotifications.length}
                            onChange={toggleSelectAll}
                            className="rounded border-gray-600 bg-gray-700 text-accent-500 focus:ring-accent-500 focus:ring-offset-gray-800"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Notification
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Recipients
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Performance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filteredNotifications.map((notification) => {
                        const TypeIcon = typeIcons[notification.type];

                        return (
                          <tr key={notification.id} className="hover:bg-gray-700 transition-colors">
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedNotifications.includes(notification.id)}
                                onChange={() => toggleNotificationSelection(notification.id)}
                                className="rounded border-gray-600 bg-gray-700 text-accent-500 focus:ring-accent-500 focus:ring-offset-gray-800"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-white font-medium">{notification.title}</p>
                                <p className="text-gray-400 text-sm line-clamp-2">{notification.message}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className={`text-xs ${priorityColors[notification.priority]}`}>
                                    {notification.priority} priority
                                  </span>
                                  <span className="text-gray-500">•</span>
                                  <span className="text-gray-500 text-xs capitalize">{notification.category}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <TypeIcon className="w-4 h-4 text-accent-400" />
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeColors[notification.type]}`}>
                                  {notification.type.toUpperCase()}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[notification.status]}`}>
                                {notification.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-white font-medium">{notification.recipients.count.toLocaleString()}</p>
                                <p className="text-gray-400 text-sm capitalize">{notification.recipients.type}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {notification.metrics ? (
                                <div className="text-sm">
                                  <div className="flex items-center space-x-3 text-gray-300">
                                    <span>{getDeliveryRate(notification.metrics)}% delivered</span>
                                    <span>{getOpenRate(notification.metrics)}% opened</span>
                                  </div>
                                  <div className="flex items-center space-x-3 text-gray-500 text-xs mt-1">
                                    <span>{notification.metrics.clicked} clicks</span>
                                    {notification.metrics.unsubscribed > 0 && (
                                      <span>{notification.metrics.unsubscribed} unsub</span>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-gray-300 text-sm">
                                {notification.sentAt ? (
                                  <>
                                    <div>Sent</div>
                                    <div className="text-gray-500 text-xs">{notification.sentAt.toLocaleDateString()}</div>
                                  </>
                                ) : notification.scheduledFor ? (
                                  <>
                                    <div>Scheduled</div>
                                    <div className="text-gray-500 text-xs">{notification.scheduledFor.toLocaleDateString()}</div>
                                  </>
                                ) : (
                                  <>
                                    <div>Created</div>
                                    <div className="text-gray-500 text-xs">{notification.createdAt.toLocaleDateString()}</div>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                                  <Eye className="w-4 h-4" />
                                </button>
                                {notification.status === 'draft' && (
                                  <>
                                    <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button className="p-1 text-gray-400 hover:text-blue-400 transition-colors">
                                      <Send className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                                {notification.status === 'scheduled' && (
                                  <button className="p-1 text-gray-400 hover:text-red-400 transition-colors">
                                    <Pause className="w-4 h-4" />
                                  </button>
                                )}
                                <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-gray-400">Manage notification templates for consistent messaging</p>
                <button className="flex items-center space-x-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Create Template</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => {
                  const TypeIcon = typeIcons[template.type];
                  return (
                    <div key={template.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <TypeIcon className="w-5 h-5 text-accent-400" />
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeColors[template.type]}`}>
                            {template.type.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {template.isActive ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                          <button className="text-gray-400 hover:text-gray-300">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-white font-semibold mb-2">{template.name}</h3>
                      {template.subject && (
                        <p className="text-gray-400 text-sm mb-2">Subject: {template.subject}</p>
                      )}
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">{template.content}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Used {template.usageCount} times</span>
                        {template.lastUsed && (
                          <span>Last: {template.lastUsed.toLocaleDateString()}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <span className="text-accent-400 text-sm capitalize">{template.category}</span>
                        <div className="flex space-x-2">
                          <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email Settings */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Mail className="w-5 h-5 text-accent-400" />
                    <h3 className="text-lg font-semibold text-white">Email Settings</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">SMTP Server</label>
                      <input
                        type="text"
                        value="smtp.saintlammy.org"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">From Name</label>
                      <input
                        type="text"
                        value="Saintlammy Foundation"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">From Email</label>
                      <input
                        type="email"
                        value="noreply@saintlammy.org"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Enable email tracking</span>
                      <button className="bg-accent-500 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* SMS Settings */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <MessageSquare className="w-5 h-5 text-accent-400" />
                    <h3 className="text-lg font-semibold text-white">SMS Settings</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">SMS Provider</label>
                      <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500">
                        <option>Twilio</option>
                        <option>AWS SNS</option>
                        <option>Nexmo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">From Number</label>
                      <input
                        type="text"
                        value="+1 (555) 123-4567"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">SMS Credits Remaining</label>
                      <div className="bg-gray-700 rounded-lg px-3 py-2 text-white">
                        8,543 credits
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Enable SMS delivery reports</span>
                      <button className="bg-accent-500 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Push Notification Settings */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Bell className="w-5 h-5 text-accent-400" />
                    <h3 className="text-lg font-semibold text-white">Push Notifications</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Firebase Server Key</label>
                      <input
                        type="password"
                        value="••••••••••••••••••••••••••••••••"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">App Package Name</label>
                      <input
                        type="text"
                        value="org.saintlammy.foundation"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Enable push notifications</span>
                      <button className="bg-accent-500 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* General Settings */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Settings className="w-5 h-5 text-accent-400" />
                    <h3 className="text-lg font-semibold text-white">General Settings</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Auto-retry failed notifications</span>
                      <button className="bg-accent-500 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Send delivery reports</span>
                      <button className="bg-accent-500 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Enable unsubscribe link</span>
                      <button className="bg-accent-500 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Default timezone</label>
                      <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500">
                        <option>Africa/Lagos (GMT+1)</option>
                        <option>UTC (GMT+0)</option>
                        <option>America/New_York (GMT-5)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {activeTab === 'notifications' && (
            <div className="flex items-center justify-between">
              <div className="text-gray-400 text-sm">
                Showing {filteredNotifications.length} of {notifications.length} notifications
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300 hover:bg-gray-700 transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1 bg-accent-500 text-white rounded">
                  1
                </button>
                <button className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300 hover:bg-gray-700 transition-colors">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminNotifications;