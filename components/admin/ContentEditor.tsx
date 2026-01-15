import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Eye,
  Image,
  Link,
  Bold,
  Italic,
  List,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Calendar,
  Tag,
  Upload,
  Loader,
  Check,
  AlertCircle
} from 'lucide-react';

interface ContentEditorProps {
  isOpen: boolean;
  onClose: () => void;
  content?: any;
  onSave: (contentData: any) => Promise<void>;
}

interface ContentData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  type: 'page' | 'blog' | 'program' | 'story' | 'media' | 'team' | 'partnership';
  status: 'published' | 'draft' | 'scheduled' | 'archived';
  featured_image: string;
  publish_date: string;
  metadata: {
    seo_title?: string;
    seo_description?: string;
    keywords?: string[];
  };
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  isOpen,
  onClose,
  content,
  onSave
}) => {
  const [formData, setFormData] = useState<ContentData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    type: 'page',
    status: 'draft',
    featured_image: '',
    publish_date: '',
    metadata: {}
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title || '',
        slug: content.slug || '',
        content: content.content || '',
        excerpt: content.excerpt || '',
        type: content.type || 'page',
        status: content.status || 'draft',
        featured_image: content.featured_image || '',
        publish_date: content.publish_date || '',
        metadata: content.metadata || {}
      });
    } else {
      // Reset form for new content
      setFormData({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        type: 'page',
        status: 'draft',
        featured_image: '',
        publish_date: '',
        metadata: {}
      });
    }
  }, [content]);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }));
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
          console.log(`Compressed image: ${sizeInMB.toFixed(2)}MB`);

          resolve(compressedBase64);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (status?: 'draft' | 'published') => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const submitData = {
        ...formData,
        status: status || formData.status,
        id: content?.id
      };

      await onSave(submitData);
      setSuccess(content ? 'Content updated successfully!' : 'Content created successfully!');

      if (status === 'published') {
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save content');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contentTypes = [
    { value: 'page', label: 'Page' },
    { value: 'blog', label: 'Blog Post' },
    { value: 'program', label: 'Program' },
    { value: 'story', label: 'Story' },
    { value: 'media', label: 'Media' },
    { value: 'team', label: 'Team Member' },
    { value: 'partnership', label: 'Partnership' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft', color: 'gray' },
    { value: 'published', label: 'Published', color: 'green' },
    { value: 'scheduled', label: 'Scheduled', color: 'blue' },
    { value: 'archived', label: 'Archived', color: 'red' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-white">
              {content ? 'Edit Content' : 'Create New Content'}
            </h2>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              {contentTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>{showPreview ? 'Edit' : 'Preview'}</span>
            </button>

            <button
              onClick={() => handleSubmit('draft')}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Draft</span>
            </button>

            <button
              onClick={() => handleSubmit('published')}
              disabled={isSubmitting || !formData.title || !formData.content}
              className="flex items-center space-x-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Publish</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mx-6 mt-4 p-3 bg-green-900/50 border border-green-500/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-green-400">{success}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-red-400">{error}</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 bg-gray-800 border-r border-gray-700 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Featured Image</label>
                <div className="space-y-2">
                  <input
                    type="url"
                    value={formData.featured_image}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                    placeholder="Image URL"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
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
                    className="flex items-center justify-center space-x-2 w-full px-3 py-2 bg-gray-600 hover:bg-gray-500 text-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingImage ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload Image</span>
                      </>
                    )}
                  </button>
                </div>
                {formData.featured_image && (
                  <div className="mt-2">
                    <img
                      src={formData.featured_image}
                      alt="Featured"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Publish Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Publish Date</label>
                <input
                  type="datetime-local"
                  value={formData.publish_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, publish_date: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>

              {/* SEO Settings */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">SEO Settings</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.metadata.seo_title || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metadata: { ...prev.metadata, seo_title: e.target.value }
                    }))}
                    placeholder="SEO Title"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                  <textarea
                    value={formData.metadata.seo_description || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metadata: { ...prev.metadata, seo_description: e.target.value }
                    }))}
                    placeholder="SEO Description"
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                  <input
                    type="text"
                    value={(formData.metadata.keywords || []).join(', ')}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                      }
                    }))}
                    placeholder="Keywords (comma separated)"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Editor */}
          <div className="flex-1 flex flex-col">
            {!showPreview ? (
              <>
                {/* Title and Slug */}
                <div className="p-6 border-b border-gray-700">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Content title..."
                    className="w-full text-2xl font-bold bg-transparent text-white placeholder-gray-400 focus:outline-none mb-3"
                  />
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-400">URL:</span>
                    <span className="text-gray-500">{window.location.origin}/</span>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="bg-transparent text-accent-400 focus:outline-none border-b border-transparent hover:border-gray-600 focus:border-accent-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div className="px-6 py-4 border-b border-gray-700">
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief excerpt or summary..."
                    rows={2}
                    className="w-full bg-transparent text-gray-300 placeholder-gray-400 focus:outline-none resize-none"
                  />
                </div>

                {/* Editor Toolbar */}
                <div className="px-6 py-3 border-b border-gray-700 flex items-center space-x-1">
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors">
                    <Bold className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors">
                    <Italic className="w-4 h-4" />
                  </button>
                  <div className="w-px h-6 bg-gray-700 mx-2" />
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors">
                    <List className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors">
                    <Quote className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors">
                    <Code className="w-4 h-4" />
                  </button>
                  <div className="w-px h-6 bg-gray-700 mx-2" />
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors">
                    <Link className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors">
                    <Image className="w-4 h-4" />
                  </button>
                </div>

                {/* Content Editor */}
                <div className="flex-1 p-6">
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Start writing your content..."
                    className="w-full h-full bg-transparent text-white placeholder-gray-400 focus:outline-none resize-none"
                  />
                </div>
              </>
            ) : (
              /* Preview Mode */
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                  {formData.featured_image && (
                    <img
                      src={formData.featured_image}
                      alt={formData.title}
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                  )}
                  <h1 className="text-3xl font-bold text-white mb-4">{formData.title}</h1>
                  {formData.excerpt && (
                    <p className="text-xl text-gray-400 mb-6">{formData.excerpt}</p>
                  )}
                  <div className="prose prose-invert max-w-none">
                    <div
                      className="text-gray-300 whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, '<br>') }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;