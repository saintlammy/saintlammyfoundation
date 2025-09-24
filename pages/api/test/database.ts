import { NextApiRequest, NextApiResponse } from 'next';
import { donationService } from '../../../lib/donationService';
import { isSupabaseAvailable } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const results: any = {
    timestamp: new Date().toISOString(),
    supabaseAvailable: isSupabaseAvailable,
    tests: []
  };

  try {
    // Test 1: Check Supabase connection
    results.tests.push({
      name: 'Supabase Connection',
      status: isSupabaseAvailable ? 'PASS' : 'FAIL',
      message: isSupabaseAvailable ? 'Supabase client configured' : 'Supabase not available'
    });

    if (!isSupabaseAvailable) {
      return res.status(200).json({
        success: false,
        message: 'Database not available for testing',
        results
      });
    }

    // Test 2: Create a test donation
    try {
      const testDonationId = await donationService.storeCryptoDonation({
        amount: 25.50,
        currency: 'USD',
        network: 'ethereum',
        cryptoAmount: 0.01,
        cryptoPrice: 2550,
        walletAddress: '0x742d35Cc6634C0532925a3b8D97C3578b43Db34',
        donorName: 'Test Donor',
        donorEmail: 'test@example.com',
        message: 'Database integration test',
        source: 'database_test',
        category: 'general'
      });

      results.tests.push({
        name: 'Create Crypto Donation',
        status: 'PASS',
        message: `Created donation with ID: ${testDonationId}`,
        data: { donationId: testDonationId }
      });

      // Test 3: Update donation status
      try {
        await donationService.updateDonationStatus(
          testDonationId,
          'completed',
          '0x1234567890abcdef'
        );

        results.tests.push({
          name: 'Update Donation Status',
          status: 'PASS',
          message: 'Successfully updated donation status to completed'
        });
      } catch (error) {
        results.tests.push({
          name: 'Update Donation Status',
          status: 'FAIL',
          message: `Failed to update status: ${error instanceof Error ? error.message : error}`
        });
      }

      // Test 4: Retrieve donations
      try {
        const donations = await donationService.getDonations({ limit: 5 });

        results.tests.push({
          name: 'Retrieve Donations',
          status: 'PASS',
          message: `Retrieved ${donations.donations.length} donations`,
          data: {
            count: donations.donations.length,
            totalAmount: donations.totalAmount
          }
        });
      } catch (error) {
        results.tests.push({
          name: 'Retrieve Donations',
          status: 'FAIL',
          message: `Failed to retrieve donations: ${error instanceof Error ? error.message : error}`
        });
      }

      // Test 5: Get donation statistics
      try {
        const stats = await donationService.getDonationStats();

        results.tests.push({
          name: 'Get Donation Statistics',
          status: 'PASS',
          message: 'Successfully retrieved donation statistics',
          data: stats
        });
      } catch (error) {
        results.tests.push({
          name: 'Get Donation Statistics',
          status: 'FAIL',
          message: `Failed to get stats: ${error instanceof Error ? error.message : error}`
        });
      }

      // Test 6: Clean up test donation
      try {
        await donationService.deleteDonation(testDonationId);

        results.tests.push({
          name: 'Cleanup Test Data',
          status: 'PASS',
          message: 'Successfully removed test donation'
        });
      } catch (error) {
        results.tests.push({
          name: 'Cleanup Test Data',
          status: 'FAIL',
          message: `Failed to cleanup: ${error instanceof Error ? error.message : error}`
        });
      }

    } catch (error) {
      results.tests.push({
        name: 'Create Crypto Donation',
        status: 'FAIL',
        message: `Failed to create donation: ${error instanceof Error ? error.message : error}`
      });
    }

    // Calculate overall status
    const failedTests = results.tests.filter((t: any) => t.status === 'FAIL').length;
    const totalTests = results.tests.length;

    results.summary = {
      totalTests,
      passedTests: totalTests - failedTests,
      failedTests,
      overallStatus: failedTests === 0 ? 'PASS' : 'FAIL'
    };

    return res.status(200).json({
      success: failedTests === 0,
      message: `Database integration test ${failedTests === 0 ? 'passed' : 'failed'}`,
      results
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Database test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      results
    });
  }
}