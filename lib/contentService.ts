// Content service to connect to database CMS

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  expertise: string;
  experience: string;
  focus: string[];
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

export interface PartnershipProcess {
  step: number;
  title: string;
  duration: string;
  description: string;
  icon: string;
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'page' | 'blog' | 'program' | 'story' | 'media' | 'team' | 'partnership';
  status: 'published' | 'draft' | 'scheduled' | 'archived';
  author: {
    name: string;
    email?: string;
  };
  content?: string;
  excerpt?: string;
  slug: string;
  featuredImage?: string;
  publishDate?: string;
  views: number;
  metadata?: Record<string, any>;
  teamData?: {
    role: string;
    expertise: string;
    experience: string;
    focus: string[];
    email: string;
    phone: string;
  };
  created_at: string;
  updated_at: string;
}

// API integration class
export class ContentService {
  private static baseUrl = '/api/content';

  static async getContent(params: {
    type?: string;
    status?: string;
    limit?: number;
    offset?: number;
    search?: string;
  } = {}): Promise<{
    data: ContentItem[];
    total: number;
    limit: number;
    offset: number;
  }> {
    try {
      const searchParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${this.baseUrl}?${searchParams.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch content');
      }

      return {
        data: result.data,
        total: result.total,
        limit: result.limit,
        offset: result.offset
      };
    } catch (error) {
      console.warn('Failed to fetch from API, falling back to mock data:', error);
      return this.getMockContent(params);
    }
  }

  static async createContent(contentData: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>): Promise<ContentItem> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contentData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create content: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to create content');
      }

      return result.data;
    } catch (error) {
      console.error('Failed to create content:', error);
      throw error;
    }
  }

  static async updateContent(id: string, updateData: Partial<ContentItem>): Promise<ContentItem> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updateData }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update content: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to update content');
      }

      return result.data;
    } catch (error) {
      console.error('Failed to update content:', error);
      throw error;
    }
  }

  static async deleteContent(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete content: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to delete content');
      }
    } catch (error) {
      console.error('Failed to delete content:', error);
      throw error;
    }
  }

  static async bulkUpdateStatus(ids: string[], status: ContentItem['status']): Promise<void> {
    const updatePromises = ids.map(id =>
      this.updateContent(id, { status })
    );

    await Promise.all(updatePromises);
  }

  static async bulkDelete(ids: string[]): Promise<void> {
    const deletePromises = ids.map(id => this.deleteContent(id));
    await Promise.all(deletePromises);
  }

  // Get foundation story content
  static async getFoundationStory(): Promise<ContentItem | null> {
    const result = await this.getContent({
      type: 'page',
      search: 'foundation story'
    });

    return result.data.length > 0 ? result.data[0] : null;
  }

  // Get all published programs
  static async getPublishedPrograms(): Promise<ContentItem[]> {
    const result = await this.getContent({
      type: 'program',
      status: 'published'
    });

    return result.data;
  }

  // Get published team members
  static async getPublishedTeamMembers(): Promise<ContentItem[]> {
    const result = await this.getContent({
      type: 'team',
      status: 'published'
    });

    return result.data;
  }

  // Get published stories
  static async getPublishedStories(limit: number = 10): Promise<ContentItem[]> {
    const result = await this.getContent({
      type: 'story',
      status: 'published',
      limit
    });

    return result.data;
  }

  // Get published blog posts
  static async getPublishedBlogPosts(limit: number = 10): Promise<ContentItem[]> {
    const result = await this.getContent({
      type: 'blog',
      status: 'published',
      limit
    });

    return result.data;
  }

  // Fallback mock data method
  private static getMockContent(params: any): Promise<{
    data: ContentItem[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const mockData = mockContentItems.map(item => ({
      ...item,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      content: item.excerpt || '',
      publishDate: typeof item.publishDate === 'string' ? item.publishDate : (item.publishDate as any)?.toISOString(),
      author: {
        name: item.author.name,
        email: `${item.author.name.toLowerCase().replace(' ', '.')}@saintlammyfoundation.org`
      }
    }));

    let filtered = mockData;

    if (params.type && params.type !== 'all') {
      filtered = filtered.filter(item => item.type === params.type);
    }

    if (params.status && params.status !== 'all') {
      filtered = filtered.filter(item => item.status === params.status);
    }

    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(search) ||
        item.excerpt?.toLowerCase().includes(search) ||
        item.content?.toLowerCase().includes(search)
      );
    }

    const limit = params.limit || 50;
    const offset = params.offset || 0;
    const paginatedData = filtered.slice(offset, offset + limit);

    return Promise.resolve({
      data: paginatedData,
      total: filtered.length,
      limit,
      offset
    });
  }
}

// Mock data - in production this would come from your database
const mockContentItems: ContentItem[] = [
  {
    id: '6',
    title: 'Sarah Adebayo',
    type: 'team',
    status: 'published',
    author: { name: 'Admin' },
    publishDate: '2024-01-01',
    views: 0,
    excerpt: 'Partnership Director with 8+ years in nonprofit partnerships',
    slug: 'sarah-adebayo',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    teamData: {
      role: 'Partnership Director',
      expertise: 'Corporate Partnerships & Strategic Alliances',
      experience: '8+ years in nonprofit partnerships',
      focus: ['Corporate CSR', 'Strategic Planning', 'Impact Measurement'],
      email: 'sarah.adebayo@saintlammyfoundation.org',
      phone: '+234 801 111 2222'
    }
  },
  {
    id: '7',
    title: 'Michael Okafor',
    type: 'team',
    status: 'published',
    author: { name: 'Admin' },
    publishDate: '2024-01-01',
    views: 0,
    excerpt: 'NGO Relations Manager with 6+ years in NGO partnerships',
    slug: 'michael-okafor',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    teamData: {
      role: 'NGO Relations Manager',
      expertise: 'Inter-organizational Collaboration',
      experience: '6+ years in NGO partnerships',
      focus: ['NGO Alliances', 'Resource Sharing', 'Joint Programs'],
      email: 'michael.okafor@saintlammyfoundation.org',
      phone: '+234 802 333 4444'
    }
  },
  {
    id: '8',
    title: 'Fatima Ibrahim',
    type: 'team',
    status: 'published',
    author: { name: 'Admin' },
    publishDate: '2024-01-01',
    views: 0,
    excerpt: 'Community Engagement Lead with 5+ years in community development',
    slug: 'fatima-ibrahim',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    teamData: {
      role: 'Community Engagement Lead',
      expertise: 'Individual & Community Partnerships',
      experience: '5+ years in community development',
      focus: ['Volunteer Programs', 'Individual Donors', 'Local Communities'],
      email: 'fatima.ibrahim@saintlammyfoundation.org',
      phone: '+234 803 555 6666'
    }
  }
];

const mockPartnershipProcess: PartnershipProcess[] = [
  {
    step: 1,
    title: 'Initial Consultation',
    duration: '30-45 minutes',
    description: 'We discuss your organization\'s goals, our mission alignment, and potential collaboration areas.',
    icon: 'MessageCircle'
  },
  {
    step: 2,
    title: 'Partnership Assessment',
    duration: '1-2 weeks',
    description: 'Our team evaluates partnership opportunities and develops a customized collaboration proposal.',
    icon: 'FileText'
  },
  {
    step: 3,
    title: 'Agreement & Planning',
    duration: '2-3 weeks',
    description: 'We finalize partnership terms, create implementation timelines, and establish success metrics.',
    icon: 'Handshake'
  },
  {
    step: 4,
    title: 'Launch & Execution',
    duration: 'Ongoing',
    description: 'Partnership launches with regular check-ins, progress reports, and continuous optimization.',
    icon: 'Target'
  }
];

// Service functions
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Filter and transform content items to team members
  const teamItems = mockContentItems.filter(item =>
    item.type === 'team' &&
    item.status === 'published' &&
    item.teamData
  );

  return teamItems.map(item => {
    const teamMember: TeamMember = {
      id: item.id,
      name: item.title,
      role: item.teamData!.role,
      expertise: item.teamData!.expertise,
      experience: item.teamData!.experience,
      focus: item.teamData!.focus,
      email: item.teamData!.email,
      phone: item.teamData!.phone,
      status: 'active' as 'active' | 'inactive'
    };

    // Only add avatar property if featuredImage exists
    if (item.featuredImage) {
      teamMember.avatar = item.featuredImage;
    }

    return teamMember;
  });
};

export const getPartnershipProcess = async (): Promise<PartnershipProcess[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 50));

  return mockPartnershipProcess;
};

export const getTeamMemberBySlug = async (slug: string): Promise<TeamMember | null> => {
  const teamMembers = await getTeamMembers();
  return teamMembers.find(member =>
    member.name.toLowerCase().replace(' ', '-') === slug
  ) || null;
};

export const submitPartnershipApplication = async (formData: any): Promise<{ success: boolean; message: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // In a real application, this would save to your database
  console.log('Partnership application submitted:', formData);

  return {
    success: true,
    message: 'Partnership application submitted successfully. We will get back to you within 48 hours.'
  };
};

// Content management functions for admin
export const getAllContent = async (): Promise<ContentItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockContentItems;
};

export const createTeamMember = async (teamData: Omit<TeamMember, 'id'>): Promise<TeamMember> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const newId = (mockContentItems.length + 1).toString();
  const newMember: TeamMember = {
    id: newId,
    ...teamData
  };

  // In a real app, this would save to database
  console.log('New team member created:', newMember);

  return newMember;
};

export const updateTeamMember = async (id: string, teamData: Partial<TeamMember>): Promise<TeamMember | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  // In a real app, this would update in database
  console.log('Team member updated:', { id, ...teamData });

  // Return updated member (mock)
  const existingMembers = await getTeamMembers();
  const member = existingMembers.find(m => m.id === id);
  if (member) {
    return { ...member, ...teamData };
  }
  return null;
};

export const deleteTeamMember = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  // In a real app, this would delete from database
  console.log('Team member deleted:', id);

  return true;
};