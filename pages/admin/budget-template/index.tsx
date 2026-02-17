import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Plus, Trash2, Download, FileText, ChevronDown, ChevronUp,
  RefreshCw, Copy, Info, DollarSign, Hash
} from 'lucide-react';
import type { BudgetData, BucketARow, BucketBRow, BucketCRow, BudgetMeta } from '@/components/admin/BudgetTemplatePDF';

// Dynamic import to avoid SSR issues with @react-pdf/renderer
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(m => m.PDFDownloadLink),
  { ssr: false, loading: () => null }
);
const BudgetTemplatePDF = dynamic(
  () => import('@/components/admin/BudgetTemplatePDF'),
  { ssr: false, loading: () => null }
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9);
const num = (v: string) => parseFloat(v) || 0;
const fmtNGN = (v: number) =>
  v === 0 ? '—' : `₦${v.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtUSD = (v: number, fx: number) =>
  fx > 0 && v > 0
    ? `$${(v / fx).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : '—';

// ─── Default data ──────────────────────────────────────────────────────────────

const defaultMeta: BudgetMeta = {
  cycleNameCode: '', preparedBy: '', startWeek: '', datePrepared: '',
  targetHomes: '', perHomeCap: '', fxRate: '1600', location: '',
  bucketATotalCap: '', bucketAPerHomeCap: '', bucketBTotalCap: '',
  bucketBPerHouseholdCap: '', bucketBSlots: '', bucketCPercent: '20',
  bucketCFixed: '', approvedBy: '', approvedDate: '', preparedDate: '',
};

const defaultBucketA: BucketARow[] = [
  { id: uid(), item: 'Rice (kg)', qtyPerHome: '', unitCost: '' },
  { id: uid(), item: 'Garri (kg)', qtyPerHome: '', unitCost: '' },
  { id: uid(), item: 'Beans (kg)', qtyPerHome: '', unitCost: '' },
  { id: uid(), item: 'Pasta/Noodles (unit)', qtyPerHome: '', unitCost: '' },
  { id: uid(), item: 'Cooking Oil (ml)', qtyPerHome: '', unitCost: '' },
  { id: uid(), item: 'Seasoning + Salt (set)', qtyPerHome: '', unitCost: '' },
  { id: uid(), item: 'Bath Soap (unit)', qtyPerHome: '', unitCost: '' },
  { id: uid(), item: 'Detergent (sachet/pack)', qtyPerHome: '', unitCost: '' },
  { id: uid(), item: 'Tissue (roll/pack)', qtyPerHome: '', unitCost: '' },
  { id: uid(), item: 'Sanitary Pads (pack)', qtyPerHome: '', unitCost: '' },
  { id: uid(), item: 'Packaging Bags/Labels', qtyPerHome: '', unitCost: '' },
];

const defaultBucketB: BucketBRow[] = [
  { id: uid(), homeId: 'VH-001', needType: 'School Fees / Tuition', evidence: 'Invoice / Call school / receipt', cap: '', approved: '', notes: '' },
  { id: uid(), homeId: 'VH-002', needType: 'School Supplies / Uniform', evidence: 'Photo / school list / receipt', cap: '', approved: '', notes: '' },
  { id: uid(), homeId: 'VH-003', needType: 'Transport Support (time-bound)', evidence: 'Agreement / follow-up plan', cap: '', approved: '', notes: '' },
  { id: uid(), homeId: 'VH-004', needType: 'Rent-at-risk Buffer', evidence: 'Landlord/agent confirmation', cap: '', approved: '', notes: '' },
  { id: uid(), homeId: 'VH-005', needType: 'Micro-income Restart (in-kind)', evidence: 'Plan + item list + receipt', cap: '', approved: '', notes: '' },
];

const defaultBucketC: BucketCRow[] = [
  { id: uid(), lineItem: 'Transport (delivery + distribution)', description: 'Fuel, vehicle hire, driver', amount: '' },
  { id: uid(), lineItem: 'Packaging (bags, labels, markers)', description: 'Polythene bags, stickers, markers', amount: '' },
  { id: uid(), lineItem: 'Volunteer logistics (water, small support)', description: 'Water, snacks for volunteers', amount: '' },
  { id: uid(), lineItem: 'Contingency / Price Volatility Buffer', description: 'Recommended 15–25% of (A+B)', amount: '' },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

const SectionCard: React.FC<{
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, subtitle, badge, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden mb-6">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 bg-gray-750 hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-6 bg-accent-500 rounded-full" />
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">{title}</span>
              {badge && (
                <span className="px-2 py-0.5 text-xs bg-accent-500/20 text-accent-400 rounded-full border border-accent-500/30">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="p-6">{children}</div>}
    </div>
  );
};

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  prefix?: string;
  hint?: string;
  half?: boolean;
}> = ({ label, value, onChange, placeholder, type = 'text', prefix, hint, half }) => (
  <div className={half ? 'col-span-1' : ''}>
    <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none">{prefix}</span>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? ''}
        className={`w-full bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500
          focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors py-2 pr-3
          ${prefix ? 'pl-7' : 'pl-3'}`}
      />
    </div>
    {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
  </div>
);

// Stat badge for totals
const StatBadge: React.FC<{ label: string; ngn: number; fx: number; accent?: boolean }> = ({ label, ngn, fx, accent }) => (
  <div className={`rounded-lg px-4 py-3 border ${accent ? 'bg-accent-500/10 border-accent-500/30' : 'bg-gray-700/50 border-gray-600'}`}>
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className={`text-base font-bold ${accent ? 'text-accent-400' : 'text-white'}`}>{fmtNGN(ngn)}</p>
    <p className="text-xs text-gray-500">{fmtUSD(ngn, fx)}</p>
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function BudgetTemplatePage() {
  const [meta, setMeta] = useState<BudgetMeta>(defaultMeta);
  const [bucketA, setBucketA] = useState<BucketARow[]>(defaultBucketA);
  const [bucketB, setBucketB] = useState<BucketBRow[]>(defaultBucketB);
  const [bucketC, setBucketC] = useState<BucketCRow[]>(defaultBucketC);
  const [copied, setCopied] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);

  // Delay PDF component mount until client hydration is complete
  useEffect(() => { setPdfReady(true); }, []);

  const setMetaField = useCallback((field: keyof BudgetMeta, value: string) =>
    setMeta(m => ({ ...m, [field]: value })), []);

  const fx = num(meta.fxRate);
  const homes = num(meta.targetHomes);

  // ─── Bucket A calculations ─────────────────────────────────────────────────
  const aCalc = useMemo(() =>
    bucketA.map(r => {
      const totalQty = homes > 0 ? num(r.qtyPerHome) * homes : 0;
      const total = totalQty * num(r.unitCost);
      return { totalQty, total };
    }), [bucketA, homes]);
  const aTotalNGN = useMemo(() => aCalc.reduce((s, r) => s + r.total, 0), [aCalc]);

  // ─── Bucket B calculations ─────────────────────────────────────────────────
  const bTotalNGN = useMemo(() =>
    bucketB.reduce((s, r) => s + num(r.approved), 0), [bucketB]);

  // ─── Bucket C calculations ─────────────────────────────────────────────────
  const cTotalNGN = useMemo(() =>
    bucketC.reduce((s, r) => s + num(r.amount), 0), [bucketC]);

  const grandTotal = aTotalNGN + bTotalNGN + cTotalNGN;

  // ─── Bucket A handlers ─────────────────────────────────────────────────────
  const updateA = (id: string, field: keyof BucketARow, value: string) =>
    setBucketA(rows => rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  const addRowA = () =>
    setBucketA(rows => [...rows, { id: uid(), item: '', qtyPerHome: '', unitCost: '' }]);
  const removeRowA = (id: string) =>
    setBucketA(rows => rows.filter(r => r.id !== id));

  // ─── Bucket B handlers ─────────────────────────────────────────────────────
  const updateB = (id: string, field: keyof BucketBRow, value: string) =>
    setBucketB(rows => rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  const addRowB = () =>
    setBucketB(rows => [...rows, { id: uid(), homeId: `VH-${String(rows.length + 1).padStart(3, '0')}`, needType: '', evidence: '', cap: '', approved: '', notes: '' }]);
  const removeRowB = (id: string) =>
    setBucketB(rows => rows.filter(r => r.id !== id));

  // ─── Bucket C handlers ─────────────────────────────────────────────────────
  const updateC = (id: string, field: keyof BucketCRow, value: string) =>
    setBucketC(rows => rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  const addRowC = () =>
    setBucketC(rows => [...rows, { id: uid(), lineItem: '', description: '', amount: '' }]);
  const removeRowC = (id: string) =>
    setBucketC(rows => rows.filter(r => r.id !== id));

  const budgetData: BudgetData = { meta, bucketA, bucketB, bucketC };

  const handleReset = () => {
    if (!confirm('Reset all fields to defaults?')) return;
    setMeta(defaultMeta);
    setBucketA(defaultBucketA.map(r => ({ ...r, id: uid() })));
    setBucketB(defaultBucketB.map(r => ({ ...r, id: uid() })));
    setBucketC(defaultBucketC.map(r => ({ ...r, id: uid() })));
  };

  const handleCopySummary = () => {
    const text = [
      `Budget Summary — ${meta.cycleNameCode || 'Untitled'}`,
      `Location: ${meta.location || '—'} | FX: ₦${meta.fxRate}/$1`,
      `Target Homes: ${meta.targetHomes || '—'}`,
      `Bucket A (Core Packs): ${fmtNGN(aTotalNGN)} (${fmtUSD(aTotalNGN, fx)})`,
      `Bucket B (Casework Fund): ${fmtNGN(bTotalNGN)} (${fmtUSD(bTotalNGN, fx)})`,
      `Bucket C (Buffer + Logistics): ${fmtNGN(cTotalNGN)} (${fmtUSD(cTotalNGN, fx)})`,
      `GRAND TOTAL: ${fmtNGN(grandTotal)} (${fmtUSD(grandTotal, fx)})`,
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  const pdfFilename = `budget-template-${(meta.cycleNameCode || 'scci').replace(/\s+/g, '-').toLowerCase()}.pdf`;

  return (
    <>
      <Head>
        <title>Budget Template Generator — Saintlammy Foundation Admin</title>
      </Head>
      <AdminLayout title="Budget Template Generator">
        <div className="max-w-6xl mx-auto">

          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-gray-400 text-sm">
                Build, customize and export the Vulnerable Homes Outreach budget template as a PDF.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors border border-gray-600"
              >
                <RefreshCw className="w-4 h-4" /> Reset
              </button>
              <button
                onClick={handleCopySummary}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors border border-gray-600"
              >
                <Copy className="w-4 h-4" /> {copied ? 'Copied!' : 'Copy Summary'}
              </button>
              {pdfReady && (
                <PDFDownloadLink
                  document={<BudgetTemplatePDF data={budgetData} />}
                  fileName={pdfFilename}
                >
                  {({ loading }) => (
                    <button
                      className="flex items-center gap-2 px-5 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-accent-500/20"
                      disabled={loading}
                    >
                      {loading
                        ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating…</>
                        : <><Download className="w-4 h-4" /> Export PDF</>}
                    </button>
                  )}
                </PDFDownloadLink>
              )}
            </div>
          </div>

          {/* Live Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <StatBadge label="Bucket A — Core Packs" ngn={aTotalNGN} fx={fx} />
            <StatBadge label="Bucket B — Casework Fund" ngn={bTotalNGN} fx={fx} />
            <StatBadge label="Bucket C — Buffer/Logistics" ngn={cTotalNGN} fx={fx} />
            <StatBadge label="Grand Total" ngn={grandTotal} fx={fx} accent />
          </div>

          {/* ── Section 1: Header / Meta ── */}
          <SectionCard
            title="Header Information"
            subtitle="Outreach cycle details, location and FX rate"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field label="Outreach Cycle Name / Code" value={meta.cycleNameCode} onChange={v => setMetaField('cycleNameCode', v)} placeholder="e.g. SCCI-Q1-2026-LOS" />
              <Field label="Prepared By" value={meta.preparedBy} onChange={v => setMetaField('preparedBy', v)} placeholder="Full name" />
              <Field label="Implementation Start (Week)" value={meta.startWeek} onChange={v => setMetaField('startWeek', v)} placeholder="e.g. Week 2, Jan 2026" />
              <Field label="Date Prepared" value={meta.datePrepared} onChange={v => setMetaField('datePrepared', v)} type="date" />
              <Field label="Target Homes (Count)" value={meta.targetHomes} onChange={v => setMetaField('targetHomes', v)} type="number" placeholder="e.g. 50" hint="Used to auto-calculate total quantities" />
              <Field label="Per-Home Core Pack Cap (NGN)" value={meta.perHomeCap} onChange={v => setMetaField('perHomeCap', v)} prefix="₦" type="number" placeholder="e.g. 15000" />
              <Field label="FX Rate (NGN per $1)" value={meta.fxRate} onChange={v => setMetaField('fxRate', v)} prefix="₦" type="number" placeholder="e.g. 1600" hint="Used to calculate all USD equivalents" />
              <Field label="Location / LGA" value={meta.location} onChange={v => setMetaField('location', v)} placeholder="e.g. Lagos Island, Lagos" />
            </div>
          </SectionCard>

          {/* ── Section 2: Budget Guardrails ── */}
          <SectionCard
            title="Budget Guardrails"
            subtitle="Set cap rules for each bucket"
          >
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold text-accent-400 uppercase tracking-wider mb-3">Bucket A — Core Packs (Fixed)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Total Cap (NGN)" value={meta.bucketATotalCap} onChange={v => setMetaField('bucketATotalCap', v)} prefix="₦" type="number" placeholder="e.g. 750000" />
                  <Field label="Per-Home Cap (NGN)" value={meta.bucketAPerHomeCap} onChange={v => setMetaField('bucketAPerHomeCap', v)} prefix="₦" type="number" placeholder="e.g. 15000" />
                </div>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">Bucket B — Casework Fund (Capped)</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Total Fund Cap (NGN)" value={meta.bucketBTotalCap} onChange={v => setMetaField('bucketBTotalCap', v)} prefix="₦" type="number" placeholder="e.g. 200000" />
                  <Field label="Max Per Household (NGN)" value={meta.bucketBPerHouseholdCap} onChange={v => setMetaField('bucketBPerHouseholdCap', v)} prefix="₦" type="number" placeholder="e.g. 25000" />
                  <Field label="Number of Slots" value={meta.bucketBSlots} onChange={v => setMetaField('bucketBSlots', v)} type="number" placeholder="e.g. 10" />
                </div>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-3">Bucket C — Buffer + Logistics</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="% of (A+B)" value={meta.bucketCPercent} onChange={v => setMetaField('bucketCPercent', v)} type="number" placeholder="e.g. 20" hint="Recommended: 15–25%" />
                  <Field label="OR Fixed Amount (NGN)" value={meta.bucketCFixed} onChange={v => setMetaField('bucketCFixed', v)} prefix="₦" type="number" placeholder="e.g. 50000" />
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ── Section 3: Bucket A ── */}
          <SectionCard
            title="Bucket A — Core Packs (Raw Food + Hygiene)"
            subtitle="Items are multiplied by target homes to get total quantities"
            badge={`${aTotalNGN > 0 ? fmtNGN(aTotalNGN) : 'No totals yet'}`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-xs font-medium text-gray-400 pb-2 pr-3 w-1/4">Item</th>
                    <th className="text-right text-xs font-medium text-gray-400 pb-2 px-3 w-20">Qty / Home</th>
                    <th className="text-right text-xs font-medium text-gray-400 pb-2 px-3 w-28">Total Qty<br/><span className="text-gray-500 font-normal">(× {meta.targetHomes || '?'} homes)</span></th>
                    <th className="text-right text-xs font-medium text-gray-400 pb-2 px-3 w-32">Unit Cost (NGN)</th>
                    <th className="text-right text-xs font-medium text-gray-400 pb-2 px-3 w-32">Total (NGN)</th>
                    <th className="text-right text-xs font-medium text-gray-400 pb-2 pl-3 w-28">USD Equiv.</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody>
                  {bucketA.map((row, i) => {
                    const c = aCalc[i];
                    return (
                      <tr key={row.id} className="border-b border-gray-700/50 group">
                        <td className="py-2 pr-3">
                          <input
                            value={row.item}
                            onChange={e => updateA(row.id, 'item', e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1.5 text-white text-xs placeholder-gray-500 focus:ring-1 focus:ring-accent-500 focus:border-transparent"
                            placeholder="Item name"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            value={row.qtyPerHome}
                            onChange={e => updateA(row.id, 'qtyPerHome', e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1.5 text-white text-xs text-right placeholder-gray-500 focus:ring-1 focus:ring-accent-500 focus:border-transparent"
                            placeholder="0"
                            min="0"
                          />
                        </td>
                        <td className="py-2 px-3 text-right text-gray-300 text-xs">
                          {c.totalQty > 0 ? c.totalQty.toLocaleString() : <span className="text-gray-600">—</span>}
                        </td>
                        <td className="py-2 px-3">
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">₦</span>
                            <input
                              type="number"
                              value={row.unitCost}
                              onChange={e => updateA(row.id, 'unitCost', e.target.value)}
                              className="w-full bg-gray-700 border border-gray-600 rounded-md pl-5 pr-2 py-1.5 text-white text-xs text-right placeholder-gray-500 focus:ring-1 focus:ring-accent-500 focus:border-transparent"
                              placeholder="0.00"
                              min="0"
                            />
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right text-xs">
                          {c.total > 0
                            ? <span className="text-green-400 font-medium">{fmtNGN(c.total)}</span>
                            : <span className="text-gray-600">—</span>}
                        </td>
                        <td className="py-2 pl-3 text-right text-xs text-gray-400">
                          {c.total > 0 ? fmtUSD(c.total, fx) : <span className="text-gray-600">—</span>}
                        </td>
                        <td className="py-2 pl-2">
                          <button
                            onClick={() => removeRowA(row.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
                            title="Remove row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-600 bg-gray-700/30">
                    <td colSpan={4} className="py-2 pr-3 text-xs font-semibold text-gray-300">SUBTOTAL — Bucket A</td>
                    <td className="py-2 px-3 text-right text-xs font-bold text-white">
                      {aTotalNGN > 0 ? fmtNGN(aTotalNGN) : '—'}
                    </td>
                    <td className="py-2 pl-3 text-right text-xs font-medium text-gray-400">
                      {aTotalNGN > 0 ? fmtUSD(aTotalNGN, fx) : '—'}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
            <button
              onClick={addRowA}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg text-xs transition-colors border border-dashed border-gray-600 hover:border-gray-500"
            >
              <Plus className="w-3.5 h-3.5" /> Add Item
            </button>
          </SectionCard>

          {/* ── Section 4: Bucket B ── */}
          <SectionCard
            title="Bucket B — Casework Fund (Capped, Limited Slots)"
            subtitle="Use for a limited number of homes only. Keep a per-household cap and require evidence."
            badge={bTotalNGN > 0 ? fmtNGN(bTotalNGN) : undefined}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    {['Home ID', 'Need Type', 'Evidence / Verification', 'Cap (NGN)', 'Approved (NGN)', 'USD Equiv.', 'Notes', ''].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-gray-400 pb-2 pr-2 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bucketB.map(row => (
                    <tr key={row.id} className="border-b border-gray-700/50 group">
                      {([
                        ['homeId', 'VH-001', 'w-20'],
                        ['needType', 'Need type', 'w-36'],
                        ['evidence', 'Evidence/verification', 'w-44'],
                      ] as [keyof BucketBRow, string, string][]).map(([field, ph, w]) => (
                        <td key={field} className={`py-2 pr-2 ${w}`}>
                          <input
                            value={row[field] as string}
                            onChange={e => updateB(row.id, field, e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1.5 text-white text-xs placeholder-gray-500 focus:ring-1 focus:ring-accent-500 focus:border-transparent"
                            placeholder={ph}
                          />
                        </td>
                      ))}
                      {(['cap', 'approved'] as (keyof BucketBRow)[]).map(field => (
                        <td key={field} className="py-2 pr-2 w-28">
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">₦</span>
                            <input
                              type="number"
                              value={row[field] as string}
                              onChange={e => updateB(row.id, field, e.target.value)}
                              className="w-full bg-gray-700 border border-gray-600 rounded-md pl-5 pr-2 py-1.5 text-white text-xs text-right placeholder-gray-500 focus:ring-1 focus:ring-accent-500 focus:border-transparent"
                              placeholder="0.00"
                              min="0"
                            />
                          </div>
                        </td>
                      ))}
                      <td className="py-2 pr-2 text-right text-xs text-gray-400 w-24">
                        {num(row.approved) > 0 ? fmtUSD(num(row.approved), fx) : <span className="text-gray-600">—</span>}
                      </td>
                      <td className="py-2 pr-2 w-36">
                        <input
                          value={row.notes}
                          onChange={e => updateB(row.id, 'notes', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1.5 text-white text-xs placeholder-gray-500 focus:ring-1 focus:ring-accent-500 focus:border-transparent"
                          placeholder="Notes…"
                        />
                      </td>
                      <td className="py-2">
                        <button
                          onClick={() => removeRowB(row.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-600 bg-gray-700/30">
                    <td colSpan={3} className="py-2 pr-2 text-xs font-semibold text-gray-300">SUBTOTAL — Bucket B</td>
                    <td />
                    <td className="py-2 pr-2 text-right text-xs font-bold text-white">
                      {bTotalNGN > 0 ? fmtNGN(bTotalNGN) : '—'}
                    </td>
                    <td className="py-2 pr-2 text-right text-xs font-medium text-gray-400">
                      {bTotalNGN > 0 ? fmtUSD(bTotalNGN, fx) : '—'}
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>
            <button
              onClick={addRowB}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg text-xs transition-colors border border-dashed border-gray-600 hover:border-gray-500"
            >
              <Plus className="w-3.5 h-3.5" /> Add Home / Case
            </button>
          </SectionCard>

          {/* ── Section 5: Bucket C ── */}
          <SectionCard
            title="Bucket C — Buffer + Logistics"
            subtitle="Price volatility, transport, packaging. Recommended: 15–25% of (A+B)."
            badge={cTotalNGN > 0 ? fmtNGN(cTotalNGN) : undefined}
          >
            {meta.bucketCPercent && (aTotalNGN + bTotalNGN) > 0 && (
              <div className="mb-4 flex items-center gap-2 text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-lg px-4 py-2">
                <Info className="w-4 h-4 flex-shrink-0" />
                Suggested buffer ({meta.bucketCPercent}% of A+B):{' '}
                <strong>{fmtNGN((aTotalNGN + bTotalNGN) * num(meta.bucketCPercent) / 100)}</strong>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-xs font-medium text-gray-400 pb-2 pr-3 w-1/3">Line Item</th>
                    <th className="text-left text-xs font-medium text-gray-400 pb-2 pr-3 w-1/3">Description</th>
                    <th className="text-right text-xs font-medium text-gray-400 pb-2 px-3 w-36">Amount (NGN)</th>
                    <th className="text-right text-xs font-medium text-gray-400 pb-2 pl-3 w-28">USD Equiv.</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody>
                  {bucketC.map(row => (
                    <tr key={row.id} className="border-b border-gray-700/50 group">
                      <td className="py-2 pr-3">
                        <input
                          value={row.lineItem}
                          onChange={e => updateC(row.id, 'lineItem', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1.5 text-white text-xs placeholder-gray-500 focus:ring-1 focus:ring-accent-500 focus:border-transparent"
                          placeholder="Line item"
                        />
                      </td>
                      <td className="py-2 pr-3">
                        <input
                          value={row.description}
                          onChange={e => updateC(row.id, 'description', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1.5 text-white text-xs placeholder-gray-500 focus:ring-1 focus:ring-accent-500 focus:border-transparent"
                          placeholder="Description / notes"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">₦</span>
                          <input
                            type="number"
                            value={row.amount}
                            onChange={e => updateC(row.id, 'amount', e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md pl-5 pr-2 py-1.5 text-white text-xs text-right placeholder-gray-500 focus:ring-1 focus:ring-accent-500 focus:border-transparent"
                            placeholder="0.00"
                            min="0"
                          />
                        </div>
                      </td>
                      <td className="py-2 pl-3 text-right text-xs text-gray-400">
                        {num(row.amount) > 0 ? fmtUSD(num(row.amount), fx) : <span className="text-gray-600">—</span>}
                      </td>
                      <td className="py-2 pl-2">
                        <button
                          onClick={() => removeRowC(row.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-600 bg-gray-700/30">
                    <td colSpan={2} className="py-2 pr-3 text-xs font-semibold text-gray-300">SUBTOTAL — Bucket C</td>
                    <td className="py-2 px-3 text-right text-xs font-bold text-white">
                      {cTotalNGN > 0 ? fmtNGN(cTotalNGN) : '—'}
                    </td>
                    <td className="py-2 pl-3 text-right text-xs font-medium text-gray-400">
                      {cTotalNGN > 0 ? fmtUSD(cTotalNGN, fx) : '—'}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
            <button
              onClick={addRowC}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg text-xs transition-colors border border-dashed border-gray-600 hover:border-gray-500"
            >
              <Plus className="w-3.5 h-3.5" /> Add Line Item
            </button>
          </SectionCard>

          {/* ── Section 6: Budget Summary ── */}
          <SectionCard title="Budget Summary" subtitle="Auto-calculated totals across all buckets">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Summary table */}
              <div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left text-xs font-medium text-gray-400 pb-2 pr-3">Bucket</th>
                      <th className="text-right text-xs font-medium text-gray-400 pb-2 px-3">Total (NGN)</th>
                      <th className="text-right text-xs font-medium text-gray-400 pb-2 pl-3">USD Equivalent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'A. Core Packs', ngn: aTotalNGN, color: 'text-green-400' },
                      { label: 'B. Casework Fund', ngn: bTotalNGN, color: 'text-blue-400' },
                      { label: 'C. Buffer + Logistics', ngn: cTotalNGN, color: 'text-yellow-400' },
                    ].map((r, i) => (
                      <tr key={r.label} className={`border-b border-gray-700/50 ${i % 2 === 0 ? '' : 'bg-gray-700/20'}`}>
                        <td className="py-2.5 pr-3 text-sm text-gray-300">{r.label}</td>
                        <td className={`py-2.5 px-3 text-right text-sm font-medium ${r.ngn > 0 ? r.color : 'text-gray-600'}`}>
                          {r.ngn > 0 ? fmtNGN(r.ngn) : '—'}
                        </td>
                        <td className="py-2.5 pl-3 text-right text-sm text-gray-400">
                          {r.ngn > 0 ? fmtUSD(r.ngn, fx) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-accent-500/50 bg-accent-500/10">
                      <td className="py-3 pr-3 text-sm font-bold text-white">GRAND TOTAL</td>
                      <td className="py-3 px-3 text-right text-sm font-bold text-accent-400">
                        {grandTotal > 0 ? fmtNGN(grandTotal) : '—'}
                      </td>
                      <td className="py-3 pl-3 text-right text-sm font-medium text-gray-300">
                        {grandTotal > 0 ? fmtUSD(grandTotal, fx) : '—'}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Signature fields */}
              <div className="space-y-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Signatures</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Field label="Prepared By (Name/Signature)" value={meta.preparedBy} onChange={v => setMetaField('preparedBy', v)} placeholder="Full name" />
                    <div className="mt-3">
                      <Field label="Date" value={meta.preparedDate} onChange={v => setMetaField('preparedDate', v)} type="date" />
                    </div>
                  </div>
                  <div>
                    <Field label="Approved By (Name/Signature)" value={meta.approvedBy} onChange={v => setMetaField('approvedBy', v)} placeholder="Full name" />
                    <div className="mt-3">
                      <Field label="Date" value={meta.approvedDate} onChange={v => setMetaField('approvedDate', v)} type="date" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-700/30 rounded-lg border border-gray-700 text-xs text-gray-400">
                  <strong className="text-gray-300">Note:</strong> Record NGN and USD equivalents for transparency. Keep evidence (quotes, receipts, confirmations) archived with the final outreach report.
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Bottom Export Button */}
          <div className="flex justify-center pb-8">
            {pdfReady && (
              <PDFDownloadLink
                document={<BudgetTemplatePDF data={budgetData} />}
                fileName={pdfFilename}
              >
                {({ loading }) => (
                  <button
                    className="flex items-center gap-3 px-8 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-xl shadow-accent-500/25"
                    disabled={loading}
                  >
                    {loading
                      ? <><RefreshCw className="w-5 h-5 animate-spin" /> Generating PDF…</>
                      : <><FileText className="w-5 h-5" /> Export as PDF</>}
                  </button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
