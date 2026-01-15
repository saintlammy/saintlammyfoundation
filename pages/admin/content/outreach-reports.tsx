import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  FileText, Plus, Search, Edit, Eye, Trash2, Save, X,
  MapPin, Calendar, Users, DollarSign, TrendingUp, Award,
  Image as ImageIcon, MessageSquare, Target, Clock, CheckCircle,
  Heart, Upload, AlertCircle, ChevronRight
} from 'lucide-react';

interface OutreachReport {
  id: string;
  title: string;
  date: string;
  location: string;
  status: 'completed' | 'upcoming' | 'ongoing';
  image: string;
  description: string;
  targetBeneficiaries: number;
  actualBeneficiaries: number;
  beneficiaryCategories: { category: string; count: number }[];
  impact: { title: string; value: string | number; description: string }[];
  budget: {
    planned: number;
    actual: number;
    breakdown: { category: string; amount: number; percentage: number }[];
  };
  volunteers: { registered: number; participated: number; hours: number };
  activities: { title: string; description: string; completed: boolean }[];
  gallery: string[];
  testimonials: { name: string; role: string; message: string; image?: string }[];
  futurePlans?: string[];
  partners?: { name: string; logo?: string; contribution: string }[];
  reportDocument?: string;
  socialMedia?: { platform: string; reach: number; engagement: number }[];
}

const OutreachReportsManagement: React.FC = () => {
  const [outreaches, setOutreaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOutreach, setSelectedOutreach] = useState<any | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [reportData, setReportData] = useState<OutreachReport | null>(null);
  const [activeSection, setActiveSection] = useState<string>('basic');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(1550); // NGN to USD rate
  const [stats, setStats] = useState({
    total: 0,
    withReports: 0,
    completed: 0,
    totalBeneficiaries: 0
  });

  useEffect(() => {
    loadOutreaches();
  }, []);

  const loadOutreaches = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/outreaches?status=all');

      if (response.ok) {
        const data = await response.json();
        const transformedOutreaches = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          date: item.date || new Date().toISOString(),
          location: item.location || 'Nigeria',
          image: item.image || '',
          status: item.status || 'upcoming',
          beneficiaries: item.beneficiaries || 0
        }));
        setOutreaches(transformedOutreaches);
        updateStats(transformedOutreaches);
      } else {
        setOutreaches([]);
      }
    } catch (error) {
      console.error('Error loading outreaches:', error);
      setOutreaches([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (outreachData: any[]) => {
    const stats = {
      total: outreachData.length,
      withReports: 0,
      completed: outreachData.filter((o: any) => o.status === 'completed').length,
      totalBeneficiaries: outreachData.reduce((sum: number, o: any) => sum + (o.beneficiaries || 0), 0)
    };
    setStats(stats);
  };

  const loadOutreachReport = async (outreachId: string) => {
    try {
      const response = await fetch(`/api/outreaches/${outreachId}/report`);

      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      } else {
        // Initialize new report with defaults
        const outreach = outreaches.find((o: any) => o.id === outreachId);
        if (outreach) {
          setReportData({
            id: outreach.id,
            title: outreach.title,
            date: outreach.date,
            location: outreach.location,
            status: outreach.status,
            image: outreach.image,
            description: '',
            targetBeneficiaries: 0,
            actualBeneficiaries: 0,
            beneficiaryCategories: [],
            impact: [],
            budget: {
              planned: 0,
              actual: 0,
              breakdown: []
            },
            volunteers: {
              registered: 0,
              participated: 0,
              hours: 0
            },
            activities: [],
            gallery: [],
            testimonials: [],
            futurePlans: [],
            partners: [],
            reportDocument: '',
            socialMedia: []
          });
        }
      }
    } catch (error) {
      console.error('Error loading outreach report:', error);
    }
  };

  const handleCreateNewOutreach = () => {
    // Generate a new ID for the outreach
    const newId = `new-${Date.now()}`;
    const newOutreach = {
      id: newId,
      title: 'New Outreach',
      date: new Date().toISOString(),
      location: 'Nigeria',
      status: 'upcoming',
      beneficiaries: 0,
      image: ''
    };

    // Create empty report template
    const newReport: OutreachReport = {
      id: newId,
      title: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      status: 'upcoming',
      image: '',
      description: '',
      targetBeneficiaries: 0,
      actualBeneficiaries: 0,
      beneficiaryCategories: [],
      impact: [],
      budget: {
        planned: 0,
        actual: 0,
        breakdown: []
      },
      volunteers: {
        registered: 0,
        participated: 0,
        hours: 0
      },
      activities: [],
      gallery: [],
      testimonials: [],
      futurePlans: [],
      partners: [],
      reportDocument: '',
      socialMedia: []
    };

    setSelectedOutreach(newOutreach);
    setReportData(newReport);
    setShowEditor(true);
  };

  const handleEditReport = async (outreach: any) => {
    setSelectedOutreach(outreach);
    setShowEditor(true);
    await loadOutreachReport(outreach.id);
  };

  const handleDeleteReport = async (outreachId: string, outreachTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${outreachTitle}" and its report? This action cannot be undone.`)) {
      return;
    }

    try {
      // Delete the report first
      const reportResponse = await fetch(`/api/outreaches/${outreachId}/report`, {
        method: 'DELETE',
      });

      // Then delete the outreach itself
      const outreachResponse = await fetch(`/api/outreaches?id=${outreachId}`, {
        method: 'DELETE',
      });

      if (reportResponse.ok || outreachResponse.ok) {
        alert('Outreach and report deleted successfully!');
        // Remove from local state immediately
        setOutreaches(prev => prev.filter(o => o.id !== outreachId));
        updateStats(outreaches.filter(o => o.id !== outreachId));
      } else {
        throw new Error('Failed to delete outreach');
      }
    } catch (error) {
      console.error('Error deleting outreach:', error);
      alert(`Failed to delete: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSaveReport = async () => {
    if (!reportData || !selectedOutreach) return;

    try {
      setSaving(true);

      // First, save/create the outreach itself
      const outreachData = {
        id: selectedOutreach.id,
        title: reportData.title,
        description: reportData.description,
        location: reportData.location,
        date: reportData.date,
        beneficiaries: reportData.actualBeneficiaries || reportData.targetBeneficiaries,
        status: reportData.status,
        image: reportData.image,
      };

      // Check if this is a new outreach (starts with 'new-')
      const isNew = selectedOutreach.id.startsWith('new-');

      const outreachResponse = await fetch(`/api/outreaches${isNew ? '' : `?id=${selectedOutreach.id}`}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(outreachData),
      });

      // Then save the report
      const reportResponse = await fetch(`/api/outreaches/${selectedOutreach.id}/report`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (reportResponse.ok) {
        alert('Outreach and report saved successfully!');
        setShowEditor(false);
        setSelectedOutreach(null);
        setReportData(null);
        loadOutreaches();
      } else {
        throw new Error('Failed to save report');
      }
    } catch (error) {
      console.error('Error saving report:', error);
      alert('Failed to save report. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateReportField = (field: string, value: any) => {
    if (!reportData) return;
    setReportData({ ...reportData, [field]: value });
  };

  const handleImageUpload = async (file: File, field: 'image' | 'gallery') => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);

      // Convert to base64 for temporary preview (in production, upload to cloud storage)
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;

        if (field === 'image') {
          updateReportField('image', base64String);
        } else if (field === 'gallery') {
          setReportData({
            ...reportData!,
            gallery: [...reportData!.gallery, base64String]
          });
        }

        alert('Image uploaded successfully! (Note: In production, this will be uploaded to cloud storage)');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Array manipulation helpers
  const addBeneficiaryCategory = () => {
    if (!reportData) return;
    setReportData({
      ...reportData,
      beneficiaryCategories: [...reportData.beneficiaryCategories, { category: '', count: 0 }]
    });
  };

  const updateBeneficiaryCategory = (index: number, field: 'category' | 'count', value: string | number) => {
    if (!reportData) return;
    const updated = [...reportData.beneficiaryCategories];
    updated[index] = { ...updated[index], [field]: value };
    setReportData({ ...reportData, beneficiaryCategories: updated });
  };

  const removeBeneficiaryCategory = (index: number) => {
    if (!reportData) return;
    setReportData({
      ...reportData,
      beneficiaryCategories: reportData.beneficiaryCategories.filter((_, i) => i !== index)
    });
  };

  const addImpactMetric = () => {
    if (!reportData) return;
    setReportData({
      ...reportData,
      impact: [...reportData.impact, { title: '', value: 0, description: '' }]
    });
  };

  const updateImpactMetric = (index: number, field: string, value: string | number) => {
    if (!reportData) return;
    const updated = [...reportData.impact];
    updated[index] = { ...updated[index], [field]: value };
    setReportData({ ...reportData, impact: updated });
  };

  const removeImpactMetric = (index: number) => {
    if (!reportData) return;
    setReportData({
      ...reportData,
      impact: reportData.impact.filter((_, i) => i !== index)
    });
  };

  const addBudgetItem = () => {
    if (!reportData) return;
    setReportData({
      ...reportData,
      budget: {
        ...reportData.budget,
        breakdown: [...reportData.budget.breakdown, { category: '', amount: 0, percentage: 0 }]
      }
    });
  };

  const updateBudgetItem = (index: number, field: string, value: string | number) => {
    if (!reportData) return;
    const updated = [...reportData.budget.breakdown];
    updated[index] = { ...updated[index], [field]: value };
    setReportData({
      ...reportData,
      budget: { ...reportData.budget, breakdown: updated }
    });
  };

  const removeBudgetItem = (index: number) => {
    if (!reportData) return;
    setReportData({
      ...reportData,
      budget: {
        ...reportData.budget,
        breakdown: reportData.budget.breakdown.filter((_, i) => i !== index)
      }
    });
  };

  const addActivity = () => {
    if (!reportData) return;
    setReportData({
      ...reportData,
      activities: [...reportData.activities, { title: '', description: '', completed: false }]
    });
  };

  const updateActivity = (index: number, field: string, value: string | boolean) => {
    if (!reportData) return;
    const updated = [...reportData.activities];
    updated[index] = { ...updated[index], [field]: value };
    setReportData({ ...reportData, activities: updated });
  };

  const removeActivity = (index: number) => {
    if (!reportData) return;
    setReportData({
      ...reportData,
      activities: reportData.activities.filter((_, i) => i !== index)
    });
  };

  const addGalleryImage = () => {
    if (!reportData) return;
    const imageUrl = prompt('Enter image URL:');
    if (imageUrl) {
      setReportData({
        ...reportData,
        gallery: [...reportData.gallery, imageUrl]
      });
    }
  };

  const handleGalleryFileUpload = (file: File) => {
    if (file) {
      handleImageUpload(file, 'gallery');
    }
  };

  const handleTestimonialImageUpload = async (file: File, index: number) => {
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateTestimonial(index, 'image', base64String);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    if (!reportData) return;
    setReportData({
      ...reportData,
      gallery: reportData.gallery.filter((_, i) => i !== index)
    });
  };

  const addTestimonial = () => {
    if (!reportData) return;
    setReportData({
      ...reportData,
      testimonials: [...reportData.testimonials, { name: '', role: '', message: '', image: '' }]
    });
  };

  const updateTestimonial = (index: number, field: string, value: string) => {
    if (!reportData) return;
    const updated = [...reportData.testimonials];
    updated[index] = { ...updated[index], [field]: value };
    setReportData({ ...reportData, testimonials: updated });
  };

  const removeTestimonial = (index: number) => {
    if (!reportData) return;
    setReportData({
      ...reportData,
      testimonials: reportData.testimonials.filter((_, i) => i !== index)
    });
  };

  const addFuturePlan = () => {
    if (!reportData) return;
    const plan = prompt('Enter future plan:');
    if (plan) {
      setReportData({
        ...reportData,
        futurePlans: [...(reportData.futurePlans || []), plan]
      });
    }
  };

  const removeFuturePlan = (index: number) => {
    if (!reportData) return;
    setReportData({
      ...reportData,
      futurePlans: reportData.futurePlans?.filter((_, i) => i !== index)
    });
  };

  const addPartner = () => {
    if (!reportData) return;
    setReportData({
      ...reportData,
      partners: [...(reportData.partners || []), { name: '', logo: '', contribution: '' }]
    });
  };

  const updatePartner = (index: number, field: string, value: string) => {
    if (!reportData) return;
    const updated = [...(reportData.partners || [])];
    updated[index] = { ...updated[index], [field]: value };
    setReportData({ ...reportData, partners: updated });
  };

  const removePartner = (index: number) => {
    if (!reportData) return;
    setReportData({
      ...reportData,
      partners: reportData.partners?.filter((_, i) => i !== index)
    });
  };

  const filteredOutreaches = outreaches.filter((outreach: any) =>
    outreach.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    outreach.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: FileText },
    { id: 'beneficiaries', label: 'Beneficiaries', icon: Users },
    { id: 'budget', label: 'Budget', icon: DollarSign },
    { id: 'volunteers', label: 'Volunteers', icon: Heart },
    { id: 'impact', label: 'Impact Metrics', icon: Target },
    { id: 'activities', label: 'Activities', icon: CheckCircle },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'future', label: 'Future Plans', icon: TrendingUp },
    { id: 'partners', label: 'Partners', icon: Award }
  ];

  return (
    <>
      <Head>
        <title>Outreach Reports Management - Admin Dashboard</title>
        <meta name="description" content="Manage detailed outreach reports and documentation" />
      </Head>

      <AdminLayout title="Outreach Reports Management">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Outreaches</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">With Reports</p>
                  <p className="text-2xl font-bold text-green-400">{stats.withReports}</p>
                </div>
                <FileText className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-purple-400">{stats.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Beneficiaries</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.totalBeneficiaries.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">About Outreach Reports</h3>
                <p className="text-gray-300">
                  Click on any outreach event below to create or edit a comprehensive report. Reports include beneficiary information,
                  budget breakdowns, impact metrics, volunteer statistics, activities, photo galleries, testimonials, and future plans.
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex gap-4">
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
              <button
                onClick={handleCreateNewOutreach}
                className="flex items-center gap-2 px-6 py-2 bg-accent-500 hover:bg-accent-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                Create New Report
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
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Beneficiaries
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
                        No outreaches found.
                      </td>
                    </tr>
                  ) : (
                    filteredOutreaches.map((outreach: any) => (
                      <tr key={outreach.id} className="hover:bg-gray-50 dark:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {outreach.title}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-300 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {outreach.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {new Date(outreach.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            outreach.status === 'completed'
                              ? 'bg-green-500/20 text-green-400'
                              : outreach.status === 'ongoing'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {outreach.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {outreach.beneficiaries?.toLocaleString() || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditReport(outreach)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                              title="Edit Report"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <Link
                              href={`/outreach/${outreach.id}`}
                              target="_blank"
                              className="text-accent-400 hover:text-accent-300 transition-colors"
                              title="View Report"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteReport(outreach.id, outreach.title)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              title="Delete Report"
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

        {/* Report Editor Modal */}
        {showEditor && reportData && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-start justify-center p-4">
            <div className="bg-gray-800 rounded-xl w-full max-w-6xl my-8 border border-gray-700">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedOutreach?.title} - Report</h2>
                  <p className="text-gray-400 text-sm mt-1">Create or edit comprehensive outreach report</p>
                </div>
                <button
                  onClick={() => {
                    setShowEditor(false);
                    setSelectedOutreach(null);
                    setReportData(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex">
                {/* Sidebar Navigation */}
                <div className="w-64 border-r border-gray-700 p-4">
                  <nav className="space-y-1">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                            activeSection === section.id
                              ? 'bg-accent-500 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-gray-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {section.label}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Form Content */}
                <div className="flex-1 p-6 max-h-[70vh] overflow-y-auto">
                  {/* Basic Info Section */}
                  {activeSection === 'basic' && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white mb-4">Basic Information</h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                        <input
                          type="text"
                          value={reportData.title}
                          onChange={(e) => updateReportField('title', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                          <input
                            type="date"
                            value={reportData.date.split('T')[0]}
                            onChange={(e) => updateReportField('date', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                          <select
                            value={reportData.status}
                            onChange={(e) => updateReportField('status', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                          >
                            <option value="upcoming">Upcoming</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                        <input
                          type="text"
                          value={reportData.location}
                          onChange={(e) => updateReportField('location', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image</label>

                        {/* Image Preview */}
                        {reportData.image && (
                          <div className="mb-3 relative group">
                            <img
                              src={reportData.image}
                              alt="Cover preview"
                              className="w-full h-48 object-cover rounded-lg border border-gray-600"
                            />
                            <button
                              onClick={() => updateReportField('image', '')}
                              className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {/* Upload Button */}
                        <div className="flex gap-2 mb-2">
                          <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg cursor-pointer font-medium transition-colors">
                            <Upload className="w-4 h-4" />
                            {uploadingImage ? 'Uploading...' : 'Upload Image'}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file, 'image');
                              }}
                              className="hidden"
                              disabled={uploadingImage}
                            />
                          </label>
                        </div>

                        {/* URL Input (Alternative) */}
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Or enter image URL:</label>
                          <input
                            type="text"
                            value={reportData.image}
                            onChange={(e) => updateReportField('image', e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                          value={reportData.description}
                          onChange={(e) => updateReportField('description', e.target.value)}
                          rows={4}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Report Document URL</label>
                        <input
                          type="text"
                          value={reportData.reportDocument || ''}
                          onChange={(e) => updateReportField('reportDocument', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                          placeholder="/reports/outreach-report.pdf"
                        />
                      </div>
                    </div>
                  )}

                  {/* Beneficiaries Section */}
                  {activeSection === 'beneficiaries' && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white mb-4">Beneficiary Information</h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Target Beneficiaries</label>
                          <input
                            type="number"
                            value={reportData.targetBeneficiaries}
                            onChange={(e) => updateReportField('targetBeneficiaries', parseInt(e.target.value))}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Actual Beneficiaries</label>
                          <input
                            type="number"
                            value={reportData.actualBeneficiaries}
                            onChange={(e) => updateReportField('actualBeneficiaries', parseInt(e.target.value))}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-sm font-medium text-gray-300">Beneficiary Categories</label>
                          <button
                            onClick={addBeneficiaryCategory}
                            className="flex items-center gap-2 px-3 py-1 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm"
                          >
                            <Plus className="w-4 h-4" />
                            Add Category
                          </button>
                        </div>
                        <div className="space-y-2">
                          {reportData.beneficiaryCategories.map((cat, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={cat.category}
                                onChange={(e) => updateBeneficiaryCategory(index, 'category', e.target.value)}
                                placeholder="Category (e.g., Children 0-12)"
                                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                              />
                              <input
                                type="number"
                                value={cat.count}
                                onChange={(e) => updateBeneficiaryCategory(index, 'count', parseInt(e.target.value))}
                                placeholder="Count"
                                className="w-32 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                              />
                              <button
                                onClick={() => removeBeneficiaryCategory(index)}
                                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Budget Section */}
                  {activeSection === 'budget' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Budget Information</h3>
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-400">Exchange Rate (₦ to $):</label>
                          <input
                            type="number"
                            value={exchangeRate}
                            onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 1550)}
                            className="w-24 px-3 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-accent-500"
                            placeholder="1550"
                          />
                        </div>
                      </div>

                      {/* NGN Budgets */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Nigerian Naira (₦)</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Planned Budget (₦)</label>
                            <input
                              type="number"
                              value={reportData.budget.planned}
                              onChange={(e) => updateReportField('budget', { ...reportData.budget, planned: parseInt(e.target.value) })}
                              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                              ≈ ${(reportData.budget.planned / exchangeRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Actual Budget (₦)</label>
                            <input
                              type="number"
                              value={reportData.budget.actual}
                              onChange={(e) => updateReportField('budget', { ...reportData.budget, actual: parseInt(e.target.value) })}
                              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                              ≈ ${(reportData.budget.actual / exchangeRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* USD Summary Card */}
                      <div className="bg-accent-500/10 border border-accent-500/20 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-accent-400 mb-3">USD Equivalent Summary</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-400">Planned Budget</p>
                            <p className="text-lg font-bold text-white">
                              ${(reportData.budget.planned / exchangeRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Actual Budget</p>
                            <p className="text-lg font-bold text-white">
                              ${(reportData.budget.actual / exchangeRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Using exchange rate: 1 USD = ₦{exchangeRate.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-sm font-medium text-gray-300">Budget Breakdown (NGN)</label>
                          <button
                            onClick={addBudgetItem}
                            className="flex items-center gap-2 px-3 py-1 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm"
                          >
                            <Plus className="w-4 h-4" />
                            Add Item
                          </button>
                        </div>
                        <div className="space-y-3">
                          {reportData.budget.breakdown.map((item, index) => (
                            <div key={index} className="p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                              <div className="flex gap-2 mb-2">
                                <input
                                  type="text"
                                  value={item.category}
                                  onChange={(e) => updateBudgetItem(index, 'category', e.target.value)}
                                  placeholder="Category (e.g., Medical Supplies)"
                                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                                />
                                <input
                                  type="number"
                                  value={item.amount}
                                  onChange={(e) => updateBudgetItem(index, 'amount', parseInt(e.target.value))}
                                  placeholder="Amount (₦)"
                                  className="w-36 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                                />
                                <input
                                  type="number"
                                  value={item.percentage}
                                  onChange={(e) => updateBudgetItem(index, 'percentage', parseInt(e.target.value))}
                                  placeholder="%"
                                  className="w-20 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                                />
                                <button
                                  onClick={() => removeBudgetItem(index)}
                                  className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              {item.amount > 0 && (
                                <div className="flex items-center justify-between px-2">
                                  <span className="text-xs text-gray-400">USD Equivalent:</span>
                                  <span className="text-xs font-semibold text-accent-400">
                                    ${(item.amount / exchangeRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Total Breakdown Summary */}
                        {reportData.budget.breakdown.length > 0 && (
                          <div className="mt-4 p-3 bg-gray-700 rounded-lg border border-gray-600">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-300">Total Breakdown:</span>
                              <div className="text-right">
                                <p className="text-sm font-bold text-white">
                                  ₦{reportData.budget.breakdown.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                                </p>
                                <p className="text-xs text-accent-400">
                                  ${(reportData.budget.breakdown.reduce((sum, item) => sum + item.amount, 0) / exchangeRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Volunteers Section */}
                  {activeSection === 'volunteers' && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white mb-4">Volunteer Information</h3>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Registered</label>
                          <input
                            type="number"
                            value={reportData.volunteers.registered}
                            onChange={(e) => updateReportField('volunteers', { ...reportData.volunteers, registered: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Participated</label>
                          <input
                            type="number"
                            value={reportData.volunteers.participated}
                            onChange={(e) => updateReportField('volunteers', { ...reportData.volunteers, participated: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Total Hours</label>
                          <input
                            type="number"
                            value={reportData.volunteers.hours}
                            onChange={(e) => updateReportField('volunteers', { ...reportData.volunteers, hours: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Impact Metrics Section */}
                  {activeSection === 'impact' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">Impact Metrics</h3>
                        <button
                          onClick={addImpactMetric}
                          className="flex items-center gap-2 px-3 py-1 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Add Metric
                        </button>
                      </div>

                      <div className="space-y-3">
                        {reportData.impact.map((metric, index) => (
                          <div key={index} className="p-4 bg-gray-700 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm text-gray-400">Metric {index + 1}</span>
                              <button
                                onClick={() => removeImpactMetric(index)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={metric.title}
                                onChange={(e) => updateImpactMetric(index, 'title', e.target.value)}
                                placeholder="Title (e.g., Medical Consultations)"
                                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                              />
                              <input
                                type="text"
                                value={metric.value}
                                onChange={(e) => updateImpactMetric(index, 'value', e.target.value)}
                                placeholder="Value (e.g., 487)"
                                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                              />
                              <input
                                type="text"
                                value={metric.description}
                                onChange={(e) => updateImpactMetric(index, 'description', e.target.value)}
                                placeholder="Description"
                                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Activities Section */}
                  {activeSection === 'activities' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">Activities Conducted</h3>
                        <button
                          onClick={addActivity}
                          className="flex items-center gap-2 px-3 py-1 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Add Activity
                        </button>
                      </div>

                      <div className="space-y-3">
                        {reportData.activities.map((activity, index) => (
                          <div key={index} className="p-4 bg-gray-700 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={activity.completed}
                                  onChange={(e) => updateActivity(index, 'completed', e.target.checked)}
                                  className="w-4 h-4 text-accent-500 bg-gray-600 border-gray-500 rounded focus:ring-accent-500"
                                />
                                <span className="text-sm text-gray-400">Completed</span>
                              </label>
                              <button
                                onClick={() => removeActivity(index)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={activity.title}
                                onChange={(e) => updateActivity(index, 'title', e.target.value)}
                                placeholder="Activity Title"
                                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                              />
                              <textarea
                                value={activity.description}
                                onChange={(e) => updateActivity(index, 'description', e.target.value)}
                                placeholder="Activity Description"
                                rows={2}
                                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gallery Section */}
                  {activeSection === 'gallery' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">Photo Gallery</h3>
                        <div className="flex gap-2">
                          <label className="flex items-center gap-2 px-3 py-1 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm cursor-pointer font-medium transition-colors">
                            <Upload className="w-4 h-4" />
                            Upload Image
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleGalleryFileUpload(file);
                              }}
                              className="hidden"
                              disabled={uploadingImage}
                            />
                          </label>
                          <button
                            onClick={addGalleryImage}
                            className="flex items-center gap-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
                          >
                            <Plus className="w-4 h-4" />
                            Add URL
                          </button>
                        </div>
                      </div>

                      {reportData.gallery.length === 0 ? (
                        <div className="text-center py-12 bg-gray-700 rounded-lg border-2 border-dashed border-gray-600">
                          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-400">No images yet. Upload or add URLs to build your gallery.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-4">
                          {reportData.gallery.map((imageUrl, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={imageUrl}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-600"
                              />
                              <button
                                onClick={() => removeGalleryImage(index)}
                                className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Testimonials Section */}
                  {activeSection === 'testimonials' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">Testimonials</h3>
                        <button
                          onClick={addTestimonial}
                          className="flex items-center gap-2 px-3 py-1 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Add Testimonial
                        </button>
                      </div>

                      <div className="space-y-3">
                        {reportData.testimonials.map((testimonial, index) => (
                          <div key={index} className="p-4 bg-gray-700 rounded-lg">
                            <div className="flex justify-end mb-2">
                              <button
                                onClick={() => removeTestimonial(index)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={testimonial.name}
                                onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                                placeholder="Name"
                                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                              />
                              <input
                                type="text"
                                value={testimonial.role}
                                onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                                placeholder="Role"
                                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                              />
                              <textarea
                                value={testimonial.message}
                                onChange={(e) => updateTestimonial(index, 'message', e.target.value)}
                                placeholder="Message"
                                rows={3}
                                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                              />

                              {/* Profile Image */}
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">Profile Image</label>
                                {testimonial.image && (
                                  <div className="mb-2 relative inline-block">
                                    <img
                                      src={testimonial.image}
                                      alt={testimonial.name}
                                      className="w-16 h-16 rounded-full object-cover border border-gray-500"
                                    />
                                    <button
                                      onClick={() => updateTestimonial(index, 'image', '')}
                                      className="absolute -top-1 -right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                                <div className="flex gap-2">
                                  <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg cursor-pointer text-sm font-medium transition-colors">
                                    <Upload className="w-3 h-3" />
                                    Upload
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleTestimonialImageUpload(file, index);
                                      }}
                                      className="hidden"
                                      disabled={uploadingImage}
                                    />
                                  </label>
                                  <input
                                    type="text"
                                    value={testimonial.image || ''}
                                    onChange={(e) => updateTestimonial(index, 'image', e.target.value)}
                                    placeholder="Or enter URL"
                                    className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm focus:ring-2 focus:ring-accent-500"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Future Plans Section */}
                  {activeSection === 'future' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">Future Plans</h3>
                        <button
                          onClick={addFuturePlan}
                          className="flex items-center gap-2 px-3 py-1 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Add Plan
                        </button>
                      </div>

                      <div className="space-y-2">
                        {reportData.futurePlans?.map((plan, index) => (
                          <div key={index} className="flex gap-2 items-center p-3 bg-gray-700 rounded-lg">
                            <ChevronRight className="w-4 h-4 text-accent-400" />
                            <span className="flex-1 text-white">{plan}</span>
                            <button
                              onClick={() => removeFuturePlan(index)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Partners Section */}
                  {activeSection === 'partners' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">Partners</h3>
                        <button
                          onClick={addPartner}
                          className="flex items-center gap-2 px-3 py-1 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Add Partner
                        </button>
                      </div>

                      <div className="space-y-3">
                        {reportData.partners?.map((partner, index) => (
                          <div key={index} className="p-4 bg-gray-700 rounded-lg">
                            <div className="flex justify-end mb-2">
                              <button
                                onClick={() => removePartner(index)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={partner.name}
                                onChange={(e) => updatePartner(index, 'name', e.target.value)}
                                placeholder="Partner Name"
                                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                              />
                              <input
                                type="text"
                                value={partner.logo || ''}
                                onChange={(e) => updatePartner(index, 'logo', e.target.value)}
                                placeholder="Logo URL (optional)"
                                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                              />
                              <input
                                type="text"
                                value={partner.contribution}
                                onChange={(e) => updatePartner(index, 'contribution', e.target.value)}
                                placeholder="Contribution"
                                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-700">
                <button
                  onClick={() => {
                    setShowEditor(false);
                    setSelectedOutreach(null);
                    setReportData(null);
                  }}
                  className="px-6 py-2 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveReport}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
};

export default OutreachReportsManagement;
