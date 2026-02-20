import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { Search, UserCheck, Mail, Phone, MapPin, Calendar, RefreshCw, Filter, Download, Eye, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Volunteer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  interests: string[];
  availability?: string;
  experience?: string;
  motivation?: string;
  skills?: string;
  commitment?: string;
  status: 'pending' | 'approved' | 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

const VolunteersManagement: React.FC = () => {
  const { session } = useAuth();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [interestFilter, setInterestFilter] = useState('all');
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, hours: 0 });

  useEffect(() => {
    loadVolunteers();
  }, [statusFilter]);

  const loadVolunteers = async () => {
    if (!session?.access_token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: statusFilter,
        search: searchTerm
      });

      const response = await fetch(`/api/admin/volunteers?${params}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const volunteerData = data.data || [];
        setVolunteers(volunteerData);

        // Calculate real stats from data
        const totalVolunteers = volunteerData.length;
        const activeVolunteers = volunteerData.filter((v: Volunteer) => v.status === 'active').length;
        const pendingVolunteers = volunteerData.filter((v: Volunteer) => v.status === 'pending').length;

        setStats({
          total: totalVolunteers,
          active: activeVolunteers,
          pending: pendingVolunteers,
          hours: activeVolunteers * 40 // Estimate 40 hours per active volunteer
        });
      }
    } catch (error) {
      console.error('Error loading volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateVolunteerStatus = async (volunteerId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/volunteers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          volunteerId,
          status: newStatus
        })
      });

      if (response.ok) {
        loadVolunteers(); // Reload data
      }
    } catch (error) {
      console.error('Error updating volunteer:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-500/20 text-green-400`;
      case 'approved':
        return `${baseClasses} bg-blue-500/20 text-blue-400`;
      case 'pending':
        return `${baseClasses} bg-yellow-500/20 text-yellow-400`;
      case 'inactive':
        return `${baseClasses} bg-red-500/20 text-red-400`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400`;
    }
  };

  const exportToPDF = async () => {
    try {
      const response = await fetch('/api/admin/volunteers/export?format=pdf', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `volunteers-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  // Get unique interests from all volunteers for filter dropdown
  const allInterests = Array.from(new Set(volunteers.flatMap(v => v.interests || [])));

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesInterest = interestFilter === 'all' || volunteer.interests?.includes(interestFilter);

    return matchesSearch && matchesInterest;
  });

  return (
    <>
      <Head>
        <title>Volunteers Management - Admin Dashboard</title>
        <meta name="description" content="Manage volunteer applications and assignments" />
      </Head>

      <AdminLayout title="Volunteers Management">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Volunteers</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <UserCheck className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active This Month</p>
                  <p className="text-2xl font-bold text-green-400">{stats.active}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending Applications</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                </div>
                <Mail className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Hours This Month</p>
                  <p className="text-2xl font-bold text-purple-400">{stats.hours.toLocaleString()}</p>
                </div>
                <UserCheck className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search volunteers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={interestFilter}
                onChange={(e) => setInterestFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
              >
                <option value="all">All Interests</option>
                {allInterests.sort().map(interest => (
                  <option key={interest} value={interest}>{interest}</option>
                ))}
              </select>

              <button
                onClick={exportToPDF}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>

              <button
                onClick={loadVolunteers}
                className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Volunteers Table */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Volunteer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Interests
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                        Loading volunteers...
                      </td>
                    </tr>
                  ) : filteredVolunteers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                        No volunteers found
                      </td>
                    </tr>
                  ) : (
                    filteredVolunteers.map((volunteer) => (
                      <tr key={volunteer.id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-white">
                              {volunteer.first_name} {volunteer.last_name}
                            </div>
                            <div className="text-sm text-gray-400">
                              ID: {volunteer.id.slice(0, 8)}...
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm text-white flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {volunteer.email}
                            </div>
                            <div className="text-sm text-gray-400 flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              {volunteer.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {volunteer.location}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {volunteer.interests.slice(0, 2).map((interest, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-300 text-xs rounded">
                                {interest}
                              </span>
                            ))}
                            {volunteer.interests.length > 2 && (
                              <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-300 text-xs rounded">
                                +{volunteer.interests.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(volunteer.status)}>
                            {volunteer.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(volunteer.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedVolunteer(volunteer)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs flex items-center gap-1 transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              View
                            </button>
                            <select
                              value={volunteer.status}
                              onChange={(e) => updateVolunteerStatus(volunteer.id, e.target.value)}
                              className="bg-gray-700 border border-gray-600 rounded text-white text-xs px-2 py-1"
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* View Details Modal */}
          {selectedVolunteer && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-white">
                    Volunteer Details
                  </h2>
                  <button
                    onClick={() => setSelectedVolunteer(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Personal Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Name</p>
                        <p className="text-white font-medium">
                          {selectedVolunteer.first_name} {selectedVolunteer.last_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="text-white font-medium">{selectedVolunteer.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Phone</p>
                        <p className="text-white font-medium">{selectedVolunteer.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Location</p>
                        <p className="text-white font-medium">{selectedVolunteer.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Status</p>
                        <span className={getStatusBadge(selectedVolunteer.status)}>
                          {selectedVolunteer.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Applied On</p>
                        <p className="text-white font-medium">
                          {new Date(selectedVolunteer.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Availability & Commitment */}
                  {(selectedVolunteer.availability || selectedVolunteer.commitment) && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Availability</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedVolunteer.availability && (
                          <div>
                            <p className="text-sm text-gray-400">When</p>
                            <p className="text-white font-medium capitalize">{selectedVolunteer.availability}</p>
                          </div>
                        )}
                        {selectedVolunteer.commitment && (
                          <div>
                            <p className="text-sm text-gray-400">Commitment</p>
                            <p className="text-white font-medium capitalize">{selectedVolunteer.commitment}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Interests */}
                  {selectedVolunteer.interests && selectedVolunteer.interests.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Areas of Interest</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedVolunteer.interests.map((interest, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {selectedVolunteer.skills && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Skills</h3>
                      <p className="text-gray-300">{selectedVolunteer.skills}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {selectedVolunteer.experience && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Experience</h3>
                      <p className="text-gray-300 whitespace-pre-wrap">{selectedVolunteer.experience}</p>
                    </div>
                  )}

                  {/* Motivation */}
                  {selectedVolunteer.motivation && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Motivation</h3>
                      <p className="text-gray-300 whitespace-pre-wrap">{selectedVolunteer.motivation}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-4 pt-4 border-t border-gray-700">
                    <select
                      value={selectedVolunteer.status}
                      onChange={(e) => {
                        updateVolunteerStatus(selectedVolunteer.id, e.target.value);
                        setSelectedVolunteer({ ...selectedVolunteer, status: e.target.value as any });
                      }}
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <button
                      onClick={() => setSelectedVolunteer(null)}
                      className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
};

export default VolunteersManagement;