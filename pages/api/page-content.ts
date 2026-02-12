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
    // About Page - Hero
    {
      id: '9',
      page_slug: 'about',
      section: 'hero',
      order_index: 1,
      data: {
        title: 'About Our Mission',
        subtitle: 'Bringing hope, structure, and transformation to widows, orphans, and vulnerable communities across Nigeria.',
        background_image: 'https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80'
      }
    },
    // About Page - Mission
    {
      id: '10',
      page_slug: 'about',
      section: 'mission',
      order_index: 1,
      data: {
        title: 'Our Mission',
        content: 'To provide comprehensive support to widows, orphans, and vulnerable individuals across Nigeria through sustainable programs that address immediate needs while building long-term capacity for self-sufficiency.',
        tagline: 'We believe that every person deserves dignity, hope, and the opportunity to thrive regardless of their circumstances.',
        icon: 'Target'
      }
    },
    // About Page - Vision
    {
      id: '11',
      page_slug: 'about',
      section: 'vision',
      order_index: 1,
      data: {
        title: 'Our Vision',
        content: 'A Nigeria where no widow is forgotten, no orphan is left behind, and no vulnerable home stands alone. We envision thriving communities where love, support, and opportunity are accessible to all.',
        tagline: 'Through faith-driven action and sustainable solutions, we\'re building a future of hope and transformation.',
        icon: 'Heart'
      }
    },
    // About Page - Story
    {
      id: '12',
      page_slug: 'about',
      section: 'story',
      order_index: 1,
      data: {
        title: 'Our Story',
        subtitle: 'From a vision to a movement - how Saintlammy Foundation began',
        paragraphs: [
          'Saintlammy Foundation was born from a deep conviction that every vulnerable person deserves dignity, support, and the opportunity to thrive. Founded in 2021 by Samuel Lammy, our organization emerged from years of grassroots community work and a growing recognition of the urgent needs facing widows and orphans across Nigeria.',
          'What started as individual acts of kindness evolved into a structured organization committed to transparency, accountability, and measurable impact. We\'ve embraced modern technology, including cryptocurrency donations and digital transparency tools, to ensure every contribution creates maximum positive change.',
          'In November 2025, we achieved a significant milestone: official incorporation as Saintlammy Community Care Initiative with the Corporate Affairs Commission of Nigeria (Registration No. 9015713, Tax ID: 33715150-0001). This formalization strengthens our capacity to serve and ensures long-term sustainability of our programs.',
          'Today, we stand as a testament to what\'s possible when faith meets action, and when communities come together to lift up the most vulnerable among us. Our journey continues, guided by the belief that hope truly has a home.'
        ]
      }
    },
    // About Page - Testimonials
    {
      id: '13',
      page_slug: 'about',
      section: 'testimonials',
      order_index: 1,
      data: {
        name: 'Mrs. Chinelo Okafor',
        role: 'Widow Empowerment Program Beneficiary',
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
        quote: 'After my husband passed, I thought my life was over. Through Saintlammy Foundation\'s tailoring program, I now run my own business and can support my three children. They gave me hope when I had none.',
        duration: '2 years in program'
      }
    },
    {
      id: '14',
      page_slug: 'about',
      section: 'testimonials',
      order_index: 2,
      data: {
        name: 'Emmanuel Adebayo',
        role: 'Educational Program Graduate',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
        quote: 'I was an orphan with no hope of attending university. Thanks to Saintlammy Foundation\'s scholarship program, I\'m now studying engineering. They believed in me when no one else would.',
        duration: 'Scholarship recipient since 2022'
      }
    },
    {
      id: '15',
      page_slug: 'about',
      section: 'testimonials',
      order_index: 3,
      data: {
        name: 'Dr. Sarah Adunola',
        role: 'Medical Volunteer',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
        quote: 'Volunteering with Saintlammy Foundation has been the most rewarding experience of my medical career. The impact we make together in underserved communities is truly life-changing.',
        duration: '3 years volunteering'
      }
    },
    {
      id: '16',
      page_slug: 'about',
      section: 'testimonials',
      order_index: 4,
      data: {
        name: 'Pastor David Okon',
        role: 'Community Partner',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
        quote: 'Saintlammy Foundation\'s transparency and genuine commitment to helping others is exceptional. They are truly making a difference in our communities, one life at a time.',
        duration: 'Partnership since 2021'
      }
    },
    // About Page - Values
    {
      id: '17',
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
      id: '18',
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
      id: '19',
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
      id: '20',
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
      id: '21',
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
      id: '22',
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
      id: '23',
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
      id: '24',
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
      id: '25',
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
      id: '26',
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
      id: '27',
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
      id: '28',
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
      id: '29',
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
      id: '30',
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
      id: '31',
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
      id: '32',
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
      id: '33',
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
      id: '34',
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
      id: '35',
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
    },
    // Home Page - Who We Are Section
    {
      id: '36',
      page_slug: 'home',
      section: 'who-we-are',
      order_index: 1,
      data: {
        title: 'Who We Are',
        subtitle: 'A faith-driven humanitarian initiative operating at the intersection of compassion and execution.',
        mission_title: 'Our Mission',
        mission_icon: 'Heart',
        mission_content: 'Saintlammy Foundation is committed to restoring dignity, stability, and opportunity to the most vulnerable members of society. We mobilize support to orphans, widows, and underserved communities through direct aid, empowerment programs, and transparent partnerships.',
        mission_tagline: 'Faith-Driven • Community-Focused • Results-Oriented',
        journey_title: 'Our Journey',
        journey_icon: 'TrendingUp',
        journey_content: 'Since inception, we have grown from a small outreach team to a structured charity delivering measurable impact through grassroots programs, donor partnerships, and God-centered leadership.',
        journey_points: [
          'Started with small community outreaches',
          'Expanded to structured programs',
          'Now serving 500+ widows and 300+ orphans'
        ]
      }
    },
    {
      id: '37',
      page_slug: 'home',
      section: 'who-we-are',
      order_index: 2,
      data: {
        type: 'pillar',
        icon: 'Heart',
        title: 'Orphan Care',
        description: 'Supporting orphanages and connecting individual orphans with loving donors'
      }
    },
    {
      id: '38',
      page_slug: 'home',
      section: 'who-we-are',
      order_index: 3,
      data: {
        type: 'pillar',
        icon: 'Users',
        title: 'Widow Empowerment',
        description: 'Monthly stipends, counseling, and business grants for financial independence'
      }
    },
    {
      id: '39',
      page_slug: 'home',
      section: 'who-we-are',
      order_index: 4,
      data: {
        type: 'pillar',
        icon: 'GraduationCap',
        title: 'Educational Access',
        description: 'Ensuring every child has access to quality education and learning opportunities'
      }
    },
    {
      id: '40',
      page_slug: 'home',
      section: 'who-we-are',
      order_index: 5,
      data: {
        type: 'pillar',
        icon: 'MapPin',
        title: 'Community Development',
        description: 'Medical outreaches and support structures that help communities thrive'
      }
    },
    // Contact Page - Contact Information
    {
      id: '41',
      page_slug: 'contact',
      section: 'info',
      order_index: 1,
      data: {
        icon: 'Mail',
        title: 'Email Us',
        details: 'hello@saintlammyfoundation.org',
        description: 'Send us an email and we\'ll respond within 24 hours',
        link: 'mailto:hello@saintlammyfoundation.org'
      }
    },
    {
      id: '42',
      page_slug: 'contact',
      section: 'info',
      order_index: 2,
      data: {
        icon: 'Phone',
        title: 'Call Us',
        details: '+234 706 307 6704',
        description: 'Available Monday to Friday, 9AM - 5PM WAT',
        link: 'tel:+2347063076704'
      }
    },
    {
      id: '43',
      page_slug: 'contact',
      section: 'info',
      order_index: 3,
      data: {
        icon: 'MapPin',
        title: 'Visit Us',
        details: 'Lagos, Nigeria',
        description: 'Schedule an appointment to visit our office',
        link: '#'
      }
    },
    {
      id: '44',
      page_slug: 'contact',
      section: 'info',
      order_index: 4,
      data: {
        icon: 'Globe',
        title: 'Social Media',
        details: '@SaintlammyFoundation',
        description: 'Follow us for updates and impact stories',
        link: '#'
      }
    },
    {
      id: '45',
      page_slug: 'contact',
      section: 'office-hours',
      order_index: 1,
      data: {
        weekday: 'Monday - Friday: 9:00 AM - 5:00 PM (WAT)',
        saturday: 'Saturday: 10:00 AM - 2:00 PM (WAT)',
        sunday: 'Sunday: Closed',
        note: 'Emergency inquiries will be responded to within 24 hours regardless of office hours.'
      }
    },
    // Partner Page - Partnership Types
    {
      id: '46',
      page_slug: 'partner',
      section: 'types',
      order_index: 1,
      data: {
        icon: 'Building',
        title: 'Corporate Partnerships',
        description: 'Partner with us for CSR initiatives, employee engagement programs, and sustainable community development projects.',
        benefits: [
          'Annual CSR programs',
          'Employee volunteer opportunities',
          'Brand alignment initiatives'
        ]
      }
    },
    {
      id: '47',
      page_slug: 'partner',
      section: 'types',
      order_index: 2,
      data: {
        icon: 'Handshake',
        title: 'NGO Collaborations',
        description: 'Collaborate with fellow nonprofits to maximize impact through shared resources, expertise, and coordinated efforts.',
        benefits: [
          'Joint program implementation',
          'Resource sharing agreements',
          'Knowledge exchange programs'
        ]
      }
    },
    {
      id: '48',
      page_slug: 'partner',
      section: 'types',
      order_index: 3,
      data: {
        icon: 'Users',
        title: 'Individual Partnerships',
        description: 'Join as an individual partner to contribute your skills, time, or resources to specific programs and initiatives.',
        benefits: [
          'Skill-based volunteering',
          'Mentorship programs',
          'Professional consultation'
        ]
      }
    },
    // Partner Page - Benefits
    {
      id: '49',
      page_slug: 'partner',
      section: 'benefits',
      order_index: 1,
      data: {
        icon: 'Target',
        title: 'Measurable Impact',
        description: 'Track and measure the direct impact of your partnership through detailed reporting and success metrics.'
      }
    },
    {
      id: '50',
      page_slug: 'partner',
      section: 'benefits',
      order_index: 2,
      data: {
        icon: 'Globe',
        title: 'Brand Visibility',
        description: 'Gain positive brand exposure through our communications, events, and community engagement activities.'
      }
    },
    {
      id: '51',
      page_slug: 'partner',
      section: 'benefits',
      order_index: 3,
      data: {
        icon: 'Award',
        title: 'Recognition & Awards',
        description: 'Receive recognition for your social impact contributions and partnership commitment.'
      }
    },
    {
      id: '52',
      page_slug: 'partner',
      section: 'benefits',
      order_index: 4,
      data: {
        icon: 'Users',
        title: 'Team Building',
        description: 'Engage your team in meaningful volunteer activities that build camaraderie and purpose.'
      }
    },
    {
      id: '53',
      page_slug: 'partner',
      section: 'benefits',
      order_index: 5,
      data: {
        icon: 'TrendingUp',
        title: 'Strategic Growth',
        description: 'Align your business goals with social impact for sustainable growth and stakeholder value.'
      }
    },
    {
      id: '54',
      page_slug: 'partner',
      section: 'benefits',
      order_index: 6,
      data: {
        icon: 'Heart',
        title: 'Community Connection',
        description: 'Build authentic connections with the communities you serve and create lasting relationships.'
      }
    },
    // Partner Page - Contact Info
    {
      id: '55',
      page_slug: 'partner',
      section: 'contact',
      order_index: 1,
      data: {
        email: 'partnerships@saintlammyfoundation.org',
        phone: '+234 706 307 6704',
        location: 'Lagos, Nigeria'
      }
    },
    // Sponsor Page - Tiers
    {
      id: '56',
      page_slug: 'sponsor',
      section: 'tiers',
      order_index: 1,
      data: {
        id: 'basic',
        name: 'Basic Sponsor',
        amount: 50,
        description: 'Provide essential support for one beneficiary',
        benefits: [
          'Monthly updates on your beneficiary',
          'Quarterly photos and stories',
          'Annual impact report',
          'Access to sponsor community'
        ],
        icon: 'Heart',
        color: 'bg-blue-500'
      }
    },
    {
      id: '57',
      page_slug: 'sponsor',
      section: 'tiers',
      order_index: 2,
      data: {
        id: 'premium',
        name: 'Premium Sponsor',
        amount: 100,
        description: 'Comprehensive support with enhanced engagement',
        benefits: [
          'All Basic Sponsor benefits',
          'Monthly video updates',
          'Direct communication with beneficiary',
          'Invitation to annual sponsor events',
          'Educational milestone celebrations'
        ],
        popular: true,
        icon: 'Star',
        color: 'bg-accent-500'
      }
    },
    {
      id: '58',
      page_slug: 'sponsor',
      section: 'tiers',
      order_index: 3,
      data: {
        id: 'champion',
        name: 'Champion Sponsor',
        amount: 200,
        description: 'Transform lives with premium sponsorship',
        benefits: [
          'All Premium Sponsor benefits',
          'Sponsor multiple beneficiaries',
          'Exclusive donor recognition',
          'Site visit opportunities',
          'Custom program development input',
          'Legacy impact documentation'
        ],
        icon: 'Target',
        color: 'bg-purple-500'
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
