import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// ─── Types (imported from shared types file) ───────────────────────────────────
// Re-exported so any code that already imports from this file continues to work.
export type {
  BucketColumn,
  BucketRow,
  Bucket,
  Guardrail,
  BudgetTemplateMeta,
  BudgetDocumentData,
} from '@/types/budget';

import type {
  BucketColumn,
  BucketRow,
  Bucket,
  BudgetTemplateMeta,
  BudgetDocumentData,
} from '@/types/budget';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const n = (v: string) => parseFloat(v) || 0;
const fx = (meta: BudgetTemplateMeta) => n(meta.fxRate);
const mult = (meta: BudgetTemplateMeta) => n(meta.multiplierValue);

const fmt = (v: number) =>
  v === 0 ? '' : v.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const computeCell = (
  col: BucketColumn,
  row: BucketRow,
  cols: BucketColumn[],
  meta: BudgetTemplateMeta
): string => {
  if (!col.compute) return row[col.key] ?? '';
  const fxRate = fx(meta);
  const m = mult(meta);

  if (col.compute === 'qty_total') {
    const qtyCol = cols.find(c => c.type === 'number' && !c.compute);
    if (!qtyCol) return '';
    const qty = n(row[qtyCol.key]);
    return m > 0 && qty > 0 ? String(qty * m) : '';
  }

  if (col.compute === 'row_total') {
    const qtyCol = cols.find(c => c.type === 'number' && !c.compute);
    const priceCol = cols.find(c => c.type === 'currency' && !c.compute);
    if (!qtyCol || !priceCol) return '';
    const qty = n(row[qtyCol.key]);
    const totalQty = m > 0 ? qty * m : qty;
    const total = totalQty * n(row[priceCol.key]);
    return total > 0 ? fmt(total) : '';
  }

  if (col.compute === 'usd_equiv' || col.compute === 'usd_approved') {
    // Find the "total" or "approved" currency column
    const srcKey = col.compute === 'usd_approved'
      ? cols.find(c => c.type === 'currency' && !c.compute && c.key.toLowerCase().includes('approv'))?.key
        ?? cols.filter(c => c.type === 'currency' && !c.compute).slice(-1)[0]?.key
      : undefined;

    if (col.compute === 'usd_approved' && srcKey) {
      const v = n(row[srcKey]);
      return fxRate > 0 && v > 0 ? fmt(v / fxRate) : '';
    }

    // For row_total USD: recompute the row total then convert
    const qtyCol = cols.find(c => c.type === 'number' && !c.compute);
    const priceCol = cols.find(c => c.type === 'currency' && !c.compute);
    if (qtyCol && priceCol) {
      const qty = n(row[qtyCol.key]);
      const totalQty = m > 0 ? qty * m : qty;
      const total = totalQty * n(row[priceCol.key]);
      return fxRate > 0 && total > 0 ? fmt(total / fxRate) : '';
    }
    // Fallback: sum all currency cols
    const currCols = cols.filter(c => c.type === 'currency' && !c.compute);
    if (currCols.length > 0) {
      const last = n(row[currCols[currCols.length - 1].key]);
      return fxRate > 0 && last > 0 ? fmt(last / fxRate) : '';
    }
    return '';
  }

  return row[col.key] ?? '';
};

const bucketSubtotal = (bucket: Bucket, meta: BudgetTemplateMeta): number => {
  const key = bucket.approvedKey ?? bucket.totalKey;
  if (key) {
    return bucket.rows.reduce((s, r) => s + n(r[key]), 0);
  }
  // Auto-detect: sum the last currency column
  const currCols = bucket.columns.filter(c => c.type === 'currency' && !c.compute);
  if (currCols.length === 0) return 0;
  const lastKey = currCols[currCols.length - 1].key;
  return bucket.rows.reduce((s, r) => s + n(r[lastKey]), 0);
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const C = {
  headerBg: '#1e3a5f',
  sectionBg: '#2d5a8e',
  sectionText: '#ffffff',
  rowEven: '#f0f4f8',
  rowOdd: '#ffffff',
  subtotalBg: '#d4e4f5',
  totalBg: '#1e3a5f',
  border: '#a0b8d0',
  muted: '#666666',
  black: '#1a1a1a',
};

const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica', fontSize: 8, color: C.black,
    paddingTop: 28, paddingBottom: 42, paddingHorizontal: 28, backgroundColor: '#ffffff',
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  orgName: { fontSize: 7, color: C.muted },
  title: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: C.headerBg, textAlign: 'center', marginBottom: 2 },
  subtitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.sectionBg, textAlign: 'center', marginBottom: 2 },
  tagline: { fontSize: 7, color: C.muted, textAlign: 'center', marginBottom: 8 },
  divider: { borderBottomWidth: 1.5, borderBottomColor: C.headerBg, marginBottom: 8 },

  metaGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10, gap: 3 },
  metaCell: { width: '48%', flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: C.border, paddingBottom: 3 },
  metaLabel: { fontSize: 7, color: C.muted, width: 105 },
  metaValue: { fontSize: 7, fontFamily: 'Helvetica-Bold', flex: 1 },

  sectionHeader: {
    backgroundColor: C.sectionBg, paddingVertical: 5, paddingHorizontal: 8, marginBottom: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  sectionTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.sectionText },
  sectionTip: { fontSize: 6.5, color: '#b0cce8', fontStyle: 'italic', maxWidth: '55%' },

  table: { width: '100%', marginBottom: 10 },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: C.headerBg },
  tableRowOdd: { flexDirection: 'row', backgroundColor: C.rowOdd },
  tableRowEven: { flexDirection: 'row', backgroundColor: C.rowEven },
  subtotalRow: { flexDirection: 'row', backgroundColor: C.subtotalBg },
  totalRow: { flexDirection: 'row', backgroundColor: C.totalBg },

  th: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#fff', padding: 4, borderRightWidth: 0.5, borderRightColor: 'rgba(255,255,255,0.3)' },
  td: { fontSize: 7, color: C.black, padding: 4, borderRightWidth: 0.5, borderRightColor: C.border },
  tdBold: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.black, padding: 4, borderRightWidth: 0.5, borderRightColor: C.border },
  tdTotal: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#fff', padding: 4, borderRightWidth: 0.5, borderRightColor: 'rgba(255,255,255,0.3)' },

  // Summary
  summaryWrap: { width: '50%', marginLeft: 'auto', marginBottom: 10 },

  // Signatures
  sigRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, marginBottom: 8 },
  sigBlock: { width: '45%' },
  sigLabel: { fontSize: 7, color: C.muted, marginBottom: 2 },
  sigLine: { borderBottomWidth: 1, borderBottomColor: C.black, height: 14, marginBottom: 2 },
  sigValue: { fontSize: 7 },
  dateLabel: { fontSize: 7, color: C.muted, marginTop: 4, marginBottom: 2 },
  dateLine: { borderBottomWidth: 1, borderBottomColor: C.black, height: 14 },
  dateValue: { fontSize: 7 },

  footer: {
    position: 'absolute', bottom: 18, left: 28, right: 28,
    flexDirection: 'row', justifyContent: 'space-between',
    borderTopWidth: 0.5, borderTopColor: C.border, paddingTop: 4,
  },
  footerLeft: { fontSize: 6.5, color: C.muted },
  footerMid: { fontSize: 6.5, color: C.muted, maxWidth: '65%', textAlign: 'center' },
  footerRight: { fontSize: 6.5, color: C.muted },
});

// ─── Cell renderer ─────────────────────────────────────────────────────────────

const Cell = ({
  value, width, align, bold, total, last,
}: {
  value: string; width: string; align?: 'left' | 'right' | 'center';
  bold?: boolean; total?: boolean; last?: boolean;
}) => {
  const base = total ? s.tdTotal : bold ? s.tdBold : s.td;
  return (
    <Text
      style={[base, { width, textAlign: align ?? 'left', ...(last ? { borderRightWidth: 0 } : {}) }]}
    >
      {value}
    </Text>
  );
};

// ─── Bucket Table ──────────────────────────────────────────────────────────────

const BucketTable: React.FC<{ bucket: Bucket; meta: BudgetTemplateMeta; symbol: string; secSymbol: string }> = ({
  bucket, meta, symbol, secSymbol,
}) => {
  const cols = bucket.columns;
  const total = bucketSubtotal(bucket, meta);
  const fxRate = fx(meta);

  return (
    <>
      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>{bucket.name}</Text>
        {bucket.subtitle && <Text style={s.sectionTip}>{bucket.subtitle}</Text>}
      </View>
      <View style={s.table}>
        {/* Header */}
        <View style={s.tableHeaderRow}>
          {cols.map((col, i) => (
            <Text
              key={col.key}
              style={[s.th, { width: col.width, textAlign: col.align ?? 'left', ...(i === cols.length - 1 ? { borderRightWidth: 0 } : {}) }]}
            >
              {col.label}
            </Text>
          ))}
        </View>

        {/* Rows */}
        {bucket.rows.map((row, ri) => (
          <View key={row.id} style={ri % 2 === 0 ? s.tableRowOdd : s.tableRowEven}>
            {cols.map((col, ci) => {
              const raw = row[col.key] ?? '';
              let display = '';
              if (col.compute) {
                display = computeCell(col, row, cols, meta);
              } else if (col.type === 'currency' && raw) {
                display = `${symbol}${fmt(n(raw))}`;
              } else {
                display = raw;
              }
              // USD computed cells get secondary symbol
              if (col.compute === 'usd_equiv' || col.compute === 'usd_approved') {
                const v = computeCell(col, row, cols, meta);
                display = v ? `${secSymbol}${v}` : '';
              }
              return (
                <Cell
                  key={col.key}
                  value={display}
                  width={col.width}
                  align={col.align}
                  last={ci === cols.length - 1}
                />
              );
            })}
          </View>
        ))}

        {/* Subtotal */}
        <View style={s.subtotalRow}>
          {cols.map((col, ci) => {
            let val = '';
            if (ci === 0) val = `SUBTOTAL — ${bucket.name.split('—')[0].trim()}`;
            else if (col.key === (bucket.approvedKey ?? bucket.totalKey)) {
              val = total > 0 ? `${symbol}${fmt(total)}` : '';
            } else if ((col.compute === 'usd_equiv' || col.compute === 'usd_approved') && total > 0 && fxRate > 0) {
              val = `${secSymbol}${fmt(total / fxRate)}`;
            }
            return (
              <Cell key={col.key} value={val} width={col.width} align={col.align} bold last={ci === cols.length - 1} />
            );
          })}
        </View>
      </View>
    </>
  );
};

// ─── Main PDF Document ─────────────────────────────────────────────────────────

const BudgetTemplatePDF: React.FC<{ data: BudgetDocumentData }> = ({ data }) => {
  const { meta, buckets } = data;
  const fxRate = fx(meta);
  const sym = meta.primarySymbol || meta.primaryCurrency;
  const secSym = meta.secondarySymbol || meta.secondaryCurrency;

  const bucketTotals = buckets.map(b => bucketSubtotal(b, meta));
  const grandTotal = bucketTotals.reduce((s, v) => s + v, 0);

  // Split buckets across pages: first ~2 on page 1, rest + summary on page 2+
  // For simplicity we use wrap={false} and let react-pdf handle pagination
  const bucketsPage1 = buckets.slice(0, Math.ceil(buckets.length / 2));
  const bucketsPage2 = buckets.slice(Math.ceil(buckets.length / 2));

  const Footer = () => (
    <View style={s.footer} fixed>
      <Text style={s.footerLeft}>{meta.orgName}</Text>
      <Text style={s.footerMid}>{meta.footerNote}</Text>
      <Text style={s.footerRight} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
    </View>
  );

  const PageHeader = () => (
    <>
      <View style={s.headerRow}>
        <Text style={s.orgName}>{meta.orgName}</Text>
      </View>
      <Text style={s.title}>{meta.templateTitle}</Text>
      {meta.templateSubtitle && <Text style={s.subtitle}>{meta.templateSubtitle}</Text>}
      {meta.tagline && <Text style={s.tagline}>{meta.tagline}</Text>}
      <View style={s.divider} />
    </>
  );

  return (
    <Document
      title={`${meta.templateTitle}${meta.templateSubtitle ? ' — ' + meta.templateSubtitle : ''}`}
      author={meta.orgName}
    >
      {/* ── PAGE 1 ── */}
      <Page size="A4" style={s.page}>
        <PageHeader />

        {/* Meta grid */}
        {meta.metaFields.length > 0 && (
          <View style={s.metaGrid}>
            {meta.metaFields.map(f => (
              <View key={f.label} style={s.metaCell}>
                <Text style={s.metaLabel}>{f.label}:</Text>
                <Text style={s.metaValue}>{f.value || '—'}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Guardrails */}
        {meta.showGuardrails && meta.guardrails.length > 0 && (
          <>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Budget Guardrails (Recommended)</Text>
            </View>
            <View style={s.table}>
              <View style={s.tableHeaderRow}>
                {['Bucket', 'Purpose', 'Cap Rule', 'Notes'].map((h, i, arr) => (
                  <Text key={h} style={[s.th, { width: i === 0 ? '20%' : i === 1 ? '28%' : i === 2 ? '30%' : '22%', ...(i === arr.length - 1 ? { borderRightWidth: 0 } : {}) }]}>{h}</Text>
                ))}
              </View>
              {meta.guardrails.map((g, i) => (
                <View key={i} style={i % 2 === 0 ? s.tableRowOdd : s.tableRowEven}>
                  <Text style={[s.tdBold, { width: '20%' }]}>{g.bucket}</Text>
                  <Text style={[s.td, { width: '28%' }]}>{g.purpose}</Text>
                  <Text style={[s.td, { width: '30%' }]}>{g.cap}</Text>
                  <Text style={[s.td, { width: '22%', borderRightWidth: 0 }]}>{g.notes}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Buckets for page 1 */}
        {bucketsPage1.map(b => (
          <BucketTable key={b.id} bucket={b} meta={meta} symbol={sym} secSymbol={secSym} />
        ))}

        <Footer />
      </Page>

      {/* ── PAGE 2 ── */}
      <Page size="A4" style={s.page}>
        <View style={s.headerRow}>
          <Text style={s.orgName}>{meta.orgName}</Text>
        </View>
        <View style={[s.divider, { marginBottom: 8 }]} />

        {/* Remaining buckets */}
        {bucketsPage2.map(b => (
          <BucketTable key={b.id} bucket={b} meta={meta} symbol={sym} secSymbol={secSym} />
        ))}

        {/* Budget Summary */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Budget Summary (Totals)</Text>
        </View>
        <View style={[s.summaryWrap, { marginTop: 0 }]}>
          <View style={s.tableHeaderRow}>
            <Text style={[s.th, { width: '55%' }]}>Bucket / Section</Text>
            <Text style={[s.th, { width: '25%', textAlign: 'right' }]}>Total ({meta.primaryCurrency})</Text>
            <Text style={[s.th, { width: '20%', textAlign: 'right', borderRightWidth: 0 }]}>{meta.secondaryCurrency} Equiv.</Text>
          </View>
          {buckets.map((b, i) => (
            <View key={b.id} style={i % 2 === 0 ? s.tableRowOdd : s.tableRowEven}>
              <Text style={[s.td, { width: '55%' }]}>{b.name}</Text>
              <Text style={[s.td, { width: '25%', textAlign: 'right' }]}>
                {bucketTotals[i] > 0 ? `${sym}${fmt(bucketTotals[i])}` : ''}
              </Text>
              <Text style={[s.td, { width: '20%', textAlign: 'right', borderRightWidth: 0 }]}>
                {bucketTotals[i] > 0 && fxRate > 0 ? `${secSym}${fmt(bucketTotals[i] / fxRate)}` : ''}
              </Text>
            </View>
          ))}
          <View style={s.totalRow}>
            <Text style={[s.tdTotal, { width: '55%' }]}>GRAND TOTAL</Text>
            <Text style={[s.tdTotal, { width: '25%', textAlign: 'right' }]}>
              {grandTotal > 0 ? `${sym}${fmt(grandTotal)}` : ''}
            </Text>
            <Text style={[s.tdTotal, { width: '20%', textAlign: 'right', borderRightWidth: 0 }]}>
              {grandTotal > 0 && fxRate > 0 ? `${secSym}${fmt(grandTotal / fxRate)}` : ''}
            </Text>
          </View>
        </View>

        {/* Signatures */}
        <View style={s.sigRow}>
          <View style={s.sigBlock}>
            <Text style={s.sigLabel}>Prepared By (Name/Signature):</Text>
            <View style={s.sigLine}><Text style={s.sigValue}>{meta.preparedBy}</Text></View>
            <Text style={s.dateLabel}>Date:</Text>
            <View style={s.dateLine}><Text style={s.dateValue}>{meta.preparedDate}</Text></View>
          </View>
          <View style={s.sigBlock}>
            <Text style={s.sigLabel}>Approved By (Name/Signature):</Text>
            <View style={s.sigLine}><Text style={s.sigValue}>{meta.approvedBy}</Text></View>
            <Text style={s.dateLabel}>Date:</Text>
            <View style={s.dateLine}><Text style={s.dateValue}>{meta.approvedDate}</Text></View>
          </View>
        </View>

        <Footer />
      </Page>
    </Document>
  );
};

export default BudgetTemplatePDF;
