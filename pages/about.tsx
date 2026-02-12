import React, { useState, useEffect } from 'react';
import SEOHead from '@/components/SEOHead';
import { pageSEO, generateStructuredData } from '@/lib/seo';
import Image from 'next/image';
import { Heart, Users, Target, Award, MapPin, Calendar, Clock, Globe, Mail, Phone } from 'lucide-react';
import { useDonationModal } from '@/components/DonationModalProvider';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  linkedin: string;
}

interface Milestone {
  year: string;
  event: string;
  icon: string;
}

interface Value {
  title: string;
  description: string;
  icon: string;
}

// Helper function to map icon names to components
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    Heart,
    Users,
    Target,
    Award,
    Globe,
    MapPin,
    Calendar,
    Clock,
    Mail,
    Phone
  };
  return iconMap[iconName] || Heart; // Fallback to Heart icon
};

const About: React.FC = () => {
  const { openDonationModal } = useDonationModal();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [values, setValues] = useState<Value[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [teamRes, milestonesRes, valuesRes] = await Promise.all([
          fetch('/api/page-content?slug=about&section=team'),
          fetch('/api/page-content?slug=about&section=milestones'),
          fetch('/api/page-content?slug=about&section=values')
        ]);

        const teamData = await teamRes.json();
        const milestonesData = await milestonesRes.json();
        const valuesData = await valuesRes.json();

        if (teamData && teamData.length > 0) {
          setTeamMembers(teamData.map((item: any) => item.data));
        }

        if (milestonesData && milestonesData.length > 0) {
          setMilestones(milestonesData.map((item: any) => item.data));
        }

        if (valuesData && valuesData.length > 0) {
          setValues(valuesData.map((item: any) => item.data));
        }
      } catch (error) {
        console.error('Error fetching page content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <>
      <SEOHead config={pageSEO.about} />

      <main>
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 md:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
              alt="Community gathering"
              fill
              className="object-cover object-center opacity-30"
            />
            <div className="absolute inset-0 bg-white/60 dark:bg-black/60"></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-medium text-gray-900 dark:text-white mb-4 sm:mb-6 font-display tracking-tight break-words">
              About Our Mission
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light leading-relaxed break-words">
              Bringing hope, structure, and transformation to widows, orphans, and vulnerable communities across Nigeria.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-12 sm:py-16 md:py-24 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-accent-400" />
                </div>
                <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6 font-display">Our Mission</h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg font-light leading-relaxed mb-6">
                  To provide comprehensive support to widows, orphans, and vulnerable individuals across Nigeria through sustainable programs that address immediate needs while building long-term capacity for self-sufficiency.
                </p>
                <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                  We believe that every person deserves dignity, hope, and the opportunity to thrive regardless of their circumstances.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mb-6">
                  <Heart className="w-8 h-8 text-accent-400" />
                </div>
                <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6 font-display">Our Vision</h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg font-light leading-relaxed mb-6">
                  A Nigeria where no widow is forgotten, no orphan is left behind, and no vulnerable home stands alone. We envision thriving communities where love, support, and opportunity are accessible to all.
                </p>
                <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                  Through faith-driven action and sustainable solutions, we're building a future of hope and transformation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-12 sm:py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-gray-900 dark:text-white mb-4 sm:mb-6 font-display tracking-tight break-words">
                Our Story
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 font-light leading-relaxed break-words">
                From a vision to a movement - how Saintlammy Foundation began
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg font-light leading-relaxed mb-6 break-words">
                Saintlammy Foundation was born from a deep conviction that every vulnerable person deserves dignity, support, and the opportunity to thrive. Founded in 2021 by Samuel Lammy, our organization emerged from years of grassroots community work and a growing recognition of the urgent needs facing widows and orphans across Nigeria.
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg font-light leading-relaxed mb-6 break-words">
                What started as individual acts of kindness evolved into a structured organization committed to transparency, accountability, and measurable impact. We've embraced modern technology, including cryptocurrency donations and digital transparency tools, to ensure every contribution creates maximum positive change.
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg font-light leading-relaxed mb-6 break-words">
                In November 2025, we achieved a significant milestone: official incorporation as <span className="font-medium text-gray-900 dark:text-white">Saintlammy Community Care Initiative</span> with the Corporate Affairs Commission of Nigeria (Registration No. 9015713, Tax ID: 33715150-0001). This formalization strengthens our capacity to serve and ensures long-term sustainability of our programs.
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg font-light leading-relaxed break-words">
                Today, we stand as a testament to what's possible when faith meets action, and when communities come together to lift up the most vulnerable among us. Our journey continues, guided by the belief that hope truly has a home.
              </p>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-12 sm:py-16 md:py-24 bg-white dark:bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                Our Journey
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                Key milestones in our mission to transform lives
              </p>
            </div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => {
                const IconComponent = getIconComponent(milestone.icon);
                return (
                  <div key={index} className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-accent-400" />
                      </div>
                    </div>
                    <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-accent-400 font-semibold text-lg">{milestone.year}</span>
                        <div className="h-px bg-gray-600 flex-1"></div>
                      </div>
                      <p className="text-gray-900 dark:text-white text-lg font-medium">{milestone.event}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                Our Values
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                The principles that guide our work and define our character
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const IconComponent = getIconComponent(value.icon);
                return (
                  <div key={index} className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-accent-500 transition-colors">
                    <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center mb-6">
                      <IconComponent className="w-6 h-6 text-accent-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 font-display">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                What People Say
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                Hear from those whose lives have been transformed through our work
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
              {[
                {
                  name: 'Mrs. Chinelo Okafor',
                  role: 'Widow Empowerment Program Beneficiary',
                  image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
                  quote: 'After my husband passed, I thought my life was over. Through Saintlammy Foundation\'s tailoring program, I now run my own business and can support my three children. They gave me hope when I had none.',
                  duration: '2 years in program'
                },
                {
                  name: 'Emmanuel Adebayo',
                  role: 'Educational Program Graduate',
                  image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
                  quote: 'I was an orphan with no hope of attending university. Thanks to Saintlammy Foundation\'s scholarship program, I\'m now studying engineering. They believed in me when no one else would.',
                  duration: 'Scholarship recipient since 2022'
                },
                {
                  name: 'Dr. Sarah Adunola',
                  role: 'Medical Volunteer',
                  image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
                  quote: 'Volunteering with Saintlammy Foundation has been the most rewarding experience of my medical career. The impact we make together in underserved communities is truly life-changing.',
                  duration: '3 years volunteering'
                },
                {
                  name: 'Pastor David Okon',
                  role: 'Community Partner',
                  image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
                  quote: 'Saintlammy Foundation\'s transparency and genuine commitment to helping others is exceptional. They are truly making a difference in our communities, one life at a time.',
                  duration: 'Partnership since 2021'
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-accent-500 transition-colors">
                  <div className="flex items-center mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white font-display">{testimonial.name}</h3>
                      <p className="text-sm text-accent-400 font-medium">{testimonial.role}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.duration}</p>
                    </div>
                  </div>

                  <blockquote className="text-gray-600 dark:text-gray-300 font-light leading-relaxed italic">
                    "{testimonial.quote}"
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                Meet Our Team
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                Dedicated individuals working tirelessly to create positive change
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-accent-500 transition-colors group">
                  <div className="relative h-64">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 font-display">{member.name}</h3>
                    <p className="text-accent-400 font-medium text-sm mb-4">{member.role}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm font-light leading-relaxed mb-4">{member.bio}</p>
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
        <section className="py-24 bg-white dark:bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
              Join Our Mission
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Be part of the transformation. Every action, every donation, every prayer makes a difference in the lives we serve.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => openDonationModal({
                  source: 'about-page',
                  title: 'Support Our Mission',
                  description: 'Help us continue transforming lives through education, healthcare, and empowerment programs.'
                })}
                className="bg-accent-500 hover:bg-accent-600 text-gray-900 dark:text-white px-8 py-4 rounded-full font-medium text-base transition-colors shadow-glow hover:shadow-glow-lg font-sans"
              >
                Start Donating
              </button>
              <a
                href="/volunteer"
                className="bg-white/10 hover:bg-white/20 text-gray-900 dark:text-white px-8 py-4 rounded-full font-medium text-base transition-colors font-sans text-center inline-block"
              >
                Become a Volunteer
              </a>
            </div>
          </div>
        </section>
      </main>
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

export default About;