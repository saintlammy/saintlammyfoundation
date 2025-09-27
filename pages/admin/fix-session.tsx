import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  LogIn,
  Shield,
  AlertTriangle
} from 'lucide-react';

const FixSession: React.FC = () => {
  const { user, signOut, refreshSession, isAdmin, loading } = useAuth();
  const [fixing, setFixing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const router = useRouter();

  const handleRefreshAndTest = async () => {
    setFixing(true);
    setResult(null);

    try {
      // Step 1: Refresh session
      await refreshSession();

      // Step 2: Wait a bit for state to update
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 3: Check if we can access wallet now
      setResult('✅ Session refreshed! Checking admin status...');

      // Give time for the auth context to update
      setTimeout(() => {
        if (isAdmin) {
          setResult('🎉 Success! You now have admin access. Redirecting to wallet...');
          setTimeout(() => {
            router.push('/admin/wallet-management');
          }, 1500);
        } else {
          setResult('❌ Still no admin access. You may need to sign out and back in.');
        }
        setFixing(false);
      }, 2000);

    } catch (error) {
      setResult('❌ Error refreshing session. Please try signing out and back in.');
      setFixing(false);
    }
  };

  const handleSignOutAndRedirect = async () => {
    await signOut();
    router.push('/admin/login');
  };

  const forceCheckWallet = () => {
    router.push('/admin/wallet-direct');
  };

  return (
    <>
      <Head>
        <title>Fix Session - Saintlammy Foundation</title>
      </Head>

      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-2" />
            Session Repair Tool
          </h1>

          {/* Current Status */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded mb-6">
            <h3 className="text-white font-semibold mb-3">Current Status:</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {user ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                <span className="text-gray-300">Logged in: {user ? `Yes (${user.email})` : 'No'}</span>
              </div>
              <div className="flex items-center space-x-2">
                {user?.email_confirmed_at ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                <span className="text-gray-300">Email confirmed: {user?.email_confirmed_at ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center space-x-2">
                {isAdmin ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                <span className="text-gray-300">Admin access: {isAdmin ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          {/* Problem Diagnosis */}
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <h3 className="text-yellow-300 font-semibold">Likely Issue:</h3>
            </div>
            <p className="text-yellow-200 text-sm">
              After email verification, your session may not have properly updated with admin permissions.
              This often happens when the email confirmation redirects to the wrong page.
            </p>
          </div>

          {/* Result Message */}
          {result && (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
              <p className="text-blue-300">{result}</p>
            </div>
          )}

          {/* Fix Actions */}
          <div className="space-y-4">
            <button
              onClick={handleRefreshAndTest}
              disabled={fixing || loading}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {fixing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Refreshing Session...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  <span>Refresh Session & Test Wallet Access</span>
                </>
              )}
            </button>

            <button
              onClick={forceCheckWallet}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Shield className="w-5 h-5" />
              <span>Force Test Wallet Access (Direct)</span>
            </button>

            <button
              onClick={handleSignOutAndRedirect}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <LogIn className="w-5 h-5" />
              <span>Sign Out & Login Fresh</span>
            </button>
          </div>

          {/* Debug Info */}
          {user && (
            <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
              <h3 className="text-white font-semibold mb-2">Debug Info:</h3>
              <div className="text-sm space-y-1">
                <div className="text-gray-300">
                  <strong>Email:</strong> {user.email}
                </div>
                <div className="text-gray-300">
                  <strong>Role in metadata:</strong> {user.user_metadata?.role || 'not set'}
                </div>
                <div className="text-gray-300">
                  <strong>Email matches saintlammy@gmail.com:</strong> {user.email === 'saintlammy@gmail.com' ? 'Yes' : 'No'}
                </div>
                <div className="text-gray-300">
                  <strong>Permissions:</strong> {JSON.stringify(user.user_metadata?.permissions || [])}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="text-white font-semibold mb-2">Quick Links:</h3>
            <div className="space-x-4">
              <a href="/admin/debug" className="text-blue-400 hover:text-blue-300">Full Debug Page</a>
              <a href="/admin/wallet-direct" className="text-green-400 hover:text-green-300">Direct Wallet Test</a>
              <a href="/admin" className="text-purple-400 hover:text-purple-300">Admin Dashboard</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FixSession;