import React, { useState } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Search,
  Filter,
  UserPlus,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Users,
  UserCheck,
  Shield,
  MoreVertical,
  Eye,
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
  role: 'donor' | 'volunteer' | 'admin' | 'super_admin';
  status: 'active' | 'inactive' | 'banned';
  joinDate: Date;
  lastActivity: Date;
  totalDonations?: number;
  avatar?: string;
  verified: boolean;
}

const UsersManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);

  // Mock users data
  const users: User[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+234 801 234 5678',
      location: 'Lagos, Nigeria',
      role: 'donor',
      status: 'active',
      joinDate: new Date('2024-01-15'),
      lastActivity: new Date('2024-03-15T10:30:00'),
      totalDonations: 150000,
      verified: true
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael@example.com',
      phone: '+234 802 345 6789',
      location: 'Abuja, Nigeria',
      role: 'volunteer',
      status: 'active',
      joinDate: new Date('2024-02-20'),
      lastActivity: new Date('2024-03-14T16:45:00'),
      verified: true
    },
    {
      id: '3',
      name: 'Admin User',
      email: 'admin@saintlammyfoundation.org',
      role: 'admin',
      status: 'active',
      joinDate: new Date('2023-12-01'),
      lastActivity: new Date('2024-03-15T11:20:00'),
      verified: true
    },
    {
      id: '4',
      name: 'Emma Williams',
      email: 'emma@example.com',
      phone: '+234 803 456 7890',
      location: 'Port Harcourt, Nigeria',
      role: 'donor',
      status: 'inactive',
      joinDate: new Date('2024-01-08'),
      lastActivity: new Date('2024-02-28T14:15:00'),
      totalDonations: 75000,
      verified: false
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david@example.com',
      phone: '+234 804 567 8901',
      location: 'Kano, Nigeria',
      role: 'volunteer',
      status: 'active',
      joinDate: new Date('2024-02-10'),
      lastActivity: new Date('2024-03-13T09:30:00'),
      verified: true
    }
  ];

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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeUsers}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Donors</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.donors}</p>
                </div>
                <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-pink-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Volunteers</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.volunteers}</p>
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
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>

                {/* Role Filter */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="donor">Donors</option>
                  <option value="volunteer">Volunteers</option>
                  <option value="admin">Admins</option>
                  <option value="super_admin">Super Admins</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="banned">Banned</option>
                </select>
              </div>

              <button
                onClick={() => setShowAddUser(true)}
                className="flex items-center gap-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Add User
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">User</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Join Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Last Activity</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Donations</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-semibold">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <p className="text-gray-900 dark:text-white font-medium mr-2">{user.name}</p>
                              {user.verified && (
                                <Check className="w-4 h-4 text-green-400" />
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {user.email}
                            </p>
                            {user.phone && (
                              <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {user.phone}
                              </p>
                            )}
                            {user.location && (
                              <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center">
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
                        <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          {format(user.joinDate, 'MMM dd, yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {format(user.lastActivity, 'MMM dd, yyyy')}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">
                          {format(user.lastActivity, 'hh:mm a')}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {user.totalDonations ? (
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 text-pink-400 mr-2" />
                            <span className="text-gray-900 dark:text-white font-medium">
                              ₦{user.totalDonations.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-600 dark:text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                            <Ban className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No users found</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>

          {/* Add User Modal */}
          {showAddUser && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddUser(false)} />
              <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white dark:bg-gray-800 rounded-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New User</h3>
                      <button
                        onClick={() => setShowAddUser(false)}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                          placeholder="Enter full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                        <input
                          type="email"
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                          placeholder="Enter email address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                        <input
                          type="tel"
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                          placeholder="Enter phone number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                        <select className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent">
                          <option value="donor">Donor</option>
                          <option value="volunteer">Volunteer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => setShowAddUser(false)}
                          className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-50 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => setShowAddUser(false)}
                          className="flex-1 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors"
                        >
                          Add User
                        </button>
                      </div>
                    </div>
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