import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2, CircleAlert, Clock3, Download, Heart, RefreshCw, Search, Trash2 } from 'lucide-react';
import { formatCurrencyAmount, formatDateTime } from '@/lib/currency';

interface DonationRecord {
  id: string;
  amount: number | string;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  payment_method?: string;
  donor_name?: string;
  donor_email?: string;
  transaction_id?: string;
  reference?: string;
  created_at: string;
  category?: string;
}

interface DonationStats {
  totalDonations: number;
  totalDonors: number;
  donationsByStatus: Record<string, number>;
  successRate?: number;
  totalsByCurrency?: Array<{ currency: string; completed: number; pending: number }>;
}

const formatBreakdown = (totals: DonationStats['totalsByCurrency'], key: 'completed' | 'pending') => {
  const values = (totals || []).filter((item) => item[key] > 0);
  if (values.length === 0) return 'No recorded amount';
  return values.map((item) => formatCurrencyAmount(item[key], item.currency)).join(' · ');
};

const DonationsManagement: React.FC = () => {
  const { session } = useAuth();
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [method, setMethod] = useState('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const authHeaders = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined;

  const loadDonations = useCallback(async (quiet = false) => {
    if (!session?.access_token) {
      setLoading(false);
      return;
    }
    quiet ? setRefreshing(true) : setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams({ limit: '100' });
      if (status !== 'all') query.set('status', status);
      if (method !== 'all') query.set('paymentMethod', method);
      const [recordsResponse, statsResponse] = await Promise.all([
        fetch(`/api/admin/donations?${query.toString()}`, { headers: { Authorization: `Bearer ${session.access_token}` } }),
        fetch('/api/admin/donations?stats=true', { headers: { Authorization: `Bearer ${session.access_token}` } })
      ]);
      const [recordsResult, statsResult] = await Promise.all([recordsResponse.json(), statsResponse.json()]);
      if (!recordsResponse.ok) throw new Error(recordsResult.message || recordsResult.error || 'Unable to load donations');
      if (!statsResponse.ok) throw new Error(statsResult.message || statsResult.error || 'Unable to load donation totals');
      setDonations(recordsResult.data?.donations || []);
      setStats(statsResult.data || null);
      setSelected(new Set());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load donations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [method, session?.access_token, status]);

  useEffect(() => {
    void loadDonations();
  }, [loadDonations]);

  const visibleDonations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return donations;
    return donations.filter((donation) => [
      donation.id,
      donation.donor_name,
      donation.donor_email,
      donation.transaction_id,
      donation.reference,
      donation.currency,
      donation.payment_method
    ].some((value) => String(value || '').toLowerCase().includes(query)));
  }, [donations, search]);

  const selectableDonations = useMemo(
    () => visibleDonations.filter((donation) => donation.status !== 'completed'),
    [visibleDonations]
  );
  const selectableIds = useMemo(
    () => new Set(selectableDonations.map((donation) => donation.id)),
    [selectableDonations]
  );

  useEffect(() => {
    setSelected((current) => {
      const next = new Set(Array.from(current).filter((id) => selectableIds.has(id)));
      return next.size === current.size ? current : next;
    });
  }, [selectableIds]);

  const toggleSelected = (id: string) => {
    setSelected((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(selected.size > 0 && selected.size === selectableDonations.length
      ? new Set()
      : new Set(selectableDonations.map((donation) => donation.id)));
  };

  const deleteSelected = async () => {
    if (selected.size === 0 || !session?.access_token) return;
    if (!window.confirm(`Permanently delete ${selected.size} pending or failed donation record${selected.size === 1 ? '' : 's'}? This cannot be undone.`)) return;
    setDeleting(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/donations/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ donationIds: Array.from(selected) })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || 'Unable to delete donations');
      const deletedCount = typeof result.deletedCount === 'number' ? result.deletedCount : selected.size;
      setNotice(`${deletedCount} donation record${deletedCount === 1 ? '' : 's'} deleted.`);
      await loadDonations(true);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete donations');
    } finally {
      setDeleting(false);
    }
  };

  const exportCrypto = async (format: 'csv' | 'json') => {
    if (!session?.access_token) return;
    setExporting(true);
    setError('');
    setNotice('');
    try {
      const query = new URLSearchParams({ format });
      if (status !== 'all') query.set('status', status);
      const response = await fetch(`/api/donations/export-crypto?${query.toString()}`, { headers: authHeaders });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || result.error || 'Unable to export crypto donations');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `crypto-donations-${new Date().toISOString().slice(0, 10)}.${format}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice(`Crypto donation ${format.toUpperCase()} export downloaded.`);
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : 'Unable to export donations');
    } finally {
      setExporting(false);
    }
  };

  const statusStyle = (donationStatus: string) => {
    if (donationStatus === 'completed') return 'bg-emerald-950/70 text-emerald-200';
    if (donationStatus === 'pending') return 'bg-amber-950/70 text-amber-200';
    return 'bg-red-950/70 text-red-200';
  };

  return (
    <>
      <Head><title>Donations - Saintlammy Foundation Admin</title><meta name="description" content="Review and manage donation records" /></Head>
      <AdminLayout title="Donations">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl"><h2 className="text-xl font-semibold text-white">Donation records</h2><p className="mt-2 text-sm leading-6 text-gray-300">Amounts remain in their recorded currencies. No exchange rate is assumed.</p></div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => exportCrypto('csv')} disabled={exporting} className="flex min-h-11 items-center gap-2 rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"><Download className="h-4 w-4" aria-hidden="true" />Export crypto CSV</button>
              <button type="button" onClick={() => loadDonations(true)} disabled={refreshing} className="flex min-h-11 items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-600 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} aria-hidden="true" />Refresh</button>
            </div>
          </div>

          {error && <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-100"><CircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />{error}</div>}
          {notice && <div role="status" className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100"><CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />{notice}</div>}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-gray-700 bg-gray-800 p-5"><p className="text-sm text-gray-300">Completed records</p><p className="mt-2 text-3xl font-semibold text-white">{stats?.totalDonations || 0}</p><p className="mt-2 text-xs leading-5 text-gray-400">{formatBreakdown(stats?.totalsByCurrency, 'completed')}</p></div>
            <div className="rounded-xl border border-gray-700 bg-gray-800 p-5"><p className="text-sm text-gray-300">Pending records</p><p className="mt-2 text-3xl font-semibold text-white">{stats?.donationsByStatus?.pending || 0}</p><p className="mt-2 text-xs leading-5 text-gray-400">{formatBreakdown(stats?.totalsByCurrency, 'pending')}</p></div>
            <div className="rounded-xl border border-gray-700 bg-gray-800 p-5"><p className="text-sm text-gray-300">Donor profiles</p><p className="mt-2 text-3xl font-semibold text-white">{stats?.totalDonors || 0}</p><p className="mt-2 text-xs text-gray-400">Distinct stored donor records</p></div>
            <div className="rounded-xl border border-gray-700 bg-gray-800 p-5"><p className="text-sm text-gray-300">Completion rate</p><p className="mt-2 text-3xl font-semibold text-white">{(stats?.successRate || 0).toFixed(1)}%</p><p className="mt-2 text-xs text-gray-400">Completed records ÷ all records</p></div>
          </div>

          <div className="rounded-xl border border-gray-700 bg-gray-800">
            <div className="grid gap-3 border-b border-gray-700 p-4 md:grid-cols-[minmax(0,1fr)_11rem_12rem_auto]">
              <div className="relative"><label htmlFor="donation-search" className="sr-only">Search the 100 loaded donation records</label><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" /><input id="donation-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the 100 loaded records" className="min-h-11 w-full rounded-lg border border-gray-600 bg-gray-900 py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/40" /></div>
              <div><label htmlFor="donation-status" className="sr-only">Filter by status</label><select id="donation-status" value={status} onChange={(event) => setStatus(event.target.value)} className="min-h-11 w-full rounded-lg border border-gray-600 bg-gray-900 px-3 text-sm text-white"><option value="all">All statuses</option><option value="completed">Completed</option><option value="pending">Pending</option><option value="failed">Failed</option><option value="refunded">Refunded</option></select></div>
              <div><label htmlFor="donation-method" className="sr-only">Filter by payment method</label><select id="donation-method" value={method} onChange={(event) => setMethod(event.target.value)} className="min-h-11 w-full rounded-lg border border-gray-600 bg-gray-900 px-3 text-sm text-white"><option value="all">All payment methods</option><option value="crypto">Cryptocurrency</option><option value="paypal">PayPal</option><option value="card">Card</option><option value="bank_transfer">Bank transfer</option></select></div>
              <button type="button" onClick={deleteSelected} disabled={selected.size === 0 || deleting} className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-red-500/40 px-4 text-sm font-medium text-red-200 hover:bg-red-950/50 disabled:cursor-not-allowed disabled:opacity-40"><Trash2 className="h-4 w-4" aria-hidden="true" />{deleting ? 'Deleting…' : `Delete selected${selected.size ? ` (${selected.size})` : ''}`}</button>
            </div>

            {loading ? <div className="py-16 text-center text-sm text-gray-300" role="status">Loading donation records…</div> : visibleDonations.length === 0 ? <div className="py-16 text-center"><Heart className="mx-auto h-10 w-10 text-gray-500" aria-hidden="true" /><p className="mt-3 text-sm text-gray-300">No donation records match these filters.</p></div> : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead className="bg-gray-900/60 text-left text-xs font-semibold uppercase tracking-wide text-gray-400"><tr><th className="px-4 py-3"><input type="checkbox" aria-label="Select all removable donations" checked={selectableDonations.length > 0 && selected.size === selectableDonations.length} onChange={toggleAll} /></th><th className="px-4 py-3">Donor</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Method</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Reference</th><th className="px-4 py-3">Received</th></tr></thead>
                  <tbody className="divide-y divide-gray-700">
                    {visibleDonations.map((donation) => <tr key={donation.id} className="text-sm text-gray-200 hover:bg-gray-700/30"><td className="px-4 py-4"><input type="checkbox" aria-label={`Select donation ${donation.id}`} disabled={donation.status === 'completed'} checked={selected.has(donation.id)} onChange={() => toggleSelected(donation.id)} /></td><td className="px-4 py-4"><p className="font-medium text-white">{donation.donor_name || 'Anonymous donor'}</p>{donation.donor_email && <p className="mt-1 text-xs text-gray-400">{donation.donor_email}</p>}</td><td className="px-4 py-4 font-medium text-white">{formatCurrencyAmount(Number(donation.amount) || 0, String(donation.currency || 'USD'))}</td><td className="px-4 py-4 capitalize">{(donation.payment_method || 'unknown').replace(/_/g, ' ')}</td><td className="px-4 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle(donation.status)}`}>{donation.status === 'completed' ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <Clock3 className="h-4 w-4" aria-hidden="true" />}{donation.status}</span></td><td className="max-w-52 px-4 py-4"><p className="truncate font-mono text-xs text-gray-300" title={donation.transaction_id || donation.reference || donation.id}>{donation.transaction_id || donation.reference || donation.id}</p></td><td className="px-4 py-4 text-gray-300">{formatDateTime(donation.created_at)}</td></tr>)}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default DonationsManagement;
