import React, { useState } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Target,
  TrendingUp,
  Users,
  Heart,
  Share2,
  Play,
  Pause,
  Square,
  BarChart3,
  DollarSign,
  Clock,
  MapPin,
  Tag,
  Image,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  XCircle,
  Zap
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Campaign {
  id: string;
  title: string;
  description: string;
  category: 'fundraising' | 'awareness' | 'volunteer' | 'event' | 'emergency';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  targetAmount?: number;
  currentAmount?: number;
  targetReach?: number;
  currentReach?: number;
  startDate: Date;
  endDate?: Date;
  location?: string;
  tags: string[];
  manager: {
    name: string;
    email: string;
    avatar?: string;
  };
  metrics: {
    views: number;
    clicks: number;
    shares: number;
    conversions: number;
    donations?: number;
    volunteers?: number;
    attendees?: number;
  };
  budget?: number;
  spentBudget?: number;
  channels: ('email' | 'social' | 'website' | 'sms' | 'print')[];
  featuredImage?: string;
  createdAt: Date;
  lastUpdated: Date;
}

interface CampaignPerformance {
  date: string;
  views: number;
  clicks: number;
  donations: number;
  amount: number;
}

const AdminCampaigns: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const campaigns: Campaign[] = [
    {
      id: '1',
      title: 'Emergency School Reconstruction',
      description: 'Help us rebuild the damaged school building after recent floods and provide a safe learning environment for 200+ children.',
      category: 'emergency',
      status: 'active',
      priority: 'high',
      targetAmount: 2000000,
      currentAmount: 1450000,
      targetReach: 10000,
      currentReach: 7500,
      startDate: new Date('2024-01-05'),
      endDate: new Date('2024-03-31'),
      location: 'Bayelsa, Nigeria',
      tags: ['education', 'emergency', 'infrastructure'],
      manager: {
        name: 'Sarah Johnson',
        email: 'sarah@saintlammy.org'
      },
      metrics: {
        views: 15420,
        clicks: 2340,
        shares: 890,
        conversions: 340,
        donations: 245,
        volunteers: 12
      },
      budget: 50000,
      spentBudget: 32000,
      channels: ['email', 'social', 'website'],
      featuredImage: '/images/school-reconstruction.jpg',
      createdAt: new Date('2023-12-28'),
      lastUpdated: new Date('2024-01-16')
    },
    {
      id: '2',
      title: 'Winter Clothing Drive 2024',
      description: 'Collecting and distributing warm clothing to homeless individuals and families during the cold season.',
      category: 'fundraising',
      status: 'active',
      priority: 'medium',
      targetAmount: 500000,
      currentAmount: 320000,
      targetReach: 5000,
      currentReach: 3200,
      startDate: new Date('2023-12-01'),
      endDate: new Date('2024-02-29'),
      location: 'Multiple Cities',
      tags: ['clothing', 'homeless', 'winter'],
      manager: {
        name: 'Michael Chen',
        email: 'michael@saintlammy.org'
      },
      metrics: {
        views: 8950,
        clicks: 1540,
        shares: 560,
        conversions: 180,
        donations: 156,
        volunteers: 35
      },
      budget: 25000,
      spentBudget: 18500,
      channels: ['social', 'website', 'email'],
      featuredImage: '/images/winter-clothing.jpg',
      createdAt: new Date('2023-11-15'),
      lastUpdated: new Date('2024-01-15')
    },
    {
      id: '3',
      title: 'Healthcare Awareness Month',
      description: 'Promoting health awareness and providing free medical screenings in underserved communities.',
      category: 'awareness',
      status: 'active',
      priority: 'medium',
      targetReach: 20000,
      currentReach: 12500,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      location: 'Lagos & Abuja',
      tags: ['healthcare', 'awareness', 'community'],
      manager: {
        name: 'Dr. Emma Williams',
        email: 'emma@saintlammy.org'
      },
      metrics: {
        views: 25600,
        clicks: 4200,
        shares: 1200,
        conversions: 850,
        attendees: 680
      },
      budget: 75000,
      spentBudget: 45000,
      channels: ['social', 'website', 'sms', 'print'],
      featuredImage: '/images/healthcare-awareness.jpg',
      createdAt: new Date('2023-12-10'),
      lastUpdated: new Date('2024-01-14')
    },
    {
      id: '4',
      title: 'Annual Charity Gala 2024',
      description: 'Join us for our annual fundraising gala featuring dinner, entertainment, and silent auction.',
      category: 'event',
      status: 'draft',
      priority: 'high',
      targetAmount: 5000000,
      currentAmount: 150000,
      targetReach: 500,
      currentReach: 85,
      startDate: new Date('2024-03-15'),
      endDate: new Date('2024-03-15'),
      location: 'Eko Hotel, Lagos',
      tags: ['gala', 'fundraising', 'networking'],
      manager: {
        name: 'David Brown',
        email: 'david@saintlammy.org'
      },
      metrics: {
        views: 1200,
        clicks: 180,
        shares: 45,
        conversions: 15,
        attendees: 85
      },
      budget: 200000,
      spentBudget: 25000,
      channels: ['email', 'website', 'print'],
      featuredImage: '/images/charity-gala.jpg',
      createdAt: new Date('2024-01-08'),
      lastUpdated: new Date('2024-01-13')
    },
    {
      id: '5',
      title: 'Volunteer Recruitment Drive',
      description: 'Expanding our volunteer network to support various programs and increase community impact.',
      category: 'volunteer',
      status: 'paused',
      priority: 'low',
      targetReach: 1000,
      currentReach: 450,
      startDate: new Date('2023-11-01'),
      location: 'Online & Local Communities',
      tags: ['volunteers', 'recruitment', 'community'],
      manager: {
        name: 'Lisa Anderson',
        email: 'lisa@saintlammy.org'
      },
      metrics: {
        views: 3200,
        clicks: 680,
        shares: 120,
        conversions: 89,
        volunteers: 45
      },
      budget: 15000,
      spentBudget: 8500,
      channels: ['social', 'website'],
      featuredImage: '/images/volunteer-recruitment.jpg',
      createdAt: new Date('2023-10-20'),
      lastUpdated: new Date('2024-01-10')
    }
  ];

  const performanceData: CampaignPerformance[] = [
    { date: '2024-01-10', views: 1200, clicks: 180, donations: 15, amount: 45000 },
    { date: '2024-01-11', views: 1350, clicks: 220, donations: 18, amount: 52000 },
    { date: '2024-01-12', views: 1180, clicks: 195, donations: 22, amount: 68000 },
    { date: '2024-01-13', views: 1450, clicks: 280, donations: 28, amount: 89000 },
    { date: '2024-01-14', views: 1620, clicks: 340, donations: 35, amount: 125000 },
    { date: '2024-01-15', views: 1380, clicks: 290, donations: 25, amount: 78000 },
    { date: '2024-01-16', views: 1500, clicks: 320, donations: 30, amount: 95000 }
  ];

  const statusColors = {
    draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    paused: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const priorityColors = {
    high: 'text-red-400',
    medium: 'text-yellow-400',
    low: 'text-green-400'
  };

  const categoryIcons = {
    fundraising: DollarSign,
    awareness: TrendingUp,
    volunteer: Users,
    event: Calendar,
    emergency: AlertCircle
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || campaign.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || campaign.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + (c.spentBudget || 0), 0);

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const toggleCampaignSelection = (campaignId: string) => {
    setSelectedCampaigns(prev =>
      prev.includes(campaignId)
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedCampaigns(
      selectedCampaigns.length === filteredCampaigns.length
        ? []
        : filteredCampaigns.map(campaign => campaign.id)
    );
  };

  const updateCampaignStatus = (campaignId: string, status: string) => {
    console.log(`Updating campaign ${campaignId} to ${status}`);
  };

  return (
    <>
      <Head>
        <title>Campaign Management - Saintlammy Foundation Admin</title>
        <meta name="description" content="Manage marketing campaigns and track performance" />
      </Head>

      <AdminLayout title="Campaign Management">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Campaign Management</h1>
              <p className="text-gray-400 mt-1">Create and manage marketing campaigns</p>
            </div>
            <button className="flex items-center space-x-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <Plus className="w-4 h-4" />
              <span>Create Campaign</span>
            </button>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Campaigns</p>
                  <p className="text-2xl font-bold text-white mt-1">{totalCampaigns}</p>
                  <p className="text-green-400 text-sm mt-2">{activeCampaigns} active</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Budget</p>
                  <p className="text-2xl font-bold text-white mt-1">₦{totalBudget.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm mt-2">
                    {Math.round((totalSpent / totalBudget) * 100)}% spent
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Reach</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {campaigns.reduce((sum, c) => sum + (c.currentReach || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-blue-400 text-sm mt-2">People reached</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Avg. Conversion</p>
                  <p className="text-2xl font-bold text-white mt-1">18.4%</p>
                  <p className="text-green-400 text-sm mt-2">+2.1% this month</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Campaign Performance</h3>
              <select className="bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
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
                <Area type="monotone" dataKey="views" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="clicks" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                <Area type="monotone" dataKey="donations" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="all">All Categories</option>
                <option value="fundraising">Fundraising</option>
                <option value="awareness">Awareness</option>
                <option value="volunteer">Volunteer</option>
                <option value="event">Event</option>
                <option value="emergency">Emergency</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-50 dark:bg-gray-700 transition-colors"
              >
                {viewMode === 'grid' ? 'List' : 'Grid'}
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedCampaigns.length > 0 && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">
                  {selectedCampaigns.length} campaign{selectedCampaigns.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors">
                    Activate
                  </button>
                  <button className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm transition-colors">
                    Pause
                  </button>
                  <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors">
                    Archive
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Campaigns Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign) => {
                const IconComponent = categoryIcons[campaign.category];
                const progressPercentage = campaign.targetAmount
                  ? getProgressPercentage(campaign.currentAmount || 0, campaign.targetAmount)
                  : campaign.targetReach
                  ? getProgressPercentage(campaign.currentReach || 0, campaign.targetReach)
                  : 0;

                return (
                  <div key={campaign.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors">
                    <div className="relative">
                      <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                        <Image className="w-12 h-12 text-gray-500" />
                      </div>
                      <div className="absolute top-4 left-4">
                        <input
                          type="checkbox"
                          checked={selectedCampaigns.includes(campaign.id)}
                          onChange={() => toggleCampaignSelection(campaign.id)}
                          className="rounded border-gray-600 bg-gray-50 dark:bg-gray-700 text-accent-500 focus:ring-accent-500 focus:ring-offset-gray-800"
                        />
                      </div>
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[campaign.status]}`}>
                          {campaign.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[campaign.priority]} bg-gray-800 border border-gray-600`}>
                          {campaign.priority}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="w-5 h-5 text-accent-400" />
                          <span className="text-accent-400 text-sm capitalize">{campaign.category}</span>
                        </div>
                        <button className="text-gray-400 hover:text-gray-300">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="text-white font-semibold mb-2">{campaign.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{campaign.description}</p>

                      {(campaign.targetAmount || campaign.targetReach) && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">
                              {campaign.targetAmount ? 'Funding' : 'Reach'} Progress
                            </span>
                            <span className="text-white">{Math.round(progressPercentage)}%</span>
                          </div>
                          <div className="w-full bg-gray-50 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-accent-500 to-accent-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span className="text-gray-500">
                              {campaign.targetAmount
                                ? `₦${(campaign.currentAmount || 0).toLocaleString()}`
                                : `${(campaign.currentReach || 0).toLocaleString()} people`
                              }
                            </span>
                            <span className="text-gray-500">
                              {campaign.targetAmount
                                ? `₦${campaign.targetAmount.toLocaleString()}`
                                : `${campaign.targetReach?.toLocaleString()} people`
                              }
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{campaign.metrics.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>{campaign.metrics.clicks.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Share2 className="w-4 h-4" />
                            <span>{campaign.metrics.shares}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {campaign.manager.name.charAt(0)}
                            </span>
                          </div>
                          <span className="text-gray-300 text-sm">{campaign.manager.name}</span>
                        </div>
                        <div className="flex space-x-2">
                          {campaign.status === 'draft' && (
                            <button
                              onClick={() => updateCampaignStatus(campaign.id, 'active')}
                              className="p-1 text-gray-400 hover:text-green-400 transition-colors"
                              title="Start Campaign"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          )}
                          {campaign.status === 'active' && (
                            <button
                              onClick={() => updateCampaignStatus(campaign.id, 'paused')}
                              className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                              title="Pause Campaign"
                            >
                              <Pause className="w-4 h-4" />
                            </button>
                          )}
                          <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedCampaigns.length === filteredCampaigns.length}
                          onChange={toggleSelectAll}
                          className="rounded border-gray-600 bg-gray-50 dark:bg-gray-700 text-accent-500 focus:ring-accent-500 focus:ring-offset-gray-800"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Campaign
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Manager
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredCampaigns.map((campaign) => {
                      const IconComponent = categoryIcons[campaign.category];
                      const progressPercentage = campaign.targetAmount
                        ? getProgressPercentage(campaign.currentAmount || 0, campaign.targetAmount)
                        : campaign.targetReach
                        ? getProgressPercentage(campaign.currentReach || 0, campaign.targetReach)
                        : 0;

                      return (
                        <tr key={campaign.id} className="hover:bg-gray-50 dark:bg-gray-700 transition-colors">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedCampaigns.includes(campaign.id)}
                              onChange={() => toggleCampaignSelection(campaign.id)}
                              className="rounded border-gray-600 bg-gray-50 dark:bg-gray-700 text-accent-500 focus:ring-accent-500 focus:ring-offset-gray-800"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-white font-medium">{campaign.title}</p>
                              <p className="text-gray-400 text-sm">{campaign.location}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <IconComponent className="w-4 h-4 text-accent-400" />
                              <span className="text-gray-300 capitalize">{campaign.category}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[campaign.status]}`}>
                              {campaign.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {(campaign.targetAmount || campaign.targetReach) ? (
                              <div className="w-24">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-400">{Math.round(progressPercentage)}%</span>
                                </div>
                                <div className="w-full bg-gray-50 dark:bg-gray-700 rounded-full h-1.5">
                                  <div
                                    className="bg-gradient-to-r from-accent-500 to-accent-600 h-1.5 rounded-full"
                                    style={{ width: `${progressPercentage}%` }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-300 text-sm">
                              <div>{campaign.metrics.views.toLocaleString()} views</div>
                              <div className="text-gray-500">{campaign.metrics.clicks} clicks</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-medium">
                                  {campaign.manager.name.charAt(0)}
                                </span>
                              </div>
                              <span className="text-gray-300 text-sm">{campaign.manager.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-red-400 transition-colors">
                                <Trash2 className="w-4 h-4" />
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
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-sm">
              Showing {filteredCampaigns.length} of {campaigns.length} campaigns
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300 hover:bg-gray-50 dark:bg-gray-700 transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 bg-accent-500 text-white rounded">
                1
              </button>
              <button className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300 hover:bg-gray-50 dark:bg-gray-700 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminCampaigns;