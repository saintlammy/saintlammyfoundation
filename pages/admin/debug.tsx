import React from 'react';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import {
  Shield,
  User,
  Check,
  X,
  Info,
  RefreshCw
} from 'lucide-react';

const AdminDebug: React.FC = () => {
  const { user, session, loading, isAdmin, isModerator, hasPermission, refreshSession } = useAuth();

  const handleRefresh = async () => {
    await refreshSession();
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Debug - Saintlammy Foundation</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <Shield className="w-6 h-6 mr-2" />
                Authentication Debug
              </h1>
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Session</span>
              </button>
            </div>

            {/* Authentication Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Authentication Status
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {user ? <Check className="w-4 h-4 text-green-400" /> : <X className="w-4 h-4 text-red-400" />}
                    <span className="text-gray-300">User Authenticated</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {session ? <Check className="w-4 h-4 text-green-400" /> : <X className="w-4 h-4 text-red-400" />}
                    <span className="text-gray-300">Session Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isAdmin ? <Check className="w-4 h-4 text-green-400" /> : <X className="w-4 h-4 text-red-400" />}
                    <span className="text-gray-300">Admin Access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isModerator ? <Check className="w-4 h-4 text-green-400" /> : <X className="w-4 h-4 text-red-400" />}
                    <span className="text-gray-300">Moderator Access</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  Wallet Access
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {isAdmin ? <Check className="w-4 h-4 text-green-400" /> : <X className="w-4 h-4 text-red-400" />}
                    <span className="text-gray-300">Crypto Wallet Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {hasPermission('admin:write') ? <Check className="w-4 h-4 text-green-400" /> : <X className="w-4 h-4 text-red-400" />}
                    <span className="text-gray-300">Admin Write Permission</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {hasPermission('donations:read') ? <Check className="w-4 h-4 text-green-400" /> : <X className="w-4 h-4 text-red-400" />}
                    <span className="text-gray-300">Donations Read Permission</span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Details */}
            {user && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">User Details</h3>
                <div className="space-y-2 text-gray-300">
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>User ID:</strong> {user.id}</div>
                  <div><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</div>
                  <div><strong>Last Sign In:</strong> {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}</div>
                  <div><strong>Email Confirmed:</strong> {user.email_confirmed_at ? 'Yes' : 'No'}</div>
                </div>
              </div>
            )}

            {/* User Metadata */}
            {user?.user_metadata && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">User Metadata</h3>
                <pre className="bg-gray-800 p-3 rounded text-green-400 text-sm overflow-auto">
                  {JSON.stringify(user.user_metadata, null, 2)}
                </pre>
              </div>
            )}

            {/* Admin Email Check */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Admin Email Validation</h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center space-x-2">
                  {user?.email?.includes('@saintlammyfoundation.org') ? <Check className="w-4 h-4 text-green-400" /> : <X className="w-4 h-4 text-red-400" />}
                  <span>@saintlammyfoundation.org domain</span>
                </div>
                <div className="flex items-center space-x-2">
                  {user?.email === 'admin@saintlammyfoundation.org' ? <Check className="w-4 h-4 text-green-400" /> : <X className="w-4 h-4 text-red-400" />}
                  <span>admin@saintlammyfoundation.org</span>
                </div>
                <div className="flex items-center space-x-2">
                  {user?.email === 'saintlammyfoundation@gmail.com' ? <Check className="w-4 h-4 text-green-400" /> : <X className="w-4 h-4 text-red-400" />}
                  <span>saintlammyfoundation@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  {user?.email === 'saintlammy@gmail.com' ? <Check className="w-4 h-4 text-green-400" /> : <X className="w-4 h-4 text-red-400" />}
                  <span>saintlammy@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  {user?.user_metadata?.role === 'admin' ? <Check className="w-4 h-4 text-green-400" /> : <X className="w-4 h-4 text-red-400" />}
                  <span>Role metadata = 'admin'</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <a
                href="/admin"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Go to Admin Dashboard
              </a>
              <a
                href="/admin/wallet-management"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Try Wallet Management
              </a>
              <a
                href="/admin/login"
                className="px-4 py-2 bg-gray-600 hover:bg-gray-50 dark:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Back to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDebug;