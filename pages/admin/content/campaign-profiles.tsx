import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Plus, Search, Edit, Trash2, Heart, Users, X, Save, Loader2, Check, AlertCircle, Eye, Tag, Upload, Image as ImageIcon
} from 'lucide-react';
import type { CampaignProfile, Campaign } from '@/types';

const CampaignProfilesManagement: React.FC = () => {
  const [profiles, setProfiles] = useState<CampaignProfile[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<CampaignProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalSponsors: 0,
    totalFunding: 0
  });

  useEffect(() => {
    loadData();
  }, [selectedCampaign, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load campaigns (filter by vulnerable_homes type)
      const campaignsRes = await fetch('/api/campaigns?campaign_type=vulnerable_homes');
      const campaignsData = await campaignsRes.json();
      setCampaigns(campaignsData.success ? campaignsData.data : []);

      // Load profiles
      const params = new URLSearchParams();
      if (selectedCampaign !== 'all') {
        params.set('campaign_id', selectedCampaign);
      }
      if (statusFilter !== 'all') {
        params.set('status', statusFilter);
      }

      const profilesRes = await fetch(`/api/campaign-profiles?${params.toString()}`);
      const profilesData = await profilesRes.json();

      if (profilesData.success) {
        setProfiles(profilesData.data);

        // Calculate stats
        const active = profilesData.data.filter((p: CampaignProfile) => p.status === 'active').length;
        const totalSponsors = profilesData.data.reduce((sum: number, p: CampaignProfile) => sum + p.sponsor_count, 0);
        const totalFunding = profilesData.data.reduce((sum: number, p: CampaignProfile) => sum + p.current_funding, 0);

        setStats({
          total: profilesData.data.length,
          active,
          totalSponsors,
          totalFunding
        });
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (profileData: Partial<CampaignProfile>) => {
    try {
      setSaving(true);

      console.log('Saving profile data:', profileData);

      const url = selectedProfile
        ? `/api/campaign-profiles?id=${selectedProfile.id}`
        : '/api/campaign-profiles';

      const method = selectedProfile ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });

      const data = await res.json();
      console.log('Save response:', data);

      if (data.success) {
        setShowEditor(false);
        setSelectedProfile(null);
        await loadData();
      } else {
        const errorMsg = data.error || data.message || 'Failed to save profile';
        console.error('Save failed:', errorMsg);
        alert(`Error: ${errorMsg}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert(`Failed to save profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }

    try {
      const res = await fetch(`/api/campaign-profiles?id=${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        await loadData();
      } else {
        alert(`Error: ${data.error || 'Failed to delete profile'}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete profile');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const filteredProfiles = profiles.filter(profile =>
    profile.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.descriptor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.profile_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Campaign Profiles Management | Admin Dashboard</title>
      </Head>

      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Campaign Profiles</h1>
              <p className="text-gray-400">Manage vulnerable homes and beneficiary profiles</p>
            </div>
            <button
              onClick={() => {
                setSelectedProfile(null);
                setShowEditor(true);
              }}
              className="flex items-center gap-2 bg-accent-600 hover:bg-accent-700 text-white px-5 py-2.5 rounded-lg transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Profile
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Profiles"
              value={stats.total}
              icon={Users}
              color="bg-blue-500"
            />
            <StatCard
              label="Active"
              value={stats.active}
              icon={Check}
              color="bg-green-500"
            />
            <StatCard
              label="Total Sponsors"
              value={stats.totalSponsors}
              icon={Heart}
              color="bg-red-500"
            />
            <StatCard
              label="Total Funding"
              value={`$${stats.totalFunding.toLocaleString()}`}
              icon={Heart}
              color="bg-amber-500"
            />
          </div>

          {/* Filters */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search profiles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                />
              </div>

              {/* Campaign Filter */}
              <select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
              >
                <option value="all">All Campaigns</option>
                {campaigns.map(campaign => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.title}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Profiles Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-accent-500 animate-spin" />
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No profiles found</h3>
              <p className="text-gray-500">Create your first campaign profile to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map(profile => (
                <ProfileListCard
                  key={profile.id}
                  profile={profile}
                  onEdit={() => {
                    setSelectedProfile(profile);
                    setShowEditor(true);
                  }}
                  onDelete={() => handleDelete(profile.id)}
                  deleteConfirm={deleteConfirm === profile.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Editor Modal */}
        {showEditor && (
          <ProfileEditorModal
            profile={selectedProfile}
            campaigns={campaigns}
            onSave={handleSave}
            onClose={() => {
              setShowEditor(false);
              setSelectedProfile(null);
            }}
            saving={saving}
          />
        )}
      </AdminLayout>
    </>
  );
};

// Stat Card Component
const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}> = ({ label, value, icon: Icon, color }) => (
  <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-400 text-sm">{label}</span>
      <div className={`${color} p-2 rounded-lg`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
  </div>
);

// Profile List Card Component
const ProfileListCard: React.FC<{
  profile: CampaignProfile;
  onEdit: () => void;
  onDelete: () => void;
  deleteConfirm: boolean;
}> = ({ profile, onEdit, onDelete, deleteConfirm }) => (
  <div className="bg-gray-800 rounded-lg border border-gray-700 p-5 hover:border-accent-500 transition-colors">
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-accent-400">
            {profile.profile_code}
          </span>
          {profile.is_featured && (
            <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full">
              Featured
            </span>
          )}
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            profile.status === 'active' ? 'bg-green-500/20 text-green-400' :
            profile.status === 'draft' ? 'bg-gray-500/20 text-gray-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {profile.status}
          </span>
        </div>
        <h3 className="text-white font-semibold line-clamp-2 mb-1">
          {profile.title}
        </h3>
        <p className="text-sm text-gray-400 mb-2">{profile.descriptor}</p>
      </div>
    </div>

    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
      {profile.story_snippet}
    </p>

    {profile.tags && profile.tags.length > 0 && (
      <div className="flex flex-wrap gap-1.5 mb-4">
        {profile.tags.slice(0, 3).map((tag, idx) => (
          <span key={idx} className="text-xs px-2 py-0.5 bg-teal-500/20 text-teal-400 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    )}

    <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
      {profile.sponsor_count > 0 && (
        <span className="flex items-center gap-1">
          <Heart className="w-4 h-4 text-red-500" />
          {profile.sponsor_count}
        </span>
      )}
      {profile.current_funding > 0 && (
        <span className="flex items-center gap-1">
          ${profile.current_funding.toLocaleString()}
        </span>
      )}
    </div>

    <div className="flex gap-2">
      <button
        onClick={onEdit}
        className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
      >
        <Edit className="w-4 h-4" />
        Edit
      </button>
      <button
        onClick={onDelete}
        className={`px-3 py-2 rounded-lg transition-colors text-sm flex items-center gap-2 ${
          deleteConfirm
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-red-400'
        }`}
      >
        <Trash2 className="w-4 h-4" />
        {deleteConfirm ? 'Confirm?' : ''}
      </button>
    </div>
  </div>
);

// Profile Editor Modal Component
const ProfileEditorModal: React.FC<{
  profile: CampaignProfile | null;
  campaigns: Campaign[];
  onSave: (data: Partial<CampaignProfile>) => void;
  onClose: () => void;
  saving: boolean;
}> = ({ profile, campaigns, onSave, onClose, saving }) => {
  const [formData, setFormData] = useState<Partial<CampaignProfile>>({
    campaign_id: profile?.campaign_id || campaigns[0]?.id || '',
    profile_code: profile?.profile_code || '',
    title: profile?.title || '',
    descriptor: profile?.descriptor || '',
    story_snippet: profile?.story_snippet || '',
    story_full: profile?.story_full || '',
    how_your_gift_helps: profile?.how_your_gift_helps || '',
    tags: profile?.tags || [],
    image_url: profile?.image_url || '',
    video_url: profile?.video_url || '',
    status: profile?.status || 'draft',
    is_featured: profile?.is_featured || false,
    sort_order: profile?.sort_order || 0,
    funding_goal: profile?.funding_goal || undefined,
  });

  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(profile?.image_url || '');

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tag)
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, WebP, or GIF)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB');
      return;
    }

    try {
      setUploading(true);

      // Convert to base64 and store directly
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;

        // Store the base64 data URL directly in the database
        // This works without needing external file storage
        setFormData({
          ...formData,
          image_url: base64
        });
        setImagePreview(base64);

        setUploading(false);
      };

      reader.onerror = () => {
        alert('Failed to read image file');
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-800 z-10">
          <h2 className="text-2xl font-bold text-white">
            {profile ? 'Edit Profile' : 'Add New Profile'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Campaign Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Campaign</label>
            <select
              value={formData.campaign_id}
              onChange={(e) => setFormData({ ...formData, campaign_id: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
              required
            >
              {campaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.title}
                </option>
              ))}
            </select>
          </div>

          {/* Profile Code & Title */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Profile Code *
              </label>
              <input
                type="text"
                value={formData.profile_code}
                onChange={(e) => setFormData({ ...formData, profile_code: e.target.value })}
                placeholder="e.g., VH-001"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Serah — Carrying Two Futures Alone"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500"
                required
              />
            </div>
          </div>

          {/* Descriptor */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Descriptor</label>
            <input
              type="text"
              value={formData.descriptor}
              onChange={(e) => setFormData({ ...formData, descriptor: e.target.value })}
              placeholder="e.g., Single mother of two children"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500"
            />
          </div>

          {/* Story Snippet */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Story Snippet * (for cards)
            </label>
            <textarea
              value={formData.story_snippet}
              onChange={(e) => setFormData({ ...formData, story_snippet: e.target.value })}
              rows={3}
              placeholder="Short story for card display (150-200 characters)"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 resize-none"
              required
            />
          </div>

          {/* Full Story */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Story *
            </label>
            <textarea
              value={formData.story_full}
              onChange={(e) => setFormData({ ...formData, story_full: e.target.value })}
              rows={6}
              placeholder="Complete story for detail modal"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 resize-none"
              required
            />
          </div>

          {/* How Your Gift Helps */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              How Your Gift Helps
            </label>
            <textarea
              value={formData.how_your_gift_helps}
              onChange={(e) => setFormData({ ...formData, how_your_gift_helps: e.target.value })}
              rows={2}
              placeholder="e.g., Food + hygiene pack and targeted school support"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add tag (press Enter)"
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 text-teal-400 rounded-full text-sm"
                >
                  <Tag className="w-3.5 h-3.5" />
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-teal-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Profile Image</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Image Preview */}
              <div className="relative">
                {(imagePreview || formData.image_url) ? (
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-700 border-2 border-gray-600">
                    <img
                      src={imagePreview || formData.image_url}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, image_url: '' });
                        setImagePreview('');
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg bg-gray-700 border-2 border-dashed border-gray-600 flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon className="w-12 h-12 mb-2" />
                    <p className="text-sm">No image uploaded</p>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="space-y-3">
                <div>
                  <label htmlFor="image-upload" className="block">
                    <div className="px-4 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-2">
                      {uploading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5" />
                          Upload Image
                        </>
                      )}
                    </div>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Supported: JPEG, PNG, WebP, GIF<br />
                  Max size: 10MB
                </p>

                {/* Manual URL Input */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Or paste image URL</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => {
                      setFormData({ ...formData, image_url: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-accent-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Video URL (Optional)</label>
            <input
              type="url"
              value={formData.video_url}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              placeholder="https://youtube.com/embed/... or https://vimeo.com/..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500"
            />
          </div>

          {/* Status, Featured, Sort Order, Funding Goal */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort Order</label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Funding Goal ($)</label>
              <input
                type="number"
                value={formData.funding_goal || ''}
                onChange={(e) => setFormData({ ...formData, funding_goal: parseFloat(e.target.value) || undefined })}
                placeholder="Optional"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 text-accent-600 focus:ring-accent-500 border-gray-600 rounded"
                />
                <span className="text-sm text-gray-300">Featured</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex justify-end gap-3 sticky bottom-0 bg-gray-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            disabled={saving || !formData.campaign_id || !formData.profile_code || !formData.title}
            className="px-5 py-2.5 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignProfilesManagement;
