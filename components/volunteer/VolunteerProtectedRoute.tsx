import React, { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

interface VolunteerProtectedRouteProps {
  children: ReactNode;
}

const VolunteerProtectedRoute: React.FC<VolunteerProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { user, session, isLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuthorization();
  }, [user, session]);

  const checkAuthorization = async () => {
    if (isLoading) {
      return;
    }

    if (!user || !session) {
      // Not logged in
      router.push('/volunteer/login');
      return;
    }

    try {
      // Check if user has volunteer role
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();

        if (data.user && data.user.role === 'volunteer') {
          // User is a volunteer
          setIsAuthorized(true);
        } else {
          // User is not a volunteer
          router.push('/');
        }
      } else {
        // API error
        router.push('/volunteer/login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/volunteer/login');
    } finally {
      setIsCheckingAuth(false);
    }
  };

  if (isLoading || isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Router will redirect
  }

  return <>{children}</>;
};

export default VolunteerProtectedRoute;
