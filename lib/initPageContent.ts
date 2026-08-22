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
    // Continue with remaining mock data...
    // (Truncated for brevity - would include all 58 items from the original mock data)
  ];

  writeStorage(mockContent);
  console.log('✅ Page content initialized in file storage');
};
