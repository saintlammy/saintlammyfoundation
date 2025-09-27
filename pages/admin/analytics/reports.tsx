import React from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';

const ReportsManagement: React.FC = () => {
  return (
    <>
      <Head>
        <title>Reports Management - Admin Dashboard</title>
        <meta name="description" content="Manage analytics/reports functionality" />
      </Head>

      <AdminLayout title="Reports Management">
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Reports Management</h3>
              <div className="text-gray-400 text-center py-12">
                Reports management interface - ready for implementation
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default ReportsManagement;
