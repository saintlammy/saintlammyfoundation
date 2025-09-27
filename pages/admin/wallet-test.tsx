import React from 'react';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Wallet, Shield } from 'lucide-react';

const WalletTest: React.FC = () => {
  const { user, isAdmin } = useAuth();

  return (
    <>
      <Head>
        <title>Wallet Test - Saintlammy Foundation</title>
      </Head>

      <ProtectedRoute requireAdmin={true}>
        <div className="min-h-screen bg-gray-900 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-lg p-6">
              <h1 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Wallet className="w-6 h-6 mr-2" />
                Wallet Management Test (Direct ProtectedRoute)
              </h1>

              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-semibold">Access Granted!</span>
                </div>
                <p className="text-green-300 mt-2">
                  You have successfully accessed the wallet management area.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                  <h3 className="text-white font-semibold mb-2">User Information:</h3>
                  <p className="text-gray-300">Email: {user?.email}</p>
                  <p className="text-gray-300">Admin Status: {isAdmin ? 'YES' : 'NO'}</p>
                  <p className="text-gray-300">User ID: {user?.id}</p>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <h3 className="text-blue-300 font-semibold mb-2">Test Result:</h3>
                  <p className="text-blue-200">
                    If you can see this page, the ProtectedRoute is working correctly.
                    The issue might be in the AdminLayout component.
                  </p>
                </div>

                <div className="pt-4">
                  <a
                    href="/admin/wallet-management"
                    className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Try Full Wallet Management Page
                  </a>
                  <a
                    href="/admin/debug"
                    className="inline-block ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Go to Debug Page
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </>
  );
};

export default WalletTest;