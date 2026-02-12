import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useDonationModal } from '@/components/DonationModalProvider';
import {
  Users,
  Heart,
  Target,
  Handshake,
  Building,
  Globe,
  Award,
  TrendingUp,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Star
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { pageSEO } from '@/lib/seo';
import { GetStaticProps } from 'next';

interface PartnershipType {
  icon: string;
  title: string;
  description: string;
  benefits: string[];
}

interface PartnershipBenefit {
  icon: string;
  title: string;
  description: string;
}

interface PartnerContactInfo {
  email: string;
  phone: string;
  location: string;
}

interface PartnerProps {
  partnershipTypes: PartnershipType[];
  benefits: PartnershipBenefit[];
  contactInfo: PartnerContactInfo | null;
}

// Helper function to map icon names to components
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    Users,
    Heart,
    Target,
    Handshake,
    Building,
    Globe,
    Award,
    TrendingUp,
    CheckCircle,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    Star
  };
  return iconMap[iconName] || Heart;
};

const Partner: React.FC<PartnerProps> = ({ partnershipTypes: apiPartnershipTypes, benefits: apiBenefits, contactInfo: apiContactInfo }) => {
  const { openDonationModal } = useDonationModal();

  // Use API data or fallback to defaults
  const partnershipTypes = apiPartnershipTypes.length > 0 ? apiPartnershipTypes : [
    {
      icon: 'Building',
      title: 'Corporate Partnerships',
      description: 'Partner with us for CSR initiatives, employee engagement programs, and sustainable community development projects.',
      benefits: [
        'Annual CSR programs',
        'Employee volunteer opportunities',
        'Brand alignment initiatives'
      ]
    },
    {
      icon: 'Handshake',
      title: 'NGO Collaborations',
      description: 'Collaborate with fellow nonprofits to maximize impact through shared resources, expertise, and coordinated efforts.',
      benefits: [
        'Joint program implementation',
        'Resource sharing agreements',
        'Knowledge exchange programs'
      ]
    },
    {
      icon: 'Users',
      title: 'Individual Partnerships',
      description: 'Join as an individual partner to contribute your skills, time, or resources to specific programs and initiatives.',
      benefits: [
        'Skill-based volunteering',
        'Mentorship programs',
        'Professional consultation'
      ]
    }
  ];

  const benefits = apiBenefits.length > 0 ? apiBenefits : [
    {
      icon: 'Target',
      title: 'Measurable Impact',
      description: 'Track and measure the direct impact of your partnership through detailed reporting and success metrics.'
    },
    {
      icon: 'Globe',
      title: 'Brand Visibility',
      description: 'Gain positive brand exposure through our communications, events, and community engagement activities.'
    },
    {
      icon: 'Award',
      title: 'Recognition & Awards',
      description: 'Receive recognition for your social impact contributions and partnership commitment.'
    },
    {
      icon: 'Users',
      title: 'Team Building',
      description: 'Engage your team in meaningful volunteer activities that build camaraderie and purpose.'
    },
    {
      icon: 'TrendingUp',
      title: 'Strategic Growth',
      description: 'Align your business goals with social impact for sustainable growth and stakeholder value.'
    },
    {
      icon: 'Heart',
      title: 'Community Connection',
      description: 'Build authentic connections with the communities you serve and create lasting relationships.'
    }
  ];

  const contactInfo = apiContactInfo || {
    email: 'partnerships@saintlammyfoundation.org',
    phone: '+234 706 307 6704',
    location: 'Lagos, Nigeria'
  };

  return (
    <>
      <SEOHead config={pageSEO.partner} />

      <Navigation onDonateClick={() => openDonationModal({
        source: 'general',
        title: 'Support Our Partnership Programs',
        description: 'Help us build more strategic partnerships for greater impact'
      })} />

      <ErrorBoundary>
        <main className="min-h-screen bg-gray-900 pt-16">
          {/* Hero Section */}
          <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <h1 className="text-4xl md:text-6xl font-medium text-white mb-8 font-display tracking-tight">
                Partner With Us
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
                Join forces with Saintlammy Foundation to amplify your social impact and create lasting change for orphans, widows, and vulnerable communities across Nigeria.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => openDonationModal({
                    source: 'general',
                    title: 'Support Partnership Development',
                    description: 'Help us build capacity for more strategic partnerships'
                  })}
                  className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-medium text-base transition-colors"
                >
                  Support Our Work
                </button>
                <a
                  href="#contact"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-medium text-base transition-colors"
                >
                  Get In Touch
                </a>
              </div>
            </div>
          </section>

          {/* Partnership Types */}
          <section className="py-20 bg-gray-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-4 py-2 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium mb-4">
                  Partnership Types
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-display">
                  Partnership Opportunities
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto font-light">
                  We offer various partnership models to match your organization's capacity, interests, and impact goals.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {partnershipTypes.map((type, index) => {
                  const IconComponent = getIconComponent(type.icon);
                  const colors = ['blue', 'green', 'purple'];
                  const color = colors[index % colors.length];

                  return (
                    <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300">
                      <div className={`flex items-center justify-center w-16 h-16 bg-${color}-500/20 rounded-xl mb-6`}>
                        <IconComponent className={`w-8 h-8 text-${color}-400`} />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-4 font-display">
                        {type.title}
                      </h3>
                      <p className="text-gray-300 mb-6 font-light leading-relaxed">
                        {type.description}
                      </p>
                      <ul className="space-y-2 text-sm text-gray-400">
                        {type.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Partnership Benefits */}
          <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-500/5 to-transparent"></div>
            <div className="relative max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-accent-500/20 to-blue-500/20 text-accent-400 rounded-full text-sm font-medium mb-4">
                  Partnership Benefits
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-display">
                  Why Partner With Us?
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto font-light">
                  Partnering with Saintlammy Foundation offers mutual benefits and creates meaningful impact for your organization and the communities we serve.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[0, 1].map((colIndex) => (
                  <div key={colIndex} className="space-y-6">
                    {benefits
                      .filter((_, index) => index % 2 === colIndex)
                      .map((benefit, index) => {
                        const IconComponent = getIconComponent(benefit.icon);
                        return (
                          <div key={index} className="flex items-start space-x-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-accent-500/20 rounded-lg">
                              <IconComponent className="w-6 h-6 text-accent-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                              <p className="text-gray-300 font-light">{benefit.description}</p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>
          </section>


          {/* Partnership Process */}
          <section className="py-20 bg-gray-800">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-4">
                  Getting Started
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-display">
                  How to Partner
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto font-light">
                  Starting a partnership with us is simple. Follow these steps to begin making an impact together.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-accent-500/20 rounded-full mx-auto mb-6">
                    <span className="text-2xl font-bold text-accent-400">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 font-display">Initial Contact</h3>
                  <p className="text-gray-300 font-light">
                    Reach out to us with your partnership interests and we'll schedule an initial consultation to discuss opportunities.
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-accent-500/20 rounded-full mx-auto mb-6">
                    <span className="text-2xl font-bold text-accent-400">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 font-display">Partnership Design</h3>
                  <p className="text-gray-300 font-light">
                    We'll work together to design a partnership that aligns with your goals and maximizes impact for our beneficiaries.
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-accent-500/20 rounded-full mx-auto mb-6">
                    <span className="text-2xl font-bold text-accent-400">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 font-display">Launch & Impact</h3>
                  <p className="text-gray-300 font-light">
                    Launch your partnership with ongoing support, regular updates, and impact measurement throughout our collaboration.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-accent-500/5 to-transparent"></div>
            <div className="relative max-w-4xl mx-auto px-6">
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium mb-4">
                  Get In Touch
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-display">
                  Ready to Partner?
                </h2>
                <p className="text-lg text-gray-300 font-light">
                  Let's discuss how we can work together to create meaningful impact.
                </p>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-6 font-display">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-accent-500/20 rounded-lg">
                          <Mail className="w-5 h-5 text-accent-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="text-white">{contactInfo.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-accent-500/20 rounded-lg">
                          <Phone className="w-5 h-5 text-accent-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Phone</p>
                          <p className="text-white">{contactInfo.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-accent-500/20 rounded-lg">
                          <MapPin className="w-5 h-5 text-accent-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Location</p>
                          <p className="text-white">{contactInfo.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-6 font-display">Partnership Coordinator</h3>
                    <div className="bg-gray-700/30 rounded-xl p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-accent-500/20 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-accent-400" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-white">Partnership Team</h4>
                          <p className="text-sm text-gray-400">Strategic Partnerships</p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm font-light mb-4">
                        Our dedicated partnership team will work with you to create meaningful collaborations that drive impact.
                      </p>
                      <Link
                        href="/partnership-team"
                        className="inline-flex items-center text-accent-400 hover:text-accent-300 font-medium text-sm transition-colors"
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </ErrorBoundary>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const [typesRes, benefitsRes, contactRes] = await Promise.all([
      fetch(`${baseUrl}/api/page-content?slug=partner&section=types`),
      fetch(`${baseUrl}/api/page-content?slug=partner&section=benefits`),
      fetch(`${baseUrl}/api/page-content?slug=partner&section=contact`)
    ]);

    const typesData = typesRes.ok ? await typesRes.json() : [];
    const benefitsData = benefitsRes.ok ? await benefitsRes.json() : [];
    const contactData = contactRes.ok ? await contactRes.json() : [];

    return {
      props: {
        partnershipTypes: typesData.map((item: any) => item.data),
        benefits: benefitsData.map((item: any) => item.data),
        contactInfo: contactData.length > 0 ? contactData[0].data : null
      },
      revalidate: 3600
    };
  } catch (error) {
    console.error('Error fetching partner data:', error);
    return {
      props: {
        partnershipTypes: [],
        benefits: [],
        contactInfo: null
      },
      revalidate: 3600
    };
  }
};

export default Partner;