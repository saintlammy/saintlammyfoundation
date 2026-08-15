import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface ServerNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  read: boolean;
  created_at: string;
}

const NotificationBell: React.FC = () => {
  const { session } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<ServerNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const authHeaders = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined;
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const loadNotifications = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/notifications?limit=10', { headers: { Authorization: `Bearer ${session.access_token}` } });
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
    if (session?.access_token) void loadNotifications();
  }, [loadNotifications, session?.access_token]);

  useEffect(() => {
    if (!isOpen) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key === 'Escape') return setIsOpen(false);
      if (event instanceof MouseEvent && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [isOpen]);

  const markAsRead = async (notification: ServerNotification) => {
    const response = await fetch(`/api/notifications?id=${notification.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ read: true })
    });
    if (response.ok) setNotifications((items) => items.map((item) => item.id === notification.id ? { ...item, read: true } : item));
  };

  const markAllAsRead = async () => {
    await Promise.all(notifications.filter((notification) => !notification.read).map(markAsRead));
  };

  const removeNotification = async (id: string) => {
    const response = await fetch(`/api/notifications?id=${id}`, { method: 'DELETE', headers: authHeaders });
    if (response.ok) setNotifications((items) => items.filter((item) => item.id !== id));
  };

  const typeClasses: Record<ServerNotification['type'], string> = {
    success: 'bg-emerald-950/70 text-emerald-200',
    error: 'bg-red-950/70 text-red-200',
    warning: 'bg-amber-950/70 text-amber-200',
    info: 'bg-blue-950/70 text-blue-200'
  };

  const formatCreatedAt = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Date unavailable' : formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button type="button" onClick={() => setIsOpen((open) => !open)} className="relative flex h-11 w-11 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-gray-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`} aria-expanded={isOpen} aria-controls="admin-notification-menu">
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 && <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {isOpen && (
        <div id="admin-notification-menu" className="absolute right-0 z-50 mt-2 flex max-h-[min(36rem,75vh)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shadow-xl" role="dialog" aria-label="Notifications">
          <div className="flex items-center justify-between border-b border-gray-700 p-4">
            <div><h2 className="font-semibold text-white">Notifications</h2><p className="mt-1 text-xs text-gray-400">{unreadCount ? `${unreadCount} unread` : 'You are up to date'}</p></div>
            {unreadCount > 0 && <button type="button" onClick={markAllAsRead} className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-xs font-medium text-accent-300 hover:bg-gray-700"><CheckCheck className="h-4 w-4" aria-hidden="true" />Mark all read</button>}
          </div>
          <div className="overflow-y-auto">
            {loading ? <div className="p-8 text-center text-sm text-gray-300" role="status">Loading notifications…</div> : error ? <div className="p-6 text-sm text-red-200" role="alert">{error}<button type="button" onClick={loadNotifications} className="ml-2 font-semibold underline">Try again</button></div> : notifications.length === 0 ? <div className="p-8 text-center text-sm text-gray-300"><Bell className="mx-auto mb-3 h-9 w-9 text-gray-500" aria-hidden="true" />No notifications yet.</div> : <div className="divide-y divide-gray-700">{notifications.map((notification) => <article key={notification.id} className={`p-4 ${notification.read ? '' : 'bg-blue-950/20'}`}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold capitalize ${typeClasses[notification.type] || typeClasses.info}`}>{notification.type}</span><h3 className="mt-2 text-sm font-medium text-white">{notification.title}</h3><p className="mt-1 text-sm leading-5 text-gray-300">{notification.message}</p><p className="mt-2 text-xs text-gray-500">{formatCreatedAt(notification.created_at)}</p></div><div className="flex shrink-0 gap-1">{!notification.read && <button type="button" onClick={() => markAsRead(notification)} aria-label={`Mark ${notification.title} as read`} className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-300 hover:bg-gray-700 hover:text-emerald-300"><Check className="h-4 w-4" aria-hidden="true" /></button>}<button type="button" onClick={() => removeNotification(notification.id)} aria-label={`Delete ${notification.title}`} className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-300 hover:bg-red-950/50 hover:text-red-300"><Trash2 className="h-4 w-4" aria-hidden="true" /></button></div></div></article>)}</div>}
          </div>
          <Link href="/admin/communications/notifications" onClick={() => setIsOpen(false)} className="border-t border-gray-700 px-4 py-3 text-center text-sm font-medium text-accent-300 hover:bg-gray-700">Manage notifications</Link>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
