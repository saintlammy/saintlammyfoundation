import React from 'react';
import { RiAwardLine, RiEyeLine, RiFileChartLine, RiMoneyDollarCircleLine, RiShieldCheckLine, RiTeamLine } from 'react-icons/ri';
import { DoubleBezel, SectionHeading } from './home/HomePrimitives';

const TrustIndicators: React.FC = () => {
  return (
    <section className="home-section home-section-ink home-trust-section">
      <div className="home-container">
        <SectionHeading
          eyebrow="Trust, made visible"
          title={<>Good intentions need <span className="home-emerald-accent">accountable systems.</span></>}
          description="Registration, transparent reporting and disciplined stewardship guide every decision we make."
          inverse
        />

        {/* Trust Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: RiShieldCheckLine,
              title: 'Registered',
              description: 'RC: 9015713',
              detail: 'Saintlammy Community Care Initiative - Officially registered November 2025'
            },
            {
              icon: RiEyeLine,
              title: 'Transparent Operations',
              description: 'Reports, receipts, and donor records are accessible',
              detail: 'Full visibility into how your donations are used'
            },
            {
              icon: RiFileChartLine,
              title: 'Donor Reports',
              description: 'All crypto and Naira donations are logged for tax purposes',
              detail: 'Complete documentation for your records'
            },
            {
              icon: RiTeamLine,
              title: 'Governance',
              description: 'Oversight from leadership board and financial committee',
              detail: 'Structured accountability and decision-making'
            },
            {
              icon: RiAwardLine,
              title: '6 Months Service',
              description: 'Consistent delivery and community trust since July 2025',
              detail: 'Building a proven track record of impact and reliability'
            },
            {
              icon: RiMoneyDollarCircleLine,
              title: 'Efficient Use',
              description: '70% direct aid, 20% logistics, 10% operations',
              detail: 'Your money goes where it matters most'
            }
          ].map((item, index) => (
            <DoubleBezel key={index} className={`home-trust-bezel ${index === 0 || index === 5 ? 'home-trust-wide' : ''}`} coreClassName="home-trust-card">
              <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-accent-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-display">
                {item.title}
              </h3>
              <p className="text-accent-400 font-medium text-sm mb-2">
                {item.description}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm font-light">
                {item.detail}
              </p>
            </DoubleBezel>
          ))}
        </div>

        {/* Donation Breakdown */}
        <DoubleBezel coreClassName="home-donation-breakdown">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-4 font-display">
              Breakdown of Donation Use
            </h3>
            <p className="text-gray-600 dark:text-gray-300 font-light">
              See exactly how every Naira and dollar makes a difference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">70%</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-display">Direct Aid & Programs</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm font-light">
                Food, healthcare, education, widow empowerment, orphan support
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">20%</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-display">Logistics & Volunteers</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm font-light">
                Transportation, outreach coordination, volunteer training and support
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">10%</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-display">Operations</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm font-light">
                Administration, technology, legal compliance, and reporting
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-200 dark:bg-gray-700 rounded-xl text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300 font-light">
              <strong>100% Transparency:</strong> All financial records are available to donors upon request.
              We believe your trust deserves complete openness.
            </p>
          </div>
        </DoubleBezel>
      </div>
    </section>
  );
};

export default TrustIndicators;
