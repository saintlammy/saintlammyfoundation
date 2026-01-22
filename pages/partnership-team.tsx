import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import Navigation from '@/components/Navigation';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useDonationModal } from '@/components/DonationModalProvider';
import { getTeamMembers, getPartnershipProcess, submitPartnershipApplication, TeamMember, PartnershipProcess } from '@/lib/contentService';
import {
  Users,
  Heart,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle,
  Clock,
  Calendar,
  FileText,
  MessageCircle,
  Building,
  Globe,
  Handshake,
  Target,
  Send
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { pageSEO } from '@/lib/seo';

interface PartnershipTeamProps {
  teamMembers: TeamMember[];
  partnershipProcess: PartnershipProcess[];
}

const PartnershipTeamContent: React.FC<PartnershipTeamProps> = ({ teamMembers, partnershipProcess }) => {
  const { openDonationModal } = useDonationModal();
  const [formData, setFormData] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    organizationType: '',
    partnershipType: '',
    message: '',
    timeline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitPartnershipApplication(formData);
      if (result.success) {
        alert(result.message);
        // Reset form
        setFormData({
          organizationName: '',
          contactName: '',
          email: '',
          phone: '',
          organizationType: '',
          partnershipType: '',
          message: '',
          timeline: ''
        });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('An error occurred while submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProcessIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageCircle': return MessageCircle;
      case 'FileText': return FileText;
      case 'Handshake': return Handshake;
      case 'Target': return Target;
      default: return MessageCircle;
    }
  };

  return (
    <>
      <SEOHead config={pageSEO.partnershipTeam} />

      <Navigation onDonateClick={() => openDonationModal({
        source: 'general',
        title: 'Support Partnership Development',
        description: 'Help us build capacity for strategic partnerships'
      })} />

      <ErrorBoundary>
        <main className="min-h-screen bg-gray-900 pt-16">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium mb-6">
                Partnership Team
              </div>
              <h1 className="text-4xl md:text-6xl font-medium text-white mb-8 font-display tracking-tight">
                Let's Build Something Together
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 font-light leading-relaxed">
                Our dedicated partnership team is here to help you create meaningful collaborations that amplify impact for vulnerable communities across Nigeria.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#contact-form"
                  className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-medium text-base transition-colors"
                >
                  Start Partnership Discussion
                </a>
                <Link
                  href="/partner"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-medium text-base transition-colors"
                >
                  View Partnership Options
                </Link>
              </div>
            </div>
          </section>

          {/* Team Members */}
          <section className="py-20 bg-gray-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium mb-4">
                  Our Team
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-display">
                  Meet Your Partnership Team
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto font-light">
                  Experienced professionals dedicated to creating successful partnerships and maximizing social impact.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                  <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300">
                    <div className="flex items-center justify-center w-16 h-16 bg-accent-500/20 rounded-full mx-auto mb-6">
                      <Users className="w-8 h-8 text-accent-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 font-display text-center">
                      {member.name}
                    </h3>
                    <p className="text-accent-400 text-center mb-4 font-medium">
                      {member.role}
                    </p>
                    <p className="text-gray-300 text-sm mb-4 text-center">
                      {member.expertise}
                    </p>
                    <p className="text-gray-400 text-xs mb-6 text-center">
                      {member.experience}
                    </p>
                    <div className="space-y-2">
                      <h4 className="text-white font-medium text-sm mb-3">Focus Areas:</h4>
                      {member.focus.map((area, focusIndex) => (
                        <div key={focusIndex} className="flex items-center text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                          {area}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Partnership Process */}
          <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-4">
                  Our Process
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-display">
                  How We Work With Partners
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto font-light">
                  Our structured approach ensures successful partnerships that create lasting impact for all involved.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {partnershipProcess.map((process, index) => {
                  const IconComponent = getProcessIcon(process.icon);
                  return (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center w-16 h-16 bg-accent-500/20 rounded-full mx-auto mb-6">
                        <IconComponent className="w-8 h-8 text-accent-400" />
                      </div>
                    <div className="bg-gray-800/30 rounded-xl p-6">
                      <div className="text-2xl font-bold text-accent-400 mb-2">
                        {process.step}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 font-display">
                        {process.title}
                      </h3>
                      <div className="flex items-center justify-center text-sm text-gray-400 mb-4">
                        <Clock className="w-4 h-4 mr-1" />
                        {process.duration}
                      </div>
                      <p className="text-gray-300 text-sm font-light">
                        {process.description}
                      </p>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section id="contact-form" className="py-20 bg-gray-800">
            <div className="max-w-4xl mx-auto px-6">
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-2 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium mb-4">
                  Get Started
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-display">
                  Start Your Partnership Journey
                </h2>
                <p className="text-lg text-gray-300 font-light">
                  Fill out this form and our partnership team will reach out within 48 hours.
                </p>
              </div>

              <div className="bg-gray-700/30 rounded-2xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Organization Name *
                      </label>
                      <input
                        type="text"
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
                        placeholder="Your organization name"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
                        placeholder="contact@yourorganization.com"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
                        placeholder="+234 706 307 6704"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        Organization Type *
                      </label>
                      <select
                        name="organizationType"
                        value={formData.organizationType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                      >
                        <option value="">Select organization type</option>
                        <option value="corporation">Corporation</option>
                        <option value="ngo">NGO/Nonprofit</option>
                        <option value="government">Government Agency</option>
                        <option value="foundation">Foundation</option>
                        <option value="individual">Individual</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        Partnership Interest *
                      </label>
                      <select
                        name="partnershipType"
                        value={formData.partnershipType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                      >
                        <option value="">Select partnership type</option>
                        <option value="corporate-csr">Corporate CSR</option>
                        <option value="program-collaboration">Program Collaboration</option>
                        <option value="funding">Funding Partnership</option>
                        <option value="resource-sharing">Resource Sharing</option>
                        <option value="volunteer">Volunteer Partnership</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Preferred Timeline
                    </label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                    >
                      <option value="">Select timeline</option>
                      <option value="immediate">Immediate (within 1 month)</option>
                      <option value="short-term">Short-term (1-3 months)</option>
                      <option value="medium-term">Medium-term (3-6 months)</option>
                      <option value="long-term">Long-term (6+ months)</option>
                      <option value="exploratory">Exploratory (just exploring options)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Tell us about your partnership interests and goals *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
                      placeholder="Please describe your organization's mission, what type of partnership you're interested in, and how you envision working together with Saintlammy Foundation..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-4 rounded-full font-medium text-base transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Partnership Application'}</span>
                  </button>

                  <p className="text-gray-400 text-sm text-center">
                    Our team will review your application and get back to you within 48 hours.
                  </p>
                </form>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="py-20 bg-gray-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-6 font-display">
                  Direct Contact Information
                </h2>
                <p className="text-lg text-gray-300 font-light">
                  Prefer to reach out directly? Here's how to contact our partnership team.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mx-auto mb-6">
                    <Mail className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 font-display">
                    Email Us
                  </h3>
                  <p className="text-gray-300 mb-4">
                    partnerships@saintlammyfoundation.org
                  </p>
                  <p className="text-gray-400 text-sm">
                    Response within 24-48 hours
                  </p>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mx-auto mb-6">
                    <Phone className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 font-display">
                    Call Us
                  </h3>
                  <p className="text-gray-300 mb-4">
                    +234 706 307 6704
                  </p>
                  <p className="text-gray-400 text-sm">
                    Mon-Fri, 9 AM - 5 PM WAT
                  </p>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mx-auto mb-6">
                    <Calendar className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 font-display">
                    Schedule Meeting
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Book a consultation call
                  </p>
                  <button
                    onClick={() => openDonationModal({
                      source: 'general',
                      title: 'Schedule Partnership Meeting',
                      description: 'Book a consultation with our partnership team'
                    })}
                    className="text-accent-400 hover:text-accent-300 font-medium text-sm transition-colors inline-flex items-center"
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </ErrorBoundary>
    </>
  );
};

const PartnershipTeam: React.FC<PartnershipTeamProps> = (props) => {
  return <PartnershipTeamContent {...props} />;
};

export const getStaticProps: GetStaticProps<PartnershipTeamProps> = async () => {
  try {
    const [teamMembers, partnershipProcess] = await Promise.all([
      getTeamMembers(),
      getPartnershipProcess()
    ]);

    return {
      props: {
        teamMembers,
        partnershipProcess
      },
      revalidate: 3600 // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching partnership team data:', error);

    // Return fallback data
    return {
      props: {
        teamMembers: [],
        partnershipProcess: []
      },
      revalidate: 300 // Retry more frequently on error
    };
  }
};

export default PartnershipTeam;