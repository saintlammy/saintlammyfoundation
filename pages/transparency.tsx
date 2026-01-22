import React from 'react';
import Head from 'next/head';
import Navigation from '@/components/Navigation';
import Breadcrumb from '@/components/Breadcrumb';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useDonationModal } from '@/components/DonationModalProvider';
import { PieChart, BarChart3, TrendingUp, DollarSign, FileText, Download, Eye, Shield } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { pageSEO } from '@/lib/seo';

const TransparencyPage: React.FC = () => {
  const { openDonationModal } = useDonationModal();

  const financialData = [
    { category: 'Direct Beneficiary Support', percentage: 39.3, amount: '₦3,026,250 (~$2,175)', color: 'bg-green-500' },
    { category: 'Program Logistics', percentage: 3.6, amount: '₦280,000 (~$201)', color: 'bg-blue-500' },
    { category: 'Administration & Branding', percentage: 1.8, amount: '₦138,000 (~$99)', color: 'bg-purple-500' },
    { category: 'Emergency + Strategic Reserve', percentage: 55.3, amount: '₦4,249,826 (~$3,045)', color: 'bg-yellow-500' }
  ];

  const programBreakdown = [
    { program: 'Food Supplies & Widow Support', percentage: 45, amount: '₦1,361,812' },
    { program: 'Orphan Care Programs', percentage: 30, amount: '₦907,875' },
    { program: 'Open Medical Outreach', percentage: 25, amount: '₦756,563' }
  ];

  const documents = [
    {
      title: 'CAC Registration Certificate',
      description: 'Official incorporation as Saintlammy Community Care Initiative (Reg: 9015713)',
      date: 'November 2025',
      type: 'PDF'
    },
    {
      title: 'Annual Financial Report 2024',
      description: 'Comprehensive financial statements and program outcomes',
      date: 'Coming Soon',
      type: 'PDF'
    },
    {
      title: 'Program Impact Report 2024',
      description: 'Detailed analysis of program effectiveness and beneficiary outcomes',
      date: 'Coming Soon',
      type: 'PDF'
    }
  ];

  return (
    <>
      <SEOHead config={pageSEO.transparency} />

      <Navigation onDonateClick={() => openDonationModal({
        source: 'general',
        title: 'Support Our Mission',
        description: 'Your donation helps us transform lives across Nigeria'
      })} />

      <ErrorBoundary>
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
          <section className="py-16 bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black">
            <div className="max-w-7xl mx-auto px-6">
              <Breadcrumb
                items={[{ label: 'Financial Transparency', current: true }]}
                className="mb-8"
              />

              <div className="text-center mb-16">
                <div className="w-16 h-16 bg-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-display-lg md:text-display-xl font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                  Financial Transparency
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
                  We believe in complete transparency with our supporters. See exactly how your donations
                  are used to create lasting impact in Nigerian communities.
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Revenue 2025', value: '₦7.7M', icon: DollarSign, color: 'text-green-400' },
                  { label: 'Direct Aid Ratio', value: '39.3%', icon: TrendingUp, color: 'text-blue-400' },
                  { label: 'Lives Impacted', value: '800+', icon: Shield, color: 'text-purple-400' },
                  { label: 'Active Programs', value: '6', icon: BarChart3, color: 'text-yellow-400' }
                ].map((metric, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center">
                    <metric.icon className={`w-8 h-8 mx-auto mb-3 ${metric.color}`} />
                    <div className={`text-3xl font-bold mb-2 font-display ${metric.color}`}>
                      {metric.value}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Fund Allocation */}
          <section className="py-20 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                  How We Use Your Donations
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light">
                  Every naira is carefully allocated to maximize impact and ensure efficient operations.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Overall Fund Allocation */}
                <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 font-display flex items-center">
                    <PieChart className="w-6 h-6 mr-3 text-accent-400" />
                    Fund Allocation 2025
                  </h3>

                  <div className="space-y-6">
                    {financialData.map((item, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-900 dark:text-white font-medium">{item.category}</span>
                          <span className="text-gray-700 dark:text-gray-300 font-bold">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${item.color} transition-all duration-1000`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-right text-gray-600 dark:text-gray-400 text-sm">
                          {item.amount}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-green-400 text-sm font-medium">
                      Total: ₦7,694,076 (~$5,520) • 39.3% direct aid + 55.3% strategic reserve for Q4 expansion
                    </p>
                  </div>
                </div>

                {/* Program Breakdown */}
                <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 font-display flex items-center">
                    <BarChart3 className="w-6 h-6 mr-3 text-accent-400" />
                    Program Investment
                  </h3>

                  <div className="space-y-6">
                    {programBreakdown.map((program, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-900 dark:text-white font-medium">{program.program}</span>
                          <span className="text-gray-700 dark:text-gray-300 font-bold">{program.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className="h-3 rounded-full bg-accent-500 transition-all duration-1000"
                            style={{ width: `${program.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-right text-gray-600 dark:text-gray-400 text-sm">
                          {program.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Impact Metrics */}
          <section className="py-20 bg-gray-100 dark:bg-black">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                  Measurable Impact
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light">
                  Our commitment to transparency includes tracking and reporting our real-world impact.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    title: 'Orphans Supported',
                    current: '300+',
                    target: '500',
                    percentage: 60,
                    description: 'Orphans receiving care, food, and educational support'
                  },
                  {
                    title: 'Widows Empowered',
                    current: '500+',
                    target: '750',
                    percentage: 67,
                    description: 'Widows receiving monthly stipends and business grants'
                  },
                  {
                    title: 'Medical Outreach Visits',
                    current: '800+',
                    target: '1,200',
                    percentage: 67,
                    description: 'Free health checkups and medical interventions provided'
                  },
                  {
                    title: 'Communities Reached',
                    current: '25+',
                    target: '50',
                    percentage: 50,
                    description: 'Villages and communities served across Nigeria'
                  }
                ].map((metric, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 font-display">
                      {metric.title}
                    </h3>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-2xl font-bold text-accent-400">{metric.current}</span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">of {metric.target}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-accent-500 transition-all duration-1000"
                          style={{ width: `${metric.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-gray-600 dark:text-gray-400 text-xs mt-1">
                        {metric.percentage}% of 2025 goal
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm font-light">
                      {metric.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Documents & Reports */}
          <section className="py-20 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                  Official Documents & Reports
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light">
                  Access our financial statements, legal documents, and detailed impact reports.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {documents.map((doc, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <FileText className="w-8 h-8 text-accent-400 mr-3" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-display">
                            {doc.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{doc.date} • {doc.type}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          // Placeholder for document download - would connect to actual document in production
                          alert(`Document "${doc.title}" download will be available soon. Please contact us at hello@saintlammyfoundation.org for access.`);
                        }}
                        className="bg-accent-500 hover:bg-accent-600 text-white p-2 rounded-lg transition-colors"
                        title={`Download ${doc.title}`}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm font-light">
                      {doc.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                  Need additional documentation or have questions about our finances?
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center bg-gray-900 dark:bg-white/10 hover:bg-gray-800 dark:hover:bg-white/20 text-white border border-gray-900 dark:border-white/20 px-6 py-3 rounded-full font-medium transition-colors"
                >
                  Contact Our Finance Team
                </a>
              </div>
            </div>
          </section>

          {/* Governance */}
          <section className="py-20 bg-gray-100 dark:bg-black">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                  Governance & Accountability
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
                  <Shield className="w-12 h-12 text-accent-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 font-display">
                    Independent Board
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-light">
                    Our board includes independent members from finance, healthcare, and social work backgrounds.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
                  <FileText className="w-12 h-12 text-accent-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 font-display">
                    Annual Audits
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-light">
                    We undergo independent financial audits annually to ensure accuracy and compliance.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
                  <Eye className="w-12 h-12 text-accent-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 font-display">
                    Open Reporting
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-light">
                    All major decisions and financial information are reported transparently to stakeholders.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-display-md font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                Your Trust Drives Our Transparency
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-light">
                We're committed to earning and maintaining your trust through complete financial transparency
                and measurable impact reporting.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => openDonationModal({
                    source: 'transparency',
                    title: 'Support Transparent Impact',
                    description: 'Your donation will be used efficiently and transparently'
                  })}
                  className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-medium transition-colors"
                >
                  Donate with Confidence
                </button>
                <a
                  href="/contact"
                  className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 px-8 py-4 rounded-full font-medium transition-colors"
                >
                  Ask Questions
                </a>
              </div>
            </div>
          </section>
        </main>
      </ErrorBoundary>
    </>
  );
};


export default TransparencyPage;