import React from 'react';
import SEOHead from '@/components/SEOHead';
import { pageSEO, generateStructuredData } from '@/lib/seo';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import BeneficiaryShowcase from '@/components/BeneficiaryShowcase';
import ImpactGallery from '@/components/ImpactGallery';
import TestimonialsSection from '@/components/TestimonialsSection';
import UrgentNeeds from '@/components/UrgentNeeds';
import TrustIndicators from '@/components/TrustIndicators';
import NewsletterSignup from '@/components/NewsletterSignup';
import StickyDonationButton from '@/components/StickyDonationButton';
import SuccessStories from '@/components/SuccessStories';
import TransparencySection from '@/components/TransparencySection';
import ErrorBoundary from '@/components/ErrorBoundary';
import NewsUpdates from '@/components/NewsUpdates';
import { DonationModalProvider, useDonationModal } from '@/components/DonationModalProvider';
import { GetStaticProps } from 'next';
import { DashboardStats } from '@/types';
import { Target, DollarSign, TrendingUp, Heart, Users, GraduationCap, MapPin, Mail, Phone, Globe } from 'lucide-react';

interface HomeProps {
  stats?: DashboardStats;
}

const HomeContent: React.FC<HomeProps> = ({ stats }) => {
  const { openDonationModal } = useDonationModal();

  return (
    <>
      <SEOHead
        config={pageSEO.home}
        structuredData={generateStructuredData.organization()}
      />

      <Navigation onDonateClick={() => openDonationModal({
        source: 'general',
        title: 'Support Our Mission',
        description: 'Your donation helps us transform lives across Nigeria'
      })} />

      <ErrorBoundary>
        <main className="min-h-screen">
        <Hero onDonateClick={() => openDonationModal({
        source: 'hero-cta',
        title: 'Transform Lives Today',
        description: 'Join thousands of donors making a difference for orphans and widows'
      })} />

        {/* Who We Are Section */}
        <section className="py-24 bg-gray-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium mb-6 font-display tracking-tight text-white">
                Who We Are
              </h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                A faith-driven humanitarian initiative operating at the intersection of compassion and execution.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Main Story Card */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 h-full hover:bg-gray-800/60 hover:border-gray-600 transition-all duration-300">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-accent-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4 font-display">
                    Our Mission
                  </h3>
                </div>
                <p className="text-gray-300 font-light leading-relaxed mb-6">
                  Saintlammy Foundation is committed to restoring dignity, stability, and opportunity to the most vulnerable members of society. We mobilize support to orphans, widows, and underserved communities through direct aid, empowerment programs, and transparent partnerships.
                </p>
                <div className="flex items-center text-sm text-accent-400 font-medium">
                  <span className="w-2 h-2 bg-accent-500 rounded-full mr-3"></span>
                  Faith-Driven • Community-Focused • Results-Oriented
                </div>
              </div>

              {/* Journey Card */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 h-full hover:bg-gray-800/60 hover:border-gray-600 transition-all duration-300">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4 font-display">
                    Our Journey
                  </h3>
                </div>
                <p className="text-gray-300 font-light leading-relaxed mb-6">
                  Since inception, we have grown from a small outreach team to a structured charity delivering measurable impact through grassroots programs, donor partnerships, and God-centered leadership.
                </p>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></span>
                    Started with small community outreaches
                  </div>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></span>
                    Expanded to structured programs
                  </div>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></span>
                    Now serving 500+ widows and 300+ orphans
                  </div>
                </div>
              </div>
            </div>

            {/* Core Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  icon: Heart,
                  title: 'Orphan Care',
                  description: 'Supporting orphanages and connecting individual orphans with loving donors'
                },
                {
                  icon: Users,
                  title: 'Widow Empowerment',
                  description: 'Monthly stipends, counseling, and business grants for financial independence'
                },
                {
                  icon: GraduationCap,
                  title: 'Educational Access',
                  description: 'Ensuring every child has access to quality education and learning opportunities'
                },
                {
                  icon: MapPin,
                  title: 'Community Development',
                  description: 'Medical outreaches and support structures that help communities thrive'
                }
              ].map((pillar, index) => {
                const gradientClasses = [
                  'professional-gradient-1',
                  'professional-gradient-2',
                  'professional-gradient-3',
                  'professional-gradient-4'
                ];
                return (
                  <div key={index} className={`${gradientClasses[index]} hover:shadow-md transition-all duration-300 text-center p-6 h-full`}>
                    <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4">
                      <pillar.icon className="w-6 h-6 text-gray-800" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2 font-display">
                      {pillar.title}
                    </h4>
                    <p className="text-sm text-gray-700 font-medium leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium mb-6 font-display tracking-tight text-white">
                How We Create Impact
              </h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                Our transparent and efficient approach to transforming lives in Nigerian communities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Orphan Adoption & Support',
                  description: 'We connect generous donors to orphanages and individual orphans to provide food, healthcare, education, and emotional support. Your giving ensures every child knows they are not alone.',
                  icon: Target
                },
                {
                  step: '02',
                  title: 'Widow Empowerment',
                  description: 'We uplift widows through monthly stipends, food drives, counseling, and small business grants that restore dignity and financial stability.',
                  icon: DollarSign
                },
                {
                  step: '03',
                  title: 'Community Relief & Medical Outreach',
                  description: 'We identify struggling families and provide urgent supplies, medical aid, and support structures. Our open medical programs offer free health checkups and critical interventions.',
                  icon: TrendingUp
                }
              ].map((item, index) => {
                const stepGradientClasses = [
                  'professional-gradient-step1',
                  'professional-gradient-step2',
                  'professional-gradient-step3'
                ];
                return (
                  <div key={index} className={`relative ${stepGradientClasses[index]} p-8 h-full`}>
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <item.icon className="w-8 h-8 text-gray-800" />
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-gray-600 mb-2 font-sans tracking-wide uppercase">STEP {item.step}</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 font-display">{item.title}</h3>
                    <p className="text-gray-700 leading-relaxed font-medium text-sm">{item.description}</p>
                    {index < 2 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Beneficiary Showcase */}
        <BeneficiaryShowcase />

        {/* Impact Stats */}
        {stats && (
          <section className="py-24 bg-gray-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-display-md md:text-display-lg font-medium text-white mb-6 font-display tracking-tight">
                  Real Impact, Real Numbers
                </h2>
                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed">
                  Transparency is at the heart of everything we do. See the measurable impact your donations create.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                {[
                  { label: 'Total Donations', value: `$${stats.totalDonations?.toLocaleString() || '0'}` },
                  { label: 'Lives Impacted', value: stats.totalBeneficiaries?.toLocaleString() || '0' },
                  { label: 'Active Programs', value: stats.totalPrograms?.toLocaleString() || '0' },
                  { label: 'Volunteers', value: stats.totalVolunteers?.toLocaleString() || '0' },
                  { label: 'Partners', value: stats.totalPartnerships?.toLocaleString() || '0' }
                ].map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="text-4xl md:text-5xl font-medium text-white mb-3 group-hover:scale-110 transition-transform font-display tracking-tight">
                      {stat.value}
                    </div>
                    <div className="text-white/80 font-medium text-sm font-sans">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Impact Gallery */}
        <ImpactGallery />

        {/* Success Stories */}
        <SuccessStories />

        {/* Urgent Needs */}
        <UrgentNeeds onDonateClick={() => openDonationModal({
        source: 'urgent-needs',
        category: 'emergency',
        title: 'Help With Urgent Needs',
        description: 'Your immediate support can save lives in crisis situations'
      })} />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Trust Indicators */}
        <TrustIndicators />

        {/* Transparency Section */}
        <TransparencySection />

        {/* News & Updates */}
        <NewsUpdates />

        {/* Newsletter Signup */}
        <NewsletterSignup />

        {/* Sticky Donation Button */}
        <StickyDonationButton onDonateClick={() => openDonationModal({
        source: 'sticky-button',
        title: 'Quick Donation',
        description: 'Make a quick donation to support our mission'
      })} />

        {/* CTA Section */}
        <section className="py-24 bg-gray-900">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-display-md md:text-display-lg font-medium text-white mb-6 font-display tracking-tight">
              Join Our Mission
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Whether through donations, volunteering, or partnerships, there are many ways to help us transform lives across Nigeria.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => openDonationModal({
                  source: 'general',
                  title: 'Join Our Mission',
                  description: 'Help us transform lives across Nigeria through your generous donation'
                })}
                className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-medium text-base transition-colors shadow-glow hover:shadow-glow-lg font-sans"
              >
                Donate Today
              </button>
              <a
                href="/volunteer"
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-medium text-base transition-colors font-sans text-center"
              >
                Become a Volunteer
              </a>
            </div>
          </div>
        </section>
        </main>
      </ErrorBoundary>


    </>
  );
};

const Home: React.FC<HomeProps> = (props) => {
  return <HomeContent {...props} />;
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    // In a real app, fetch from Supabase here
    const stats: DashboardStats = {
      totalDonations: 2847592,
      totalDonors: 15673,
      totalBeneficiaries: 45821,
      totalPrograms: 127,
      totalVolunteers: 2834,
      totalPartnerships: 186,
      monthlyRevenue: 485632,
      monthlyExpenses: 421847,
      activeAdoptions: 8947,
      pendingGrants: 23,
    };

    return {
      props: {
        stats,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching stats:', error);

    return {
      props: {},
      revalidate: 300, // Retry in 5 minutes on error
    };
  }
};

export default Home;