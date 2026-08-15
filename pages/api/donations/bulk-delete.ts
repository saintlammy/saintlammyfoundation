import { NextApiRequest, NextApiResponse } from 'next';
import { donationService } from '@/lib/donationService';
import { withAdminAuth } from '@/lib/serverAuth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { donationIds } = req.body;

    if (!donationIds || !Array.isArray(donationIds) || donationIds.length === 0) {
      return res.status(400).json({ error: 'Invalid donation IDs provided' });
    }

    if (donationIds.length > 100 || donationIds.some((id) => typeof id !== 'string' || id.length > 128)) {
      return res.status(400).json({ error: 'Donation IDs must be a list of at most 100 valid identifiers' });
    }

    // Delete donations
    const result = await donationService.bulkDeleteDonations(donationIds);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} donation(s)`,
        deletedCount: result.deletedCount
      });
    } else {
      return res.status(500).json({
        error: 'Failed to delete donations',
        message: result.error
      });
    }
  } catch (error) {
    console.error('Error in bulk delete API:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export default withAdminAuth(handler);
