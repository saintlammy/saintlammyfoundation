import { useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useRouter } from 'next/router';

/**
 * Hook to trigger notifications for various events in the application
 */
export const useNotificationEvents = () => {
  const { success, error, warning, info } = useNotifications();
  const router = useRouter();

  // Listen for donation events
  useEffect(() => {
    const handleDonationSuccess = (event: CustomEvent) => {
      const { amount, currency, method } = event.detail;
      success(
        'Donation Successful!',
        `Thank you for your ${currency} ${amount} donation via ${method}.`,
        7000
      );
    };

    const handleDonationPending = (event: CustomEvent) => {
      const { amount, currency } = event.detail;
      info(
        'Donation Pending',
        `Your ${currency} ${amount} donation is pending blockchain confirmation.`,
        10000
      );
    };

    const handleDonationError = (event: CustomEvent) => {
      const { message } = event.detail;
      error(
        'Donation Failed',
        message || 'There was an error processing your donation. Please try again.',
        0 // Persist errors
      );
    };

    // Blockchain verification events
    const handleBlockchainConfirmed = (event: CustomEvent) => {
      const { donationId, amount, currency } = event.detail;
      success(
        'Payment Confirmed!',
        `Your ${currency} ${amount} cryptocurrency donation has been confirmed on the blockchain.`,
        8000
      );
    };

    const handleBlockchainPending = (event: CustomEvent) => {
      const { confirmations, required } = event.detail;
      info(
        'Awaiting Confirmations',
        `${confirmations}/${required} blockchain confirmations received. Please wait...`,
        5000
      );
    };

    // Campaign events
    const handleCampaignGoalReached = (event: CustomEvent) => {
      const { campaignName } = event.detail;
      success(
        'Campaign Goal Reached!',
        `The "${campaignName}" campaign has reached its funding goal! Thank you for your support.`,
        10000
      );
    };

    // System events
    const handleSystemMaintenance = (event: CustomEvent) => {
      const { message, duration } = event.detail;
      warning(
        'System Maintenance',
        message ||'The system will undergo maintenance shortly. Some features may be temporarily unavailable.',
        duration || 15000
      );
    };

    // Add event listeners
    window.addEventListener('donation:success', handleDonationSuccess as EventListener);
    window.addEventListener('donation:pending', handleDonationPending as EventListener);
    window.addEventListener('donation:error', handleDonationError as EventListener);
    window.addEventListener('blockchain:confirmed', handleBlockchainConfirmed as EventListener);
    window.addEventListener('blockchain:pending', handleBlockchainPending as EventListener);
    window.addEventListener('campaign:goal-reached', handleCampaignGoalReached as EventListener);
    window.addEventListener('system:maintenance', handleSystemMaintenance as EventListener);

    return () => {
      window.removeEventListener('donation:success', handleDonationSuccess as EventListener);
      window.removeEventListener('donation:pending', handleDonationPending as EventListener);
      window.removeEventListener('donation:error', handleDonationError as EventListener);
      window.removeEventListener('blockchain:confirmed', handleBlockchainConfirmed as EventListener);
      window.removeEventListener('blockchain:pending', handleBlockchainPending as EventListener);
      window.removeEventListener('campaign:goal-reached', handleCampaignGoalReached as EventListener);
      window.removeEventListener('system:maintenance', handleSystemMaintenance as EventListener);
    };
  }, [success, error, warning, info]);

  // Helper functions to trigger events
  return {
    notifyDonationSuccess: (amount: number, currency: string, method: string) => {
      window.dispatchEvent(
        new CustomEvent('donation:success', {
          detail: { amount, currency, method }
        })
      );
    },
    notifyDonationPending: (amount: number, currency: string) => {
      window.dispatchEvent(
        new CustomEvent('donation:pending', {
          detail: { amount, currency }
        })
      );
    },
    notifyDonationError: (message: string) => {
      window.dispatchEvent(
        new CustomEvent('donation:error', {
          detail: { message }
        })
      );
    },
    notifyBlockchainConfirmed: (donationId: string, amount: number, currency: string) => {
      window.dispatchEvent(
        new CustomEvent('blockchain:confirmed', {
          detail: { donationId, amount, currency }
        })
      );
    },
    notifyBlockchainPending: (confirmations: number, required: number) => {
      window.dispatchEvent(
        new CustomEvent('blockchain:pending', {
          detail: { confirmations, required }
        })
      );
    },
    notifyCampaignGoalReached: (campaignName: string) => {
      window.dispatchEvent(
        new CustomEvent('campaign:goal-reached', {
          detail: { campaignName }
        })
      );
    },
    notifySystemMaintenance: (message?: string, duration?: number) => {
      window.dispatchEvent(
        new CustomEvent('system:maintenance', {
          detail: { message, duration }
        })
      );
    },
  };
};
