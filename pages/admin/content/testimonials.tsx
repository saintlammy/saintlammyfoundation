import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Star, User, MessageSquare, CheckCircle, XCircle, Clock, Plus, RefreshCw, Trash2, Eye, X, Award } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  featured_image: string | null;
  is_featured: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

const TestimonialsManagement: React.FC = () => {
  const { session } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5
  });
  const [stats, setStats] = useState({ approved: 0, pending: 0, total: 0, featured: 0 });

  useEffect(() => {
    loadTestimonials();
  }, [session, statusFilter]);

  const loadTestimonials = async () => {
    try {
      setLoading(true);

      // Use the new Testimonials API
      const searchParams = new URLSearchParams();
      if (statusFilter !== 'all') searchParams.set('status', statusFilter);

      const response = await fetch(`/api/testimonials?${searchParams.toString()}`);
      const data = await response.json();

      // Transform API data to match component interface
      const transformedTestimonials = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        role: item.role,
        content: item.content,
        rating: item.rating,
        featured_image: item.image,
        is_featured: false,
        status: item.status === 'published' ? 'approved' : 'pending',
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setTestimonials(transformedTestimonials);
      updateStats(transformedTestimonials);
    } catch (error) {
      console.error('Error loading testimonials:', error);

      // Fall back to mock data
      const mockTestimonials: Testimonial[] = [
        {
          id: '1',
          name: 'Mrs. Grace Okoro',
          role: 'Program Beneficiary',
          content: 'The widow empowerment program transformed my life. I learned tailoring skills and received a micro-loan to start my business.',
          rating: 5,
          featured_image: 'https://images.unsplash.com/photo-1494790108755-2616c34ca2f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          is_featured: true,
          status: 'approved',
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: 'David Adebayo',
          role: 'Former Beneficiary',
          content: 'Through the orphan support program, I was able to complete my education. Today, I am a university graduate working as a software engineer.',
          rating: 5,
          featured_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          is_featured: false,
          status: 'approved',
          created_at: '2024-01-10T00:00:00Z',
          updated_at: '2024-01-10T00:00:00Z'
        }
      ];

      const filteredTestimonials = statusFilter === 'all' ? mockTestimonials :
        mockTestimonials.filter(t => t.status === statusFilter);

      setTestimonials(filteredTestimonials);
      updateStats(filteredTestimonials);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (testimonialData: Testimonial[]) => {
    const stats = {
      total: testimonialData.length,
      approved: testimonialData.filter(t => t.status === 'approved').length,
      pending: testimonialData.filter(t => t.status === 'pending').length,
      featured: testimonialData.filter(t => t.is_featured).length
    };
    setStats(stats);
  };

  // Function aliases for inline usage
  const addTestimonial = async () => {
    await handleSaveTestimonial(newTestimonial);
    setNewTestimonial({ name: '', role: '', content: '', rating: 5 });
  };

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
    try {
      const response = await fetch(`/api/testimonials?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedTestimonials = testimonials.map(t =>
          t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t
        );
        setTestimonials(updatedTestimonials);
        updateStats(updatedTestimonials);
      }
    } catch (error) {
      console.error('Error updating testimonial:', error);
    }
  };

  const deleteTestimonial = async (id: string) => {
    await handleDeleteTestimonial(id);
  };

  const handleSaveTestimonial = async (testimonialData: any) => {
    try {
      if (selectedTestimonial) {
        // Update existing testimonial
        const response = await fetch(`/api/testimonials?id=${selectedTestimonial.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: testimonialData.name,
            content: testimonialData.content,
            excerpt: testimonialData.role,
            testimonial_details: {
              author_name: testimonialData.name,
              author_role: testimonialData.role,
              rating: testimonialData.rating || 5
            },
            status: 'published'
          }),
        });

        if (response.ok) {
          await loadTestimonials(); // Reload to get fresh data
        } else {
          const errorData = await response.json();
          console.error('Update error:', errorData);
          alert(`Failed to update testimonial: ${errorData.message || 'Unknown error'}`);
        }
      } else {
        // Create new testimonial - format data to match API expectations
        const payload = {
          title: testimonialData.name,
          content: testimonialData.content,
          excerpt: testimonialData.role || 'Beneficiary',
          testimonial_details: {
            author_name: testimonialData.name,
            author_role: testimonialData.role || 'Beneficiary',
            rating: testimonialData.rating || 5
          },
          status: 'published',
          publish_date: new Date().toISOString()
        };

        console.log('Creating testimonial with payload:', payload);

        const response = await fetch('/api/testimonials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const createdTestimonial = await response.json();
          console.log('✅ Testimonial created:', createdTestimonial);
          await loadTestimonials(); // Reload to get fresh data
        } else {
          const errorData = await response.json();
          console.error('❌ Create error:', errorData);
          alert(`Failed to create testimonial: ${errorData.message || errorData.error || 'Unknown error'}`);
          return; // Don't close modal if there was an error
        }
      }

      setShowAddModal(false);
      setSelectedTestimonial(null);
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert(`Failed to save testimonial: ${(error as Error).message}`);
    }
  };

  const handleDeleteTestimonial = async (testimonialId: string) => {
    if (!confirm('Are you sure you want to delete this testimonial? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/testimonials?id=${testimonialId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedTestimonials = testimonials.filter(t => t.id !== testimonialId);
        setTestimonials(updatedTestimonials);
        updateStats(updatedTestimonials);
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Failed to delete testimonial. Please try again.');
    }
  };

  const handleApprove = async (testimonialId: string) => {
    await updateTestimonialStatus(testimonialId, 'approved');
  };

  const handleReject = async (testimonialId: string) => {
    await updateTestimonialStatus(testimonialId, 'rejected');
  };

  const updateTestimonialStatus = async (testimonialId: string, status: string) => {
    try {
      const response = await fetch(`/api/testimonials?id=${testimonialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const updatedTestimonials = testimonials.map(t =>
          t.id === testimonialId ? { ...t, status: status as any, updated_at: new Date().toISOString() } : t
        );
        setTestimonials(updatedTestimonials);
        updateStats(updatedTestimonials);
      }
    } catch (error) {
      console.error('Error updating testimonial status:', error);
      alert('Failed to update testimonial status. Please try again.');
    }
  };


  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-green-500/20 text-green-400`;
      case 'pending':
        return `${baseClasses} bg-yellow-500/20 text-yellow-400`;
      case 'rejected':
        return `${baseClasses} bg-red-500/20 text-red-400`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-600 dark:text-gray-400`;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600 dark:text-gray-400'}`}
      />
    ));
  };

  const viewTestimonial = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setShowViewModal(true);
  };

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  return (
    <>
      <Head>
        <title>Testimonials Management - Admin Dashboard</title>
        <meta name="description" content="Manage content/testimonials functionality" />
      </Head>

      <AdminLayout title="Testimonials Management">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Testimonials</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Approved</p>
                  <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Featured</p>
                  <p className="text-2xl font-bold text-purple-400">{stats.featured}</p>
                </div>
                <Award className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search testimonials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-gray-900 dark:text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Testimonial
                </button>
                <button
                  onClick={loadTestimonials}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Testimonials Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Featured
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-600 dark:text-gray-400">
                        Loading testimonials...
                      </td>
                    </tr>
                  ) : filteredTestimonials.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-600 dark:text-gray-400">
                        No testimonials found
                      </td>
                    </tr>
                  ) : (
                    filteredTestimonials.map((testimonial) => (
                      <tr key={testimonial.id} className="hover:bg-gray-50 dark:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                              <User className="w-4 h-4 mr-2" />
                              {testimonial.name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {testimonial.role || 'No role specified'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                            {testimonial.content}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex">
                            {renderStars(testimonial.rating)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(testimonial.status)}>
                            {testimonial.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => updateTestimonial(testimonial.id, { is_featured: !testimonial.is_featured })}
                            className={`px-2 py-1 text-xs font-medium rounded ${
                              testimonial.is_featured
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            {testimonial.is_featured ? 'Featured' : 'Not Featured'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(testimonial.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => viewTestimonial(testimonial)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <select
                              value={testimonial.status}
                              onChange={(e) => updateTestimonial(testimonial.id, { status: e.target.value as 'pending' | 'approved' | 'rejected' })}
                              className="bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded text-gray-900 dark:text-white text-xs px-2 py-1"
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                            <button
                              onClick={() => deleteTestimonial(testimonial.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Testimonial Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Testimonial</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                    <input
                      type="text"
                      value={newTestimonial.name}
                      onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      placeholder="Enter author name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                    <input
                      type="text"
                      value={newTestimonial.role}
                      onChange={(e) => setNewTestimonial({...newTestimonial, role: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      placeholder="Enter role or title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                    <select
                      value={newTestimonial.rating}
                      onChange={(e) => setNewTestimonial({...newTestimonial, rating: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500"
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Testimonial Content *</label>
                    <textarea
                      value={newTestimonial.content}
                      onChange={(e) => setNewTestimonial({...newTestimonial, content: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      placeholder="Enter testimonial content"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={addTestimonial}
                      disabled={!newTestimonial.name || !newTestimonial.content}
                      className="flex-1 px-4 py-2 bg-accent-500 hover:bg-accent-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-900 dark:text-white rounded-lg transition-colors"
                    >
                      Add Testimonial
                    </button>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View Testimonial Modal */}
          {showViewModal && selectedTestimonial && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Testimonial Details</h3>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="text-gray-900 dark:text-white font-medium">{selectedTestimonial.name}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{selectedTestimonial.role || 'No role specified'}</p>
                    </div>
                    <div className="flex">
                      {renderStars(selectedTestimonial.rating)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className={getStatusBadge(selectedTestimonial.status)}>
                      {selectedTestimonial.status}
                    </span>
                    {selectedTestimonial.is_featured && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full">
                        Featured
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="text-gray-300 text-sm mb-2">Created: {new Date(selectedTestimonial.created_at).toLocaleString()}</p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-900 dark:text-white italic">"{selectedTestimonial.content}"</p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => {
                        updateTestimonial(selectedTestimonial.id, { status: 'approved' });
                        setShowViewModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-gray-900 dark:text-white rounded-lg transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        updateTestimonial(selectedTestimonial.id, { is_featured: !selectedTestimonial.is_featured });
                        setShowViewModal(false);
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-gray-900 dark:text-white rounded-lg transition-colors"
                    >
                      {selectedTestimonial.is_featured ? 'Remove Featured' : 'Make Featured'}
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

export default TestimonialsManagement;
