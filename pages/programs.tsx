import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { GraduationCap, Heart, Home, Users, Target, DollarSign, TrendingUp, Award, Loader } from 'lucide-react';
import { useDonationModal } from '@/components/DonationModalProvider';
import SEOHead from '@/components/SEOHead';
import { pageSEO } from '@/lib/seo';
import { truncateForCard } from '@/lib/textUtils';

interface Program {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  targetAudience?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ProgramStats {
  totalBeneficiaries: string;
  activePrograms: string;
  monthlyBudget: string;
  successRate: string;
}

const Programs: React.FC = () => {
  const { openDonationModal } = useDonationModal();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [stats, setStats] = useState<ProgramStats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch programs
        const programsResponse = await fetch('/api/programs?status=published');
        if (!programsResponse.ok) {
          throw new Error('Failed to fetch programs');
        }
        const programsData = await programsResponse.json();

        setPrograms(programsData);

        // Check if we have no programs at all
        if (!programsData || programsData.length === 0) {
          setFetchError('No programs available. Please add programs from the admin dashboard or run the seeding script.');
        } else {
          setFetchError(null);
        }

        // Fetch stats
        try {
          const statsResponse = await fetch('/api/programs/stats');
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            setStats(statsData);
          }
        } catch (statsErr) {
          console.error('Error fetching stats:', statsErr);
          // Stats fetch failed, will use fallback
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching programs:', err);
        setPrograms([]);
        setFetchError('Unable to connect to database. Please check your connection and try again.');
        setError('Failed to load programs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get icon for a program category
  const getIconForCategory = (category: string) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('education') || cat.includes('orphan')) return Heart;
    if (cat.includes('empowerment') || cat.includes('widow')) return Users;
    if (cat.includes('health')) return Heart;
    return GraduationCap;
  };

  // NOTE: No more hardcoded fallback programs!
  // All programs now come from the database.
  // Run: npx ts-node scripts/seed-example-programs.ts to populate initial data

  // Fallback stats if API fails
  const fallbackStats = {
    totalBeneficiaries: '2,450+',
    activePrograms: '8',
    monthlyBudget: '₦1.43M',
    successRate: '87%'
  };

  const currentStats = stats || fallbackStats;

  const programStats = [
    { label: 'Total Beneficiaries', value: currentStats.totalBeneficiaries, icon: Users },
    { label: 'Active Programs', value: currentStats.activePrograms, icon: Target },
    { label: 'Monthly Budget', value: currentStats.monthlyBudget, icon: DollarSign },
    { label: 'Success Rate', value: currentStats.successRate, icon: TrendingUp }
  ];

  return (
    <>
      <SEOHead config={pageSEO.programs} />

        {/* Notification Banner */}
        {fetchError && (
          <div className="bg-yellow-500/10 border-b border-yellow-500/20 py-3">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <p className="text-yellow-600 dark:text-yellow-400 text-sm text-center">
                {fetchError}
              </p>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative py-32 bg-gray-50 dark:bg-gray-900">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Educational program"
              fill
              className="object-cover object-center opacity-40"
            />
            <div className="absolute inset-0 bg-black/70"></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-medium text-white mb-6 font-display tracking-tight">
              Our Programs
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed">
              Comprehensive programs designed to create lasting impact in the lives of widows, orphans, and vulnerable communities.
            </p>
          </div>
        </section>

        {/* Program Stats */}
        <section className="py-24 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                Program Impact Overview
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                Real numbers showing the tangible difference our programs make every month
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {programStats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <stat.icon className="w-8 h-8 text-accent-400" />
                  </div>
                  <div className="text-3xl md:text-4xl font-medium text-accent-400 mb-2 group-hover:scale-110 transition-transform font-display tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium text-sm font-sans">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Programs */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                Core Programs
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                Our flagship programs addressing the most critical needs in our communities
              </p>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader className="w-8 h-8 animate-spin text-accent-500" />
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading programs...</span>
              </div>
            ) : programs.length > 0 ? (
              /* Programs List - All programs from database */
              <div className="space-y-16">
                {programs.map((program, index) => (
                <div key={program.id} className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-accent-500 transition-colors shadow-lg dark:shadow-none">
                  <div className={`md:flex ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="md:w-1/2 relative h-64 md:h-80">
                      <Image
                        src={program.image}
                        alt={program.title}
                        fill
                        className="object-cover object-center"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-xs font-medium">
                          {program.category}
                        </span>
                      </div>
                    </div>

                    <div className="md:w-1/2 p-8 md:p-12">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center mr-4">
                          {(() => {
                            const Icon = (program as any).icon || getIconForCategory((program as any).category || '');
                            return <Icon className="w-6 h-6 text-accent-400" />;
                          })()}
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white font-display">{program.title}</h3>
                          {(program as any).beneficiaries && (
                            <p className="text-accent-400 text-sm font-medium">{(program as any).beneficiaries} Beneficiaries</p>
                          )}
                          {program.targetAudience && (
                            <p className="text-accent-400 text-sm font-medium">For: {program.targetAudience}</p>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed mb-6">{truncateForCard(program.description, 3)}</p>

                      {/* Show features only for fallback programs */}
                      {(program as any).features && (
                        <div className="space-y-2 mb-6">
                          <h4 className="text-gray-900 dark:text-white font-semibold text-sm mb-3">Program Features:</h4>
                          {(program as any).features.map((feature: string, featureIndex: number) => (
                            <div key={featureIndex} className="flex items-start gap-2">
                              <div className="w-1 h-1 bg-accent-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-600 dark:text-gray-300 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Show impact stats only for fallback programs */}
                      {(program as any).impact && (
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          {Object.entries((program as any).impact).map(([key, value]) => (
                            <div key={key} className="text-center p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                              <div className="text-accent-400 font-semibold text-sm">{value as string}</div>
                              <div className="text-gray-500 dark:text-gray-400 text-xs">{key}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => openDonationModal({
                            source: 'programs-page',
                            category: program.title.toLowerCase().includes('education') ? 'education' :
                                     program.title.toLowerCase().includes('health') ? 'healthcare' :
                                     program.title.toLowerCase().includes('empowerment') ? 'empowerment' : 'general',
                            title: `Support ${program.title}`,
                            description: `Help us continue our ${program.title.toLowerCase()} program that transforms lives in Nigerian communities.`
                          })}
                          className="bg-accent-500 hover:bg-accent-600 text-white px-4 sm:px-6 py-3 rounded-full font-medium text-sm transition-colors font-sans"
                        >
                          Support This Program
                        </button>
                        <Link
                          href={`/contact?subject=Program Inquiry: ${encodeURIComponent(program.title)}`}
                          className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white border border-gray-300 dark:border-transparent px-4 sm:px-6 py-3 rounded-full font-medium text-sm transition-colors font-sans text-center inline-block"
                        >
                          Contact for Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            ) : (
              /* Empty State - No programs in database */
              <div className="text-center py-16">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Programs Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No programs have been added to the database.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Run <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">npx ts-node scripts/seed-example-programs.ts</code> to add example programs,<br />
                  or add programs from the admin dashboard.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* How Programs Work */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                How Our Programs Work
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                A systematic approach ensuring maximum impact and transparency
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  step: '01',
                  title: 'Needs Assessment',
                  description: 'We conduct thorough community assessments to identify the most pressing needs and eligible beneficiaries.'
                },
                {
                  step: '02',
                  title: 'Program Design',
                  description: 'Each program is carefully designed with clear objectives, timelines, and measurable success metrics.'
                },
                {
                  step: '03',
                  title: 'Implementation',
                  description: 'Programs are rolled out with dedicated teams, regular monitoring, and continuous support for beneficiaries.'
                },
                {
                  step: '04',
                  title: 'Impact Measurement',
                  description: 'We track progress, measure outcomes, and provide transparent reporting to all stakeholders and donors.'
                }
              ].map((item, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{item.step}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 font-display">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-white dark:bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
              Support Our Programs
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Your support makes these programs possible. Choose how you'd like to contribute to transforming lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => openDonationModal({
                  source: 'general',
                  title: 'Support Our Programs',
                  description: 'Help us continue running these transformative programs'
                })}
                className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-medium text-base transition-colors shadow-glow hover:shadow-glow-lg font-sans"
              >
                Donate Now
              </button>
              <Link
                href="/partner"
                className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white border border-gray-300 dark:border-transparent px-8 py-4 rounded-full font-medium text-base transition-colors font-sans text-center inline-block"
              >
                Become a Partner
              </Link>
            </div>
          </div>
        </section>
    </>
  );
};


// Enable ISR for better performance
export async function getStaticProps() {
  return {
    props: {},
    revalidate: 3600 // Revalidate every hour
  };
}

export default Programs;