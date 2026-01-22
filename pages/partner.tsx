import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useDonationModal } from '@/components/DonationModalProvider';
import {
  Users,
  Heart,
  Target,
  Handshake,
  Building,
  Globe,
  Award,
  TrendingUp,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Star
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { pageSEO } from '@/lib/seo';

const Partner: React.FC = () => {
  const { openDonationModal } = useDonationModal();

  return (
    <>
      <SEOHead config={pageSEO.partner} />

      <Navigation onDonateClick={() => openDonationModal({
        source: 'general',
        title: 'Support Our Partnership Programs',
        description: 'Help us build more strategic partnerships for greater impact'
      })} />

      <ErrorBoundary>
        <main className="min-h-screen bg-gray-900 pt-16">
          {/* Hero Section */}
          <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <h1 className="text-4xl md:text-6xl font-medium text-white mb-8 font-display tracking-tight">
                Partner With Us
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
                Join forces with Saintlammy Foundation to amplify your social impact and create lasting change for orphans, widows, and vulnerable communities across Nigeria.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => openDonationModal({
                    source: 'general',
                    title: 'Support Partnership Development',
                    description: 'Help us build capacity for more strategic partnerships'
                  })}
                  className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-medium text-base transition-colors"
                >
                  Support Our Work
                </button>
                <a
                  href="#contact"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-medium text-base transition-colors"
                >
                  Get In Touch
                </a>
              </div>
            </div>
          </section>

          {/* Partnership Types */}
          <section className="py-20 bg-gray-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-4 py-2 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium mb-4">
                  Partnership Types
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-display">
                  Partnership Opportunities
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto font-light">
                  We offer various partnership models to match your organization's capacity, interests, and impact goals.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Corporate Partnerships */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-xl mb-6">
                    <Building className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 font-display">
                    Corporate Partnerships
                  </h3>
                  <p className="text-gray-300 mb-6 font-light leading-relaxed">
                    Partner with us for CSR initiatives, employee engagement programs, and sustainable community development projects.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      Annual CSR programs
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      Employee volunteer opportunities
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      Brand alignment initiatives
                    </li>
                  </ul>
                </div>

                {/* NGO Collaborations */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300">
                  <div className="flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-xl mb-6">
                    <Handshake className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 font-display">
                    NGO Collaborations
                  </h3>
                  <p className="text-gray-300 mb-6 font-light leading-relaxed">
                    Collaborate with fellow nonprofits to maximize impact through shared resources, expertise, and coordinated efforts.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      Joint program implementation
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      Resource sharing agreements
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      Knowledge exchange programs
                    </li>
                  </ul>
                </div>

                {/* Individual Partnerships */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300">
                  <div className="flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-xl mb-6">
                    <Users className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 font-display">
                    Individual Partnerships
                  </h3>
                  <p className="text-gray-300 mb-6 font-light leading-relaxed">
                    Join as an individual partner to contribute your skills, time, or resources to specific programs and initiatives.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      Skill-based volunteering
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      Mentorship programs
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      Professional consultation
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Partnership Benefits */}
          <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-500/5 to-transparent"></div>
            <div className="relative max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-accent-500/20 to-blue-500/20 text-accent-400 rounded-full text-sm font-medium mb-4">
                  Partnership Benefits
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-display">
                  Why Partner With Us?
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto font-light">
                  Partnering with Saintlammy Foundation offers mutual benefits and creates meaningful impact for your organization and the communities we serve.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-accent-500/20 rounded-lg">
                      <Target className="w-6 h-6 text-accent-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Measurable Impact</h3>
                      <p className="text-gray-300 font-light">Track and measure the direct impact of your partnership through detailed reporting and success metrics.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-accent-500/20 rounded-lg">
                      <Globe className="w-6 h-6 text-accent-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Brand Visibility</h3>
                      <p className="text-gray-300 font-light">Gain positive brand exposure through our communications, events, and community engagement activities.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-accent-500/20 rounded-lg">
                      <Award className="w-6 h-6 text-accent-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Recognition & Awards</h3>
                      <p className="text-gray-300 font-light">Receive recognition for your social impact contributions and partnership commitment.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-accent-500/20 rounded-lg">
                      <Users className="w-6 h-6 text-accent-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Team Building</h3>
                      <p className="text-gray-300 font-light">Engage your team in meaningful volunteer activities that build camaraderie and purpose.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-accent-500/20 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-accent-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Strategic Growth</h3>
                      <p className="text-gray-300 font-light">Align your business goals with social impact for sustainable growth and stakeholder value.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-accent-500/20 rounded-lg">
                      <Heart className="w-6 h-6 text-accent-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Community Connection</h3>
                      <p className="text-gray-300 font-light">Build authentic connections with the communities you serve and create lasting relationships.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>


          {/* Partnership Process */}
          <section className="py-20 bg-gray-800">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-4">
                  Getting Started
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-display">
                  How to Partner
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto font-light">
                  Starting a partnership with us is simple. Follow these steps to begin making an impact together.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-accent-500/20 rounded-full mx-auto mb-6">
                    <span className="text-2xl font-bold text-accent-400">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 font-display">Initial Contact</h3>
                  <p className="text-gray-300 font-light">
                    Reach out to us with your partnership interests and we'll schedule an initial consultation to discuss opportunities.
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-accent-500/20 rounded-full mx-auto mb-6">
                    <span className="text-2xl font-bold text-accent-400">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 font-display">Partnership Design</h3>
                  <p className="text-gray-300 font-light">
                    We'll work together to design a partnership that aligns with your goals and maximizes impact for our beneficiaries.
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-accent-500/20 rounded-full mx-auto mb-6">
                    <span className="text-2xl font-bold text-accent-400">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 font-display">Launch & Impact</h3>
                  <p className="text-gray-300 font-light">
                    Launch your partnership with ongoing support, regular updates, and impact measurement throughout our collaboration.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-accent-500/5 to-transparent"></div>
            <div className="relative max-w-4xl mx-auto px-6">
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium mb-4">
                  Get In Touch
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-display">
                  Ready to Partner?
                </h2>
                <p className="text-lg text-gray-300 font-light">
                  Let's discuss how we can work together to create meaningful impact.
                </p>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-6 font-display">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-accent-500/20 rounded-lg">
                          <Mail className="w-5 h-5 text-accent-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="text-white">partnerships@saintlammyfoundation.org</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-accent-500/20 rounded-lg">
                          <Phone className="w-5 h-5 text-accent-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Phone</p>
                          <p className="text-white">+234 706 307 6704</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-accent-500/20 rounded-lg">
                          <MapPin className="w-5 h-5 text-accent-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Location</p>
                          <p className="text-white">Lagos, Nigeria</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-6 font-display">Partnership Coordinator</h3>
                    <div className="bg-gray-700/30 rounded-xl p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-accent-500/20 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-accent-400" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-white">Partnership Team</h4>
                          <p className="text-sm text-gray-400">Strategic Partnerships</p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm font-light mb-4">
                        Our dedicated partnership team will work with you to create meaningful collaborations that drive impact.
                      </p>
                      <Link
                        href="/partnership-team"
                        className="inline-flex items-center text-accent-400 hover:text-accent-300 font-medium text-sm transition-colors"
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </ErrorBoundary>
    </>
  );
};


export default Partner;