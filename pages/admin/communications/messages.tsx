import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { Check, Inbox, Mail, RefreshCw, Search, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  content: string;
  status: 'read' | 'unread' | string;
  priority: 'high' | 'normal' | 'low' | string;
  created_at: string;
}

export default function MessagesManagement() {
  const { session } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [status, setStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadMessages = useCallback(async () => {
    if (!session?.access_token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ limit: '100' });
      if (status !== 'all') params.set('status', status);
      const response = await fetch(`/api/admin/messages?${params}`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to load messages');
      setMessages(payload.data || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load messages');
    } finally {
      setLoading(false);
    }
  }, [session?.access_token, status]);

  useEffect(() => { void loadMessages(); }, [loadMessages]);

  const filteredMessages = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return messages;
    return messages.filter(message => [message.sender_name, message.sender_email, message.subject, message.content]
      .some(value => value?.toLowerCase().includes(needle)));
  }, [messages, query]);

  const updateStatus = async (message: Message, nextStatus: 'read' | 'unread') => {
    if (!session?.access_token) return;
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ messageId: message.id, status: nextStatus })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Unable to update the message');
      setMessages(current => current.map(item => item.id === message.id ? { ...item, status: nextStatus } : item));
      setSelected(current => current?.id === message.id ? { ...current, status: nextStatus } : current);
      setNotice(nextStatus === 'read' ? 'Message marked as read.' : 'Message marked as unread.');
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to update the message');
    }
  };

  const removeMessage = async (message: Message) => {
    if (!session?.access_token || !window.confirm('Permanently delete this message?')) return;
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ messageId: message.id })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Unable to delete the message');
      setMessages(current => current.filter(item => item.id !== message.id));
      setSelected(null);
      setNotice('Message deleted.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete the message');
    }
  };

  const openMessage = (message: Message) => {
    setSelected(message);
    if (message.status === 'unread') void updateStatus(message, 'read');
  };

  return (
    <>
      <Head><title>Messages | Saintlammy Foundation Admin</title></Head>
      <AdminLayout title="Messages">
        <div className="space-y-6">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent-300">Contact inbox</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Messages from the website</h2>
              <p className="mt-2 max-w-2xl text-sm text-gray-400">Review real contact submissions. Replies open in your email app; the dashboard does not claim to send email.</p>
            </div>
            <button type="button" onClick={() => void loadMessages()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-600 px-4 text-sm font-medium text-gray-100 hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" /> Refresh
            </button>
          </header>

          {(error || notice) && <div role={error ? 'alert' : 'status'} className={`rounded-lg border px-4 py-3 text-sm ${error ? 'border-red-500/40 bg-red-500/10 text-red-200' : 'border-green-500/40 bg-green-500/10 text-green-200'}`}>{error || notice}</div>}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-700 bg-gray-800 p-5"><Inbox className="h-5 w-5 text-accent-300" aria-hidden="true" /><p className="mt-3 text-3xl font-semibold text-white">{messages.length}</p><p className="text-sm text-gray-400">Messages in this view</p></div>
            <div className="rounded-xl border border-gray-700 bg-gray-800 p-5"><Mail className="h-5 w-5 text-amber-300" aria-hidden="true" /><p className="mt-3 text-3xl font-semibold text-white">{messages.filter(message => message.status === 'unread').length}</p><p className="text-sm text-gray-400">Unread</p></div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-gray-700 bg-gray-800 p-4 sm:flex-row">
            <label className="relative flex-1"><span className="sr-only">Search messages</span><Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-500" aria-hidden="true" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search sender, subject, or message" className="min-h-11 w-full rounded-lg border border-gray-600 bg-gray-900 pl-10 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30" /></label>
            <label><span className="sr-only">Filter by status</span><select value={status} onChange={event => setStatus(event.target.value as typeof status)} className="min-h-11 w-full rounded-lg border border-gray-600 bg-gray-900 px-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"><option value="all">All messages</option><option value="unread">Unread</option><option value="read">Read</option></select></label>
          </div>

          <div className="grid min-h-[32rem] overflow-hidden rounded-xl border border-gray-700 bg-gray-800 lg:grid-cols-[minmax(18rem,0.9fr)_minmax(0,1.5fr)]">
            <div className="border-b border-gray-700 lg:border-b-0 lg:border-r">
              {loading ? <p className="p-6 text-sm text-gray-400">Loading messages…</p> : filteredMessages.length === 0 ? <p className="p-6 text-sm text-gray-400">No messages match this view.</p> : filteredMessages.map(message => (
                <button key={message.id} type="button" onClick={() => openMessage(message)} className={`block min-h-20 w-full border-b border-gray-700 px-5 py-4 text-left hover:bg-gray-700/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-400 ${selected?.id === message.id ? 'bg-gray-700' : ''}`}>
                  <span className="flex items-center justify-between gap-3"><span className={`truncate text-sm ${message.status === 'unread' ? 'font-semibold text-white' : 'text-gray-200'}`}>{message.sender_name}</span><time className="shrink-0 text-xs text-gray-500">{new Date(message.created_at).toLocaleDateString()}</time></span>
                  <span className="mt-1 block truncate text-sm text-gray-300">{message.subject}</span>
                  <span className="mt-1 block truncate text-xs text-gray-500">{message.content}</span>
                </button>
              ))}
            </div>
            <div className="p-6 lg:p-8">
              {!selected ? <div className="flex h-full min-h-64 items-center justify-center text-center text-sm text-gray-400">Select a message to read it.</div> : (
                <article>
                  <div className="flex flex-col gap-4 border-b border-gray-700 pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div><p className="text-sm text-gray-400">From {selected.sender_name}</p><a href={`mailto:${selected.sender_email}`} className="text-sm text-accent-300 underline-offset-4 hover:underline">{selected.sender_email}</a><h2 className="mt-3 text-2xl font-semibold text-white">{selected.subject}</h2><time className="mt-2 block text-xs text-gray-500">{new Date(selected.created_at).toLocaleString()}</time></div>
                    <div className="flex gap-2"><button type="button" onClick={() => void updateStatus(selected, selected.status === 'read' ? 'unread' : 'read')} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-600 px-3 text-sm text-gray-200 hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"><Check className="h-4 w-4" aria-hidden="true" />{selected.status === 'read' ? 'Mark unread' : 'Mark read'}</button><button type="button" onClick={() => void removeMessage(selected)} aria-label="Delete message" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-red-500/40 text-red-300 hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"><Trash2 className="h-4 w-4" aria-hidden="true" /></button></div>
                  </div>
                  <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-gray-200">{selected.content}</p>
                  <a href={`mailto:${selected.sender_email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`} className="mt-8 inline-flex min-h-11 items-center justify-center rounded-lg bg-accent-500 px-5 text-sm font-semibold text-gray-950 hover:bg-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300">Reply by email</a>
                </article>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
