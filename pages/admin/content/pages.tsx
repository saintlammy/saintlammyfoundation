import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import ContentEditor from '@/components/admin/ContentEditor';
import { Globe, Edit, Eye, Plus, Search, Filter, Calendar, FileText, ExternalLink } from 'lucide-react';
// ContentService import removed - using direct API calls and mock data

interface ContentPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published' | 'archived';
  type: 'page' | 'post' | 'program' | 'outreach';
  author: string;
  publish_date: string | null;
  seo_title: string;
  seo_description: string;
  featured_image: string;
  created_at: string;
  updated_at: string;
}

const PagesManagement: React.FC = () => {
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [selectedPage, setSelectedPage] = useState<ContentPage | null>(null);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, archived: 0 });

  useEffect(() => {
    loadPages();
  }, [statusFilter]);

  const loadPages = async () => {
    try {
      setLoading(true);

      // Try API first, fall back to mock data
      try {
        const searchParams = new URLSearchParams({
          type: 'page',
          status: statusFilter === 'all' ? '' : statusFilter,
          search: searchTerm
        });

        const response = await fetch(`/api/content?${searchParams.toString()}`, {
          headers: { 'Authorization': 'Bearer admin-token' }
        });

        const result = await response.json();
        if (result.success) {
          setPages(result.data);
          updateStats(result.data);
          return;
        }
      } catch (apiError) {
        console.warn('API failed, falling back to mock data:', apiError);
      }

      // Fall back to mock data
      const mockPages: ContentPage[] = [
        {
          id: 'page-about',
          title: 'About Our Foundation',
          slug: 'about',
          content: 'Learn about our mission, values, and impact in the community...',
          excerpt: 'Discover our story and commitment to social change',
          status: 'published',
          type: 'page',
          author: 'Admin',
          publish_date: '2024-01-15T00:00:00Z',
          seo_title: 'About Saintlammy Foundation',
          seo_description: 'Learn about our mission to create positive change',
          featured_image: '/images/about-hero.jpg',
          created_at: '2024-01-10T10:00:00Z',
          updated_at: '2024-01-15T14:30:00Z'
        },
        {
          id: 'page-beneficiaries',
          title: 'Our Beneficiaries',
          slug: 'beneficiaries',
          content: 'Meet the children, widows, and families we support across Nigeria...',
          excerpt: 'Every face tells a story of hope, resilience, and potential',
          status: 'published',
          type: 'page',
          author: 'Admin',
          publish_date: '2024-01-20T00:00:00Z',
          seo_title: 'Our Beneficiaries - Saintlammy Foundation',
          seo_description: 'Meet the children, widows, and families we support. Learn their stories and consider sponsoring a life.',
          featured_image: '/images/beneficiaries-hero.jpg',
          created_at: '2024-01-18T09:00:00Z',
          updated_at: '2024-01-20T16:45:00Z'
        },
        {
          id: 'page-sponsor',
          title: 'Sponsor a Life',
          slug: 'sponsor',
          content: 'Create lasting change through direct sponsorship of orphans, widows, and vulnerable families...',
          excerpt: 'Transform futures through direct sponsorship programs',
          status: 'published',
          type: 'page',
          author: 'Admin',
          publish_date: '2024-01-25T00:00:00Z',
          seo_title: 'Sponsor a Life - Transform Futures | Saintlammy Foundation',
          seo_description: 'Sponsor an orphan, widow, or vulnerable family in Nigeria. Create lasting impact through direct sponsorship programs.',
          featured_image: '/images/sponsor-hero.jpg',
          created_at: '2024-01-23T10:00:00Z',
          updated_at: '2024-01-25T14:20:00Z'
        },
        {
          id: 'page-news',
          title: 'News & Updates',
          slug: 'news',
          content: 'Stay informed about our latest programs, impact stories, and community developments...',
          excerpt: 'Latest news and updates from our programs',
          status: 'published',
          type: 'page',
          author: 'Admin',
          publish_date: '2024-02-01T00:00:00Z',
          seo_title: 'News & Updates - Saintlammy Foundation',
          seo_description: 'Stay informed about our latest programs, impact stories, and community developments',
          featured_image: '/images/news-hero.jpg',
          created_at: '2024-01-28T11:00:00Z',
          updated_at: '2024-02-01T13:30:00Z'
        },
        {
          id: 'page-programs',
          title: 'Our Programs',
          slug: 'programs',
          content: 'Comprehensive programs addressing education, healthcare, empowerment, and community development...',
          excerpt: 'Discover our comprehensive support programs',
          status: 'published',
          type: 'page',
          author: 'Admin',
          publish_date: '2024-02-05T00:00:00Z',
          seo_title: 'Our Programs - Saintlammy Foundation',
          seo_description: 'Comprehensive programs addressing education, healthcare, empowerment, and community development',
          featured_image: '/images/programs-hero.jpg',
          created_at: '2024-02-03T09:30:00Z',
          updated_at: '2024-02-05T15:15:00Z'
        },
        {
          id: 'page-volunteer',
          title: 'Volunteer With Us',
          slug: 'volunteer',
          content: 'Join our mission and help create lasting change in Nigerian communities...',
          excerpt: 'Multiple opportunities to volunteer and make impact',
          status: 'published',
          type: 'page',
          author: 'Admin',
          publish_date: '2024-02-08T00:00:00Z',
          seo_title: 'Volunteer With Us - Saintlammy Foundation',
          seo_description: 'Join our mission and help create lasting change. Multiple volunteer opportunities available.',
          featured_image: '/images/volunteer-hero.jpg',
          created_at: '2024-02-06T12:00:00Z',
          updated_at: '2024-02-08T17:45:00Z'
        },
        {
          id: 'page-partner',
          title: 'Partner With Us',
          slug: 'partner',
          content: 'Strategic partnerships to amplify our impact and reach more communities...',
          excerpt: 'Join us as a strategic partner in creating change',
          status: 'published',
          type: 'page',
          author: 'Admin',
          publish_date: '2024-02-10T00:00:00Z',
          seo_title: 'Partner With Us - Saintlammy Foundation',
          seo_description: 'Strategic partnerships to amplify our impact and reach more communities',
          featured_image: '/images/partner-hero.jpg',
          created_at: '2024-02-08T14:00:00Z',
          updated_at: '2024-02-10T11:30:00Z'
        },
        {
          id: 'page-contact',
          title: 'Contact Us',
          slug: 'contact',
          content: 'Get in touch with our team for inquiries, support, or partnership opportunities...',
          excerpt: 'Multiple ways to reach our team',
          status: 'published',
          type: 'page',
          author: 'Admin',
          publish_date: '2024-02-12T00:00:00Z',
          seo_title: 'Contact Us - Saintlammy Foundation',
          seo_description: 'Get in touch with our team for inquiries, support, or partnership opportunities',
          featured_image: '/images/contact-hero.jpg',
          created_at: '2024-02-10T16:00:00Z',
          updated_at: '2024-02-12T09:15:00Z'
        },
        {
          id: 'page-privacy',
          title: 'Privacy Policy',
          slug: 'privacy',
          content: 'Our comprehensive privacy policy explaining how we collect, use, and protect your information...',
          excerpt: 'How we protect your privacy and handle personal information',
          status: 'published',
          type: 'page',
          author: 'Admin',
          publish_date: '2024-02-15T00:00:00Z',
          seo_title: 'Privacy Policy - Saintlammy Foundation',
          seo_description: 'Learn how Saintlammy Foundation protects your privacy and handles your personal information',
          featured_image: '/images/privacy-hero.jpg',
          created_at: '2024-02-13T10:00:00Z',
          updated_at: '2024-02-15T14:00:00Z'
        },
        {
          id: 'page-terms',
          title: 'Terms of Service',
          slug: 'terms',
          content: 'Terms and conditions governing your use of our website and services...',
          excerpt: 'Terms and conditions for using our website and services',
          status: 'published',
          type: 'page',
          author: 'Admin',
          publish_date: '2024-02-15T00:00:00Z',
          seo_title: 'Terms of Service - Saintlammy Foundation',
          seo_description: 'Read the terms and conditions for using Saintlammy Foundation website and services',
          featured_image: '/images/terms-hero.jpg',
          created_at: '2024-02-13T11:00:00Z',
          updated_at: '2024-02-15T15:30:00Z'
        },
        {
          id: 'page-transparency',
          title: 'Financial Transparency',
          slug: 'transparency',
          content: 'Complete transparency in our financial operations, fund allocation, and organizational governance...',
          excerpt: 'Our commitment to financial transparency and accountability',
          status: 'published',
          type: 'page',
          author: 'Admin',
          publish_date: '2024-02-18T00:00:00Z',
          seo_title: 'Financial Transparency - Saintlammy Foundation',
          seo_description: 'View our financial transparency reports, fund allocation, and organizational governance',
          featured_image: '/images/transparency-hero.jpg',
          created_at: '2024-02-16T09:00:00Z',
          updated_at: '2024-02-18T16:45:00Z'
        },
        {
          id: 'page-governance',
          title: 'Governance',
          slug: 'governance',
          content: 'Our governance structure, board of directors, policies, and accountability measures...',
          excerpt: 'Strong governance ensuring accountability and effectiveness',
          status: 'published',
          type: 'page',
          author: 'Admin',
          publish_date: '2024-02-20T00:00:00Z',
          seo_title: 'Governance - Saintlammy Foundation',
          seo_description: 'Learn about our governance structure, board of directors, and accountability measures',
          featured_image: '/images/governance-hero.jpg',
          created_at: '2024-02-18T13:00:00Z',
          updated_at: '2024-02-20T10:30:00Z'
        },
        {
          id: 'page-gallery',
          title: 'Impact Gallery',
          slug: 'gallery',
          content: 'Explore our impact gallery showcasing real projects and their outcomes across Nigeria...',
          excerpt: 'See how donations create lasting change in communities',
          status: 'published',
          type: 'page',
          author: 'Admin',
          publish_date: '2024-02-22T00:00:00Z',
          seo_title: 'Impact Gallery - Our Work in Action | Saintlammy Foundation',
          seo_description: 'Explore our impact gallery showcasing real projects and their outcomes across Nigeria',
          featured_image: '/images/gallery-hero.jpg',
          created_at: '2024-02-20T14:00:00Z',
          updated_at: '2024-02-22T11:15:00Z'
        }
      ];

      const filteredPages = statusFilter === 'all'
        ? mockPages
        : mockPages.filter(p => p.status === statusFilter);

      setPages(filteredPages);
      updateStats(filteredPages);
    } catch (error) {
      console.error('Error loading pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (pageData: ContentPage[]) => {
    const stats = {
      total: pageData.length,
      published: pageData.filter(p => p.status === 'published').length,
      draft: pageData.filter(p => p.status === 'draft').length,
      archived: pageData.filter(p => p.status === 'archived').length
    };
    setStats(stats);
  };

  const handleSavePage = async (pageData: any) => {
    try {
      if (selectedPage) {
        // Update existing page
        const updatedPages = pages.map(p =>
          p.id === selectedPage.id ? { ...p, ...pageData } : p
        );
        setPages(updatedPages);
        updateStats(updatedPages);
      } else {
        // Create new page
        const newPage: ContentPage = {
          id: `page-${Date.now()}`,
          ...pageData,
          type: 'page',
          author: 'Admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        const updatedPages = [newPage, ...pages];
        setPages(updatedPages);
        updateStats(updatedPages);
      }

      setShowEditor(false);
      setSelectedPage(null);
    } catch (error) {
      console.error('Error saving page:', error);
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

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      <Head>
        <title>Pages Management - Admin Dashboard</title>
        <meta name="description" content="Manage website pages and content" />
      </Head>

      <AdminLayout title="Pages Management">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Pages</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Published</p>
                  <p className="text-2xl font-bold text-green-400">{stats.published}</p>
                </div>
                <Globe className="w-8 h-8 text-green-500" />
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
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Archived</p>
                  <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.archived}</p>
                </div>
                <Calendar className="w-8 h-8 text-gray-500" />
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
                    placeholder="Search pages..."
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
                  setSelectedPage(null);
                  setShowEditor(true);
                }}
                className="bg-accent-500 hover:bg-accent-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Page
              </button>
            </div>
          </div>

          {/* Pages List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Page
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Author
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
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-600 dark:text-gray-400">
                        Loading pages...
                      </td>
                    </tr>
                  ) : filteredPages.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-600 dark:text-gray-400">
                        No pages found. <button onClick={() => setShowEditor(true)} className="text-accent-400 hover:text-accent-300">Create your first page</button>
                      </td>
                    </tr>
                  ) : (
                    filteredPages.map((page) => (
                      <tr key={page.id} className="hover:bg-gray-50 dark:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{page.title}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">/{page.slug}</div>
                            {page.excerpt && (
                              <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">
                                {page.excerpt}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(page.status)}>
                            {page.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {page.author}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(page.updated_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedPage(page);
                                setShowEditor(true);
                              }}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {page.status === 'published' && (
                              <a
                                href={`/${page.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-400 hover:text-green-300 transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
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
            content={selectedPage}
            onSave={handleSavePage}
            onClose={() => {
              setShowEditor(false);
              setSelectedPage(null);
            }}
          />
        )}
      </AdminLayout>
    </>
  );
};

export default PagesManagement;