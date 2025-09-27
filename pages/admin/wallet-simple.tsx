import React from 'react';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Wallet, Shield, CheckCircle, XCircle } from 'lucide-react';

const WalletSimple: React.FC = () => {
  const { user, loading, isAdmin, isModerator } = useAuth();

  return (
    <>
      <Head>
        <title>Wallet Management (Simple) - Saintlammy Foundation</title>
      </Head>

      <ProtectedRoute requireAdmin={true}>
        <div className="min-h-screen bg-gray-900 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Success Header */}
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white">🎉 Wallet Management Access Granted!</h1>
                  <p className="text-green-300">This is the wallet management page WITHOUT AdminLayout wrapper.</p>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Authentication Status (ProtectedRoute Only)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">User: {user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Admin Status: {isAdmin ? 'YES' : 'NO'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Loading: {loading ? 'YES' : 'NO'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Email Confirmed: {user?.email_confirmed_at ? 'YES' : 'NO'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Moderator: {isModerator ? 'YES' : 'NO'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Management Placeholder */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Wallet className="w-5 h-5 mr-2" />
                Crypto Wallet Management (Simplified)
              </h2>
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4">
                <p className="text-blue-300">
                  ✅ Success! This page uses ProtectedRoute directly without AdminLayout.
                </p>
                <p className="text-blue-200 mt-2">
                  If this works but the full wallet management page doesn't, then AdminLayout is the issue.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Sample Wallet Information</h3>
                  <div className="text-sm text-gray-300 space-y-1">
                    <div><strong>Bitcoin:</strong> 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa</div>
                    <div><strong>Ethereum:</strong> 0x0000000000000000000000000000000000000000</div>
                    <div><strong>Solana:</strong> 11111111111111111111111111111112</div>
                  </div>
                </div>

                <div className="space-x-4">
                  <a
                    href="/admin/wallet-management"
                    className="inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Try Full Wallet Management (WITH AdminLayout)
                  </a>
                  <a
                    href="/admin/protected-test"
                    className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Back to Protected Test
                  </a>
                  <a
                    href="/admin/wallet-direct"
                    className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Try Direct Test (No ProtectedRoute)
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

export default WalletSimple;