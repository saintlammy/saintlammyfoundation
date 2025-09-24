import React, { useState } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Download,
  Calendar,
  Filter,
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Heart,
  DollarSign,
  Clock,
  Eye,
  Share,
  RefreshCw,
  Settings,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  FileImage,
  FilePdf
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Report {
  id: string;
  name: string;
  description: string;
  category: 'financial' | 'programs' | 'users' | 'donations' | 'analytics' | 'impact';
  type: 'standard' | 'custom';
  lastGenerated?: Date;
  frequency: 'manual' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  status: 'ready' | 'generating' | 'scheduled';
  size?: string;
  downloadCount: number;
  formats: ('pdf' | 'excel' | 'csv' | 'json')[];
  isAutomated: boolean;
}

interface ReportData {
  donationsByMonth: Array<{ month: string; amount: number; donors: number }>;
  programFunding: Array<{ name: string; funded: number; target: number; percentage: number }>;
  donationMethods: Array<{ name: string; value: number; color: string }>;
  beneficiariesByProgram: Array<{ program: string; beneficiaries: number; target: number }>;
}

const AdminReports: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [showCustomReport, setShowCustomReport] = useState(false);
  const [generatingReports, setGeneratingReports] = useState<string[]>([]);

  const reports: Report[] = [
    {
      id: '1',
      name: 'Monthly Financial Report',
      description: 'Comprehensive financial overview including donations, expenses, and fund allocation',
      category: 'financial',
      type: 'standard',
      lastGenerated: new Date('2024-01-15'),
      frequency: 'monthly',
      status: 'ready',
      size: '2.4 MB',
      downloadCount: 45,
      formats: ['pdf', 'excel'],
      isAutomated: true
    },
    {
      id: '2',
      name: 'Donor Activity Analysis',
      description: 'Detailed analysis of donor behavior, retention rates, and giving patterns',
      category: 'donations',
      type: 'standard',
      lastGenerated: new Date('2024-01-14'),
      frequency: 'weekly',
      status: 'ready',
      size: '1.8 MB',
      downloadCount: 32,
      formats: ['pdf', 'csv', 'excel'],
      isAutomated: true
    },
    {
      id: '3',
      name: 'Program Impact Assessment',
      description: 'Evaluation of program effectiveness, beneficiary outcomes, and resource utilization',
      category: 'programs',
      type: 'standard',
      lastGenerated: new Date('2024-01-12'),
      frequency: 'quarterly',
      status: 'ready',
      size: '4.2 MB',
      downloadCount: 18,
      formats: ['pdf', 'excel'],
      isAutomated: true
    },
    {
      id: '4',
      name: 'User Engagement Report',
      description: 'Website analytics, user behavior, and community engagement metrics',
      category: 'analytics',
      type: 'standard',
      lastGenerated: new Date('2024-01-13'),
      frequency: 'weekly',
      status: 'ready',
      size: '1.2 MB',
      downloadCount: 28,
      formats: ['pdf', 'csv'],
      isAutomated: true
    },
    {
      id: '5',
      name: 'Volunteer Management Report',
      description: 'Volunteer participation, hours contributed, and program involvement',
      category: 'users',
      type: 'standard',
      lastGenerated: new Date('2024-01-11'),
      frequency: 'monthly',
      status: 'ready',
      size: '956 KB',
      downloadCount: 15,
      formats: ['pdf', 'excel'],
      isAutomated: false
    },
    {
      id: '6',
      name: 'Crypto Donations Analysis',
      description: 'Cryptocurrency donation trends, wallet performance, and blockchain analytics',
      category: 'donations',
      type: 'custom',
      lastGenerated: new Date('2024-01-10'),
      frequency: 'manual',
      status: 'ready',
      size: '3.1 MB',
      downloadCount: 22,
      formats: ['pdf', 'json', 'excel'],
      isAutomated: false
    },
    {
      id: '7',
      name: 'Annual Impact Summary',
      description: 'Comprehensive yearly overview of foundation achievements and impact metrics',
      category: 'impact',
      type: 'standard',
      frequency: 'yearly',
      status: 'generating',
      downloadCount: 8,
      formats: ['pdf', 'excel'],
      isAutomated: true
    }
  ];

  const reportData: ReportData = {
    donationsByMonth: [
      { month: 'Aug', amount: 65000, donors: 120 },
      { month: 'Sep', amount: 78000, donors: 145 },
      { month: 'Oct', amount: 92000, donors: 170 },
      { month: 'Nov', amount: 88000, donors: 165 },
      { month: 'Dec', amount: 105000, donors: 190 },
      { month: 'Jan', amount: 125000, donors: 220 },
    ],
    programFunding: [
      { name: 'Education', funded: 325000, target: 500000, percentage: 65 },
      { name: 'Healthcare', funded: 450000, target: 750000, percentage: 60 },
      { name: 'Orphanage', funded: 680000, target: 1000000, percentage: 68 },
      { name: 'Emergency', funded: 200000, target: 200000, percentage: 100 },
      { name: 'Community', funded: 150000, target: 800000, percentage: 19 },
    ],
    donationMethods: [
      { name: 'Bank Transfer', value: 45, color: '#3B82F6' },
      { name: 'Credit Card', value: 30, color: '#10B981' },
      { name: 'Cryptocurrency', value: 20, color: '#F59E0B' },
      { name: 'International', value: 5, color: '#EF4444' },
    ],
    beneficiariesByProgram: [
      { program: 'Education', beneficiaries: 45, target: 60 },
      { program: 'Healthcare', beneficiaries: 120, target: 200 },
      { program: 'Orphanage', beneficiaries: 25, target: 40 },
      { program: 'Community', beneficiaries: 0, target: 300 },
    ]
  };

  const categoryIcons = {
    financial: DollarSign,
    programs: BarChart3,
    users: Users,
    donations: Heart,
    analytics: TrendingUp,
    impact: CheckCircle
  };

  const formatIcons = {
    pdf: FilePdf,
    excel: FileSpreadsheet,
    csv: FileSpreadsheet,
    json: FileText
  };

  const filteredReports = reports.filter(report => {
    return selectedCategory === 'all' || report.category === selectedCategory;
  });

  const generateReport = (reportId: string) => {
    setGeneratingReports(prev => [...prev, reportId]);
    // Simulate report generation
    setTimeout(() => {
      setGeneratingReports(prev => prev.filter(id => id !== reportId));
    }, 3000);
  };

  const downloadReport = (reportId: string, format: string) => {
    console.log(`Downloading report ${reportId} in ${format} format`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-400';
      case 'generating': return 'text-yellow-400';
      case 'scheduled': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'generating': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'scheduled': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <>
      <Head>
        <title>Reports & Analytics - Saintlammy Foundation Admin</title>
        <meta name="description" content="Generate and export comprehensive reports" />
      </Head>

      <AdminLayout title="Reports & Analytics">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
              <p className="text-gray-400 mt-1">Generate comprehensive reports and export data</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCustomReport(true)}
                className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Custom Report</span>
              </button>
              <button className="flex items-center space-x-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                <Download className="w-4 h-4" />
                <span>Bulk Export</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Reports</p>
                  <p className="text-2xl font-bold text-white mt-1">{reports.length}</p>
                  <p className="text-green-400 text-sm mt-2">{reports.filter(r => r.status === 'ready').length} ready</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Downloads Today</p>
                  <p className="text-2xl font-bold text-white mt-1">24</p>
                  <p className="text-green-400 text-sm mt-2">+18% from yesterday</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <Download className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Automated Reports</p>
                  <p className="text-2xl font-bold text-white mt-1">{reports.filter(r => r.isAutomated).length}</p>
                  <p className="text-blue-400 text-sm mt-2">Running scheduled</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Storage Used</p>
                  <p className="text-2xl font-bold text-white mt-1">28.4 MB</p>
                  <p className="text-gray-400 text-sm mt-2">12% of allocated space</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Filter and Date Range */}
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option value="all">All Categories</option>
              <option value="financial">Financial</option>
              <option value="programs">Programs</option>
              <option value="users">Users</option>
              <option value="donations">Donations</option>
              <option value="analytics">Analytics</option>
              <option value="impact">Impact</option>
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option value="last-7-days">Last 7 days</option>
              <option value="last-30-days">Last 30 days</option>
              <option value="last-90-days">Last 90 days</option>
              <option value="this-year">This year</option>
              <option value="all-time">All time</option>
            </select>
          </div>

          {/* Quick Analytics Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Donation Trends</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={reportData.donationsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Program Funding Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={reportData.programFunding}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="percentage" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Reports List */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Available Reports</h3>
            </div>
            <div className="divide-y divide-gray-700">
              {filteredReports.map((report) => {
                const IconComponent = categoryIcons[report.category];
                const isGenerating = generatingReports.includes(report.id);

                return (
                  <div key={report.id} className="p-6 hover:bg-gray-700 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-lg">
                          <IconComponent className="w-6 h-6 text-accent-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-white font-medium">{report.name}</h4>
                            <span className={`flex items-center space-x-1 ${getStatusColor(report.status)}`}>
                              {getStatusIcon(report.status)}
                              <span className="text-xs capitalize">{report.status}</span>
                            </span>
                            {report.isAutomated && (
                              <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                                Automated
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mt-1">{report.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span className="capitalize">{report.category}</span>
                            <span>•</span>
                            <span className="capitalize">{report.frequency}</span>
                            {report.lastGenerated && (
                              <>
                                <span>•</span>
                                <span>Last: {report.lastGenerated.toLocaleDateString()}</span>
                              </>
                            )}
                            {report.size && (
                              <>
                                <span>•</span>
                                <span>{report.size}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>{report.downloadCount} downloads</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {report.status === 'ready' && (
                          <div className="flex items-center space-x-1">
                            {report.formats.map((format) => {
                              const FormatIcon = formatIcons[format];
                              return (
                                <button
                                  key={format}
                                  onClick={() => downloadReport(report.id, format)}
                                  className="flex items-center space-x-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs transition-colors"
                                  title={`Download as ${format.toUpperCase()}`}
                                >
                                  <FormatIcon className="w-3 h-3" />
                                  <span>{format.toUpperCase()}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => generateReport(report.id)}
                            disabled={isGenerating || report.status === 'generating'}
                            className="p-2 text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-300 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-300 transition-colors">
                            <Share className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Export History */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Recent Exports</h3>
            </div>
            <div className="divide-y divide-gray-700">
              {[
                { report: 'Monthly Financial Report', format: 'PDF', date: '2024-01-15 14:30', size: '2.4 MB', user: 'Sarah Johnson' },
                { report: 'Donor Activity Analysis', format: 'Excel', date: '2024-01-14 09:15', size: '1.8 MB', user: 'Michael Chen' },
                { report: 'Program Impact Assessment', format: 'PDF', date: '2024-01-12 16:45', size: '4.2 MB', user: 'Emma Williams' },
                { report: 'User Engagement Report', format: 'CSV', date: '2024-01-11 11:20', size: '856 KB', user: 'David Brown' }
              ].map((export_, index) => (
                <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-700 transition-colors">
                  <div>
                    <p className="text-white font-medium">{export_.report}</p>
                    <p className="text-gray-400 text-sm">{export_.format} • {export_.size} • by {export_.user}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400 text-sm">{export_.date}</span>
                    <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminReports;