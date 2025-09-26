import React from 'react';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Shield, CheckCircle, XCircle } from 'lucide-react';

const ProtectedTest: React.FC = () => {
  const { user, loading, isAdmin, isModerator, hasPermission } = useAuth();

  return (
    <>
      <Head>
        <title>Protected Route Test - Saintlammy Foundation</title>
      </Head>

      <ProtectedRoute requireAdmin={true}>
        <div className="min-h-screen bg-gray-900 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Success Header */}
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white">🎉 ProtectedRoute Passed!</h1>
                  <p className="text-green-300">You successfully passed the ProtectedRoute requireAdmin check.</p>
                </div>
              </div>
            </div>

            {/* Authentication Details */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Authentication Status (Inside ProtectedRoute)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    {user ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                    <span className="text-gray-300">User Present: {user ? 'YES' : 'NO'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {user?.email ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                    <span className="text-gray-300">Email: {user?.email || 'Not found'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {user?.email_confirmed_at ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                    <span className="text-gray-300">Email Confirmed: {user?.email_confirmed_at ? 'YES' : 'NO'}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    {isAdmin ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                    <span className="text-gray-300">Admin Status: {isAdmin ? 'YES' : 'NO'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isModerator ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                    <span className="text-gray-300">Moderator Status: {isModerator ? 'YES' : 'NO'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {loading ? <XCircle className="w-4 h-4 text-yellow-400" /> : <CheckCircle className="w-4 h-4 text-green-400" />}
                    <span className="text-gray-300">Loading: {loading ? 'YES' : 'NO'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Details */}
            {user && (
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">User Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="text-gray-300">
                    <strong>Email:</strong> {user.email}
                  </div>
                  <div className="text-gray-300">
                    <strong>ID:</strong> {user.id}
                  </div>
                  <div className="text-gray-300">
                    <strong>Role in metadata:</strong> {user.user_metadata?.role || 'not set'}
                  </div>
                  <div className="text-gray-300">
                    <strong>Email matches saintlammy@gmail.com:</strong> {user.email === 'saintlammy@gmail.com' ? 'Yes' : 'No'}
                  </div>
                  <div className="text-gray-300">
                    <strong>Created at:</strong> {user.created_at}
                  </div>
                  <div className="text-gray-300">
                    <strong>Email confirmed at:</strong> {user.email_confirmed_at || 'Not confirmed'}
                  </div>
                  <div className="text-gray-300">
                    <strong>Last sign in:</strong> {user.last_sign_in_at || 'Never'}
                  </div>
                  <div className="text-gray-300">
                    <strong>Permissions:</strong> {JSON.stringify(user.user_metadata?.permissions || [])}
                  </div>
                </div>
              </div>
            )}

            {/* Action Links */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Test Actions</h3>
              <div className="space-y-4">
                <a
                  href="/admin/wallet-management"
                  className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Try Wallet Management (AdminLayout + ProtectedRoute)
                </a>
                <br />
                <a
                  href="/admin/wallet-direct"
                  className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Try Direct Wallet (No AdminLayout)
                </a>
                <br />
                <a
                  href="/admin"
                  className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Try Admin Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </>
  );
};

export default ProtectedTest;