import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2, CircleAlert, Database, KeyRound, Mail, Save, ShieldCheck, Wallet } from 'lucide-react';
import { formatDateTime } from '@/lib/currency';

interface OrganizationSettings {
  name: string;
  registrationNumber: string;
  primaryEmail: string;
  phone: string;
  address: string;
}

interface Capabilities {
  paypalConfigured: boolean;
  configuredWallets: number;
  donorEncryptionConfigured: boolean;
  emailSenderConfigured: boolean;
  databaseConfigured: boolean;
}

const emptyOrganization: OrganizationSettings = {
  name: 'Saintlammy Foundation',
  registrationNumber: '',
  primaryEmail: '',
  phone: '',
  address: ''
};

const AdminSettings: React.FC = () => {
  const { session, loading: authLoading } = useAuth();
  const [organization, setOrganization] = useState(emptyOrganization);
  const [capabilities, setCapabilities] = useState<Capabilities | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!session?.access_token) {
      setError('Your admin session is unavailable. Please sign in again.');
      setLoading(false);
      return;
    }
    const loadSettings = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/admin/settings', {
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || result.error || 'Unable to load settings');
        const data = result?.data;
        if (!data || typeof data !== 'object') throw new Error('Settings response is incomplete');
        setOrganization({
          ...emptyOrganization,
          ...(data.organization && typeof data.organization === 'object' ? data.organization : {})
        });
        setCapabilities(data.capabilities && typeof data.capabilities === 'object' ? data.capabilities : null);
        setUpdatedAt(typeof data.updatedAt === 'string' ? data.updatedAt : null);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load settings');
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [authLoading, session?.access_token]);

  const updateField = (field: keyof OrganizationSettings, value: string) => {
    setOrganization((current) => ({ ...current, [field]: value }));
    setNotice('');
  };

  const saveSettings = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session?.access_token) {
      setError('Your admin session is not ready. Please sign in again.');
      return;
    }
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ organization })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || 'Unable to save settings');
      setUpdatedAt(typeof result?.data?.updated_at === 'string' ? result.data.updated_at : new Date().toISOString());
      setNotice('Organization settings saved.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save settings');
    } finally {
      setSaving(false);
    }
  };

  const capabilityRows = capabilities ? [
    { label: 'Database service', ready: capabilities.databaseConfigured, detail: capabilities.databaseConfigured ? 'Server connection configured' : 'Missing server database configuration', icon: Database },
    { label: 'Donor data encryption', ready: capabilities.donorEncryptionConfigured, detail: capabilities.donorEncryptionConfigured ? 'Server encryption key configured' : 'Add ENCRYPTION_KEY before accepting personal donor data', icon: KeyRound },
    { label: 'PayPal payments', ready: capabilities.paypalConfigured, detail: capabilities.paypalConfigured ? 'Client and server credentials configured' : 'PayPal credentials are incomplete', icon: Wallet },
    { label: 'Crypto wallets', ready: capabilities.configuredWallets > 0, detail: `${capabilities.configuredWallets} wallet${capabilities.configuredWallets === 1 ? '' : 's'} configured`, icon: Wallet },
    { label: 'Foundation email', ready: capabilities.emailSenderConfigured, detail: capabilities.emailSenderConfigured ? 'Sender identity configured' : 'No email sender configured', icon: Mail }
  ] : [];

  return (
    <>
      <Head>
        <title>Settings - Saintlammy Foundation Admin</title>
        <meta name="description" content="Organization settings and verified system configuration" />
      </Head>

      <AdminLayout title="Settings">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="max-w-3xl">
            <h2 className="text-xl font-semibold text-white">Organization and system settings</h2>
            <p className="mt-2 text-sm leading-6 text-gray-300">
              Edit information owned by the foundation and review which production services are actually configured. Credentials remain hidden and cannot be changed from this page.
            </p>
          </div>

          {error && (
            <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-100">
              <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}
          {notice && (
            <div role="status" className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100">
              <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{notice}</span>
            </div>
          )}

          <form onSubmit={saveSettings} className="rounded-xl border border-gray-700 bg-gray-800 p-5 sm:p-6">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Organization information</h3>
                <p className="mt-1 text-sm text-gray-300">Blank optional fields are never replaced with sample data.</p>
              </div>
              {updatedAt && <p className="text-xs text-gray-400">Last saved {formatDateTime(updatedAt)}</p>}
            </div>

            {loading ? (
              <div className="py-14 text-center text-sm text-gray-300" role="status">Loading organization settings…</div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="organization-name" className="mb-2 block text-sm font-medium text-gray-200">Organization name</label>
                  <input id="organization-name" required maxLength={160} value={organization.name} onChange={(event) => updateField('name', event.target.value)} className="min-h-11 w-full rounded-lg border border-gray-600 bg-gray-900 px-4 py-2 text-white outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/40" />
                </div>
                <div>
                  <label htmlFor="registration-number" className="mb-2 block text-sm font-medium text-gray-200">Registration number <span className="font-normal text-gray-400">(optional)</span></label>
                  <input id="registration-number" maxLength={100} value={organization.registrationNumber} onChange={(event) => updateField('registrationNumber', event.target.value)} placeholder="Enter the official registration number" className="min-h-11 w-full rounded-lg border border-gray-600 bg-gray-900 px-4 py-2 text-white placeholder:text-gray-500 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/40" />
                </div>
                <div>
                  <label htmlFor="primary-email" className="mb-2 block text-sm font-medium text-gray-200">Primary email <span className="font-normal text-gray-400">(optional)</span></label>
                  <input id="primary-email" type="email" maxLength={254} value={organization.primaryEmail} onChange={(event) => updateField('primaryEmail', event.target.value)} placeholder="name@example.org" className="min-h-11 w-full rounded-lg border border-gray-600 bg-gray-900 px-4 py-2 text-white placeholder:text-gray-500 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/40" />
                </div>
                <div>
                  <label htmlFor="organization-phone" className="mb-2 block text-sm font-medium text-gray-200">Phone <span className="font-normal text-gray-400">(optional)</span></label>
                  <input id="organization-phone" type="tel" maxLength={50} value={organization.phone} onChange={(event) => updateField('phone', event.target.value)} placeholder="International format preferred" className="min-h-11 w-full rounded-lg border border-gray-600 bg-gray-900 px-4 py-2 text-white placeholder:text-gray-500 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/40" />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="organization-address" className="mb-2 block text-sm font-medium text-gray-200">Address <span className="font-normal text-gray-400">(optional)</span></label>
                  <textarea id="organization-address" rows={3} maxLength={500} value={organization.address} onChange={(event) => updateField('address', event.target.value)} placeholder="Enter the official contact address" className="w-full rounded-lg border border-gray-600 bg-gray-900 px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/40" />
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end border-t border-gray-700 pt-5">
              <button type="submit" disabled={loading || saving} className="flex min-h-11 items-center gap-2 rounded-lg bg-accent-500 px-5 py-2.5 font-medium text-white transition-colors hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 disabled:cursor-not-allowed disabled:opacity-50">
                <Save className="h-5 w-5" aria-hidden="true" />
                {saving ? 'Saving…' : 'Save organization settings'}
              </button>
            </div>
          </form>

          <section aria-labelledby="system-readiness" className="rounded-xl border border-gray-700 bg-gray-800 p-5 sm:p-6">
            <div className="mb-5">
              <h3 id="system-readiness" className="text-lg font-semibold text-white">System readiness</h3>
              <p className="mt-1 text-sm text-gray-300">These statuses are read from server configuration, not editable switches.</p>
            </div>
            {loading ? (
              <div className="py-12 text-center text-sm text-gray-300" role="status">Checking production services…</div>
            ) : (
              <div className="divide-y divide-gray-700">
                {capabilityRows.map((capability) => (
                  <div key={capability.label} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-gray-300"><capability.icon className="h-5 w-5" aria-hidden="true" /></div>
                      <div className="min-w-0">
                        <p className="font-medium text-white">{capability.label}</p>
                        <p className="mt-1 text-sm text-gray-300">{capability.detail}</p>
                      </div>
                    </div>
                    <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${capability.ready ? 'bg-emerald-950/70 text-emerald-200' : 'bg-amber-950/70 text-amber-200'}`}>
                      {capability.ready ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <CircleAlert className="h-4 w-4" aria-hidden="true" />}
                      {capability.ready ? 'Configured' : 'Needs attention'}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 flex flex-col gap-3 border-t border-gray-700 pt-5 text-sm text-gray-300 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-accent-300" aria-hidden="true" />Admin roles are verified against active database profiles.</p>
              <Link href="/admin/wallet-management" className="font-medium text-accent-300 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400">Review wallet configuration</Link>
            </div>
          </section>

          <section className="rounded-xl border border-gray-700 bg-gray-800 p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-white">Backups and external integrations</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-300">
              This application does not create or verify database backups, and it does not claim third-party integrations that are not present in server configuration. Manage Supabase backups and provider credentials in their respective service dashboards.
            </p>
          </section>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminSettings;
