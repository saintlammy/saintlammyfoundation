import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { getTypedSupabaseClient } from '@/lib/supabase';

interface Report {
  id: string;
  name: string;
  type: 'donation' | 'donor' | 'financial' | 'impact' | 'custom';
  description: string;
  lastGenerated?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'on-demand';
  status: 'ready' | 'generating' | 'scheduled';
  icon: any;
}

interface ReportStats {
  totalReports: number;
  scheduledReports: number;
  generatedThisMonth: number;
  pendingReports: number;
}

const ReportsManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReportStats>({
    totalReports: 0,
    scheduledReports: 0,
    generatedThisMonth: 0,
    pendingReports: 0
  });
  const [selectedType, setSelectedType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('month');

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      setLoading(true);
      // In production, this would fetch from the database
      // For now, using calculated stats
      setStats({
        totalReports: availableReports.length,
        scheduledReports: availableReports.filter(r => r.frequency !== 'on-demand').length,
        generatedThisMonth: 12,
        pendingReports: availableReports.filter(r => r.status === 'scheduled').length
      });
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const availableReports: Report[] = [
    {
      id: '1',
      name: 'Monthly Donation Report',
      type: 'donation',
      description: 'Comprehensive overview of all donations received this month',
      lastGenerated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      frequency: 'monthly',
      status: 'ready',
      icon: DollarSign
    },
    {
      id: '2',
      name: 'Donor Engagement Report',
      type: 'donor',
      description: 'Analysis of donor behavior, retention, and engagement metrics',
      lastGenerated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      frequency: 'weekly',
      status: 'ready',
      icon: Users
    },
    {
      id: '3',
      name: 'Financial Summary',
      type: 'financial',
      description: 'Complete financial overview including income, expenses, and allocations',
      lastGenerated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      frequency: 'monthly',
      status: 'ready',
      icon: TrendingUp
    },
    {
      id: '4',
      name: 'Impact Assessment Report',
      type: 'impact',
      description: 'Detailed analysis of program outcomes and community impact',
      lastGenerated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      frequency: 'quarterly',
      status: 'scheduled',
      icon: Activity
    },
    {
      id: '5',
      name: 'Annual Tax Report',
      type: 'financial',
      description: 'Comprehensive annual report for tax and compliance purposes',
      frequency: 'annual',
      status: 'scheduled',
      icon: FileText
    },
    {
      id: '6',
      name: 'Recurring Donations Analysis',
      type: 'donation',
      description: 'Deep dive into recurring donation patterns and projections',
      lastGenerated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      frequency: 'monthly',
      status: 'ready',
      icon: Clock
    },
    {
      id: '7',
      name: 'Donor Acquisition Report',
      type: 'donor',
      description: 'Analysis of new donor acquisition channels and conversion rates',
      lastGenerated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      frequency: 'weekly',
      status: 'ready',
      icon: Users
    },
    {
      id: '8',
      name: 'Campaign Performance Report',
      type: 'custom',
      description: 'Detailed performance metrics for all active campaigns',
      frequency: 'on-demand',
      status: 'ready',
      icon: TrendingUp
    }
  ];

  const filteredReports = selectedType === 'all'
    ? availableReports
    : availableReports.filter(r => r.type === selectedType);

  const handleGenerateReport = (reportId: string) => {
    // In production, this would trigger report generation
    console.log('Generating report:', reportId);
    alert('Report generation started. You will receive a notification when it\'s ready.');
  };

  const handleDownloadReport = (reportId: string) => {
    // In production, this would download the report file
    console.log('Downloading report:', reportId);
    alert('Report download started.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'generating':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-4 h-4" />;
      case 'generating':
        return <Clock className="w-4 h-4" />;
      case 'scheduled':
        return <Calendar className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <Head>
        <title>Reports Management - Admin Dashboard</title>
        <meta name="description" content="Manage and generate analytics reports" />
      </Head>

      <AdminLayout title="Reports Management">
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Reports</p>
                  <p className="text-2xl font-bold text-white">
                    {loading ? '...' : stats.totalReports}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Scheduled</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {loading ? '...' : stats.scheduledReports}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Generated This Month</p>
                  <p className="text-2xl font-bold text-green-400">
                    {loading ? '...' : stats.generatedThisMonth}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {loading ? '...' : stats.pendingReports}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400 text-sm font-medium">Filters:</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                  <option value="all">All Types</option>
                  <option value="donation">Donation Reports</option>
                  <option value="donor">Donor Reports</option>
                  <option value="financial">Financial Reports</option>
                  <option value="impact">Impact Reports</option>
                  <option value="custom">Custom Reports</option>
                </select>

                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-2 text-center py-12 text-gray-400">
                Loading reports...
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-gray-400">
                No reports found for the selected filters.
              </div>
            ) : (
              filteredReports.map((report) => {
                const IconComponent = report.icon;
                return (
                  <div
                    key={report.id}
                    className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-accent-500 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {report.name}
                          </h3>
                          <p className="text-sm text-gray-400 capitalize">
                            {report.frequency.replace('-', ' ')}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-4">
                      {report.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="w-4 h-4" />
                        Last generated: {formatDate(report.lastGenerated)}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleGenerateReport(report.id)}
                          className="px-3 py-1.5 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          <FileText className="w-4 h-4" />
                          Generate
                        </button>
                        {report.status === 'ready' && report.lastGenerated && (
                          <button
                            onClick={() => handleDownloadReport(report.id)}
                            className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="px-4 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                Create Custom Report
              </button>
              <button className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5" />
                Schedule Report
              </button>
              <button className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Export All Reports
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default ReportsManagement;
