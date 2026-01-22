import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import OutreachEditor from '@/components/admin/OutreachEditor';
import { MapPin, Users, Calendar, Plus, Search, Edit, Eye, Clock, Target, Heart, FileText, ExternalLink } from 'lucide-react';
// ContentService import removed - using direct mock data

interface Outreach {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published' | 'archived';
  type: 'outreach';
  author: string;
  publish_date: string | null;
  featured_image: string;
  outreach_details: {
    location: string;
    event_date: string;
    target_audience: string;
    expected_attendees: number;
    organizer: string;
    contact_info: string;
    budget: number;
    actual_attendees?: number;
  };
  created_at: string;
  updated_at: string;
}

const OutreachesManagement: React.FC = () => {
  const [outreaches, setOutreaches] = useState<Outreach[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [selectedOutreach, setSelectedOutreach] = useState<Outreach | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    upcoming: 0,
    totalAttendees: 0,
    totalBudget: 0
  });

  useEffect(() => {
    loadOutreaches();
  }, [statusFilter]);

  const loadOutreaches = async () => {
    try {
      setLoading(true);

      // Use the new Outreaches API
      const searchParams = new URLSearchParams();
      if (statusFilter !== 'all') searchParams.set('status', statusFilter);

      const response = await fetch(`/api/outreaches?${searchParams.toString()}`);
      const data = await response.json();

      // Transform API data to match component interface
      const transformedOutreaches = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        slug: item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        content: item.content || item.description || '',
        excerpt: item.excerpt || item.description || '',
        status: item.status || 'published',
        type: 'outreach' as const,
        author: 'Admin',
        publish_date: item.publish_date || item.date || item.created_at,
        featured_image: item.featured_image || item.image || '',
        outreach_details: item.outreach_details || {
          location: item.location || 'Nigeria',
          event_date: item.date || new Date().toISOString(),
          target_audience: 'General Public',
          expected_attendees: item.targetBeneficiaries || item.beneficiaries || 0,
          organizer: 'Saintlammy Foundation',
          contact_info: item.outreach_details?.contact_info || 'info@saintlammyfoundation.org',
          budget: 50000,
          actual_attendees: item.beneficiaries,
          time: item.time || '',
          volunteers_needed: item.volunteersNeeded || 0
        },
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setOutreaches(transformedOutreaches);
      updateStats(transformedOutreaches);
    } catch (error) {
      console.error('Error loading outreaches:', error);

      // Fall back to mock service with outreach-specific data
      const mockOutreaches: Outreach[] = [
        {
          id: 'outreach-1',
          title: 'Community Health Fair',
          slug: 'community-health-fair-2024',
          content: 'Free health screenings, vaccinations, and health education for the local community.',
          excerpt: 'Free health services for the community',
          status: 'published',
          type: 'outreach',
          author: 'Admin',
          publish_date: '2024-03-15T00:00:00Z',
          featured_image: '/images/health-fair.jpg',
          outreach_details: {
            location: 'Community Center, Downtown',
            event_date: '2024-04-15T09:00:00Z',
            target_audience: 'All community members',
            expected_attendees: 500,
            organizer: 'Health Team',
            contact_info: 'health@saintlammy.org',
            budget: 15000,
            actual_attendees: 450
          },
          created_at: '2024-03-01T10:00:00Z',
          updated_at: '2024-03-10T14:30:00Z'
        },
        {
          id: 'outreach-2',
          title: 'Back-to-School Supply Drive',
          slug: 'back-to-school-supplies-2024',
          content: 'Providing free school supplies to students from low-income families.',
          excerpt: 'Free school supplies for students in need',
          status: 'published',
          type: 'outreach',
          author: 'Admin',
          publish_date: '2024-07-01T00:00:00Z',
          featured_image: '/images/school-supplies.jpg',
          outreach_details: {
            location: 'Various Schools District-wide',
            event_date: '2024-08-15T08:00:00Z',
            target_audience: 'Students K-12',
            expected_attendees: 1200,
            organizer: 'Education Team',
            contact_info: 'education@saintlammy.org',
            budget: 25000,
            actual_attendees: 1150
          },
          created_at: '2024-06-15T09:00:00Z',
          updated_at: '2024-07-05T16:45:00Z'
        },
        {
          id: 'outreach-3',
          title: 'Holiday Food Distribution',
          slug: 'holiday-food-distribution-2024',
          content: 'Distribution of holiday meal packages to families in need.',
          excerpt: 'Holiday meals for families in need',
          status: 'draft',
          type: 'outreach',
          author: 'Admin',
          publish_date: null,
          featured_image: '/images/food-distribution.jpg',
          outreach_details: {
            location: 'Foundation Main Office',
            event_date: '2024-12-20T10:00:00Z',
            target_audience: 'Families in need',
            expected_attendees: 800,
            organizer: 'Community Outreach Team',
            contact_info: 'outreach@saintlammy.org',
            budget: 35000
          },
          created_at: '2024-10-01T11:00:00Z',
          updated_at: '2024-10-15T13:20:00Z'
        }
      ];

      const filteredOutreaches = statusFilter === 'all'
        ? mockOutreaches
        : mockOutreaches.filter(o => o.status === statusFilter);

      setOutreaches(filteredOutreaches);
      updateStats(filteredOutreaches);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (outreachData: Outreach[]) => {
    const now = new Date();
    const upcoming = outreachData.filter(o =>
      o.outreach_details?.event_date && new Date(o.outreach_details.event_date) > now
    ).length;

    const stats = {
      total: outreachData.length,
      published: outreachData.filter(o => o.status === 'published').length,
      upcoming: upcoming,
      totalAttendees: outreachData.reduce((sum, o) =>
        sum + (o.outreach_details?.actual_attendees || o.outreach_details?.expected_attendees || 0), 0
      ),
      totalBudget: outreachData.reduce((sum, o) => sum + (o.outreach_details?.budget || 0), 0)
    };
    setStats(stats);
  };

  const handleSaveOutreach = async (outreachData: any) => {
    try {
      if (selectedOutreach) {
        // Update existing outreach
        const response = await fetch(`/api/outreaches?id=${selectedOutreach.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(outreachData),
        });

        if (response.ok) {
          const updatedOutreaches = outreaches.map(o =>
            o.id === selectedOutreach.id ? { ...o, ...outreachData, updated_at: new Date().toISOString() } : o
          );
          setOutreaches(updatedOutreaches);
          updateStats(updatedOutreaches);
        } else {
          throw new Error('Failed to update outreach');
        }
      } else {
        // Create new outreach
        const response = await fetch('/api/outreaches', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(outreachData),
        });

        if (response.ok) {
          const createdOutreach = await response.json();
          const newOutreach: Outreach = {
            id: createdOutreach.id || `outreach-${Date.now()}`,
            ...outreachData,
            type: 'outreach',
            author: 'Admin',
            outreach_details: outreachData.outreach_details || {
              location: '',
              event_date: '',
              target_audience: '',
              expected_attendees: 0,
              organizer: '',
              contact_info: '',
              budget: 0
            },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
          const updatedOutreaches = [newOutreach, ...outreaches];
          setOutreaches(updatedOutreaches);
          updateStats(updatedOutreaches);
        } else {
          throw new Error('Failed to create outreach');
        }
      }

      setShowEditor(false);
      setSelectedOutreach(null);
    } catch (error) {
      console.error('Error saving outreach:', error);
      alert('Failed to save outreach. Please try again.');
    }
  };

  const handleDeleteOutreach = async (outreachId: string) => {
    if (!confirm('Are you sure you want to delete this outreach? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/outreaches?id=${outreachId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedOutreaches = outreaches.filter(o => o.id !== outreachId);
        setOutreaches(updatedOutreaches);
        updateStats(updatedOutreaches);
      } else {
        throw new Error('Failed to delete outreach');
      }
    } catch (error) {
      console.error('Error deleting outreach:', error);
      alert('Failed to delete outreach. Please try again.');
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'published':
        return `${baseClasses} bg-green-500/20 text-green-400`;
      case 'draft':
        return `${baseClasses} bg-yellow-500/20 text-yellow-400`;
      case 'archived':
        return `${baseClasses} bg-gray-500/20 text-gray-600 dark:text-gray-400`;
      default:
        return `${baseClasses} bg-blue-500/20 text-blue-400`;
    }
  };

  const isUpcoming = (eventDate: string) => {
    return new Date(eventDate) > new Date();
  };

  const filteredOutreaches = outreaches.filter(outreach => {
    const matchesSearch = outreach.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         outreach.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         outreach.outreach_details?.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      <Head>
        <title>Outreaches Management - Admin Dashboard</title>
        <meta name="description" content="Manage community outreach events and initiatives" />
      </Head>

      <AdminLayout title="Outreaches Management">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Outreaches</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <Heart className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Published</p>
                  <p className="text-2xl font-bold text-green-400">{stats.published}</p>
                </div>
                <Target className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Upcoming</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.upcoming}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Attendees</p>
                  <p className="text-2xl font-bold text-purple-400">{stats.totalAttendees.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Budget</p>
                  <p className="text-2xl font-bold text-yellow-400">${(stats.totalBudget / 1000).toFixed(0)}K</p>
                </div>
                <MapPin className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search outreaches..."
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
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <button
                onClick={() => {
                  setSelectedOutreach(null);
                  setShowEditor(true);
                }}
                className="bg-accent-500 hover:bg-accent-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Outreach
              </button>
            </div>
          </div>

          {/* Outreaches List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Outreach Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Location & Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Attendees
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-600 dark:text-gray-400">
                        Loading outreaches...
                      </td>
                    </tr>
                  ) : filteredOutreaches.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-600 dark:text-gray-400">
                        No outreaches found. <button onClick={() => setShowEditor(true)} className="text-accent-400 hover:text-accent-300">Create your first outreach</button>
                      </td>
                    </tr>
                  ) : (
                    filteredOutreaches.map((outreach) => (
                      <tr key={outreach.id} className="hover:bg-gray-50 dark:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                              {outreach.title}
                              {isUpcoming(outreach.outreach_details?.event_date || '') && (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400">
                                  Upcoming
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{outreach.excerpt}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Organizer: {outreach.outreach_details?.organizer || 'Not specified'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm text-gray-900 dark:text-white flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {outreach.outreach_details?.location || 'TBD'}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {outreach.outreach_details?.event_date
                                ? new Date(outreach.outreach_details.event_date).toLocaleDateString()
                                : 'TBD'
                              }
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            <div>Expected: {outreach.outreach_details?.expected_attendees?.toLocaleString() || '0'}</div>
                            {outreach.outreach_details?.actual_attendees && (
                              <div className="text-green-400">
                                Actual: {outreach.outreach_details.actual_attendees.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          ${(outreach.outreach_details?.budget || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(outreach.status)}>
                            {outreach.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedOutreach(outreach);
                                setShowEditor(true);
                              }}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                              title="Edit Outreach"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {outreach.status === 'published' && (
                              <>
                                <Link
                                  href={`/outreach/${outreach.id}`}
                                  target="_blank"
                                  className="text-accent-400 hover:text-accent-300 transition-colors"
                                  title="View Full Report"
                                >
                                  <FileText className="w-4 h-4" />
                                </Link>
                                <button className="text-green-400 hover:text-green-300 transition-colors" title="Preview">
                                  <Eye className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Outreach Editor Modal */}
        {showEditor && (
          <OutreachEditor
            isOpen={showEditor}
            initialData={selectedOutreach}
            mode={selectedOutreach ? 'edit' : 'create'}
            onSave={handleSaveOutreach}
            onClose={() => {
              setShowEditor(false);
              setSelectedOutreach(null);
            }}
          />
        )}
      </AdminLayout>
    </>
  );
};

export default OutreachesManagement;
