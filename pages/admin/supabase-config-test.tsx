import React, { useState } from 'react';
import Head from 'next/head';
import { supabase } from '@/lib/supabase';
import { Settings, Globe, Mail, CheckCircle, AlertCircle } from 'lucide-react';

const SupabaseConfigTest: React.FC = () => {
  const [testEmail, setTestEmail] = useState('');
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testEmailConfirmation = async () => {
    if (!testEmail) {
      setTestResult('Please enter an email address');
      return;
    }

    setIsLoading(true);
    try {
      if (!supabase) {
        setTestResult('❌ Error: Supabase not configured');
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'TestPassword123!',
        options: {
          data: {
            role: 'admin',
            name: 'Test User'
          }
        }
      });

      if (error) {
        setTestResult(`❌ Error: ${error.message}`);
      } else if (data.user && !data.user.email_confirmed_at) {
        setTestResult('✅ Signup successful! Check your email for confirmation link. The link should redirect to /admin/confirm');
      } else {
        setTestResult('✅ User created and confirmed automatically');
      }
    } catch (error) {
      setTestResult(`❌ Unexpected error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Supabase Config Test - Saintlammy Foundation</title>
      </Head>

      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Settings className="w-6 h-6 mr-2" />
              Supabase Configuration Test
            </h1>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="w-5 h-5 text-blue-400" />
                <h3 className="text-blue-300 font-semibold">Current Configuration</h3>
              </div>
              <div className="text-blue-200 text-sm space-y-1">
                <div><strong>Expected Site URL:</strong> http://localhost:3000</div>
                <div><strong>Expected Redirect URL:</strong> http://localhost:3000/admin/confirm</div>
                <div><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}</div>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <h3 className="text-yellow-300 font-semibold">How to Configure in Supabase Dashboard</h3>
              </div>
              <div className="text-yellow-200 text-sm space-y-2">
                <div><strong>1. Authentication {'>'} Settings</strong></div>
                <div>   - Look for "URL Configuration" section</div>
                <div>   - Set Site URL: http://localhost:3000</div>
                <div>   - Add Redirect URL: http://localhost:3000/admin/confirm</div>
                <div><strong>2. Authentication {'>'} Email Templates</strong></div>
                <div>   - Edit "Confirm signup" template</div>
                <div>   - Update confirmation URL to redirect to /admin/confirm</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Test Email Address
                </label>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="test@example.com"
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={testEmailConfirmation}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{isLoading ? 'Testing...' : 'Test Signup'}</span>
                  </button>
                </div>
              </div>

              {testResult && (
                <div className={`rounded-lg p-4 ${
                  testResult.startsWith('✅')
                    ? 'bg-green-900/20 border border-green-500/30 text-green-300'
                    : 'bg-red-900/20 border border-red-500/30 text-red-300'
                }`}>
                  {testResult}
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <h3 className="text-white font-semibold mb-2">Quick Links:</h3>
              <div className="space-x-4">
                <a href="/admin/signup" className="text-blue-400 hover:text-blue-300">Admin Signup</a>
                <a href="/admin/confirm" className="text-green-400 hover:text-green-300">Confirm Page</a>
                <a href="/admin/login" className="text-purple-400 hover:text-purple-300">Admin Login</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupabaseConfigTest;