// Generated Supabase types - this would normally be auto-generated
export interface Database {
  public: {
    Tables: {
      orphanage_homes: {
        Row: {
          id: string;
          name: string;
          location: string;
          description: string | null;
          capacity: number | null;
          contact_phone: string | null;
          created_at: string;
          updated_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          location: string;
          description?: string | null;
          capacity?: number | null;
          contact_phone?: string | null;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string;
          description?: string | null;
          capacity?: number | null;
          contact_phone?: string | null;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
        };
      };
      orphans: {
        Row: {
          id: string;
          name: string;
          age: number;
          home_id: string | null;
          photo_url: string | null;
          guardian_contact: string | null;
          medical_info: string | null;
          educational_level: string | null;
          created_at: string;
          updated_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          age: number;
          home_id?: string | null;
          photo_url?: string | null;
          guardian_contact?: string | null;
          medical_info?: string | null;
          educational_level?: string | null;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          age?: number;
          home_id?: string | null;
          photo_url?: string | null;
          guardian_contact?: string | null;
          medical_info?: string | null;
          educational_level?: string | null;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
        };
      };
      widows: {
        Row: {
          id: string;
          name: string;
          contact: string | null;
          address: string | null;
          number_of_children: number | null;
          monthly_income: number | null;
          created_at: string;
          updated_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          contact?: string | null;
          address?: string | null;
          number_of_children?: number | null;
          monthly_income?: number | null;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          contact?: string | null;
          address?: string | null;
          number_of_children?: number | null;
          monthly_income?: number | null;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
        };
      };
      donors: {
        Row: {
          id: string;
          name: string;
          email_encrypted: string;
          email_hash: string;
          phone: string | null;
          address: string | null;
          is_anonymous: boolean;
          total_donated: number;
          created_at: string;
          updated_at: string;
          last_donation_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          email_encrypted: string;
          email_hash: string;
          phone?: string | null;
          address?: string | null;
          is_anonymous?: boolean;
          total_donated?: number;
          created_at?: string;
          updated_at?: string;
          last_donation_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email_encrypted?: string;
          email_hash?: string;
          phone?: string | null;
          address?: string | null;
          is_anonymous?: boolean;
          total_donated?: number;
          created_at?: string;
          updated_at?: string;
          last_donation_at?: string | null;
        };
      };
      donations: {
        Row: {
          id: string;
          donor_id: string | null;
          category: 'orphan' | 'widow' | 'home' | 'general';
          amount: number;
          currency: string;
          frequency: 'one-time' | 'monthly' | 'weekly' | 'yearly';
          payment_method: 'crypto' | 'naira' | 'bank_transfer' | 'card';
          status: 'pending' | 'completed' | 'failed' | 'refunded';
          tx_hash: string | null;
          tx_reference: string | null;
          beneficiary_id: string | null;
          beneficiary_type: string | null;
          notes: string | null;
          processed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          donor_id?: string | null;
          category: 'orphan' | 'widow' | 'home' | 'general';
          amount: number;
          currency?: string;
          frequency?: 'one-time' | 'monthly' | 'weekly' | 'yearly';
          payment_method: 'crypto' | 'naira' | 'bank_transfer' | 'card';
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          tx_hash?: string | null;
          tx_reference?: string | null;
          beneficiary_id?: string | null;
          beneficiary_type?: string | null;
          notes?: string | null;
          processed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          donor_id?: string | null;
          category?: 'orphan' | 'widow' | 'home' | 'general';
          amount?: number;
          currency?: string;
          frequency?: 'one-time' | 'monthly' | 'weekly' | 'yearly';
          payment_method?: 'crypto' | 'naira' | 'bank_transfer' | 'card';
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          tx_hash?: string | null;
          tx_reference?: string | null;
          beneficiary_id?: string | null;
          beneficiary_type?: string | null;
          notes?: string | null;
          processed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_log: {
        Row: {
          id: string;
          table_name: string;
          operation: 'INSERT' | 'UPDATE' | 'DELETE';
          record_id: string;
          old_data: any | null;
          new_data: any | null;
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          table_name: string;
          operation: 'INSERT' | 'UPDATE' | 'DELETE';
          record_id: string;
          old_data?: any | null;
          new_data?: any | null;
          user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          table_name?: string;
          operation?: 'INSERT' | 'UPDATE' | 'DELETE';
          record_id?: string;
          old_data?: any | null;
          new_data?: any | null;
          user_id?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      encrypt_email: {
        Args: { email_input: string };
        Returns: string;
      };
      hash_email: {
        Args: { email_input: string };
        Returns: string;
      };
    };
    Enums: {
      donation_category: 'orphan' | 'widow' | 'home' | 'general';
      donation_frequency: 'one-time' | 'monthly' | 'weekly' | 'yearly';
      payment_method: 'crypto' | 'naira' | 'bank_transfer' | 'card';
      donation_status: 'pending' | 'completed' | 'failed' | 'refunded';
    };
  };
}