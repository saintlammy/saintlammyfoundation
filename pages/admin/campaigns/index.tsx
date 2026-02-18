import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, CheckCircle, Clock, AlertCircle, Star, Calendar, Share2, Copy, QrCode, Upload, Loader, Image as ImageIcon, X } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Campaign } from '@/pages/api/campaigns';
import CampaignQRModal from '@/components/CampaignQRModal';

const CampaignsManagement: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState<Partial<Campaign>>({
    title: '',
    description: '',
    goal_amount: 0,
    current_amount: 0,
    currency: 'USD',
    deadline: '',
    status: 'draft',
    is_featured: false,
    impact_details: {},
    category: '',
    image_url: '',
    beneficiary_count: 70,
    stat_label: 'Orphans Need',
    urgency_message: 'Time is running out'
  });
  const [impactItems, setImpactItems] = useState<Array<{ amount: string; impact: string }>>([
    { amount: '', impact: '' }
  ]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/campaigns');
      const result = await response.json();
      if (result.success) {
        setCampaigns(result.data);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert impact items array to impact_details object
    const impact_details: Record<string, string> = {};
    impactItems.forEach(item => {
      if (item.amount && item.impact) {
        impact_details[item.amount] = item.impact;
      }
    });

    const submitData = {
      ...formData,
      impact_details
    };

    try {
      const url = editingCampaign
        ? `/api/campaigns?id=${editingCampaign.id}`
        : '/api/campaigns';

      const method = editingCampaign ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();

      if (result.success) {
        alert(editingCampaign ? 'Campaign updated successfully!' : 'Campaign created successfully!');
        setShowModal(false);
        resetForm();
        fetchCampaigns();
      } else {
        alert('Error: ' + (result.error || 'Failed to save campaign'));
      }
    } catch (error) {
      console.error('Error saving campaign:', error);
      alert('Failed to save campaign');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const response = await fetch(`/api/campaigns?id=${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        alert('Campaign deleted successfully!');
        fetchCampaigns();
      } else {
        alert('Error: ' + (result.error || 'Failed to delete campaign'));
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Failed to delete campaign');
    }
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      title: campaign.title,
      description: campaign.description,
      goal_amount: campaign.goal_amount,
      current_amount: campaign.current_amount,
      currency: campaign.currency,
      deadline: campaign.deadline ? new Date(campaign.deadline).toISOString().slice(0, 16) : '',
      status: campaign.status,
      is_featured: campaign.is_featured,
      impact_details: campaign.impact_details,
      category: campaign.category,
      image_url: campaign.image_url || ''
    });

    // Convert impact_details object to array for editing
    const impactArray = Object.entries(campaign.impact_details || {}).map(([amount, impact]) => ({
      amount,
      impact: impact as string
    }));
    setImpactItems(impactArray.length > 0 ? impactArray : [{ amount: '', impact: '' }]);

    setShowModal(true);
  };

  const resetForm = () => {
    setEditingCampaign(null);
    setFormData({
      title: '',
      description: '',
      goal_amount: 0,
      current_amount: 0,
      currency: 'USD',
      deadline: '',
      status: 'draft',
      is_featured: false,
      impact_details: {},
      category: '',
      image_url: ''
    });
    setImpactItems([{ amount: '', impact: '' }]);
  };

  const addImpactItem = () => {
    setImpactItems([...impactItems, { amount: '', impact: '' }]);
  };

  const removeImpactItem = (index: number) => {
    setImpactItems(impactItems.filter((_, i) => i !== index));
  };

  const updateImpactItem = (index: number, field: 'amount' | 'impact', value: string) => {
    const updated = [...impactItems];
    updated[index][field] = value;
    setImpactItems(updated);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    setUploadError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, image_url: base64String });
        setUploadingImage(false);
      };
      reader.onerror = () => {
        setUploadError('Failed to read image file');
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setUploadError('Failed to upload image');
      setUploadingImage(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4 text-green-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'archived':
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100).toFixed(1);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return currency === 'NGN' ? `₦${amount.toLocaleString()}` : `$${amount.toLocaleString()}`;
  };

  const handleCopyLink = async (campaign: Campaign) => {
    try {
      const url = `${window.location.origin}/#urgent-campaign?utm_source=admin_dashboard&utm_medium=share_link&utm_campaign=${encodeURIComponent(campaign.id)}&utm_content=${encodeURIComponent(campaign.title)}`;
      await navigator.clipboard.writeText(url);
      setCopiedId(campaign.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      alert('Failed to copy link to clipboard');
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Urgent Campaigns</h1>
            <p className="text-gray-400 mt-2">Manage fundraising campaigns</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Campaign</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No campaigns found. Create your first campaign!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold text-white">
                        {campaign.title}
                      </h3>
                      {campaign.is_featured && (
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      {campaign.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(campaign.status)}
                        <span className="text-gray-400 capitalize">
                          {campaign.status}
                        </span>
                      </div>
                      {campaign.category && (
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                          {campaign.category}
                        </span>
                      )}
                      {campaign.deadline && (
                        <div className="flex items-center space-x-1 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(campaign.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    {campaign.is_featured && (
                      <>
                        <button
                          onClick={() => handleCopyLink(campaign)}
                          className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Copy shareable link"
                        >
                          {copiedId === campaign.id ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Share2 className="w-5 h-5 text-blue-500" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCampaign(campaign);
                            setShowQRModal(true);
                          }}
                          className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                          title="Generate QR Code"
                        >
                          <QrCode className="w-5 h-5 text-purple-500" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleEdit(campaign)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Edit campaign"
                    >
                      <Edit className="w-5 h-5 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(campaign.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete campaign"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>{getProgressPercentage(campaign.current_amount, campaign.goal_amount)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-accent-500 to-accent-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressPercentage(campaign.current_amount, campaign.goal_amount)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>{formatCurrency(campaign.current_amount, campaign.currency)} raised</span>
                    <span>Goal: {formatCurrency(campaign.goal_amount, campaign.currency)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-white">
                  {editingCampaign ? 'Edit Campaign' : 'New Campaign'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Campaign Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                    placeholder="e.g., Feed 100 Widows Before Christmas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                    rows={4}
                    placeholder="Describe the campaign and its impact"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Goal Amount *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.goal_amount}
                      onChange={(e) => setFormData({ ...formData, goal_amount: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                      placeholder="1795"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Current Amount
                    </label>
                    <input
                      type="number"
                      value={formData.current_amount}
                      onChange={(e) => setFormData({ ...formData, current_amount: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="NGN">NGN (₦)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                      placeholder="e.g., widows, orphans, medical"
                    />
                  </div>
                </div>

                {/* Stats Display Section */}
                <div className="border-t border-gray-700 pt-6 mt-6">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Campaign Stats Display
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Configure the statistics displayed on the campaign card (e.g., "70+ Orphans Need Your Help")
                  </p>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Beneficiary Count
                      </label>
                      <input
                        type="number"
                        value={formData.beneficiary_count || 70}
                        onChange={(e) => setFormData({ ...formData, beneficiary_count: parseInt(e.target.value) || 70 })}
                        className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                        placeholder="70"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Number shown (e.g., 70+)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Stat Label
                      </label>
                      <input
                        type="text"
                        value={formData.stat_label || ''}
                        onChange={(e) => setFormData({ ...formData, stat_label: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                        placeholder="Orphans Need"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Label text (e.g., "Orphans Need")
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Urgency Message
                      </label>
                      <input
                        type="text"
                        value={formData.urgency_message || ''}
                        onChange={(e) => setFormData({ ...formData, urgency_message: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                        placeholder="Time is running out"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Bottom message
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <p className="text-sm font-medium text-gray-300 mb-2">Preview:</p>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">
                        {formData.beneficiary_count || 70}+
                      </div>
                      <div className="text-base text-gray-300">
                        {formData.stat_label || 'Orphans Need'}
                      </div>
                      <div className="text-base text-gray-300">Your Help</div>
                      <div className="text-xs text-gray-400 mt-2">
                        {formData.urgency_message || 'Time is running out'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Deadline
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Campaign['status'] })}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Campaign Image Upload */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Campaign Image
                  </label>

                  {uploadError && (
                    <div className="bg-red-500/20 border border-red-500 text-red-400 px-3 py-2 rounded-lg text-sm">
                      {uploadError}
                    </div>
                  )}

                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="w-full px-4 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      {uploadingImage ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5" />
                          Upload Campaign Image
                        </>
                      )}
                    </button>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Supported: JPG, PNG, GIF (Max 5MB)
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gray-800 text-gray-400">Or enter image URL</span>
                    </div>
                  </div>

                  <div>
                    <input
                      type="url"
                      value={formData.image_url?.startsWith('data:') ? '' : (formData.image_url || '')}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                      placeholder="https://example.com/image.jpg"
                      disabled={uploadingImage}
                    />
                  </div>

                  {formData.image_url && (
                    <div className="relative">
                      <img
                        src={formData.image_url}
                        alt="Campaign preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: '' })}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Impact Details (Donation amounts and their impact)
                  </label>
                  <div className="space-y-2">
                    {impactItems.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => updateImpactItem(index, 'amount', e.target.value)}
                          className="w-1/3 px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                          placeholder="Amount (e.g., 25)"
                        />
                        <input
                          type="text"
                          value={item.impact}
                          onChange={(e) => updateImpactItem(index, 'impact', e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                          placeholder="Impact description (e.g., Feeds one widow for 2 weeks)"
                        />
                        {impactItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImpactItem(index)}
                            className="px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addImpactItem}
                      className="text-sm text-accent-500 hover:text-accent-600 flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Impact Level</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 text-accent-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_featured" className="ml-2 text-sm text-gray-300">
                    Feature this campaign on homepage
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors"
                  >
                    {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* QR Code Modal */}
        {selectedCampaign && (
          <CampaignQRModal
            isOpen={showQRModal}
            onClose={() => {
              setShowQRModal(false);
              setSelectedCampaign(null);
            }}
            campaignId={selectedCampaign.id}
            campaignTitle={selectedCampaign.title}
            utmSource="admin_qr"
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default CampaignsManagement;
