// Content service to simulate fetching data from admin CMS
// In a real application, this would connect to your database or CMS API

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
    avatar?: string;
  };
  lastModified: Date;
  publishDate?: Date;
  views: number;
  excerpt?: string;
  featuredImage?: string;
  slug: string;
  teamData?: {
    role: string;
    expertise: string;
    experience: string;
    focus: string[];
    email: string;
    phone: string;
  };
}

// Mock data - in production this would come from your database
const mockContentItems: ContentItem[] = [
  {
    id: '6',
    title: 'Sarah Adebayo',
    type: 'team',
    status: 'published',
    author: { name: 'Admin' },
    lastModified: new Date('2024-01-10'),
    publishDate: new Date('2024-01-01'),
    views: 0,
    excerpt: 'Partnership Director with 8+ years in nonprofit partnerships',
    slug: 'sarah-adebayo',
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
    lastModified: new Date('2024-01-10'),
    publishDate: new Date('2024-01-01'),
    views: 0,
    excerpt: 'NGO Relations Manager with 6+ years in NGO partnerships',
    slug: 'michael-okafor',
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
    lastModified: new Date('2024-01-10'),
    publishDate: new Date('2024-01-01'),
    views: 0,
    excerpt: 'Community Engagement Lead with 5+ years in community development',
    slug: 'fatima-ibrahim',
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

  return teamItems.map(item => ({
    id: item.id,
    name: item.title,
    role: item.teamData!.role,
    expertise: item.teamData!.expertise,
    experience: item.teamData!.experience,
    focus: item.teamData!.focus,
    email: item.teamData!.email,
    phone: item.teamData!.phone,
    status: 'active' as const,
    avatar: item.featuredImage
  }));
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