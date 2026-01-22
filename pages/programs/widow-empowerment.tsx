import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Users, TrendingUp, Briefcase, DollarSign, MapPin, ArrowRight, CheckCircle, Star, ArrowLeft, Phone, Mail, Clock, Award } from 'lucide-react';
import { useDonationModal } from '@/components/DonationModalProvider';
import SEOHead from '@/components/SEOHead';
import { pageSEO } from '@/lib/seo';

const WidowEmpowermentProgram: React.FC = () => {
  const { openDonationModal } = useDonationModal();

  const programHighlights = [
    { label: 'Widows Currently Supported', value: '500+' },
    { label: 'Businesses Successfully Started', value: '180' },
    { label: 'Average Income Increase', value: '65%' },
    { label: 'Monthly Budget', value: '₦320,000' }
  ];

  const programFeatures = [
    {
      icon: Users,
      title: 'Skills Training Programs',
      description: 'Comprehensive vocational training in various marketable skills to ensure financial independence.',
      details: ['Tailoring and fashion design courses', 'Soap making and cosmetics production', 'Catering and food processing', 'Hairdressing and beauty services', 'Crafts and handwork training']
    },
    {
      icon: Briefcase,
      title: 'Business Development',
      description: 'Complete business management training and entrepreneurship development programs.',
      details: ['Business plan development', 'Financial management training', 'Marketing and sales strategies', 'Customer service excellence', 'Record keeping and accounting']
    },
    {
      icon: DollarSign,
      title: 'Micro-Finance Support',
      description: 'Access to micro-loans and financial services to start and grow small businesses.',
      details: ['Micro-loan facilities', 'Financial literacy training', 'Savings group formation', 'Investment guidance', 'Credit management education']
    },
    {
      icon: TrendingUp,
      title: 'Market Linkage',
      description: 'Connecting widows to markets and providing ongoing business support for sustainability.',
      details: ['Market research assistance', 'Customer connection services', 'Product marketing support', 'Business mentorship programs', 'Networking opportunities']
    }
  ];

  const successStories = [
    {
      name: 'Mrs. Fatima Abubakar',
      age: 42,
      story: 'Started with soap making training. Now runs a successful cosmetics business employing 5 people.',
      achievement: 'Business Owner',
      income: '₦120,000/month',
      image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Mrs. Adunni Ogundimu',
      age: 38,
      story: 'Completed tailoring training and now operates a fashion design studio.',
      achievement: 'Fashion Designer',
      income: '₦85,000/month',
      image: 'https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Mrs. Grace Okoro',
      age: 45,
      story: 'Started catering business after completing our food processing program.',
      achievement: 'Catering Business',
      income: '₦95,000/month',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b490?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  const trainingPrograms = [
    {
      title: 'Tailoring & Fashion Design',
      duration: '3 months',
      participants: '120+ widows',
      successRate: '88%',
      description: 'Complete training in garment production, pattern making, and fashion design.',
      skills: ['Pattern cutting', 'Sewing techniques', 'Fashion design', 'Business planning']
    },
    {
      title: 'Soap Making & Cosmetics',
      duration: '2 months',
      participants: '90+ widows',
      successRate: '92%',
      description: 'Production of soaps, creams, and beauty products for commercial sale.',
      skills: ['Soap production', 'Cosmetic formulation', 'Packaging', 'Quality control']
    },
    {
      title: 'Catering & Food Processing',
      duration: '3 months',
      participants: '85+ widows',
      successRate: '85%',
      description: 'Commercial cooking, food preservation, and catering business management.',
      skills: ['Commercial cooking', 'Food preservation', 'Menu planning', 'Catering management']
    },
    {
      title: 'Digital Marketing',
      duration: '1 month',
      participants: '60+ widows',
      successRate: '78%',
      description: 'Online business promotion and social media marketing for small businesses.',
      skills: ['Social media marketing', 'Online sales', 'Digital payments', 'Customer engagement']
    }
  ];

  const impactAreas = [
    {
      area: 'Economic Independence',
      impact: '75% achieve financial independence',
      description: 'Widows successfully start and sustain their own businesses'
    },
    {
      area: 'Skills Acquisition',
      impact: '95% complete training programs',
      description: 'High completion rate with practical, marketable skills'
    },
    {
      area: 'Business Success',
      impact: '70% still operating after 2 years',
      description: 'Strong business sustainability and growth rates'
    },
    {
      area: 'Family Impact',
      impact: '85% report improved family welfare',
      description: 'Better education and healthcare for their children'
    }
  ];

  const howToHelp = [
    {
      title: 'Skills Training Sponsorship',
      description: 'Sponsor a widow\'s complete skills training program including materials and certification.',
      amount: '₦45,000',
      impact: 'Train 1 widow completely',
      icon: Users
    },
    {
      title: 'Business Startup Fund',
      description: 'Provide initial capital for a widow to start her own business after training.',
      amount: '₦25,000',
      impact: 'Start 1 business',
      icon: Briefcase
    },
    {
      title: 'Equipment & Tools',
      description: 'Purchase essential tools and equipment needed for various skill training programs.',
      amount: '₦15,000',
      impact: 'Equip training center',
      icon: Award
    },
    {
      title: 'Mentorship Program',
      description: 'Support ongoing mentorship and business development services.',
      amount: '₦10,000',
      impact: '3 months mentorship',
      icon: TrendingUp
    }
  ];

  return (
    <>
      <SEOHead config={pageSEO.widowEmpowerment} />

      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-gray-900 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-accent-500">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/programs" className="text-gray-500 dark:text-gray-400 hover:text-accent-500">Programs</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white">Widow Empowerment Initiative</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-32 bg-white dark:bg-black">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Women working together"
            fill
            className="object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mr-4">
                <Users className="w-8 h-8 text-accent-400" />
              </div>
              <div>
                <span className="px-4 py-2 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium">
                  Economic Empowerment Program
                </span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
              Widow Empowerment Initiative
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light leading-relaxed mb-8">
              Comprehensive economic empowerment program helping widows become financially independent through skills training, business support, and micro-finance access.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => openDonationModal({
                  source: 'widow-empowerment-program',
                  category: 'widow',
                  title: 'Support Widow Empowerment Initiative',
                  description: 'Help widows achieve financial independence through skills training and business support.'
                })}
                className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-medium text-base transition-colors shadow-glow hover:shadow-glow-lg font-sans inline-flex items-center justify-center"
              >
                Support This Program
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <Link
                href="/volunteer"
                className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white border border-gray-300 dark:border-transparent px-8 py-4 rounded-full font-medium text-base transition-colors font-sans text-center inline-flex items-center justify-center"
              >
                Become a Mentor
                <TrendingUp className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {programHighlights.map((highlight, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-semibold text-accent-400 mb-2 font-display">
                  {highlight.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium text-sm">
                  {highlight.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Features */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-6 font-display">
              Comprehensive Empowerment Approach
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our holistic approach ensures widows receive complete support from training to business establishment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {programFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center mr-4">
                    <feature.icon className="w-6 h-6 text-accent-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white font-display">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <div className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Programs */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-6 font-display">
              Skills Training Programs
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Practical training programs designed to provide marketable skills with high success rates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trainingPrograms.map((program, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {program.title}
                  </h3>
                  <span className="bg-accent-500/20 text-accent-400 px-3 py-1 rounded-full text-sm">
                    {program.successRate} success
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {program.description}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="font-semibold text-accent-400">{program.duration}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Duration</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="font-semibold text-accent-400">{program.participants}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Trained</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Skills Covered:</h4>
                  {program.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-accent-400 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-300 text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-6 font-display">
              Inspiring Success Stories
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Real stories of transformation from widows who have achieved financial independence through our programs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden">
                <div className="aspect-w-4 aspect-h-3 relative h-48">
                  <Image
                    src={story.image}
                    alt={story.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {story.name}
                      </h3>
                      <p className="text-accent-400 text-sm">Age {story.age}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-500">{story.income}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Monthly Income</div>
                    </div>
                  </div>
                  <div className="bg-accent-500/10 rounded-lg p-3 mb-4">
                    <div className="flex items-center text-accent-400">
                      <Star className="w-4 h-4 fill-current mr-2" />
                      <span className="text-sm font-medium">{story.achievement}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {story.story}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Areas */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-6 font-display">
              Program Impact
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Measurable outcomes that demonstrate the effectiveness of our empowerment approach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactAreas.map((area, index) => (
              <div key={index} className="text-center">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {area.area}
                  </h3>
                  <div className="text-2xl font-bold text-accent-400 mb-2">
                    {area.impact}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {area.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Help */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-6 font-display">
              Support Widow Empowerment
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose how you'd like to contribute to empowering widows and transforming communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howToHelp.map((option, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <option.icon className="w-6 h-6 text-accent-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {option.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                  {option.description}
                </p>
                <div className="text-2xl font-bold text-accent-400 mb-2">
                  {option.amount}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                  {option.impact}
                </div>
                <button
                  onClick={() => openDonationModal({
                    source: `widow-empowerment-${option.title.toLowerCase().replace(/\s+/g, '-')}`,
                    category: 'widow',
                    title: `Support ${option.title}`,
                    description: option.description,
                    suggestedAmount: parseInt(option.amount.replace(/[^\d]/g, ''))
                  })}
                  className="w-full bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Donate Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Get Involved */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-6 font-display">
            Empower a Widow Today
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Join us in transforming lives through economic empowerment. Your support can help a widow achieve financial independence.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex items-center justify-center">
              <Phone className="w-5 h-5 text-accent-400 mr-3" />
              <span className="text-gray-600 dark:text-gray-300">+234 (0) 123 456 7890</span>
            </div>
            <div className="flex items-center justify-center">
              <Mail className="w-5 h-5 text-accent-400 mr-3" />
              <span className="text-gray-600 dark:text-gray-300">empowerment@saintlammyfoundation.org</span>
            </div>
            <div className="flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent-400 mr-3" />
              <span className="text-gray-600 dark:text-gray-300">Mon-Fri, 9am-5pm</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => openDonationModal({
                source: 'widow-empowerment-cta',
                category: 'widow',
                title: 'Support Widow Empowerment Initiative',
                description: 'Help widows achieve financial independence and transform their communities.'
              })}
              className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-medium text-base transition-colors shadow-glow hover:shadow-glow-lg font-sans"
            >
              Make a Donation
            </button>
            <Link
              href="/programs"
              className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white border border-gray-300 dark:border-transparent px-8 py-4 rounded-full font-medium text-base transition-colors font-sans text-center inline-flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Programs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default WidowEmpowermentProgram;