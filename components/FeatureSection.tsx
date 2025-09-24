import React from 'react';
import {
  Home,
  Baby,
  Users,
  Bitcoin,
  LayoutDashboard,
  Target,
  DollarSign,
  FileText,
  Handshake,
  UserPlus,
  TrendingUp,
  Shield
} from 'lucide-react';

const FeatureSection: React.FC = () => {
  const features = [
    {
      icon: Home,
      title: 'Adopt Orphanages',
      description: 'Support entire orphanage homes with monthly or one-time contributions. Track your impact and see how your donations transform lives.',
      link: '/adopt/homes'
    },
    {
      icon: Baby,
      title: 'Adopt Orphans',
      description: 'Sponsor individual orphans for education, healthcare, and daily needs. Build meaningful connections through regular updates.',
      link: '/adopt/orphans'
    },
    {
      icon: Users,
      title: 'Support Widows',
      description: 'Empower widows with monthly support for business ventures, education, and family needs. Help them become self-sufficient.',
      link: '/adopt/widows'
    },
    {
      icon: Bitcoin,
      title: 'Crypto Donations',
      description: 'Donate using Bitcoin, Ethereum, and other cryptocurrencies. All crypto donors can provide details for tax reporting.',
      link: '/donate/crypto'
    },
    {
      icon: LayoutDashboard,
      title: 'Admin Dashboard',
      description: 'Comprehensive management system for tracking donations, beneficiaries, programs, volunteers, and financial reports.',
      link: '/admin'
    },
    {
      icon: Target,
      title: 'Programs & Outreaches',
      description: 'Create and manage education, healthcare, feeding, and empowerment programs with detailed tracking and reporting.',
      link: '/programs'
    },
    {
      icon: DollarSign,
      title: 'Financial Management',
      description: 'Track all income, expenses, budgets, and generate comprehensive financial reports with full transparency.',
      link: '/admin/finance'
    },
    {
      icon: FileText,
      title: 'Grants Application',
      description: 'Apply for grants from foundations, corporations, and government agencies. Track applications and manage funding.',
      link: '/admin/grants'
    },
    {
      icon: Handshake,
      title: 'Partnership Management',
      description: 'Build and manage partnerships with corporations, NGOs, and international organizations for greater impact.',
      link: '/admin/partners'
    },
    {
      icon: UserPlus,
      title: 'Volunteer Management',
      description: 'Recruit, train, and manage volunteers. Track hours, assign tasks, and recognize contributions.',
      link: '/volunteer'
    },
    {
      icon: TrendingUp,
      title: 'Impact Tracking',
      description: 'Measure and visualize the impact of your donations and programs with detailed analytics and success stories.',
      link: '/impact'
    },
    {
      icon: Shield,
      title: 'Tax Compliance',
      description: 'All crypto and traditional donations include proper documentation for tax reporting and compliance.',
      link: '/tax-info'
    }
  ];

  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-display-md md:text-display-lg font-medium text-white mb-6 font-display tracking-tight">
            Complete Charity Management Platform
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            Everything you need to run a modern charity organization, from crypto donations
            to comprehensive program management and impact tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-700 hover:border-accent-500"
            >
              {/* Icon */}
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center group-hover:bg-accent-500/30 transition-colors">
                  <feature.icon className="w-6 h-6 text-accent-400" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-accent-400 transition-colors font-display">
                {feature.title}
              </h3>

              <p className="text-gray-300 mb-6 leading-relaxed font-light text-sm">
                {feature.description}
              </p>

              {/* CTA Link */}
              <a
                href={feature.link}
                className="inline-flex items-center text-accent-400 font-medium text-sm group-hover:text-accent-300 transition-colors font-sans"
              >
                Learn more
                <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent-500/5 to-accent-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <button className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-medium text-base transition-colors shadow-glow hover:shadow-glow-lg font-sans">
            Start Making Impact Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;