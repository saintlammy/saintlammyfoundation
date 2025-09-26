import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  CheckCircle,
  AlertCircle,
  Loader,
  Mail,
  Shield
} from 'lucide-react';

const AdminConfirm: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already_confirmed'>('loading');
  const [message, setMessage] = useState('');
  const { user, refreshSession } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the hash parameters from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        console.log('Confirmation params:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });

        if (type === 'signup' && accessToken && refreshToken) {
          // Set the session using the tokens
          if (!supabase) {
            setStatus('error');
            setMessage('Configuration error. Please try again later.');
            return;
          }

          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('Session error:', error);
            setStatus('error');
            setMessage('Failed to confirm email. Please try signing in manually.');
            return;
          }

          if (data.user) {
            setStatus('success');
            setMessage('Email confirmed successfully! Redirecting to admin dashboard...');

            // Refresh the auth context
            await refreshSession();

            // Redirect to admin dashboard after a short delay
            setTimeout(() => {
              router.push('/admin');
            }, 2000);
          } else {
            setStatus('error');
            setMessage('No user data received. Please try signing in manually.');
          }
        } else if (user) {
          // User is already signed in and confirmed
          setStatus('already_confirmed');
          setMessage('You are already signed in and confirmed.');
          setTimeout(() => {
            router.push('/admin');
          }, 2000);
        } else {
          // No valid confirmation parameters
          setStatus('error');
          setMessage('Invalid confirmation link. Please try signing up again or contact support.');
        }
      } catch (error) {
        console.error('Confirmation error:', error);
        setStatus('error');
        setMessage('An error occurred during confirmation. Please try again.');
      }
    };

    handleEmailConfirmation();
  }, [user, refreshSession, router]);

  return (
    <>
      <Head>
        <title>Email Confirmation - Saintlammy Foundation</title>
        <meta name="description" content="Confirming your admin account email" />
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mb-4">
              {status === 'loading' && <Loader className="w-8 h-8 text-white animate-spin" />}
              {status === 'success' && <CheckCircle className="w-8 h-8 text-white" />}
              {status === 'already_confirmed' && <Shield className="w-8 h-8 text-white" />}
              {status === 'error' && <AlertCircle className="w-8 h-8 text-white" />}
            </div>

            <h2 className="text-3xl font-bold text-white font-display">
              {status === 'loading' && 'Confirming Email...'}
              {status === 'success' && 'Email Confirmed!'}
              {status === 'already_confirmed' && 'Already Confirmed'}
              {status === 'error' && 'Confirmation Failed'}
            </h2>

            <p className="mt-2 text-gray-400">
              {status === 'loading' && 'Please wait while we confirm your email address'}
              {status === 'success' && 'Your admin account has been activated'}
              {status === 'already_confirmed' && 'Your account is ready to use'}
              {status === 'error' && 'There was an issue with the confirmation'}
            </p>
          </div>

          {/* Status Message */}
          <div className={`rounded-lg p-4 flex items-center space-x-3 ${
            status === 'success' || status === 'already_confirmed'
              ? 'bg-green-900/50 border border-green-500/50'
              : status === 'error'
              ? 'bg-red-900/50 border border-red-500/50'
              : 'bg-blue-900/50 border border-blue-500/50'
          }`}>
            {status === 'loading' && <Loader className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0" />}
            {(status === 'success' || status === 'already_confirmed') && <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />}
            {status === 'error' && <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
            <p className={`text-sm ${
              status === 'success' || status === 'already_confirmed'
                ? 'text-green-400'
                : status === 'error'
                ? 'text-red-400'
                : 'text-blue-400'
            }`}>
              {message}
            </p>
          </div>

          {/* User Information */}
          {user && (
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-medium mb-2 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Account Details
              </h3>
              <div className="space-y-1 text-sm text-gray-300">
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Confirmed:</strong> {user.email_confirmed_at ? 'Yes' : 'No'}</div>
                <div><strong>Role:</strong> {user.user_metadata?.role || 'Admin'}</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {(status === 'success' || status === 'already_confirmed') && (
              <button
                onClick={() => router.push('/admin')}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent-500 hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 transition-colors"
              >
                Continue to Admin Dashboard
              </button>
            )}

            {status === 'error' && (
              <>
                <button
                  onClick={() => router.push('/admin/login')}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent-500 hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 transition-colors"
                >
                  Try Signing In
                </button>
                <button
                  onClick={() => router.push('/admin/signup')}
                  className="w-full flex justify-center py-3 px-4 border border-gray-600 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Sign Up Again
                </button>
              </>
            )}

            <button
              onClick={() => router.push('/')}
              className="w-full flex justify-center py-2 px-4 text-sm text-gray-400 hover:text-accent-400 transition-colors"
            >
              ← Back to Homepage
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminConfirm;