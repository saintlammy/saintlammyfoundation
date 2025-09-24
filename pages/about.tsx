import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import { Heart, Users, Target, Award, MapPin, Calendar, Clock, Globe, Mail, Phone } from 'lucide-react';

const About: React.FC = () => {
  const teamMembers = [
    {
      name: 'Samuel Lammy',
      role: 'Founder & Executive Director',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
      bio: 'Passionate about empowering vulnerable communities with over 8 years of experience in community development and charity work.',
      linkedin: '#'
    },
    {
      name: 'Grace Adunola',
      role: 'Program Director',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
      bio: 'Leads our outreach programs with a heart for widows and orphans. Former social worker with 12+ years experience.',
      linkedin: '#'
    },
    {
      name: 'David Okafor',
      role: 'Operations Manager',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
      bio: 'Ensures efficient operations and transparency in all our programs. Background in nonprofit management and finance.',
      linkedin: '#'
    }
  ];

  const milestones = [
    { year: '2021', event: 'Saintlammy Foundation officially registered with CAC', icon: Award },
    { year: '2022', event: 'First orphanage adoption program launched', icon: Heart },
    { year: '2023', event: 'Reached 500+ widows and 300+ orphans supported', icon: Users },
    { year: '2024', event: 'Expanded to crypto donations and digital transparency', icon: Globe }
  ];

  const values = [
    {
      title: 'Transparency',
      description: 'Every donation is tracked and documented. We believe in complete financial transparency.',
      icon: Target
    },
    {
      title: 'Faith-Driven',
      description: 'Our work is guided by Christian values of love, compassion, and service to others.',
      icon: Heart
    },
    {
      title: 'Community Impact',
      description: 'We focus on sustainable solutions that empower communities for long-term growth.',
      icon: Users
    },
    {
      title: 'Accountability',
      description: 'Structured governance ensures responsible stewardship of resources and effective programs.',
      icon: Award
    }
  ];

  return (
    <>
      <Head>
        <title>About Us - Saintlammy Foundation</title>
        <meta name="description" content="Learn about Saintlammy Foundation's mission to empower widows, orphans, and vulnerable communities across Nigeria." />
      </Head>

      <Navigation />

      <main>
        {/* Hero Section */}
        <section className="relative py-32 bg-gray-900">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
              alt="Community gathering"
              fill
              className="object-cover object-center opacity-30"
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-medium text-white mb-6 font-display tracking-tight">
              About Our Mission
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed">
              Bringing hope, structure, and transformation to widows, orphans, and vulnerable communities across Nigeria.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-24 bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 md:p-12 border border-gray-700">
                <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-accent-400" />
                </div>
                <h2 className="text-3xl font-semibold text-white mb-6 font-display">Our Mission</h2>
                <p className="text-gray-300 text-lg font-light leading-relaxed mb-6">
                  To provide comprehensive support to widows, orphans, and vulnerable individuals across Nigeria through sustainable programs that address immediate needs while building long-term capacity for self-sufficiency.
                </p>
                <p className="text-gray-300 font-light leading-relaxed">
                  We believe that every person deserves dignity, hope, and the opportunity to thrive regardless of their circumstances.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 md:p-12 border border-gray-700">
                <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mb-6">
                  <Heart className="w-8 h-8 text-accent-400" />
                </div>
                <h2 className="text-3xl font-semibold text-white mb-6 font-display">Our Vision</h2>
                <p className="text-gray-300 text-lg font-light leading-relaxed mb-6">
                  A Nigeria where no widow is forgotten, no orphan is left behind, and no vulnerable home stands alone. We envision thriving communities where love, support, and opportunity are accessible to all.
                </p>
                <p className="text-gray-300 font-light leading-relaxed">
                  Through faith-driven action and sustainable solutions, we're building a future of hope and transformation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-24 bg-gray-900">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-white mb-6 font-display tracking-tight">
                Our Story
              </h2>
              <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed">
                From a vision to a movement - how Saintlammy Foundation began
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 md:p-12 border border-gray-700">
              <p className="text-gray-300 text-lg font-light leading-relaxed mb-6">
                Saintlammy Foundation was born from a deep conviction that every vulnerable person deserves dignity, support, and the opportunity to thrive. Founded in 2021 by Samuel Lammy, our organization emerged from years of grassroots community work and a growing recognition of the urgent needs facing widows and orphans across Nigeria.
              </p>
              <p className="text-gray-300 text-lg font-light leading-relaxed mb-6">
                What started as individual acts of kindness evolved into a structured organization committed to transparency, accountability, and measurable impact. We've embraced modern technology, including cryptocurrency donations and digital transparency tools, to ensure every contribution creates maximum positive change.
              </p>
              <p className="text-gray-300 text-lg font-light leading-relaxed">
                Today, we stand as a testament to what's possible when faith meets action, and when communities come together to lift up the most vulnerable among us. Our journey continues, guided by the belief that hope truly has a home.
              </p>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 bg-black">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-white mb-6 font-display tracking-tight">
                Our Journey
              </h2>
              <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed">
                Key milestones in our mission to transform lives
              </p>
            </div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center">
                      <milestone.icon className="w-8 h-8 text-accent-400" />
                    </div>
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-accent-400 font-semibold text-lg">{milestone.year}</span>
                      <div className="h-px bg-gray-600 flex-1"></div>
                    </div>
                    <p className="text-white text-lg font-medium">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 bg-gray-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-white mb-6 font-display tracking-tight">
                Our Values
              </h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                The principles that guide our work and define our character
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-accent-500 transition-colors">
                  <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center mb-6">
                    <value.icon className="w-6 h-6 text-accent-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 font-display">{value.title}</h3>
                  <p className="text-gray-300 font-light leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-24 bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-white mb-6 font-display tracking-tight">
                Meet Our Team
              </h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                Dedicated individuals working tirelessly to create positive change
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700 hover:border-accent-500 transition-colors group">
                  <div className="relative h-64">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2 font-display">{member.name}</h3>
                    <p className="text-accent-400 font-medium text-sm mb-4">{member.role}</p>
                    <p className="text-gray-300 text-sm font-light leading-relaxed mb-4">{member.bio}</p>
                    <a
                      href={member.linkedin}
                      className="inline-flex items-center text-accent-400 hover:text-accent-300 font-medium text-sm transition-colors"
                    >
                      Connect on LinkedIn
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gray-900">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-display-md md:text-display-lg font-medium text-white mb-6 font-display tracking-tight">
              Join Our Mission
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Be part of the transformation. Every action, every donation, every prayer makes a difference in the lives we serve.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-medium text-base transition-colors shadow-glow hover:shadow-glow-lg font-sans">
                Start Donating
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-medium text-base transition-colors font-sans">
                Become a Volunteer
              </button>
            </div>
          </div>
        </section>
      </main>

    </>
  );
};

export default About;