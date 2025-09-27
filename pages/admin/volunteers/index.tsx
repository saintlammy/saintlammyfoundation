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
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Award,
  Star,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  UserPlus,
  UserCheck,
  UserX,
  MoreHorizontal,
  Download,
  Send,
  Heart,
  Target,
  Book
} from 'lucide-react';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  location: string;
  joinDate: Date;
  status: 'active' | 'inactive' | 'pending' | 'on-leave';
  totalHours: number;
  programsJoined: number;
  skills: string[];
  availability: {
    weekdays: boolean;
    weekends: boolean;
    evenings: boolean;
  };
  programs: Array<{
    id: string;
    name: string;
    role: string;
    startDate: Date;
    endDate?: Date;
    hoursContributed: number;
    status: 'active' | 'completed' | 'paused';
  }>;
  lastActivity: Date;
  rating: number;
  certificates: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface VolunteerApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  motivation: string;
  skills: string[];
  availability: string;
  preferredPrograms: string[];
  appliedDate: Date;
  status: 'pending' | 'approved' | 'rejected';
}

const AdminVolunteers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'volunteers' | 'applications'>('volunteers');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [programFilter, setProgramFilter] = useState('all');
  const [selectedVolunteers, setSelectedVolunteers] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const volunteers: Volunteer[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+234 802 123 4567',
      avatar: '/avatars/sarah.jpg',
      location: 'Lagos, Nigeria',
      joinDate: new Date('2023-03-15'),
      status: 'active',
      totalHours: 256,
      programsJoined: 3,
      skills: ['Teaching', 'Child Care', 'Event Planning'],
      availability: { weekdays: true, weekends: true, evenings: false },
      programs: [
        {
          id: '1',
          name: 'Educational Support',
          role: 'Tutor',
          startDate: new Date('2023-03-20'),
          hoursContributed: 128,
          status: 'active'
        },
        {
          id: '2',
          name: 'Orphan Care',
          role: 'Care Assistant',
          startDate: new Date('2023-06-01'),
          hoursContributed: 96,
          status: 'active'
        }
      ],
      lastActivity: new Date('2024-01-15'),
      rating: 4.9,
      certificates: ['First Aid', 'Child Protection'],
      emergencyContact: {
        name: 'John Johnson',
        phone: '+234 803 987 6543',
        relationship: 'Spouse'
      }
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+234 801 234 5678',
      location: 'Abuja, Nigeria',
      joinDate: new Date('2023-05-10'),
      status: 'active',
      totalHours: 189,
      programsJoined: 2,
      skills: ['Medical Knowledge', 'Community Outreach', 'Translation'],
      availability: { weekdays: false, weekends: true, evenings: true },
      programs: [
        {
          id: '3',
          name: 'Healthcare Initiative',
          role: 'Medical Volunteer',
          startDate: new Date('2023-05-15'),
          hoursContributed: 145,
          status: 'active'
        }
      ],
      lastActivity: new Date('2024-01-14'),
      rating: 4.8,
      certificates: ['Basic Life Support', 'Community Health'],
      emergencyContact: {
        name: 'Lisa Chen',
        phone: '+234 802 876 5432',
        relationship: 'Sister'
      }
    },
    {
      id: '3',
      name: 'Emma Williams',
      email: 'emma.williams@email.com',
      phone: '+234 803 345 6789',
      location: 'Kano, Nigeria',
      joinDate: new Date('2023-08-22'),
      status: 'active',
      totalHours: 167,
      programsJoined: 2,
      skills: ['Social Work', 'Counseling', 'Fund Raising'],
      availability: { weekdays: true, weekends: false, evenings: true },
      programs: [
        {
          id: '4',
          name: 'Orphanage Management',
          role: 'House Parent',
          startDate: new Date('2023-09-01'),
          hoursContributed: 167,
          status: 'active'
        }
      ],
      lastActivity: new Date('2024-01-16'),
      rating: 4.7,
      certificates: ['Child Psychology', 'Crisis Management']
    },
    {
      id: '4',
      name: 'David Brown',
      email: 'david.brown@email.com',
      phone: '+234 804 456 7890',
      location: 'Port Harcourt, Nigeria',
      joinDate: new Date('2023-11-08'),
      status: 'on-leave',
      totalHours: 89,
      programsJoined: 1,
      skills: ['Logistics', 'Project Management', 'Driving'],
      availability: { weekdays: true, weekends: true, evenings: false },
      programs: [
        {
          id: '5',
          name: 'Emergency Response',
          role: 'Logistics Coordinator',
          startDate: new Date('2023-11-15'),
          endDate: new Date('2024-01-01'),
          hoursContributed: 89,
          status: 'paused'
        }
      ],
      lastActivity: new Date('2023-12-30'),
      rating: 4.5,
      certificates: ['Emergency Response']
    },
    {
      id: '5',
      name: 'Lisa Anderson',
      email: 'lisa.anderson@email.com',
      location: 'Kaduna, Nigeria',
      joinDate: new Date('2024-01-05'),
      status: 'pending',
      totalHours: 0,
      programsJoined: 0,
      skills: ['Water Engineering', 'Community Development'],
      availability: { weekdays: true, weekends: true, evenings: false },
      programs: [],
      lastActivity: new Date('2024-01-05'),
      rating: 0,
      certificates: []
    }
  ];

  const applications: VolunteerApplication[] = [
    {
      id: '1',
      name: 'James Wilson',
      email: 'james.wilson@email.com',
      phone: '+234 805 123 4567',
      motivation: 'I want to contribute to the community and help children in need. My background in education makes me suitable for teaching programs.',
      skills: ['Teaching', 'Mathematics', 'Computer Skills'],
      availability: 'Weekends and evenings',
      preferredPrograms: ['Educational Support', 'Computer Literacy'],
      appliedDate: new Date('2024-01-10'),
      status: 'pending'
    },
    {
      id: '2',
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      phone: '+234 806 234 5678',
      motivation: 'As a nurse, I believe in giving back to society through healthcare initiatives and helping underserved communities.',
      skills: ['Nursing', 'Health Education', 'Spanish', 'Portuguese'],
      availability: 'Flexible schedule',
      preferredPrograms: ['Healthcare Initiative', 'Community Health'],
      appliedDate: new Date('2024-01-12'),
      status: 'pending'
    },
    {
      id: '3',
      name: 'Ahmed Yusuf',
      email: 'ahmed.yusuf@email.com',
      phone: '+234 807 345 6789',
      motivation: 'Having grown up in a similar situation, I understand the challenges these children face and want to be a positive influence.',
      skills: ['Mentoring', 'Sports Coaching', 'Arabic', 'Hausa'],
      availability: 'Weekends only',
      preferredPrograms: ['Youth Mentoring', 'Sports Program'],
      appliedDate: new Date('2024-01-14'),
      status: 'approved'
    }
  ];

  const statusColors = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'on-leave': 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };

  const applicationStatusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    approved: 'bg-green-500/20 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || volunteer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalVolunteers = volunteers.length;
  const activeVolunteers = volunteers.filter(v => v.status === 'active').length;
  const totalHours = volunteers.reduce((sum, v) => sum + v.totalHours, 0);
  const pendingApplications = applications.filter(a => a.status === 'pending').length;

  const toggleVolunteerSelection = (volunteerId: string) => {
    setSelectedVolunteers(prev =>
      prev.includes(volunteerId)
        ? prev.filter(id => id !== volunteerId)
        : [...prev, volunteerId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedVolunteers(
      selectedVolunteers.length === filteredVolunteers.length
        ? []
        : filteredVolunteers.map(volunteer => volunteer.id)
    );
  };

  const approveApplication = (applicationId: string) => {
    console.log('Approving application:', applicationId);
  };

  const rejectApplication = (applicationId: string) => {
    console.log('Rejecting application:', applicationId);
  };

  return (
    <>
      <Head>
        <title>Volunteer Management - Saintlammy Foundation Admin</title>
        <meta name="description" content="Manage volunteers and applications" />
      </Head>

      <AdminLayout title="Volunteer Management">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Volunteer Management</h1>
              <p className="text-gray-400 mt-1">Manage volunteers and process applications</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Volunteer</span>
              </button>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Volunteers</p>
                  <p className="text-2xl font-bold text-white mt-1">{totalVolunteers}</p>
                  <p className="text-green-400 text-sm mt-2">{activeVolunteers} active</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Hours</p>
                  <p className="text-2xl font-bold text-white mt-1">{totalHours.toLocaleString()}</p>
                  <p className="text-green-400 text-sm mt-2">This year</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Pending Applications</p>
                  <p className="text-2xl font-bold text-white mt-1">{pendingApplications}</p>
                  <p className="text-yellow-400 text-sm mt-2">Need review</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Average Rating</p>
                  <p className="text-2xl font-bold text-white mt-1">4.7</p>
                  <div className="flex items-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('volunteers')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'volunteers'
                    ? 'border-accent-500 text-accent-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Volunteers ({totalVolunteers})
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                  activeTab === 'applications'
                    ? 'border-accent-500 text-accent-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Applications ({applications.length})
                {pendingApplications > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {pendingApplications}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
            {activeTab === 'volunteers' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="on-leave">On Leave</option>
              </select>
            )}
          </div>

          {/* Content */}
          {activeTab === 'volunteers' ? (
            <>
              {/* Bulk Actions */}
              {selectedVolunteers.length > 0 && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">
                      {selectedVolunteers.length} volunteer{selectedVolunteers.length !== 1 ? 's' : ''} selected
                    </span>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
                        Send Message
                      </button>
                      <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors">
                        Mark Active
                      </button>
                      <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Volunteers List */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedVolunteers.length === filteredVolunteers.length}
                            onChange={toggleSelectAll}
                            className="rounded border-gray-600 bg-gray-50 dark:bg-gray-700 text-accent-500 focus:ring-accent-500 focus:ring-offset-gray-800"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Volunteer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Programs
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Hours
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Last Activity
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filteredVolunteers.map((volunteer) => (
                        <tr key={volunteer.id} className="hover:bg-gray-50 dark:bg-gray-700 transition-colors">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedVolunteers.includes(volunteer.id)}
                              onChange={() => toggleVolunteerSelection(volunteer.id)}
                              className="rounded border-gray-600 bg-gray-50 dark:bg-gray-700 text-accent-500 focus:ring-accent-500 focus:ring-offset-gray-800"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium">
                                  {volunteer.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="text-white font-medium">{volunteer.name}</p>
                                <div className="flex items-center space-x-2 text-sm text-gray-400">
                                  <Mail className="w-3 h-3" />
                                  <span>{volunteer.email}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-400">
                                  <MapPin className="w-3 h-3" />
                                  <span>{volunteer.location}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[volunteer.status]}`}>
                              {volunteer.status.replace('-', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-white">{volunteer.programsJoined}</div>
                            <div className="text-gray-400 text-sm">
                              {volunteer.programs.slice(0, 2).map(p => p.name).join(', ')}
                              {volunteer.programs.length > 2 && '...'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-white font-medium">{volunteer.totalHours}</div>
                            <div className="text-gray-400 text-sm">hours</div>
                          </td>
                          <td className="px-6 py-4">
                            {volunteer.rating > 0 ? (
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-white">{volunteer.rating}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">Not rated</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-300">{volunteer.lastActivity.toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                                <Mail className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                                <Edit className="w-4 h-4" />
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
            </>
          ) : (
            /* Applications List */
            <div className="space-y-6">
              {filteredApplications.map((application) => (
                <div key={application.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {application.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{application.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-3 h-3" />
                              <span>{application.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="w-3 h-3" />
                              <span>{application.phone}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>Applied {application.appliedDate.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-gray-300 font-medium mb-2">Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {application.skills.map((skill) => (
                              <span key={skill} className="bg-gray-50 dark:bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-gray-300 font-medium mb-2">Preferred Programs</h4>
                          <div className="flex flex-wrap gap-2">
                            {application.preferredPrograms.map((program) => (
                              <span key={program} className="bg-accent-500/20 text-accent-400 px-2 py-1 rounded text-xs">
                                {program}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-gray-300 font-medium mb-2">Availability</h4>
                        <p className="text-gray-400 text-sm">{application.availability}</p>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-gray-300 font-medium mb-2">Motivation</h4>
                        <p className="text-gray-400 text-sm">{application.motivation}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${applicationStatusColors[application.status]}`}>
                        {application.status}
                      </span>

                      {application.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => approveApplication(application.id)}
                            className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => rejectApplication(application.id)}
                            className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            <UserX className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}

                      <button className="flex items-center space-x-1 text-gray-400 hover:text-gray-300 transition-colors text-sm">
                        <Send className="w-3 h-3" />
                        <span>Message</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-sm">
              Showing {activeTab === 'volunteers' ? filteredVolunteers.length : filteredApplications.length} of {activeTab === 'volunteers' ? volunteers.length : applications.length} {activeTab}
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

export default AdminVolunteers;