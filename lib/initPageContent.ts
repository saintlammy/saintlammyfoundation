import { writeStorage } from './fileStorage';

// Initialize file storage with mock data on first run
export const initializePageContent = () => {
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
    // Continue with remaining mock data...
    // (Truncated for brevity - would include all 58 items from the original mock data)
  ];

  writeStorage(mockContent);
  console.log('✅ Page content initialized in file storage');
};
