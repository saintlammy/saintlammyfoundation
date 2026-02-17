import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BucketARow {
  id: string;
  item: string;
  qtyPerHome: string;
  unitCost: string;
}

export interface BucketBRow {
  id: string;
  homeId: string;
  needType: string;
  evidence: string;
  cap: string;
  approved: string;
  notes: string;
}

export interface BucketCRow {
  id: string;
  lineItem: string;
  description: string;
  amount: string;
}

export interface BudgetMeta {
  cycleNameCode: string;
  preparedBy: string;
  startWeek: string;
  datePrepared: string;
  targetHomes: string;
  perHomeCap: string;
  fxRate: string;
  location: string;
  // Guardrails
  bucketATotalCap: string;
  bucketAPerHomeCap: string;
  bucketBTotalCap: string;
  bucketBPerHouseholdCap: string;
  bucketBSlots: string;
  bucketCPercent: string;
  bucketCFixed: string;
  // Signatures
  approvedBy: string;
  approvedDate: string;
  preparedDate: string;
}

export interface BudgetData {
  meta: BudgetMeta;
  bucketA: BucketARow[];
  bucketB: BucketBRow[];
  bucketC: BucketCRow[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const num = (v: string) => parseFloat(v) || 0;
const fmt = (v: number) =>
  v === 0 ? '' : v.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const usd = (ngn: number, fx: number) => (fx > 0 ? ngn / fx : 0);

// ─── Styles ───────────────────────────────────────────────────────────────────

const C = {
  black: '#1a1a1a',
  headerBg: '#1e3a5f',
  headerText: '#ffffff',
  sectionBg: '#2d5a8e',
  sectionText: '#ffffff',
  rowEven: '#f0f4f8',
  rowOdd: '#ffffff',
  subtotalBg: '#d4e4f5',
  totalBg: '#1e3a5f',
  totalText: '#ffffff',
  border: '#a0b8d0',
  muted: '#666666',
  accent: '#10b981',
};

const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 8,
    color: C.black,
    paddingTop: 28,
    paddingBottom: 36,
    paddingHorizontal: 28,
    backgroundColor: '#ffffff',
  },

  // Header
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  orgName: { fontSize: 7, color: C.muted },
  pageNum: { fontSize: 7, color: C.muted },
  title: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: C.headerBg, textAlign: 'center', marginBottom: 3 },
  subtitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.sectionBg, textAlign: 'center', marginBottom: 3 },
  tagline: { fontSize: 7, color: C.muted, textAlign: 'center', marginBottom: 10 },
  divider: { borderBottomWidth: 1.5, borderBottomColor: C.headerBg, marginBottom: 10 },

  // Meta grid
  metaGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10, gap: 4 },
  metaCell: { width: '48%', flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: C.border, paddingBottom: 3, marginBottom: 2 },
  metaLabel: { fontSize: 7, color: C.muted, width: 110 },
  metaValue: { fontSize: 7, fontFamily: 'Helvetica-Bold', flex: 1 },

  // Section header
  sectionHeader: {
    backgroundColor: C.sectionBg,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.sectionText },
  sectionTip: { fontSize: 6.5, color: '#b0cce8', fontStyle: 'italic' },

  // Table
  table: { width: '100%', marginBottom: 12 },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: C.headerBg },
  tableRow: { flexDirection: 'row' },
  tableRowEven: { backgroundColor: C.rowEven },
  tableRowOdd: { backgroundColor: C.rowOdd },
  subtotalRow: { flexDirection: 'row', backgroundColor: C.subtotalBg },
  totalRow: { flexDirection: 'row', backgroundColor: C.totalBg },

  // Cells
  th: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#ffffff', padding: 4, borderRightWidth: 0.5, borderRightColor: 'rgba(255,255,255,0.3)' },
  td: { fontSize: 7, color: C.black, padding: 4, borderRightWidth: 0.5, borderRightColor: C.border },
  tdSubtotal: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.black, padding: 4, borderRightWidth: 0.5, borderRightColor: C.border },
  tdTotal: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#ffffff', padding: 4, borderRightWidth: 0.5, borderRightColor: 'rgba(255,255,255,0.3)' },

  // Column widths – Bucket A
  aItem:   { width: '22%' },
  aQty:    { width: '10%' },
  aTotQty: { width: '13%' },
  aUnit:   { width: '16%' },
  aTotal:  { width: '20%' },
  aUsd:    { width: '19%' },

  // Column widths – Bucket B
  bHomeId:   { width: '10%' },
  bNeed:     { width: '18%' },
  bEvidence: { width: '20%' },
  bCap:      { width: '13%' },
  bApproved: { width: '13%' },
  bUsd:      { width: '13%' },
  bNotes:    { width: '13%' },

  // Column widths – Bucket C
  cLine:   { width: '28%' },
  cDesc:   { width: '32%' },
  cAmt:    { width: '22%' },
  cUsd:    { width: '18%' },

  // Guardrails table
  gBucket:  { width: '20%' },
  gPurpose: { width: '30%' },
  gCap:     { width: '28%' },
  gNotes:   { width: '22%' },

  // Summary
  summaryTable: { width: '50%', marginLeft: 'auto', marginBottom: 12 },
  sBucket:  { width: '55%' },
  sNgn:     { width: '25%' },
  sUsd:     { width: '20%' },

  // Signature row
  sigRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, marginBottom: 10 },
  sigBlock: { width: '45%' },
  sigLabel: { fontSize: 7, color: C.muted, marginBottom: 2 },
  sigLine: { borderBottomWidth: 1, borderBottomColor: C.black, height: 14, marginBottom: 2 },
  sigValue: { fontSize: 7 },
  dateLabel: { fontSize: 7, color: C.muted, marginTop: 4, marginBottom: 2 },
  dateLine: { borderBottomWidth: 1, borderBottomColor: C.black, height: 14 },
  dateValue: { fontSize: 7 },

  // Footer
  footer: { position: 'absolute', bottom: 20, left: 28, right: 28, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.5, borderTopColor: C.border, paddingTop: 4 },
  footerText: { fontSize: 6.5, color: C.muted },
  footerNote: { fontSize: 6.5, color: C.muted, maxWidth: '70%' },
});

// ─── Sub-components ────────────────────────────────────────────────────────────

const TH = ({ children, style }: { children: React.ReactNode; style?: object }) => (
  <Text style={[s.th, style as any]}>{children}</Text>
);
const TD = ({ children, style, bold, total }: { children?: React.ReactNode; style?: object; bold?: boolean; total?: boolean }) => (
  <Text style={[total ? s.tdTotal : bold ? s.tdSubtotal : s.td, style as any]}>{children ?? ''}</Text>
);

// ─── Main PDF Document ─────────────────────────────────────────────────────────

const BudgetTemplatePDF: React.FC<{ data: BudgetData }> = ({ data }) => {
  const { meta, bucketA, bucketB, bucketC } = data;
  const fx = num(meta.fxRate);
  const homes = num(meta.targetHomes);

  // Bucket A calculations
  const aRows = bucketA.map(r => {
    const qtyHome = num(r.qtyPerHome);
    const totalQty = homes > 0 ? qtyHome * homes : 0;
    const total = totalQty * num(r.unitCost);
    return { ...r, totalQty, total, usdEq: usd(total, fx) };
  });
  const aTotalNGN = aRows.reduce((s, r) => s + r.total, 0);

  // Bucket B calculations
  const bRows = bucketB.map(r => {
    const approved = num(r.approved);
    return { ...r, usdEq: usd(approved, fx) };
  });
  const bTotalNGN = bRows.reduce((s, r) => s + num(r.approved), 0);

  // Bucket C calculations
  const cRows = bucketC.map(r => ({
    ...r,
    usdEq: usd(num(r.amount), fx),
  }));
  const cTotalNGN = cRows.reduce((s, r) => s + num(r.amount), 0);

  const grandTotal = aTotalNGN + bTotalNGN + cTotalNGN;

  return (
    <Document
      title={`Budget Template - ${meta.cycleNameCode || 'Saintlammy Foundation'}`}
      author="Saintlammy Foundation"
      subject="Vulnerable Homes Outreach Budget Template"
    >
      {/* ── PAGE 1 ── */}
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.headerRow}>
          <Text style={s.orgName}>Saintlammy Foundation / Saintlammy Community Care Initiative (SCCI)</Text>
          <Text style={s.pageNum}>Page 1</Text>
        </View>

        <Text style={s.title}>Budget Template</Text>
        <Text style={s.subtitle}>
          Vulnerable Homes Outreach{meta.cycleNameCode ? ` — ${meta.cycleNameCode}` : ''}{meta.location ? ` (${meta.location})` : ''}
        </Text>
        <Text style={s.tagline}>
          Use this template to budget with 3 buckets: Core Packs (fixed), Casework Fund (capped), and Buffer/Logistics (volatility protection).
        </Text>
        <View style={s.divider} />

        {/* Meta Grid */}
        <View style={s.metaGrid}>
          {[
            ['Outreach Cycle Name / Code:', meta.cycleNameCode],
            ['Prepared By:', meta.preparedBy],
            ['Implementation Start (Week):', meta.startWeek],
            ['Date Prepared:', meta.datePrepared],
            ['Target Homes (Count):', meta.targetHomes],
            ['Per-Home Core Pack Cap (NGN):', meta.perHomeCap ? `NGN ${meta.perHomeCap}` : ''],
            ['FX Rate Used (NGN per $1):', meta.fxRate],
            ['Location / LGA:', meta.location],
          ].map(([label, value]) => (
            <View key={label} style={s.metaCell}>
              <Text style={s.metaLabel}>{label}</Text>
              <Text style={s.metaValue}>{value || '—'}</Text>
            </View>
          ))}
        </View>

        {/* Budget Guardrails */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Budget Guardrails (Recommended)</Text>
        </View>
        <View style={s.table}>
          <View style={s.tableHeaderRow}>
            <TH style={s.gBucket}>Bucket</TH>
            <TH style={s.gPurpose}>Purpose</TH>
            <TH style={s.gCap}>Cap Rule</TH>
            <TH style={[s.gNotes, { borderRightWidth: 0 }]}>Notes</TH>
          </View>
          {[
            {
              bucket: 'A. Core Packs (Fixed)',
              purpose: 'Raw food + hygiene for all homes',
              cap: [meta.bucketATotalCap && `NGN ${meta.bucketATotalCap} total`, meta.bucketAPerHomeCap && `NGN ${meta.bucketAPerHomeCap} per home`].filter(Boolean).join(' / ') || '—',
              note: 'Keep this predictable and scalable.',
            },
            {
              bucket: 'B. Casework Fund (Capped)',
              purpose: 'School fees, cash support, rent buffer, micro-restart (limited slots)',
              cap: [meta.bucketBTotalCap && `NGN ${meta.bucketBTotalCap} total`, meta.bucketBPerHouseholdCap && `Max NGN ${meta.bucketBPerHouseholdCap} per household`, meta.bucketBSlots && `Slots: ${meta.bucketBSlots}`].filter(Boolean).join('; ') || '—',
              note: 'Evidence-based; pay direct where possible.',
            },
            {
              bucket: 'C. Buffer + Logistics',
              purpose: 'Price swings, transport, packaging, misc',
              cap: [meta.bucketCPercent && `${meta.bucketCPercent}% of (A+B)`, meta.bucketCFixed && `OR NGN ${meta.bucketCFixed}`].filter(Boolean).join(' ') || '—',
              note: 'Prevents derailment when market prices swing.',
            },
          ].map((row, i) => (
            <View key={i} style={[s.tableRow, i % 2 === 0 ? s.tableRowOdd : s.tableRowEven]}>
              <TD style={s.gBucket} bold>{row.bucket}</TD>
              <TD style={s.gPurpose}>{row.purpose}</TD>
              <TD style={s.gCap}>{row.cap}</TD>
              <TD style={[s.gNotes, { borderRightWidth: 0 }]}>{row.note}</TD>
            </View>
          ))}
        </View>

        {/* Bucket A */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Bucket A — Core Packs (Raw Food + Hygiene)</Text>
          <Text style={s.sectionTip}>Tip: list items first, then market-research unit costs to stay within the per-home cap.</Text>
        </View>
        <View style={s.table}>
          <View style={s.tableHeaderRow}>
            <TH style={s.aItem}>Item</TH>
            <TH style={s.aQty}>Qty / Home</TH>
            <TH style={s.aTotQty}>Total Qty (All Homes)</TH>
            <TH style={s.aUnit}>Unit Cost (NGN)</TH>
            <TH style={s.aTotal}>Total (NGN)</TH>
            <TH style={[s.aUsd, { borderRightWidth: 0 }]}>USD Equivalent</TH>
          </View>
          {aRows.map((r, i) => (
            <View key={r.id} style={[s.tableRow, i % 2 === 0 ? s.tableRowOdd : s.tableRowEven]}>
              <TD style={s.aItem}>{r.item}</TD>
              <TD style={s.aQty}>{r.qtyPerHome}</TD>
              <TD style={s.aTotQty}>{r.totalQty > 0 ? String(r.totalQty) : ''}</TD>
              <TD style={s.aUnit}>{r.unitCost ? fmt(num(r.unitCost)) : ''}</TD>
              <TD style={s.aTotal}>{r.total > 0 ? fmt(r.total) : ''}</TD>
              <TD style={[s.aUsd, { borderRightWidth: 0 }]}>{r.usdEq > 0 ? fmt(r.usdEq) : ''}</TD>
            </View>
          ))}
          <View style={s.subtotalRow}>
            <TD style={s.aItem} bold>SUBTOTAL — Bucket A</TD>
            <TD style={s.aQty} bold />
            <TD style={s.aTotQty} bold />
            <TD style={s.aUnit} bold />
            <TD style={s.aTotal} bold>{aTotalNGN > 0 ? fmt(aTotalNGN) : ''}</TD>
            <TD style={[s.aUsd, { borderRightWidth: 0 }]} bold>{aTotalNGN > 0 ? fmt(usd(aTotalNGN, fx)) : ''}</TD>
          </View>
        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>Saintlammy Foundation / SCCI</Text>
          <Text style={s.footerNote}>
            Note: Record NGN and USD equivalents for transparency. Keep evidence (quotes, receipts, confirmations) archived with the final outreach report.
          </Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>

      {/* ── PAGE 2 ── */}
      <Page size="A4" style={s.page}>
        <View style={s.headerRow}>
          <Text style={s.orgName}>Saintlammy Foundation / Saintlammy Community Care Initiative (SCCI)</Text>
          <Text style={s.pageNum}>Page 2</Text>
        </View>
        <View style={[s.divider, { marginBottom: 8 }]} />

        {/* Bucket B */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Bucket B — Casework Fund (Capped, Limited Slots)</Text>
          <Text style={s.sectionTip}>
            Use for a limited number of homes only{meta.bucketBSlots ? ` (${meta.bucketBSlots} slots)` : ''}. Keep a per-household cap and require evidence.
          </Text>
        </View>
        <View style={s.table}>
          <View style={s.tableHeaderRow}>
            <TH style={s.bHomeId}>Home ID</TH>
            <TH style={s.bNeed}>Need Type</TH>
            <TH style={s.bEvidence}>Evidence / Verification</TH>
            <TH style={s.bCap}>Cap (NGN)</TH>
            <TH style={s.bApproved}>Approved (NGN)</TH>
            <TH style={s.bUsd}>USD Equivalent</TH>
            <TH style={[s.bNotes, { borderRightWidth: 0 }]}>Notes</TH>
          </View>
          {bRows.map((r, i) => (
            <View key={r.id} style={[s.tableRow, i % 2 === 0 ? s.tableRowOdd : s.tableRowEven]}>
              <TD style={s.bHomeId}>{r.homeId}</TD>
              <TD style={s.bNeed}>{r.needType}</TD>
              <TD style={s.bEvidence}>{r.evidence}</TD>
              <TD style={s.bCap}>{r.cap ? fmt(num(r.cap)) : ''}</TD>
              <TD style={s.bApproved}>{r.approved ? fmt(num(r.approved)) : ''}</TD>
              <TD style={s.bUsd}>{r.usdEq > 0 ? fmt(r.usdEq) : ''}</TD>
              <TD style={[s.bNotes, { borderRightWidth: 0 }]}>{r.notes}</TD>
            </View>
          ))}
          <View style={s.subtotalRow}>
            <TD style={s.bHomeId} bold />
            <TD style={s.bNeed} bold />
            <TD style={s.bEvidence} bold>SUBTOTAL — Bucket B</TD>
            <TD style={s.bCap} bold />
            <TD style={s.bApproved} bold>{bTotalNGN > 0 ? fmt(bTotalNGN) : ''}</TD>
            <TD style={s.bUsd} bold>{bTotalNGN > 0 ? fmt(usd(bTotalNGN, fx)) : ''}</TD>
            <TD style={[s.bNotes, { borderRightWidth: 0 }]} bold />
          </View>
        </View>

        {/* Bucket C */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Bucket C — Buffer + Logistics</Text>
        </View>
        <View style={s.table}>
          <View style={s.tableHeaderRow}>
            <TH style={s.cLine}>Line Item</TH>
            <TH style={s.cDesc}>Description</TH>
            <TH style={s.cAmt}>Amount (NGN)</TH>
            <TH style={[s.cUsd, { borderRightWidth: 0 }]}>USD Equivalent</TH>
          </View>
          {cRows.map((r, i) => (
            <View key={r.id} style={[s.tableRow, i % 2 === 0 ? s.tableRowOdd : s.tableRowEven]}>
              <TD style={s.cLine}>{r.lineItem}</TD>
              <TD style={s.cDesc}>{r.description}</TD>
              <TD style={s.cAmt}>{r.amount ? fmt(num(r.amount)) : ''}</TD>
              <TD style={[s.cUsd, { borderRightWidth: 0 }]}>{r.usdEq > 0 ? fmt(r.usdEq) : ''}</TD>
            </View>
          ))}
          <View style={s.subtotalRow}>
            <TD style={s.cLine} bold>SUBTOTAL — Bucket C</TD>
            <TD style={s.cDesc} bold />
            <TD style={s.cAmt} bold>{cTotalNGN > 0 ? fmt(cTotalNGN) : ''}</TD>
            <TD style={[s.cUsd, { borderRightWidth: 0 }]} bold>{cTotalNGN > 0 ? fmt(usd(cTotalNGN, fx)) : ''}</TD>
          </View>
        </View>

        {/* Budget Summary */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Budget Summary (Totals)</Text>
        </View>
        <View style={[s.summaryTable, { marginTop: 0, marginBottom: 12 }]}>
          <View style={s.tableHeaderRow}>
            <TH style={s.sBucket}>Bucket</TH>
            <TH style={s.sNgn}>Total (NGN)</TH>
            <TH style={[s.sUsd, { borderRightWidth: 0 }]}>USD Equivalent</TH>
          </View>
          {[
            { label: 'A. Core Packs', ngn: aTotalNGN },
            { label: 'B. Casework Fund', ngn: bTotalNGN },
            { label: 'C. Buffer + Logistics', ngn: cTotalNGN },
          ].map((r, i) => (
            <View key={r.label} style={[s.tableRow, i % 2 === 0 ? s.tableRowOdd : s.tableRowEven]}>
              <TD style={s.sBucket}>{r.label}</TD>
              <TD style={s.sNgn}>{r.ngn > 0 ? fmt(r.ngn) : ''}</TD>
              <TD style={[s.sUsd, { borderRightWidth: 0 }]}>{r.ngn > 0 ? fmt(usd(r.ngn, fx)) : ''}</TD>
            </View>
          ))}
          <View style={s.totalRow}>
            <TD style={s.sBucket} total bold>GRAND TOTAL</TD>
            <TD style={s.sNgn} total bold>{grandTotal > 0 ? fmt(grandTotal) : ''}</TD>
            <TD style={[s.sUsd, { borderRightWidth: 0 }]} total bold>{grandTotal > 0 ? fmt(usd(grandTotal, fx)) : ''}</TD>
          </View>
        </View>

        {/* Signatures */}
        <View style={s.sigRow}>
          <View style={s.sigBlock}>
            <Text style={s.sigLabel}>Prepared By (Name/Signature):</Text>
            <View style={s.sigLine}><Text style={s.sigValue}>{meta.preparedBy || ''}</Text></View>
            <Text style={s.dateLabel}>Date:</Text>
            <View style={s.dateLine}><Text style={s.dateValue}>{meta.preparedDate || ''}</Text></View>
          </View>
          <View style={s.sigBlock}>
            <Text style={s.sigLabel}>Approved By (Name/Signature):</Text>
            <View style={s.sigLine}><Text style={s.sigValue}>{meta.approvedBy || ''}</Text></View>
            <Text style={s.dateLabel}>Date:</Text>
            <View style={s.dateLine}><Text style={s.dateValue}>{meta.approvedDate || ''}</Text></View>
          </View>
        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>Saintlammy Foundation / SCCI</Text>
          <Text style={s.footerNote}>
            Note: Record NGN and USD equivalents for transparency. Keep evidence (quotes, receipts, confirmations) archived with the final outreach report.
          </Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};

export default BudgetTemplatePDF;
