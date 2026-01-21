import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

interface UseAutoLogoutOptions {
  timeoutMinutes?: number;
  onLogout?: (reason: 'inactivity' | 'manual') => void;
}

export const useAutoLogout = (options: UseAutoLogoutOptions = {}) => {
  const { timeoutMinutes = 60, onLogout } = options;
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutReason, setLogoutReason] = useState<string>('');

  const resetTimer = () => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      handleAutoLogout();
    }, timeoutMinutes * 60 * 1000); // Convert minutes to milliseconds
  };

  const handleAutoLogout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();

      // Set logout reason and show modal
      setLogoutReason(`You have been automatically logged out due to ${timeoutMinutes} minutes of inactivity. This is a security measure to protect your account.`);
      setShowLogoutModal(true);

      // Call optional callback
      if (onLogout) {
        onLogout('inactivity');
      }

      // Redirect to login after short delay to show modal
      setTimeout(() => {
        router.push('/admin/login');
      }, 3000);
    } catch (error) {
      console.error('Error during auto-logout:', error);
      router.push('/admin/login');
    }
  };

  const closeModal = () => {
    setShowLogoutModal(false);
    router.push('/admin/login');
  };

  useEffect(() => {
    // Events that indicate user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Reset timer on any user activity
    const handleActivity = () => {
      resetTimer();
    };

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Initialize timer
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [timeoutMinutes]);

  return {
    showLogoutModal,
    logoutReason,
    closeModal,
  };
};
