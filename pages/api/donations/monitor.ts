import { NextApiRequest, NextApiResponse } from 'next';
import { donationTracker } from '../../../lib/donationTracker';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  // CORS headers for real-time updates
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (method) {
      case 'GET': {
        const { action } = req.query;

        if (action === 'status') {
          // Get monitoring status
          const status = donationTracker.getMonitoringStatus();
          return res.status(200).json({
            success: true,
            data: status
          });
        }

        if (action === 'stats') {
          // Get real-time donation statistics
          const stats = await donationTracker.getRealTimeDonationStats();
          return res.status(200).json({
            success: true,
            data: stats
          });
        }

        if (action === 'check') {
          // Force check for new donations
          await donationTracker.checkForNewDonations();
          return res.status(200).json({
            success: true,
            message: 'Donation check completed'
          });
        }

        // Default: return both status and stats
        const [status, stats] = await Promise.all([
          donationTracker.getMonitoringStatus(),
          donationTracker.getRealTimeDonationStats()
        ]);

        return res.status(200).json({
          success: true,
          data: {
            monitoring: status,
            statistics: stats
          }
        });
      }

      case 'POST': {
        const { action, data } = req.body;

        if (action === 'start') {
          const intervalMinutes = data?.intervalMinutes || 5;
          await donationTracker.startMonitoring(intervalMinutes);

          return res.status(200).json({
            success: true,
            message: `Donation monitoring started (${intervalMinutes}min intervals)`
          });
        }

        if (action === 'stop') {
          donationTracker.stopMonitoring();
          return res.status(200).json({
            success: true,
            message: 'Donation monitoring stopped'
          });
        }

        if (action === 'check_transaction') {
          const { txHash, network } = data;
          if (!txHash || !network) {
            return res.status(400).json({
              success: false,
              error: 'txHash and network are required'
            });
          }

          await donationTracker.checkTransactionStatus(txHash, network);
          return res.status(200).json({
            success: true,
            message: `Transaction ${txHash} status check initiated`
          });
        }

        return res.status(400).json({
          success: false,
          error: 'Invalid action'
        });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
        return res.status(405).json({
          success: false,
          error: `Method ${method} not allowed`
        });
    }
  } catch (error) {
    console.error('Donation monitor API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}