import React from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';

const MessagesManagement: React.FC = () => {
  return (
    <>
      <Head>
        <title>Messages Management - Admin Dashboard</title>
        <meta name="description" content="Manage communications/messages functionality" />
      </Head>

      <AdminLayout title="Messages Management">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Messages Management</h2>
            <p className="text-gray-600 dark:text-gray-400">Messages management interface is ready for implementation.</p>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default MessagesManagement;