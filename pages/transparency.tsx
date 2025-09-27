import React from 'react';
import Head from 'next/head';
import Navigation from '@/components/Navigation';
import Breadcrumb from '@/components/Breadcrumb';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useDonationModal } from '@/components/DonationModalProvider';
import { PieChart, BarChart3, TrendingUp, DollarSign, FileText, Download, Eye, Shield } from 'lucide-react';

const TransparencyPage: React.FC = () => {
  const { openDonationModal } = useDonationModal();

  const financialData = [
    { category: 'Programs & Services', percentage: 85, amount: '₦34,000,000', color: 'bg-green-500' },
    { category: 'Administrative Costs', percentage: 10, amount: '₦4,000,000', color: 'bg-blue-500' },
    { category: 'Fundraising', percentage: 5, amount: '₦2,000,000', color: 'bg-purple-500' }
  ];

  const programBreakdown = [
    { program: 'Orphan Support', percentage: 40, amount: '₦13,600,000' },
    { program: 'Widow Empowerment', percentage: 30, amount: '₦10,200,000' },
    { program: 'Education Programs', percentage: 20, amount: '₦6,800,000' },
    { program: 'Healthcare Initiatives', percentage: 10, amount: '₦3,400,000' }
  ];

  const documents = [
    {
      title: 'Annual Financial Report 2023',
      description: 'Comprehensive financial statements and program outcomes',
      date: 'March 2024',
      type: 'PDF'
    },
    {
      title: 'CAC Registration Certificate',
      description: 'Official registration documents with Corporate Affairs Commission',
      date: 'Updated 2023',
      type: 'PDF'
    },
    {
      title: 'Board of Directors List',
      description: 'Current board members and their professional backgrounds',
      date: 'January 2024',
      type: 'PDF'
    },
    {
      title: 'Program Impact Report 2023',
      description: 'Detailed analysis of program effectiveness and beneficiary outcomes',
      date: 'February 2024',
      type: 'PDF'
    }
  ];

  return (
    <>
      <Head>
        <title>Financial Transparency - Saintlammy Foundation</title>
        <meta
          name="description"
          content="View our financial transparency reports, fund allocation, and organizational governance. See how your donations create impact across Nigeria."
        />
        <meta name="keywords" content="charity transparency, financial reports, fund allocation, nonprofit governance, donation impact" />
        <link rel="canonical" href="https://www.saintlammyfoundation.org/transparency" />
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
                items={[{ label: 'Financial Transparency', current: true }]}
                className="mb-8"
              />

              <div className="text-center mb-16">
                <div className="w-16 h-16 bg-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-display-lg md:text-display-xl font-medium text-white mb-6 font-display tracking-tight">
                  Financial Transparency
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
                  We believe in complete transparency with our supporters. See exactly how your donations
                  are used to create lasting impact in Nigerian communities.
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Revenue 2023', value: '₦40M', icon: DollarSign, color: 'text-green-400' },
                  { label: 'Program Efficiency', value: '85%', icon: TrendingUp, color: 'text-blue-400' },
                  { label: 'Lives Impacted', value: '850+', icon: Shield, color: 'text-purple-400' },
                  { label: 'Active Programs', value: '12', icon: BarChart3, color: 'text-yellow-400' }
                ].map((metric, index) => (
                  <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
                    <metric.icon className={`w-8 h-8 mx-auto mb-3 ${metric.color}`} />
                    <div className={`text-3xl font-bold mb-2 font-display ${metric.color}`}>
                      {metric.value}
                    </div>
                    <div className="text-gray-400 text-sm font-medium">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Fund Allocation */}
          <section className="py-20 bg-gray-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-display-md md:text-display-lg font-medium text-white mb-6 font-display tracking-tight">
                  How We Use Your Donations
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto font-light">
                  Every naira is carefully allocated to maximize impact and ensure efficient operations.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Overall Fund Allocation */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
                  <h3 className="text-2xl font-semibold text-white mb-8 font-display flex items-center">
                    <PieChart className="w-6 h-6 mr-3 text-accent-400" />
                    Fund Allocation 2023
                  </h3>

                  <div className="space-y-6">
                    {financialData.map((item, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">{item.category}</span>
                          <span className="text-gray-300 font-bold">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${item.color} transition-all duration-1000`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-right text-gray-400 text-sm">
                          {item.amount}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-green-400 text-sm font-medium">
                      ✓ 85% of funds go directly to programs - exceeding charity standards of 75%
                    </p>
                  </div>
                </div>

                {/* Program Breakdown */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
                  <h3 className="text-2xl font-semibold text-white mb-8 font-display flex items-center">
                    <BarChart3 className="w-6 h-6 mr-3 text-accent-400" />
                    Program Investment
                  </h3>

                  <div className="space-y-6">
                    {programBreakdown.map((program, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">{program.program}</span>
                          <span className="text-gray-300 font-bold">{program.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div
                            className="h-3 rounded-full bg-accent-500 transition-all duration-1000"
                            style={{ width: `${program.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-right text-gray-400 text-sm">
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
          <section className="py-20 bg-black">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-display-md md:text-display-lg font-medium text-white mb-6 font-display tracking-tight">
                  Measurable Impact
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto font-light">
                  Our commitment to transparency includes tracking and reporting our real-world impact.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    title: 'Children Educated',
                    current: '320',
                    target: '500',
                    percentage: 64,
                    description: 'Students receiving educational support and scholarships'
                  },
                  {
                    title: 'Widows Empowered',
                    current: '185',
                    target: '250',
                    percentage: 74,
                    description: 'Widows who completed our empowerment programs'
                  },
                  {
                    title: 'Healthcare Visits',
                    current: '1,250',
                    target: '1,500',
                    percentage: 83,
                    description: 'Medical consultations and treatments provided'
                  },
                  {
                    title: 'Communities Reached',
                    current: '45',
                    target: '60',
                    percentage: 75,
                    description: 'Villages and communities served across Nigeria'
                  }
                ].map((metric, index) => (
                  <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 font-display">
                      {metric.title}
                    </h3>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-2xl font-bold text-accent-400">{metric.current}</span>
                        <span className="text-gray-400 text-sm">of {metric.target}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-accent-500 transition-all duration-1000"
                          style={{ width: `${metric.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-gray-400 text-xs mt-1">
                        {metric.percentage}% of 2024 goal
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm font-light">
                      {metric.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Documents & Reports */}
          <section className="py-20 bg-gray-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-display-md md:text-display-lg font-medium text-white mb-6 font-display tracking-tight">
                  Official Documents & Reports
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto font-light">
                  Access our financial statements, legal documents, and detailed impact reports.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {documents.map((doc, index) => (
                  <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <FileText className="w-8 h-8 text-accent-400 mr-3" />
                        <div>
                          <h3 className="text-lg font-semibold text-white font-display">
                            {doc.title}
                          </h3>
                          <p className="text-gray-400 text-sm">{doc.date} • {doc.type}</p>
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
                    <p className="text-gray-300 text-sm font-light">
                      {doc.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <p className="text-gray-400 text-sm mb-6">
                  Need additional documentation or have questions about our finances?
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-full font-medium transition-colors"
                >
                  Contact Our Finance Team
                </a>
              </div>
            </div>
          </section>

          {/* Governance */}
          <section className="py-20 bg-black">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-display-md md:text-display-lg font-medium text-white mb-6 font-display tracking-tight">
                  Governance & Accountability
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
                  <Shield className="w-12 h-12 text-accent-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-white mb-4 font-display">
                    Independent Board
                  </h3>
                  <p className="text-gray-300 text-sm font-light">
                    Our board includes independent members from finance, healthcare, and social work backgrounds.
                  </p>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
                  <FileText className="w-12 h-12 text-accent-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-white mb-4 font-display">
                    Annual Audits
                  </h3>
                  <p className="text-gray-300 text-sm font-light">
                    We undergo independent financial audits annually to ensure accuracy and compliance.
                  </p>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
                  <Eye className="w-12 h-12 text-accent-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-white mb-4 font-display">
                    Open Reporting
                  </h3>
                  <p className="text-gray-300 text-sm font-light">
                    All major decisions and financial information are reported transparently to stakeholders.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 bg-gray-900">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-display-md font-medium text-white mb-6 font-display tracking-tight">
                Your Trust Drives Our Transparency
              </h2>
              <p className="text-lg text-gray-300 mb-8 font-light">
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
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-medium transition-colors"
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