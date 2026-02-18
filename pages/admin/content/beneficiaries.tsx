import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Plus, Search, Edit, Trash2, Heart, Users, X, Save, Loader2, Check, AlertCircle, Eye, EyeOff
} from 'lucide-react';

interface Beneficiary {
  id: string;
  name: string;
  age: number | null;
  location: string;
  category: 'orphan' | 'widow' | 'vulnerable_home';
  story: string;
  needs: string[];
  monthly_cost: number;
  image: string;
  school_grade: string | null;
  family_size: number | null;
  // Vulnerable Home planning fields
  planned_homes: number | null;
  estimated_per_home: number | null;
  actual_people_reached: number | null;
  dream_aspiration: string;
  is_sponsored: boolean;
  days_supported: number;
  is_featured: boolean;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

const EMPTY_FORM: Omit<Beneficiary, 'id' | 'created_at' | 'updated_at'> = {
  name: '',
  age: null,
  location: 'Lagos, Nigeria',
  category: 'orphan',
  story: '',
  needs: [],
  monthly_cost: 0,
  image: '',
  school_grade: null,
  family_size: null,
  planned_homes: null,
  estimated_per_home: null,
  actual_people_reached: null,
  dream_aspiration: '',
  is_sponsored: false,
  days_supported: 0,
  is_featured: true,
  status: 'active',
};

// ─── Seed data (the mock data from BeneficiaryShowcase) ───────────────────────
const SEED_DATA: Omit<Beneficiary, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    name: 'Amara',
    age: 8,
    location: 'Lagos, Nigeria',
    category: 'orphan',
    story: 'Dreams of becoming a doctor to help other children like herself. Your support provides her with education, healthcare, and hope.',
    needs: ['School fees and supplies', 'Healthcare', 'Nutritious meals', 'Educational materials'],
    monthly_cost: 45,
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    school_grade: '3',
    family_size: null,
    planned_homes: null,
    estimated_per_home: null,
    actual_people_reached: null,
    dream_aspiration: 'I want to become a doctor so I can help sick children get better and make them smile again.',
    is_sponsored: false,
    days_supported: 120,
    is_featured: true,
    status: 'active',
  },
  {
    name: 'Grace',
    age: 35,
    location: 'Lagos, Nigeria',
    category: 'widow',
    story: 'Mother of three children, learning new skills to provide for her family. Your support helps her start a small business.',
    needs: ['Business training', 'Micro-loan support', 'Childcare assistance', 'Basic necessities'],
    monthly_cost: 80,
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    school_grade: null,
    family_size: 4,
    planned_homes: null,
    estimated_per_home: null,
    actual_people_reached: null,
    dream_aspiration: 'I want to build a successful tailoring business so my children can have the education I never had.',
    is_sponsored: false,
    days_supported: 85,
    is_featured: true,
    status: 'active',
  },
  {
    name: 'Emmanuel',
    age: 12,
    location: 'Lagos, Nigeria',
    category: 'orphan',
    story: 'Passionate about technology and coding. Your support gives him access to education and the tools to build his future.',
    needs: ['Computer access', 'Internet connectivity', 'Programming books', 'School fees'],
    monthly_cost: 55,
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    school_grade: '7',
    family_size: null,
    planned_homes: null,
    estimated_per_home: null,
    actual_people_reached: null,
    dream_aspiration: 'I want to become a software engineer and create apps that help people in my community.',
    is_sponsored: false,
    days_supported: 200,
    is_featured: true,
    status: 'active',
  },
];

// ─── Field component ──────────────────────────────────────────────────────────
const Field: React.FC<{
  label: string;
  children: React.ReactNode;
  hint?: string;
}> = ({ label, children, hint }) => (
  <div>
    <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
    {children}
    {hint && <p className="text-xs text-gray-600 mt-1">{hint}</p>}
  </div>
);

const inputCls = 'w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors';
const textareaCls = `${inputCls} resize-none`;

// ─── Beneficiary Form (Add / Edit modal) ──────────────────────────────────────
const BeneficiaryForm: React.FC<{
  initial?: Partial<Beneficiary>;
  onSave: (data: Omit<Beneficiary, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
  saving: boolean;
}> = ({ initial, onSave, onClose, saving }) => {
  const [form, setForm] = useState<Omit<Beneficiary, 'id' | 'created_at' | 'updated_at'>>({
    ...EMPTY_FORM,
    ...(initial ?? {}),
  });
  const [needInput, setNeedInput] = useState('');

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const addNeed = () => {
    const trimmed = needInput.trim();
    if (trimmed && !form.needs.includes(trimmed)) {
      set('needs', [...form.needs, trimmed]);
      setNeedInput('');
    }
  };

  const removeNeed = (n: string) => set('needs', form.needs.filter(x => x !== n));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-white font-semibold text-lg">
            {initial?.id ? `Edit — ${initial.name}` : 'Add Beneficiary'}
          </h2>
          <button onClick={onClose} className="p-1.5 text-gray-500 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Category first — drives the rest of the form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Category *">
              <select required className={inputCls} value={form.category} onChange={e => set('category', e.target.value as Beneficiary['category'])}>
                <option value="orphan">Orphan (individual)</option>
                <option value="widow">Widow (individual)</option>
                <option value="vulnerable_home">Vulnerable Home (group)</option>
              </select>
            </Field>
            <Field label="Location">
              <input className={inputCls} value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Lagos, Nigeria" />
            </Field>
          </div>

          {/* Vulnerable Home — group planning mode */}
          {form.category === 'vulnerable_home' ? (
            <>
              <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-xl p-4 text-sm text-yellow-300">
                <strong>Group planning mode</strong> — You don&apos;t need exact headcounts upfront. Plan by number of homes and update actual people reached after the visit.
              </div>

              <Field label="Home / Group Name *" hint="e.g. 'Orphanage Cluster — Surulere' or 'Widow Homes — Agege'">
                <input required className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Vulnerable Homes — Surulere District" />
              </Field>

              <Field label="Description" hint="What kind of homes are these? What support will be provided?">
                <textarea rows={3} className={textareaCls} value={form.story} onChange={e => set('story', e.target.value)} placeholder="Brief description of these homes and the planned support..." />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Planned Homes to Visit" hint="How many homes you're planning to reach">
                  <input type="number" min="0" className={inputCls} value={form.planned_homes ?? ''} onChange={e => set('planned_homes', e.target.value ? parseInt(e.target.value) : null)} placeholder="e.g. 12" />
                </Field>
                <Field label="Est. People per Home" hint="Best estimate — can be updated later">
                  <input type="number" min="0" className={inputCls} value={form.estimated_per_home ?? ''} onChange={e => set('estimated_per_home', e.target.value ? parseInt(e.target.value) : null)} placeholder="e.g. 6" />
                </Field>
                <Field
                  label="Actual People Reached"
                  hint="Fill after the visit — leave blank while planning"
                >
                  <input type="number" min="0" className={inputCls} value={form.actual_people_reached ?? ''} onChange={e => set('actual_people_reached', e.target.value ? parseInt(e.target.value) : null)} placeholder="e.g. 74" />
                </Field>
              </div>

              {/* Estimated total read-only display */}
              {(form.planned_homes || form.estimated_per_home) && (
                <div className="bg-gray-700/40 rounded-lg px-4 py-3 text-sm text-gray-300">
                  Estimated reach:{' '}
                  <span className="font-bold text-white">
                    {(form.planned_homes ?? 0) * (form.estimated_per_home ?? 0)} people
                  </span>
                  {' '}across{' '}
                  <span className="font-bold text-white">{form.planned_homes ?? 0} homes</span>
                  {form.actual_people_reached != null && form.actual_people_reached > 0 && (
                    <span className="ml-2 text-green-400">
                      → Actual: <strong>{form.actual_people_reached}</strong>
                    </span>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Individual beneficiary fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name *">
                  <input required className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Amara" />
                </Field>
                <Field label="Age">
                  <input type="number" min="0" max="120" className={inputCls} value={form.age ?? ''} onChange={e => set('age', e.target.value ? parseInt(e.target.value) : null)} placeholder="e.g. 8" />
                </Field>
              </div>

              <Field label="Story (shown on card)" hint="Keep to 2–3 sentences — it will be truncated on the website.">
                <textarea rows={3} className={textareaCls} value={form.story} onChange={e => set('story', e.target.value)} placeholder="Brief story shown on the public beneficiary card..." />
              </Field>

              <Field label="Dream / Aspiration (longer quote)">
                <textarea rows={2} className={textareaCls} value={form.dream_aspiration} onChange={e => set('dream_aspiration', e.target.value)} placeholder="In their own words — shown in sponsor modal..." />
              </Field>
            </>
          )}

          {/* Image — for all categories */}
          <Field label="Photo URL" hint="Use a direct image URL (Unsplash, Cloudinary, etc.)">
            <input className={inputCls} value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." />
            {form.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.image} alt="preview" className="mt-2 h-20 w-28 object-cover rounded-lg border border-gray-600" />
            )}
          </Field>

          {/* Needs — for all categories */}
          <Field label="Needs (press Enter or Add to add each one)">
            <div className="flex gap-2 mb-2">
              <input
                className={inputCls}
                value={needInput}
                onChange={e => setNeedInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addNeed(); } }}
                placeholder={form.category === 'vulnerable_home' ? 'e.g. Food parcels, Hygiene kits' : 'e.g. School fees and supplies'}
              />
              <button type="button" onClick={addNeed} className="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm flex-shrink-0 transition-colors">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.needs.map(n => (
                <span key={n} className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300 border border-gray-600">
                  {n}
                  <button type="button" onClick={() => removeNeed(n)} className="text-gray-500 hover:text-red-400 ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {form.needs.length === 0 && <span className="text-xs text-gray-600 italic">No needs added yet</span>}
            </div>
          </Field>

          {/* Financials & progress — individual only */}
          {form.category !== 'vulnerable_home' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Field label="Monthly Cost ($)">
              <input type="number" min="0" step="0.01" className={inputCls} value={form.monthly_cost || ''} onChange={e => set('monthly_cost', parseFloat(e.target.value) || 0)} placeholder="45" />
            </Field>
            <Field label="Days Supported">
              <input type="number" min="0" className={inputCls} value={form.days_supported || ''} onChange={e => set('days_supported', parseInt(e.target.value) || 0)} placeholder="120" />
            </Field>
            {form.category === 'orphan' && (
              <Field label="School Grade">
                <input className={inputCls} value={form.school_grade ?? ''} onChange={e => set('school_grade', e.target.value || null)} placeholder="e.g. 3" />
              </Field>
            )}
            {form.category === 'widow' && (
              <Field label="Family Size" hint="Number of dependents in her household">
                <input type="number" min="1" className={inputCls} value={form.family_size ?? ''} onChange={e => set('family_size', e.target.value ? parseInt(e.target.value) : null)} placeholder="4" />
              </Field>
            )}
          </div>
          )}

          {/* Flags */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} className="w-4 h-4 accent-accent-500 rounded" />
              <span className="text-sm text-gray-300">Featured on homepage</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_sponsored} onChange={e => set('is_sponsored', e.target.checked)} className="w-4 h-4 accent-accent-500 rounded" />
              <span className="text-sm text-gray-300">Fully sponsored</span>
            </label>
            <Field label="Status">
              <select className={inputCls} value={form.status} onChange={e => set('status', e.target.value as Beneficiary['status'])}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </Field>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-700">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
            >
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Save className="w-4 h-4" /> Save Beneficiary</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function BeneficiariesManagement() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Beneficiary | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => { load(); }, [categoryFilter]);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== 'all') params.set('category', categoryFilter);
      const res = await fetch(`/api/beneficiaries?${params}`);
      const json = await res.json();
      setBeneficiaries(json.data || []);
    } catch {
      showToast('Failed to load beneficiaries', false);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Omit<Beneficiary, 'id' | 'created_at' | 'updated_at'>) => {
    setSaving(true);
    try {
      const isEdit = !!editing?.id;
      const url = isEdit ? `/api/beneficiaries?id=${editing!.id}` : '/api/beneficiaries';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || json.error || 'Save failed');
      showToast(isEdit ? 'Beneficiary updated!' : 'Beneficiary added!');
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
      const res = await fetch(`/api/beneficiaries?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || json.error || 'Delete failed');
      showToast('Beneficiary deleted');
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Delete failed', false);
    } finally {
      setDeleteId(null);
    }
  };

  const handleSeedMockData = async () => {
    if (!confirm('This will add Amara, Grace, and Emmanuel from the original mock data into the database. Continue?')) return;
    setSeeding(true);
    try {
      for (const b of SEED_DATA) {
        await fetch('/api/beneficiaries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(b),
        });
      }
      showToast('Mock data seeded — Amara, Grace & Emmanuel added!');
      load();
    } catch {
      showToast('Seeding failed', false);
    } finally {
      setSeeding(false);
    }
  };

  const filtered = beneficiaries.filter(b => {
    const q = search.toLowerCase();
    return !q || b.name.toLowerCase().includes(q) || b.story.toLowerCase().includes(q) || b.location.toLowerCase().includes(q);
  });

  const stats = {
    total: beneficiaries.length,
    orphans: beneficiaries.filter(b => b.category === 'orphan').length,
    widows: beneficiaries.filter(b => b.category === 'widow').length,
    homes: beneficiaries.filter(b => b.category === 'vulnerable_home').length,
    featured: beneficiaries.filter(b => b.is_featured).length,
    sponsored: beneficiaries.filter(b => b.is_sponsored).length,
  };

  return (
    <>
      <Head><title>Beneficiaries — Admin</title></Head>
      <AdminLayout title="Beneficiaries">
        <div className="max-w-6xl mx-auto">

          {/* Toast */}
          {toast && (
            <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-white text-sm font-medium transition-all ${toast.ok ? 'bg-green-600' : 'bg-red-600'}`}>
              {toast.ok ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {toast.msg}
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-xl font-bold text-white">Beneficiaries</h1>
              <p className="text-sm text-gray-400 mt-0.5">Manage beneficiaries shown on the homepage showcase and sponsorship pages.</p>
            </div>
            <div className="flex items-center gap-2">
              {beneficiaries.length === 0 && !loading && (
                <button
                  onClick={handleSeedMockData}
                  disabled={seeding}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm border border-dashed border-gray-500 transition-colors"
                >
                  {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4" />}
                  {seeding ? 'Seeding…' : 'Seed Mock Data'}
                </button>
              )}
              <button
                onClick={() => { setEditing(null); setShowForm(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-accent-500/20"
              >
                <Plus className="w-4 h-4" /> Add Beneficiary
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-5">
            {[
              { label: 'Total', value: stats.total, color: 'text-white' },
              { label: 'Orphans', value: stats.orphans, color: 'text-blue-400' },
              { label: 'Widows', value: stats.widows, color: 'text-purple-400' },
              { label: 'Vuln. Homes', value: stats.homes, color: 'text-yellow-400' },
              { label: 'Featured', value: stats.featured, color: 'text-accent-400' },
              { label: 'Sponsored', value: stats.sponsored, color: 'text-green-400' },
            ].map(s => (
              <div key={s.label} className="bg-gray-800 rounded-xl border border-gray-700 px-4 py-3">
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                placeholder="Search by name, story, location…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="orphan">Orphans</option>
              <option value="widow">Widows</option>
              <option value="vulnerable_home">Vulnerable Homes</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 text-accent-400 animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center">
                <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">
                  {search ? 'No beneficiaries match your search.' : 'No beneficiaries yet. Add one or seed the mock data.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-700">
                    <tr>
                      {['Beneficiary', 'Category', 'Monthly Cost', 'Days Supported', 'Featured', 'Status', ''].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {filtered.map(b => (
                      <tr key={b.id} className="hover:bg-gray-700/30 transition-colors group">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {b.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={b.image} alt={b.name} className="w-10 h-10 rounded-full object-cover border border-gray-600 flex-shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                                <Users className="w-5 h-5 text-gray-500" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-white">{b.name}{b.age ? `, ${b.age}` : ''}</p>
                              <p className="text-xs text-gray-500 truncate max-w-[180px]">{b.location}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            b.category === 'orphan' ? 'bg-blue-500/20 text-blue-400' :
                            b.category === 'widow' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {b.category === 'vulnerable_home' ? 'Vuln. Home' : b.category.charAt(0).toUpperCase() + b.category.slice(1)}
                          </span>
                          {b.category === 'vulnerable_home' && (b as any).planned_homes && (
                            <span className="block text-xs text-gray-500 mt-0.5">
                              {(b as any).planned_homes} homes planned
                              {(b as any).actual_people_reached ? ` · ${(b as any).actual_people_reached} reached` : (b as any).estimated_per_home ? ` · ~${(b as any).planned_homes * (b as any).estimated_per_home} est.` : ''}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {b.category === 'vulnerable_home' ? '—' : `$${b.monthly_cost}/mo`}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <span className="text-accent-400 font-medium">{b.days_supported}</span>
                            <span className="text-gray-500 text-xs ml-1">/ 365 days</span>
                            <div className="w-20 bg-gray-700 rounded-full h-1 mt-1">
                              <div className="bg-accent-500 h-1 rounded-full" style={{ width: `${Math.min((b.days_supported / 365) * 100, 100)}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={async () => {
                              await fetch(`/api/beneficiaries?id=${b.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ is_featured: !b.is_featured }),
                              });
                              load();
                            }}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${b.is_featured ? 'bg-accent-500/20 text-accent-400' : 'bg-gray-700 text-gray-500 hover:bg-gray-600'}`}
                          >
                            {b.is_featured ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            {b.is_featured ? 'Yes' : 'No'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${b.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-600 text-gray-400'}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => { setEditing(b); setShowForm(true); }}
                              className="p-1.5 bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => { if (confirm(`Delete ${b.name}?`)) handleDelete(b.id); }}
                              disabled={deleteId === b.id}
                              className="p-1.5 bg-gray-700 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              {deleteId === b.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Form modal */}
        {showForm && (
          <BeneficiaryForm
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
