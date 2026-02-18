import React from 'react';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, CheckCircle, XCircle } from 'lucide-react';

const TestAccess: React.FC = () => {
  const { user, loading, isAdmin, isModerator } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Not authenticated - you should be redirected to login</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Access Test - Saintlammy Foundation</title>
      </Head>

      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-2" />
            Access Test (No AdminLayout)
          </h1>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {user ? <CheckCircle className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
              <span className="text-gray-300">User authenticated: {user?.email}</span>
            </div>

            <div className="flex items-center space-x-3">
              {isAdmin ? <CheckCircle className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
              <span className="text-gray-300">Admin status: {isAdmin ? 'YES' : 'NO'}</span>
            </div>

            <div className="flex items-center space-x-3">
              {isModerator ? <CheckCircle className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
              <span className="text-gray-300">Moderator status: {isModerator ? 'YES' : 'NO'}</span>
            </div>

            <div className="bg-gray-700 p-4 rounded">
              <h3 className="text-white font-semibold mb-2">Email Checks:</h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center space-x-2">
                  {user?.email?.includes('@saintlammyfoundation.org') ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                  <span className="text-gray-300">@saintlammyfoundation.org domain</span>
                </div>
                <div className="flex items-center space-x-2">
                  {user?.email === 'saintlammy@gmail.com' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                  <span className="text-gray-300">saintlammy@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  {user?.user_metadata?.role === 'admin' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                  <span className="text-gray-300">Role metadata = admin</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-white font-semibold mb-2">Navigation:</h3>
              <div className="space-x-4">
                <a href="/admin/debug" className="text-blue-400 hover:text-blue-300">Debug Page</a>
                <a href="/admin/wallet-management" className="text-green-400 hover:text-green-300">Wallet Management</a>
                <a href="/admin" className="text-purple-400 hover:text-purple-300">Admin Dashboard</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestAccess;