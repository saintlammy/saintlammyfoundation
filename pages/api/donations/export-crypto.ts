import { NextApiRequest, NextApiResponse } from 'next';
import { donationService } from '@/lib/donationService';
import { getTypedSupabaseClient } from '@/lib/supabase';

/**
 * API endpoint to export crypto donation details with complete transaction information
 * Supports CSV and JSON formats
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { format = 'csv', status, startDate, endDate } = req.query;

    // Get crypto donations from database
    const client = getTypedSupabaseClient();
    let query = (client as any)
      .from('donations')
      .select('*')
      .eq('payment_method', 'crypto')
      .order('created_at', { ascending: false });

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data: donations, error } = await query;

    if (error) {
      console.error('Error fetching crypto donations:', error);
      return res.status(500).json({ error: 'Failed to fetch donations' });
    }

    if (!donations || donations.length === 0) {
      return res.status(404).json({ error: 'No crypto donations found' });
    }

    // Parse and format donation data
    const formattedDonations = donations.map((donation: any) => {
      const notes = typeof donation.notes === 'string'
        ? JSON.parse(donation.notes)
        : donation.notes || {};

      const verification = notes.verification || {};

      return {
        donationId: donation.id,
        createdAt: donation.created_at,
        processedAt: donation.processed_at || 'N/A',
        status: donation.status,
        amount: donation.amount,
        currency: donation.currency,
        network: notes.network || 'N/A',
        cryptoAmount: notes.cryptoAmount || 'N/A',
        cryptoPrice: notes.cryptoPrice || 'N/A',

        // Transaction details
        txHash: donation.transaction_id || notes.txHash || 'N/A',
        senderAddress: notes.senderAddress || verification.fromAddress || 'N/A',
        receiverAddress: notes.walletAddress || verification.toAddress || 'N/A',
        blockHeight: notes.blockHeight || verification.blockHeight || 'N/A',
        timestamp: notes.timestamp || verification.timestamp || 'N/A',
        networkFee: notes.networkFee || 'N/A',

        // Verification details
        verified: verification.verified ? 'Yes' : 'No',
        confirmations: verification.confirmations || 0,
        verifiedAt: verification.verifiedAt || 'N/A',
        verifiedAmount: verification.verifiedAmount || 'N/A',
        requiresManualReview: verification.requiresManualReview ? 'Yes' : 'No',
        verificationError: verification.error || 'N/A',

        // Additional info
        campaignId: donation.campaign_id || 'N/A',
        memo: notes.memo || 'N/A',
        message: notes.message || 'N/A',
        source: notes.source || 'N/A',
        category: donation.category || 'general',
      };
    });

    if (format === 'json') {
      // Return JSON format
      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="crypto-donations-${new Date().toISOString().split('T')[0]}.json"`
      );
      return res.status(200).json({
        exportDate: new Date().toISOString(),
        totalDonations: formattedDonations.length,
        donations: formattedDonations,
      });
    } else {
      // Return CSV format
      const csvHeaders = [
        'Donation ID',
        'Created At',
        'Processed At',
        'Status',
        'Amount (USD)',
        'Currency',
        'Network',
        'Crypto Amount',
        'Crypto Price',
        'Transaction Hash',
        'Sender Address',
        'Receiver Address',
        'Block Height',
        'Timestamp',
        'Network Fee',
        'Verified',
        'Confirmations',
        'Verified At',
        'Verified Amount',
        'Requires Manual Review',
        'Verification Error',
        'Campaign ID',
        'Memo',
        'Message',
        'Source',
        'Category',
      ];

      const csvRows = formattedDonations.map((d: any) => [
        d.donationId,
        d.createdAt,
        d.processedAt,
        d.status,
        d.amount,
        d.currency,
        d.network,
        d.cryptoAmount,
        d.cryptoPrice,
        d.txHash,
        d.senderAddress,
        d.receiverAddress,
        d.blockHeight,
        d.timestamp,
        d.networkFee,
        d.verified,
        d.confirmations,
        d.verifiedAt,
        d.verifiedAmount,
        d.requiresManualReview,
        d.verificationError,
        d.campaignId,
        d.memo,
        `"${(d.message || '').replace(/"/g, '""')}"`, // Escape quotes in message
        d.source,
        d.category,
      ]);

      const csv = [
        csvHeaders.join(','),
        ...csvRows.map((row: any[]) => row.join(',')),
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="crypto-donations-${new Date().toISOString().split('T')[0]}.csv"`
      );
      return res.status(200).send(csv);
    }
  } catch (error) {
    console.error('Error exporting crypto donations:', error);
    return res.status(500).json({
      error: 'Failed to export crypto donations',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
