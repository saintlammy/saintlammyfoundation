import React from 'react';
import { ComponentProps } from '@/types';
import { PieChart, Download, Eye, Shield, Award, CheckCircle } from 'lucide-react';

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
      percentage: 75,
      amount: '$2,134,694',
      color: 'bg-accent-500',
      description: 'Direct aid, stipends, education, and healthcare for orphans and widows'
    },
    {
      category: 'Program Operations',
      percentage: 15,
      amount: '$426,939',
      color: 'bg-blue-500',
      description: 'Field work, community outreach, and program coordination'
    },
    {
      category: 'Administrative Costs',
      percentage: 7,
      amount: '$199,331',
      color: 'bg-green-500',
      description: 'Essential operational expenses and overhead'
    },
    {
      category: 'Emergency Reserve',
      percentage: 3,
      amount: '$85,428',
      color: 'bg-yellow-500',
      description: 'Emergency fund for urgent community needs'
    }
  ];

  const certifications: Certification[] = [
    {
      name: 'CAC Registration',
      issuer: 'Corporate Affairs Commission',
      year: '2022',
      icon: Shield,
      verified: true
    },
    {
      name: 'Nonprofit Status',
      issuer: 'Federal Ministry of Humanitarian Affairs',
      year: '2022',
      icon: Award,
      verified: true
    },
    {
      name: 'Financial Transparency',
      issuer: 'GuideStar Nigeria',
      year: '2024',
      icon: Eye,
      verified: true
    }
  ];

  return (
    <section className={`py-24 bg-black ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-display-md md:text-display-lg font-medium text-white mb-6 font-display tracking-tight">
            Transparency & Accountability
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            We believe transparency builds trust. See exactly how your donations create impact and how we maintain the highest standards of accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Fund Allocation */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center mr-4">
                <PieChart className="w-6 h-6 text-accent-400" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white font-display">
                  Fund Allocation 2024
                </h3>
                <p className="text-gray-400 text-sm">Total: $2,846,392</p>
              </div>
            </div>

            {/* Visual Chart */}
            <div className="mb-8">
              <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-accent-500 rounded-l-full"
                  style={{ width: '75%' }}
                ></div>
                <div
                  className="absolute top-0 h-full bg-blue-500"
                  style={{ left: '75%', width: '15%' }}
                ></div>
                <div
                  className="absolute top-0 h-full bg-green-500"
                  style={{ left: '90%', width: '7%' }}
                ></div>
                <div
                  className="absolute top-0 h-full bg-yellow-500 rounded-r-full"
                  style={{ left: '97%', width: '3%' }}
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
                      <h4 className="text-white font-medium font-sans">{allocation.category}</h4>
                      <span className="text-accent-400 font-semibold">{allocation.percentage}%</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-1">{allocation.description}</p>
                    <p className="text-white font-medium text-sm">{allocation.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications & Compliance */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mr-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white font-display">
                  Certifications & Compliance
                </h3>
                <p className="text-gray-400 text-sm">Verified and up-to-date</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <cert.icon className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-white font-medium font-sans">{cert.name}</h4>
                      {cert.verified && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{cert.issuer} • {cert.year}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Annual Report Download */}
            <div className="bg-gradient-to-r from-accent-500/10 to-accent-600/10 border border-accent-500/20 rounded-xl p-6">
              <h4 className="text-white font-semibold mb-2 font-display">
                Annual Financial Report 2024
              </h4>
              <p className="text-gray-300 text-sm mb-4 font-light">
                Complete breakdown of our finances, impact metrics, and strategic initiatives.
              </p>
              <button className="flex items-center space-x-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                <Download className="w-4 h-4" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Transparency Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Open Financial Records',
              description: 'All financial statements and fund allocations are publicly accessible and regularly audited.',
              icon: Eye
            },
            {
              title: 'Regular Impact Reports',
              description: 'Quarterly reports showing measurable outcomes and beneficiary feedback.',
              icon: PieChart
            },
            {
              title: 'Third-party Verification',
              description: 'Independent audits and compliance checks ensure accountability.',
              icon: Shield
            }
          ].map((principle, index) => (
            <div key={index} className="text-center p-6 bg-gray-900/30 border border-gray-700 rounded-xl">
              <div className="w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <principle.icon className="w-6 h-6 text-accent-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3 font-display">
                {principle.title}
              </h3>
              <p className="text-gray-300 text-sm font-light leading-relaxed">
                {principle.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-white mb-4 font-display">
              Questions About Our Finances?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto font-light">
              We're committed to transparency. Reach out to our team for detailed financial information or specific questions about fund usage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded-full font-medium transition-colors">
                Request Financial Details
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3 rounded-full font-medium transition-colors">
                View All Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransparencySection;