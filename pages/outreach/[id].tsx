import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin, Calendar, Users, Heart, Target, Clock, ChevronLeft,
  Download, Share2, TrendingUp, Award, CheckCircle, DollarSign,
  Camera, FileText, BarChart3, MessageSquare
} from 'lucide-react';
import { useDonationModal } from '@/components/DonationModalProvider';
import SEOHead from '@/components/SEOHead';
import { getCanonicalUrl } from '@/lib/seo';

interface OutreachReport {
  id: string;
  title: string;
  date: string;
  location: string;
  status: 'completed' | 'upcoming' | 'ongoing';
  image: string;
  description: string;

  // Beneficiary Information
  targetBeneficiaries: number;
  actualBeneficiaries: number;
  beneficiaryCategories: {
    category: string;
    count: number;
  }[];

  // Impact Metrics
  impact: {
    title: string;
    value: string | number;
    description: string;
  }[];

  // Financial Summary
  budget: {
    planned: number;
    actual: number;
    breakdown: {
      category: string;
      amount: number;
      percentage: number;
    }[];
  };

  // Team & Volunteers
  volunteers: {
    registered: number;
    participated: number;
    hours: number;
  };

  // Activities Conducted
  activities: {
    title: string;
    description: string;
    completed: boolean;
  }[];

  // Gallery
  gallery: string[];

  // Testimonials
  testimonials: {
    name: string;
    role: string;
    message: string;
    image?: string;
  }[];

  // Future Plans
  futurePlans?: string[];

  // Partners
  partners?: {
    name: string;
    logo?: string;
    contribution: string;
  }[];

  // Report Document
  reportDocument?: string;

  // Social Media
  socialMedia?: {
    platform: string;
    reach: number;
    engagement: number;
  }[];
}

// Helper function to convert basic outreach data to report format
const convertBasicOutreachToReport = (outreach: any): OutreachReport => {
  const details = outreach.outreach_details || {};

  // Debug logging
  console.log('🔍 Converting outreach:', outreach.id);
  console.log('📊 outreach_details:', details);
  console.log('✅ activities:', details.activities);
  console.log('🎯 future_plans:', details.future_plans);
  console.log('📈 impact:', details.impact);

  return {
    id: outreach.id,
    title: outreach.title,
    date: outreach.date || details.event_date || 'Date TBD',
    location: outreach.location || details.location || 'Location TBD',
    status: outreach.status,
    image: outreach.image || outreach.featured_image || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    description: outreach.description || outreach.content || outreach.excerpt || 'No description available',
    targetBeneficiaries: outreach.targetBeneficiaries || details.expected_attendees || 0,
    actualBeneficiaries: outreach.beneficiaries || details.actual_attendees || outreach.targetBeneficiaries || 0,
    beneficiaryCategories: details.beneficiary_categories || [],
    impact: details.impact || [],
    budget: {
      planned: details.budget_planned || details.budget || 0,
      actual: details.budget_actual || details.budget || 0,
      breakdown: details.budget_breakdown || []
    },
    volunteers: {
      registered: outreach.volunteersNeeded || details.volunteers_needed || 0,
      participated: details.volunteers_participated || 0,
      hours: details.volunteer_hours || 0
    },
    activities: details.activities || [],
    gallery: details.gallery || (outreach.image || outreach.featured_image ? [outreach.image || outreach.featured_image] : []),
    testimonials: details.testimonials || [],
    futurePlans: details.future_plans || [],
    partners: details.partners || []
  };
};

interface OutreachReportPageProps {
  initialOutreach?: any;
}

const OutreachReportPage: React.FC<OutreachReportPageProps> = ({ initialOutreach }) => {
  const router = useRouter();
  const { id } = router.query;
  const { openDonationModal } = useDonationModal();

  const [outreach, setOutreach] = useState<OutreachReport | null>(
    initialOutreach ? convertBasicOutreachToReport(initialOutreach) : null
  );
  const [loading, setLoading] = useState(!initialOutreach);
  const [activeTab, setActiveTab] = useState<'overview' | 'impact' | 'financials' | 'gallery'>('overview');

  useEffect(() => {
    // Only fetch if we don't have initialOutreach
    if (id && !initialOutreach) {
      loadOutreachReport();
    }
  }, [id, initialOutreach]);

  const loadOutreachReport = async () => {
    try {
      setLoading(true);

      // Try to fetch detailed report first
      const reportResponse = await fetch(`/api/outreaches/${id}/report`);
      if (reportResponse.ok) {
        const data = await reportResponse.json();
        setOutreach(data);
        return;
      }

      // If detailed report not found, try to fetch basic outreach data
      const basicResponse = await fetch(`/api/outreaches?status=all`);
      if (basicResponse.ok) {
        const outreaches = await basicResponse.json();
        const basicOutreach = outreaches.find((o: any) => o.id === id);

        if (basicOutreach) {
          // Convert basic outreach data to report format
          setOutreach(convertBasicOutreachToReport(basicOutreach));
          return;
        }
      }

      // Fall back to mock data if nothing else works
      setOutreach(getMockOutreachReport(id as string));
    } catch (error) {
      console.error('Error loading outreach report:', error);
      setOutreach(getMockOutreachReport(id as string));
    } finally {
      setLoading(false);
    }
  };

  const getMockOutreachReport = (outreachId: string): OutreachReport => {
    const reports: Record<string, OutreachReport> = {
      '4': {
        id: '4',
        title: 'Independence Day Medical Outreach 2024',
        date: 'October 1, 2024',
        location: 'Ikeja, Lagos State',
        status: 'completed',
        image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        description: 'Our flagship medical outreach program providing free healthcare services, medical check-ups, medications, and health education to underserved communities in Ikeja, Lagos.',
        targetBeneficiaries: 400,
        actualBeneficiaries: 487,
      beneficiaryCategories: [
        { category: 'Children (0-12)', count: 145 },
        { category: 'Teenagers (13-17)', count: 68 },
        { category: 'Adults (18-60)', count: 189 },
        { category: 'Elderly (60+)', count: 85 }
      ],

      impact: [
        { title: 'Medical Consultations', value: 487, description: 'Free consultations provided' },
        { title: 'Medications Distributed', value: 234, description: 'Essential medications given' },
        { title: 'Health Screenings', value: 312, description: 'Blood pressure, diabetes, malaria tests' },
        { title: 'Specialist Referrals', value: 56, description: 'Referred to partner hospitals' },
        { title: 'Eyeglasses Provided', value: 42, description: 'Free prescription glasses' },
        { title: 'Dental Check-ups', value: 89, description: 'Free dental examinations' }
      ],

      budget: {
        planned: 2500000,
        actual: 2340000,
        breakdown: [
          { category: 'Medical Supplies', amount: 980000, percentage: 42 },
          { category: 'Medications', amount: 750000, percentage: 32 },
          { category: 'Personnel/Volunteers', amount: 350000, percentage: 15 },
          { category: 'Logistics & Transport', amount: 160000, percentage: 7 },
          { category: 'Marketing & Outreach', amount: 100000, percentage: 4 }
        ]
      },

      volunteers: {
        registered: 45,
        participated: 38,
        hours: 304
      },

      activities: [
        { title: 'Registration & Triage', description: 'Patient registration and initial screening', completed: true },
        { title: 'General Medical Consultation', description: 'Consultations with general practitioners', completed: true },
        { title: 'Blood Pressure & Diabetes Screening', description: 'Free health screenings for all attendees', completed: true },
        { title: 'Malaria Testing', description: 'Rapid diagnostic tests for malaria', completed: true },
        { title: 'Medication Distribution', description: 'Free essential medications dispensing', completed: true },
        { title: 'Dental Check-ups', description: 'Basic dental examinations', completed: true },
        { title: 'Eye Care Services', description: 'Vision tests and eyeglasses distribution', completed: true },
        { title: 'Health Education Sessions', description: 'Community health awareness talks', completed: true },
        { title: 'Nutritional Counseling', description: 'Dietary advice and nutrition support', completed: true },
        { title: 'Follow-up Referrals', description: 'Specialist hospital referrals for critical cases', completed: true }
      ],

      gallery: [
        'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
        'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800',
        'https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=800',
        'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800'
      ],

      testimonials: [
        {
          name: 'Mrs. Folake Adeyemi',
          role: 'Beneficiary',
          message: 'I received free medication for my diabetes and blood pressure. The doctors were very professional and caring. God bless Saintlammy Foundation!',
          image: 'https://images.unsplash.com/photo-1494790108755-2616c34ca2f7?w=400'
        },
        {
          name: 'Mr. Chukwudi Okonkwo',
          role: 'Volunteer Doctor',
          message: 'It was a privilege to serve alongside such dedicated volunteers. The organization and impact were truly remarkable.',
          image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400'
        },
        {
          name: 'Miss Aisha Mohammed',
          role: 'Community Leader',
          message: 'This outreach brought hope to our community. Many people who cannot afford healthcare received much-needed medical attention.',
          image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400'
        }
      ],

      futurePlans: [
        'Expand medical outreach to 3 more communities in Q1 2025',
        'Partner with additional hospitals for specialist referrals',
        'Establish mobile clinic for hard-to-reach rural areas',
        'Launch follow-up program to track patient outcomes',
        'Create health education video series in local languages'
      ],

      partners: [
        {
          name: 'Lagos State Ministry of Health',
          contribution: 'Medical personnel and supplies support'
        },
        {
          name: 'Reddington Hospital',
          contribution: 'Specialist referral partnership'
        },
        {
          name: 'PharmAccess Foundation',
          contribution: 'Medication donations'
        }
      ],

        reportDocument: '/reports/independence-day-medical-outreach-2024.pdf',
        socialMedia: [
          { platform: 'Facebook', reach: 12500, engagement: 1850 },
          { platform: 'Instagram', reach: 8300, engagement: 2100 },
          { platform: 'Twitter', reach: 5600, engagement: 980 }
        ]
      },
      '5': {
        id: '5',
        title: 'Back-to-School Support 2024',
        date: 'September 12, 2024',
        location: 'Multiple Locations, Nigeria',
        status: 'completed',
        image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        description: 'Annual back-to-school program providing school supplies, uniforms, and educational materials to children from vulnerable families across Nigeria.',
        targetBeneficiaries: 300,
        actualBeneficiaries: 320,
        beneficiaryCategories: [
          { category: 'Primary School (6-11)', count: 180 },
          { category: 'Secondary School (12-17)', count: 140 }
        ],
        impact: [
          { title: 'School Bags Distributed', value: 320, description: 'Quality backpacks with supplies' },
          { title: 'Uniforms Provided', value: 150, description: 'Complete school uniforms' },
          { title: 'Exercise Books', value: 1280, description: '4 books per child' },
          { title: 'Writing Materials', value: 960, description: 'Pens, pencils, erasers' },
          { title: 'Schools Supported', value: 8, description: 'Across 8 different schools' },
          { title: 'Scholarship Awards', value: 12, description: 'Full year scholarships' }
        ],
        budget: {
          planned: 1800000,
          actual: 1750000,
          breakdown: [
            { category: 'School Supplies', amount: 840000, percentage: 48 },
            { category: 'Uniforms', amount: 525000, percentage: 30 },
            { category: 'Scholarships', amount: 245000, percentage: 14 },
            { category: 'Logistics & Distribution', amount: 105000, percentage: 6 },
            { category: 'Admin & Marketing', amount: 35000, percentage: 2 }
          ]
        },
        volunteers: {
          registered: 28,
          participated: 25,
          hours: 150
        },
        activities: [
          { title: 'Beneficiary Registration', description: 'Student and family registration process', completed: true },
          { title: 'Needs Assessment', description: 'Individual student needs evaluation', completed: true },
          { title: 'School Bag Packing', description: 'Packing supplies into backpacks', completed: true },
          { title: 'Uniform Sizing & Distribution', description: 'Fitting and distribution of uniforms', completed: true },
          { title: 'Book Distribution', description: 'Exercise books and textbooks', completed: true },
          { title: 'Scholarship Selection', description: 'Merit-based scholarship awards', completed: true },
          { title: 'Parent Orientation', description: 'Educational support session for parents', completed: true },
          { title: 'School Partnership Meetings', description: 'Coordination with school administrators', completed: true }
        ],
        gallery: [
          'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800',
          'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
          'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
          'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
          'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800',
          'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800'
        ],
        testimonials: [
          {
            name: 'Mrs. Blessing Eze',
            role: 'Parent',
            message: 'My three children received everything they needed for school. I was struggling to buy these items. Thank you Saintlammy Foundation!',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
          },
          {
            name: 'Mr. Tunde Bakare',
            role: 'School Principal',
            message: 'This program has helped reduce absenteeism significantly. Children now come to school properly equipped and motivated to learn.',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
          },
          {
            name: 'Chioma Nwankwo',
            role: 'Scholarship Recipient',
            message: 'Receiving this scholarship means I can continue my education. I promise to work hard and make everyone proud!',
            image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400'
          }
        ],
        futurePlans: [
          'Expand to reach 500 children in 2025',
          'Add computer training program for secondary school students',
          'Establish mentorship program pairing students with professionals',
          'Create annual scholarship fund for university education',
          'Partner with more schools across Nigeria'
        ],
        partners: [
          {
            name: 'Nigerian Educational Trust',
            contribution: 'Scholarship funding support'
          },
          {
            name: 'Stationery Suppliers Association',
            contribution: 'Discounted school supplies'
          },
          {
            name: 'Local School Boards',
            contribution: 'Beneficiary identification and coordination'
          }
        ],
        reportDocument: '/reports/back-to-school-support-2024.pdf',
        socialMedia: [
          { platform: 'Facebook', reach: 8200, engagement: 1340 },
          { platform: 'Instagram', reach: 6700, engagement: 1520 },
          { platform: 'Twitter', reach: 3400, engagement: 580 }
        ]
      },
      '6': {
        id: '6',
        title: 'Clean Water Initiative 2024',
        date: 'August 20, 2024',
        location: 'Rural Kogi State, Nigeria',
        status: 'completed',
        image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        description: 'Community water access project installing water pumps and distributing purification tablets to provide clean drinking water to rural communities in Kogi State.',
        targetBeneficiaries: 550,
        actualBeneficiaries: 600,
        beneficiaryCategories: [
          { category: 'Households', count: 120 },
          { category: 'School Children', count: 200 },
          { category: 'Community Members', count: 280 }
        ],
        impact: [
          { title: 'Water Pumps Installed', value: 3, description: 'Solar-powered borehole pumps' },
          { title: 'People with Clean Water Access', value: 600, description: 'Sustained water access' },
          { title: 'Purification Tablets', value: 1200, description: 'Monthly supply distributed' },
          { title: 'Water Storage Tanks', value: 6, description: '1000L community tanks' },
          { title: 'Hygiene Training Sessions', value: 8, description: 'Water safety education' },
          { title: 'Households Connected', value: 120, description: 'Families with access' }
        ],
        budget: {
          planned: 3500000,
          actual: 3420000,
          breakdown: [
            { category: 'Borehole Drilling & Pumps', amount: 2052000, percentage: 60 },
            { category: 'Water Tanks & Storage', amount: 684000, percentage: 20 },
            { category: 'Purification Tablets', amount: 342000, percentage: 10 },
            { category: 'Training & Education', amount: 205200, percentage: 6 },
            { category: 'Maintenance Fund', amount: 136800, percentage: 4 }
          ]
        },
        volunteers: {
          registered: 18,
          participated: 15,
          hours: 240
        },
        activities: [
          { title: 'Site Survey & Assessment', description: 'Geological survey for borehole locations', completed: true },
          { title: 'Community Consultation', description: 'Meetings with community leaders', completed: true },
          { title: 'Borehole Drilling', description: 'Professional drilling operations', completed: true },
          { title: 'Pump Installation', description: 'Solar-powered pump setup', completed: true },
          { title: 'Storage Tank Placement', description: 'Installation of water storage tanks', completed: true },
          { title: 'Water Quality Testing', description: 'Laboratory testing for safety', completed: true },
          { title: 'Hygiene Training', description: 'Water safety and hygiene education', completed: true },
          { title: 'Maintenance Committee Formation', description: 'Local sustainability team', completed: true },
          { title: 'Tablet Distribution', description: 'Purification tablets to households', completed: true }
        ],
        gallery: [
          'https://images.unsplash.com/photo-1541840031508-326b77c9a17e?w=800',
          'https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?w=800',
          'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800',
          'https://images.unsplash.com/photo-1600711940033-c2e8d6cc2341?w=800',
          'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800',
          'https://images.unsplash.com/photo-1541840031508-326b77c9a17e?w=800'
        ],
        testimonials: [
          {
            name: 'Chief Idris Yakubu',
            role: 'Village Head',
            message: 'For many years our people walked 5 kilometers for water. Now we have clean water in our community. This has changed our lives!',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
          },
          {
            name: 'Fatima Abdullahi',
            role: 'Community Member',
            message: 'My children used to get sick from bad water. Since the new pumps, our health has improved. God bless this foundation.',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'
          },
          {
            name: 'Engr. David Ojo',
            role: 'Project Engineer',
            message: 'Working on this project was fulfilling. The solar pumps are sustainable and the community is trained to maintain them.',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400'
          }
        ],
        futurePlans: [
          'Install 5 more water pumps in neighboring communities',
          'Establish water testing laboratory in Kogi State',
          'Train local technicians for pump maintenance',
          'Launch rainwater harvesting program',
          'Create WASH (Water, Sanitation, Hygiene) education curriculum for schools'
        ],
        partners: [
          {
            name: 'WaterAid Nigeria',
            contribution: 'Technical expertise and training'
          },
          {
            name: 'Kogi State Water Board',
            contribution: 'Permits and logistical support'
          },
          {
            name: 'Solar Energy Foundation',
            contribution: 'Solar panel donations'
          },
          {
            name: 'Local Community Leaders',
            contribution: 'Land allocation and community mobilization'
          }
        ],
        reportDocument: '/reports/clean-water-initiative-2024.pdf',
        socialMedia: [
          { platform: 'Facebook', reach: 15600, engagement: 2340 },
          { platform: 'Instagram', reach: 9200, engagement: 1890 },
          { platform: 'Twitter', reach: 6100, engagement: 1120 }
        ]
      }
    };

    return reports[outreachId] || reports['4'];
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: outreach?.title,
        text: `Check out this outreach report from Saintlammy Foundation`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const calculateImpactPercentage = () => {
    if (!outreach) return 0;
    return Math.round((outreach.actualBeneficiaries / outreach.targetBeneficiaries) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading outreach report...</p>
        </div>
      </div>
    );
  }

  if (!outreach) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Report Not Found</h1>
          <Link href="/outreaches" className="text-accent-400 hover:text-accent-300">
            ← Back to Outreaches
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        config={{
          title: `${outreach.title} - Outreach Report`,
          description: outreach.description || `Learn about ${outreach.title} - an outreach program by Saintlammy Foundation impacting lives in ${outreach.location}.`,
          image: outreach.image,
          url: getCanonicalUrl(`/outreach/${id}`),
          type: 'article',
          publishedTime: outreach.date,
          keywords: `${outreach.title}, outreach program, community impact, ${outreach.location}, Nigeria charity, Saintlammy Foundation`
        }}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <div className="relative h-[60vh] min-h-[400px]">
          {outreach.image.startsWith('data:') ? (
            <img
              src={outreach.image}
              alt={outreach.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={outreach.image}
              alt={outreach.title}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="max-w-7xl mx-auto px-6 pb-12 w-full">
              <Link
                href="/outreaches"
                className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back to Outreaches
              </Link>

              <div className="flex items-center gap-3 mb-4">
                <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                  outreach.status === 'completed'
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {outreach.status === 'completed' ? 'Completed' : 'Upcoming'}
                </span>

                {outreach.status === 'completed' && calculateImpactPercentage() > 100 && (
                  <span className="px-4 py-1 rounded-full text-sm font-medium bg-accent-500/20 text-accent-300">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    Exceeded Target
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">
                {outreach.title}
              </h1>

              <div className="flex flex-wrap gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{outreach.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{outreach.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{outreach.actualBeneficiaries} People Reached</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {outreach.reportDocument && (
                  <a
                    href={outreach.reportDocument}
                    download
                    className="inline-flex items-center justify-center px-6 py-2 bg-accent-400 hover:bg-accent-500 text-white rounded-lg font-medium transition-colors"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Full Report
                  </a>
                )}

                <button
                  onClick={handleShare}
                  className="inline-flex items-center justify-center px-6 py-2 border border-gray-300 dark:border-gray-600 hover:border-accent-400 dark:hover:border-accent-400 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Report
                </button>
              </div>

              <button
                onClick={() => openDonationModal({ source: 'outreach-report', category: 'outreach', suggestedAmount: 25000 })}
                className="inline-flex items-center justify-center px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors w-full sm:w-auto"
              >
                <Heart className="w-5 h-5 mr-2" />
                Support Future Outreaches
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-8">
              {(['overview', 'impact', 'financials', 'gallery'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium transition-colors capitalize ${
                    activeTab === tab
                      ? 'border-accent-400 text-accent-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {activeTab === 'overview' && (
            <div className="space-y-12">
              {/* Description */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Outreach</h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  {outreach.description}
                </p>
              </section>

              {/* Quick Stats */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Key Statistics</h2>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <Users className="w-8 h-8 text-accent-400 mb-3" />
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {outreach.actualBeneficiaries}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      People Reached
                      <span className="block text-xs text-green-500 mt-1">
                        {calculateImpactPercentage()}% of target
                      </span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <Heart className="w-8 h-8 text-red-400 mb-3" />
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {outreach.volunteers.participated}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Active Volunteers
                      <span className="block text-xs mt-1">
                        {outreach.volunteers.hours} total hours
                      </span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <CheckCircle className="w-8 h-8 text-green-400 mb-3" />
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {outreach.activities.filter(a => a.completed).length}/{outreach.activities.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Activities Completed
                      <span className="block text-xs text-green-500 mt-1">
                        100% completion rate
                      </span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <DollarSign className="w-8 h-8 text-blue-400 mb-3" />
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      ₦{(outreach.budget.actual / 1000000).toFixed(2)}M
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total Investment
                      <span className="block text-xs text-green-500 mt-1">
                        {Math.round((outreach.budget.actual / outreach.budget.planned) * 100)}% of budget
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Beneficiary Breakdown */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Beneficiary Demographics</h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    {outreach.beneficiaryCategories.map((category, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{category.category}</span>
                          <span className="text-gray-900 dark:text-white font-bold">{category.count}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-accent-400 h-2 rounded-full transition-all"
                            style={{ width: `${(category.count / outreach.actualBeneficiaries) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Activities */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Activities Conducted</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {outreach.activities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        activity.completed ? 'text-green-500' : 'text-gray-400'
                      }`} />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1">{activity.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Testimonials */}
              {outreach.testimonials && outreach.testimonials.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What People Are Saying</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {outreach.testimonials.map((testimonial, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <MessageSquare className="w-8 h-8 text-accent-400 mb-4" />
                        <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                          "{testimonial.message}"
                        </p>
                        <div className="flex items-center gap-3">
                          {testimonial.image && (
                            <Image
                              src={testimonial.image}
                              alt={testimonial.name}
                              width={48}
                              height={48}
                              className="rounded-full"
                            />
                          )}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{testimonial.name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Partners */}
              {outreach.partners && outreach.partners.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Our Partners</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {outreach.partners.map((partner, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">{partner.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{partner.contribution}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Future Plans */}
              {outreach.futurePlans && outreach.futurePlans.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Future Plans</h2>
                  <div className="bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/20 dark:to-accent-800/20 p-8 rounded-xl">
                    <ul className="space-y-3">
                      {outreach.futurePlans.map((plan, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Target className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-200">{plan}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}
            </div>
          )}

          {activeTab === 'impact' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Impact Metrics</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {outreach.impact.map((metric, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <BarChart3 className="w-8 h-8 text-accent-400 mb-3" />
                    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {metric.value.toLocaleString()}
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">{metric.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{metric.description}</p>
                  </div>
                ))}
              </div>

              {outreach.socialMedia && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Social Media Reach</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {outreach.socialMedia.map((platform, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-4">{platform.platform}</h4>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Reach</span>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{platform.reach.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Engagement</span>
                            <div className="text-2xl font-bold text-accent-400">{platform.engagement.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'financials' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Financial Summary</h2>
                <p className="text-gray-600 dark:text-gray-400">Complete breakdown of outreach funding and expenditure</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Budget Overview</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Planned Budget</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        ₦{outreach.budget.planned.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Actual Expenditure</div>
                      <div className="text-2xl font-bold text-accent-400">
                        ₦{outreach.budget.actual.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Budget Efficiency</div>
                      <div className="text-2xl font-bold text-green-500">
                        {Math.round((outreach.budget.actual / outreach.budget.planned) * 100)}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ₦{(outreach.budget.planned - outreach.budget.actual).toLocaleString()} under budget
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Cost per Beneficiary</h3>
                  <div className="text-center py-8">
                    <div className="text-5xl font-bold text-accent-400 mb-2">
                      ₦{Math.round(outreach.budget.actual / outreach.actualBeneficiaries).toLocaleString()}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">per person reached</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Expenditure Breakdown</h3>
                <div className="space-y-4">
                  {outreach.budget.breakdown.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{item.category}</span>
                        <span className="text-gray-900 dark:text-white font-bold">
                          ₦{item.amount.toLocaleString()} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-accent-400 to-accent-500 h-3 rounded-full transition-all"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Photo Gallery</h2>
                <p className="text-gray-600 dark:text-gray-400">Moments captured from the outreach</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {outreach.gallery.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
                    {image.startsWith('data:') ? (
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <Image
                        src={image}
                        alt={`${outreach.title} - Photo ${index + 1}`}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-accent-500 to-accent-600 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Award className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Help Us Reach More Communities
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Your support makes outreaches like this possible. Together, we can transform more lives.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => openDonationModal({ source: 'outreach-report', category: 'outreach', suggestedAmount: 25000 })}
                className="px-8 py-4 bg-white text-accent-600 rounded-lg font-bold hover:bg-gray-100 transition-colors text-lg"
              >
                Make a Donation
              </button>
              <Link
                href="/volunteer"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition-colors text-lg"
              >
                Become a Volunteer
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

// Server-side rendering to ensure meta tags are available for social media crawlers
export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const id = params?.id as string;

  try {
    // Fetch outreach data server-side for meta tags
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    // Try to fetch full report first (has all the detail sections)
    console.log(`🔍 SSR: Fetching full report for ${id}`);
    const reportResponse = await fetch(`${baseUrl}/api/outreaches/${id}/report`);

    if (reportResponse.ok) {
      const reportData = await reportResponse.json();
      console.log(`✅ SSR: Loaded full report for ${id}`);
      return {
        props: {
          initialOutreach: reportData
        }
      };
    }

    // Fallback to basic outreach data if no full report exists
    console.log(`⚠️ SSR: No full report found, trying basic outreach data for ${id}`);
    const response = await fetch(`${baseUrl}/api/outreaches?status=all`);

    if (response.ok) {
      const outreaches = await response.json();
      const outreach = outreaches.find((o: any) => o.id === id);

      if (outreach) {
        console.log(`✅ SSR: Loaded basic outreach for ${id}`);
        // Return outreach data for server-side meta tag rendering
        return {
          props: {
            initialOutreach: outreach
          }
        };
      }
    }
  } catch (error) {
    console.error('SSR fetch error:', error);
  }

  // Fallback: return empty props, client will fetch data
  return {
    props: {
      initialOutreach: null
    }
  };
};

export default OutreachReportPage;
