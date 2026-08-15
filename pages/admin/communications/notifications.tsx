import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, CheckCircle2, CircleAlert, Plus, Search, Trash2, X } from 'lucide-react';

interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  category: string;
  priority: 'high' | 'medium' | 'low';
  read: boolean;
  created_at: string;
}

const NotificationsManagement: React.FC = () => {
  const { session } = useAuth();
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState({ title: '', message: '', type: 'info', category: 'general', priority: 'medium' });

  const authHeaders = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined;

  const loadNotifications = useCallback(async () => {
    if (!session?.access_token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/notifications?limit=100', { headers: { Authorization: `Bearer ${session.access_token}` } });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || 'Unable to load notifications');
      setNotifications(result.notifications || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load notifications');
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    if (!showComposer) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && !saving && setShowComposer(false);
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [saving, showComposer]);

  const visibleNotifications = useMemo(() => {
    const query = search.trim().toLowerCase();
    return notifications.filter((notification) => {
      const matchesType = type === 'all' || notification.type === type;
      const matchesSearch = !query || `${notification.title} ${notification.message} ${notification.category}`.toLowerCase().includes(query);
      return matchesType && matchesSearch;
    });
  }, [notifications, search, type]);

  const createNotification = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session?.access_token) return;
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(form)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || 'Unable to create notification');
      setForm({ title: '', message: '', type: 'info', category: 'general', priority: 'medium' });
      setShowComposer(false);
      setNotice('In-app notification published.');
      await loadNotifications();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Unable to create notification');
    } finally {
      setSaving(false);
    }
  };

  const deleteNotification = async (notification: NotificationRecord) => {
    if (!session?.access_token || !window.confirm(`Delete “${notification.title}”?`)) return;
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/notifications?id=${notification.id}`, { method: 'DELETE', headers: authHeaders });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || result.error || 'Unable to delete notification');
      setNotifications((items) => items.filter((item) => item.id !== notification.id));
      setNotice('Notification deleted.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete notification');
    }
  };

  const typeClasses: Record<NotificationRecord['type'], string> = {
    success: 'bg-emerald-950/70 text-emerald-200',
    error: 'bg-red-950/70 text-red-200',
    warning: 'bg-amber-950/70 text-amber-200',
    info: 'bg-blue-950/70 text-blue-200'
  };

  return (
    <>
      <Head><title>Notifications - Saintlammy Foundation Admin</title><meta name="description" content="Publish and manage in-app admin notifications" /></Head>
      <AdminLayout title="Notifications">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div className="max-w-3xl"><h2 className="text-xl font-semibold text-white">In-app notifications</h2><p className="mt-2 text-sm leading-6 text-gray-300">Publish operational notices inside the admin dashboard. Email, SMS, and push delivery are not represented here.</p></div><button type="button" onClick={() => setShowComposer(true)} className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-600"><Plus className="h-4 w-4" aria-hidden="true" />New notification</button></div>
          {error && <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-100"><CircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />{error}</div>}
          {notice && <div role="status" className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100"><CheckCircle2 className="h-5 w-5" aria-hidden="true" />{notice}</div>}
          <div className="rounded-xl border border-gray-700 bg-gray-800">
            <div className="grid gap-3 border-b border-gray-700 p-4 sm:grid-cols-[minmax(0,1fr)_12rem]"><div className="relative"><label htmlFor="notification-search" className="sr-only">Search notifications</label><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" /><input id="notification-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title or message" className="min-h-11 w-full rounded-lg border border-gray-600 bg-gray-900 py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500" /></div><div><label htmlFor="notification-type" className="sr-only">Filter notification type</label><select id="notification-type" value={type} onChange={(event) => setType(event.target.value)} className="min-h-11 w-full rounded-lg border border-gray-600 bg-gray-900 px-3 text-sm text-white"><option value="all">All types</option><option value="info">Info</option><option value="success">Success</option><option value="warning">Warning</option><option value="error">Error</option></select></div></div>
            {loading ? <div className="py-16 text-center text-sm text-gray-300" role="status">Loading notifications…</div> : visibleNotifications.length === 0 ? <div className="py-16 text-center"><Bell className="mx-auto h-10 w-10 text-gray-500" aria-hidden="true" /><p className="mt-3 text-sm text-gray-300">No notifications match this view.</p></div> : <div className="divide-y divide-gray-700">{visibleNotifications.map((notification) => <article key={notification.id} className="grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-start"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${typeClasses[notification.type] || typeClasses.info}`}>{notification.type}</span><span className="text-xs capitalize text-gray-400">{notification.category} · {notification.priority} priority</span></div><h3 className="mt-3 font-medium text-white">{notification.title}</h3><p className="mt-1 max-w-3xl text-sm leading-6 text-gray-300">{notification.message}</p><p className="mt-2 text-xs text-gray-500">{Number.isNaN(new Date(notification.created_at).getTime()) ? 'Date unavailable' : new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(notification.created_at))}</p></div><button type="button" onClick={() => deleteNotification(notification)} aria-label={`Delete ${notification.title}`} className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-300 hover:bg-red-950/50 hover:text-red-300"><Trash2 className="h-4 w-4" aria-hidden="true" /></button></article>)}</div>}
          </div>
          {showComposer && <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="notification-composer-title"><div className="fixed inset-0 bg-black/70" onClick={() => !saving && setShowComposer(false)} /><div className="relative flex min-h-screen items-center justify-center p-4"><form onSubmit={createNotification} className="relative w-full max-w-lg rounded-xl border border-gray-700 bg-gray-800 p-6"><div className="flex items-center justify-between"><div><h2 id="notification-composer-title" className="text-lg font-semibold text-white">Publish in-app notification</h2><p className="mt-1 text-sm text-gray-300">Visible to administrators in the notification menu.</p></div><button type="button" onClick={() => setShowComposer(false)} aria-label="Close notification composer" className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-300 hover:bg-gray-700"><X className="h-5 w-5" aria-hidden="true" /></button></div><div className="mt-6 space-y-4"><div><label htmlFor="notification-title" className="mb-2 block text-sm font-medium text-gray-200">Title</label><input id="notification-title" autoFocus required maxLength={160} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="min-h-11 w-full rounded-lg border border-gray-600 bg-gray-900 px-4 text-white" /></div><div><label htmlFor="notification-message" className="mb-2 block text-sm font-medium text-gray-200">Message</label><textarea id="notification-message" required maxLength={1000} rows={5} value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} className="w-full rounded-lg border border-gray-600 bg-gray-900 px-4 py-3 text-white" /></div><div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="composer-type" className="mb-2 block text-sm font-medium text-gray-200">Type</label><select id="composer-type" value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} className="min-h-11 w-full rounded-lg border border-gray-600 bg-gray-900 px-3 text-white"><option value="info">Info</option><option value="success">Success</option><option value="warning">Warning</option><option value="error">Error</option></select></div><div><label htmlFor="composer-priority" className="mb-2 block text-sm font-medium text-gray-200">Priority</label><select id="composer-priority" value={form.priority} onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))} className="min-h-11 w-full rounded-lg border border-gray-600 bg-gray-900 px-3 text-white"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div></div></div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setShowComposer(false)} disabled={saving} className="min-h-11 rounded-lg border border-gray-600 px-4 text-sm font-medium text-gray-200 hover:bg-gray-700">Cancel</button><button type="submit" disabled={saving} className="min-h-11 rounded-lg bg-accent-500 px-4 text-sm font-medium text-white hover:bg-accent-600 disabled:opacity-50">{saving ? 'Publishing…' : 'Publish notification'}</button></div></form></div></div>}
        </div>
      </AdminLayout>
    </>
  );
};

export default NotificationsManagement;
