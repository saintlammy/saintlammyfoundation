import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { partnershipService, PartnershipApplication as APIPartnershipApplication, PartnershipTeamMember as APITeamMember } from '@/lib/partnershipService';
import {
  Plus,
  Search,
  Filter,
  Eye,
  MoreHorizontal,
  Calendar,
  Mail,
  Phone,
  Building,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  ArrowRight,
  Download,
  Star,
  MessageSquare,
  FileText,
  Target,
  Handshake,
  Edit,
  Settings
} from 'lucide-react';

interface PartnershipApplication {
  id: string;
  organizationName: string;
  contactName: string;
  email: string;
  phone?: string;
  organizationType: 'corporation' | 'ngo' | 'government' | 'foundation' | 'individual' | 'other';
  partnershipType: 'corporate-csr' | 'program-collaboration' | 'funding' | 'resource-sharing' | 'volunteer' | 'other';
  message: string;
  timeline: 'immediate' | 'short-term' | 'medium-term' | 'long-term' | 'exploratory';
  status: 'new' | 'under-review' | 'approved' | 'rejected' | 'in-discussion';
  priority: 'low' | 'medium' | 'high';
  submittedAt: Date;
  lastUpdated: Date;
  assignedTo?: string;
  notes?: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  expertise: string;
  experience: string;
  focus: string[];
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

interface PartnershipProcess {
  step: number;
  title: string;
  duration: string;
  description: string;
  icon: string;
}

const AdminPartnerships: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'applications' | 'team' | 'process'>('applications');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [applications, setApplications] = useState<PartnershipApplication[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from API
  useEffect(() => {
    loadData();
  }, [selectedStatus, selectedPriority]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Fetch partnership applications
      const appsResult = await partnershipService.getApplications({
        status: selectedStatus,
        priority: selectedPriority
      });

      // Transform API data to match component interface
      const transformedApps: PartnershipApplication[] = appsResult.applications.map((app: APIPartnershipApplication) => ({
        id: app.id,
        organizationName: app.organization_name,
        contactName: app.contact_name,
        email: app.email,
        phone: app.phone,
        organizationType: app.organization_type,
        partnershipType: app.partnership_type,
        message: app.message,
        timeline: app.timeline,
        status: app.status,
        priority: app.priority,
        submittedAt: new Date(app.created_at),
        lastUpdated: new Date(app.updated_at),
        assignedTo: app.assigned_to,
        notes: app.notes
      }));

      setApplications(transformedApps);

      // Fetch team members
      const teamResult = await partnershipService.getTeamMembers();

      // Transform API data to match component interface
      const transformedTeam: TeamMember[] = teamResult.members.map((member: APITeamMember) => ({
        id: member.id,
        name: member.name,
        role: member.role,
        expertise: member.expertise || '',
        experience: member.experience || '',
        focus: member.focus || [],
        email: member.email,
        phone: member.phone,
        status: member.status,
        avatar: member.avatar
      }));

      setTeamMembers(transformedTeam);
    } catch (error) {
      console.error('Error loading partnership data:', error);
    } finally {
      setLoading(false);
    }
  };


  // Mock data for partnership process
  const partnershipProcess: PartnershipProcess[] = [
    {
      step: 1,
      title: 'Initial Consultation',
      duration: '30-45 minutes',
      description: 'We discuss your organization\'s goals, our mission alignment, and potential collaboration areas.',
      icon: 'MessageCircle'
    },
    {
      step: 2,
      title: 'Partnership Assessment',
      duration: '1-2 weeks',
      description: 'Our team evaluates partnership opportunities and develops a customized collaboration proposal.',
      icon: 'FileText'
    },
    {
      step: 3,
      title: 'Agreement & Planning',
      duration: '2-3 weeks',
      description: 'We finalize partnership terms, create implementation timelines, and establish success metrics.',
      icon: 'Handshake'
    },
    {
      step: 4,
      title: 'Launch & Execution',
      duration: 'Ongoing',
      description: 'Partnership launches with regular check-ins, progress reports, and continuous optimization.',
      icon: 'Target'
    }
  ];


  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || app.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'under-review': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'in-discussion': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle className="w-4 h-4" />;
      case 'under-review': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'in-discussion': return <MessageSquare className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getOrganizationTypeIcon = (type: string) => {
    switch (type) {
      case 'corporation': return <Building className="w-4 h-4" />;
      case 'ngo': return <Users className="w-4 h-4" />;
      case 'government': return <Building className="w-4 h-4" />;
      case 'foundation': return <Star className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getProcessIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageCircle': return <MessageSquare className="w-6 h-6" />;
      case 'FileText': return <FileText className="w-6 h-6" />;
      case 'Handshake': return <Handshake className="w-6 h-6" />;
      case 'Target': return <Target className="w-6 h-6" />;
      default: return <Settings className="w-6 h-6" />;
    }
  };

  return (
    <>
      <Head>
        <title>Partnership Management - Saintlammy Foundation Admin</title>
        <meta name="description" content="Manage partnership applications and team members" />
      </Head>

      <AdminLayout title="Partnership Management">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Partnership Management</h1>
              <p className="text-gray-400 mt-1">Manage partnership applications and team members</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button className="flex items-center space-x-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add Team Member</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('applications')}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'applications'
                    ? 'border-accent-500 text-accent-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Applications</span>
                <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                  {applications.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('team')}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'team'
                    ? 'border-accent-500 text-accent-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Team Members</span>
                <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                  {teamMembers.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('process')}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'process'
                    ? 'border-accent-500 text-accent-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Process Steps</span>
                <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                  {partnershipProcess.length}
                </span>
              </button>
            </nav>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={activeTab === 'applications' ? "Search applications..." : "Search team members..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
            {activeTab === 'applications' && (
              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="under-review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="in-discussion">In Discussion</option>
                </select>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            )}
          </div>

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Organization
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredApplications.map((application) => (
                      <tr key={application.id} className="hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-lg">
                              {getOrganizationTypeIcon(application.organizationType)}
                            </div>
                            <div>
                              <p className="text-white font-medium">{application.organizationName}</p>
                              <p className="text-gray-400 text-sm capitalize">{application.organizationType}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white font-medium">{application.contactName}</p>
                            <div className="text-gray-400 text-sm space-y-1">
                              <div className="flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {application.email}
                              </div>
                              {application.phone && (
                                <div className="flex items-center">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {application.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-300 text-sm">
                            <p className="capitalize font-medium">{application.partnershipType.replace('-', ' ')}</p>
                            <p className="text-gray-400 capitalize">{application.timeline.replace('-', ' ')}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                            {getStatusIcon(application.status)}
                            <span className="ml-1 capitalize">{application.status.replace('-', ' ')}</span>
                          </span>
                          {application.assignedTo && (
                            <p className="text-gray-500 text-xs mt-1">Assigned to {application.assignedTo}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getPriorityColor(application.priority)}`}>
                            {application.priority.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-300 text-sm">
                            {application.submittedAt.toLocaleDateString()}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {application.submittedAt.toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="p-1 text-gray-400 hover:text-accent-400 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Team Members Tab */}
          {activeTab === 'team' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-accent-500/20 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-accent-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{member.name}</h3>
                        <p className="text-accent-400 text-sm">{member.role}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      member.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {member.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-300 text-sm font-medium">{member.expertise}</p>
                      <p className="text-gray-400 text-xs">{member.experience}</p>
                    </div>

                    <div>
                      <p className="text-gray-300 text-sm font-medium mb-2">Focus Areas:</p>
                      <div className="flex flex-wrap gap-1">
                        {member.focus.map((area, index) => (
                          <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center text-gray-400">
                        <Mail className="w-3 h-3 mr-2" />
                        {member.email}
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Phone className="w-3 h-3 mr-2" />
                        {member.phone}
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button className="text-accent-400 hover:text-accent-300 text-sm font-medium">
                        Edit Member
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Process Steps Tab */}
          {activeTab === 'process' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-white">Partnership Process Steps</h2>
                  <p className="text-gray-400 mt-1">Manage the steps in your partnership process</p>
                </div>
                <button className="flex items-center space-x-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add Step</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {partnershipProcess.map((step, index) => (
                  <div key={step.step} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-accent-500/20 rounded-lg">
                          {getProcessIcon(step.icon)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="bg-accent-500/20 text-accent-400 px-2 py-1 rounded text-xs font-medium">
                              Step {step.step}
                            </span>
                            <span className="text-gray-400 text-xs">{step.duration}</span>
                          </div>
                          <h3 className="text-white font-semibold mt-1">{step.title}</h3>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-accent-400 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>

                      <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                        <div className="text-xs text-gray-400">
                          Order: {step.step} of {partnershipProcess.length}
                        </div>
                        <div className="flex items-center space-x-2">
                          {index > 0 && (
                            <button className="text-xs text-gray-400 hover:text-accent-400 transition-colors">
                              Move Up
                            </button>
                          )}
                          {index < partnershipProcess.length - 1 && (
                            <button className="text-xs text-gray-400 hover:text-accent-400 transition-colors">
                              Move Down
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Settings className="w-5 h-5 text-accent-400" />
                  <h3 className="text-white font-semibold">Process Settings</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Default Process Duration
                    </label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500">
                      <option>4-6 weeks</option>
                      <option>6-8 weeks</option>
                      <option>8-12 weeks</option>
                      <option>Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Auto-assign Applications
                    </label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500">
                      <option>Round Robin</option>
                      <option>By Expertise</option>
                      <option>Manual Only</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Applications</p>
                  <p className="text-2xl font-bold text-white">{applications.length}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Under Review</p>
                  <p className="text-2xl font-bold text-white">
                    {applications.filter(app => app.status === 'under-review').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Approved</p>
                  <p className="text-2xl font-bold text-white">
                    {applications.filter(app => app.status === 'approved').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Team Members</p>
                  <p className="text-2xl font-bold text-white">{teamMembers.length}</p>
                </div>
                <Users className="w-8 h-8 text-accent-400" />
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminPartnerships;