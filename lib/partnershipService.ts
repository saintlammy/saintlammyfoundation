import { getTypedSupabaseClient } from './supabase';

export interface PartnershipApplication {
  id: string;
  organization_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  organization_type: 'corporation' | 'ngo' | 'government' | 'foundation' | 'individual' | 'other';
  partnership_type: 'corporate-csr' | 'program-collaboration' | 'funding' | 'resource-sharing' | 'volunteer' | 'other';
  message: string;
  timeline: 'immediate' | 'short-term' | 'medium-term' | 'long-term' | 'exploratory';
  status: 'new' | 'under-review' | 'approved' | 'rejected' | 'in-discussion';
  priority: 'low' | 'medium' | 'high';
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PartnershipTeamMember {
  id: string;
  name: string;
  role: string;
  expertise?: string;
  experience?: string;
  focus?: string[];
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface PartnershipFilters {
  status?: string;
  priority?: string;
  organization_type?: string;
  partnership_type?: string;
  limit?: number;
  offset?: number;
}

class PartnershipService {
  private static instance: PartnershipService;

  private constructor() {}

  static getInstance(): PartnershipService {
    if (!PartnershipService.instance) {
      PartnershipService.instance = new PartnershipService();
    }
    return PartnershipService.instance;
  }

  /**
   * Get partnership applications with optional filters
   */
  async getApplications(filters?: PartnershipFilters): Promise<{
    applications: PartnershipApplication[];
    total: number;
  }> {
    try {
      const client = getTypedSupabaseClient();
      let query = (client as any).from('partnership_applications').select('*', { count: 'exact' });

      // Apply filters
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters?.priority && filters.priority !== 'all') {
        query = query.eq('priority', filters.priority);
      }
      if (filters?.organization_type && filters.organization_type !== 'all') {
        query = query.eq('organization_type', filters.organization_type);
      }
      if (filters?.partnership_type && filters.partnership_type !== 'all') {
        query = query.eq('partnership_type', filters.partnership_type);
      }

      // Apply pagination
      const limit = filters?.limit || 50;
      const offset = filters?.offset || 0;
      query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching partnership applications:', error);
        // Return fallback mock data
        return this.getFallbackApplications();
      }

      return {
        applications: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error in getApplications:', error);
      return this.getFallbackApplications();
    }
  }

  /**
   * Get a single partnership application by ID
   */
  async getApplication(id: string): Promise<PartnershipApplication | null> {
    try {
      const client = getTypedSupabaseClient();
      const { data, error } = await (client as any)
        .from('partnership_applications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching partnership application:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getApplication:', error);
      return null;
    }
  }

  /**
   * Create a new partnership application
   */
  async createApplication(application: Omit<PartnershipApplication, 'id' | 'created_at' | 'updated_at'>): Promise<{
    success: boolean;
    application?: PartnershipApplication;
    error?: string;
  }> {
    try {
      const client = getTypedSupabaseClient();
      const { data, error } = await (client as any)
        .from('partnership_applications')
        .insert([application])
        .select()
        .single();

      if (error) {
        console.error('Error creating partnership application:', error);
        return { success: false, error: error.message };
      }

      return { success: true, application: data };
    } catch (error: any) {
      console.error('Error in createApplication:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update a partnership application
   */
  async updateApplication(id: string, updates: Partial<PartnershipApplication>): Promise<{
    success: boolean;
    application?: PartnershipApplication;
    error?: string;
  }> {
    try {
      const client = getTypedSupabaseClient();
      const { data, error } = await (client as any)
        .from('partnership_applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating partnership application:', error);
        return { success: false, error: error.message };
      }

      return { success: true, application: data };
    } catch (error: any) {
      console.error('Error in updateApplication:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete a partnership application
   */
  async deleteApplication(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const client = getTypedSupabaseClient();
      const { error } = await (client as any)
        .from('partnership_applications')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting partnership application:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in deleteApplication:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get partnership team members
   */
  async getTeamMembers(status?: string): Promise<{
    members: PartnershipTeamMember[];
    total: number;
  }> {
    try {
      const client = getTypedSupabaseClient();
      let query = (client as any).from('partnership_team_members').select('*', { count: 'exact' });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      query = query.order('name', { ascending: true });

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching partnership team members:', error);
        return this.getFallbackTeamMembers();
      }

      return {
        members: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error in getTeamMembers:', error);
      return this.getFallbackTeamMembers();
    }
  }

  /**
   * Create a new team member
   */
  async createTeamMember(member: Omit<PartnershipTeamMember, 'id' | 'created_at' | 'updated_at'>): Promise<{
    success: boolean;
    member?: PartnershipTeamMember;
    error?: string;
  }> {
    try {
      const client = getTypedSupabaseClient();
      const { data, error } = await (client as any)
        .from('partnership_team_members')
        .insert([member])
        .select()
        .single();

      if (error) {
        console.error('Error creating team member:', error);
        return { success: false, error: error.message };
      }

      return { success: true, member: data };
    } catch (error: any) {
      console.error('Error in createTeamMember:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update a team member
   */
  async updateTeamMember(id: string, updates: Partial<PartnershipTeamMember>): Promise<{
    success: boolean;
    member?: PartnershipTeamMember;
    error?: string;
  }> {
    try {
      const client = getTypedSupabaseClient();
      const { data, error } = await (client as any)
        .from('partnership_team_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating team member:', error);
        return { success: false, error: error.message };
      }

      return { success: true, member: data };
    } catch (error: any) {
      console.error('Error in updateTeamMember:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete a team member
   */
  async deleteTeamMember(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const client = getTypedSupabaseClient();
      const { error } = await (client as any)
        .from('partnership_team_members')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting team member:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in deleteTeamMember:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Fallback data when database is unavailable
   */
  private getFallbackApplications(): { applications: PartnershipApplication[]; total: number } {
    const mockApplications: PartnershipApplication[] = [
      {
        id: '1',
        organization_name: 'TechCorp Nigeria',
        contact_name: 'Adebayo Johnson',
        email: 'adebayo@techcorp.ng',
        phone: '+234 801 234 5678',
        organization_type: 'corporation',
        partnership_type: 'corporate-csr',
        message: 'We are interested in partnering with your foundation for our annual CSR initiative.',
        timeline: 'short-term',
        status: 'new',
        priority: 'high',
        created_at: new Date('2024-01-15T09:30:00').toISOString(),
        updated_at: new Date('2024-01-15T09:30:00').toISOString()
      },
      {
        id: '2',
        organization_name: 'Green Earth Foundation',
        contact_name: 'Sarah Okafor',
        email: 'sarah@greenearth.org',
        phone: '+234 803 456 7890',
        organization_type: 'ngo',
        partnership_type: 'program-collaboration',
        message: 'Our foundation focuses on environmental sustainability.',
        timeline: 'medium-term',
        status: 'under-review',
        priority: 'medium',
        assigned_to: 'Michael Okafor',
        created_at: new Date('2024-01-12T14:15:00').toISOString(),
        updated_at: new Date('2024-01-14T10:20:00').toISOString()
      },
      {
        id: '3',
        organization_name: 'Lagos State Ministry of Youth',
        contact_name: 'Dr. Kemi Adebisi',
        email: 'k.adebisi@lagosstate.gov.ng',
        phone: '+234 805 678 9012',
        organization_type: 'government',
        partnership_type: 'funding',
        message: 'The Lagos State Government is looking to partner with credible NGOs.',
        timeline: 'long-term',
        status: 'approved',
        priority: 'high',
        assigned_to: 'Sarah Adebayo',
        created_at: new Date('2024-01-08T11:45:00').toISOString(),
        updated_at: new Date('2024-01-13T16:30:00').toISOString()
      }
    ];

    return {
      applications: mockApplications,
      total: mockApplications.length
    };
  }

  private getFallbackTeamMembers(): { members: PartnershipTeamMember[]; total: number } {
    const mockMembers: PartnershipTeamMember[] = [
      {
        id: '1',
        name: 'Sarah Adebayo',
        role: 'Partnership Director',
        expertise: 'Corporate Partnerships & Strategic Alliances',
        experience: '8+ years in nonprofit partnerships',
        focus: ['Corporate CSR', 'Strategic Planning', 'Impact Measurement'],
        email: 'sarah.adebayo@saintlammyfoundation.org',
        phone: '+234 801 111 2222',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Michael Okafor',
        role: 'NGO Relations Manager',
        expertise: 'Inter-organizational Collaboration',
        experience: '6+ years in NGO partnerships',
        focus: ['NGO Alliances', 'Resource Sharing', 'Joint Programs'],
        email: 'michael.okafor@saintlammyfoundation.org',
        phone: '+234 802 333 4444',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Fatima Ibrahim',
        role: 'Community Engagement Lead',
        expertise: 'Individual & Community Partnerships',
        experience: '5+ years in community development',
        focus: ['Volunteer Programs', 'Individual Donors', 'Local Communities'],
        email: 'fatima.ibrahim@saintlammyfoundation.org',
        phone: '+234 803 555 6666',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    return {
      members: mockMembers,
      total: mockMembers.length
    };
  }
}

export const partnershipService = PartnershipService.getInstance();
