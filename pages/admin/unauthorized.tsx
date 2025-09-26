import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import {
  Shield,
  AlertTriangle,
  Home,
  ArrowLeft,
  Mail,
  RefreshCw
} from 'lucide-react';

const Unauthorized: React.FC = () => {
  const { user, signOut, refreshSession } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };

  const handleRefreshSession = async () => {
    await refreshSession();
    // Try to go back to the previous page
    router.back();
  };

  return (
    <>
      <Head>
        <title>Access Denied - Saintlammy Foundation</title>
        <meta name="description" content="You don't have permission to access this area" />
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>

          {/* Header */}
          <h1 className="text-3xl font-bold text-white mb-4 font-display">
            Access Denied
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            You don't have permission to access this admin area.
          </p>

          {/* User Info */}
          {user && (
            <div className="bg-gray-800 rounded-lg p-4 mb-8 text-left">
              <div className="flex items-center space-x-3 mb-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300 font-medium">Current Session</span>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-400 text-sm">Email:</span>
                  <p className="text-white font-mono text-sm">{user.email}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Role:</span>
                  <p className="text-white text-sm">
                    {user.user_metadata?.role || 'user'}
                  </p>
                </div>
                {user.user_metadata?.organization && (
                  <div>
                    <span className="text-gray-400 text-sm">Organization:</span>
                    <p className="text-white text-sm">
                      {user.user_metadata.organization}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-8">
            <p className="text-blue-300 text-sm">
              If you believe this is an error, please contact an administrator or try refreshing your session.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            {/* Refresh Session */}
            <button
              onClick={handleRefreshSession}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh Session & Retry</span>
            </button>

            {/* Sign Out */}
            {user && (
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <Shield className="w-5 h-5" />
                <span>Sign Out & Login Again</span>
              </button>
            )}

            {/* Go Back */}
            <button
              onClick={() => router.back()}
              className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-gray-600 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>

            {/* Home */}
            <Link
              href="/"
              className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-gray-600 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Return to Homepage</span>
            </Link>
          </div>

          {/* Contact */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Need help?</p>
            <Link
              href="mailto:admin@saintlammyfoundation.org"
              className="inline-flex items-center space-x-2 text-accent-400 hover:text-accent-300 text-sm"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Administrator</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Unauthorized;