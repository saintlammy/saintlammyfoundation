import { NextApiRequest, NextApiResponse } from 'next';
import { donationService } from '@/lib/donationService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Basic auth check (in production, use proper authentication)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // TODO: Validate JWT token or API key
    // For now, accept any bearer token

    if (req.method === 'GET') {
      const {
        page = '1',
        limit = '20',
        status,
        paymentMethod,
        startDate,
        endDate,
        stats = 'false'
      } = req.query;

      // If stats requested, return donation statistics
      if (stats === 'true') {
        const statistics = await donationService.getDonationStats();
        return res.status(200).json({
          success: true,
          data: statistics
        });
      }

      // Otherwise return paginated donations list
      const donations = await donationService.getDonations({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        status: status as string,
        paymentMethod: paymentMethod as string,
        startDate: startDate as string,
        endDate: endDate as string,
      });

      return res.status(200).json({
        success: true,
        data: donations
      });

    } else if (req.method === 'PUT') {
      // Update donation status
      const { donationId, status, txHash } = req.body;

      if (!donationId || !status) {
        return res.status(400).json({
          error: 'Missing required fields: donationId, status'
        });
      }

      const updated = await donationService.updateDonationStatus(donationId, status, txHash);

      if (!updated) {
        return res.status(500).json({
          error: 'Failed to update donation status'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Donation status updated successfully'
      });

    } else if (req.method === 'POST') {
      // Test database connection
      if (req.body.action === 'test-connection') {
        const isConnected = await donationService.testConnection();
        return res.status(200).json({
          success: true,
          connected: isConnected,
          message: isConnected ? 'Database connection successful' : 'Database connection failed'
        });
      }

      return res.status(400).json({
        error: 'Invalid action'
      });

    } else {
      return res.status(405).json({
        error: 'Method not allowed'
      });
    }

  } catch (error) {
    console.error('Admin donations API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}