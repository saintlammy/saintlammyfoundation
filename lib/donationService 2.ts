import { supabase, handleSupabaseError, isSupabaseAvailable } from './supabase';
import { Database } from '@/types/database';
import * as crypto from 'crypto';

type DonationRow = Database['public']['Tables']['donations']['Row'];
type DonationInsert = Database['public']['Tables']['donations']['Insert'];
type DonationUpdate = Database['public']['Tables']['donations']['Update'];
type DonorRow = Database['public']['Tables']['donors']['Row'];
type DonorInsert = Database['public']['Tables']['donors']['Insert'];

export interface CryptoDonationData {
  amount: number;
  currency: string;
  network: string;
  cryptoAmount: number;
  cryptoPrice: number;
  walletAddress: string;
  memo?: string;
  donorName?: string;
  donorEmail?: string;
  message?: string;
  source?: string;
  category?: 'orphan' | 'widow' | 'home' | 'general';
}

export interface PayPalDonationData {
  type: 'one-time' | 'subscription';
  amount: number;
  currency: string;
  frequency?: 'one-time' | 'monthly' | 'weekly' | 'yearly';
  paymentId?: string;
  subscriptionId?: string;
  paypalOrderId?: string;
  payerId?: string;
  payerEmail?: string;
  payerName?: string;
  donorName?: string;
  donorEmail?: string;
  message?: string;
  source?: string;
  category?: 'orphan' | 'widow' | 'home' | 'general';
  timestamp?: string;
  fees?: string;
  startDate?: string;
  nextBillingDate?: string;
}

export interface DonationStatus {
  id: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  confirmations: number;
  requiredConfirmations: number;
  txHash?: string;
  confirmedAt?: string;
  expiresAt?: string;
  amount: number;
  currency: string;
}

class DonationService {
  /**
   * Encrypt email address for storage
   */
  private async encryptEmail(email: string): Promise<{ encrypted: string; hash: string }> {
    try {
      const { data, error } = await supabase.rpc('encrypt_email', { email });
      if (error) throw error;

      const { data: hashData, error: hashError } = await supabase.rpc('hash_email', { email });
      if (hashError) throw hashError;

      return { encrypted: data, hash: hashData };
    } catch (error) {
      // Fallback to simple encryption if database functions aren't available
      const key = process.env.ENCRYPTION_KEY || 'saintlammy-foundation-2024';
      const cipher = crypto.createCipher('aes256', key);
      const encrypted = cipher.update(email, 'utf8', 'hex') + cipher.final('hex');
      const hash = crypto.createHash('sha256').update(email.toLowerCase()).digest('hex');

      return { encrypted, hash };
    }
  }

  /**
   * Create or get existing donor
   */
  async upsertDonor(donorData: {
    name?: string;
    email?: string;
    phone?: string;
    isAnonymous?: boolean;
  }): Promise<string | null> {
    if (!donorData.email && !donorData.name) {
      return null; // Anonymous donation with no identifiable info
    }

    // If Supabase is not available, return a temporary donor ID
    if (!isSupabaseAvailable || !supabase) {
      const tempDonorId = `temp_donor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log(`Created temporary donor: ${tempDonorId}`, {
        name: donorData.name || 'Anonymous',
        email: donorData.email ? '[REDACTED]' : 'none',
      });
      return tempDonorId;
    }

    try {
      let donorId: string | null = null;

      if (donorData.email) {
        const { encrypted, hash } = await this.encryptEmail(donorData.email);

        // Check if donor exists
        const { data: existingDonor, error: findError } = await supabase
          .from('donors')
          .select('id, total_donated')
          .eq('email_hash', hash)
          .single();

        if (findError && findError.code !== 'PGRST116') {
          console.error('Error finding donor:', findError);
        }

        if (existingDonor) {
          donorId = existingDonor.id;
        } else {
          // Create new donor
          const newDonor: DonorInsert = {
            name: donorData.name || 'Anonymous Donor',
            email_encrypted: encrypted,
            email_hash: hash,
            phone: donorData.phone || null,
            is_anonymous: donorData.isAnonymous || false,
            total_donated: 0,
          };

          const { data: createdDonor, error: createError } = await supabase
            .from('donors')
            .insert([newDonor])
            .select('id')
            .single();

          if (createError) {
            console.error('Error creating donor:', createError);
            return null;
          }

          donorId = createdDonor.id;
        }
      }

      return donorId;
    } catch (error) {
      console.error('Error upserting donor:', error);
      return null;
    }
  }

  /**
   * Store crypto donation in database
   */
  async storeCryptoDonation(donationData: CryptoDonationData): Promise<string> {
    // If Supabase is not available, return a temporary ID
    if (!isSupabaseAvailable || !supabase) {
      console.warn('Supabase not configured. Generating temporary donation ID.');
      const tempId = `temp_crypto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log(`Created temporary crypto donation: ${tempId}`, {
        amount: donationData.amount,
        currency: donationData.currency,
        network: donationData.network,
        cryptoAmount: donationData.cryptoAmount,
      });
      return tempId;
    }

    try {
      // Create or get donor
      const donorId = await this.upsertDonor({
        name: donationData.donorName,
        email: donationData.donorEmail,
        isAnonymous: !donationData.donorName && !donationData.donorEmail,
      });

      // Create donation record
      const newDonation: DonationInsert = {
        donor_id: donorId,
        category: donationData.category || 'general',
        amount: donationData.amount,
        currency: donationData.currency,
        frequency: 'one-time',
        payment_method: 'crypto',
        status: 'pending',
        notes: JSON.stringify({
          network: donationData.network,
          cryptoAmount: donationData.cryptoAmount,
          cryptoPrice: donationData.cryptoPrice,
          walletAddress: donationData.walletAddress,
          memo: donationData.memo,
          message: donationData.message,
          source: donationData.source,
        }),
      };

      const { data: donation, error } = await supabase
        .from('donations')
        .insert([newDonation])
        .select('id')
        .single();

      if (error) {
        console.error('Error storing donation:', error);
        throw new Error(`Failed to store donation: ${handleSupabaseError(error)}`);
      }

      return donation.id;
    } catch (error) {
      console.error('Error in storeCryptoDonation:', error);
      throw error;
    }
  }

  /**
   * Store PayPal donation in database
   */
  async storePayPalDonation(donationData: PayPalDonationData): Promise<{
    donationId: string;
    receiptNumber: string;
    status: string;
  }> {
    try {
      // Create or get donor - prefer PayPal account info over custom donor info
      const donorId = await this.upsertDonor({
        name: donationData.payerName || donationData.donorName,
        email: donationData.payerEmail || donationData.donorEmail,
        isAnonymous: !donationData.payerName && !donationData.donorName && !donationData.payerEmail && !donationData.donorEmail,
      });

      // Map donation type to frequency
      const frequency = donationData.type === 'subscription'
        ? (donationData.frequency || 'monthly')
        : 'one-time';

      // Create donation record
      const newDonation: DonationInsert = {
        donor_id: donorId,
        category: donationData.category || 'general',
        amount: donationData.amount,
        currency: donationData.currency,
        frequency: frequency as 'one-time' | 'monthly' | 'weekly' | 'yearly',
        payment_method: 'card', // PayPal is treated as card payment in our schema
        status: 'completed', // PayPal donations are immediately completed
        tx_reference: donationData.paymentId || donationData.subscriptionId,
        processed_at: donationData.timestamp || new Date().toISOString(),
        notes: JSON.stringify({
          paymentMethod: 'paypal',
          type: donationData.type,
          paypalOrderId: donationData.paypalOrderId,
          payerId: donationData.payerId,
          subscriptionId: donationData.subscriptionId,
          fees: donationData.fees,
          message: donationData.message,
          source: donationData.source,
          startDate: donationData.startDate,
          nextBillingDate: donationData.nextBillingDate,
        }),
      };

      const { data: donation, error } = await supabase
        .from('donations')
        .insert([newDonation])
        .select('id')
        .single();

      if (error) {
        console.error('Error storing PayPal donation:', error);
        throw new Error(`Failed to store PayPal donation: ${handleSupabaseError(error)}`);
      }

      // Update donor's total donated immediately since PayPal donations are completed
      await this.updateDonorTotalDonated(donation.id);

      // Generate receipt number
      const receiptNumber = `RCP-${Date.now()}-${donation.id.substring(0, 8)}`;

      return {
        donationId: donation.id,
        receiptNumber,
        status: 'completed'
      };
    } catch (error) {
      console.error('Error in storePayPalDonation:', error);
      throw error;
    }
  }

  /**
   * Get donation by ID
   */
  async getDonationById(donationId: string): Promise<DonationStatus | null> {
    try {
      const { data: donation, error } = await supabase
        .from('donations')
        .select('*')
        .eq('id', donationId)
        .single();

      if (error) {
        console.error('Error fetching donation:', error);
        return null;
      }

      if (!donation) {
        return null;
      }

      // Parse notes to get crypto-specific data
      const notes = typeof donation.notes === 'string'
        ? JSON.parse(donation.notes)
        : donation.notes || {};

      // Calculate required confirmations based on network
      const networkConfirmations: { [key: string]: number } = {
        bitcoin: 6,
        erc20: 12,
        sol: 32,
        bep20: 12,
        trc20: 19,
        xrpl: 3,
      };

      const requiredConfirmations = networkConfirmations[notes.network] || 6;

      return {
        id: donation.id,
        status: donation.status as 'pending' | 'completed' | 'failed' | 'refunded',
        confirmations: 0, // This would be fetched from blockchain in real implementation
        requiredConfirmations,
        txHash: donation.tx_hash || undefined,
        confirmedAt: donation.processed_at || undefined,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        amount: donation.amount,
        currency: donation.currency,
      };
    } catch (error) {
      console.error('Error in getDonationById:', error);
      return null;
    }
  }

  /**
   * Update donation status and transaction hash
   */
  async updateDonationStatus(
    donationId: string,
    status: 'pending' | 'completed' | 'failed' | 'refunded',
    txHash?: string
  ): Promise<boolean> {
    try {
      const updateData: DonationUpdate = {
        status,
        tx_hash: txHash || null,
        processed_at: status === 'completed' ? new Date().toISOString() : null,
      };

      const { error } = await supabase
        .from('donations')
        .update(updateData)
        .eq('id', donationId);

      if (error) {
        console.error('Error updating donation status:', error);
        return false;
      }

      // If donation is completed, update donor's total_donated
      if (status === 'completed') {
        await this.updateDonorTotalDonated(donationId);
      }

      return true;
    } catch (error) {
      console.error('Error in updateDonationStatus:', error);
      return false;
    }
  }

  /**
   * Update donor's total donated amount
   */
  private async updateDonorTotalDonated(donationId: string): Promise<void> {
    try {
      // Get the donation
      const { data: donation, error: donationError } = await supabase
        .from('donations')
        .select('donor_id, amount')
        .eq('id', donationId)
        .single();

      if (donationError || !donation?.donor_id) {
        return;
      }

      // Calculate total donated by this donor
      const { data: donorDonations, error: totalError } = await supabase
        .from('donations')
        .select('amount')
        .eq('donor_id', donation.donor_id)
        .eq('status', 'completed');

      if (totalError) {
        console.error('Error calculating total donated:', totalError);
        return;
      }

      const totalDonated = donorDonations?.reduce((sum, d) => sum + d.amount, 0) || 0;

      // Update donor record
      await supabase
        .from('donors')
        .update({
          total_donated: totalDonated,
          last_donation_at: new Date().toISOString(),
        })
        .eq('id', donation.donor_id);
    } catch (error) {
      console.error('Error updating donor total donated:', error);
    }
  }

  /**
   * Get all donations with pagination and filters
   */
  async getDonations(params: {
    page?: number;
    limit?: number;
    status?: string;
    paymentMethod?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<{
    donations: DonationRow[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        paymentMethod,
        startDate,
        endDate,
      } = params;

      let query = supabase
        .from('donations')
        .select('*', { count: 'exact' });

      // Apply filters
      if (status) {
        query = query.eq('status', status);
      }
      if (paymentMethod) {
        query = query.eq('payment_method', paymentMethod);
      }
      if (startDate) {
        query = query.gte('created_at', startDate);
      }
      if (endDate) {
        query = query.lte('created_at', endDate);
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data: donations, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Error fetching donations:', error);
        throw new Error(`Failed to fetch donations: ${handleSupabaseError(error)}`);
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        donations: donations || [],
        total,
        page,
        totalPages,
      };
    } catch (error) {
      console.error('Error in getDonations:', error);
      throw error;
    }
  }

  /**
   * Get donation statistics
   */
  async getDonationStats(): Promise<{
    totalDonations: number;
    totalAmount: number;
    totalDonors: number;
    avgDonationAmount: number;
    donationsByStatus: { [key: string]: number };
    donationsByMethod: { [key: string]: number };
  }> {
    try {
      // Get total donations and amount
      const { data: totalData, error: totalError } = await supabase
        .from('donations')
        .select('amount, status, payment_method');

      if (totalError) {
        console.error('Error fetching donation stats:', totalError);
        throw new Error(`Failed to fetch donation stats: ${handleSupabaseError(totalError)}`);
      }

      // Get total donors
      const { count: donorCount, error: donorError } = await supabase
        .from('donors')
        .select('id', { count: 'exact', head: true });

      if (donorError) {
        console.error('Error counting donors:', donorError);
      }

      const donations = totalData || [];
      const totalDonations = donations.length;
      const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
      const totalDonors = donorCount || 0;
      const avgDonationAmount = totalDonations > 0 ? totalAmount / totalDonations : 0;

      // Group by status
      const donationsByStatus = donations.reduce((acc, d) => {
        acc[d.status] = (acc[d.status] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      // Group by payment method
      const donationsByMethod = donations.reduce((acc, d) => {
        acc[d.payment_method] = (acc[d.payment_method] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      return {
        totalDonations,
        totalAmount,
        totalDonors,
        avgDonationAmount,
        donationsByStatus,
        donationsByMethod,
      };
    } catch (error) {
      console.error('Error in getDonationStats:', error);
      throw error;
    }
  }

  /**
   * Verify if database connection is working
   */
  async testConnection(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('donations')
        .select('id')
        .limit(1)
        .single();

      // Even if no data, a successful query means connection works
      return error?.code !== 'PGRST301'; // Not a connection error
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }
}

export const donationService = new DonationService();