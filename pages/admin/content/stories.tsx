import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import StoryEditor from '@/components/admin/StoryEditor';
import { Heart, Users, Star, Plus, Search, Edit, Eye, Calendar, Award, Quote, Trash2 } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published' | 'archived';
  type: 'story';
  author: string;
  publish_date: string | null;
  featured_image: string;
  story_details: {
    beneficiary_name: string;
    beneficiary_age?: number;
    location: string;
    category: 'orphan' | 'widow' | 'community';
    quote: string;
    impact: string;
    date_helped: string;
  };
  created_at: string;
  updated_at: string;
}

const StoriesManagement: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    orphan: 0,
    widow: 0,
    community: 0
  });

  useEffect(() => {
    loadStories();
  }, [statusFilter, categoryFilter]);

  const loadStories = async () => {
    try {
      setLoading(true);

      // Use the new Stories API
      const searchParams = new URLSearchParams();
      if (statusFilter !== 'all') searchParams.set('status', statusFilter);

      const response = await fetch(`/api/stories?${searchParams.toString()}`);
      const data = await response.json();

      // Transform API data to match component interface
      const transformedStories = data.map((item: any) => ({
        id: item.id,
        title: item.name ? `${item.name}'s Story` : 'Untitled Story',
        slug: item.id,
        content: item.story || '',
        excerpt: item.story ? item.story.substring(0, 200) + '...' : '',
        status: 'published' as const,
        type: 'story' as const,
        author: 'Admin',
        publish_date: item.dateHelped ? new Date(item.dateHelped).toISOString() : new Date().toISOString(),
        featured_image: item.image || '',
        story_details: {
          beneficiary_name: item.name || '',
          beneficiary_age: item.age,
          location: item.location || '',
          category: item.category || 'orphan',
          quote: item.quote || '',
          impact: item.impact || '',
          date_helped: item.dateHelped || ''
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      setStories(transformedStories);
      updateStats(transformedStories);
    } catch (error) {
      console.error('Error loading stories:', error);

      // Fall back to mock data
      const mockStories: Story[] = [
        {
          id: 'story-1',
          title: 'From Streets to Scholar: Amara\'s Journey',
          slug: 'amara-journey-orphan-support',
          content: 'A detailed story about Amara\'s transformation through our orphan support program...',
          excerpt: 'Amara lost both parents in a car accident when she was 8. Through our orphan support program, she has received consistent education funding, healthcare, and emotional support.',
          status: 'published',
          type: 'story',
          author: 'Admin',
          publish_date: '2024-01-15T00:00:00Z',
          featured_image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          story_details: {
            beneficiary_name: 'Amara N.',
            beneficiary_age: 12,
            location: 'Lagos, Nigeria',
            category: 'orphan',
            quote: 'Before Saintlammy Foundation found me, I thought my dreams of becoming a doctor were impossible. Now I\'m excelling in school and know that anything is possible with the right support.',
            impact: 'Maintained 95% attendance rate and top 10% academic performance',
            date_helped: 'January 2022'
          },
          created_at: '2024-01-10T10:00:00Z',
          updated_at: '2024-01-15T14:30:00Z'
        },
        {
          id: 'story-2',
          title: 'Empowering Independence: Folake\'s Business Success',
          slug: 'folake-widow-empowerment-success',
          content: 'The inspiring story of how our widow empowerment program helped Folake build financial independence...',
          excerpt: 'After losing her husband, Folake struggled to feed her three children. Our widow empowerment program provided monthly stipends and helped her start a small tailoring business.',
          status: 'published',
          type: 'story',
          author: 'Admin',
          publish_date: '2024-02-01T00:00:00Z',
          featured_image: 'https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          story_details: {
            beneficiary_name: 'Mrs. Folake O.',
            beneficiary_age: 34,
            location: 'Ibadan, Nigeria',
            category: 'widow',
            quote: 'The foundation didn\'t just give me money - they gave me hope and the tools to build a better future for my children. My tailoring business now supports my family independently.',
            impact: 'Achieved financial independence and expanded business to employ 3 others',
            date_helped: 'March 2022'
          },
          created_at: '2024-01-25T09:00:00Z',
          updated_at: '2024-02-01T16:45:00Z'
        },
        {
          id: 'story-3',
          title: 'Second Chance: Emmanuel\'s Educational Journey',
          slug: 'emmanuel-education-transformation',
          content: 'How our comprehensive support program transformed Emmanuel from a street child to a university-bound student...',
          excerpt: 'Emmanuel was living on the streets when our outreach team found him. Through our comprehensive support program, he was enrolled in school and provided with safe housing.',
          status: 'draft',
          type: 'story',
          author: 'Admin',
          publish_date: null,
          featured_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          story_details: {
            beneficiary_name: 'Emmanuel A.',
            beneficiary_age: 16,
            location: 'Abuja, Nigeria',
            category: 'orphan',
            quote: 'I never thought I\'d see the inside of a classroom again. Now I\'m preparing for university and want to become an engineer to help build better communities.',
            impact: 'Completed secondary education with honors and received university scholarship',
            date_helped: 'September 2021'
          },
          created_at: '2024-02-10T11:00:00Z',
          updated_at: '2024-02-12T13:20:00Z'
        }
      ];

      const filteredStories = mockStories.filter(story => {
        const matchesStatus = statusFilter === 'all' || story.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || story.story_details.category === categoryFilter;
        return matchesStatus && matchesCategory;
      });

      setStories(filteredStories);
      updateStats(filteredStories);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (storyData: Story[]) => {
    const stats = {
      total: storyData.length,
      published: storyData.filter(s => s.status === 'published').length,
      draft: storyData.filter(s => s.status === 'draft').length,
      orphan: storyData.filter(s => s.story_details.category === 'orphan').length,
      widow: storyData.filter(s => s.story_details.category === 'widow').length,
      community: storyData.filter(s => s.story_details.category === 'community').length
    };
    setStats(stats);
  };

  const handleSaveStory = async (storyData: any) => {
    try {
      if (selectedStory) {
        // Update existing story
        const response = await fetch(`/api/stories?id=${selectedStory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(storyData),
        });

        if (response.ok) {
          const updatedStories = stories.map(s =>
            s.id === selectedStory.id ? { ...s, ...storyData, updated_at: new Date().toISOString() } : s
          );
          setStories(updatedStories);
          updateStats(updatedStories);
        } else {
          throw new Error('Failed to update story');
        }
      } else {
        // Create new story
        const response = await fetch('/api/stories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(storyData),
        });

        if (response.ok) {
          const createdStory = await response.json();
          const newStory: Story = {
            id: createdStory.id || `story-${Date.now()}`,
            ...storyData,
            type: 'story',
            author: 'Admin',
            story_details: storyData.story_details || {
              beneficiary_name: '',
              location: '',
              category: 'orphan',
              quote: '',
              impact: '',
              date_helped: ''
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const updatedStories = [newStory, ...stories];
          setStories(updatedStories);
          updateStats(updatedStories);
        } else {
          throw new Error('Failed to create story');
        }
      }

      setShowEditor(false);
      setSelectedStory(null);
    } catch (error) {
      console.error('Error saving story:', error);
      alert('Failed to save story. Please try again.');
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/stories?id=${storyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedStories = stories.filter(s => s.id !== storyId);
        setStories(updatedStories);
        updateStats(updatedStories);
      } else {
        throw new Error('Failed to delete story');
      }
    } catch (error) {
      console.error('Error deleting story:', error);
      alert('Failed to delete story. Please try again.');
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

  const getCategoryBadge = (category: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (category) {
      case 'orphan':
        return `${baseClasses} bg-blue-500/20 text-blue-400`;
      case 'widow':
        return `${baseClasses} bg-purple-500/20 text-purple-400`;
      case 'community':
        return `${baseClasses} bg-green-500/20 text-green-400`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400`;
    }
  };

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.story_details.beneficiary_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      <Head>
        <title>Success Stories Management - Admin Dashboard</title>
        <meta name="description" content="Manage success stories and beneficiary testimonials" />
      </Head>

      <AdminLayout title="Success Stories Management">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Stories</p>
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
                <Star className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Drafts</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.draft}</p>
                </div>
                <Edit className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Orphan Stories</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.orphan}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Widow Stories</p>
                  <p className="text-2xl font-bold text-purple-400">{stats.widow}</p>
                </div>
                <Heart className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Community</p>
                  <p className="text-2xl font-bold text-green-400">{stats.community}</p>
                </div>
                <Award className="w-8 h-8 text-green-500" />
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
                    placeholder="Search stories..."
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
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                >
                  <option value="all">All Categories</option>
                  <option value="orphan">Orphan Support</option>
                  <option value="widow">Widow Empowerment</option>
                  <option value="community">Community Impact</option>
                </select>
              </div>
              <button
                onClick={() => {
                  setSelectedStory(null);
                  setShowEditor(true);
                }}
                className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Story
              </button>
            </div>
          </div>

          {/* Stories List */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Story & Beneficiary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date Helped
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
                        Loading stories...
                      </td>
                    </tr>
                  ) : filteredStories.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                        No stories found. <button onClick={() => setShowEditor(true)} className="text-accent-400 hover:text-accent-300">Create your first story</button>
                      </td>
                    </tr>
                  ) : (
                    filteredStories.map((story) => (
                      <tr key={story.id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-white">{story.title}</div>
                            <div className="text-sm text-gray-400">
                              {story.story_details.beneficiary_name}
                              {story.story_details.beneficiary_age && ` (Age ${story.story_details.beneficiary_age})`}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                              {story.excerpt}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getCategoryBadge(story.story_details.category)}>
                            {story.story_details.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {story.story_details.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(story.status)}>
                            {story.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {story.story_details.date_helped}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedStory(story);
                                setShowEditor(true);
                              }}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {story.status === 'published' && (
                              <button className="text-green-400 hover:text-green-300 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            <button className="text-purple-400 hover:text-purple-300 transition-colors">
                              <Quote className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStory(story.id)}
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
        </div>

        {/* Story Editor Modal */}
        {showEditor && (
          <StoryEditor
            isOpen={showEditor}
            story={selectedStory}
            onSave={handleSaveStory}
            onClose={() => {
              setShowEditor(false);
              setSelectedStory(null);
            }}
          />
        )}
      </AdminLayout>
    </>
  );
};

export default StoriesManagement;