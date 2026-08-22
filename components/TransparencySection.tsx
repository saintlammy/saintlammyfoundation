import React from 'react';
import { ComponentProps } from '@/types';
import { RiCheckboxCircleLine, RiDownloadLine, RiEyeLine, RiPieChartLine, RiShieldCheckLine } from 'react-icons/ri';
import { ActionButton, ActionLink, DoubleBezel, SectionHeading } from './home/HomePrimitives';

interface TransparencySectionProps extends ComponentProps {}

interface FundAllocation {
  category: string;
  percentage: number;
  amount: string;
  color: string;
  description: string;
}

interface Certification {
  name: string;
  issuer: string;
  year: string;
  icon: React.ElementType;
  verified: boolean;
}

const TransparencySection: React.FC<TransparencySectionProps> = ({ className = '' }) => {
  const fundAllocations: FundAllocation[] = [
    {
      category: 'Direct Beneficiary Support',
      percentage: 39.3,
      amount: '₦3,026,250 (~$2,175)',
      color: 'bg-accent-500',
      description: 'Food supplies, widow support, orphan care, open medical outreach'
    },
    {
      category: 'Program Logistics',
      percentage: 3.6,
      amount: '₦280,000 (~$201)',
      color: 'bg-blue-500',
      description: 'Transportation, delivery costs, on-ground operations'
    },
    {
      category: 'Administration & Branding',
      percentage: 1.8,
      amount: '₦138,000 (~$99)',
      color: 'bg-green-500',
      description: 'Printing, banners, branding, basic platform operations'
    },
    {
      category: 'Emergency + Strategic Reserve',
      percentage: 55.3,
      amount: '₦4,249,826 (~$3,045)',
      color: 'bg-yellow-500',
      description: 'Includes spendable buffer and unspendable reserve for Q4 outreach & future needs'
    }
  ];

  const certifications: Certification[] = [
    {
      name: 'RC: 9015713',
      issuer: 'Corporate Affairs Commission',
      year: '2025',
      icon: RiShieldCheckLine,
      verified: true
    },
    {
      name: 'Legal Entity: Saintlammy Community Care Initiative',
      issuer: 'Incorporated November 2025',
      year: '2025',
      icon: RiEyeLine,
      verified: true
    }
  ];

  return (
    <section className={`home-section home-section-paper home-transparency ${className}`}>
      <div className="home-container">
        <SectionHeading
          eyebrow="Open by design"
          title={<>Every naira has a <span className="home-ink-accent">visible purpose.</span></>}
          description="Explore how funds move, what they accomplish and the safeguards that keep the work accountable."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Fund Allocation */}
          <div data-home-reveal className="home-bezel home-transparency-major">
            <div className="home-bezel-core home-transparency-card">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center mr-4">
                <RiPieChartLine className="w-6 h-6 text-accent-500" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white font-display">
                  Fund Allocation 2025
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total: ₦7,694,076 (~$5,520)</p>
              </div>
            </div>

            {/* Visual Chart */}
            <div className="mb-8">
              <div className="relative h-4 bg-gray-300 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-accent-500 rounded-l-full"
                  style={{ width: '39.3%' }}
                ></div>
                <div
                  className="absolute top-0 h-full bg-blue-500"
                  style={{ left: '39.3%', width: '3.6%' }}
                ></div>
                <div
                  className="absolute top-0 h-full bg-green-500"
                  style={{ left: '42.9%', width: '1.8%' }}
                ></div>
                <div
                  className="absolute top-0 h-full bg-yellow-500 rounded-r-full"
                  style={{ left: '44.7%', width: '55.3%' }}
                ></div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-4">
              {fundAllocations.map((allocation, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-4 h-4 ${allocation.color} rounded-full mt-1 flex-shrink-0`}></div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-gray-900 dark:text-white font-medium font-sans">{allocation.category}</h4>
                      <span className="text-accent-400 font-semibold">{allocation.percentage}%</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{allocation.description}</p>
                    <p className="text-gray-900 dark:text-white font-medium text-sm">{allocation.amount}</p>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>

          {/* Certifications & Compliance */}
          <div data-home-reveal className="home-bezel home-transparency-major">
            <div className="home-bezel-core home-transparency-card">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mr-4">
                <RiCheckboxCircleLine className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white font-display">
                  Certifications & Compliance
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Verified and up-to-date</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <cert.icon className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-gray-900 dark:text-white font-medium font-sans">{cert.name}</h4>
                      {cert.verified && (
                        <RiCheckboxCircleLine className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{cert.issuer} • {cert.year}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Annual Report Download */}
            <div className="bg-gradient-to-r from-accent-500/10 to-accent-600/10 border border-accent-500/20 rounded-xl p-6">
              <h4 className="text-gray-900 dark:text-white font-semibold mb-2 font-display">
                Annual Financial Report 2025
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 font-light">
                Complete breakdown of our finances, impact metrics, and strategic initiatives.
              </p>
              <a href="/transparency" className="home-report-button">
                <RiDownloadLine className="w-4 h-4" />
                <span>View annual report</span>
              </a>
            </div>
            </div>
          </div>
        </div>

        {/* Key Transparency Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Open Financial Records',
              description: 'All financial statements and fund allocations are publicly accessible and regularly audited.',
              icon: RiEyeLine
            },
            {
              title: 'Regular Impact Reports',
              description: 'Quarterly reports showing measurable outcomes and beneficiary feedback.',
              icon: RiPieChartLine
            },
            {
              title: 'Third-party Verification',
              description: 'Independent audits and compliance checks ensure accountability.',
              icon: RiShieldCheckLine
            }
          ].map((principle, index) => (
            <DoubleBezel key={index} className="home-principle-bezel" coreClassName="home-principle-card">
              <div className="w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <principle.icon className="w-6 h-6 text-accent-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 font-display">
                {principle.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm font-light leading-relaxed">
                {principle.description}
              </p>
            </DoubleBezel>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <DoubleBezel coreClassName="home-inline-cta">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 font-display">
              Questions About Our Finances?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto font-light">
              We're committed to transparency. Reach out to our team for detailed financial information or specific questions about fund usage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ActionLink href="/contact">Request financial details</ActionLink>
              <ActionLink href="/transparency" tone="secondary">View all reports</ActionLink>
            </div>
          </DoubleBezel>
        </div>
      </div>
    </section>
  );
};

export default TransparencySection;
