import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import Breadcrumb from '@/components/Breadcrumb';
import ErrorBoundary from '@/components/ErrorBoundary';
import { DonationModalProvider, useDonationModal } from '@/components/DonationModalProvider';
import { Users, Shield, Award, BookOpen, Gavel, Scale, FileText, CheckCircle } from 'lucide-react';

interface BoardMember {
  name: string;
  position: string;
  background: string;
  image: string;
  credentials: string[];
}

const GovernanceContent: React.FC = () => {
  const { openDonationModal } = useDonationModal();

  const boardMembers: BoardMember[] = [
    {
      name: 'Dr. Adebayo Johnson',
      position: 'Chairman of the Board',
      background: 'Former Director of Social Services, Lagos State Government. 25+ years in nonprofit governance.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      credentials: ['PhD Public Administration', 'Certified Nonprofit Executive', 'Board Leadership Certificate']
    },
    {
      name: 'Mrs. Funmi Adebayo',
      position: 'Vice Chairperson',
      background: 'Senior Partner at a leading accounting firm. Expert in nonprofit financial management and compliance.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616c34ca2f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      credentials: ['CPA, FCCA', 'Nonprofit Finance Specialist', '20+ years audit experience']
    },
    {
      name: 'Dr. Emmanuel Okafor',
      position: 'Secretary',
      background: 'Pediatrician and child welfare advocate. Leads healthcare initiatives for vulnerable children.',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      credentials: ['MD Pediatrics', 'Child Welfare Certification', 'Healthcare Policy Advisor']
    },
    {
      name: 'Rev. Grace Oduya',
      position: 'Treasurer',
      background: 'Community leader and microfinance expert. Specializes in widow empowerment and financial literacy.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      credentials: ['MBA Finance', 'Microfinance Specialist', 'Community Development Expert']
    },
    {
      name: 'Prof. Samuel Kalu',
      position: 'Member',
      background: 'Education researcher and former university administrator. Champions educational access for orphans.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      credentials: ['PhD Education', 'UNESCO Consultant', 'Educational Policy Expert']
    },
    {
      name: 'Mrs. Blessing Uche',
      position: 'Member',
      background: 'Legal practitioner specializing in nonprofit law and children\'s rights advocacy.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      credentials: ['LLB, BL', 'Children\'s Rights Advocate', 'Nonprofit Law Specialist']
    }
  ];

  const policies = [
    {
      title: 'Code of Conduct',
      description: 'Ethical standards and behavioral expectations for all team members and volunteers',
      icon: Scale
    },
    {
      title: 'Conflict of Interest Policy',
      description: 'Guidelines for identifying and managing potential conflicts of interest',
      icon: Shield
    },
    {
      title: 'Financial Management Policy',
      description: 'Procedures for budget management, expense approval, and financial oversight',
      icon: FileText
    },
    {
      title: 'Whistleblower Protection',
      description: 'Safe channels for reporting misconduct or policy violations',
      icon: Award
    },
    {
      title: 'Child Protection Policy',
      description: 'Comprehensive safeguarding measures for all children in our programs',
      icon: Users
    },
    {
      title: 'Document Retention Policy',
      description: 'Standards for maintaining and disposing of organizational records',
      icon: BookOpen
    }
  ];

  return (
    <>
      <Head>
        <title>Governance - Saintlammy Foundation</title>
        <meta
          name="description"
          content="Learn about Saintlammy Foundation's governance structure, board of directors, policies, and accountability measures ensuring effective leadership."
        />
        <meta name="keywords" content="nonprofit governance, board of directors, organizational policies, accountability, leadership structure" />
        <link rel="canonical" href="https://www.saintlammyfoundation.org/governance" />
      </Head>

      <Navigation onDonateClick={() => openDonationModal({
        source: 'general',
        title: 'Support Our Mission',
        description: 'Your donation helps us transform lives across Nigeria'
      })} />

      <ErrorBoundary>
        <main className="min-h-screen bg-gray-900 pt-16">
          <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="max-w-7xl mx-auto px-6">
              <Breadcrumb
                items={[{ label: 'Governance', current: true }]}
                className="mb-8"
              />

              <div className="text-center mb-16">
                <div className="w-16 h-16 bg-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Gavel className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-display-lg md:text-display-xl font-medium text-white mb-6 font-display tracking-tight">
                  Governance & Leadership
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
                  Strong governance ensures accountability, transparency, and effective stewardship of resources
                  to maximize our impact in Nigerian communities.
                </p>
              </div>

              {/* Governance Principles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: 'Accountability',
                    description: 'We maintain clear responsibility structures and regular performance reviews',
                    icon: CheckCircle
                  },
                  {
                    title: 'Transparency',
                    description: 'All decisions and financial matters are reported openly to stakeholders',
                    icon: Shield
                  },
                  {
                    title: 'Integrity',
                    description: 'We uphold the highest ethical standards in all our operations',
                    icon: Award
                  }
                ].map((principle, index) => (
                  <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
                    <principle.icon className="w-12 h-12 text-accent-400 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-white mb-4 font-display">
                      {principle.title}
                    </h3>
                    <p className="text-gray-300 text-sm font-light">
                      {principle.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Board of Directors */}
          <section className="py-20 bg-gray-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-display-md md:text-display-lg font-medium text-white mb-6 font-display tracking-tight">
                  Board of Directors
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto font-light">
                  Our board consists of experienced professionals committed to our mission and values.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {boardMembers.map((member, index) => (
                  <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden hover:bg-gray-800/70 transition-colors">
                    <div className="relative h-64">
                      <Image
                        src={member.image}
                        alt={`${member.name} - ${member.position}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-2 font-display">
                        {member.name}
                      </h3>
                      <p className="text-accent-400 text-sm font-medium mb-4">
                        {member.position}
                      </p>
                      <p className="text-gray-300 text-sm leading-relaxed mb-4 font-light">
                        {member.background}
                      </p>

                      <div className="space-y-2">
                        <h4 className="text-white text-sm font-medium">Credentials:</h4>
                        {member.credentials.map((credential, credIndex) => (
                          <div key={credIndex} className="flex items-center text-gray-400 text-xs">
                            <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                            {credential}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Organizational Structure */}
          <section className="py-20 bg-black">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-display-md md:text-display-lg font-medium text-white mb-6 font-display tracking-tight">
                  Organizational Structure
                </h2>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
                <div className="space-y-8">
                  {/* Board Level */}
                  <div className="text-center">
                    <div className="bg-accent-500 text-white px-6 py-3 rounded-lg inline-block font-medium">
                      Board of Directors
                    </div>
                    <p className="text-gray-400 text-sm mt-2">
                      Strategic oversight, policy setting, and accountability
                    </p>
                  </div>

                  {/* Executive Level */}
                  <div className="text-center">
                    <div className="bg-blue-500 text-white px-6 py-3 rounded-lg inline-block font-medium">
                      Executive Director
                    </div>
                    <p className="text-gray-400 text-sm mt-2">
                      Daily operations, program implementation, and staff management
                    </p>
                  </div>

                  {/* Department Level */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { dept: 'Program Operations', focus: 'Direct service delivery and beneficiary support' },
                      { dept: 'Finance & Administration', focus: 'Financial management and organizational support' },
                      { dept: 'Outreach & Partnerships', focus: 'Community engagement and stakeholder relations' }
                    ].map((dept, index) => (
                      <div key={index} className="text-center">
                        <div className="bg-gray-600 text-white px-4 py-2 rounded-lg inline-block font-medium text-sm">
                          {dept.dept}
                        </div>
                        <p className="text-gray-400 text-xs mt-2">
                          {dept.focus}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Volunteer Level */}
                  <div className="text-center">
                    <div className="bg-purple-500 text-white px-6 py-3 rounded-lg inline-block font-medium">
                      Volunteers & Field Staff
                    </div>
                    <p className="text-gray-400 text-sm mt-2">
                      Direct beneficiary interaction and community-level program delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Policies & Procedures */}
          <section className="py-20 bg-gray-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-display-md md:text-display-lg font-medium text-white mb-6 font-display tracking-tight">
                  Policies & Procedures
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto font-light">
                  Our comprehensive policies ensure ethical operations and protect all stakeholders.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {policies.map((policy, index) => (
                  <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-colors">
                    <policy.icon className="w-8 h-8 text-accent-400 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-3 font-display">
                      {policy.title}
                    </h3>
                    <p className="text-gray-300 text-sm font-light leading-relaxed">
                      {policy.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <p className="text-gray-400 text-sm mb-6">
                  Request access to our complete policy documentation
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
                >
                  Request Policy Documents
                </a>
              </div>
            </div>
          </section>

          {/* Accountability Measures */}
          <section className="py-20 bg-black">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-display-md md:text-display-lg font-medium text-white mb-6 font-display tracking-tight">
                  Accountability Measures
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
                  <h3 className="text-xl font-semibold text-white mb-6 font-display">
                    Internal Controls
                  </h3>
                  <div className="space-y-4">
                    {[
                      'Quarterly board meetings with detailed reporting',
                      'Annual independent financial audits',
                      'Monthly program performance reviews',
                      'Donor feedback and satisfaction surveys',
                      'Regular compliance assessments'
                    ].map((control, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{control}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
                  <h3 className="text-xl font-semibold text-white mb-6 font-display">
                    External Oversight
                  </h3>
                  <div className="space-y-4">
                    {[
                      'CAC regulatory compliance and reporting',
                      'Third-party program evaluations',
                      'External auditor recommendations',
                      'Peer organization reviews',
                      'Community feedback mechanisms'
                    ].map((oversight, index) => (
                      <div key={index} className="flex items-start">
                        <Shield className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{oversight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Governance */}
          <section className="py-20 bg-gray-900">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-display-md font-medium text-white mb-6 font-display tracking-tight">
                Governance Questions?
              </h2>
              <p className="text-lg text-gray-300 mb-8 font-light">
                We welcome questions about our governance structure, policies, or board operations.
                Transparency is fundamental to our mission.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-medium transition-colors"
                >
                  Contact Board Secretary
                </a>
                <a
                  href="/transparency"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-medium transition-colors"
                >
                  View Financial Reports
                </a>
              </div>
            </div>
          </section>
        </main>
      </ErrorBoundary>
    </>
  );
};

const GovernancePage: React.FC = () => {
  return (
    <DonationModalProvider>
      <GovernanceContent />
    </DonationModalProvider>
  );
};

export default GovernancePage;