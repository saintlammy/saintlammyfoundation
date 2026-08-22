import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { getItems, createItem, updateItem, deleteItem } from '@/lib/fileStorage';
import { requireAdmin } from '@/lib/serverAuth';
import { localizeNgoImagesDeep } from '@/lib/ngoImages';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  if (method !== 'GET' && !(await requireAdmin(req, res))) return;

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
    // First check file storage for persisted data
    const fileStorageData = getItems(slug as string, section as string);

    // If file storage has data, return it (user edits are persisted here)
    if (fileStorageData && fileStorageData.length > 0) {
      return res.status(200).json(localizeNgoImagesDeep(fileStorageData));
    }

    // Try Supabase if no file storage data
    if (supabase) {
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

      if (!error && data && data.length > 0) {
        return res.status(200).json(localizeNgoImagesDeep(data));
      }
    }

    // Fallback to mock data (only for first load)
    return res.status(200).json(localizeNgoImagesDeep(getMockPageContent(slug as string, section as string)));
  } catch (error) {
    console.error('API error:', error);
    return res.status(200).json(localizeNgoImagesDeep(getMockPageContent(slug as string, section as string)));
  }
}

async function createPageContent(req: NextApiRequest, res: NextApiResponse) {
  try {
    const contentData = req.body;

    if (!contentData.page_slug || !contentData.section) {
      return res.status(400).json({ error: 'page_slug and section are required' });
    }

    // Save to file storage (this persists the data)
    const newContent = createItem(contentData);

    // Also try to save to Supabase if available
    if (supabase) {
      try {
        await (supabase
          .from('page_content') as any)
          .insert([newContent] as any);
      } catch (error) {
        console.error('Supabase insert error (non-fatal):', error);
        // Continue anyway - file storage is the source of truth
      }
    }

    res.status(201).json(newContent);
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

    // Update in file storage (this persists the data)
    const updatedContent = updateItem(id as string, updateData);

    if (!updatedContent) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Also try to update in Supabase if available
    if (supabase) {
      try {
        await (supabase
          .from('page_content') as any)
          .update(updateData)
          .eq('id', id);
      } catch (error) {
        console.error('Supabase update error (non-fatal):', error);
        // Continue anyway - file storage is the source of truth
      }
    }

    res.status(200).json(updatedContent);
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

    // Delete from file storage (this persists the deletion)
    const deleted = deleteItem(id as string);

    if (!deleted) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Also try to delete from Supabase if available
    if (supabase) {
      try {
        await (supabase
          .from('page_content') as any)
          .delete()
          .eq('id', id);
      } catch (error) {
        console.error('Supabase delete error (non-fatal):', error);
        // Continue anyway - file storage is the source of truth
      }
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
        name: 'Olamide Agboola',
        role: 'Founder & Executive Director',
        image: '/images/nigerian-ngo/portrait-volunteer.webp',
        bio: 'Founded Saintlammy Foundation in July 2025 and leads its donor-backed mission to serve widows, orphans, and vulnerable households.',
        linkedin: '#'
      }
    },
    {
      id: '2',
      page_slug: 'about',
      section: 'team',
      order_index: 2,
      data: {
        name: 'Peter Adinoyi Onuachi',
        role: 'Program Director',
        image: '/images/nigerian-ngo/portrait-widow.webp',
        bio: 'Coordinates program planning and delivery for outreaches serving widows, orphans, and vulnerable households.',
        linkedin: '#'
      }
    },
    {
      id: '3',
      page_slug: 'about',
      section: 'team',
      order_index: 3,
      data: {
        name: 'Victoria Agboola',
        role: 'Co-founder & Operations Manager',
        image: '/images/nigerian-ngo/portrait-volunteer.webp',
        bio: 'Co-founded Saintlammy Foundation and oversees operations, logistics, and the responsible delivery of its programs.',
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
        year: 'Jul 2025',
        event: 'Foundation launched from RCCG with support from local and international donors',
        icon: 'Heart'
      }
    },
    {
      id: '5',
      page_slug: 'about',
      section: 'milestones',
      order_index: 2,
      data: {
        year: 'Aug 2025',
        event: 'Food relief outreach supported more than 30 widows in Lagos',
        icon: 'Users'
      }
    },
    {
      id: '5a',
      page_slug: 'about',
      section: 'milestones',
      order_index: 3,
      data: {
        year: 'Sep 2025',
        event: 'Orphans Outreach provided foodstuffs to five orphanage homes and full school-fee support for Divine Destiny Orphanage Home',
        icon: 'Award'
      }
    },
    {
      id: '6',
      page_slug: 'about',
      section: 'milestones',
      order_index: 4,
      data: {
        year: 'Oct 2025',
        event: 'Open Medical Check-up Outreach provided accessible health screening and care',
        icon: 'Target'
      }
    },
    {
      id: '7',
      page_slug: 'about',
      section: 'milestones',
      order_index: 5,
      data: {
        year: 'Nov 2025',
        event: 'Incorporated as Saintlammy Community Care Initiative (RC 9015713)',
        icon: 'Globe'
      }
    },
    {
      id: '7a',
      page_slug: 'about',
      section: 'milestones',
      order_index: 6,
      data: {
        year: 'Dec 2025',
        event: 'Christmas Gift Packs Outreach brought seasonal care and gifts to orphans in orphanage homes',
        icon: 'Heart'
      }
    },
    {
      id: '8',
      page_slug: 'about',
      section: 'milestones',
      order_index: 7,
      data: {
        year: 'Mar 2026',
        event: 'Q1 Vulnerable Homes Outreach delivered direct support to vulnerable households',
        icon: 'Home'
      }
    },
    {
      id: '8a',
      page_slug: 'about',
      section: 'milestones',
      order_index: 8,
      data: {
        year: 'Q2 2026',
        event: 'Widows relief outreach expanded direct support for vulnerable families',
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
        background_image: '/images/nigerian-ngo/community-relief.webp'
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
        subtitle: 'From a shared conviction to a donor-backed mission rooted in community',
        paragraphs: [
          'Saintlammy Foundation began in July 2025, founded by Olamide Agboola from a deep conviction that every vulnerable person deserves dignity, support, and the opportunity to thrive. The Redeemed Christian Church of God (RCCG) served as our launchpad, giving the mission a trusted community base from which its first outreach and support efforts could be organized.',
          'From the outset, the work was made possible by local and international donors who believed in the mission and provided the resources to act. Their support helped turn a clear vision into coordinated outreach, direct relief, and a growing structure for accountable community care.',
          'As the work expanded, we strengthened our approach to transparency, accountability, and measurable impact. We also embraced modern giving options, including cryptocurrency, and digital reporting tools so donors can understand how contributions are used and the change they help create.',
          'In November 2025, we achieved a significant milestone: official incorporation as Saintlammy Community Care Initiative with the Corporate Affairs Commission of Nigeria (Registration No. 9015713, Tax ID: 33715150-0001). This formalization strengthens our capacity to serve and ensures long-term sustainability of our programs.',
          'Today, our story reflects what is possible when faith, a committed church community, and generous donors come together around a clear purpose. As we grow, we remain guided by the belief that no vulnerable home should stand alone and that hope truly has a home.'
        ]
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
        image: '/images/nigerian-ngo/portrait-volunteer.webp',
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
        image: '/images/nigerian-ngo/portrait-student.webp',
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
        image: '/images/nigerian-ngo/portrait-doctor.webp',
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
        image: '/images/nigerian-ngo/portrait-widow.webp',
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
        image: '/images/nigerian-ngo/portrait-volunteer.webp',
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
        image: '/images/nigerian-ngo/portrait-doctor.webp',
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
        title: 'Email',
        details: 'info@saintlammyfoundation.org',
        description: 'For general, donor and programme enquiries.',
        link: 'mailto:info@saintlammyfoundation.org'
      }
    },
    {
      id: '42',
      page_slug: 'contact',
      section: 'info',
      order_index: 2,
      data: {
        icon: 'Phone',
        title: 'Phone',
        details: '+234 706 307 6704',
        description: 'Call during the listed office hours.',
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
        title: 'Location',
        details: 'Lagos, Nigeria',
        description: 'Visits and meetings are arranged in advance.',
        link: 'https://maps.google.com/?q=Lagos,Nigeria'
      }
    },
    {
      id: '44',
      page_slug: 'contact',
      section: 'info',
      order_index: 4,
      data: {
        icon: 'Globe',
        title: 'Social',
        details: '@saintlammyfoundation',
        description: 'Follow current outreach and foundation updates.',
        link: 'https://www.instagram.com/saintlammyfoundation/'
      }
    },
    {
      id: '45',
      page_slug: 'contact',
      section: 'office-hours',
      order_index: 1,
      data: {
        weekday: '9:00 AM to 5:00 PM (WAT)',
        saturday: '10:00 AM to 2:00 PM (WAT)',
        sunday: 'Closed',
        note: 'Messages sent outside these hours will be reviewed when the team is next available.'
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
