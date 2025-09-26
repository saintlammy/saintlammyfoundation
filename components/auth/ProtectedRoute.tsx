import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { Loader, Shield, AlertTriangle, Lock, UserX } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireModerator?: boolean;
  requiredPermissions?: string[];
  redirectTo?: string;
  fallbackComponent?: ReactNode;
  showRetryButton?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = true,
  requireModerator = false,
  requiredPermissions = [],
  redirectTo = '/admin/login',
  fallbackComponent,
  showRetryButton = true
}) => {
  const { user, loading, isAdmin, isModerator, hasPermission, refreshSession } = useAuth();
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);

  const checkPermissions = (): boolean => {
    if (!user) return false;

    // Check admin requirements
    if (requireAdmin && !isAdmin) return false;

    // Check moderator requirements
    if (requireModerator && !isModerator) return false;

    // Check specific permissions
    if (requiredPermissions.length > 0) {
      return requiredPermissions.every(permission => hasPermission(permission));
    }

    return true;
  };

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await refreshSession();
    } catch (error) {
      console.error('Failed to refresh session:', error);
    } finally {
      setRetrying(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      // Not authenticated
      if (!user) {
        router.push(redirectTo);
        return;
      }

      // Check all permission requirements
      if (!checkPermissions()) {
        router.push('/admin/unauthorized');
        return;
      }
    }
  }, [user, loading, isAdmin, isModerator, requireAdmin, requireModerator, requiredPermissions, router, redirectTo]);

  // Show loading while checking authentication
  if (loading || retrying) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Loader className="w-5 h-5 animate-spin text-accent-500" />
            <span className="text-gray-400">
              {retrying ? 'Refreshing session...' : 'Verifying access...'}
            </span>
          </div>
          <p className="text-gray-500 text-sm">Please wait while we authenticate your session</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show fallback or redirect
  if (!user) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    return null; // Redirect will happen
  }

  // Check permissions and show appropriate error
  if (!checkPermissions()) {
    const getErrorDetails = () => {
      if (requireAdmin && !isAdmin) {
        return {
          icon: Lock,
          title: 'Admin Access Required',
          message: 'You need administrator privileges to access this area.',
          iconColor: 'bg-red-500'
        };
      }

      if (requireModerator && !isModerator) {
        return {
          icon: UserX,
          title: 'Moderator Access Required',
          message: 'You need moderator or administrator privileges to access this area.',
          iconColor: 'bg-orange-500'
        };
      }

      if (requiredPermissions.length > 0) {
        return {
          icon: AlertTriangle,
          title: 'Insufficient Permissions',
          message: `You need the following permissions: ${requiredPermissions.join(', ')}`,
          iconColor: 'bg-yellow-500'
        };
      }

      return {
        icon: AlertTriangle,
        title: 'Access Denied',
        message: 'You don\'t have permission to access this area.',
        iconColor: 'bg-red-500'
      };
    };

    const { icon: ErrorIcon, title, message, iconColor } = getErrorDetails();

    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className={`w-16 h-16 ${iconColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <ErrorIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
          <p className="text-gray-400 mb-6">{message}</p>

          {user && (
            <div className="bg-gray-800 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-300 mb-2">Current user:</p>
              <p className="text-white font-medium">{user.email}</p>
              <p className="text-sm text-gray-400">
                Role: {user.user_metadata?.role || 'user'}
              </p>
            </div>
          )}

          <div className="space-y-3">
            {showRetryButton && (
              <button
                onClick={handleRetry}
                disabled={retrying}
                className="w-full py-2 px-4 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {retrying ? 'Refreshing...' : 'Refresh Session'}
              </button>
            )}
            <button
              onClick={() => router.push('/')}
              className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
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