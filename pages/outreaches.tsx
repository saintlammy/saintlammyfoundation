import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Users, Heart, Target, Clock, ChevronRight } from 'lucide-react';

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

        // Separate into past and upcoming
        const past = data.filter((o: any) => o.status === 'completed');
        const upcoming = data.filter((o: any) => o.status === 'upcoming' || o.status === 'ongoing');

        // Only use database data if we got real outreaches
        if (data && data.length > 0) {
          setPastOutreaches(past.length > 0 ? past : getDefaultPastOutreaches());
          setUpcomingOutreaches(upcoming.length > 0 ? upcoming : getDefaultUpcomingOutreaches());
          setFetchError(null);
        } else {
          // Empty database - use examples and show notification
          setPastOutreaches(getDefaultPastOutreaches());
          setUpcomingOutreaches(getDefaultUpcomingOutreaches());
          setFetchError('Using example outreaches. Check back later for real community outreach programs.');
        }
      } else {
        // API error - use defaults and show notification
        setPastOutreaches(getDefaultPastOutreaches());
        setUpcomingOutreaches(getDefaultUpcomingOutreaches());
        setFetchError('Using example outreaches. Check back later for real community outreach programs.');
      }
    } catch (error) {
      console.error('Error loading outreaches:', error);
      setPastOutreaches(getDefaultPastOutreaches());
      setUpcomingOutreaches(getDefaultUpcomingOutreaches());
      setFetchError('Using example outreaches. Check back later for real community outreach programs.');
    } finally {
      setLoading(false);
    }
  };

  const getDefaultUpcomingOutreaches = () => [
    {
      id: 1,
      title: 'Christmas Feeding Program',
      date: 'December 22, 2024',
      time: '10:00 AM - 4:00 PM',
      location: 'Mushin Community Center, Lagos',
      description: 'Annual Christmas feeding program for 500+ families in Mushin area. Hot meals, gift packages, and medical check-ups.',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      targetBeneficiaries: 500,
      volunteersNeeded: 25,
      status: 'Registration Open'
    },
    {
      id: 2,
      title: 'Educational Materials Distribution',
      date: 'January 15, 2025',
      time: '9:00 AM - 2:00 PM',
      location: 'Hope Children Home, Abuja',
      description: 'Distribution of school bags, books, uniforms, and educational materials to 200 children across 5 orphanages.',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      targetBeneficiaries: 200,
      volunteersNeeded: 15,
      status: 'Planning Phase'
    },
    {
      id: 3,
      title: 'Widow Empowerment Workshop',
      date: 'February 8, 2025',
      time: '11:00 AM - 5:00 PM',
      location: 'Community Hall, Port Harcourt',
      description: 'Skills training workshop for widows including tailoring, soap making, and small business management.',
      image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      targetBeneficiaries: 75,
      volunteersNeeded: 12,
      status: 'Registration Soon'
    }
  ];

  const getDefaultPastOutreaches = () => [
    {
      id: 4,
      title: 'Independence Day Medical Outreach',
      date: 'October 1, 2024',
      location: 'Ikeja, Lagos',
      beneficiaries: 450,
      description: 'Free medical check-ups, medications, and health education for underserved communities.',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      impact: ['450 people received medical care', '200 medications distributed', '50 referrals to specialists']
    },
    {
      id: 5,
      title: 'Back-to-School Support',
      date: 'September 12, 2024',
      location: 'Multiple Locations',
      beneficiaries: 320,
      description: 'School supplies and uniforms distribution for children from vulnerable families.',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      impact: ['320 children received school supplies', '150 uniforms distributed', '8 schools supported']
    },
    {
      id: 6,
      title: 'Clean Water Initiative',
      date: 'August 20, 2024',
      location: 'Rural Kogi State',
      beneficiaries: 600,
      description: 'Installation of water pumps and distribution of water purification tablets.',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      impact: ['3 water pumps installed', '600 people gained access to clean water', '1200 purification tablets distributed']
    }
  ];

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
      <Head>
        <title>Outreaches - Saintlammy Foundation</title>
        <meta name="description" content="Join Saintlammy Foundation's community outreaches. Medical care, educational support, feeding programs, and skills training across Nigeria." />
      </Head>

        {/* Notification Banner */}
        {fetchError && (
          <div className="bg-yellow-500/10 border-b border-yellow-500/20 py-3">
            <div className="max-w-7xl mx-auto px-6">
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

          <div className="relative max-w-4xl mx-auto px-6 text-center">
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
          <div className="max-w-7xl mx-auto px-6">
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
          <div className="max-w-7xl mx-auto px-6">
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
                    <div className="md:w-1/3 relative h-64 md:h-auto">
                      <Image
                        src={outreach.image}
                        alt={outreach.title}
                        fill
                        className="object-cover object-center"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium text-gray-900 dark:text-white ${
                          outreach.status === 'Registration Open' ? 'bg-green-500' :
                          outreach.status === 'Planning Phase' ? 'bg-yellow-500' :
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
                        <a
                          href="/volunteer"
                          className="bg-accent-500 hover:bg-accent-600 text-gray-900 dark:text-white px-6 py-3 rounded-full font-medium text-sm transition-colors font-sans text-center inline-block"
                        >
                          Register to Volunteer
                        </a>
                        <a
                          href="#outreach-details"
                          onClick={(e) => {
                            e.preventDefault();
                            const element = e.currentTarget.closest('.bg-white, .bg-gray-800\\/50');
                            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }}
                          className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white border border-gray-300 dark:border-transparent px-6 py-3 rounded-full font-medium text-sm transition-colors font-sans text-center inline-block"
                        >
                          Learn More
                        </a>
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
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                Past Outreaches & Impact
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                See the real impact of our community outreach programs and the lives we've touched together.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pastOutreaches.map((outreach) => (
                <div key={outreach.id} className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-accent-500 transition-colors shadow-lg dark:shadow-none group">
                  <div className="relative h-48">
                    <Image
                      src={outreach.image}
                      alt={outreach.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
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
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
              Join Our Next Outreach
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Be part of the change. Volunteer with us and help bring hope and healing to communities across Nigeria.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/volunteer"
                className="bg-accent-500 hover:bg-accent-600 text-gray-900 dark:text-white px-8 py-4 rounded-full font-medium text-base transition-colors shadow-glow hover:shadow-glow-lg font-sans text-center inline-block"
              >
                Volunteer With Us
              </a>
              <a
                href="/news"
                className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white border border-gray-300 dark:border-transparent px-8 py-4 rounded-full font-medium text-base transition-colors font-sans text-center inline-block"
              >
                Subscribe to Updates
              </a>
            </div>
          </div>
        </section>
    </>
  );
};

export default Outreaches;