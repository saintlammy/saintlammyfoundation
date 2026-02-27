import { NextApiRequest, NextApiResponse } from 'next';
import { getTypedSupabaseClient } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = getTypedSupabaseClient();

    if (!client) {
      return res.status(500).json({ error: 'Database connection not available' });
    }

    // Fetch all donation-related options in parallel
    const [currenciesResult, paymentMethodsResult, donationTypesResult, presetAmountsResult] = await Promise.all([
      (client as any)
        .from('supported_currencies')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),

      (client as any)
        .from('payment_methods')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),

      (client as any)
        .from('donation_types')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),

      (client as any)
        .from('donation_preset_amounts')
        .select('*')
        .eq('is_active', true)
        .order('currency_code', { ascending: true })
        .order('sort_order', { ascending: true })
    ]);

    // Check for errors
    if (currenciesResult.error) {
      console.error('Error fetching currencies:', currenciesResult.error);
    }
    if (paymentMethodsResult.error) {
      console.error('Error fetching payment methods:', paymentMethodsResult.error);
    }
    if (donationTypesResult.error) {
      console.error('Error fetching donation types:', donationTypesResult.error);
    }
    if (presetAmountsResult.error) {
      console.error('Error fetching preset amounts:', presetAmountsResult.error);
    }

    // Group preset amounts by currency
    const presetAmountsByCurrency: Record<string, any[]> = {};
    (presetAmountsResult.data || []).forEach((preset: any) => {
      if (!presetAmountsByCurrency[preset.currency_code]) {
        presetAmountsByCurrency[preset.currency_code] = [];
      }
      presetAmountsByCurrency[preset.currency_code].push(preset);
    });

    return res.status(200).json({
      currencies: currenciesResult.data || [],
      paymentMethods: paymentMethodsResult.data || [],
      donationTypes: donationTypesResult.data || [],
      presetAmounts: presetAmountsByCurrency
    });
  } catch (error) {
    console.error('Donation options API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
