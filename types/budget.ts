// ─── Budget Template Types ──────────────────────────────────────────────────
// Kept in a separate file (no @react-pdf/renderer dependency) so they can be
// safely imported from both the PDF component and the admin page without
// triggering module-resolution issues during production builds.

/** A single column definition for a bucket table */
export interface BucketColumn {
  key: string;           // unique field key
  label: string;         // header label shown in PDF
  type: 'text' | 'number' | 'currency' | 'computed'; // 'computed' = auto-calculated
  width: string;         // e.g. '20%'
  align?: 'left' | 'right' | 'center';
  /** If type=computed, this determines what to compute */
  compute?: 'qty_total' | 'row_total' | 'usd_equiv' | 'usd_approved';
}

/** A single data row in a bucket — keys match column.key */
export type BucketRow = { id: string } & Record<string, string>;

/** A single bucket (section) of the budget */
export interface Bucket {
  id: string;
  name: string;           // e.g. "Bucket A — Core Packs"
  subtitle?: string;      // tip text shown under header
  columns: BucketColumn[];
  rows: BucketRow[];
  /** Which column key holds the "total" value for subtotal calculation */
  totalKey?: string;
  /** Which column key holds "approved" for subtotal (when different from totalKey) */
  approvedKey?: string;
}

/** Guardrail row for the guardrails table */
export interface Guardrail {
  bucket: string;
  purpose: string;
  cap: string;
  notes: string;
}

export interface BudgetTemplateMeta {
  // Branding
  orgName: string;
  templateTitle: string;
  templateSubtitle: string;
  tagline: string;

  // Meta fields (label → value pairs — fully customizable)
  metaFields: { label: string; value: string }[];

  // Currency
  primaryCurrency: string;
  primarySymbol: string;
  secondaryCurrency: string;
  secondarySymbol: string;
  fxRate: string;

  // Guardrails section (optional)
  showGuardrails: boolean;
  guardrails: Guardrail[];

  // Signature fields
  preparedBy: string;
  preparedDate: string;
  approvedBy: string;
  approvedDate: string;

  // Footer note
  footerNote: string;

  // Multiplier label (e.g. "homes", "units", "staff") — used in computed qty_total
  multiplierLabel: string;
  multiplierValue: string;
}

export interface BudgetDocumentData {
  meta: BudgetTemplateMeta;
  buckets: Bucket[];
}
