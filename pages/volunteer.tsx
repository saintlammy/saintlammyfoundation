import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Heart, Users, Clock, MapPin, Send, Star, CheckCircle, Calendar, Briefcase } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { pageSEO } from '@/lib/seo';

interface VolunteerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  interests: string[];
  availability: string;
  experience: string;
  motivation: string;
  skills: string;
  backgroundCheck: boolean;
  commitment: string;
}

interface VolunteerRole {
  id: string;
  title: string;
  description: string;
  required_skills: string[];
  time_commitment: string;
  location: string;
  spots_available: number | null;
  category: string;
}

const Volunteer: React.FC = () => {
  const [formData, setFormData] = useState<VolunteerFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    interests: [],
    availability: '',
    experience: '',
    motivation: '',
    skills: '',
    backgroundCheck: false,
    commitment: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [volunteerOpportunities, setVolunteerOpportunities] = useState<VolunteerRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  // Fetch volunteer opportunities from API
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch('/api/public/volunteer-roles');
        if (response.ok) {
          const roles = await response.json();
          setVolunteerOpportunities(roles);
        }
      } catch (error) {
        console.error('Error fetching volunteer roles:', error);
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchOpportunities();
  }, []);

  const volunteerBenefits = [
    {
      title: 'Make Real Impact',
      description: 'See the direct positive change your efforts create in communities',
      icon: Heart
    },
    {
      title: 'Skill Development',
      description: 'Gain new skills and experience in nonprofit work and community development',
      icon: Star
    },
    {
      title: 'Network Building',
      description: 'Connect with like-minded individuals passionate about social change',
      icon: Users
    },
    {
      title: 'Recognition',
      description: 'Receive certificates and recognition for your volunteer contributions',
      icon: CheckCircle
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Submission failed. Please try again.');
      }

      setIsSubmitted(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        interests: [],
        availability: '',
        experience: '',
        motivation: '',
        skills: '',
        backgroundCheck: false,
        commitment: ''
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleInterestChange = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  // Derive interests dynamically from volunteer roles
  const interests = Array.from(new Set([
    ...volunteerOpportunities.map(role => role.title),
    'Administrative Support',
    'Fundraising',
    'Social Media',
    'Photography/Videography'
  ]));

  return (
    <>
      <Head>
        <title>Volunteer - Saintlammy Foundation</title>
        <meta name="description" content="Join Saintlammy Foundation as a volunteer. Make a difference in the lives of widows, orphans, and vulnerable communities across Nigeria." />
      </Head>
        {/* Hero Section */}
        <section className="relative py-32 bg-gray-50 dark:bg-gray-900">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Volunteers helping community"
              fill
              className="object-cover object-center opacity-30"
            />
            <div className="absolute inset-0 bg-white/60 dark:bg-black/60"></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
              Volunteer With Us
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light leading-relaxed">
              Join our community of changemakers and help transform lives across Nigeria. Your time and skills can make a lasting difference.
            </p>
          </div>
        </section>

        {/* Why Volunteer */}
        <section className="py-24 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                Why Volunteer With Us?
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                Join a mission-driven organization that values your contribution and provides meaningful opportunities for impact
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {volunteerBenefits.map((benefit, index) => (
                <div key={index} className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-accent-500 transition-colors shadow-lg dark:shadow-none text-center group">
                  <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <benefit.icon className="w-6 h-6 text-accent-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-display">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-light">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Volunteer Opportunities */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                Volunteer Opportunities
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                Find the perfect way to contribute your skills and passion to our mission
              </p>
            </div>

            {loadingRoles ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-400 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">Loading opportunities...</p>
              </div>
            ) : volunteerOpportunities.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">No volunteer opportunities available at the moment. Please check back later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {volunteerOpportunities.map((opportunity) => {
                  // Map category to icon
                  const getCategoryIcon = (category: string) => {
                    switch (category) {
                      case 'medical': return Heart;
                      case 'education': return Star;
                      case 'events': return Users;
                      case 'admin': return CheckCircle;
                      case 'technical': return Briefcase;
                      default: return Users;
                    }
                  };
                  const IconComponent = getCategoryIcon(opportunity.category);

                  return (
                    <div key={opportunity.id} className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-accent-500 transition-colors shadow-lg dark:shadow-none">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-accent-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 font-display">{opportunity.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {opportunity.time_commitment && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {opportunity.time_commitment}
                              </span>
                            )}
                            {opportunity.spots_available && (
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {opportunity.spots_available} spots
                              </span>
                            )}
                          </div>
                          <p className="flex items-center gap-1 text-sm text-accent-400 mb-3">
                            <MapPin className="w-4 h-4" />
                            {opportunity.location}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed mb-4">{opportunity.description}</p>

                      {opportunity.required_skills.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Required Skills:</h4>
                          <div className="flex flex-wrap gap-2">
                            {opportunity.required_skills.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <a
                        href={`/contact?subject=Volunteer Application - ${opportunity.title}&message=I am interested in applying for the ${opportunity.title} position. Please find my details in the form below.`}
                        className="w-full bg-accent-500 hover:bg-accent-600 text-gray-900 dark:text-white py-3 px-4 rounded-full font-medium text-sm transition-colors font-sans text-center block"
                      >
                        Apply for This Role
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Volunteer Application Form */}
        <section className="py-24 bg-white dark:bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                Volunteer Application
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                Ready to make a difference? Fill out our application form and we'll get back to you soon.
              </p>
            </div>

            <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-green-400 mb-2 font-display">
                    Application Submitted!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Thank you for your interest in volunteering. Our team will review your application and contact you within 5 business days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
                        placeholder="Enter your email address"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
                      placeholder="City, State"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
                      Areas of Interest (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {interests.map((interest) => (
                        <label key={interest} className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.interests.includes(interest)}
                            onChange={() => handleInterestChange(interest)}
                            className="w-4 h-4 text-accent-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-accent-500 focus:ring-2"
                          />
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">{interest}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="availability" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Availability
                    </label>
                    <select
                      id="availability"
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
                    >
                      <option value="">Select your availability</option>
                      <option value="weekdays">Weekdays</option>
                      <option value="weekends">Weekends</option>
                      <option value="both">Both weekdays and weekends</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Relevant Experience
                    </label>
                    <textarea
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans resize-none"
                      placeholder="Tell us about your relevant experience, skills, or qualifications..."
                    />
                  </div>

                  <div>
                    <label htmlFor="motivation" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Why do you want to volunteer with us? *
                    </label>
                    <textarea
                      id="motivation"
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans resize-none"
                      placeholder="Share your motivation for volunteering with Saintlammy Foundation..."
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="backgroundCheck"
                      name="backgroundCheck"
                      checked={formData.backgroundCheck}
                      onChange={handleChange}
                      required
                      className="w-4 h-4 text-accent-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-accent-500 focus:ring-2 mt-1"
                    />
                    <label htmlFor="backgroundCheck" className="text-sm text-gray-600 dark:text-gray-300">
                      I agree to undergo a background check if required for my volunteer role. *
                    </label>
                  </div>

                  {submitError && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent-500 hover:bg-accent-600 disabled:opacity-60 disabled:cursor-not-allowed text-gray-900 dark:text-white px-8 py-4 rounded-full font-medium text-base transition-colors shadow-lg hover:shadow-xl flex items-center justify-center font-sans"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Submit Application
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

    </>
  );
};

export default Volunteer;