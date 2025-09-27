import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import ContentEditor from '@/components/admin/ContentEditor';
import { Heart, Users, Target, Plus, Search, Edit, Eye, Calendar, Award } from 'lucide-react';
// ContentService import removed - using direct mock data

interface Program {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published' | 'archived';
  type: 'program';
  author: string;
  publish_date: string | null;
  featured_image: string;
  program_details: {
    impact_area: string;
    target_beneficiaries: string;
    duration: string;
    budget: number;
    participants_count: number;
  };
  created_at: string;
  updated_at: string;
}

const ProgramsManagement: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    totalParticipants: 0,
    totalBudget: 0
  });

  useEffect(() => {
    loadPrograms();
  }, [statusFilter]);

  const loadPrograms = async () => {
    try {
      setLoading(true);

      // Use the new Programs API
      const searchParams = new URLSearchParams();
      if (statusFilter !== 'all') searchParams.set('status', statusFilter);

      const response = await fetch(`/api/programs?${searchParams.toString()}`);
      const data = await response.json();

      // Transform API data to match component interface
      const transformedPrograms = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        slug: item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        content: item.description || item.content || '',
        excerpt: item.description || '',
        status: item.status || 'published',
        type: 'program' as const,
        author: 'Admin',
        publish_date: item.created_at,
        featured_image: item.image || '',
        program_details: {
          impact_area: item.category || 'General',
          target_beneficiaries: item.targetAudience || 'General Public',
          duration: '12 months',
          budget: 100000,
          participants_count: 100
        },
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setPrograms(transformedPrograms);
      updateStats(transformedPrograms);
    } catch (error) {
      console.error('Error loading programs:', error);

      // Fall back to mock service with program-specific data
      const mockPrograms: Program[] = [
        {
          id: 'prog-1',
          title: 'Education for All Initiative',
          slug: 'education-for-all',
          content: 'Comprehensive education program providing scholarships and resources to underprivileged children.',
          excerpt: 'Empowering children through education',
          status: 'published',
          type: 'program',
          author: 'Admin',
          publish_date: '2024-01-15T00:00:00Z',
          featured_image: '/images/education-program.jpg',
          program_details: {
            impact_area: 'Education',
            target_beneficiaries: 'Children aged 6-18',
            duration: '12 months',
            budget: 250000,
            participants_count: 1200
          },
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-20T14:30:00Z'
        },
        {
          id: 'prog-2',
          title: 'Community Health Outreach',
          slug: 'community-health-outreach',
          content: 'Mobile health clinics serving remote communities with basic healthcare services.',
          excerpt: 'Bringing healthcare to underserved areas',
          status: 'published',
          type: 'program',
          author: 'Admin',
          publish_date: '2024-02-01T00:00:00Z',
          featured_image: '/images/health-program.jpg',
          program_details: {
            impact_area: 'Healthcare',
            target_beneficiaries: 'Rural communities',
            duration: '6 months',
            budget: 180000,
            participants_count: 850
          },
          created_at: '2024-02-01T09:00:00Z',
          updated_at: '2024-02-05T16:45:00Z'
        },
        {
          id: 'prog-3',
          title: 'Youth Skills Development',
          slug: 'youth-skills-development',
          content: 'Vocational training program for young adults to develop marketable skills.',
          excerpt: 'Preparing youth for successful careers',
          status: 'draft',
          type: 'program',
          author: 'Admin',
          publish_date: null,
          featured_image: '/images/skills-program.jpg',
          program_details: {
            impact_area: 'Skills Development',
            target_beneficiaries: 'Youth aged 18-25',
            duration: '8 months',
            budget: 320000,
            participants_count: 600
          },
          created_at: '2024-02-10T11:00:00Z',
          updated_at: '2024-02-12T13:20:00Z'
        }
      ];

      const filteredPrograms = statusFilter === 'all'
        ? mockPrograms
        : mockPrograms.filter(p => p.status === statusFilter);

      setPrograms(filteredPrograms);
      updateStats(filteredPrograms);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (programData: Program[]) => {
    const stats = {
      total: programData.length,
      published: programData.filter(p => p.status === 'published').length,
      draft: programData.filter(p => p.status === 'draft').length,
      totalParticipants: programData.reduce((sum, p) => sum + (p.program_details?.participants_count || 0), 0),
      totalBudget: programData.reduce((sum, p) => sum + (p.program_details?.budget || 0), 0)
    };
    setStats(stats);
  };

  const handleSaveProgram = async (programData: any) => {
    try {
      if (selectedProgram) {
        // Update existing program
        const response = await fetch(`/api/programs?id=${selectedProgram.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(programData),
        });

        if (response.ok) {
          const updatedPrograms = programs.map(p =>
            p.id === selectedProgram.id ? { ...p, ...programData, updated_at: new Date().toISOString() } : p
          );
          setPrograms(updatedPrograms);
          updateStats(updatedPrograms);
        } else {
          throw new Error('Failed to update program');
        }
      } else {
        // Create new program
        const response = await fetch('/api/programs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(programData),
        });

        if (response.ok) {
          const createdProgram = await response.json();
          const newProgram: Program = {
            id: createdProgram.id || `prog-${Date.now()}`,
            ...programData,
            type: 'program',
            author: 'Admin',
            program_details: programData.program_details || {
              impact_area: '',
              target_beneficiaries: '',
              duration: '',
              budget: 0,
              participants_count: 0
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const updatedPrograms = [newProgram, ...programs];
          setPrograms(updatedPrograms);
          updateStats(updatedPrograms);
        } else {
          throw new Error('Failed to create program');
        }
      }

      setShowEditor(false);
      setSelectedProgram(null);
    } catch (error) {
      console.error('Error saving program:', error);
      alert('Failed to save program. Please try again.');
    }
  };

  const handleDeleteProgram = async (programId: string) => {
    if (!confirm('Are you sure you want to delete this program? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/programs?id=${programId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedPrograms = programs.filter(p => p.id !== programId);
        setPrograms(updatedPrograms);
        updateStats(updatedPrograms);
      } else {
        throw new Error('Failed to delete program');
      }
    } catch (error) {
      console.error('Error deleting program:', error);
      alert('Failed to delete program. Please try again.');
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
        return `${baseClasses} bg-gray-500/20 text-gray-400`;
      default:
        return `${baseClasses} bg-blue-500/20 text-blue-400`;
    }
  };

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.program_details?.impact_area.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      <Head>
        <title>Programs Management - Admin Dashboard</title>
        <meta name="description" content="Manage foundation programs and initiatives" />
      </Head>

      <AdminLayout title="Programs Management">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Programs</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <Heart className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Published</p>
                  <p className="text-2xl font-bold text-green-400">{stats.published}</p>
                </div>
                <Target className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Participants</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.totalParticipants.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Budget</p>
                  <p className="text-2xl font-bold text-purple-400">${(stats.totalBudget / 1000).toFixed(0)}K</p>
                </div>
                <Award className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Drafts</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.draft}</p>
                </div>
                <Calendar className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search programs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <button
                onClick={() => {
                  setSelectedProgram(null);
                  setShowEditor(true);
                }}
                className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Program
              </button>
            </div>
          </div>

          {/* Programs List */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Impact Area
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Participants
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
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                        Loading programs...
                      </td>
                    </tr>
                  ) : filteredPrograms.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                        No programs found. <button onClick={() => setShowEditor(true)} className="text-accent-400 hover:text-accent-300">Create your first program</button>
                      </td>
                    </tr>
                  ) : (
                    filteredPrograms.map((program) => (
                      <tr key={program.id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-white">{program.title}</div>
                            <div className="text-sm text-gray-400">{program.excerpt}</div>
                            <div className="text-xs text-gray-500 mt-1">Duration: {program.program_details?.duration || 'Not specified'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400">
                            {program.program_details?.impact_area || 'General'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {program.program_details?.participants_count?.toLocaleString() || '0'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          ${(program.program_details?.budget || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(program.status)}>
                            {program.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedProgram(program);
                                setShowEditor(true);
                              }}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {program.status === 'published' && (
                              <button className="text-green-400 hover:text-green-300 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
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

        {/* Content Editor Modal */}
        {showEditor && (
          <ContentEditor
            isOpen={showEditor}
            content={selectedProgram}
            onSave={handleSaveProgram}
            onClose={() => {
              setShowEditor(false);
              setSelectedProgram(null);
            }}
          />
        )}
      </AdminLayout>
    </>
  );
};

export default ProgramsManagement;
