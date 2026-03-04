import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Users, Mail, Phone, MapPin, CheckCircle, XCircle, Clock, Eye, X, Calendar, Briefcase, Heart } from 'lucide-react';

interface Volunteer {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  interests: string[];
  skills: string;
  availability: string[];
  experience: string;
  motivation: string;
  commitment: string;
  background_check: boolean;
  status: 'pending' | 'approved' | 'active' | 'inactive' | 'rejected';
  application_date: string;
  created_at: string;
  updated_at: string;
}

const VolunteersManagement: React.FC = () => {
  const { session } = useAuth();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [stats, setStats] = useState({ pending: 0, approved: 0, active: 0, total: 0 });

  useEffect(() => {
    loadVolunteers();
  }, [session, statusFilter]);

  const loadVolunteers = async () => {
    try {
      setLoading(true);

      const searchParams = new URLSearchParams();
      if (statusFilter !== 'all') searchParams.set('status', statusFilter);

      const response = await fetch(`/api/admin/volunteers?${searchParams.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to load volunteers');
      }

      const data = await response.json();
      setVolunteers(data);
      updateStats(data);
    } catch (error) {
      console.error('Error loading volunteers:', error);
      setVolunteers([]);
      updateStats([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (data: Volunteer[]) => {
    setStats({
      pending: data.filter(v => v.status === 'pending').length,
      approved: data.filter(v => v.status === 'approved').length,
      active: data.filter(v => v.status === 'active').length,
      total: data.length
    });
  };

  const updateStatus = async (id: string, newStatus: 'approved' | 'rejected' | 'active' | 'inactive') => {
    try {
      const response = await fetch(`/api/admin/volunteers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      await loadVolunteers();

      if (selectedVolunteer?.id === id) {
        setSelectedVolunteer({ ...selectedVolunteer, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating volunteer status:', error);
      alert('Failed to update volunteer status');
    }
  };

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch =
      volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'active': return <Heart className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Volunteer Management - Admin Dashboard</title>
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-500" />
                  Volunteer Applications
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Manage volunteer applications and assignments
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">Pending</p>
                    <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">{stats.pending}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 dark:text-green-400 text-sm font-medium">Approved</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-300">{stats.approved}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Active</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{stats.active}</p>
                  </div>
                  <Heart className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Total</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">{stats.total}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Volunteers List */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-4">Loading volunteers...</p>
            </div>
          ) : filteredVolunteers.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? 'No volunteers found matching your search' : 'No volunteer applications yet'}
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Interests
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredVolunteers.map((volunteer) => (
                    <tr key={volunteer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{volunteer.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {volunteer.location}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="flex items-center gap-1 text-gray-900 dark:text-white">
                            <Mail className="w-3 h-3" />
                            {volunteer.email}
                          </div>
                          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mt-1">
                            <Phone className="w-3 h-3" />
                            {volunteer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {volunteer.interests.slice(0, 2).map((interest, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                              {interest}
                            </span>
                          ))}
                          {volunteer.interests.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                              +{volunteer.interests.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(volunteer.status)}`}>
                          {getStatusIcon(volunteer.status)}
                          {volunteer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(volunteer.application_date || volunteer.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedVolunteer(volunteer);
                            setShowViewModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* View Volunteer Modal */}
        {showViewModal && selectedVolunteer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Volunteer Application
                </h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedVolunteer.status)}`}>
                    {getStatusIcon(selectedVolunteer.status)}
                    {selectedVolunteer.status.charAt(0).toUpperCase() + selectedVolunteer.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Applied {new Date(selectedVolunteer.application_date || selectedVolunteer.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Personal Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Full Name</label>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedVolunteer.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Email</label>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedVolunteer.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Phone</label>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedVolunteer.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Location</label>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedVolunteer.location}</p>
                    </div>
                  </div>
                </div>

                {/* Volunteer Details */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Volunteer Details</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Areas of Interest</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedVolunteer.interests.map((interest, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">Availability</label>
                        <p className="text-gray-900 dark:text-white">{selectedVolunteer.availability}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">Time Commitment</label>
                        <p className="text-gray-900 dark:text-white">{selectedVolunteer.commitment}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Skills & Qualifications</label>
                      <p className="text-gray-900 dark:text-white mt-1">{selectedVolunteer.skills}</p>
                    </div>

                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Relevant Experience</label>
                      <p className="text-gray-900 dark:text-white mt-1 whitespace-pre-line">{selectedVolunteer.experience}</p>
                    </div>

                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Motivation</label>
                      <p className="text-gray-900 dark:text-white mt-1 whitespace-pre-line">{selectedVolunteer.motivation}</p>
                    </div>

                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Background Check</label>
                      <p className="text-gray-900 dark:text-white">
                        {selectedVolunteer.background_check ? '✅ Agreed to background check' : '❌ Not agreed'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {selectedVolunteer.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        updateStatus(selectedVolunteer.id, 'approved');
                        setShowViewModal(false);
                      }}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve Application
                    </button>
                    <button
                      onClick={() => {
                        updateStatus(selectedVolunteer.id, 'rejected');
                        setShowViewModal(false);
                      }}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject Application
                    </button>
                  </div>
                )}

                {selectedVolunteer.status === 'approved' && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        updateStatus(selectedVolunteer.id, 'active');
                        setShowViewModal(false);
                      }}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Heart className="w-5 h-5" />
                      Mark as Active Volunteer
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default VolunteersManagement;
