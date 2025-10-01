import axios from 'axios';

export interface DonationData {
  amount: number;
  currency: string;
  donationType: 'one-time' | 'monthly' | 'yearly';
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  message?: string;
  source?: string;
  category?: string;
  paymentMethod: 'paypal' | 'crypto' | 'card' | 'bank';
  cryptoCurrency?: 'BTC' | 'ETH' | 'USDT' | 'USDC' | 'XRP' | 'BNB' | 'SOL' | 'TRX';
  network?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  approvalUrl?: string;
  error?: string;
  data?: any;
}

export interface CryptoPaymentResult extends PaymentResult {
  walletAddress?: string;
  cryptoAmount?: number;
  qrCode?: string;
  expiresAt?: Date;
  paymentInstructions?: string;
}

class PaymentService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXTAUTH_URL || 'http://localhost:3000';
  }

  /**
   * Process PayPal donation (one-time or recurring)
   */
  async processPayPalDonation(donationData: DonationData): Promise<PaymentResult> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/payments/paypal`, {
        amount: donationData.amount,
        currency: donationData.currency,
        donationType: donationData.donationType,
        donorName: donationData.donorName,
        donorEmail: donationData.donorEmail,
        message: donationData.message,
        source: donationData.source,
        category: donationData.category
      });

      if (response.data.success) {
        return {
          success: true,
          paymentId: response.data.orderID || response.data.subscriptionID,
          approvalUrl: response.data.approvalUrl,
          data: response.data
        };
      } else {
        return {
          success: false,
          error: response.data.error || 'PayPal payment failed'
        };
      }
    } catch (error) {
      console.error('PayPal payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'PayPal payment failed'
      };
    }
  }

  /**
   * Process crypto donation
   */
  async processCryptoDonation(donationData: DonationData): Promise<CryptoPaymentResult> {
    try {
      if (!donationData.cryptoCurrency) {
        return {
          success: false,
          error: 'Crypto currency not specified'
        };
      }

      const response = await axios.post(`${this.baseUrl}/api/payments/crypto`, {
        amount: donationData.amount,
        currency: donationData.cryptoCurrency,
        network: donationData.network,
        donorName: donationData.donorName,
        donorEmail: donationData.donorEmail,
        message: donationData.message,
        source: donationData.source,
        category: donationData.category
      });

      if (response.data.success) {
        return {
          success: true,
          paymentId: response.data.donationId,
          walletAddress: response.data.walletAddress,
          cryptoAmount: response.data.cryptoAmount,
          qrCode: response.data.qrCode,
          expiresAt: new Date(response.data.expiresAt),
          paymentInstructions: response.data.paymentInstructions,
          data: response.data
        };
      } else {
        return {
          success: false,
          error: response.data.error || 'Crypto payment failed'
        };
      }
    } catch (error) {
      console.error('Crypto payment error:', error);

      // Extract detailed error message from API response
      if (axios.isAxiosError(error) && error.response?.data) {
        const apiError = error.response.data;
        const errorMessage = apiError.error || apiError.message || 'Crypto payment failed';
        const errorDetails = apiError.details ? `\n${JSON.stringify(apiError.details)}` : '';

        return {
          success: false,
          error: `${errorMessage}${errorDetails}`
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Crypto payment failed'
      };
    }
  }

  /**
   * Check crypto donation status
   */
  async checkCryptoDonationStatus(donationId: string): Promise<{
    status: 'pending' | 'confirmed' | 'expired' | 'failed';
    confirmations: number;
    txHash?: string;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/payments/crypto?donationId=${donationId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking crypto donation status:', error);
      return {
        status: 'failed',
        confirmations: 0
      };
    }
  }

  /**
   * Submit transaction hash for crypto donation
   */
  async submitCryptoTransaction(donationId: string, txHash: string): Promise<PaymentResult> {
    try {
      const response = await axios.put(`${this.baseUrl}/api/payments/crypto`, {
        donationId,
        txHash
      });

      return {
        success: response.data.success,
        data: response.data
      };
    } catch (error) {
      console.error('Error submitting crypto transaction:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit transaction'
      };
    }
  }

  /**
   * Process donation based on payment method
   */
  async processDonation(donationData: DonationData): Promise<PaymentResult | CryptoPaymentResult> {
    // Validate donation data
    const validation = this.validateDonationData(donationData);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error
      };
    }

    // Track donation attempt
    this.trackDonationAttempt(donationData);

    switch (donationData.paymentMethod) {
      case 'paypal':
        return this.processPayPalDonation(donationData);

      case 'crypto':
        return this.processCryptoDonation(donationData);

      case 'card':
        // TODO: Implement Stripe or other card processing
        return {
          success: false,
          error: 'Card payments not yet implemented'
        };

      default:
        return {
          success: false,
          error: 'Unsupported payment method'
        };
    }
  }

  /**
   * Validate donation data
   */
  private validateDonationData(donationData: DonationData): { isValid: boolean; error?: string } {
    if (!donationData.amount || donationData.amount < 1) {
      return { isValid: false, error: 'Minimum donation amount is $1.00' };
    }

    if (!donationData.currency) {
      return { isValid: false, error: 'Currency is required' };
    }

    if (!donationData.donationType) {
      return { isValid: false, error: 'Donation type is required' };
    }

    if (!donationData.paymentMethod) {
      return { isValid: false, error: 'Payment method is required' };
    }

    if (donationData.paymentMethod === 'crypto' && !donationData.cryptoCurrency) {
      return { isValid: false, error: 'Crypto currency is required for crypto payments' };
    }

    if (donationData.paymentMethod === 'crypto' && !donationData.network) {
      return { isValid: false, error: 'Network is required for crypto payments' };
    }

    if (donationData.donorEmail && !this.isValidEmail(donationData.donorEmail)) {
      return { isValid: false, error: 'Invalid email address' };
    }

    return { isValid: true };
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Track donation attempt for analytics
   */
  private trackDonationAttempt(donationData: DonationData): void {
    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'donation_attempt', {
        event_category: 'donations',
        event_label: donationData.paymentMethod,
        value: donationData.amount,
        currency: donationData.currency,
        custom_parameters: {
          donation_type: donationData.donationType,
          source: donationData.source,
          category: donationData.category
        }
      });
    }

    // Console log for debugging
    console.log('Donation attempt:', {
      method: donationData.paymentMethod,
      amount: donationData.amount,
      currency: donationData.currency,
      type: donationData.donationType,
      source: donationData.source
    });
  }

  /**
   * Get supported currencies for payment method
   */
  getSupportedCurrencies(paymentMethod: string): string[] {
    switch (paymentMethod) {
      case 'paypal':
        return ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'NGN'];
      case 'crypto':
        return ['USD']; // Crypto amounts calculated from USD
      case 'card':
        return ['USD', 'EUR', 'GBP', 'NGN'];
      default:
        return ['USD'];
    }
  }

  /**
   * Get supported crypto currencies
   */
  getSupportedCryptoCurrencies(): string[] {
    return ['BTC', 'ETH', 'USDT', 'USDC', 'XRP', 'BNB', 'SOL', 'TRX'];
  }

  /**
   * Get supported networks for cryptocurrency
   */
  getSupportedNetworks(cryptoCurrency: string): string[] {
    switch (cryptoCurrency) {
      case 'BTC':
        return ['bitcoin'];
      case 'ETH':
        return ['erc20'];
      case 'USDC':
      case 'USDT':
        return ['sol', 'erc20', 'bep20', 'trc20'];
      case 'XRP':
        return ['xrpl'];
      case 'BNB':
        return ['bep20'];
      case 'SOL':
        return ['sol'];
      case 'TRX':
        return ['trc20'];
      default:
        return [];
    }
  }

  /**
   * Format currency amount for display
   */
  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: currency === 'NGN' ? 0 : 2
    }).format(amount);
  }

  /**
   * Convert USD to other currencies (placeholder - would use real exchange rates)
   */
  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) return amount;

    // Placeholder conversion rates (would fetch from real API)
    const rates: { [key: string]: number } = {
      'USD_NGN': 750,
      'USD_EUR': 0.85,
      'USD_GBP': 0.73,
      'USD_CAD': 1.25,
      'USD_AUD': 1.35
    };

    const rateKey = `${fromCurrency}_${toCurrency}`;
    const rate = rates[rateKey] || 1;

    return amount * rate;
  }
}

export const paymentService = new PaymentService();

// Type declarations for global gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}