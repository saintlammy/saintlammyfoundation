import { NextApiRequest, NextApiResponse } from 'next';
import { donationService } from '@/lib/donationService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers for client-side requests
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { donationIds } = req.body;

    console.log('🗑️ Bulk delete request received for donation IDs:', donationIds);

    if (!donationIds || !Array.isArray(donationIds) || donationIds.length === 0) {
      console.error('❌ Invalid donation IDs:', donationIds);
      return res.status(400).json({ error: 'Invalid donation IDs provided' });
    }

    // Delete donations
    const result = await donationService.bulkDeleteDonations(donationIds);

    console.log('✅ Bulk delete result:', result);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} donation(s)`,
        deletedCount: result.deletedCount
      });
    } else {
      console.error('❌ Delete failed:', result.error);
      return res.status(500).json({
        error: 'Failed to delete donations',
        message: result.error
      });
    }
  } catch (error) {
    console.error('❌ Error in bulk delete API:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
