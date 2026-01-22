import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Users, Heart, Target, Clock, ChevronRight } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { pageSEO } from '@/lib/seo';

const Outreaches: React.FC = () => {
  const [pastOutreaches, setPastOutreaches] = useState<any[]>([]);
  const [upcomingOutreaches, setUpcomingOutreaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    loadOutreaches();
  }, []);

  const loadOutreaches = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/outreaches?status=all');

      if (response.ok) {
        const data = await response.json();

        // Debug: Log outreach data
        console.log('🔍 Outreaches loaded:', data.length);
        console.log('📊 Status breakdown:',  data.reduce((acc: any, o: any) => {
          acc[o.status] = (acc[o.status] || 0) + 1;
          return acc;
        }, {}));

        data.forEach((o: any) => {
          console.log(`📸 ${o.title}:`, {
            status: o.status,
            hasImage: !!o.image,
            hasFeaturedImage: !!o.featured_image,
            imageType: o.image ? (o.image.startsWith('data:') ? 'base64' : 'URL') : 'none',
            imageLength: o.image?.length || 0
          });
        });

        // Separate into past and upcoming
        // Note: 'published' outreaches are shown in past section by default
        // To make them upcoming, set status to 'upcoming' or 'ongoing' in admin
        const past = data.filter((o: any) => o.status === 'completed' || o.status === 'published');
        const upcoming = data.filter((o: any) => o.status === 'upcoming' || o.status === 'ongoing');

        console.log(`✅ Past outreaches: ${past.length}, Upcoming: ${upcoming.length}`);

        // Use database data
        setPastOutreaches(past);
        setUpcomingOutreaches(upcoming);

        // Show notification if database is empty
        if (data.length === 0) {
          setFetchError('No outreaches available. Please add outreaches from the admin dashboard or run the seeding script.');
        } else {
          setFetchError(null);
        }
      } else {
        // API error
        setPastOutreaches([]);
        setUpcomingOutreaches([]);
        setFetchError('Unable to connect to database. Please check your connection and try again.');
      }
    } catch (error) {
      console.error('Error loading outreaches:', error);
      setPastOutreaches([]);
      setUpcomingOutreaches([]);
      setFetchError('Unable to connect to database. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // NOTE: No more hardcoded fallback outreaches!
  // All outreaches now come from the database.
  // Run: npx tsx scripts/seed-example-outreaches.ts to populate initial data

  const outreachCategories = [
    {
      title: 'Medical Outreaches',
      description: 'Free healthcare services, medical check-ups, and health education',
      icon: Heart,
      count: 12
    },
    {
      title: 'Educational Support',
      description: 'School supplies, uniforms, and educational materials distribution',
      icon: Target,
      count: 8
    },
    {
      title: 'Feeding Programs',
      description: 'Hot meals, food packages, and nutrition support for vulnerable families',
      icon: Users,
      count: 15
    },
    {
      title: 'Skills Training',
      description: 'Empowerment workshops and vocational training for widows and youth',
      icon: Clock,
      count: 6
    }
  ];

  return (
    <>
      <SEOHead config={pageSEO.outreaches} />

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
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Community outreach program"
              fill
              className="object-cover object-center opacity-30"
            />
            <div className="absolute inset-0 bg-white/60 dark:bg-black/60"></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
              Community Outreaches
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light leading-relaxed">
              Bringing hope, healing, and support directly to communities across Nigeria through targeted outreach programs.
            </p>
          </div>
        </section>

        {/* Outreach Categories */}
        <section className="py-24 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                Our Outreach Focus Areas
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                Comprehensive programs addressing the most critical needs in our communities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {outreachCategories.map((category, index) => (
                <div key={index} className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-accent-500 transition-colors shadow-lg dark:shadow-none text-center group">
                  <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <category.icon className="w-8 h-8 text-accent-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-display">{category.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-light mb-4">{category.description}</p>
                  <div className="inline-flex items-center px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-xs font-medium">
                    {category.count} Programs
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Outreaches */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                Upcoming Outreaches
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                Join us in making a difference. Register to volunteer or stay updated on our upcoming programs.
              </p>
            </div>

            <div className="space-y-8">
              {upcomingOutreaches.map((outreach, index) => (
                <div key={outreach.id} className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-accent-500 transition-colors shadow-lg dark:shadow-none">
                  <div className="md:flex">
                    <div className="md:w-1/3 relative h-64 md:h-auto bg-gray-200 dark:bg-gray-700">
                      {outreach.image || outreach.featured_image ? (
                        (outreach.image || outreach.featured_image).startsWith('data:') ? (
                          <img
                            src={outreach.image || outreach.featured_image}
                            alt={outreach.title}
                            className="w-full h-full object-cover object-center"
                          />
                        ) : (
                          <Image
                            src={outreach.image || outreach.featured_image}
                            alt={outreach.title}
                            fill
                            className="object-cover object-center"
                          />
                        )
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Heart className="w-20 h-20 text-gray-400 dark:text-gray-600" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium text-gray-900 dark:text-white ${
                          outreach.status === 'upcoming' ? 'bg-green-500' :
                          outreach.status === 'ongoing' ? 'bg-yellow-500' :
                          'bg-accent-500'
                        }`}>
                          {outreach.status}
                        </span>
                      </div>
                    </div>

                    <div className="md:w-2/3 p-8">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 font-display">{outreach.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed mb-6">{outreach.description}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Calendar className="w-4 h-4 mr-2 text-accent-400" />
                          {outreach.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Clock className="w-4 h-4 mr-2 text-accent-400" />
                          {outreach.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <MapPin className="w-4 h-4 mr-2 text-accent-400" />
                          {outreach.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Users className="w-4 h-4 mr-2 text-accent-400" />
                          {outreach.targetBeneficiaries} Beneficiaries
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                          href="/volunteer"
                          className="bg-accent-500 hover:bg-accent-600 text-gray-900 dark:text-white px-4 sm:px-6 py-3 rounded-full font-medium text-sm transition-colors font-sans text-center inline-block"
                        >
                          Register to Volunteer
                        </Link>
                        <Link
                          href={`/contact?subject=Outreach: ${encodeURIComponent(outreach.title)}`}
                          className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white border border-gray-300 dark:border-transparent px-4 sm:px-6 py-3 rounded-full font-medium text-sm transition-colors font-sans text-center inline-block"
                        >
                          Contact for Details
                        </Link>
                      </div>

                      {outreach.volunteersNeeded && (
                        <p className="text-xs text-accent-400 mt-3">
                          {outreach.volunteersNeeded} volunteers needed
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Past Outreaches */}
        <section className="py-24 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                Past Outreaches & Impact
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                See the real impact of our community outreach programs and the lives we've touched together.
              </p>
            </div>

            {pastOutreaches.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No past outreaches available yet.
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                  Check back soon for updates on our completed programs!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {pastOutreaches.map((outreach) => (
                <div key={outreach.id} className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-accent-500 transition-colors shadow-lg dark:shadow-none group">
                  <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                    {outreach.image || outreach.featured_image ? (
                      (outreach.image || outreach.featured_image).startsWith('data:') ? (
                        <img
                          src={outreach.image || outreach.featured_image}
                          alt={outreach.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Image
                          src={outreach.image || outreach.featured_image}
                          alt={outreach.title}
                          fill
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      )
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Heart className="w-16 h-16 text-gray-400 dark:text-gray-600" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-accent-400 text-sm font-medium">{outreach.date}</span>
                      <div className="h-1 w-1 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">{outreach.location}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 font-display">{outreach.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm font-light leading-relaxed mb-4">{outreach.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">People Reached</span>
                        <span className="text-accent-400 font-semibold">{outreach.beneficiaries}</span>
                      </div>
                    </div>

                    {outreach.impact && outreach.impact.length > 0 && (
                      <div className="space-y-1 mb-4">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Impact Highlights:</h4>
                        {outreach.impact.map((item: any, index: number) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-accent-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-xs text-gray-600 dark:text-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <Link
                      href={`/outreach/${outreach.id}`}
                      className="inline-flex items-center text-accent-400 hover:text-accent-300 font-medium text-sm transition-colors group"
                    >
                      View Full Report
                      <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
              Join Our Next Outreach
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Be part of the change. Volunteer with us and help bring hope and healing to communities across Nigeria.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/volunteer"
                className="bg-accent-500 hover:bg-accent-600 text-gray-900 dark:text-white px-8 py-4 rounded-full font-medium text-base transition-colors shadow-glow hover:shadow-glow-lg font-sans text-center inline-block"
              >
                Volunteer With Us
              </Link>
              <Link
                href="/contact"
                className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white border border-gray-300 dark:border-transparent px-8 py-4 rounded-full font-medium text-base transition-colors font-sans text-center inline-block"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
    </>
  );
};

export default Outreaches;