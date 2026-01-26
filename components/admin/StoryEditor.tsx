import React, { useState, useEffect } from 'react';
import { X, Save, User, MapPin, Calendar, Quote as QuoteIcon, Target, Image as ImageIcon, Tag } from 'lucide-react';

interface StoryEditorProps {
  isOpen: boolean;
  onClose: () => void;
  story?: any;
  onSave: (storyData: any) => Promise<void>;
}

const StoryEditor: React.FC<StoryEditorProps> = ({ isOpen, onClose, story, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    category: 'orphan' as 'orphan' | 'widow' | 'community',
    story: '',
    quote: '',
    impact: '',
    dateHelped: '',
    image: '',
    status: 'published'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (story) {
      setFormData({
        name: story.story_details?.beneficiary_name || story.name || '',
        age: story.story_details?.beneficiary_age?.toString() || story.age?.toString() || '',
        location: story.story_details?.location || story.location || '',
        category: story.story_details?.category || story.category || 'orphan',
        story: story.content || story.story || '',
        quote: story.story_details?.quote || story.quote || '',
        impact: story.story_details?.impact || story.impact || '',
        dateHelped: story.story_details?.date_helped || story.dateHelped || '',
        image: story.featured_image || story.image || '',
        status: story.status || 'published'
      });
    } else {
      setFormData({
        name: '',
        age: '',
        location: '',
        category: 'orphan',
        story: '',
        quote: '',
        impact: '',
        dateHelped: '',
        image: '',
        status: 'published'
      });
    }
  }, [story]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.story || !formData.location) {
      setError('Name, story, and location are required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const storyData = {
        title: `${formData.name}'s Story`,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        content: formData.story,
        excerpt: formData.story.substring(0, 200),
        type: 'story',
        status: formData.status,
        featured_image: formData.image,
        publish_date: formData.dateHelped || new Date().toISOString(),
        story_details: {
          beneficiary_name: formData.name,
          beneficiary_age: formData.age ? parseInt(formData.age) : undefined,
          location: formData.location,
          category: formData.category,
          quote: formData.quote,
          impact: formData.impact,
          date_helped: formData.dateHelped || new Date().toISOString().split('T')[0]
        }
      };

      await onSave(storyData);
      onClose();
    } catch (err) {
      setError('Failed to save story. Please try again.');
      console.error('Error saving story:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {story ? 'Edit Success Story' : 'Create New Success Story'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  placeholder="Beneficiary's name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  placeholder="Age"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  placeholder="City, State"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500"
                >
                  <option value="orphan">Orphan Support</option>
                  <option value="widow">Widow Support</option>
                  <option value="community">Community Support</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date Supported Since
              </label>
              <input
                type="date"
                value={formData.dateHelped}
                onChange={(e) => setFormData({ ...formData, dateHelped: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Story Content */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Story Content</h3>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Success Story *
              </label>
              <textarea
                value={formData.story}
                onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                placeholder="Write the full success story here..."
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Tell the beneficiary's story - how they came to us, how we helped, and where they are now.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <QuoteIcon className="w-4 h-4 inline mr-1" />
                Quote
              </label>
              <textarea
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                placeholder="A memorable quote from the beneficiary..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Target className="w-4 h-4 inline mr-1" />
                Impact Description
              </label>
              <textarea
                value={formData.impact}
                onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                placeholder="Describe the measurable impact of the support..."
              />
              <p className="text-xs text-gray-400 mt-1">
                E.g., "Graduated with honors, now a university student studying medicine"
              </p>
            </div>
          </div>

          {/* Featured Image */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Featured Image
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                placeholder="https://..."
              />
              {formData.image && (
                <div className="mt-3">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-accent-500 hover:bg-accent-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {story ? 'Update Story' : 'Create Story'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoryEditor;
