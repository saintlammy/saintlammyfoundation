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
      newsletter_subscribers: {
        Row: {
          id: string;
          name: string;
          email: string;
          is_active: boolean;
          source: string;
          subscribed_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          is_active?: boolean;
          source?: string;
          subscribed_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          is_active?: boolean;
          source?: string;
          subscribed_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      volunteers: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          location: string;
          interests: string[];
          availability: string;
          experience: string;
          motivation: string;
          skills: string;
          status: 'pending' | 'approved' | 'active' | 'inactive';
          background_check: boolean;
          commitment: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          location: string;
          interests: string[];
          availability: string;
          experience: string;
          motivation: string;
          skills: string;
          status?: 'pending' | 'approved' | 'active' | 'inactive';
          background_check?: boolean;
          commitment: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          location?: string;
          interests?: string[];
          availability?: string;
          experience?: string;
          motivation?: string;
          skills?: string;
          status?: 'pending' | 'approved' | 'active' | 'inactive';
          background_check?: boolean;
          commitment?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      recurring_donations: {
        Row: {
          id: string;
          donor_id: string;
          amount: number;
          currency: string;
          frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
          status: 'active' | 'paused' | 'cancelled';
          next_payment: string;
          start_date: string;
          end_date: string | null;
          total_collected: number;
          successful_payments: number;
          failed_payments: number;
          payment_method: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          donor_id: string;
          amount: number;
          currency?: string;
          frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
          status?: 'active' | 'paused' | 'cancelled';
          next_payment: string;
          start_date?: string;
          end_date?: string | null;
          total_collected?: number;
          successful_payments?: number;
          failed_payments?: number;
          payment_method: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          donor_id?: string;
          amount?: number;
          currency?: string;
          frequency?: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
          status?: 'active' | 'paused' | 'cancelled';
          next_payment?: string;
          start_date?: string;
          end_date?: string | null;
          total_collected?: number;
          successful_payments?: number;
          failed_payments?: number;
          payment_method?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      content_pages: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string | null;
          type: 'page' | 'blog' | 'program' | 'story' | 'media' | 'team' | 'partnership';
          status: 'published' | 'draft' | 'scheduled' | 'archived';
          featured_image: string | null;
          publish_date: string | null;
          metadata: any | null;
          author_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          excerpt?: string | null;
          type: 'page' | 'blog' | 'program' | 'story' | 'media' | 'team' | 'partnership';
          status?: 'published' | 'draft' | 'scheduled' | 'archived';
          featured_image?: string | null;
          publish_date?: string | null;
          metadata?: any | null;
          author_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string | null;
          type?: 'page' | 'blog' | 'program' | 'story' | 'media' | 'team' | 'partnership';
          status?: 'published' | 'draft' | 'scheduled' | 'archived';
          featured_image?: string | null;
          publish_date?: string | null;
          metadata?: any | null;
          author_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      programs: {
        Row: {
          id: string;
          name: string;
          description: string;
          category: 'orphan' | 'widow' | 'community' | 'education' | 'medical';
          status: 'active' | 'paused' | 'completed';
          start_date: string;
          end_date: string | null;
          target_amount: number | null;
          raised_amount: number;
          beneficiaries_target: number | null;
          beneficiaries_reached: number;
          location: string | null;
          featured_image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          category: 'orphan' | 'widow' | 'community' | 'education' | 'medical';
          status?: 'active' | 'paused' | 'completed';
          start_date?: string;
          end_date?: string | null;
          target_amount?: number | null;
          raised_amount?: number;
          beneficiaries_target?: number | null;
          beneficiaries_reached?: number;
          location?: string | null;
          featured_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          category?: 'orphan' | 'widow' | 'community' | 'education' | 'medical';
          status?: 'active' | 'paused' | 'completed';
          start_date?: string;
          end_date?: string | null;
          target_amount?: number | null;
          raised_amount?: number;
          beneficiaries_target?: number | null;
          beneficiaries_reached?: number;
          location?: string | null;
          featured_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      outreaches: {
        Row: {
          id: string;
          title: string;
          description: string;
          date: string;
          time: string;
          location: string;
          target_beneficiaries: number;
          volunteers_needed: number;
          status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
          featured_image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          date: string;
          time: string;
          location: string;
          target_beneficiaries?: number;
          volunteers_needed?: number;
          status?: 'planned' | 'in_progress' | 'completed' | 'cancelled';
          featured_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          date?: string;
          time?: string;
          location?: string;
          target_beneficiaries?: number;
          volunteers_needed?: number;
          status?: 'planned' | 'in_progress' | 'completed' | 'cancelled';
          featured_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          role: string | null;
          content: string;
          rating: number | null;
          featured_image: string | null;
          is_featured: boolean;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role?: string | null;
          content: string;
          rating?: number | null;
          featured_image?: string | null;
          is_featured?: boolean;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string | null;
          content?: string;
          rating?: number | null;
          featured_image?: string | null;
          is_featured?: boolean;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_name: string;
          sender_email: string;
          subject: string;
          content: string;
          status: 'unread' | 'read' | 'replied' | 'archived';
          priority: 'low' | 'normal' | 'high' | 'urgent';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sender_name: string;
          sender_email: string;
          subject: string;
          content: string;
          status?: 'unread' | 'read' | 'replied' | 'archived';
          priority?: 'low' | 'normal' | 'high' | 'urgent';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sender_name?: string;
          sender_email?: string;
          subject?: string;
          content?: string;
          status?: 'unread' | 'read' | 'replied' | 'archived';
          priority?: 'low' | 'normal' | 'high' | 'urgent';
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          title: string;
          message: string;
          type: 'info' | 'success' | 'warning' | 'error';
          recipient_type: 'all' | 'donors' | 'volunteers' | 'admins';
          recipient_id: string | null;
          is_read: boolean;
          sent_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          message: string;
          type?: 'info' | 'success' | 'warning' | 'error';
          recipient_type?: 'all' | 'donors' | 'volunteers' | 'admins';
          recipient_id?: string | null;
          is_read?: boolean;
          sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          message?: string;
          type?: 'info' | 'success' | 'warning' | 'error';
          recipient_type?: 'all' | 'donors' | 'volunteers' | 'admins';
          recipient_id?: string | null;
          is_read?: boolean;
          sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
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