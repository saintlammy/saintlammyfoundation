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
  MapPin,
  Users,
  Target,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Image,
  MoreHorizontal,
  Heart,
  Globe,
  BookOpen,
  Home,
  Stethoscope,
  Utensils,
  GraduationCap
} from 'lucide-react';

interface Program {
  id: string;
  title: string;
  description: string;
  category: 'education' | 'healthcare' | 'orphanage' | 'emergency' | 'community' | 'food';
  status: 'active' | 'pending' | 'completed' | 'paused';
  priority: 'high' | 'medium' | 'low';
  targetAmount: number;
  currentAmount: number;
  beneficiaries: number;
  targetBeneficiaries: number;
  location: string;
  startDate: Date;
  endDate?: Date;
  manager: {
    name: string;
    email: string;
    avatar?: string;
  };
  volunteers: number;
  featuredImage?: string;
  gallery: string[];
  updates: number;
  createdAt: Date;
  lastUpdated: Date;
}

const AdminPrograms: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const programs: Program[] = [
    {
      id: '1',
      title: 'Educational Support for Orphans',
      description: 'Providing quality education, school supplies, and tutoring support for orphaned children to help them build a better future.',
      category: 'education',
      status: 'active',
      priority: 'high',
      targetAmount: 500000,
      currentAmount: 325000,
      beneficiaries: 45,
      targetBeneficiaries: 60,
      location: 'Lagos, Nigeria',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      manager: {
        name: 'Sarah Johnson',
        email: 'sarah@saintlammy.org',
        avatar: '/avatars/sarah.jpg'
      },
      volunteers: 12,
      featuredImage: '/images/education-program.jpg',
      gallery: ['/images/edu1.jpg', '/images/edu2.jpg'],
      updates: 8,
      createdAt: new Date('2023-12-01'),
      lastUpdated: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Healthcare Access Initiative',
      description: 'Bringing essential healthcare services to underserved communities through mobile clinics and health education programs.',
      category: 'healthcare',
      status: 'active',
      priority: 'high',
      targetAmount: 750000,
      currentAmount: 450000,
      beneficiaries: 120,
      targetBeneficiaries: 200,
      location: 'Abuja, Nigeria',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-06-30'),
      manager: {
        name: 'Dr. Michael Chen',
        email: 'michael@saintlammy.org'
      },
      volunteers: 18,
      featuredImage: '/images/healthcare-program.jpg',
      gallery: ['/images/health1.jpg', '/images/health2.jpg'],
      updates: 5,
      createdAt: new Date('2023-11-15'),
      lastUpdated: new Date('2024-01-14')
    },
    {
      id: '3',
      title: 'Safe Haven Orphanage',
      description: 'Providing a loving home, nutritious meals, and comprehensive care for orphaned and abandoned children.',
      category: 'orphanage',
      status: 'active',
      priority: 'high',
      targetAmount: 1000000,
      currentAmount: 680000,
      beneficiaries: 25,
      targetBeneficiaries: 40,
      location: 'Kano, Nigeria',
      startDate: new Date('2023-08-01'),
      manager: {
        name: 'Emma Williams',
        email: 'emma@saintlammy.org'
      },
      volunteers: 8,
      featuredImage: '/images/orphanage-program.jpg',
      gallery: ['/images/orph1.jpg', '/images/orph2.jpg'],
      updates: 12,
      createdAt: new Date('2023-07-01'),
      lastUpdated: new Date('2024-01-16')
    },
    {
      id: '4',
      title: 'Emergency Food Distribution',
      description: 'Providing emergency food packages to families affected by natural disasters and economic hardships.',
      category: 'emergency',
      status: 'completed',
      priority: 'medium',
      targetAmount: 200000,
      currentAmount: 200000,
      beneficiaries: 500,
      targetBeneficiaries: 500,
      location: 'Multiple Locations',
      startDate: new Date('2023-11-01'),
      endDate: new Date('2023-12-31'),
      manager: {
        name: 'David Brown',
        email: 'david@saintlammy.org'
      },
      volunteers: 25,
      featuredImage: '/images/food-program.jpg',
      gallery: ['/images/food1.jpg', '/images/food2.jpg'],
      updates: 6,
      createdAt: new Date('2023-10-15'),
      lastUpdated: new Date('2024-01-02')
    },
    {
      id: '5',
      title: 'Community Clean Water Project',
      description: 'Installing water wells and purification systems to provide clean drinking water to rural communities.',
      category: 'community',
      status: 'pending',
      priority: 'medium',
      targetAmount: 800000,
      currentAmount: 150000,
      beneficiaries: 0,
      targetBeneficiaries: 300,
      location: 'Kaduna, Nigeria',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-08-31'),
      manager: {
        name: 'Lisa Anderson',
        email: 'lisa@saintlammy.org'
      },
      volunteers: 5,
      featuredImage: '/images/water-program.jpg',
      gallery: [],
      updates: 2,
      createdAt: new Date('2024-01-10'),
      lastUpdated: new Date('2024-01-12')
    }
  ];

  const categoryIcons = {
    education: GraduationCap,
    healthcare: Stethoscope,
    orphanage: Home,
    emergency: AlertCircle,
    community: Globe,
    food: Utensils
  };

  const statusColors = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    paused: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  };

  const priorityColors = {
    high: 'text-red-400',
    medium: 'text-yellow-400',
    low: 'text-green-400'
  };

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || program.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || program.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalTargetAmount = programs.reduce((sum, program) => sum + program.targetAmount, 0);
  const totalCurrentAmount = programs.reduce((sum, program) => sum + program.currentAmount, 0);
  const totalBeneficiaries = programs.reduce((sum, program) => sum + program.beneficiaries, 0);
  const activePrograms = programs.filter(p => p.status === 'active').length;

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const toggleProgramSelection = (programId: string) => {
    setSelectedPrograms(prev =>
      prev.includes(programId)
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedPrograms(
      selectedPrograms.length === filteredPrograms.length
        ? []
        : filteredPrograms.map(program => program.id)
    );
  };

  return (
    <>
      <Head>
        <title>Programs Management - Saintlammy Foundation Admin</title>
        <meta name="description" content="Manage foundation programs and initiatives" />
      </Head>

      <AdminLayout title="Programs Management">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Programs Management</h1>
              <p className="text-gray-400 mt-1">Manage foundation programs and track their progress</p>
            </div>
            <button className="flex items-center space-x-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <Plus className="w-4 h-4" />
              <span>Create Program</span>
            </button>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Programs</p>
                  <p className="text-2xl font-bold text-white mt-1">{programs.length}</p>
                  <p className="text-green-400 text-sm mt-2">{activePrograms} active</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Funding</p>
                  <p className="text-2xl font-bold text-white mt-1">₦{totalCurrentAmount.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm mt-2">
                    {Math.round((totalCurrentAmount / totalTargetAmount) * 100)}% of target
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Beneficiaries</p>
                  <p className="text-2xl font-bold text-white mt-1">{totalBeneficiaries.toLocaleString()}</p>
                  <p className="text-green-400 text-sm mt-2">Lives impacted</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Volunteers</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {programs.reduce((sum, p) => sum + p.volunteers, 0)}
                  </p>
                  <p className="text-blue-400 text-sm mt-2">Active volunteers</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="all">All Categories</option>
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
                <option value="orphanage">Orphanage</option>
                <option value="emergency">Emergency</option>
                <option value="community">Community</option>
                <option value="food">Food</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {viewMode === 'grid' ? 'List' : 'Grid'}
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedPrograms.length > 0 && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">
                  {selectedPrograms.length} program{selectedPrograms.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
                    Activate
                  </button>
                  <button className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm transition-colors">
                    Pause
                  </button>
                  <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors">
                    Archive
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Programs Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program) => {
                const IconComponent = categoryIcons[program.category];
                const progressPercentage = getProgressPercentage(program.currentAmount, program.targetAmount);
                const beneficiaryProgress = getProgressPercentage(program.beneficiaries, program.targetBeneficiaries);

                return (
                  <div key={program.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors">
                    <div className="relative">
                      <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                        <Image className="w-12 h-12 text-gray-500" />
                      </div>
                      <div className="absolute top-4 left-4">
                        <input
                          type="checkbox"
                          checked={selectedPrograms.includes(program.id)}
                          onChange={() => toggleProgramSelection(program.id)}
                          className="rounded border-gray-600 bg-gray-50 dark:bg-gray-700 text-accent-500 focus:ring-accent-500 focus:ring-offset-gray-800"
                        />
                      </div>
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[program.status]}`}>
                          {program.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[program.priority]} bg-gray-800 border border-gray-600`}>
                          {program.priority}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="w-5 h-5 text-accent-400" />
                          <span className="text-accent-400 text-sm capitalize">{program.category}</span>
                        </div>
                        <button className="text-gray-400 hover:text-gray-300">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="text-white font-semibold mb-2">{program.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{program.description}</p>

                      <div className="space-y-3 mb-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Funding Progress</span>
                            <span className="text-white">{Math.round(progressPercentage)}%</span>
                          </div>
                          <div className="w-full bg-gray-50 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-accent-500 to-accent-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span className="text-gray-500">₦{program.currentAmount.toLocaleString()}</span>
                            <span className="text-gray-500">₦{program.targetAmount.toLocaleString()}</span>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Beneficiaries</span>
                            <span className="text-white">{Math.round(beneficiaryProgress)}%</span>
                          </div>
                          <div className="w-full bg-gray-50 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${beneficiaryProgress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span className="text-gray-500">{program.beneficiaries} reached</span>
                            <span className="text-gray-500">{program.targetBeneficiaries} target</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{program.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{program.volunteers} volunteers</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {program.manager.name.charAt(0)}
                            </span>
                          </div>
                          <span className="text-gray-300 text-sm">{program.manager.name}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedPrograms.length === filteredPrograms.length}
                          onChange={toggleSelectAll}
                          className="rounded border-gray-600 bg-gray-50 dark:bg-gray-700 text-accent-500 focus:ring-accent-500 focus:ring-offset-gray-800"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Program
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Funding
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Beneficiaries
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Manager
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredPrograms.map((program) => {
                      const IconComponent = categoryIcons[program.category];
                      const progressPercentage = getProgressPercentage(program.currentAmount, program.targetAmount);

                      return (
                        <tr key={program.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedPrograms.includes(program.id)}
                              onChange={() => toggleProgramSelection(program.id)}
                              className="rounded border-gray-600 bg-gray-50 dark:bg-gray-700 text-accent-500 focus:ring-accent-500 focus:ring-offset-gray-800"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-white font-medium">{program.title}</p>
                              <p className="text-gray-400 text-sm">{program.location}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <IconComponent className="w-4 h-4 text-accent-400" />
                              <span className="text-gray-300 capitalize">{program.category}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[program.status]}`}>
                              {program.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="w-24">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-400">{Math.round(progressPercentage)}%</span>
                              </div>
                              <div className="w-full bg-gray-50 dark:bg-gray-700 rounded-full h-1.5">
                                <div
                                  className="bg-gradient-to-r from-accent-500 to-accent-600 h-1.5 rounded-full"
                                  style={{ width: `${progressPercentage}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-300">
                              {program.beneficiaries}/{program.targetBeneficiaries}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-medium">
                                  {program.manager.name.charAt(0)}
                                </span>
                              </div>
                              <span className="text-gray-300 text-sm">{program.manager.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-red-400 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-sm">
              Showing {filteredPrograms.length} of {programs.length} programs
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 bg-accent-500 text-white rounded">
                1
              </button>
              <button className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminPrograms;