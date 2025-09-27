import React from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { Shield, Users, Settings, Lock } from 'lucide-react';

const AdminsManagement: React.FC = () => {
  return (
    <>
      <Head>
        <title>Administrators - Admin Dashboard</title>
        <meta name="description" content="Manage administrator accounts and permissions" />
      </Head>

      <AdminLayout title="Administrators">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Admins</p>
                  <p className="text-2xl font-bold text-white">5</p>
                </div>
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Super Admins</p>
                  <p className="text-2xl font-bold text-red-400">2</p>
                </div>
                <Lock className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Moderators</p>
                  <p className="text-2xl font-bold text-green-400">3</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Administrator Management</h3>
              <div className="text-gray-400 text-center py-12">
                Administrator management interface - integrate with auth service
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminsManagement;