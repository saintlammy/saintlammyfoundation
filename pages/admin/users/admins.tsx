import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { Shield, Users, Settings, Lock, Mail, Calendar, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { getTypedSupabaseClient } from '@/lib/supabase';

interface AdminStats {
  totalAdmins: number;
  superAdmins: number;
  moderators: number;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super-admin' | 'moderator';
  created_at: string;
  last_login?: string;
}

const AdminsManagement: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalAdmins: 0,
    superAdmins: 0,
    moderators: 0
  });
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const client = getTypedSupabaseClient();

      // Fetch all users with admin roles
      const { data: adminsData, error } = await (client as any)
        .from('donors')
        .select('*')
        .in('role', ['admin', 'super-admin', 'moderator'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admins:', error);
        setStats(getFallbackStats());
        setAdmins(getFallbackAdmins());
        return;
      }

      const allAdmins = adminsData || [];

      // Calculate stats
      const totalAdmins = allAdmins.length;
      const superAdmins = allAdmins.filter((a: any) => a.role === 'super-admin').length;
      const moderators = allAdmins.filter((a: any) => a.role === 'moderator').length;

      setStats({
        totalAdmins,
        superAdmins,
        moderators
      });

      // Set admin users list
      setAdmins(allAdmins.map((admin: any) => ({
        id: admin.id,
        name: admin.name || 'Unknown',
        email: admin.email || 'No email',
        role: admin.role,
        created_at: admin.created_at,
        last_login: admin.last_login || admin.updated_at
      })));
    } catch (error) {
      console.error('Error loading admin data:', error);
      setStats(getFallbackStats());
      setAdmins(getFallbackAdmins());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackStats = (): AdminStats => {
    return {
      totalAdmins: 0,
      superAdmins: 0,
      moderators: 0
    };
  };

  const getFallbackAdmins = (): AdminUser[] => {
    return [];
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super-admin':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'admin':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'moderator':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super-admin':
        return <Lock className="w-4 h-4" />;
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'moderator':
        return <Users className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  return (
    <>
      <Head>
        <title>Administrators - Admin Dashboard</title>
        <meta name="description" content="Manage administrator accounts and permissions" />
      </Head>

      <AdminLayout title="Administrators">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Admins</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {loading ? '...' : stats.totalAdmins}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Super Admins</p>
                  <p className="text-2xl font-bold text-red-400">
                    {loading ? '...' : stats.superAdmins}
                  </p>
                </div>
                <Lock className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Moderators</p>
                  <p className="text-2xl font-bold text-green-400">
                    {loading ? '...' : stats.moderators}
                  </p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Administrator List ({loading ? '...' : admins.length})
              </h3>

              {loading ? (
                <div className="text-gray-600 dark:text-gray-400 text-center py-12">
                  Loading administrators...
                </div>
              ) : admins.length === 0 ? (
                <div className="text-gray-600 dark:text-gray-400 text-center py-12">
                  No administrators found in the system.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Administrator</th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Role</th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Email</th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Joined</th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Last Active</th>
                        <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map((admin) => (
                        <tr key={admin.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {admin.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-gray-900 dark:text-white font-medium">{admin.name}</p>
                                <p className="text-gray-500 dark:text-gray-400 text-xs">ID: {admin.id.slice(0, 8)}...</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(admin.role)}`}>
                              {getRoleIcon(admin.role)}
                              {admin.role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Mail className="w-4 h-4" />
                              {admin.email}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(admin.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {admin.last_login
                              ? new Date(admin.last_login).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })
                              : 'Never'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-1 text-gray-400 hover:text-blue-400 transition-colors" title="Edit">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-red-400 transition-colors" title="Delete">
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors" title="More">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminsManagement;