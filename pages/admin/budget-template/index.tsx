import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Plus, Trash2, Download, FileText, ChevronDown, ChevronUp,
  RefreshCw, Copy, Info, Settings, GripVertical, Edit3,
  ToggleLeft, ToggleRight, Eye, EyeOff, Save, FolderOpen, Check, AlertCircle, Loader2
} from 'lucide-react';
import type {
  BudgetDocumentData, BudgetTemplateMeta, Bucket, BucketColumn, BucketRow, Guardrail
} from '@/types/budget';

// ─── Types for saved templates ─────────────────────────────────────────────────
interface SavedTemplate {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// ─── Dynamic imports (avoid SSR) ──────────────────────────────────────────────
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

const fmtPrimary = (v: number, sym: string) =>
  v === 0 ? '—' : `${sym}${v.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtSecondary = (v: number, fx: number, sym: string) =>
  fx > 0 && v > 0
    ? `${sym}${(v / fx).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : '—';

// Compute cell value for display in the UI table
const computeDisplayValue = (
  col: BucketColumn,
  row: BucketRow,
  cols: BucketColumn[],
  multiplier: number,
  primarySym: string,
  secondarySym: string,
  fxRate: number
): string => {
  if (!col.compute) return '';
  if (col.compute === 'qty_total') {
    const qtyCol = cols.find(c => c.type === 'number' && !c.compute);
    if (!qtyCol) return '';
    const q = num(row[qtyCol.key]);
    return multiplier > 0 && q > 0 ? String(q * multiplier) : '';
  }
  if (col.compute === 'row_total') {
    const qtyCol = cols.find(c => c.type === 'number' && !c.compute);
    const priceCol = cols.find(c => c.type === 'currency' && !c.compute);
    if (!qtyCol || !priceCol) return '';
    const qty = num(row[qtyCol.key]);
    const totalQty = multiplier > 0 ? qty * multiplier : qty;
    const total = totalQty * num(row[priceCol.key]);
    return total > 0 ? fmtPrimary(total, primarySym) : '';
  }
  if (col.compute === 'usd_equiv') {
    const qtyCol = cols.find(c => c.type === 'number' && !c.compute);
    const priceCol = cols.find(c => c.type === 'currency' && !c.compute);
    if (qtyCol && priceCol) {
      const qty = num(row[qtyCol.key]);
      const totalQty = multiplier > 0 ? qty * multiplier : qty;
      const total = totalQty * num(row[priceCol.key]);
      return fmtSecondary(total, fxRate, secondarySym);
    }
  }
  if (col.compute === 'usd_approved') {
    const srcCol = cols.find(c => c.type === 'currency' && !c.compute && c.key.toLowerCase().includes('approv'))
      ?? cols.filter(c => c.type === 'currency' && !c.compute).slice(-1)[0];
    if (srcCol) return fmtSecondary(num(row[srcCol.key]), fxRate, secondarySym);
  }
  return '';
};

const bucketTotal = (bucket: Bucket): number => {
  const key = bucket.approvedKey ?? bucket.totalKey;
  if (key) return bucket.rows.reduce((s, r) => s + num(r[key]), 0);
  const currCols = bucket.columns.filter(c => c.type === 'currency' && !c.compute);
  if (!currCols.length) return 0;
  const lastKey = currCols[currCols.length - 1].key;
  return bucket.rows.reduce((s, r) => s + num(r[lastKey]), 0);
};

// ─── Column type options ────────────────────────────────────────────────────────
const COL_TYPES: { value: BucketColumn['type']; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'currency', label: 'Currency (primary)' },
  { value: 'computed', label: 'Computed (auto)' },
];
const COMPUTE_OPTIONS: { value: NonNullable<BucketColumn['compute']>; label: string }[] = [
  { value: 'qty_total', label: 'Total Qty (qty × multiplier)' },
  { value: 'row_total', label: 'Row Total (qty × multiplier × price)' },
  { value: 'usd_equiv', label: 'Secondary Currency (from row total)' },
  { value: 'usd_approved', label: 'Secondary Currency (from approved/last currency col)' },
];

// ─── Default data (Saintlammy Foundation Vulnerable Homes template) ───────────
const makeDefaultMeta = (): BudgetTemplateMeta => ({
  orgName: 'Saintlammy Foundation / Saintlammy Community Care Initiative (SCCI)',
  templateTitle: 'Budget Template',
  templateSubtitle: 'Vulnerable Homes Outreach — Q1 2026',
  tagline: 'Use this template to budget with 3 buckets: Core Packs (fixed), Casework Fund (capped), and Buffer/Logistics (volatility protection).',
  metaFields: [
    { label: 'Outreach Cycle Name / Code', value: '' },
    { label: 'Prepared By', value: '' },
    { label: 'Implementation Start (Week)', value: '' },
    { label: 'Date Prepared', value: '' },
    { label: 'Target Homes (Count)', value: '' },
    { label: 'Per-Home Core Pack Cap (NGN)', value: '' },
    { label: 'FX Rate Used (NGN per $1)', value: '1600' },
    { label: 'Location / LGA', value: '' },
  ],
  primaryCurrency: 'NGN',
  primarySymbol: '₦',
  secondaryCurrency: 'USD',
  secondarySymbol: '$',
  fxRate: '1600',
  showGuardrails: true,
  guardrails: [
    { bucket: 'A. Core Packs (Fixed)', purpose: 'Raw food + hygiene for all homes', cap: '', notes: 'Keep this predictable and scalable.' },
    { bucket: 'B. Casework Fund (Capped)', purpose: 'School fees, cash support, rent buffer, micro-restart (limited slots)', cap: '', notes: 'Evidence-based; pay direct where possible.' },
    { bucket: 'C. Buffer + Logistics', purpose: 'Price swings, transport, packaging, misc', cap: '', notes: 'Prevents derailment when market prices swing.' },
  ],
  preparedBy: '',
  preparedDate: '',
  approvedBy: '',
  approvedDate: '',
  footerNote: 'Note: Record NGN and USD equivalents for transparency. Keep evidence (quotes, receipts, confirmations) archived with the final outreach report.',
  multiplierLabel: 'homes',
  multiplierValue: '',
});

const makeDefaultBuckets = (): Bucket[] => [
  {
    id: uid(),
    name: 'Bucket A — Core Packs (Raw Food + Hygiene)',
    subtitle: 'List items first, then market-research unit costs to stay within the per-home cap.',
    totalKey: 'unitCost',
    columns: [
      { key: 'item', label: 'Item', type: 'text', width: '22%' },
      { key: 'qtyPerHome', label: 'Qty / Home', type: 'number', width: '11%', align: 'right' },
      { key: 'totalQty', label: 'Total Qty (All)', type: 'computed', width: '13%', align: 'right', compute: 'qty_total' },
      { key: 'unitCost', label: 'Unit Cost (NGN)', type: 'currency', width: '17%', align: 'right' },
      { key: 'rowTotal', label: 'Total (NGN)', type: 'computed', width: '18%', align: 'right', compute: 'row_total' },
      { key: 'usd', label: 'USD Equiv.', type: 'computed', width: '19%', align: 'right', compute: 'usd_equiv' },
    ],
    rows: [
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
    ],
  },
  {
    id: uid(),
    name: 'Bucket B — Casework Fund (Capped, Limited Slots)',
    subtitle: 'Use for a limited number of homes only. Keep a per-household cap and require evidence.',
    approvedKey: 'approved',
    columns: [
      { key: 'homeId', label: 'Home ID', type: 'text', width: '11%' },
      { key: 'needType', label: 'Need Type', type: 'text', width: '19%' },
      { key: 'evidence', label: 'Evidence / Verification', type: 'text', width: '21%' },
      { key: 'cap', label: 'Cap (NGN)', type: 'currency', width: '13%', align: 'right' },
      { key: 'approved', label: 'Approved (NGN)', type: 'currency', width: '14%', align: 'right' },
      { key: 'usd', label: 'USD Equiv.', type: 'computed', width: '13%', align: 'right', compute: 'usd_approved' },
      { key: 'notes', label: 'Notes', type: 'text', width: '9%' },
    ],
    rows: [
      { id: uid(), homeId: 'VH-001', needType: 'School Fees / Tuition', evidence: 'Invoice / Call school / receipt', cap: '', approved: '', notes: '' },
      { id: uid(), homeId: 'VH-002', needType: 'School Supplies / Uniform', evidence: 'Photo / school list / receipt', cap: '', approved: '', notes: '' },
      { id: uid(), homeId: 'VH-003', needType: 'Transport Support (time-bound)', evidence: 'Agreement / follow-up plan', cap: '', approved: '', notes: '' },
      { id: uid(), homeId: 'VH-004', needType: 'Rent-at-risk Buffer', evidence: 'Landlord/agent confirmation', cap: '', approved: '', notes: '' },
      { id: uid(), homeId: 'VH-005', needType: 'Micro-income Restart (in-kind)', evidence: 'Plan + item list + receipt', cap: '', approved: '', notes: '' },
    ],
  },
  {
    id: uid(),
    name: 'Bucket C — Buffer + Logistics',
    subtitle: 'Price swings, transport, packaging, misc. Recommended: 15–25% of (A+B).',
    totalKey: 'amount',
    columns: [
      { key: 'lineItem', label: 'Line Item', type: 'text', width: '30%' },
      { key: 'description', label: 'Description', type: 'text', width: '34%' },
      { key: 'amount', label: 'Amount (NGN)', type: 'currency', width: '22%', align: 'right' },
      { key: 'usd', label: 'USD Equiv.', type: 'computed', width: '14%', align: 'right', compute: 'usd_equiv' },
    ],
    rows: [
      { id: uid(), lineItem: 'Transport (delivery + distribution)', description: 'Fuel, vehicle hire, driver', amount: '' },
      { id: uid(), lineItem: 'Packaging (bags, labels, markers)', description: 'Polythene bags, stickers, markers', amount: '' },
      { id: uid(), lineItem: 'Volunteer logistics (water, small support)', description: 'Water, snacks for volunteers', amount: '' },
      { id: uid(), lineItem: 'Contingency / Price Volatility Buffer', description: 'Recommended 15–25% of (A+B)', amount: '' },
    ],
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

const SectionCard: React.FC<{
  title: string; subtitle?: string; badge?: string;
  children: React.ReactNode; defaultOpen?: boolean;
  actions?: React.ReactNode;
}> = ({ title, subtitle, badge, children, defaultOpen = true, actions }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-visible mb-5">
      <div className="flex items-center justify-between px-5 py-3.5 bg-gray-800 border-b border-gray-700 rounded-t-xl">
        <button onClick={() => setOpen(o => !o)} className="flex items-center gap-3 flex-1 text-left">
          <div className="w-1.5 h-5 bg-accent-500 rounded-full flex-shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">{title}</span>
              {badge && <span className="px-2 py-0.5 text-xs bg-accent-500/20 text-accent-400 rounded-full border border-accent-500/30">{badge}</span>}
            </div>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
        </button>
        <div className="flex items-center gap-2">
          {actions}
          <button onClick={() => setOpen(o => !o)} className="p-1 text-gray-500 hover:text-gray-300">
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {open && <div className="p-5">{children}</div>}
    </div>
  );
};

const InlineInput: React.FC<{
  value: string; onChange: (v: string) => void;
  className?: string; placeholder?: string; type?: string;
}> = ({ value, onChange, className = '', placeholder, type = 'text' }) => (
  <input
    type={type}
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder ?? ''}
    className={`bg-gray-700 border border-gray-600 rounded-md px-2 py-1.5 text-white text-xs placeholder-gray-500
      focus:ring-1 focus:ring-accent-500 focus:border-transparent transition-colors ${className}`}
  />
);

const Field: React.FC<{
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; hint?: string; prefix?: string;
}> = ({ label, value, onChange, placeholder, type = 'text', hint, prefix }) => (
  <div>
    <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
    <div className="relative">
      {prefix && <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none">{prefix}</span>}
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

const StatBadge: React.FC<{ label: string; primary: number; sym: string; secSym: string; fx: number; accent?: boolean }> = ({
  label, primary, sym, secSym, fx: fxRate, accent
}) => (
  <div className={`rounded-lg px-4 py-3 border ${accent ? 'bg-accent-500/10 border-accent-500/30' : 'bg-gray-700/50 border-gray-600'}`}>
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className={`text-base font-bold ${accent ? 'text-accent-400' : 'text-white'}`}>
      {primary > 0 ? fmtPrimary(primary, sym) : '—'}
    </p>
    <p className="text-xs text-gray-500">{primary > 0 ? fmtSecondary(primary, fxRate, secSym) : '—'}</p>
  </div>
);

// ─── Column Editor Modal ───────────────────────────────────────────────────────

const ColumnEditor: React.FC<{
  columns: BucketColumn[];
  onChange: (cols: BucketColumn[]) => void;
}> = ({ columns, onChange }) => {
  const updateCol = (key: string, field: keyof BucketColumn, value: string) =>
    onChange(columns.map(c => c.key === key ? { ...c, [field]: value } : c));
  const removeCol = (key: string) => onChange(columns.filter(c => c.key !== key));
  const addCol = () => onChange([...columns, {
    key: uid(), label: 'New Column', type: 'text', width: '15%', align: 'left'
  }]);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[1fr_1fr_80px_80px_80px_28px] gap-2 text-xs text-gray-500 font-medium px-1">
        <span>Label</span><span>Type</span><span>Width</span><span>Align</span><span>Compute (if type=computed)</span><span />
      </div>
      {columns.map(col => (
        <div key={col.key} className="grid grid-cols-[1fr_1fr_80px_80px_80px_28px] gap-2 items-center">
          <InlineInput value={col.label} onChange={v => updateCol(col.key, 'label', v)} placeholder="Column label" className="w-full" />
          <select
            value={col.type}
            onChange={e => updateCol(col.key, 'type', e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-md px-2 py-1.5 text-white text-xs focus:ring-1 focus:ring-accent-500"
          >
            {COL_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <InlineInput value={col.width} onChange={v => updateCol(col.key, 'width', v)} placeholder="20%" className="w-full" />
          <select
            value={col.align ?? 'left'}
            onChange={e => updateCol(col.key, 'align', e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-md px-2 py-1.5 text-white text-xs focus:ring-1 focus:ring-accent-500"
          >
            <option value="left">Left</option>
            <option value="right">Right</option>
            <option value="center">Center</option>
          </select>
          {col.type === 'computed' ? (
            <select
              value={col.compute ?? ''}
              onChange={e => updateCol(col.key, 'compute', e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-md px-2 py-1.5 text-white text-xs focus:ring-1 focus:ring-accent-500"
            >
              <option value="">— pick —</option>
              {COMPUTE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ) : <div />}
          <button onClick={() => removeCol(col.key)} className="p-1 rounded text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button
        onClick={addCol}
        className="mt-1 flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white rounded-md text-xs transition-colors border border-dashed border-gray-600"
      >
        <Plus className="w-3 h-3" /> Add Column
      </button>
    </div>
  );
};

// ─── Bucket Section ────────────────────────────────────────────────────────────

const BucketSection: React.FC<{
  bucket: Bucket;
  meta: BudgetTemplateMeta;
  onUpdate: (b: Bucket) => void;
  onRemove: () => void;
  index: number;
}> = ({ bucket, meta, onUpdate, onRemove, index }) => {
  const [editCols, setEditCols] = useState(false);
  const fxRate = num(meta.fxRate);
  const multiplier = num(meta.multiplierValue);
  const sym = meta.primarySymbol || '₦';
  const secSym = meta.secondarySymbol || '$';

  const total = useMemo(() => bucketTotal(bucket), [bucket]);

  const updateRow = (id: string, key: string, value: string) =>
    onUpdate({ ...bucket, rows: bucket.rows.map(r => r.id === id ? { ...r, [key]: value } : r) });
  const addRow = () => {
    const emptyRow: BucketRow = { id: uid() };
    bucket.columns.filter(c => c.type !== 'computed').forEach(c => { emptyRow[c.key] = ''; });
    onUpdate({ ...bucket, rows: [...bucket.rows, emptyRow] });
  };
  const removeRow = (id: string) =>
    onUpdate({ ...bucket, rows: bucket.rows.filter(r => r.id !== id) });

  const editableCols = bucket.columns.filter(c => c.type !== 'computed');
  const allCols = bucket.columns;

  return (
    <SectionCard
      title={bucket.name}
      subtitle={bucket.subtitle}
      badge={total > 0 ? fmtPrimary(total, sym) : undefined}
      actions={
        <div className="flex items-center gap-1">
          <button
            onClick={() => setEditCols(e => !e)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors border ${editCols ? 'bg-accent-500/20 text-accent-400 border-accent-500/40' : 'bg-gray-700 text-gray-400 border-gray-600 hover:bg-gray-600'}`}
            title="Edit columns"
          >
            <Settings className="w-3 h-3" /> Columns
          </button>
          <button
            onClick={() => confirm(`Remove "${bucket.name}"?`) && onRemove()}
            className="p-1 rounded text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
            title="Remove this bucket"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      }
    >
      {/* Bucket name & subtitle editing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Bucket / Section Name</label>
          <InlineInput
            value={bucket.name}
            onChange={v => onUpdate({ ...bucket, name: v })}
            placeholder="e.g. Bucket A — Core Packs"
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Subtitle / Tip</label>
          <InlineInput
            value={bucket.subtitle ?? ''}
            onChange={v => onUpdate({ ...bucket, subtitle: v })}
            placeholder="Shown as tip text in the PDF header"
            className="w-full"
          />
        </div>
      </div>

      {/* Column editor */}
      {editCols && (
        <div className="mb-4 p-4 bg-gray-700/40 rounded-lg border border-gray-600">
          <p className="text-xs font-semibold text-accent-400 mb-3 uppercase tracking-wider">Column Structure</p>
          <ColumnEditor
            columns={bucket.columns}
            onChange={cols => onUpdate({ ...bucket, columns: cols })}
          />
        </div>
      )}

      {/* Data table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-700">
              {allCols.map(col => (
                <th key={col.key} className={`pb-2 pr-2 font-medium text-gray-400 ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                  {col.label}
                  {col.type === 'computed' && <span className="ml-1 text-gray-600 text-xs">(auto)</span>}
                </th>
              ))}
              <th className="w-7" />
            </tr>
          </thead>
          <tbody>
            {bucket.rows.map(row => (
              <tr key={row.id} className="border-b border-gray-700/40 group">
                {allCols.map(col => (
                  <td key={col.key} className="py-1.5 pr-2">
                    {col.type === 'computed' ? (
                      <span className={`text-xs ${col.compute?.includes('usd') ? 'text-gray-400' : 'text-green-400 font-medium'}`}>
                        {computeDisplayValue(col, row, allCols, multiplier, sym, secSym, fxRate) || <span className="text-gray-600">—</span>}
                      </span>
                    ) : col.type === 'currency' ? (
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none">{sym}</span>
                        <input
                          type="number"
                          value={row[col.key] ?? ''}
                          onChange={e => updateRow(row.id, col.key, e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded pl-5 pr-2 py-1.5 text-white text-xs text-right focus:ring-1 focus:ring-accent-500 focus:border-transparent"
                          placeholder="0.00" min="0"
                        />
                      </div>
                    ) : col.type === 'number' ? (
                      <input
                        type="number"
                        value={row[col.key] ?? ''}
                        onChange={e => updateRow(row.id, col.key, e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-white text-xs text-right focus:ring-1 focus:ring-accent-500 focus:border-transparent"
                        placeholder="0" min="0"
                      />
                    ) : (
                      <input
                        type="text"
                        value={row[col.key] ?? ''}
                        onChange={e => updateRow(row.id, col.key, e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-white text-xs focus:ring-1 focus:ring-accent-500 focus:border-transparent"
                        placeholder="—"
                      />
                    )}
                  </td>
                ))}
                <td className="py-1.5">
                  <button
                    onClick={() => removeRow(row.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-600 bg-gray-700/30">
              <td colSpan={editableCols.length} className="py-2 pr-2 text-xs font-semibold text-gray-300">
                SUBTOTAL — {bucket.name.split('—')[0].trim()}
              </td>
              {allCols.slice(editableCols.length).map((col, i, arr) => (
                <td key={col.key} className="py-2 pr-2 text-right text-xs">
                  {col.type === 'computed' && col.compute?.includes('usd') && total > 0
                    ? <span className="text-gray-400 font-medium">{fmtSecondary(total, fxRate, secSym)}</span>
                    : i === 0 && total > 0
                    ? <span className="text-white font-bold">{fmtPrimary(total, sym)}</span>
                    : null}
                </td>
              ))}
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
      <button
        onClick={addRow}
        className="mt-3 flex items-center gap-1.5 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white rounded-lg text-xs transition-colors border border-dashed border-gray-600"
      >
        <Plus className="w-3.5 h-3.5" /> Add Row
      </button>
    </SectionCard>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function BudgetTemplatePage() {
  const [meta, setMeta] = useState<BudgetTemplateMeta>(makeDefaultMeta);
  const [buckets, setBuckets] = useState<Bucket[]>(makeDefaultBuckets);
  const [pdfReady, setPdfReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // ── Persistence state ──────────────────────────────────────────────────────
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [currentTemplateId, setCurrentTemplateId] = useState<string | null>(null);
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState('');
  const [showLoadPanel, setShowLoadPanel] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { setPdfReady(true); }, []);

  // Load list of saved templates on mount
  useEffect(() => {
    fetchTemplateList();
  }, []);

  const fetchTemplateList = async () => {
    setLoadingTemplates(true);
    try {
      const res = await fetch('/api/admin/budget-templates');
      if (res.ok) {
        const json = await res.json();
        setSavedTemplates(json.data || []);
      }
    } catch (e) {
      // silently ignore — list is non-critical
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleSave = async () => {
    if (!templateName.trim()) {
      setSaveError('Please enter a template name before saving.');
      return;
    }
    setSaveStatus('saving');
    setSaveError('');

    const payload: BudgetDocumentData = { meta, buckets };
    try {
      let res: Response;
      if (currentTemplateId) {
        // Update existing
        res = await fetch('/api/admin/budget-templates', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: currentTemplateId,
            name: templateName.trim(),
            description: templateDescription.trim(),
            data: payload,
          }),
        });
      } else {
        // Create new
        res = await fetch('/api/admin/budget-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: templateName.trim(),
            description: templateDescription.trim(),
            data: payload,
          }),
        });
      }

      const json = await res.json();
      if (!res.ok) {
        setSaveStatus('error');
        setSaveError(json.error || json.message || 'Save failed');
        return;
      }

      if (!currentTemplateId) {
        setCurrentTemplateId(json.data?.id ?? null);
      }
      setSaveStatus('saved');
      fetchTemplateList();
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (e) {
      setSaveStatus('error');
      setSaveError(e instanceof Error ? e.message : 'Network error');
    }
  };

  const handleLoad = async (id: string) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/budget-templates?id=${id}`);
      const json = await res.json();
      if (!res.ok) {
        alert(json.error || 'Failed to load template');
        return;
      }
      const templateData = json.data?.data as BudgetDocumentData | undefined;
      if (templateData?.meta) setMeta(templateData.meta);
      if (templateData?.buckets) setBuckets(templateData.buckets);
      setCurrentTemplateId(id);
      const found = savedTemplates.find(t => t.id === id);
      if (found) {
        setTemplateName(found.name);
        setTemplateDescription(found.description || '');
      }
      setShowLoadPanel(false);
    } catch (e) {
      alert('Failed to load template');
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete template "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/budget-templates?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (currentTemplateId === id) {
          setCurrentTemplateId(null);
          setTemplateName('');
          setTemplateDescription('');
        }
        fetchTemplateList();
      } else {
        const json = await res.json();
        alert(json.error || 'Failed to delete template');
      }
    } catch {
      alert('Failed to delete template');
    } finally {
      setDeletingId(null);
    }
  };

  const handleNewTemplate = () => {
    if (!confirm('Start a new template? Unsaved changes will be lost.')) return;
    setMeta(makeDefaultMeta());
    setBuckets(makeDefaultBuckets());
    setCurrentTemplateId(null);
    setTemplateName('');
    setTemplateDescription('');
    setSaveStatus('idle');
    setSaveError('');
  };

  const setMetaField = useCallback(<K extends keyof BudgetTemplateMeta>(k: K, v: BudgetTemplateMeta[K]) =>
    setMeta(m => ({ ...m, [k]: v })), []);

  const fxRate = num(meta.fxRate);
  const sym = meta.primarySymbol || meta.primaryCurrency;
  const secSym = meta.secondarySymbol || meta.secondaryCurrency;

  const totals = useMemo(() => buckets.map(b => bucketTotal(b)), [buckets]);
  const grandTotal = useMemo(() => totals.reduce((s, v) => s + v, 0), [totals]);

  const updateBucket = (id: string, updated: Bucket) =>
    setBuckets(bs => bs.map(b => b.id === id ? updated : b));
  const removeBucket = (id: string) =>
    setBuckets(bs => bs.filter(b => b.id !== id));
  const addBucket = () =>
    setBuckets(bs => [...bs, {
      id: uid(),
      name: `Bucket ${String.fromCharCode(65 + bs.length)} — New Section`,
      subtitle: '',
      totalKey: 'amount',
      columns: [
        { key: 'item', label: 'Item', type: 'text', width: '40%' },
        { key: 'amount', label: `Amount (${meta.primaryCurrency})`, type: 'currency', width: '35%', align: 'right' },
        { key: 'usd', label: `${meta.secondaryCurrency} Equiv.`, type: 'computed', width: '25%', align: 'right', compute: 'usd_approved' },
      ],
      rows: [{ id: uid(), item: '', amount: '' }],
    }]);

  // Meta fields CRUD
  const updateMetaField = (i: number, field: 'label' | 'value', v: string) =>
    setMetaField('metaFields', meta.metaFields.map((f, idx) => idx === i ? { ...f, [field]: v } : f));
  const addMetaField = () =>
    setMetaField('metaFields', [...meta.metaFields, { label: 'Field', value: '' }]);
  const removeMetaField = (i: number) =>
    setMetaField('metaFields', meta.metaFields.filter((_, idx) => idx !== i));

  // Guardrails CRUD
  const updateGuardrail = (i: number, field: keyof Guardrail, v: string) =>
    setMetaField('guardrails', meta.guardrails.map((g, idx) => idx === i ? { ...g, [field]: v } : g));
  const addGuardrail = () =>
    setMetaField('guardrails', [...meta.guardrails, { bucket: '', purpose: '', cap: '', notes: '' }]);
  const removeGuardrail = (i: number) =>
    setMetaField('guardrails', meta.guardrails.filter((_, idx) => idx !== i));

  const handleReset = () => {
    if (!confirm('Reset everything to defaults? This will clear the current budget but keep your saved templates.')) return;
    setMeta(makeDefaultMeta());
    setBuckets(makeDefaultBuckets());
    setCurrentTemplateId(null);
    setTemplateName('');
    setTemplateDescription('');
    setSaveStatus('idle');
    setSaveError('');
  };

  const handleCopy = () => {
    const lines = [
      `${meta.templateTitle}${meta.templateSubtitle ? ' — ' + meta.templateSubtitle : ''}`,
      `Org: ${meta.orgName}`,
      '',
      ...buckets.map((b, i) => `${b.name}: ${fmtPrimary(totals[i], sym)} (${fmtSecondary(totals[i], fxRate, secSym)})`),
      '',
      `GRAND TOTAL: ${fmtPrimary(grandTotal, sym)} (${fmtSecondary(grandTotal, fxRate, secSym)})`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const docData: BudgetDocumentData = { meta, buckets };
  const pdfFilename = `budget-${(meta.templateSubtitle || meta.templateTitle).replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '').toLowerCase()}.pdf`;

  const ExportButton = ({ large = false }) => pdfReady ? (
    <PDFDownloadLink document={<BudgetTemplatePDF data={docData} />} fileName={pdfFilename}>
      {({ loading }) => (
        <button
          disabled={loading}
          className={`flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-medium transition-colors shadow-lg shadow-accent-500/20
            ${large ? 'px-8 py-3 rounded-xl text-sm' : 'px-4 py-2 rounded-lg text-sm'}`}
        >
          {loading
            ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating…</>
            : <><Download className="w-4 h-4" /> Export PDF</>}
        </button>
      )}
    </PDFDownloadLink>
  ) : null;

  return (
    <>
      <Head>
        <title>Budget Template Generator — Admin</title>
      </Head>
      <AdminLayout title="Budget Template Generator">
        <div className="max-w-6xl mx-auto">

          {/* ── Save / Load bar ─────────────────────────────────────────── */}
          <div className="mb-4 p-4 bg-gray-800 rounded-xl border border-gray-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Template name */}
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={templateName}
                  onChange={e => { setTemplateName(e.target.value); setSaveError(''); }}
                  placeholder="Template name (required to save)…"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors"
                />
                {currentTemplateId && (
                  <p className="text-xs text-accent-400 mt-1">Editing saved template — Save will update it in-place.</p>
                )}
                {saveError && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {saveError}
                  </p>
                )}
              </div>
              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Save */}
                <button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors border
                    ${saveStatus === 'saved'
                      ? 'bg-green-500/10 text-green-400 border-green-500/30'
                      : saveStatus === 'error'
                      ? 'bg-red-500/10 text-red-400 border-red-500/30'
                      : 'bg-accent-500 hover:bg-accent-600 text-white border-transparent shadow-lg shadow-accent-500/20'}`}
                >
                  {saveStatus === 'saving' && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saveStatus === 'saved' && <Check className="w-4 h-4" />}
                  {saveStatus === 'error' && <AlertCircle className="w-4 h-4" />}
                  {saveStatus === 'idle' && <Save className="w-4 h-4" />}
                  {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved!' : saveStatus === 'error' ? 'Error' : currentTemplateId ? 'Update' : 'Save'}
                </button>
                {/* Load */}
                <div className="relative">
                  <button
                    onClick={() => { setShowLoadPanel(p => !p); if (!showLoadPanel) fetchTemplateList(); }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-colors
                      ${showLoadPanel ? 'bg-accent-500/10 text-accent-400 border-accent-500/30' : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'}`}
                  >
                    <FolderOpen className="w-4 h-4" />
                    Load {savedTemplates.length > 0 && <span className="ml-1 px-1.5 py-0.5 bg-accent-500/20 text-accent-400 text-xs rounded-full">{savedTemplates.length}</span>}
                  </button>
                  {showLoadPanel && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                        <span className="text-sm font-semibold text-white">Saved Templates</span>
                        {loadingTemplates && <Loader2 className="w-3.5 h-3.5 text-gray-500 animate-spin" />}
                      </div>
                      {savedTemplates.length === 0 ? (
                        <div className="px-4 py-6 text-center text-sm text-gray-500">
                          {loadingTemplates ? 'Loading…' : 'No saved templates yet.'}
                        </div>
                      ) : (
                        <div className="max-h-72 overflow-y-auto divide-y divide-gray-700">
                          {savedTemplates.map(t => (
                            <div key={t.id} className={`px-4 py-3 flex items-center gap-3 hover:bg-gray-700/50 transition-colors ${t.id === currentTemplateId ? 'bg-accent-500/5' : ''}`}>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{t.name}</p>
                                {t.description && <p className="text-xs text-gray-500 truncate">{t.description}</p>}
                                <p className="text-xs text-gray-600 mt-0.5">{new Date(t.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleLoad(t.id)}
                                  disabled={loadingId === t.id}
                                  className="flex items-center gap-1 px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded border border-gray-500 transition-colors disabled:opacity-50"
                                >
                                  {loadingId === t.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Load'}
                                </button>
                                <button
                                  onClick={() => handleDelete(t.id, t.name)}
                                  disabled={deletingId === t.id}
                                  className="p-1 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors disabled:opacity-50"
                                >
                                  {deletingId === t.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Optional description */}
            <div className="mt-2">
              <input
                type="text"
                value={templateDescription}
                onChange={e => setTemplateDescription(e.target.value)}
                placeholder="Template description (optional)…"
                className="w-full bg-gray-700/50 border border-gray-700 rounded-lg px-3 py-1.5 text-gray-400 text-xs placeholder-gray-600 focus:ring-1 focus:ring-accent-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
            <p className="text-gray-400 text-sm">Fully customizable — adapts to any outreach, programme or campaign budget.</p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => setShowSettings(s => !s)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors border
                  ${showSettings ? 'bg-accent-500/10 text-accent-400 border-accent-500/30' : 'bg-gray-700 text-gray-400 border-gray-600 hover:bg-gray-600'}`}
              >
                <Settings className="w-4 h-4" /> {showSettings ? 'Hide' : 'Template'} Settings
              </button>
              <button onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-400 rounded-lg text-sm border border-gray-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Reset
              </button>
              <button onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-400 rounded-lg text-sm border border-gray-600 transition-colors"
              >
                <Copy className="w-4 h-4" /> {copied ? 'Copied!' : 'Copy Summary'}
              </button>
              <ExportButton />
            </div>
          </div>

          {/* Live totals strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {buckets.slice(0, 3).map((b, i) => (
              <StatBadge key={b.id} label={b.name.split('—')[0].trim()} primary={totals[i]} sym={sym} secSym={secSym} fx={fxRate} />
            ))}
            <StatBadge label="Grand Total" primary={grandTotal} sym={sym} secSym={secSym} fx={fxRate} accent />
          </div>

          {/* ── TEMPLATE SETTINGS (collapsible) ── */}
          {showSettings && (
            <div className="mb-5 p-5 bg-gray-800 rounded-xl border border-gray-700 space-y-5">
              <p className="text-sm font-semibold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-accent-400" /> Template Settings
              </p>

              {/* Branding */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Branding & Titles</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Organisation Name" value={meta.orgName} onChange={v => setMetaField('orgName', v)} placeholder="Your org name" />
                  <Field label="Template Title" value={meta.templateTitle} onChange={v => setMetaField('templateTitle', v)} placeholder="e.g. Budget Template" />
                  <Field label="Subtitle" value={meta.templateSubtitle} onChange={v => setMetaField('templateSubtitle', v)} placeholder="e.g. Q1 2026 Outreach" />
                  <Field label="Tagline / Description" value={meta.tagline} onChange={v => setMetaField('tagline', v)} placeholder="Short description shown under title" />
                  <Field label="Footer Note" value={meta.footerNote} onChange={v => setMetaField('footerNote', v)} placeholder="Footer text on every page" />
                </div>
              </div>

              {/* Currency */}
              <div className="border-t border-gray-700 pt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Currency & FX</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <Field label="Primary Currency" value={meta.primaryCurrency} onChange={v => setMetaField('primaryCurrency', v)} placeholder="NGN" />
                  <Field label="Primary Symbol" value={meta.primarySymbol} onChange={v => setMetaField('primarySymbol', v)} placeholder="₦" />
                  <Field label="Secondary Currency" value={meta.secondaryCurrency} onChange={v => setMetaField('secondaryCurrency', v)} placeholder="USD" />
                  <Field label="Secondary Symbol" value={meta.secondarySymbol} onChange={v => setMetaField('secondarySymbol', v)} placeholder="$" />
                  <Field label="FX Rate (primary per 1 secondary)" value={meta.fxRate} onChange={v => setMetaField('fxRate', v)} type="number" placeholder="1600" hint="e.g. 1600 means ₦1600 = $1" />
                  <div>
                    <Field label={`Multiplier Value (# of ${meta.multiplierLabel || 'units'})`} value={meta.multiplierValue} onChange={v => setMetaField('multiplierValue', v)} type="number" placeholder="50" hint="Used by qty_total + row_total columns" />
                    <div className="mt-2">
                      <Field label="Multiplier Label" value={meta.multiplierLabel} onChange={v => setMetaField('multiplierLabel', v)} placeholder="homes" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta fields */}
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Header / Meta Fields</p>
                  <button onClick={addMetaField} className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded border border-gray-600">
                    <Plus className="w-3 h-3" /> Add Field
                  </button>
                </div>
                <div className="space-y-2">
                  {meta.metaFields.map((f, i) => (
                    <div key={i} className="grid grid-cols-[1fr_1fr_28px] gap-2 items-center">
                      <InlineInput value={f.label} onChange={v => updateMetaField(i, 'label', v)} placeholder="Field label" className="w-full" />
                      <InlineInput value={f.value} onChange={v => updateMetaField(i, 'value', v)} placeholder="Value (or leave blank)" className="w-full" />
                      <button onClick={() => removeMetaField(i)} className="p-1 rounded text-gray-600 hover:text-red-400 hover:bg-red-400/10">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guardrails */}
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Budget Guardrails Table</p>
                    <button
                      onClick={() => setMetaField('showGuardrails', !meta.showGuardrails)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs border transition-colors ${meta.showGuardrails ? 'bg-accent-500/10 text-accent-400 border-accent-500/30' : 'bg-gray-700 text-gray-500 border-gray-600'}`}
                    >
                      {meta.showGuardrails ? <><ToggleRight className="w-3.5 h-3.5" /> Visible</> : <><ToggleLeft className="w-3.5 h-3.5" /> Hidden</>}
                    </button>
                  </div>
                  {meta.showGuardrails && (
                    <button onClick={addGuardrail} className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded border border-gray-600">
                      <Plus className="w-3 h-3" /> Add Row
                    </button>
                  )}
                </div>
                {meta.showGuardrails && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-[1fr_1.5fr_1.5fr_1.5fr_28px] gap-2 text-xs text-gray-500 font-medium px-1">
                      <span>Bucket</span><span>Purpose</span><span>Cap Rule</span><span>Notes</span><span />
                    </div>
                    {meta.guardrails.map((g, i) => (
                      <div key={i} className="grid grid-cols-[1fr_1.5fr_1.5fr_1.5fr_28px] gap-2 items-center">
                        <InlineInput value={g.bucket} onChange={v => updateGuardrail(i, 'bucket', v)} placeholder="Bucket name" className="w-full" />
                        <InlineInput value={g.purpose} onChange={v => updateGuardrail(i, 'purpose', v)} placeholder="Purpose" className="w-full" />
                        <InlineInput value={g.cap} onChange={v => updateGuardrail(i, 'cap', v)} placeholder="Cap rule" className="w-full" />
                        <InlineInput value={g.notes} onChange={v => updateGuardrail(i, 'notes', v)} placeholder="Notes" className="w-full" />
                        <button onClick={() => removeGuardrail(i)} className="p-1 rounded text-gray-600 hover:text-red-400 hover:bg-red-400/10">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Signatures */}
              <div className="border-t border-gray-700 pt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Signatures</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Field label="Prepared By" value={meta.preparedBy} onChange={v => setMetaField('preparedBy', v)} placeholder="Full name" />
                  <Field label="Prepared Date" value={meta.preparedDate} onChange={v => setMetaField('preparedDate', v)} type="date" />
                  <Field label="Approved By" value={meta.approvedBy} onChange={v => setMetaField('approvedBy', v)} placeholder="Full name" />
                  <Field label="Approved Date" value={meta.approvedDate} onChange={v => setMetaField('approvedDate', v)} type="date" />
                </div>
              </div>
            </div>
          )}

          {/* ── BUCKETS ── */}
          {buckets.map((b, i) => (
            <BucketSection
              key={b.id}
              bucket={b}
              meta={meta}
              index={i}
              onUpdate={updated => updateBucket(b.id, updated)}
              onRemove={() => removeBucket(b.id)}
            />
          ))}

          {/* Add Bucket */}
          <button
            onClick={addBucket}
            className="w-full mb-5 py-3 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-xl border border-dashed border-gray-600 hover:border-gray-500 text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add New Budget Section / Bucket
          </button>

          {/* ── SUMMARY ── */}
          <SectionCard title="Budget Summary" subtitle="Auto-calculated totals across all sections">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-xs font-medium text-gray-400 pb-2 pr-3">Section</th>
                    <th className="text-right text-xs font-medium text-gray-400 pb-2 px-3">Total ({meta.primaryCurrency})</th>
                    <th className="text-right text-xs font-medium text-gray-400 pb-2 pl-3">{meta.secondaryCurrency} Equiv.</th>
                  </tr>
                </thead>
                <tbody>
                  {buckets.map((b, i) => (
                    <tr key={b.id} className={`border-b border-gray-700/40 ${i % 2 ? 'bg-gray-700/20' : ''}`}>
                      <td className="py-2.5 pr-3 text-sm text-gray-300">{b.name}</td>
                      <td className={`py-2.5 px-3 text-right text-sm font-medium ${totals[i] > 0 ? 'text-green-400' : 'text-gray-600'}`}>
                        {totals[i] > 0 ? fmtPrimary(totals[i], sym) : '—'}
                      </td>
                      <td className="py-2.5 pl-3 text-right text-sm text-gray-400">
                        {totals[i] > 0 ? fmtSecondary(totals[i], fxRate, secSym) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-accent-500/40 bg-accent-500/10">
                    <td className="py-3 pr-3 text-sm font-bold text-white">GRAND TOTAL</td>
                    <td className="py-3 px-3 text-right text-sm font-bold text-accent-400">
                      {grandTotal > 0 ? fmtPrimary(grandTotal, sym) : '—'}
                    </td>
                    <td className="py-3 pl-3 text-right text-sm font-medium text-gray-300">
                      {grandTotal > 0 ? fmtSecondary(grandTotal, fxRate, secSym) : '—'}
                    </td>
                  </tr>
                </tfoot>
              </table>
              <div className="flex items-start justify-center lg:justify-end">
                <div className="space-y-3 w-full max-w-xs">
                  <p className="text-xs text-gray-500 bg-gray-700/30 rounded-lg p-3 border border-gray-700">
                    <strong className="text-gray-300">Note:</strong> {meta.footerNote || 'Keep evidence (quotes, receipts, confirmations) archived with the final report.'}
                  </p>
                  <ExportButton large />
                </div>
              </div>
            </div>
          </SectionCard>

        </div>
      </AdminLayout>
    </>
  );
}
