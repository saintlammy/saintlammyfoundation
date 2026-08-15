import React, { useCallback, useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import {
  Search,
  UserPlus,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Users,
  UserCheck,
  Shield,
  Ban,
  Check,
  X
} from 'lucide-react';
import { format } from 'date-fns';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  role: 'user' | 'donor' | 'volunteer' | 'admin' | 'super_admin';
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  joinDate: Date;
  lastActivity: Date;
  totalDonations?: number;
  avatar?: string;
  verified: boolean;
}

const emptyUserForm = {
  name: '',
  email: '',
  phone: '',
  location: '',
  role: 'user' as User['role'],
  status: 'active' as User['status']
};

const UsersManagement: React.FC = () => {
  const { session } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!showAddUser) return;
    nameInputRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !saving) closeUserDialog();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [showAddUser, saving]);

  const loadUsers = useCallback(async () => {
    if (!session?.access_token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || 'Unable to load users');

      const transformedUsers: User[] = (result.data || []).map((profile: any) => ({
        id: profile.id,
        name: profile.name || 'Unnamed user',
        email: profile.email || 'No email',
        phone: profile.phone,
        location: profile.location,
        role: profile.role || 'user',
        status: profile.status || 'active',
        joinDate: new Date(profile.created_at),
        lastActivity: new Date(profile.updated_at || profile.created_at),
        totalDonations: profile.total_donated || 0,
        verified: Boolean(profile.verified),
        avatar: profile.avatar
      }));

      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
      setError(error instanceof Error ? error.message : 'Unable to load users');
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  // Load users from database
  useEffect(() => { void loadUsers(); }, [loadUsers]);

  const openCreateDialog = () => {
    setEditingUser(null);
    setUserForm(emptyUserForm);
    setError('');
    setShowAddUser(true);
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      location: user.location || '',
      role: user.role,
      status: user.status
    });
    setError('');
    setShowAddUser(true);
  };

  const closeUserDialog = () => {
    setShowAddUser(false);
    setEditingUser(null);
    setUserForm(emptyUserForm);
  };

  const saveUser = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session?.access_token) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/users', {
        method: editingUser ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify(editingUser
          ? { userId: editingUser.id, name: userForm.name, phone: userForm.phone, location: userForm.location, role: userForm.role, status: userForm.status }
          : userForm)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || 'Unable to save user');
      setNotice(editingUser ? 'User details updated.' : 'Invitation sent and user profile created.');
      closeUserDialog();
      await loadUsers();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save user');
    } finally {
      setSaving(false);
    }
  };

  const toggleUserAccess = async (user: User) => {
    if (!session?.access_token) return;
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    setError('');
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ userId: user.id, status: nextStatus })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || 'Unable to update access');
      setNotice(nextStatus === 'active' ? `${user.name} can sign in again.` : `${user.name}'s access has been suspended.`);
      await loadUsers();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to update access');
    }
  };

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    donors: users.filter(u => u.role === 'donor').length,
    volunteers: users.filter(u => u.role === 'volunteer').length
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'text-purple-400 bg-purple-400/10';
      case 'admin':
        return 'text-blue-400 bg-blue-400/10';
      case 'volunteer':
        return 'text-green-400 bg-green-400/10';
      case 'donor':
        return 'text-yellow-400 bg-yellow-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-400/10';
      case 'inactive':
        return 'text-gray-400 bg-gray-400/10';
      case 'banned':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'volunteer':
        return <UserCheck className="w-4 h-4" />;
      case 'donor':
        return <Heart className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <>
      <Head>
        <title>Users Management - Admin</title>
        <meta name="description" content="Manage users, donors, volunteers, and administrators" />
      </Head>

      <AdminLayout title="Users Management">
        <div className="space-y-6">
          {error && (
            <div role="alert" className="rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-100">
              {error} <button type="button" onClick={loadUsers} className="ml-2 font-semibold underline underline-offset-2">Try again</button>
            </div>
          )}
          {notice && (
            <div role="status" className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100">
              {notice}
            </div>
          )}
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Users</p>
                  <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Donors</p>
                  <p className="text-2xl font-bold text-white">{stats.donors}</p>
                </div>
                <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-pink-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Volunteers</p>
                  <p className="text-2xl font-bold text-white">{stats.volunteers}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* Search */}
                <div className="relative">
                  <label htmlFor="user-search" className="sr-only">Search users</label>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    id="user-search"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>

                {/* Role Filter */}
                <label htmlFor="role-filter" className="sr-only">Filter by role</label>
                <select
                  id="role-filter"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Users</option>
                  <option value="donor">Donors</option>
                  <option value="volunteer">Volunteers</option>
                  <option value="admin">Admins</option>
                  <option value="super_admin">Super Admins</option>
                </select>

                {/* Status Filter */}
                <label htmlFor="status-filter" className="sr-only">Filter by status</label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="banned">Banned</option>
                </select>
              </div>

              <button
                onClick={openCreateDialog}
                className="flex min-h-11 items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-white transition-colors hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
              >
                <UserPlus className="w-4 h-4" />
                Add User
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">User</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Join Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Last Activity</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {!loading && filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-700/20">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-semibold">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <p className="text-white font-medium mr-2">{user.name}</p>
                              {user.verified && (
                                <Check className="w-4 h-4 text-green-400" />
                              )}
                            </div>
                            <p className="text-gray-400 text-sm flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {user.email}
                            </p>
                            {user.phone && (
                              <p className="text-gray-400 text-sm flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {user.phone}
                              </p>
                            )}
                            {user.location && (
                              <p className="text-gray-400 text-sm flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {user.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          <span className="capitalize">{user.role.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                          <span className="capitalize">{user.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-300 text-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          {format(user.joinDate, 'MMM dd, yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-300 text-sm">
                          {format(user.lastActivity, 'MMM dd, yyyy')}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {format(user.lastActivity, 'hh:mm a')}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditDialog(user)}
                            aria-label={`Edit ${user.name}`}
                            className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-gray-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <a
                            href={`mailto:${user.email}`}
                            aria-label={`Email ${user.name}`}
                            className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-gray-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                          <button
                            type="button"
                            onClick={() => toggleUserAccess(user)}
                            aria-label={user.status === 'active' ? `Suspend ${user.name}` : `Restore ${user.name}`}
                            className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-red-950/60 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {loading && (
              <div className="py-12 text-center text-gray-300" role="status">Loading user accounts…</div>
            )}

            {!loading && filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No users found</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>

          {/* Add User Modal */}
          {showAddUser && (
            <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="user-dialog-title">
              <div className="fixed inset-0 bg-black/70" onClick={() => !saving && closeUserDialog()} />
              <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-gray-800 rounded-xl w-full max-w-md border border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 id="user-dialog-title" className="text-lg font-semibold text-white">{editingUser ? 'Edit user' : 'Invite a user'}</h3>
                      <button
                        type="button"
                        onClick={closeUserDialog}
                        disabled={saving}
                        aria-label="Close user dialog"
                        className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <form className="space-y-4" onSubmit={saveUser}>
                      <div>
                        <label htmlFor="user-name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                        <input
                          ref={nameInputRef}
                          id="user-name"
                          type="text"
                          required
                          maxLength={120}
                          value={userForm.name}
                          onChange={(event) => setUserForm((form) => ({ ...form, name: event.target.value }))}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                          placeholder="Enter full name"
                        />
                      </div>

                      <div>
                        <label htmlFor="user-email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input
                          id="user-email"
                          type="email"
                          required
                          disabled={Boolean(editingUser)}
                          value={userForm.email}
                          onChange={(event) => setUserForm((form) => ({ ...form, email: event.target.value }))}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                          placeholder="Enter email address"
                        />
                      </div>

                      <div>
                        <label htmlFor="user-phone" className="block text-sm font-medium text-gray-300 mb-2">Phone <span className="text-gray-400">(optional)</span></label>
                        <input
                          id="user-phone"
                          type="tel"
                          maxLength={40}
                          value={userForm.phone}
                          onChange={(event) => setUserForm((form) => ({ ...form, phone: event.target.value }))}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                          placeholder="Enter phone number"
                        />
                      </div>

                      <div>
                        <label htmlFor="user-location" className="block text-sm font-medium text-gray-300 mb-2">Location <span className="text-gray-400">(optional)</span></label>
                        <input
                          id="user-location"
                          type="text"
                          maxLength={160}
                          value={userForm.location}
                          onChange={(event) => setUserForm((form) => ({ ...form, location: event.target.value }))}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                          placeholder="City, country"
                        />
                      </div>

                      <div>
                        <label htmlFor="user-role" className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                        <select id="user-role" value={userForm.role} onChange={(event) => setUserForm((form) => ({ ...form, role: event.target.value as User['role'] }))} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent">
                          <option value="user">User</option>
                          <option value="donor">Donor</option>
                          <option value="volunteer">Volunteer</option>
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super admin</option>
                        </select>
                      </div>

                      {editingUser && (
                        <div>
                          <label htmlFor="user-status" className="block text-sm font-medium text-gray-300 mb-2">Access status</label>
                          <select id="user-status" value={userForm.status} onChange={(event) => setUserForm((form) => ({ ...form, status: event.target.value as User['status'] }))} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                            <option value="banned">Banned</option>
                          </select>
                        </div>
                      )}

                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={closeUserDialog}
                          disabled={saving}
                          className="flex-1 rounded-lg border border-gray-500 bg-gray-800 px-4 py-2 text-gray-100 transition-colors hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={saving}
                          className="flex-1 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors"
                        >
                          {saving ? 'Saving…' : editingUser ? 'Save changes' : 'Send invitation'}
                        </button>
                      </div>
                    </form>
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

export default UsersManagement;
