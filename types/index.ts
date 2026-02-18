// Database types based on the comprehensive schema
export type DonationCategory = 'orphan' | 'widow' | 'home' | 'general';
export type DonationFrequency = 'one-time' | 'monthly' | 'weekly' | 'yearly';
export type PaymentMethod = 'crypto' | 'naira' | 'bank_transfer' | 'card';
export type DonationStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type Currency = 'NGN' | 'USD' | 'ETH' | 'BTC';
export type BeneficiaryType = 'orphan' | 'widow' | 'home' | 'general';

// Additional types for comprehensive features
export type UserRole = 'admin' | 'manager' | 'volunteer' | 'donor' | 'beneficiary';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';
export type AdoptionStatus = 'pending' | 'active' | 'completed' | 'cancelled' | 'paused';
export type ProgramStatus = 'planning' | 'active' | 'completed' | 'cancelled' | 'on_hold';
export type ProgramType = 'education' | 'healthcare' | 'feeding' | 'housing' | 'empowerment' | 'emergency_relief' | 'skill_training' | 'other';
export type OutreachStatus = 'planned' | 'ongoing' | 'completed' | 'cancelled';
export type GrantStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'funded' | 'completed';
export type GrantType = 'government' | 'foundation' | 'corporate' | 'individual' | 'international' | 'crowdfunding';
export type PartnershipType = 'corporate' | 'ngo' | 'government' | 'international' | 'religious' | 'educational' | 'media';
export type PartnershipStatus = 'prospective' | 'negotiating' | 'active' | 'inactive' | 'terminated';
export type VolunteerStatus = 'applicant' | 'active' | 'inactive' | 'suspended' | 'alumni';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type AssignmentStatus = 'assigned' | 'in_progress' | 'completed' | 'cancelled';
export type TransactionType = 'income' | 'expense' | 'transfer';
export type TransactionStatus = 'pending' | 'approved' | 'rejected' | 'paid';
export type ReportType = 'financial' | 'program' | 'donor' | 'volunteer' | 'impact' | 'custom';

// Core entity interfaces
export interface OrphanageHome {
  id: string;
  name: string;
  location: string;
  description?: string;
  capacity?: number;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Orphan {
  id: string;
  name: string;
  age: number;
  home_id?: string;
  photo_url?: string;
  guardian_contact?: string;
  medical_info?: string;
  educational_level?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  home?: OrphanageHome; // Populated relation
}

export interface Widow {
  id: string;
  name: string;
  contact?: string;
  address?: string;
  number_of_children?: number;
  monthly_income?: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Donor {
  id: string;
  name: string;
  email_encrypted: string;
  email_hash: string;
  phone?: string;
  address?: string;
  is_anonymous: boolean;
  total_donated: number;
  created_at: string;
  updated_at: string;
  last_donation_at?: string;
}

export interface Donation {
  id: string;
  donor_id?: string;
  category: DonationCategory;
  amount: number;
  currency: Currency;
  frequency: DonationFrequency;
  payment_method: PaymentMethod;
  status: DonationStatus;
  tx_hash?: string;
  tx_reference?: string;
  beneficiary_id?: string;
  beneficiary_type?: BeneficiaryType;
  notes?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
  donor?: Donor; // Populated relation
}

export interface AuditLog {
  id: string;
  table_name: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  record_id: string;
  old_data?: Record<string, any>;
  new_data?: Record<string, any>;
  user_id?: string;
  created_at: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Form types
export interface DonationFormData {
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  amount: number;
  currency: Currency;
  category: DonationCategory;
  frequency: DonationFrequency;
  payment_method: PaymentMethod;
  beneficiary_id?: string;
  beneficiary_type?: BeneficiaryType;
  notes?: string;
  is_anonymous?: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Component prop types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// Loading and error states
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface AsyncState<T> extends LoadingState {
  data?: T;
}

// Supabase types
export interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

// Statistics types
export interface DonationStats {
  total_amount: number;
  total_donations: number;
  total_donors: number;
  monthly_recurring: number;
  categories: Record<DonationCategory, number>;
  recent_donations: Donation[];
}

export interface BeneficiaryStats {
  total_orphans: number;
  total_widows: number;
  total_homes: number;
  orphans_by_age_group: Record<string, number>;
  homes_by_location: Record<string, number>;
}

// Filter and search types
export interface DonationFilters {
  category?: DonationCategory;
  status?: DonationStatus;
  payment_method?: PaymentMethod;
  date_from?: string;
  date_to?: string;
  min_amount?: number;
  max_amount?: number;
}

export interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// New comprehensive interfaces for all features

// User management
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  address?: string;
  profile_image_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

// Adoption system
export interface Adoption {
  id: string;
  donor_id?: string;
  beneficiary_id: string;
  beneficiary_type: BeneficiaryType;
  amount: number;
  frequency: DonationFrequency;
  status: AdoptionStatus;
  start_date: string;
  end_date?: string;
  next_payment_date?: string;
  payment_method: PaymentMethod;
  notes?: string;
  created_at: string;
  updated_at: string;
  donor?: Donor;
  beneficiary?: Orphan | Widow | OrphanageHome;
}

// Programs
export interface Program {
  id: string;
  name: string;
  description: string;
  program_type: ProgramType;
  status: ProgramStatus;
  budget?: number;
  amount_raised: number;
  target_beneficiaries?: number;
  actual_beneficiaries: number;
  start_date: string;
  end_date?: string;
  location?: string;
  manager_id?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  manager?: User;
  outreaches?: Outreach[];
}

// Outreaches
export interface Outreach {
  id: string;
  program_id?: string;
  name: string;
  description?: string;
  location: string;
  status: OutreachStatus;
  date: string;
  start_time?: string;
  end_time?: string;
  budget?: number;
  participants_target?: number;
  participants_actual: number;
  coordinator_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  program?: Program;
  coordinator?: User;
}

// Grants
export interface Grant {
  id: string;
  title: string;
  description: string;
  grant_type: GrantType;
  funder_name: string;
  funder_contact?: string;
  amount_requested: number;
  amount_awarded: number;
  status: GrantStatus;
  application_deadline?: string;
  submitted_date?: string;
  decision_date?: string;
  funding_start_date?: string;
  funding_end_date?: string;
  program_id?: string;
  assigned_to?: string;
  documents_url?: string[];
  requirements?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  program?: Program;
  assignee?: User;
}

// Partnerships
export interface Partnership {
  id: string;
  organization_name: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  partnership_type: PartnershipType;
  status: PartnershipStatus;
  description?: string;
  benefits?: string;
  obligations?: string;
  start_date?: string;
  end_date?: string;
  value_estimate?: number;
  manager_id?: string;
  website_url?: string;
  address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  manager?: User;
}

// Volunteers
export interface Volunteer {
  id: string;
  user_id?: string;
  volunteer_id?: string;
  skills?: string[];
  availability?: string;
  status: VolunteerStatus;
  hours_committed: number;
  hours_completed: number;
  emergency_contact?: string;
  background_check_status?: 'pending' | 'approved' | 'failed' | 'not_required';
  background_check_date?: string;
  orientation_completed: boolean;
  orientation_date?: string;
  start_date?: string;
  supervisor_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  supervisor?: User;
  assignments?: VolunteerAssignment[];
}

// Volunteer assignments
export interface VolunteerAssignment {
  id: string;
  volunteer_id?: string;
  program_id?: string;
  outreach_id?: string;
  title: string;
  description?: string;
  status: AssignmentStatus;
  hours_estimated?: number;
  hours_actual: number;
  start_date: string;
  end_date?: string;
  supervisor_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  volunteer?: Volunteer;
  program?: Program;
  outreach?: Outreach;
  supervisor?: User;
}

// Budget categories
export interface BudgetCategory {
  id: string;
  name: string;
  description?: string;
  parent_category_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  parent_category?: BudgetCategory;
  sub_categories?: BudgetCategory[];
}

// Financial transactions
export interface Transaction {
  id: string;
  transaction_type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  category_id?: string;
  program_id?: string;
  vendor_name?: string;
  receipt_url?: string;
  status: TransactionStatus;
  approved_by?: string;
  approved_at?: string;
  paid_at?: string;
  reference_number?: string;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  category?: BudgetCategory;
  program?: Program;
  approver?: User;
  creator?: User;
}

// Reports
export interface Report {
  id: string;
  title: string;
  report_type: ReportType;
  parameters?: Record<string, any>;
  generated_by: string;
  file_url?: string;
  status: 'generating' | 'generated' | 'failed';
  created_at: string;
  generator?: User;
}

// Form data interfaces
export interface AdoptionFormData {
  beneficiary_id: string;
  beneficiary_type: BeneficiaryType;
  amount: number;
  frequency: DonationFrequency;
  payment_method: PaymentMethod;
  start_date: string;
  end_date?: string;
  notes?: string;
}

export interface ProgramFormData {
  name: string;
  description: string;
  program_type: ProgramType;
  budget?: number;
  target_beneficiaries?: number;
  start_date: string;
  end_date?: string;
  location?: string;
  manager_id?: string;
  image_url?: string;
}

export interface VolunteerApplicationData {
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  skills: string[];
  availability: string;
  emergency_contact?: string;
  bio?: string;
}

export interface GrantApplicationData {
  title: string;
  description: string;
  grant_type: GrantType;
  funder_name: string;
  funder_contact?: string;
  amount_requested: number;
  application_deadline?: string;
  program_id?: string;
  requirements?: string;
  notes?: string;
}

// Dashboard data interfaces
export interface DashboardStats {
  totalDonations: number;
  totalDonors: number;
  totalBeneficiaries: number;
  totalOrphans?: number;
  totalWidows?: number;
  totalOutreaches?: number;
  yearsOfImpact?: number;
  totalPrograms: number;
  totalVolunteers: number;
  totalPartnerships: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  activeAdoptions: number;
  pendingGrants: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
  }[];
}

// API response extensions
export interface PaginatedApiResponse<T> extends ApiResponse<PaginatedResponse<T>> {
  filters?: Record<string, any>;
}

// Comprehensive filter types
export interface ProgramFilters {
  status?: ProgramStatus;
  program_type?: ProgramType;
  manager_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface VolunteerFilters {
  status?: VolunteerStatus;
  skills?: string[];
  supervisor_id?: string;
  hours_min?: number;
  hours_max?: number;
}

export interface GrantFilters {
  status?: GrantStatus;
  grant_type?: GrantType;
  program_id?: string;
  deadline_from?: string;
  deadline_to?: string;
  amount_min?: number;
  amount_max?: number;
}

export interface TransactionFilters {
  transaction_type?: TransactionType;
  status?: TransactionStatus;
  category_id?: string;
  program_id?: string;
  date_from?: string;
  date_to?: string;
  amount_min?: number;
  amount_max?: number;
}

