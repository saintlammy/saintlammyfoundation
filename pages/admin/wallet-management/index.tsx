import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2, CircleAlert, Copy, RefreshCw, Search, ShieldCheck, Wallet } from 'lucide-react';

interface ConfiguredWallet {
  network: string;
  label: string;
  address: string | null;
  destinationTag: string | null;
  configured: boolean;
}

const WalletManagement: React.FC = () => {
  const { session, loading: authLoading } = useAuth();
  const [wallets, setWallets] = useState<ConfiguredWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');

  const loadWallets = useCallback(async () => {
    if (authLoading) return;
    if (!session?.access_token) {
      setError('Your admin session is unavailable. Please sign in again.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/wallets', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || 'Unable to load wallet configuration');
      setWallets(result.data || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load wallet configuration');
      setWallets([]);
    } finally {
      setLoading(false);
    }
  }, [authLoading, session?.access_token]);

  useEffect(() => {
    void loadWallets();
  }, [loadWallets]);

  const visibleWallets = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return wallets;
    return wallets.filter((wallet) => `${wallet.label} ${wallet.network} ${wallet.address || ''}`.toLowerCase().includes(query));
  }, [search, wallets]);

  const configuredCount = wallets.filter((wallet) => wallet.configured).length;

  const copyValue = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setNotice(`${label} copied.`);
      window.setTimeout(() => setNotice(''), 2500);
    } catch {
      setError('The browser could not copy that value. Select it manually instead.');
    }
  };

  return (
    <>
      <Head>
        <title>Wallet Configuration - Saintlammy Foundation Admin</title>
        <meta name="description" content="Review configured cryptocurrency donation addresses" />
      </Head>
      <AdminLayout title="Wallet Configuration">
        <div className="mx-auto max-w-6xl space-y-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-xl font-semibold text-white">Donation wallet addresses</h2>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                Review the public addresses supplied through production environment variables. This dashboard never creates wallets, stores private keys, or keeps seed phrases in the browser.
              </p>
            </div>
            <button type="button" onClick={loadWallets} disabled={loading} className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 disabled:opacity-50">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />Refresh configuration
            </button>
          </div>

          {error && <div role="alert" className="rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-100">{error}</div>}
          {notice && <div role="status" className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100">{notice}</div>}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-700 bg-gray-800 p-5">
              <p className="text-sm text-gray-300">Configured networks</p>
              <p className="mt-2 text-3xl font-semibold text-white">{configuredCount}<span className="text-lg font-normal text-gray-400"> / {wallets.length}</span></p>
            </div>
            <div className="rounded-xl border border-gray-700 bg-gray-800 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-6 w-6 text-accent-300" aria-hidden="true" />
                <div><p className="font-medium text-white">Custody stays external</p><p className="mt-1 text-sm leading-6 text-gray-300">Generate and secure wallets with a qualified custody provider, then update the deployment environment.</p></div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-700 bg-gray-800">
            <div className="flex flex-col gap-4 border-b border-gray-700 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div><h3 className="font-semibold text-white">Network configuration</h3><p className="mt-1 text-sm text-gray-300">Only configured addresses can receive donations.</p></div>
              <div className="relative w-full sm:w-72">
                <label htmlFor="wallet-search" className="sr-only">Search wallet configuration</label>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input id="wallet-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search network or address" className="min-h-11 w-full rounded-lg border border-gray-600 bg-gray-900 py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/40" />
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center text-sm text-gray-300" role="status">Loading wallet configuration…</div>
            ) : visibleWallets.length === 0 ? (
              <div className="py-16 text-center"><Wallet className="mx-auto h-10 w-10 text-gray-500" aria-hidden="true" /><p className="mt-3 text-sm text-gray-300">{search.trim() ? 'No wallet configuration matches this search.' : 'No wallet networks are configured for this environment.'}</p></div>
            ) : (
              <div className="divide-y divide-gray-700">
                {visibleWallets.map((wallet) => (
                  <div key={wallet.network} className="grid gap-4 p-5 lg:grid-cols-[12rem_minmax(0,1fr)_auto] lg:items-center">
                    <div><p className="font-medium text-white">{wallet.label}</p><p className="mt-1 text-xs uppercase tracking-wide text-gray-400">{wallet.network}</p></div>
                    <div className="min-w-0">
                      {wallet.address ? (
                        <><p className="break-all font-mono text-sm text-gray-200">{wallet.address}</p>{wallet.destinationTag && <p className="mt-2 text-sm text-amber-200">Destination tag: <span className="font-mono">{wallet.destinationTag}</span></p>}</>
                      ) : <p className="text-sm text-gray-400">No production address configured</p>}
                    </div>
                    <div className="flex items-center gap-2 lg:justify-end">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${wallet.configured ? 'bg-emerald-950/70 text-emerald-200' : 'bg-amber-950/70 text-amber-200'}`}>
                        {wallet.configured ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <CircleAlert className="h-4 w-4" aria-hidden="true" />}{wallet.configured ? 'Configured' : 'Missing'}
                      </span>
                      {wallet.address && <button type="button" onClick={() => copyValue(wallet.address!, `${wallet.label} address`)} aria-label={`Copy ${wallet.label} address`} className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"><Copy className="h-4 w-4" aria-hidden="true" /></button>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-950/25 p-5 text-sm leading-6 text-amber-100">
            Missing addresses are intentionally blank. The application no longer substitutes sample or placeholder wallets. Update Netlify environment variables and redeploy, then refresh this page.
            <Link href="/admin/settings" className="ml-1 font-semibold underline underline-offset-4">Review system readiness</Link>.
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default WalletManagement;
