import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { CheckCircle2, Clock3, RefreshCw, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrencyAmount } from '@/lib/currency';

interface CurrencyTotal { currency: string; completed: number; pending: number; monthlyCompleted: number }
interface Stats {
  totalsByCurrency: CurrencyTotal[];
  pendingCount: number;
  completedCount: number;
  monthlyCompletedCount: number;
  donorCount: number;
  successRate: number;
  donationTrends: Array<{ month: string; count: number; donors: number }>;
  donationMethods: Array<{ name: string; value: number; color: string }>;
}

export default function DonationAnalytics() {
  const { session, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAnalytics = useCallback(async () => {
    if (authLoading) return;
    if (!session?.access_token) {
      setError('Your admin session is unavailable. Please sign in again.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${session.access_token}` } });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error || 'Unable to load donation analytics');
      setStats(payload.data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load donation analytics');
    } finally { setLoading(false); }
  }, [authLoading, session?.access_token]);

  useEffect(() => { void loadAnalytics(); }, [loadAnalytics]);

  const paymentMethods = useMemo(() => (stats?.donationMethods ?? []).filter(item => item.value > 0), [stats]);

  return (
    <>
      <Head><title>Donation Analytics | Saintlammy Foundation Admin</title></Head>
      <AdminLayout title="Donation Analytics">
        <div className="space-y-6">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-sm font-medium uppercase tracking-[0.16em] text-accent-300">Verified operational data</p><h2 className="mt-2 text-3xl font-semibold text-white">Donation performance</h2><p className="mt-2 max-w-2xl text-sm text-gray-400">Amounts stay separated by currency so unlike values are never added together.</p></div>
            <button type="button" onClick={() => void loadAnalytics()} disabled={loading} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-600 px-4 text-sm font-medium text-gray-100 hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 disabled:cursor-wait disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />Refresh</button>
          </header>
          {error && <div role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Completed records', value: stats ? stats.completedCount : 'Unavailable', icon: CheckCircle2, color: 'text-green-300' },
              { label: 'Pending records', value: stats ? stats.pendingCount : 'Unavailable', icon: Clock3, color: 'text-amber-300' },
              { label: 'Unique donors', value: stats ? stats.donorCount : 'Unavailable', icon: Users, color: 'text-blue-300' },
              { label: 'Completion rate', value: stats ? `${stats.successRate.toFixed(1)}%` : 'Unavailable', icon: CheckCircle2, color: 'text-accent-300' }
            ].map(card => <div key={card.label} className="rounded-xl border border-gray-700 bg-gray-800 p-5"><card.icon className={`h-5 w-5 ${card.color}`} aria-hidden="true" /><p className="mt-3 text-3xl font-semibold text-white">{loading ? '—' : card.value}</p><p className="mt-1 text-sm text-gray-400">{card.label}</p></div>)}
          </div>

          <section className="rounded-xl border border-gray-700 bg-gray-800 p-5 sm:p-6"><h2 className="text-lg font-semibold text-white">Totals by currency</h2><div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{stats?.totalsByCurrency?.length ? stats.totalsByCurrency.map(total => <div key={total.currency} className="rounded-lg border border-gray-700 bg-gray-900 p-4"><p className="text-xs font-semibold uppercase tracking-widest text-gray-500">{total.currency}</p><dl className="mt-3 space-y-2 text-sm"><div className="flex justify-between gap-3"><dt className="text-gray-400">Completed</dt><dd className="font-medium text-white">{formatCurrencyAmount(total.completed, total.currency)}</dd></div><div className="flex justify-between gap-3"><dt className="text-gray-400">Pending</dt><dd className="font-medium text-amber-200">{formatCurrencyAmount(total.pending, total.currency)}</dd></div><div className="flex justify-between gap-3"><dt className="text-gray-400">This month</dt><dd className="font-medium text-accent-200">{formatCurrencyAmount(total.monthlyCompleted, total.currency)}</dd></div></dl></div>) : <p className="text-sm text-gray-400">No donation totals are available yet.</p>}</div></section>

          <div className="grid gap-6 xl:grid-cols-2">
            <section className="rounded-xl border border-gray-700 bg-gray-800 p-5 sm:p-6"><h2 className="text-lg font-semibold text-white">Completed donation records</h2><p className="mt-1 text-sm text-gray-400">Six-month record count; this chart does not combine currencies.</p><div className="mt-5 h-72" aria-label="Completed donation record count by month"><ResponsiveContainer width="100%" height="100%"><BarChart data={stats?.donationTrends || []}><CartesianGrid strokeDasharray="3 3" stroke="#374151" /><XAxis dataKey="month" stroke="#9CA3AF" /><YAxis allowDecimals={false} stroke="#9CA3AF" /><Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', color: '#fff' }} /><Bar dataKey="count" name="Donations" fill="#34d399" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></section>
            <section className="rounded-xl border border-gray-700 bg-gray-800 p-5 sm:p-6"><h2 className="text-lg font-semibold text-white">Payment method share</h2><p className="mt-1 text-sm text-gray-400">Percentage of completed donation records.</p><div className="mt-5 space-y-4">{paymentMethods.length ? paymentMethods.map(method => <div key={method.name}><div className="flex justify-between text-sm"><span className="text-gray-300">{method.name}</span><span className="font-medium text-white">{method.value}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-700"><div className="h-full rounded-full" style={{ width: `${method.value}%`, backgroundColor: method.color }} /></div></div>) : <p className="text-sm text-gray-400">No completed payment-method data is available.</p>}</div></section>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
