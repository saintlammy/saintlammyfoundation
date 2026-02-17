import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import NewsEditor from '@/components/admin/NewsEditor';
import { Newspaper, Heart, Users, Award, Plus, Search, Edit, Eye, Calendar, Clock } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published' | 'archived';
  type: 'news';
  author: string;
  publish_date: string | null;
  featured_image: string;
  news_details: {
    category: 'outreach' | 'achievement' | 'partnership' | 'update' | 'announcement';
    read_time: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    tags: string[];
  };
  created_at: string;
  updated_at: string;
}

const NewsManagement: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    outreach: 0,
    achievement: 0,
    partnership: 0,
    urgent: 0
  });

  useEffect(() => {
    loadNews();
  }, [statusFilter, categoryFilter, priorityFilter]);

  const loadNews = async () => {
    try {
      setLoading(true);

      // Try API first, fall back to mock data
      try {
        const searchParams = new URLSearchParams({
          type: 'news',
          status: statusFilter === 'all' ? '' : statusFilter,
          category: categoryFilter === 'all' ? '' : categoryFilter,
          priority: priorityFilter === 'all' ? '' : priorityFilter,
          search: searchTerm
        });

        const response = await fetch(`/api/content?${searchParams.toString()}`, {
          headers: { 'Authorization': 'Bearer admin-token' }
        });

        const result = await response.json();
        if (result.success) {
          setNewsItems(result.data);
          updateStats(result.data);
          return;
        }
      } catch (apiError) {
        console.warn('API failed, falling back to mock data:', apiError);
      }

      // Fall back to mock data
      const mockNews: NewsItem[] = [
        {
          id: 'news-1',
          title: 'December Medical Outreach Reaches 200+ Families',
          slug: 'december-medical-outreach-200-families',
          content: 'Our largest medical outreach program provided comprehensive healthcare services to over 200 families in rural Ogun State. The three-day program included free health screenings, medications, health education, and referrals to specialized care...',
          excerpt: 'Our largest medical outreach program provided free health screenings, medications, and health education to over 200 families in rural Ogun State.',
          status: 'published',
          type: 'news',
          author: 'Admin',
          publish_date: '2024-12-15T00:00:00Z',
          featured_image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
          news_details: {
            category: 'outreach',
            read_time: '3 min read',
            priority: 'high',
            tags: ['medical', 'outreach', 'healthcare', 'community']
          },
          created_at: '2024-12-10T10:00:00Z',
          updated_at: '2024-12-15T14:30:00Z'
        },
        {
          id: 'news-2',
          title: 'Partnership with Local Schools Expands Education Access',
          slug: 'partnership-schools-education-access',
          content: 'We are excited to announce new partnerships with 5 primary schools across Lagos and Ogun states. These partnerships will provide educational materials, scholarships, and mentorship programs for 150 orphaned children...',
          excerpt: 'New partnerships with 5 primary schools will provide educational materials, scholarships, and mentorship programs for 150 orphaned children.',
          status: 'published',
          type: 'news',
          author: 'Admin',
          publish_date: '2024-12-10T00:00:00Z',
          featured_image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
          news_details: {
            category: 'partnership',
            read_time: '4 min read',
            priority: 'medium',
            tags: ['education', 'partnership', 'schools', 'orphans']
          },
          created_at: '2024-12-05T09:00:00Z',
          updated_at: '2024-12-10T16:45:00Z'
        },
        {
          id: 'news-3',
          title: 'Widow Empowerment Program Celebrates 50 New Businesses',
          slug: 'widow-empowerment-50-new-businesses',
          content: 'Our widow empowerment program has achieved a major milestone with 50 widows successfully launching small businesses through micro-loans and business training. These new entrepreneurs are now achieving financial independence...',
          excerpt: 'Through micro-loans and business training, 50 widows have successfully launched small businesses, achieving financial independence for their families.',
          status: 'published',
          type: 'news',
          author: 'Admin',
          publish_date: '2024-12-05T00:00:00Z',
          featured_image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
          news_details: {
            category: 'achievement',
            read_time: '2 min read',
            priority: 'medium',
            tags: ['widow', 'empowerment', 'business', 'success']
          },
          created_at: '2024-12-01T11:00:00Z',
          updated_at: '2024-12-05T13:20:00Z'
        },
        {
          id: 'news-4',
          title: 'Emergency Appeal: Support Flood Victims in Bayelsa',
          slug: 'emergency-appeal-flood-victims-bayelsa',
          content: 'Following severe flooding in Bayelsa State, we are launching an emergency response to provide immediate relief to affected families. We need urgent donations to provide food, shelter, and medical supplies...',
          excerpt: 'Emergency response launched to provide immediate relief to flood victims in Bayelsa State. Urgent donations needed for food, shelter, and medical supplies.',
          status: 'draft',
          type: 'news',
          author: 'Admin',
          publish_date: null,
          featured_image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
          news_details: {
            category: 'announcement',
            read_time: '5 min read',
            priority: 'urgent',
            tags: ['emergency', 'flood', 'relief', 'donations']
          },
          created_at: '2024-12-18T11:00:00Z',
          updated_at: '2024-12-18T15:30:00Z'
        }
      ];

      const filteredNews = mockNews.filter(news => {
        const matchesStatus = statusFilter === 'all' || news.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || news.news_details.category === categoryFilter;
        const matchesPriority = priorityFilter === 'all' || news.news_details.priority === priorityFilter;
        return matchesStatus && matchesCategory && matchesPriority;
      });

      setNewsItems(filteredNews);
      updateStats(filteredNews);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (newsData: NewsItem[]) => {
    const stats = {
      total: newsData.length,
      published: newsData.filter(n => n.status === 'published').length,
      draft: newsData.filter(n => n.status === 'draft').length,
      outreach: newsData.filter(n => n.news_details.category === 'outreach').length,
      achievement: newsData.filter(n => n.news_details.category === 'achievement').length,
      partnership: newsData.filter(n => n.news_details.category === 'partnership').length,
      urgent: newsData.filter(n => n.news_details.priority === 'urgent').length
    };
    setStats(stats);
  };

  const handleSaveNews = async (newsData: any) => {
    try {
      if (selectedNews) {
        // Update existing news
        const updatedNews = newsItems.map(n =>
          n.id === selectedNews.id ? { ...n, ...newsData } : n
        );
        setNewsItems(updatedNews);
        updateStats(updatedNews);
      } else {
        // Create new news
        const newNews: NewsItem = {
          id: `news-${Date.now()}`,
          ...newsData,
          type: 'news',
          author: 'Admin',
          news_details: newsData.news_details || {
            category: 'update',
            read_time: '3 min read',
            priority: 'medium',
            tags: []
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        const updatedNews = [newNews, ...newsItems];
        setNewsItems(updatedNews);
        updateStats(updatedNews);
      }

      setShowEditor(false);
      setSelectedNews(null);
    } catch (error) {
      console.error('Error saving news:', error);
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
      case 'outreach':
        return `${baseClasses} bg-red-500/20 text-red-400`;
      case 'achievement':
        return `${baseClasses} bg-green-500/20 text-green-400`;
      case 'partnership':
        return `${baseClasses} bg-blue-500/20 text-blue-400`;
      case 'announcement':
        return `${baseClasses} bg-purple-500/20 text-purple-400`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-600 dark:text-gray-400`;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (priority) {
      case 'urgent':
        return `${baseClasses} bg-red-500/20 text-red-400`;
      case 'high':
        return `${baseClasses} bg-orange-500/20 text-orange-400`;
      case 'medium':
        return `${baseClasses} bg-yellow-500/20 text-yellow-400`;
      case 'low':
        return `${baseClasses} bg-green-500/20 text-green-400`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-600 dark:text-gray-400`;
    }
  };

  const filteredNews = newsItems.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.news_details.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  return (
    <>
      <Head>
        <title>News Management - Admin Dashboard</title>
        <meta name="description" content="Manage news articles, updates, and announcements" />
      </Head>

      <AdminLayout title="News Management">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Articles</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <Newspaper className="w-8 h-8 text-blue-500" />
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
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Outreach</p>
                  <p className="text-2xl font-bold text-red-400">{stats.outreach}</p>
                </div>
                <Heart className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Achievements</p>
                  <p className="text-2xl font-bold text-green-400">{stats.achievement}</p>
                </div>
                <Award className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Partnerships</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.partnership}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Urgent</p>
                  <p className="text-2xl font-bold text-red-400">{stats.urgent}</p>
                </div>
                <Clock className="w-8 h-8 text-red-500" />
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
                    placeholder="Search news..."
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
                  <option value="outreach">Outreach</option>
                  <option value="achievement">Achievement</option>
                  <option value="partnership">Partnership</option>
                  <option value="update">Update</option>
                  <option value="announcement">Announcement</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500"
                >
                  <option value="all">All Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <button
                onClick={() => {
                  setSelectedNews(null);
                  setShowEditor(true);
                }}
                className="bg-accent-500 hover:bg-accent-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Article
              </button>
            </div>
          </div>

          {/* News List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Article
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Publish Date
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
                        Loading news articles...
                      </td>
                    </tr>
                  ) : filteredNews.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-600 dark:text-gray-400">
                        No articles found. <button onClick={() => setShowEditor(true)} className="text-accent-400 hover:text-accent-300">Create your first article</button>
                      </td>
                    </tr>
                  ) : (
                    filteredNews.map((news) => (
                      <tr key={news.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{news.title}</div>
                            <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                              {news.excerpt}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {news.news_details.read_time}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getCategoryBadge(news.news_details.category)}>
                            {news.news_details.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getPriorityBadge(news.news_details.priority)}>
                            {news.news_details.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(news.status)}>
                            {news.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {news.publish_date
                            ? new Date(news.publish_date).toLocaleDateString()
                            : 'Not scheduled'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedNews(news);
                                setShowEditor(true);
                              }}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {news.status === 'published' && (
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

        {/* News Editor Modal */}
        {showEditor && (
          <NewsEditor
            isOpen={showEditor}
            news={selectedNews}
            onSave={handleSaveNews}
            onClose={() => {
              setShowEditor(false);
              setSelectedNews(null);
            }}
          />
        )}
      </AdminLayout>
    </>
  );
};

export default NewsManagement;