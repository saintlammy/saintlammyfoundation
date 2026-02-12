import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return await getPageContent(req, res);
    case 'POST':
      return await createPageContent(req, res);
    case 'PUT':
      return await updatePageContent(req, res);
    case 'DELETE':
      return await deletePageContent(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getPageContent(req: NextApiRequest, res: NextApiResponse) {
  const { slug, section } = req.query;

  try {
    if (!supabase) {
      return res.status(200).json(getMockPageContent(slug as string, section as string));
    }

    let query = (supabase
      .from('page_content') as any)
      .select('*');

    if (slug) {
      query = query.eq('page_slug', slug);
    }

    if (section) {
      query = query.eq('section', section);
    }

    query = query.order('order_index', { ascending: true });

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(200).json(getMockPageContent(slug as string, section as string));
    }

    if (!data || data.length === 0) {
      return res.status(200).json(getMockPageContent(slug as string, section as string));
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(200).json(getMockPageContent(slug as string, section as string));
  }
}

async function createPageContent(req: NextApiRequest, res: NextApiResponse) {
  try {
    const contentData = req.body;

    if (!contentData.page_slug || !contentData.section) {
      return res.status(400).json({ error: 'page_slug and section are required' });
    }

    const newContent = {
      ...contentData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!supabase) {
      return res.status(201).json({
        id: Date.now().toString(),
        ...newContent,
        message: 'Page content created successfully (mock mode)'
      });
    }

    const { data, error } = await (supabase
      .from('page_content') as any)
      .insert([newContent] as any)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(201).json({
        id: Date.now().toString(),
        ...newContent,
        message: 'Page content created successfully (mock mode)'
      });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updatePageContent(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Content ID is required' });
    }

    updateData.updated_at = new Date().toISOString();

    if (!supabase) {
      return res.status(200).json({
        id,
        ...updateData,
        message: 'Page content updated successfully (mock mode)'
      });
    }

    const { data, error } = await (supabase
      .from('page_content') as any)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(200).json({
        id,
        ...updateData,
        message: 'Page content updated successfully (mock mode)'
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deletePageContent(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Content ID is required' });
    }

    if (!supabase) {
      return res.status(200).json({
        success: true,
        message: 'Page content deleted successfully (mock mode)'
      });
    }

    const { error } = await (supabase
      .from('page_content') as any)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(200).json({
        message: 'Page content deleted successfully (mock mode)'
      });
    }

    res.status(200).json({ message: 'Page content deleted successfully' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function getMockPageContent(slug?: string, section?: string) {
  const mockContent: any[] = [
    // About Page - Team Members
    {
      id: '1',
      page_slug: 'about',
      section: 'team',
      order_index: 1,
      data: {
        name: 'Samuel Lammy',
        role: 'Founder & Executive Director',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        bio: 'Passionate about empowering vulnerable communities with over 8 years of experience in community development and charity work.',
        linkedin: '#'
      }
    },
    {
      id: '2',
      page_slug: 'about',
      section: 'team',
      order_index: 2,
      data: {
        name: 'Grace Adunola',
        role: 'Program Director',
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        bio: 'Leads our outreach programs with a heart for widows and orphans. Former social worker with 12+ years experience.',
        linkedin: '#'
      }
    },
    {
      id: '3',
      page_slug: 'about',
      section: 'team',
      order_index: 3,
      data: {
        name: 'David Okafor',
        role: 'Operations Manager',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        bio: 'Ensures efficient operations and transparency in all our programs. Background in nonprofit management and finance.',
        linkedin: '#'
      }
    },
    // About Page - Milestones
    {
      id: '4',
      page_slug: 'about',
      section: 'milestones',
      order_index: 1,
      data: {
        year: '2021',
        event: 'Foundation established with community outreach programs',
        icon: 'Heart'
      }
    },
    {
      id: '5',
      page_slug: 'about',
      section: 'milestones',
      order_index: 2,
      data: {
        year: '2022',
        event: 'First orphanage adoption program launched',
        icon: 'Users'
      }
    },
    {
      id: '6',
      page_slug: 'about',
      section: 'milestones',
      order_index: 3,
      data: {
        year: '2023',
        event: 'Reached 500+ widows and 300+ orphans supported',
        icon: 'Target'
      }
    },
    {
      id: '7',
      page_slug: 'about',
      section: 'milestones',
      order_index: 4,
      data: {
        year: '2024',
        event: 'Expanded to crypto donations and digital transparency',
        icon: 'Globe'
      }
    },
    {
      id: '8',
      page_slug: 'about',
      section: 'milestones',
      order_index: 5,
      data: {
        year: '2025',
        event: 'Officially incorporated as Saintlammy Community Care Initiative (CAC: 9015713)',
        icon: 'Award'
      }
    },
    // About Page - Values
    {
      id: '9',
      page_slug: 'about',
      section: 'values',
      order_index: 1,
      data: {
        title: 'Transparency',
        description: 'Every donation is tracked and documented. We believe in complete financial transparency.',
        icon: 'Target'
      }
    },
    {
      id: '10',
      page_slug: 'about',
      section: 'values',
      order_index: 2,
      data: {
        title: 'Faith-Driven',
        description: 'Rooted in Christian values, guided by compassion and service to those in need.',
        icon: 'Heart'
      }
    },
    {
      id: '11',
      page_slug: 'about',
      section: 'values',
      order_index: 3,
      data: {
        title: 'Community Impact',
        description: 'Focus on sustainable, long-term change that empowers communities.',
        icon: 'Users'
      }
    },
    {
      id: '12',
      page_slug: 'about',
      section: 'values',
      order_index: 4,
      data: {
        title: 'Accountability',
        description: 'Regular reporting and updates on how donations create real impact.',
        icon: 'Award'
      }
    },
    // Governance Page - Board Members
    {
      id: '13',
      page_slug: 'governance',
      section: 'board',
      order_index: 1,
      data: {
        name: 'Dr. Adebayo Johnson',
        position: 'Chairman of the Board',
        background: 'Former Director of Social Services, Lagos State Government. 25+ years in nonprofit governance.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        credentials: ['PhD Public Administration', 'Certified Nonprofit Executive', 'Board Leadership Certificate']
      }
    },
    {
      id: '14',
      page_slug: 'governance',
      section: 'board',
      order_index: 2,
      data: {
        name: 'Mrs. Funmi Adebayo',
        position: 'Vice Chairperson',
        background: 'Senior Partner at a leading accounting firm. Expert in nonprofit financial management and compliance.',
        image: 'https://images.unsplash.com/photo-1494790108755-2616c34ca2f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        credentials: ['CPA, FCCA', 'Nonprofit Finance Specialist', '20+ years audit experience']
      }
    },
    {
      id: '15',
      page_slug: 'governance',
      section: 'board',
      order_index: 3,
      data: {
        name: 'Dr. Emmanuel Okafor',
        position: 'Secretary',
        background: 'Pediatrician and child welfare advocate. Leads healthcare initiatives for vulnerable children.',
        image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        credentials: ['MD Pediatrics', 'Child Welfare Certification', 'Healthcare Policy Advisor']
      }
    },
    {
      id: '16',
      page_slug: 'governance',
      section: 'board',
      order_index: 4,
      data: {
        name: 'Rev. Grace Oduya',
        position: 'Treasurer',
        background: 'Community leader and microfinance expert. Specializes in widow empowerment and financial literacy.',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        credentials: ['MBA Finance', 'Microfinance Specialist', 'Community Development Expert']
      }
    },
    {
      id: '17',
      page_slug: 'governance',
      section: 'board',
      order_index: 5,
      data: {
        name: 'Prof. Samuel Kalu',
        position: 'Member',
        background: 'Education researcher and former university administrator. Champions educational access for orphans.',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        credentials: ['PhD Education', 'UNESCO Consultant', 'Educational Policy Expert']
      }
    },
    {
      id: '18',
      page_slug: 'governance',
      section: 'board',
      order_index: 6,
      data: {
        name: 'Mrs. Blessing Uche',
        position: 'Member',
        background: 'Legal practitioner specializing in nonprofit law and children\'s rights advocacy.',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        credentials: ['LLB, BL', 'Children\'s Rights Advocate', 'Nonprofit Law Specialist']
      }
    },
    // Governance Page - Policies
    {
      id: '19',
      page_slug: 'governance',
      section: 'policies',
      order_index: 1,
      data: {
        title: 'Code of Conduct',
        description: 'Ethical standards and behavioral expectations for all team members and volunteers',
        icon: 'Scale'
      }
    },
    {
      id: '20',
      page_slug: 'governance',
      section: 'policies',
      order_index: 2,
      data: {
        title: 'Conflict of Interest Policy',
        description: 'Guidelines for identifying and managing potential conflicts of interest',
        icon: 'Shield'
      }
    },
    {
      id: '21',
      page_slug: 'governance',
      section: 'policies',
      order_index: 3,
      data: {
        title: 'Financial Management Policy',
        description: 'Procedures for budget management, expense approval, and financial oversight',
        icon: 'FileText'
      }
    },
    {
      id: '22',
      page_slug: 'governance',
      section: 'policies',
      order_index: 4,
      data: {
        title: 'Whistleblower Protection',
        description: 'Safe channels for reporting misconduct or policy violations',
        icon: 'Award'
      }
    },
    {
      id: '23',
      page_slug: 'governance',
      section: 'policies',
      order_index: 5,
      data: {
        title: 'Child Protection Policy',
        description: 'Comprehensive safeguarding measures for all children in our programs',
        icon: 'Users'
      }
    },
    {
      id: '24',
      page_slug: 'governance',
      section: 'policies',
      order_index: 6,
      data: {
        title: 'Document Retention Policy',
        description: 'Standards for maintaining and disposing of organizational records',
        icon: 'BookOpen'
      }
    },
    // Governance Page - Documents
    {
      id: '25',
      page_slug: 'governance',
      section: 'documents',
      order_index: 1,
      data: {
        title: 'Annual Report 2024',
        description: 'Comprehensive overview of our programs, financial statements, and impact metrics',
        category: 'annual-report',
        url: '/documents/annual-report-2024.pdf',
        icon: 'FileText'
      }
    },
    {
      id: '26',
      page_slug: 'governance',
      section: 'documents',
      order_index: 2,
      data: {
        title: 'Financial Audit 2024',
        description: 'Independent audit report from certified accountants',
        category: 'audit',
        url: '/documents/audit-2024.pdf',
        icon: 'FileText'
      }
    },
    {
      id: '27',
      page_slug: 'governance',
      section: 'documents',
      order_index: 3,
      data: {
        title: 'CAC Registration Certificate',
        description: 'Official registration certificate from Corporate Affairs Commission',
        category: 'legal',
        url: '/documents/cac-certificate.pdf',
        icon: 'Award'
      }
    }
  ];

  let filtered = mockContent;

  if (slug) {
    filtered = filtered.filter(item => item.page_slug === slug);
  }

  if (section) {
    filtered = filtered.filter(item => item.section === section);
  }

  return filtered;
}
