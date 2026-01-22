import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, MapPin, Users, DollarSign, User, Mail, Upload, Loader } from 'lucide-react';

interface OutreachEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  mode: 'create' | 'edit';
}

const OutreachEditor: React.FC<OutreachEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft',
    featured_image: '',
    location: '',
    event_date: '',
    time: '',
    expected_attendees: '',
    budget: '',
    contact_info: '',
    organizer: '',
    volunteers_needed: '',
    activities: '',
    future_plans: '',
    impact: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      const details = initialData.outreach_details || {};
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        excerpt: initialData.excerpt || '',
        status: initialData.status || 'draft',
        featured_image: initialData.featured_image || '',
        location: details.location || '',
        event_date: details.event_date || '',
        time: details.time || '',
        expected_attendees: details.expected_attendees || '',
        budget: details.budget || '',
        contact_info: details.contact_info || '',
        organizer: details.organizer || '',
        volunteers_needed: details.volunteers_needed || '',
        activities: details.activities ? JSON.stringify(details.activities, null, 2) : '',
        future_plans: details.future_plans ? JSON.stringify(details.future_plans, null, 2) : '',
        impact: details.impact ? JSON.stringify(details.impact, null, 2) : ''
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Description is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.event_date) {
      newErrors.event_date = 'Event date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB');
      return;
    }

    try {
      setUploadingImage(true);

      // Compress image
      const compressedBase64 = await compressImage(file);
      setFormData(prev => ({ ...prev, featured_image: compressedBase64 }));

      alert('✅ Image uploaded and compressed successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new globalThis.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');

          // Calculate new dimensions (max 1200px width, maintain aspect ratio)
          let width = img.width;
          let height = img.height;
          const maxWidth = 1200;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression (0.7 = 70% quality)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

          const sizeInMB = (compressedBase64.length * 0.75) / (1024 * 1024);
          if (sizeInMB > 5) {
            reject(new Error('Compressed image is still too large. Please use a smaller image.'));
          } else {
            resolve(compressedBase64);
          }
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Parse JSON fields
    let activities = [];
    let futurePlans = [];
    let impact = [];

    console.log('🔍 OutreachEditor: Starting save...');
    console.log('📝 Form data:', {
      activities: formData.activities,
      future_plans: formData.future_plans,
      impact: formData.impact
    });

    try {
      if (formData.activities.trim()) {
        activities = JSON.parse(formData.activities);
        console.log('✅ Parsed activities:', activities);
      } else {
        console.log('⚠️ Activities field is empty');
      }
    } catch (e) {
      console.error('❌ Activities parse error:', e);
      alert('Invalid JSON format for Activities. Please check the format.');
      return;
    }

    try {
      if (formData.future_plans.trim()) {
        futurePlans = JSON.parse(formData.future_plans);
        console.log('✅ Parsed future_plans:', futurePlans);
      } else {
        console.log('⚠️ Future Plans field is empty');
      }
    } catch (e) {
      console.error('❌ Future Plans parse error:', e);
      alert('Invalid JSON format for Future Plans. Please check the format.');
      return;
    }

    try {
      if (formData.impact.trim()) {
        impact = JSON.parse(formData.impact);
        console.log('✅ Parsed impact:', impact);
      } else {
        console.log('⚠️ Impact field is empty');
      }
    } catch (e) {
      console.error('❌ Impact parse error:', e);
      alert('Invalid JSON format for Impact. Please check the format.');
      return;
    }

    // Format data for API
    const outreachData = {
      id: initialData?.id,
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt || formData.content.substring(0, 200),
      type: 'outreach',
      status: formData.status,
      featured_image: formData.featured_image,
      publish_date: new Date().toISOString(),
      outreach_details: {
        location: formData.location,
        event_date: formData.event_date,
        time: formData.time,
        expected_attendees: formData.expected_attendees ? parseInt(formData.expected_attendees) : 0,
        budget: formData.budget ? parseFloat(formData.budget) : 0,
        contact_info: formData.contact_info,
        organizer: formData.organizer,
        volunteers_needed: formData.volunteers_needed ? parseInt(formData.volunteers_needed) : 0,
        activities: activities,
        future_plans: futurePlans,
        impact: impact
      }
    };

    console.log('📦 Final outreach data to save:', JSON.stringify(outreachData.outreach_details, null, 2));
    onSave(outreachData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {mode === 'create' ? 'Create New Outreach' : 'Edit Outreach'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Outreach Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                  errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="e.g., Medical Outreach - Ikeja Community"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                rows={6}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                  errors.content ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Describe the outreach program in detail..."
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-500">{errors.content}</p>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Excerpt (Optional)
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="Short summary for preview..."
              />
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Featured Image
              </label>
              <div className="space-y-2">
                <input
                  type="url"
                  value={formData.featured_image.startsWith('data:') ? '' : formData.featured_image}
                  onChange={(e) => handleChange('featured_image', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="Image URL (or upload below)"
                />
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
                  className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingImage ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload from Device</span>
                    </>
                  )}
                </button>
                {formData.featured_image && formData.featured_image.startsWith('data:') && (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    ✅ Image uploaded ({(formData.featured_image.length / 1024).toFixed(0)} KB)
                  </p>
                )}
                {formData.featured_image && formData.featured_image.startsWith('http') && (
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    🔗 Using external URL
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Event Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                    errors.location ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="e.g., Ikeja, Lagos"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                )}
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Event Date *
                </label>
                <input
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => handleChange('event_date', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                    errors.event_date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.event_date && (
                  <p className="mt-1 text-sm text-red-500">{errors.event_date}</p>
                )}
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="e.g., 9:00 AM - 4:00 PM"
                />
              </div>

              {/* Expected Attendees */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Expected Attendees
                </label>
                <input
                  type="number"
                  value={formData.expected_attendees}
                  onChange={(e) => handleChange('expected_attendees', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="e.g., 500"
                  min="0"
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Budget (₦)
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleChange('budget', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="e.g., 500000"
                  min="0"
                  step="1000"
                />
              </div>

              {/* Volunteers Needed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Volunteers Needed
                </label>
                <input
                  type="number"
                  value={formData.volunteers_needed}
                  onChange={(e) => handleChange('volunteers_needed', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="e.g., 20"
                  min="0"
                />
              </div>
            </div>

            {/* Organizer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Organizer
              </label>
              <input
                type="text"
                value={formData.organizer}
                onChange={(e) => handleChange('organizer', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="e.g., Saintlammy Foundation Team"
              />
            </div>

            {/* Contact Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Contact Information
              </label>
              <input
                type="text"
                value={formData.contact_info}
                onChange={(e) => handleChange('contact_info', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="e.g., outreach@saintlammyfoundation.org"
              />
            </div>
          </div>

          {/* Additional Details (Optional) */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Additional Details (Optional)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use JSON format to add structured data for activities, impact metrics, and future plans.
            </p>

            {/* Activities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Activities Conducted (JSON Array)
              </label>
              <textarea
                value={formData.activities}
                onChange={(e) => handleChange('activities', e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm"
                placeholder='[{"title": "Activity Name", "description": "Description", "completed": true}]'
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Example: [{'"title": "Registration", "description": "Patient registration", "completed": true'}]
              </p>
            </div>

            {/* Impact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Impact Metrics (JSON Array)
              </label>
              <textarea
                value={formData.impact}
                onChange={(e) => handleChange('impact', e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm"
                placeholder='[{"title": "Metric Name", "value": 100, "description": "Description"}]'
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Example: [{'"title": "People Reached", "value": 487, "description": "Total beneficiaries"'}]
              </p>
            </div>

            {/* Future Plans */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Future Plans (JSON Array of Strings)
              </label>
              <textarea
                value={formData.future_plans}
                onChange={(e) => handleChange('future_plans', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm"
                placeholder='["Plan 1", "Plan 2", "Plan 3"]'
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Example: ["Expand to more communities", "Partner with hospitals"]
              </p>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors"
            >
              {mode === 'create' ? 'Create Outreach' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OutreachEditor;
