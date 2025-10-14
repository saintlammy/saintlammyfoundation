/**
 * Utility functions to trigger notifications from anywhere in the app
 */

// Donation notifications
export const notifyDonationSuccess = (amount: number, currency: string, method: string) => {
  window.dispatchEvent(
    new CustomEvent('donation:success', {
      detail: { amount, currency, method }
    })
  );
};

export const notifyDonationPending = (amount: number, currency: string) => {
  window.dispatchEvent(
    new CustomEvent('donation:pending', {
      detail: { amount, currency }
    })
  );
};

export const notifyDonationError = (message: string) => {
  window.dispatchEvent(
    new CustomEvent('donation:error', {
      detail: { message }
    })
  );
};

// Blockchain notifications
export const notifyBlockchainConfirmed = (donationId: string, amount: number, currency: string) => {
  window.dispatchEvent(
    new CustomEvent('blockchain:confirmed', {
      detail: { donationId, amount, currency }
    })
  );
};

export const notifyBlockchainPending = (confirmations: number, required: number) => {
  window.dispatchEvent(
    new CustomEvent('blockchain:pending', {
      detail: { confirmations, required }
    })
  );
};

// Campaign notifications
export const notifyCampaignGoalReached = (campaignName: string) => {
  window.dispatchEvent(
    new CustomEvent('campaign:goal-reached', {
      detail: { campaignName }
    })
  );
};

// System notifications
export const notifySystemMaintenance = (message?: string, duration?: number) => {
  window.dispatchEvent(
    new CustomEvent('system:maintenance', {
      detail: { message, duration }
    })
  );
};

// Test function to show sample notifications
export const showSampleNotifications = () => {
  setTimeout(() => notifyDonationSuccess(100, 'USD', 'PayPal'), 500);
  setTimeout(() => notifyDonationPending(0.005, 'BTC'), 2000);
  setTimeout(() => notifyBlockchainPending(2, 6), 4000);
  setTimeout(() => notifyBlockchainConfirmed('donation_123', 0.005, 'BTC'), 6000);
  setTimeout(() => notifyCampaignGoalReached('Feed 100 Widows Before Christmas'), 8000);
};
