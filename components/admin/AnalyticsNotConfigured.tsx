import Head from 'next/head';
import Link from 'next/link';
import { BarChart3, Settings } from 'lucide-react';
import AdminLayout from './AdminLayout';

export default function AnalyticsNotConfigured() {
  return (
    <>
      <Head><title>External Analytics | Saintlammy Foundation Admin</title></Head>
      <AdminLayout title="External Analytics">
        <div className="mx-auto max-w-3xl rounded-2xl border border-gray-700 bg-gray-800 p-8 sm:p-10">
          <BarChart3 className="h-9 w-9 text-accent-300" aria-hidden="true" />
          <p className="mt-6 text-sm font-medium uppercase tracking-[0.16em] text-accent-300">Integration required</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Website analytics are not configured</h2>
          <p className="mt-4 max-w-2xl leading-7 text-gray-300">This dashboard will not invent visitor counts, conversion rates, scheduled reports, or device data. Connect a supported analytics provider before relying on these metrics.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/admin/analytics" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-accent-500 px-5 text-sm font-semibold text-gray-950 hover:bg-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300">View donation analytics</Link>
            <Link href="/admin/settings" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-600 px-5 text-sm font-medium text-gray-100 hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"><Settings className="h-4 w-4" aria-hidden="true" />System readiness</Link>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
