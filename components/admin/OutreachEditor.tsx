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
    status: 'upcoming',
    featured_image: '',
    location: '',
    event_date: '',
    time: '',
    expected_attendees: '',
    budget_planned: '',
    // Post-event fields (ongoing / completed only)
    actual_attendees: '',
    budget_actual: '',
    volunteers_participated: '',
    volunteer_hours: '',
    contact_info: '',
    organizer: '',
    volunteers_needed: '',
    activities: '',
    future_plans: '',
    impact: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Derived status flags
  const isUpcoming = formData.status === 'upcoming' || formData.status === 'draft';
  const isCompleted = formData.status === 'completed';
  const isOngoing = formData.status === 'ongoing';

  useEffect(() => {
    if (initialData) {
      const details = initialData.outreach_details || {};
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        excerpt: initialData.excerpt || '',
        status: initialData.status || 'upcoming',
        featured_image: initialData.featured_image || '',
        location: details.location || '',
        event_date: details.event_date || '',
        time: details.time || '',
        expected_attendees: details.expected_attendees ? String(details.expected_attendees) : '',
        budget_planned: details.budget_planned ? String(details.budget_planned) : (details.budget ? String(details.budget) : ''),
        actual_attendees: details.actual_attendees ? String(details.actual_attendees) : '',
        budget_actual: details.budget_actual ? String(details.budget_actual) : '',
        volunteers_participated: details.volunteers_participated ? String(details.volunteers_participated) : '',
        volunteer_hours: details.volunteer_hours ? String(details.volunteer_hours) : '',
        contact_info: details.contact_info || '',
        organizer: details.organizer || '',
        volunteers_needed: details.volunteers_needed ? String(details.volunteers_needed) : '',
        activities: details.activities ? JSON.stringify(details.activities, null, 2) : '',
        future_plans: details.future_plans ? JSON.stringify(details.future_plans, null, 2) : '',
        impact: details.impact ? JSON.stringify(details.impact, null, 2) : ''
      });
    } else {
      setFormData({
        title: '', content: '', excerpt: '', status: 'upcoming', featured_image: '',
        location: '', event_date: '', time: '', expected_attendees: '', budget_planned: '',
        actual_attendees: '', budget_actual: '', volunteers_participated: '', volunteer_hours: '',
        contact_info: '', organizer: '', volunteers_needed: '', activities: '', future_plans: '', impact: ''
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

    let activities = [];
    let futurePlans = [];
    let impact = [];

    try {
      if (formData.activities.trim()) activities = JSON.parse(formData.activities);
    } catch {
      alert('Invalid JSON format for Activities. Please check the format.');
      return;
    }
    try {
      if (formData.future_plans.trim()) futurePlans = JSON.parse(formData.future_plans);
    } catch {
      alert('Invalid JSON format for Future Plans. Please check the format.');
      return;
    }
    try {
      if (formData.impact.trim()) impact = JSON.parse(formData.impact);
    } catch {
      alert('Invalid JSON format for Impact Metrics. Please check the format.');
      return;
    }

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
        budget_planned: formData.budget_planned ? parseFloat(formData.budget_planned) : 0,
        contact_info: formData.contact_info,
        organizer: formData.organizer,
        volunteers_needed: formData.volunteers_needed ? parseInt(formData.volunteers_needed) : 0,
        activities: activities,
        future_plans: futurePlans,
        // Post-event fields — only included for ongoing/completed
        ...(!isUpcoming && {
          actual_attendees: formData.actual_attendees ? parseInt(formData.actual_attendees) : 0,
          budget_actual: formData.budget_actual ? parseFloat(formData.budget_actual) : 0,
          volunteers_participated: formData.volunteers_participated ? parseInt(formData.volunteers_participated) : 0,
          volunteer_hours: formData.volunteer_hours ? parseInt(formData.volunteer_hours) : 0,
          impact: impact,
        }),
      }
    };

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
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {mode === 'create' ? 'Create New Outreach' : 'Edit Outreach'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {isUpcoming && 'Upcoming — fill in planned details'}
              {isOngoing && 'Ongoing — add real-time progress data'}
              {isCompleted && 'Completed — fill in all results and impact data'}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">

          {/* STATUS — top so it drives the rest of the form */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white"
            >
              <option value="draft">Draft</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* ── Basic Information ── */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-2">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Outreach Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg bg-gray-900 text-white ${errors.title ? 'border-red-500' : 'border-gray-600'}`}
                placeholder="e.g., Medical Outreach – Ikeja Community"
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
              <textarea
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                rows={5}
                className={`w-full px-4 py-2 border rounded-lg bg-gray-900 text-white ${errors.content ? 'border-red-500' : 'border-gray-600'}`}
                placeholder={isUpcoming ? 'Describe what this outreach will do...' : 'Describe what happened at this outreach...'}
              />
              {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt (Optional)</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white"
                placeholder="Short summary for preview cards..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Featured Image</label>
              <div className="space-y-2">
                <input
                  type="url"
                  value={formData.featured_image.startsWith('data:') ? '' : formData.featured_image}
                  onChange={(e) => handleChange('featured_image', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white"
                  placeholder="Image URL (or upload below)"
                />
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingImage
                    ? <><Loader className="w-4 h-4 animate-spin" /><span>Uploading...</span></>
                    : <><Upload className="w-4 h-4" /><span>Upload from Device</span></>}
                </button>
                {formData.featured_image.startsWith('data:') && <p className="text-xs text-green-400">✅ Image uploaded ({(formData.featured_image.length / 1024).toFixed(0)} KB)</p>}
                {formData.featured_image.startsWith('http') && <p className="text-xs text-blue-400">🔗 Using external URL</p>}
              </div>
            </div>
          </div>

          {/* ── Event Details ── */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-2">Event Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2"><MapPin className="w-4 h-4 inline mr-1" />Location *</label>
                <input type="text" value={formData.location} onChange={(e) => handleChange('location', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-gray-900 text-white ${errors.location ? 'border-red-500' : 'border-gray-600'}`}
                  placeholder="e.g., Ikeja, Lagos" />
                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2"><Calendar className="w-4 h-4 inline mr-1" />{isUpcoming ? 'Planned Date *' : 'Event Date *'}</label>
                <input type="date" value={formData.event_date} onChange={(e) => handleChange('event_date', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-gray-900 text-white ${errors.event_date ? 'border-red-500' : 'border-gray-600'}`} />
                {errors.event_date && <p className="mt-1 text-sm text-red-500">{errors.event_date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                <input type="text" value={formData.time} onChange={(e) => handleChange('time', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white" placeholder="e.g., 9:00 AM – 4:00 PM" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2"><Users className="w-4 h-4 inline mr-1" />{isUpcoming ? 'Expected Attendees' : 'Target Beneficiaries'}</label>
                <input type="number" value={formData.expected_attendees} onChange={(e) => handleChange('expected_attendees', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white" placeholder="e.g., 500" min="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2"><DollarSign className="w-4 h-4 inline mr-1" />Planned Budget (₦)</label>
                <input type="number" value={formData.budget_planned} onChange={(e) => handleChange('budget_planned', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white" placeholder="e.g., 500000" min="0" step="1000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2"><User className="w-4 h-4 inline mr-1" />{isUpcoming ? 'Volunteers Needed' : 'Volunteers Registered'}</label>
                <input type="number" value={formData.volunteers_needed} onChange={(e) => handleChange('volunteers_needed', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white" placeholder="e.g., 20" min="0" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Organizer</label>
              <input type="text" value={formData.organizer} onChange={(e) => handleChange('organizer', e.target.value)}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white" placeholder="e.g., Saintlammy Foundation Team" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2"><Mail className="w-4 h-4 inline mr-1" />Contact Information</label>
              <input type="text" value={formData.contact_info} onChange={(e) => handleChange('contact_info', e.target.value)}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white" placeholder="e.g., outreach@saintlammyfoundation.org" />
            </div>
          </div>

          {/* ── Planned Activities (all statuses) ── */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-2">
              {isUpcoming ? 'Planned Activities' : 'Activities'}
            </h3>
            <p className="text-sm text-gray-400">
              {isUpcoming
                ? 'List activities you plan to carry out. Set "completed": false for all when creating.'
                : 'List all activities. Set "completed": true for finished ones.'}
            </p>
            <textarea
              value={formData.activities}
              onChange={(e) => handleChange('activities', e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white font-mono text-sm"
              placeholder={`[{"title": "Registration", "description": "Participant sign-in", "completed": ${isUpcoming ? 'false' : 'true'}}]`}
            />
            <p className="text-xs text-gray-500">JSON array — each item needs "title", "description", "completed" (true/false)</p>
          </div>

          {/* ── Post-Event Results (ongoing + completed only) ── */}
          {!isUpcoming && (
            <div className="space-y-4 bg-gray-700/30 rounded-xl p-5 border border-gray-600">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                {isOngoing ? 'Progress So Far' : 'Event Results'}
                <span className="text-xs text-accent-400 font-normal bg-accent-500/10 px-2 py-0.5 rounded-full">
                  {isOngoing ? 'Ongoing' : 'Completed'}
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2"><Users className="w-4 h-4 inline mr-1" />Actual Beneficiaries Reached</label>
                  <input type="number" value={formData.actual_attendees} onChange={(e) => handleChange('actual_attendees', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white" placeholder="e.g., 487" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2"><DollarSign className="w-4 h-4 inline mr-1" />Actual Expenditure (₦)</label>
                  <input type="number" value={formData.budget_actual} onChange={(e) => handleChange('budget_actual', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white" placeholder="e.g., 480000" min="0" step="1000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2"><User className="w-4 h-4 inline mr-1" />Volunteers Participated</label>
                  <input type="number" value={formData.volunteers_participated} onChange={(e) => handleChange('volunteers_participated', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white" placeholder="e.g., 18" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2"><Calendar className="w-4 h-4 inline mr-1" />Total Volunteer Hours</label>
                  <input type="number" value={formData.volunteer_hours} onChange={(e) => handleChange('volunteer_hours', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white" placeholder="e.g., 144" min="0" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Impact Metrics (JSON Array)</label>
                <textarea
                  value={formData.impact}
                  onChange={(e) => handleChange('impact', e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white font-mono text-sm"
                  placeholder='[{"title": "People Reached", "value": 487, "description": "Total beneficiaries served"}]'
                />
                <p className="mt-1 text-xs text-gray-500">JSON array — each item needs "title", "value" (number), "description"</p>
              </div>
            </div>
          )}

          {/* ── Future Plans (all statuses) ── */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-2">Future Plans</h3>
            <textarea
              value={formData.future_plans}
              onChange={(e) => handleChange('future_plans', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white font-mono text-sm"
              placeholder='["Expand to 3 more communities", "Partner with local hospitals"]'
            />
            <p className="text-xs text-gray-500">JSON array of strings — e.g., ["Plan one", "Plan two"]</p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-700">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors">
              {mode === 'create' ? 'Create Outreach' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OutreachEditor;
