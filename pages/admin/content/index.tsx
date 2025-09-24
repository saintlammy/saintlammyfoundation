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
  Calendar,
  User,
  Globe,
  FileText,
  Image,
  Video,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  type: 'page' | 'blog' | 'program' | 'story' | 'media' | 'team' | 'partnership';
  status: 'published' | 'draft' | 'scheduled' | 'archived';
  author: {
    name: string;
    avatar?: string;
  };
  lastModified: Date;
  publishDate?: Date;
  views: number;
  excerpt?: string;
  featuredImage?: string;
  slug: string;
  teamData?: {
    role: string;
    expertise: string;
    experience: string;
    focus: string[];
    email: string;
    phone: string;
  };
}

const AdminContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const contentItems: ContentItem[] = [
    {
      id: '1',
      title: 'Transforming Lives Through Education',
      type: 'story',
      status: 'published',
      author: { name: 'Sarah Johnson', avatar: '/avatars/sarah.jpg' },
      lastModified: new Date('2024-01-15'),
      publishDate: new Date('2024-01-10'),
      views: 1250,
      excerpt: 'Meet Maria, whose life was transformed through our education support program...',
      featuredImage: '/images/story-1.jpg',
      slug: 'transforming-lives-through-education'
    },
    {
      id: '2',
      title: 'Our Impact in 2023',
      type: 'blog',
      status: 'published',
      author: { name: 'Michael Chen' },
      lastModified: new Date('2024-01-12'),
      publishDate: new Date('2024-01-01'),
      views: 2100,
      excerpt: 'Looking back at the incredible impact we made together in 2023...',
      slug: 'our-impact-in-2023'
    },
    {
      id: '3',
      title: 'Orphan Care Program',
      type: 'program',
      status: 'published',
      author: { name: 'Emma Williams' },
      lastModified: new Date('2024-01-08'),
      publishDate: new Date('2023-12-15'),
      views: 890,
      excerpt: 'Providing comprehensive care and support for orphaned children...',
      featuredImage: '/images/orphan-care.jpg',
      slug: 'orphan-care-program'
    },
    {
      id: '4',
      title: 'How to Get Involved',
      type: 'page',
      status: 'draft',
      author: { name: 'David Brown' },
      lastModified: new Date('2024-01-14'),
      views: 0,
      excerpt: 'Learn about the various ways you can contribute to our mission...',
      slug: 'how-to-get-involved'
    },
    {
      id: '5',
      title: 'Community Outreach Video',
      type: 'media',
      status: 'scheduled',
      author: { name: 'Lisa Anderson' },
      lastModified: new Date('2024-01-13'),
      publishDate: new Date('2024-01-20'),
      views: 0,
      excerpt: 'Documentary showcasing our community outreach efforts...',
      slug: 'community-outreach-video'
    },
    {
      id: '6',
      title: 'Sarah Adebayo',
      type: 'team',
      status: 'published',
      author: { name: 'Admin' },
      lastModified: new Date('2024-01-10'),
      publishDate: new Date('2024-01-01'),
      views: 0,
      excerpt: 'Partnership Director with 8+ years in nonprofit partnerships',
      slug: 'sarah-adebayo',
      teamData: {
        role: 'Partnership Director',
        expertise: 'Corporate Partnerships & Strategic Alliances',
        experience: '8+ years in nonprofit partnerships',
        focus: ['Corporate CSR', 'Strategic Planning', 'Impact Measurement'],
        email: 'sarah.adebayo@saintlammyfoundation.org',
        phone: '+234 801 111 2222'
      }
    },
    {
      id: '7',
      title: 'Michael Okafor',
      type: 'team',
      status: 'published',
      author: { name: 'Admin' },
      lastModified: new Date('2024-01-10'),
      publishDate: new Date('2024-01-01'),
      views: 0,
      excerpt: 'NGO Relations Manager with 6+ years in NGO partnerships',
      slug: 'michael-okafor',
      teamData: {
        role: 'NGO Relations Manager',
        expertise: 'Inter-organizational Collaboration',
        experience: '6+ years in NGO partnerships',
        focus: ['NGO Alliances', 'Resource Sharing', 'Joint Programs'],
        email: 'michael.okafor@saintlammyfoundation.org',
        phone: '+234 802 333 4444'
      }
    },
    {
      id: '8',
      title: 'Fatima Ibrahim',
      type: 'team',
      status: 'published',
      author: { name: 'Admin' },
      lastModified: new Date('2024-01-10'),
      publishDate: new Date('2024-01-01'),
      views: 0,
      excerpt: 'Community Engagement Lead with 5+ years in community development',
      slug: 'fatima-ibrahim',
      teamData: {
        role: 'Community Engagement Lead',
        expertise: 'Individual & Community Partnerships',
        experience: '5+ years in community development',
        focus: ['Volunteer Programs', 'Individual Donors', 'Local Communities'],
        email: 'fatima.ibrahim@saintlammyfoundation.org',
        phone: '+234 803 555 6666'
      }
    }
  ];

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const contentTypes = [
    { value: 'all', label: 'All Content', count: contentItems.length },
    { value: 'page', label: 'Pages', count: contentItems.filter(item => item.type === 'page').length },
    { value: 'blog', label: 'Blog Posts', count: contentItems.filter(item => item.type === 'blog').length },
    { value: 'program', label: 'Programs', count: contentItems.filter(item => item.type === 'program').length },
    { value: 'story', label: 'Stories', count: contentItems.filter(item => item.type === 'story').length },
    { value: 'media', label: 'Media', count: contentItems.filter(item => item.type === 'media').length },
    { value: 'team', label: 'Team Members', count: contentItems.filter(item => item.type === 'team').length },
    { value: 'partnership', label: 'Partnerships', count: contentItems.filter(item => item.type === 'partnership').length }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'archived', label: 'Archived' }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'page': return <FileText className="w-4 h-4" />;
      case 'blog': return <FileText className="w-4 h-4" />;
      case 'program': return <Globe className="w-4 h-4" />;
      case 'story': return <User className="w-4 h-4" />;
      case 'media': return <Video className="w-4 h-4" />;
      case 'team': return <User className="w-4 h-4" />;
      case 'partnership': return <Globe className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'archived': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === filteredContent.length
        ? []
        : filteredContent.map(item => item.id)
    );
  };

  return (
    <>
      <Head>
        <title>Content Management - Saintlammy Foundation Admin</title>
        <meta name="description" content="Manage website content, blog posts, and media" />
      </Head>

      <AdminLayout title="Content Management">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Content Management</h1>
              <p className="text-gray-400 mt-1">Manage your website content, blog posts, and media</p>
            </div>
            <button className="flex items-center space-x-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <Plus className="w-4 h-4" />
              <span>Create Content</span>
            </button>
          </div>

          {/* Content Type Tabs */}
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8 overflow-x-auto">
              {contentTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    selectedType === type.value
                      ? 'border-accent-500 text-accent-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <span>{type.label}</span>
                  <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                    {type.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
                  <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500">
                    <option>All Time</option>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Author</label>
                  <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500">
                    <option>All Authors</option>
                    <option>Sarah Johnson</option>
                    <option>Michael Chen</option>
                    <option>Emma Williams</option>
                    <option>David Brown</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">
                  {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
                    Publish
                  </button>
                  <button className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors">
                    Archive
                  </button>
                  <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Content List */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === filteredContent.length}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-600 bg-gray-700 text-accent-500 focus:ring-accent-500 focus:ring-offset-gray-800"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Last Modified
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredContent.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                          className="rounded border-gray-600 bg-gray-700 text-accent-500 focus:ring-accent-500 focus:ring-offset-gray-800"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          {item.featuredImage && (
                            <div className="w-12 h-12 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                              <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                                <Image className="w-6 h-6 text-gray-400" />
                              </div>
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-white font-medium truncate">{item.title}</p>
                            {item.excerpt && (
                              <p className="text-gray-400 text-sm mt-1 line-clamp-2">{item.excerpt}</p>
                            )}
                            <p className="text-gray-500 text-xs mt-1">/{item.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-gray-400">
                          {getTypeIcon(item.type)}
                          <span className="capitalize">{item.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {item.author.name.charAt(0)}
                            </span>
                          </div>
                          <span className="text-gray-300 text-sm">{item.author.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300 text-sm">
                          {item.lastModified.toLocaleDateString()}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {item.lastModified.toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1 text-gray-400">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">{item.views.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
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

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-sm">
              Showing {filteredContent.length} of {contentItems.length} items
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300 hover:bg-gray-700 transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 bg-accent-500 text-white rounded">
                1
              </button>
              <button className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300 hover:bg-gray-700 transition-colors">
                2
              </button>
              <button className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300 hover:bg-gray-700 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminContent;