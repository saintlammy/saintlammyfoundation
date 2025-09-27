import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import { RefreshCw, Trash2, LogOut } from 'lucide-react';

const ClearSession: React.FC = () => {
  const { user, signOut, refreshSession } = useAuth();
  const [message, setMessage] = useState('');

  const clearLocalStorage = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      setMessage('✅ Local and session storage cleared');
    } catch (error) {
      setMessage('❌ Error clearing storage');
    }
  };

  const clearSupabaseSession = async () => {
    try {
      await signOut();
      setMessage('✅ Supabase session cleared');
      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 1000);
    } catch (error) {
      setMessage('❌ Error clearing Supabase session');
    }
  };

  const refreshAndRedirect = async () => {
    try {
      await refreshSession();
      setMessage('✅ Session refreshed');
      setTimeout(() => {
        window.location.href = '/admin/wallet-management';
      }, 1000);
    } catch (error) {
      setMessage('❌ Error refreshing session');
    }
  };

  const forceReload = () => {
    window.location.reload();
  };

  return (
    <>
      <Head>
        <title>Clear Session - Saintlammy Foundation</title>
      </Head>

      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-6">
            Session Management
          </h1>

          {user && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded mb-6">
              <h3 className="text-white font-semibold mb-2">Current User:</h3>
              <p className="text-gray-300">Email: {user.email}</p>
              <p className="text-gray-300">ID: {user.id}</p>
            </div>
          )}

          {message && (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
              <p className="text-blue-300">{message}</p>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={refreshAndRedirect}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh Session & Try Wallet Access</span>
            </button>

            <button
              onClick={clearLocalStorage}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span>Clear Browser Storage</span>
            </button>

            <button
              onClick={clearSupabaseSession}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out & Clear Session</span>
            </button>

            <button
              onClick={forceReload}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gray-600 hover:bg-gray-50 dark:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Force Page Reload</span>
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="text-white font-semibold mb-2">Test Pages:</h3>
            <div className="space-x-4">
              <a href="/admin/test-access" className="text-blue-400 hover:text-blue-300">Test Access (No Layout)</a>
              <a href="/admin/wallet-test" className="text-green-400 hover:text-green-300">Wallet Test (ProtectedRoute Only)</a>
              <a href="/admin/debug" className="text-purple-400 hover:text-purple-300">Debug Page</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClearSession;