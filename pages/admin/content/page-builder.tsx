import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, Trash2, Edit, Save, X, ArrowUp, ArrowDown } from 'lucide-react';

interface ContentItem {
  id: string;
  page_slug: string;
  section: string;
  order_index: number;
  data: any;
  created_at?: string;
  updated_at?: string;
}

const PageBuilder: React.FC = () => {
  const router = useRouter();
  const [selectedPage, setSelectedPage] = useState('about');
  const [selectedSection, setSelectedSection] = useState('team');
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const pages = ['about', 'governance', 'home'];
  const sections: { [key: string]: string[] } = {
    about: ['team', 'milestones', 'values'],
    governance: ['board', 'policies', 'documents'],
    home: ['who-we-are', 'mission', 'vision']
  };

  const iconOptions = ['Heart', 'Users', 'Target', 'Award', 'Globe', 'MapPin', 'Calendar', 'Clock', 'Mail', 'Phone', 'Shield', 'BookOpen', 'Gavel', 'Scale', 'FileText', 'CheckCircle'];

  useEffect(() => {
    fetchContent();
  }, [selectedPage, selectedSection]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/page-content?slug=${selectedPage}&section=${selectedSection}`);
      const data = await response.json();
      setContentItems(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (item: ContentItem) => {
    try {
      const method = item.id.startsWith('new-') ? 'POST' : 'PUT';
      const url = method === 'PUT' ? `/api/page-content?id=${item.id}` : '/api/page-content';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_slug: selectedPage,
          section: selectedSection,
          order_index: item.order_index,
          data: item.data
        })
      });

      if (response.ok) {
        await fetchContent();
        setEditingItem(null);
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Failed to save content');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/page-content?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchContent();
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Failed to delete content');
    }
  };

  const handleReorder = async (item: ContentItem, direction: 'up' | 'down') => {
    const currentIndex = contentItems.findIndex(i => i.id === item.id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === contentItems.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const newItems = [...contentItems];
    [newItems[currentIndex], newItems[newIndex]] = [newItems[newIndex], newItems[currentIndex]];

    // Update order_index for both items
    newItems[currentIndex].order_index = currentIndex + 1;
    newItems[newIndex].order_index = newIndex + 1;

    setContentItems(newItems);

    // Save both items
    try {
      await Promise.all([
        fetch(`/api/page-content?id=${newItems[currentIndex].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newItems[currentIndex] })
        }),
        fetch(`/api/page-content?id=${newItems[newIndex].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newItems[newIndex] })
        })
      ]);
    } catch (error) {
      console.error('Error reordering:', error);
      await fetchContent(); // Reload on error
    }
  };

  const renderForm = (item: ContentItem, onSave: (item: ContentItem) => void, onCancel: () => void) => {
    const [formData, setFormData] = useState(item.data || {});

    const getFields = () => {
      switch (selectedSection) {
        case 'team':
          return ['name', 'role', 'image', 'bio', 'linkedin'];
        case 'milestones':
          return ['year', 'event', 'icon'];
        case 'values':
          return ['title', 'description', 'icon'];
        case 'board':
          return ['name', 'position', 'background', 'image', 'credentials'];
        default:
          return ['title', 'description'];
      }
    };

    const fields = getFields();

    return (
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-4">
        {fields.map(field => (
          <div key={field} className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            {field === 'icon' ? (
              <select
                value={formData[field] || ''}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="">Select an icon</option>
                {iconOptions.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            ) : field === 'credentials' ? (
              <textarea
                value={Array.isArray(formData[field]) ? formData[field].join('\n') : ''}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value.split('\n') })}
                placeholder="Enter one credential per line"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                rows={3}
              />
            ) : field === 'bio' || field === 'background' || field === 'description' ? (
              <textarea
                value={formData[field] || ''}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                rows={4}
              />
            ) : (
              <input
                type="text"
                value={formData[field] || ''}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            )}
          </div>
        ))}
        <div className="flex gap-4">
          <button
            onClick={() => onSave({ ...item, data: formData })}
            className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Page Builder</h1>
          <p className="text-gray-400">Manage dynamic content for your website pages</p>
        </div>

        {/* Page and Section Selector */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Page</label>
              <select
                value={selectedPage}
                onChange={(e) => {
                  setSelectedPage(e.target.value);
                  setSelectedSection(sections[e.target.value][0]);
                }}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                {pages.map(page => (
                  <option key={page} value={page}>{page.charAt(0).toUpperCase() + page.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                {sections[selectedPage].map(section => (
                  <option key={section} value={section}>
                    {section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Add New Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setEditingItem({
                id: `new-${Date.now()}`,
                page_slug: selectedPage,
                section: selectedSection,
                order_index: contentItems.length + 1,
                data: {}
              });
              setShowAddModal(true);
            }}
            className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New {selectedSection.slice(0, -1)}
          </button>
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && editingItem && renderForm(
          editingItem,
          handleSave,
          () => {
            setShowAddModal(false);
            setEditingItem(null);
          }
        )}

        {/* Content List */}
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : contentItems.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No content items yet. Add one to get started!</div>
        ) : (
          <div className="space-y-4">
            {contentItems.map((item, index) => (
              <div key={item.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                {editingItem?.id === item.id && !showAddModal ? (
                  renderForm(item, handleSave, () => setEditingItem(null))
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {item.data.name || item.data.title || item.data.year || `Item ${index + 1}`}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {item.data.role || item.data.event || item.data.description?.substring(0, 100)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReorder(item, 'up')}
                          disabled={index === 0}
                          className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReorder(item, 'down')}
                          disabled={index === contentItems.length - 1}
                          className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PageBuilder;
