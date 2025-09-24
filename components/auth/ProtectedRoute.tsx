import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { Loader, Shield, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = true,
  redirectTo = '/admin/login'
}) => {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated
      if (!user) {
        router.push(redirectTo);
        return;
      }

      // Authenticated but not admin (when admin is required)
      if (requireAdmin && !isAdmin) {
        router.push('/admin/unauthorized');
        return;
      }
    }
  }, [user, loading, isAdmin, requireAdmin, router, redirectTo]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Loader className="w-5 h-5 animate-spin text-accent-500" />
            <span className="text-gray-400">Verifying access...</span>
          </div>
          <p className="text-gray-500 text-sm">Please wait while we authenticate your session</p>
        </div>
      </div>
    );
  }

  // Not authenticated - don't render anything (redirect will happen)
  if (!user) {
    return null;
  }

  // Authenticated but not admin when admin is required
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">
            You don't have permission to access this admin area. Please contact an administrator if you believe this is an error.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full py-2 px-4 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors"
            >
              Return to Homepage
            </button>
            <button
              onClick={() => router.back()}
              className="w-full py-2 px-4 border border-gray-600 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and authorized - render children
  return <>{children}</>;
};

export default ProtectedRoute;