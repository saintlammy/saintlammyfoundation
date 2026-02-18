import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Plus, Search, Edit, Trash2, Users, X, Save, Loader2,
  Check, AlertCircle, Home, Phone, Mail, Calendar, MapPin,
  Eye, EyeOff, Heart
} from 'lucide-react';

interface OrphanageHome {
  id: string;
  name: string;
  location: string;
  orphan_count: number;
  age_range: string;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  description: string;
  needs: string[];
  last_outreach_date: string | null;
  next_outreach_date: string | null;
  outreach_frequency: string;
  image: string;
  monthly_support: number;
  is_active: boolean;
  status: 'active' | 'inactive';
  notes: string;
  created_at: string;
  updated_at: string;
}

type FormData = Omit<OrphanageHome, 'id' | 'created_at' | 'updated_at'>;

const EMPTY_FORM: FormData = {
  name: '',
  location: '',
  orphan_count: 0,
  age_range: '',
  contact_person: '',
  contact_phone: '',
  contact_email: '',
  description: '',
  needs: [],
  last_outreach_date: null,
  next_outreach_date: null,
  outreach_frequency: '',
  image: '',
  monthly_support: 0,
  is_active: true,
  status: 'active',
  notes: '',
};

const inputCls = 'w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors';
const textareaCls = `${inputCls} resize-none`;

const Field: React.FC<{ label: string; children: React.ReactNode; hint?: string }> = ({ label, children, hint }) => (
  <div>
    <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
    {children}
    {hint && <p className="text-xs text-gray-600 mt-1">{hint}</p>}
  </div>
);

// ─── Form Modal ───────────────────────────────────────────────────────────────
const HomeForm: React.FC<{
  initial?: Partial<OrphanageHome>;
  onSave: (data: FormData) => Promise<void>;
  onClose: () => void;
  saving: boolean;
}> = ({ initial, onSave, onClose, saving }) => {
  const [form, setForm] = useState<FormData>({ ...EMPTY_FORM, ...(initial ?? {}) });
  const [needInput, setNeedInput] = useState('');

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const addNeed = () => {
    const t = needInput.trim();
    if (t && !form.needs.includes(t)) { set('needs', [...form.needs, t]); setNeedInput(''); }
  };
  const removeNeed = (n: string) => set('needs', form.needs.filter(x => x !== n));

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-white font-semibold text-lg flex items-center gap-2">
            <Home className="w-5 h-5 text-accent-400" />
            {initial?.id ? `Edit — ${initial.name}` : 'Add Orphanage Home'}
          </h2>
          <button onClick={onClose} className="p-1.5 text-gray-500 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="p-6 space-y-5">

          {/* Identity */}
          <div>
            <p className="text-xs font-semibold text-accent-400 uppercase tracking-wider mb-3">Home Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Home Name *">
                <input required className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Bethel Children's Home" />
              </Field>
              <Field label="Location">
                <input className={inputCls} value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Surulere, Lagos" />
              </Field>
              <Field label="Number of Orphans" hint="Total headcount currently in the home">
                <input type="number" min="0" className={inputCls} value={form.orphan_count || ''} onChange={e => set('orphan_count', parseInt(e.target.value) || 0)} placeholder="e.g. 24" />
              </Field>
              <Field label="Age Range" hint="e.g. 3–17 years">
                <input className={inputCls} value={form.age_range} onChange={e => set('age_range', e.target.value)} placeholder="e.g. 3–17 years" />
              </Field>
            </div>
          </div>

          {/* Description */}
          <Field label="Description / Background">
            <textarea rows={3} className={textareaCls} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief background about the home — shown on public pages..." />
          </Field>

          {/* Photo */}
          <Field label="Photo URL">
            <input className={inputCls} value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." />
            {form.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.image} alt="preview" className="mt-2 h-20 w-28 object-cover rounded-lg border border-gray-600" />
            )}
          </Field>

          {/* Needs */}
          <Field label="Needs (press Enter or Add)">
            <div className="flex gap-2 mb-2">
              <input
                className={inputCls}
                value={needInput}
                onChange={e => setNeedInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addNeed(); } }}
                placeholder="e.g. Food supplies, School uniforms…"
              />
              <button type="button" onClick={addNeed} className="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm flex-shrink-0 transition-colors">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.needs.map(n => (
                <span key={n} className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300 border border-gray-600">
                  {n}
                  <button type="button" onClick={() => removeNeed(n)} className="text-gray-500 hover:text-red-400 ml-0.5"><X className="w-3 h-3" /></button>
                </span>
              ))}
              {form.needs.length === 0 && <span className="text-xs text-gray-600 italic">No needs added yet</span>}
            </div>
          </Field>

          {/* Contact */}
          <div className="border-t border-gray-700 pt-4">
            <p className="text-xs font-semibold text-accent-400 uppercase tracking-wider mb-3">Contact Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Contact Person">
                <input className={inputCls} value={form.contact_person} onChange={e => set('contact_person', e.target.value)} placeholder="Name" />
              </Field>
              <Field label="Phone">
                <input className={inputCls} value={form.contact_phone} onChange={e => set('contact_phone', e.target.value)} placeholder="+234..." />
              </Field>
              <Field label="Email">
                <input type="email" className={inputCls} value={form.contact_email} onChange={e => set('contact_email', e.target.value)} placeholder="home@example.com" />
              </Field>
            </div>
          </div>

          {/* Outreach scheduling */}
          <div className="border-t border-gray-700 pt-4">
            <p className="text-xs font-semibold text-accent-400 uppercase tracking-wider mb-3">Outreach Tracking</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Last Outreach Date">
                <input type="date" className={inputCls} value={form.last_outreach_date ?? ''} onChange={e => set('last_outreach_date', e.target.value || null)} />
              </Field>
              <Field label="Next Outreach Date">
                <input type="date" className={inputCls} value={form.next_outreach_date ?? ''} onChange={e => set('next_outreach_date', e.target.value || null)} />
              </Field>
              <Field label="Outreach Frequency" hint="e.g. Monthly, Quarterly">
                <input className={inputCls} value={form.outreach_frequency} onChange={e => set('outreach_frequency', e.target.value)} placeholder="e.g. Monthly" />
              </Field>
            </div>
          </div>

          {/* Support & Status */}
          <div className="border-t border-gray-700 pt-4">
            <p className="text-xs font-semibold text-accent-400 uppercase tracking-wider mb-3">Support & Status</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="Monthly Support ($)" hint="Amount provided per month">
                <input type="number" min="0" step="0.01" className={inputCls} value={form.monthly_support || ''} onChange={e => set('monthly_support', parseFloat(e.target.value) || 0)} placeholder="0.00" />
              </Field>
              <Field label="Status">
                <select className={inputCls} value={form.status} onChange={e => set('status', e.target.value as OrphanageHome['status'])}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </Field>
              <label className="flex items-center gap-2 cursor-pointer pt-5">
                <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} className="w-4 h-4 accent-accent-500 rounded" />
                <span className="text-sm text-gray-300">Currently receiving support</span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <Field label="Internal Notes">
            <textarea rows={2} className={textareaCls} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Internal notes — not shown publicly..." />
          </Field>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-700">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Save className="w-4 h-4" /> Save Home</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function OrphanageHomesPage() {
  const [homes, setHomes] = useState<OrphanageHome[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<OrphanageHome | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => { load(); }, [statusFilter]);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      const res = await fetch(`/api/orphanage-homes?${params}`);
      const json = await res.json();
      setHomes(json.data || []);
    } catch {
      showToast('Failed to load orphanage homes', false);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: FormData) => {
    setSaving(true);
    try {
      const isEdit = !!editing?.id;
      const url = isEdit ? `/api/orphanage-homes?id=${editing!.id}` : '/api/orphanage-homes';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || json.error || 'Save failed');
      showToast(isEdit ? 'Home updated!' : 'Home added!');
      setShowForm(false);
      setEditing(null);
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Save failed', false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    try {
      const res = await fetch(`/api/orphanage-homes?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || json.error || 'Delete failed');
      showToast('Home deleted');
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Delete failed', false);
    } finally {
      setDeleteId(null);
    }
  };

  const toggleActive = async (home: OrphanageHome) => {
    await fetch(`/api/orphanage-homes?id=${home.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !home.is_active }),
    });
    load();
  };

  const filtered = homes.filter(h => {
    const q = search.toLowerCase();
    return !q || h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q) || h.contact_person.toLowerCase().includes(q);
  });

  const totalOrphans = homes.filter(h => h.status === 'active').reduce((s, h) => s + (h.orphan_count || 0), 0);
  const activeHomes = homes.filter(h => h.is_active).length;

  // Days until next outreach
  const nextOutreach = homes
    .filter(h => h.next_outreach_date && h.is_active)
    .sort((a, b) => new Date(a.next_outreach_date!).getTime() - new Date(b.next_outreach_date!).getTime())[0];

  const daysUntil = nextOutreach?.next_outreach_date
    ? Math.ceil((new Date(nextOutreach.next_outreach_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <>
      <Head><title>Orphanage Homes — Admin</title></Head>
      <AdminLayout title="Orphanage Homes">
        <div className="max-w-6xl mx-auto">

          {/* Toast */}
          {toast && (
            <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-white text-sm font-medium ${toast.ok ? 'bg-green-600' : 'bg-red-600'}`}>
              {toast.ok ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {toast.msg}
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-xl font-bold text-white">Orphanage Homes</h1>
              <p className="text-sm text-gray-400 mt-0.5">Track homes you visit as a group. Orphan counts from homes feed into the hero stats automatically.</p>
            </div>
            <button
              onClick={() => { setEditing(null); setShowForm(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-accent-500/20"
            >
              <Plus className="w-4 h-4" /> Add Home
            </button>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div className="bg-gray-800 rounded-xl border border-gray-700 px-4 py-3">
              <p className="text-xs text-gray-500 mb-1">Total Homes</p>
              <p className="text-2xl font-bold text-white">{homes.length}</p>
            </div>
            <div className="bg-gray-800 rounded-xl border border-gray-700 px-4 py-3">
              <p className="text-xs text-gray-500 mb-1">Active Homes</p>
              <p className="text-2xl font-bold text-accent-400">{activeHomes}</p>
            </div>
            <div className="bg-accent-500/10 rounded-xl border border-accent-500/30 px-4 py-3">
              <p className="text-xs text-accent-400 mb-1">Total Orphans Tracked</p>
              <p className="text-2xl font-bold text-accent-300">{totalOrphans}</p>
              <p className="text-xs text-gray-500 mt-0.5">feeds → hero stat</p>
            </div>
            <div className="bg-gray-800 rounded-xl border border-gray-700 px-4 py-3">
              <p className="text-xs text-gray-500 mb-1">Next Outreach</p>
              {daysUntil !== null ? (
                <>
                  <p className={`text-2xl font-bold ${daysUntil <= 7 ? 'text-yellow-400' : 'text-white'}`}>{daysUntil}d</p>
                  <p className="text-xs text-gray-500 truncate">{nextOutreach?.name}</p>
                </>
              ) : (
                <p className="text-sm text-gray-600 mt-1">Not scheduled</p>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                placeholder="Search by name, location, contact…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-accent-500"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Cards grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-accent-400 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-gray-800 rounded-xl border border-gray-700 py-20 text-center">
              <Home className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">
                {search ? 'No homes match your search.' : 'No orphanage homes yet. Add your first one.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.map(home => (
                <div key={home.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors group">
                  <div className="flex">
                    {/* Image or placeholder */}
                    <div className="w-28 flex-shrink-0 relative bg-gray-700">
                      {home.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={home.image} alt={home.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home className="w-8 h-8 text-gray-600" />
                        </div>
                      )}
                      {/* Orphan count badge */}
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                        <span className="bg-accent-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {home.orphan_count} orphans
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className="font-semibold text-white text-sm leading-tight">{home.name}</h3>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <MapPin className="w-3 h-3" />{home.location}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => toggleActive(home)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-colors ${home.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-500'}`}
                            title="Toggle active support"
                          >
                            {home.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            {home.is_active ? 'Active' : 'Inactive'}
                          </button>
                        </div>
                      </div>

                      {/* Meta row */}
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
                        {home.age_range && <span>Ages: {home.age_range}</span>}
                        {home.outreach_frequency && <span>· {home.outreach_frequency} outreach</span>}
                        {home.monthly_support > 0 && <span>· ${home.monthly_support}/mo</span>}
                      </div>

                      {/* Outreach dates */}
                      <div className="flex flex-wrap gap-3 text-xs mb-3">
                        {home.last_outreach_date && (
                          <span className="flex items-center gap-1 text-gray-500">
                            <Calendar className="w-3 h-3" />
                            Last: {new Date(home.last_outreach_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                        {home.next_outreach_date && (
                          <span className={`flex items-center gap-1 font-medium ${
                            Math.ceil((new Date(home.next_outreach_date).getTime() - Date.now()) / 86400000) <= 7 ? 'text-yellow-400' : 'text-accent-400'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            Next: {new Date(home.next_outreach_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>

                      {/* Contact */}
                      {(home.contact_person || home.contact_phone) && (
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                          {home.contact_person && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{home.contact_person}</span>}
                          {home.contact_phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{home.contact_phone}</span>}
                          {home.contact_email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{home.contact_email}</span>}
                        </div>
                      )}

                      {/* Needs pills */}
                      {home.needs?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {home.needs.slice(0, 3).map(n => (
                            <span key={n} className="px-1.5 py-0.5 bg-gray-700 text-gray-400 rounded text-xs">{n}</span>
                          ))}
                          {home.needs.length > 3 && <span className="px-1.5 py-0.5 bg-gray-700 text-gray-500 rounded text-xs">+{home.needs.length - 3} more</span>}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditing(home); setShowForm(true); }}
                          className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs transition-colors"
                        >
                          <Edit className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => { if (confirm(`Delete "${home.name}"?`)) handleDelete(home.id); }}
                          disabled={deleteId === home.id}
                          className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded text-xs transition-colors disabled:opacity-50"
                        >
                          {deleteId === home.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {showForm && (
          <HomeForm
            initial={editing ?? undefined}
            onSave={handleSave}
            onClose={() => { setShowForm(false); setEditing(null); }}
            saving={saving}
          />
        )}
      </AdminLayout>
    </>
  );
}
