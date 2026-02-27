import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { Search, Plus, Edit2, Trash2, UserCheck, MapPin, Clock, Users, X, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface VolunteerRole {
  id: string;
  title: string;
  description: string;
  required_skills: string[];
  preferred_skills: string[];
  responsibilities: string[];
  time_commitment: string;
  location: string;
  availability: string[];
  spots_available: number | null;
  is_active: boolean;
  category: string;
  created_at: string;
  updated_at: string;
}

const EMPTY_ROLE: Partial<VolunteerRole> = {
  title: '',
  description: '',
  required_skills: [],
  preferred_skills: [],
  responsibilities: [],
  time_commitment: '',
  location: '',
  availability: [],
  spots_available: null,
  is_active: true,
  category: 'general'
};

const VolunteerRolesPage: React.FC = () => {
  const { session } = useAuth();
  const [roles, setRoles] = useState<VolunteerRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editingRole, setEditingRole] = useState<Partial<VolunteerRole>>(EMPTY_ROLE);
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    loadRoles();
  }, [statusFilter]);

  const loadRoles = async () => {
    if (!session?.access_token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/volunteer-roles?status=${statusFilter}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      }
    } catch (error) {
      console.error('Error loading roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!session?.access_token || !editingRole.title) {
      alert('Title is required');
      return;
    }

    try {
      const url = mode === 'create'
        ? '/api/admin/volunteer-roles'
        : `/api/admin/volunteer-roles?id=${editingRole.id}`;

      const response = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(editingRole)
      });

      if (response.ok) {
        setIsEditing(false);
        setEditingRole(EMPTY_ROLE);
        loadRoles();
      } else {
        const error = await response.json();
        alert(`Failed to save role: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving role:', error);
      alert('Failed to save role');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return;

    try {
      const response = await fetch(`/api/admin/volunteer-roles?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });

      if (response.ok) {
        loadRoles();
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      alert('Failed to delete role');
    }
  };

  const filteredRoles = roles.filter(role =>
    role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Volunteer Roles - Admin Dashboard</title>
      </Head>

      <AdminLayout title="Volunteer Roles">
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="all">All Roles</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button
              onClick={() => {
                setMode('create');
                setEditingRole(EMPTY_ROLE);
                setIsEditing(true);
              }}
              className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Role
            </button>
          </div>

          {/* Roles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12 text-gray-400">
                Loading roles...
              </div>
            ) : filteredRoles.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-400">
                No roles found
              </div>
            ) : (
              filteredRoles.map((role) => (
                <div key={role.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{role.title}</h3>
                      <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                        role.is_active
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {role.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setMode('edit');
                          setEditingRole(role);
                          setIsEditing(true);
                        }}
                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm line-clamp-3">{role.description}</p>

                  <div className="space-y-2 text-sm">
                    {role.location && (
                      <div className="flex items-center text-gray-400">
                        <MapPin className="w-4 h-4 mr-2" />
                        {role.location}
                      </div>
                    )}
                    {role.time_commitment && (
                      <div className="flex items-center text-gray-400">
                        <Clock className="w-4 h-4 mr-2" />
                        {role.time_commitment}
                      </div>
                    )}
                    {role.spots_available !== null && (
                      <div className="flex items-center text-gray-400">
                        <Users className="w-4 h-4 mr-2" />
                        {role.spots_available} spots available
                      </div>
                    )}
                  </div>

                  {role.required_skills.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {role.required_skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                        {role.required_skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded text-xs">
                            +{role.required_skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Edit/Create Modal */}
          {isEditing && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-white">
                    {mode === 'create' ? 'Create New Role' : 'Edit Role'}
                  </h2>
                  <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Role Title *
                      </label>
                      <input
                        type="text"
                        value={editingRole.title}
                        onChange={(e) => setEditingRole({ ...editingRole, title: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        placeholder="e.g., Medical Volunteer Coordinator"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={editingRole.description}
                        onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        placeholder="Describe this volunteer role..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Category
                        </label>
                        <select
                          value={editingRole.category}
                          onChange={(e) => setEditingRole({ ...editingRole, category: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        >
                          <option value="general">General</option>
                          <option value="medical">Medical</option>
                          <option value="education">Education</option>
                          <option value="events">Events</option>
                          <option value="admin">Administrative</option>
                          <option value="technical">Technical</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Status
                        </label>
                        <select
                          value={editingRole.is_active ? 'active' : 'inactive'}
                          onChange={(e) => setEditingRole({ ...editingRole, is_active: e.target.value === 'active' })}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={editingRole.location}
                          onChange={(e) => setEditingRole({ ...editingRole, location: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                          placeholder="e.g., Lagos, Nigeria"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Time Commitment
                        </label>
                        <input
                          type="text"
                          value={editingRole.time_commitment}
                          onChange={(e) => setEditingRole({ ...editingRole, time_commitment: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                          placeholder="e.g., 4-6 hours/week"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Spots Available (optional)
                      </label>
                      <input
                        type="number"
                        value={editingRole.spots_available || ''}
                        onChange={(e) => setEditingRole({ ...editingRole, spots_available: e.target.value ? parseInt(e.target.value) : null })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        placeholder="Leave empty for unlimited"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Required Skills (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={editingRole.required_skills?.join(', ')}
                        onChange={(e) => setEditingRole({ ...editingRole, required_skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        placeholder="e.g., First Aid, Communication, Leadership"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Preferred Skills (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={editingRole.preferred_skills?.join(', ')}
                        onChange={(e) => setEditingRole({ ...editingRole, preferred_skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        placeholder="e.g., Event Planning, Social Media"
                      />
                    </div>
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Responsibilities (one per line)
                    </label>
                    <textarea
                      value={editingRole.responsibilities?.join('\n')}
                      onChange={(e) => setEditingRole({ ...editingRole, responsibilities: e.target.value.split('\n').filter(Boolean) })}
                      rows={5}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm"
                      placeholder="Coordinate volunteer schedules&#10;Assist medical staff during outreach&#10;Maintain accurate records"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4 border-t border-gray-700">
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
                      {mode === 'create' ? 'Create Role' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
};

export default VolunteerRolesPage;
