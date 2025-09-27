import React from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';

const NotificationsManagement: React.FC = () => {
  return (
    <>
      <Head>
        <title>Notifications Management - Admin Dashboard</title>
        <meta name="description" content="Manage communications/notifications functionality" />
      </Head>

      <AdminLayout title="Notifications Management">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications Management</h3>
              <div className="text-gray-600 dark:text-gray-400 text-center py-12">
                Notifications management interface - ready for implementation
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default NotificationsManagement;
