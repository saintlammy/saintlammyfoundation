import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { Wallet, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const WalletDirect: React.FC = () => {
  const { user, loading, isAdmin, isModerator, hasPermission } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[WalletDirect] ${message}`);
  };

  useEffect(() => {
    const message = `Auth state: loading=${loading}, user=${!!user}, isAdmin=${isAdmin}, email=${user?.email}`;
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[WalletDirect] ${message}`);
  }, [loading, user, isAdmin, user?.email]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        const message = '❌ No user found, redirecting to login';
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
        console.log(`[WalletDirect] ${message}`);
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000); // Delay to see the log
        return;
      }

      if (!isAdmin) {
        const message = '❌ User is not admin, redirecting to unauthorized';
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
        console.log(`[WalletDirect] ${message}`);
        setTimeout(() => {
          router.push('/admin/unauthorized');
        }, 2000); // Delay to see the log
        return;
      }

      const message = '✅ All checks passed, showing wallet management';
      const timestamp = new Date().toLocaleTimeString();
      setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
      console.log(`[WalletDirect] ${message}`);
    }
  }, [user, loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-accent-500 mx-auto mb-4" />
          <div className="text-white">Loading authentication...</div>
          <div className="text-gray-400 text-sm mt-2">Checking permissions...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <div className="text-white">Not authenticated</div>
          <div className="text-gray-400 text-sm mt-2">Redirecting to login in 2 seconds...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <div className="text-white">Access Denied</div>
          <div className="text-gray-400 text-sm mt-2">Admin privileges required</div>
          <div className="text-gray-400 text-sm">Redirecting in 2 seconds...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Wallet Management (Direct) - Saintlammy Foundation</title>
      </Head>

      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Success Header */}
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">🎉 Wallet Access Granted!</h1>
                <p className="text-green-300">You have successfully bypassed the authentication issues.</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Authentication Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">User: {user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Admin Status: {isAdmin ? 'YES' : 'NO'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Moderator Status: {isModerator ? 'YES' : 'NO'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {hasPermission('admin:write') ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                  <span className="text-gray-300">Admin Write: {hasPermission('admin:write') ? 'YES' : 'NO'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {hasPermission('donations:read') ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                  <span className="text-gray-300">Donations Read: {hasPermission('donations:read') ? 'YES' : 'NO'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Debug Logs */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Debug Logs</h2>
            <div className="bg-black rounded p-4 max-h-60 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="text-green-400 text-sm font-mono mb-1">
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Wallet Management Placeholder */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Wallet className="w-5 h-5 mr-2" />
              Crypto Wallet Management
            </h2>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300">
                🎉 Success! You can access the wallet management functionality.
              </p>
              <p className="text-blue-200 mt-2">
                This proves the authentication system works when properly implemented.
                The issue is likely in the AdminLayout or ProtectedRoute component.
              </p>
            </div>

            <div className="mt-6 space-x-4">
              <a
                href="/admin/wallet-management"
                className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Try Original Wallet Management
              </a>
              <a
                href="/admin"
                className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Go to Admin Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletDirect;