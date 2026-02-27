import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { Search, Plus, Edit2, Trash2, Copy, Eye, X, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'number' | 'email' | 'phone';
  placeholder?: string;
  options?: string[]; // for select/radio
  required: boolean;
}

interface VolunteerForm {
  id: string;
  title: string;
  description: string;
  role_id: string | null;
  event_id: string | null;
  custom_fields: CustomField[];
  required_fields: string[];
  success_message: string;
  redirect_url: string | null;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  max_submissions: number | null;
  submission_count?: number;
  created_at: string;
  updated_at: string;
}

const EMPTY_FORM: Partial<VolunteerForm> = {
  title: '',
  description: '',
  role_id: null,
  event_id: null,
  custom_fields: [],
  required_fields: ['first_name', 'last_name', 'email', 'phone'],
  success_message: 'Thank you for applying! We will review your application and get back to you soon.',
  redirect_url: null,
  is_active: true,
  start_date: null,
  end_date: null,
  max_submissions: null
};

const FIELD_TYPES = [
  { value: 'text', label: 'Text Input' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'select', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio Buttons' }
];

const VolunteerFormsPage: React.FC = () => {
  const { session } = useAuth();
  const [forms, setForms] = useState<VolunteerForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingForm, setEditingForm] = useState<Partial<VolunteerForm>>(EMPTY_FORM);
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    if (!session?.access_token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/admin/volunteer-forms', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setForms(data);
      }
    } catch (error) {
      console.error('Error loading forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!session?.access_token || !editingForm.title) {
      alert('Title is required');
      return;
    }

    try {
      const url = mode === 'create'
        ? '/api/admin/volunteer-forms'
        : `/api/admin/volunteer-forms?id=${editingForm.id}`;

      const response = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(editingForm)
      });

      if (response.ok) {
        setIsEditing(false);
        setEditingForm(EMPTY_FORM);
        loadForms();
      } else {
        const error = await response.json();
        alert(`Failed to save form: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Failed to save form');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this form? All submissions will remain but the form will be permanently deleted.')) return;

    try {
      const response = await fetch(`/api/admin/volunteer-forms?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });

      if (response.ok) {
        loadForms();
      }
    } catch (error) {
      console.error('Error deleting form:', error);
      alert('Failed to delete form');
    }
  };

  const addCustomField = () => {
    const newField: CustomField = {
      id: `field_${Date.now()}`,
      label: '',
      type: 'text',
      required: false
    };
    setEditingForm({
      ...editingForm,
      custom_fields: [...(editingForm.custom_fields || []), newField]
    });
  };

  const updateCustomField = (id: string, updates: Partial<CustomField>) => {
    setEditingForm({
      ...editingForm,
      custom_fields: (editingForm.custom_fields || []).map(field =>
        field.id === id ? { ...field, ...updates } : field
      )
    });
  };

  const removeCustomField = (id: string) => {
    setEditingForm({
      ...editingForm,
      custom_fields: (editingForm.custom_fields || []).filter(field => field.id !== id)
    });
  };

  const duplicateForm = async (form: VolunteerForm) => {
    const { id, created_at, updated_at, submission_count, ...formData } = form;
    setMode('create');
    setEditingForm({
      ...formData,
      title: `${formData.title} (Copy)`,
      is_active: false
    });
    setIsEditing(true);
  };

  const copyFormLink = (formId: string) => {
    const url = `${window.location.origin}/volunteer/form/${formId}`;
    navigator.clipboard.writeText(url);
    alert('Form link copied to clipboard!');
  };

  const filteredForms = forms.filter(form =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Volunteer Forms - Admin Dashboard</title>
      </Head>

      <AdminLayout title="Volunteer Registration Forms">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>

            <button
              onClick={() => {
                setMode('create');
                setEditingForm(EMPTY_FORM);
                setIsEditing(true);
              }}
              className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Form
            </button>
          </div>

          {/* Forms List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-gray-400">Loading forms...</div>
            ) : filteredForms.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No forms found</div>
            ) : (
              filteredForms.map((form) => (
                <div key={form.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">{form.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          form.is_active
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {form.is_active ? 'Active' : 'Inactive'}
                        </span>
                        {form.max_submissions && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                            {form.submission_count || 0}/{form.max_submissions} submissions
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mt-2">{form.description}</p>
                      <div className="flex gap-4 mt-3 text-xs text-gray-400">
                        <span>{form.custom_fields.length} custom fields</span>
                        {form.start_date && <span>Starts: {new Date(form.start_date).toLocaleDateString()}</span>}
                        {form.end_date && <span>Ends: {new Date(form.end_date).toLocaleDateString()}</span>}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => copyFormLink(form.id)}
                        className="p-2 text-purple-400 hover:bg-purple-500/20 rounded"
                        title="Copy form link"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => duplicateForm(form)}
                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded"
                        title="Duplicate form"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setMode('edit');
                          setEditingForm(form);
                          setIsEditing(true);
                        }}
                        className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(form.id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Edit/Create Modal */}
          {isEditing && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-gray-800 rounded-xl max-w-4xl w-full my-8">
                <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center rounded-t-xl">
                  <h2 className="text-2xl font-semibold text-white">
                    {mode === 'create' ? 'Create New Form' : 'Edit Form'}
                  </h2>
                  <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                      Basic Information
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Form Title *</label>
                      <input
                        type="text"
                        value={editingForm.title}
                        onChange={(e) => setEditingForm({ ...editingForm, title: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        placeholder="e.g., Medical Outreach Volunteer Application"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                      <textarea
                        value={editingForm.description}
                        onChange={(e) => setEditingForm({ ...editingForm, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                        <select
                          value={editingForm.is_active ? 'active' : 'inactive'}
                          onChange={(e) => setEditingForm({ ...editingForm, is_active: e.target.value === 'active' })}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Max Submissions (optional)</label>
                        <input
                          type="number"
                          value={editingForm.max_submissions || ''}
                          onChange={(e) => setEditingForm({ ...editingForm, max_submissions: e.target.value ? parseInt(e.target.value) : null })}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Start Date (optional)</label>
                        <input
                          type="date"
                          value={editingForm.start_date || ''}
                          onChange={(e) => setEditingForm({ ...editingForm, start_date: e.target.value || null })}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">End Date (optional)</label>
                        <input
                          type="date"
                          value={editingForm.end_date || ''}
                          onChange={(e) => setEditingForm({ ...editingForm, end_date: e.target.value || null })}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Custom Fields */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                      <h3 className="text-lg font-semibold text-white">Custom Fields</h3>
                      <button
                        onClick={addCustomField}
                        className="px-3 py-1 bg-accent-500 hover:bg-accent-600 text-white rounded text-sm flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add Field
                      </button>
                    </div>

                    {(editingForm.custom_fields || []).length === 0 ? (
                      <div className="text-center py-8 text-gray-400 bg-gray-700/30 rounded-lg border border-dashed border-gray-600">
                        No custom fields yet. Click "Add Field" to create one.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {(editingForm.custom_fields || []).map((field) => (
                          <div key={field.id} className="bg-gray-700/50 p-4 rounded-lg space-y-3">
                            <div className="grid grid-cols-3 gap-3">
                              <div className="col-span-2">
                                <input
                                  type="text"
                                  value={field.label}
                                  onChange={(e) => updateCustomField(field.id, { label: e.target.value })}
                                  placeholder="Field label"
                                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                                />
                              </div>
                              <div className="flex gap-2">
                                <select
                                  value={field.type}
                                  onChange={(e) => updateCustomField(field.id, { type: e.target.value as any })}
                                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                                >
                                  {FIELD_TYPES.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => removeCustomField(field.id)}
                                  className="p-2 text-red-400 hover:bg-red-500/20 rounded"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="flex gap-3 items-center">
                              <input
                                type="text"
                                value={field.placeholder || ''}
                                onChange={(e) => updateCustomField(field.id, { placeholder: e.target.value })}
                                placeholder="Placeholder text (optional)"
                                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                              />
                              <label className="flex items-center gap-2 text-sm text-gray-300">
                                <input
                                  type="checkbox"
                                  checked={field.required}
                                  onChange={(e) => updateCustomField(field.id, { required: e.target.checked })}
                                  className="w-4 h-4 rounded"
                                />
                                Required
                              </label>
                            </div>

                            {(field.type === 'select' || field.type === 'radio') && (
                              <input
                                type="text"
                                value={field.options?.join(', ') || ''}
                                onChange={(e) => updateCustomField(field.id, { options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                placeholder="Options (comma-separated)"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Success Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Success Message</label>
                    <textarea
                      value={editingForm.success_message}
                      onChange={(e) => setEditingForm({ ...editingForm, success_message: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 p-6 border-t border-gray-700 bg-gray-800 rounded-b-xl">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-6 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg"
                  >
                    {mode === 'create' ? 'Create Form' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
};

export default VolunteerFormsPage;
