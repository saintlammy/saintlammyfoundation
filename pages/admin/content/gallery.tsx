import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import GalleryEditor from '@/components/admin/GalleryEditor';
import { Image as ImageIcon, Users, GraduationCap, Heart, Home, Plus, Search, Edit, Eye, Calendar, Camera } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published' | 'archived';
  type: 'gallery';
  author: string;
  publish_date: string | null;
  featured_image: string;
  gallery_details: {
    category: 'education' | 'healthcare' | 'empowerment' | 'infrastructure' | 'outreach';
    project_date: string;
    location: string;
    beneficiaries_count: number;
    project_cost: number;
    gallery_images: string[];
  };
  created_at: string;
  updated_at: string;
}

const GalleryManagement: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<GalleryItem | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    education: 0,
    healthcare: 0,
    empowerment: 0,
    infrastructure: 0,
    totalBeneficiaries: 0,
    totalCost: 0
  });

  useEffect(() => {
    loadGallery();
  }, [statusFilter, categoryFilter]);

  const loadGallery = async () => {
    try {
      setLoading(true);

      // Try API first, fall back to mock data
      try {
        const searchParams = new URLSearchParams({
          type: 'gallery',
          status: statusFilter === 'all' ? '' : statusFilter,
          category: categoryFilter === 'all' ? '' : categoryFilter,
          search: searchTerm
        });

        const response = await fetch(`/api/content?${searchParams.toString()}`, {
          headers: { 'Authorization': 'Bearer admin-token' }
        });

        const result = await response.json();
        if (result.success) {
          setGalleryItems(result.data);
          updateStats(result.data);
          return;
        }
      } catch (apiError) {
        console.warn('API failed, falling back to mock data:', apiError);
      }

      // Fall back to mock data
      const mockGallery: GalleryItem[] = [
        {
          id: 'gallery-1',
          title: 'Education Program Launch at Hope Children Home',
          slug: 'education-program-hope-children-home',
          content: 'A comprehensive documentation of our education program launch at Hope Children Home, featuring the new computer lab and digital literacy training...',
          excerpt: 'New computer lab opening at Hope Children Home, providing digital literacy training to 50+ children.',
          status: 'published',
          type: 'gallery',
          author: 'Admin',
          publish_date: '2024-03-15T00:00:00Z',
          featured_image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
          gallery_details: {
            category: 'education',
            project_date: '2024-03-15',
            location: 'Hope Children Home, Lagos',
            beneficiaries_count: 50,
            project_cost: 150000,
            gallery_images: [
              'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            ]
          },
          created_at: '2024-03-10T10:00:00Z',
          updated_at: '2024-03-15T14:30:00Z'
        },
        {
          id: 'gallery-2',
          title: 'Clean Water Project in Rural Communities',
          slug: 'clean-water-project-rural-communities',
          content: 'Documentation of our clean water installation project serving 200+ families in rural communities...',
          excerpt: 'Installing clean water systems in rural communities, providing safe drinking water to 200+ families.',
          status: 'published',
          type: 'gallery',
          author: 'Admin',
          publish_date: '2024-02-01T00:00:00Z',
          featured_image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
          gallery_details: {
            category: 'healthcare',
            project_date: '2024-02-01',
            location: 'Ogun State Rural Communities',
            beneficiaries_count: 200,
            project_cost: 280000,
            gallery_images: [
              'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            ]
          },
          created_at: '2024-01-25T09:00:00Z',
          updated_at: '2024-02-01T16:45:00Z'
        },
        {
          id: 'gallery-3',
          title: 'Widow Empowerment Skills Training Program',
          slug: 'widow-empowerment-skills-training',
          content: 'Photo documentation of our widow empowerment program, showcasing skills training and business development...',
          excerpt: 'Skills training program helping widows start small businesses and become financially independent.',
          status: 'published',
          type: 'gallery',
          author: 'Admin',
          publish_date: '2024-01-15T00:00:00Z',
          featured_image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
          gallery_details: {
            category: 'empowerment',
            project_date: '2024-01-15',
            location: 'Ibadan, Oyo State',
            beneficiaries_count: 75,
            project_cost: 95000,
            gallery_images: [
              'https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            ]
          },
          created_at: '2024-01-10T11:00:00Z',
          updated_at: '2024-01-15T13:20:00Z'
        },
        {
          id: 'gallery-4',
          title: 'Grace Orphanage Complete Renovation',
          slug: 'grace-orphanage-renovation',
          content: 'Before and after documentation of the complete renovation of Grace Orphanage facilities...',
          excerpt: 'Complete renovation of Grace Orphanage, creating safer and healthier living spaces for 30 children.',
          status: 'draft',
          type: 'gallery',
          author: 'Admin',
          publish_date: null,
          featured_image: 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80',
          gallery_details: {
            category: 'infrastructure',
            project_date: '2023-12-15',
            location: 'Grace Orphanage, Abuja',
            beneficiaries_count: 30,
            project_cost: 450000,
            gallery_images: [
              'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            ]
          },
          created_at: '2023-12-10T11:00:00Z',
          updated_at: '2023-12-20T15:30:00Z'
        }
      ];

      const filteredGallery = mockGallery.filter(item => {
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || item.gallery_details.category === categoryFilter;
        return matchesStatus && matchesCategory;
      });

      setGalleryItems(filteredGallery);
      updateStats(filteredGallery);
    } catch (error) {
      console.error('Error loading gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (galleryData: GalleryItem[]) => {
    const stats = {
      total: galleryData.length,
      published: galleryData.filter(g => g.status === 'published').length,
      draft: galleryData.filter(g => g.status === 'draft').length,
      education: galleryData.filter(g => g.gallery_details.category === 'education').length,
      healthcare: galleryData.filter(g => g.gallery_details.category === 'healthcare').length,
      empowerment: galleryData.filter(g => g.gallery_details.category === 'empowerment').length,
      infrastructure: galleryData.filter(g => g.gallery_details.category === 'infrastructure').length,
      totalBeneficiaries: galleryData.reduce((sum, g) => sum + (g.gallery_details.beneficiaries_count || 0), 0),
      totalCost: galleryData.reduce((sum, g) => sum + (g.gallery_details.project_cost || 0), 0)
    };
    setStats(stats);
  };

  const handleSaveGallery = async (galleryData: any) => {
    try {
      if (selectedGallery) {
        // Update existing gallery
        const updatedGallery = galleryItems.map(g =>
          g.id === selectedGallery.id ? { ...g, ...galleryData } : g
        );
        setGalleryItems(updatedGallery);
        updateStats(updatedGallery);
      } else {
        // Create new gallery
        const newGallery: GalleryItem = {
          id: `gallery-${Date.now()}`,
          ...galleryData,
          type: 'gallery',
          author: 'Admin',
          gallery_details: galleryData.gallery_details || {
            category: 'education',
            project_date: new Date().toISOString().split('T')[0],
            location: '',
            beneficiaries_count: 0,
            project_cost: 0,
            gallery_images: []
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        const updatedGallery = [newGallery, ...galleryItems];
        setGalleryItems(updatedGallery);
        updateStats(updatedGallery);
      }

      setShowEditor(false);
      setSelectedGallery(null);
    } catch (error) {
      console.error('Error saving gallery:', error);
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

  const getCategoryBadge = (category: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (category) {
      case 'education':
        return `${baseClasses} bg-blue-500/20 text-blue-400`;
      case 'healthcare':
        return `${baseClasses} bg-red-500/20 text-red-400`;
      case 'empowerment':
        return `${baseClasses} bg-purple-500/20 text-purple-400`;
      case 'infrastructure':
        return `${baseClasses} bg-orange-500/20 text-orange-400`;
      case 'outreach':
        return `${baseClasses} bg-green-500/20 text-green-400`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-600 dark:text-gray-400`;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'education':
        return GraduationCap;
      case 'healthcare':
        return Heart;
      case 'empowerment':
        return Users;
      case 'infrastructure':
        return Home;
      default:
        return ImageIcon;
    }
  };

  const filteredGallery = galleryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.gallery_details.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      <Head>
        <title>Impact Gallery Management - Admin Dashboard</title>
        <meta name="description" content="Manage impact gallery and project documentation" />
      </Head>

      <AdminLayout title="Impact Gallery Management">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <Camera className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Published</p>
                  <p className="text-2xl font-bold text-green-400">{stats.published}</p>
                </div>
                <Eye className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Drafts</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.draft}</p>
                </div>
                <Edit className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Education</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.education}</p>
                </div>
                <GraduationCap className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Healthcare</p>
                  <p className="text-2xl font-bold text-red-400">{stats.healthcare}</p>
                </div>
                <Heart className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Empowerment</p>
                  <p className="text-2xl font-bold text-purple-400">{stats.empowerment}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Beneficiaries</p>
                  <p className="text-2xl font-bold text-green-400">{stats.totalBeneficiaries.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Cost</p>
                  <p className="text-2xl font-bold text-yellow-400">₦{(stats.totalCost / 1000).toFixed(0)}K</p>
                </div>
                <Home className="w-8 h-8 text-yellow-500" />
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
                    placeholder="Search gallery projects..."
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
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500"
                >
                  <option value="all">All Categories</option>
                  <option value="education">Education</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="empowerment">Empowerment</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="outreach">Outreach</option>
                </select>
              </div>
              <button
                onClick={() => {
                  setSelectedGallery(null);
                  setShowEditor(true);
                }}
                className="bg-accent-500 hover:bg-accent-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </button>
            </div>
          </div>

          {/* Gallery List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Beneficiaries
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Cost
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
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-600 dark:text-gray-400">
                        Loading gallery projects...
                      </td>
                    </tr>
                  ) : filteredGallery.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-600 dark:text-gray-400">
                        No projects found. <button onClick={() => setShowEditor(true)} className="text-accent-400 hover:text-accent-300">Create your first project</button>
                      </td>
                    </tr>
                  ) : (
                    filteredGallery.map((item) => {
                      const CategoryIcon = getCategoryIcon(item.gallery_details.category);
                      return (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-4">
                                <CategoryIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</div>
                                <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                                  {item.excerpt}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                  {item.gallery_details.gallery_images.length} images
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={getCategoryBadge(item.gallery_details.category)}>
                              {item.gallery_details.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {item.gallery_details.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {item.gallery_details.beneficiaries_count.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            ₦{item.gallery_details.project_cost.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={getStatusBadge(item.status)}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedGallery(item);
                                  setShowEditor(true);
                                }}
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              {item.status === 'published' && (
                                <button className="text-green-400 hover:text-green-300 transition-colors">
                                  <Eye className="w-4 h-4" />
                                </button>
                              )}
                              <button className="text-purple-400 hover:text-purple-300 transition-colors">
                                <ImageIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Gallery Editor Modal */}
        {showEditor && (
          <GalleryEditor
            isOpen={showEditor}
            item={selectedGallery}
            onSave={handleSaveGallery}
            onClose={() => {
              setShowEditor(false);
              setSelectedGallery(null);
            }}
          />
        )}
      </AdminLayout>
    </>
  );
};

export default GalleryManagement;