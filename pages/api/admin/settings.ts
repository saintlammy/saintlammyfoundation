import type { NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { withAdminAuth, type AdminApiRequest } from '@/lib/serverAuth';

const DEFAULT_ORGANIZATION = {
  name: 'Saintlammy Foundation',
  registrationNumber: '',
  primaryEmail: '',
  phone: '',
  address: ''
};

function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

async function handler(req: AdminApiRequest, res: NextApiResponse) {
  if (!supabaseAdmin) {
    return res.status(503).json({ error: 'Database connection unavailable' });
  }

  if (req.method === 'GET') {
    const { data, error } = await (supabaseAdmin as any)
      .from('admin_settings')
      .select('value, updated_at')
      .eq('key', 'organization')
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: 'Unable to load organization settings', message: error.message });
    }

    const walletKeys = [
      process.env.NEXT_PUBLIC_BTC_WALLET_ADDRESS,
      process.env.NEXT_PUBLIC_ETH_WALLET_ADDRESS,
      process.env.NEXT_PUBLIC_BNB_WALLET_ADDRESS,
      process.env.NEXT_PUBLIC_SOL_WALLET_ADDRESS,
      process.env.NEXT_PUBLIC_XRP_WALLET_ADDRESS,
      process.env.NEXT_PUBLIC_TRX_WALLET_ADDRESS || process.env.NEXT_PUBLIC_TRON_WALLET_ADDRESS
    ];

    return res.status(200).json({
      success: true,
      data: {
        organization: { ...DEFAULT_ORGANIZATION, ...(data?.value || {}) },
        updatedAt: data?.updated_at || null,
        capabilities: {
          paypalConfigured: Boolean(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET),
          configuredWallets: walletKeys.filter(Boolean).length,
          donorEncryptionConfigured: Boolean(process.env.ENCRYPTION_KEY),
          emailSenderConfigured: Boolean(process.env.FOUNDATION_EMAIL),
          databaseConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
        }
      }
    });
  }

  if (req.method === 'PUT') {
    const organization = req.body?.organization || {};
    const cleanOrganization = {
      name: cleanText(organization.name, 160),
      registrationNumber: cleanText(organization.registrationNumber, 100),
      primaryEmail: cleanText(organization.primaryEmail, 254).toLowerCase(),
      phone: cleanText(organization.phone, 50),
      address: cleanText(organization.address, 500)
    };

    if (!cleanOrganization.name) {
      return res.status(400).json({ error: 'Organization name is required' });
    }
    if (cleanOrganization.primaryEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanOrganization.primaryEmail)) {
      return res.status(400).json({ error: 'Enter a valid primary email address' });
    }

    const { data, error } = await (supabaseAdmin as any)
      .from('admin_settings')
      .upsert({
        key: 'organization',
        value: cleanOrganization,
        updated_at: new Date().toISOString(),
        updated_by: req.adminUser?.id || null
      }, { onConflict: 'key' })
      .select('value, updated_at')
      .single();

    if (error) {
      return res.status(500).json({ error: 'Unable to save organization settings', message: error.message });
    }

    return res.status(200).json({ success: true, data });
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  return res.status(405).json({ error: 'Method not allowed' });
}

export default withAdminAuth(handler);
