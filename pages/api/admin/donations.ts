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
      const { donationId, status, txHash, notes } = req.body;

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

      // If notes provided (manual confirmation), update them
      if (notes && status === 'completed') {
        await donationService.updateDonationNotes(donationId, {
          confirmations: 1,
          error: `Manual confirmation: ${notes}. Confirmed at ${new Date().toISOString()} by admin.`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Donation status updated successfully'
      });

    } else if (req.method === 'DELETE') {
      // Delete donation (for pending donations that can't be verified)
      const { donationId } = req.query;

      if (!donationId || typeof donationId !== 'string') {
        return res.status(400).json({
          error: 'Missing required parameter: donationId'
        });
      }

      try {
        // Get donation details first to check if it's safe to delete
        const donation = await donationService.getDonationById(donationId);

        if (!donation) {
          return res.status(404).json({
            error: 'Donation not found'
          });
        }

        // Only allow deletion of pending or failed donations
        if (donation.status === 'completed') {
          return res.status(403).json({
            error: 'Cannot delete completed donations. Only pending or failed donations can be removed.',
            donation: {
              id: donation.id,
              status: donation.status,
              amount: donation.amount
            }
          });
        }

        // Delete the donation
        await donationService.deleteDonation(donationId);

        return res.status(200).json({
          success: true,
          message: 'Donation deleted successfully',
          deletedDonation: {
            id: donation.id,
            amount: donation.amount,
            status: donation.status
          }
        });
      } catch (deleteError) {
        console.error('Error deleting donation:', deleteError);
        return res.status(500).json({
          error: 'Failed to delete donation',
          message: deleteError instanceof Error ? deleteError.message : 'Unknown error'
        });
      }

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