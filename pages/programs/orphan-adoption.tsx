import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Users, Target, Calendar, MapPin, ArrowRight, CheckCircle, Star, ArrowLeft, Phone, Mail, Clock } from 'lucide-react';
import { useDonationModal } from '@/components/DonationModalProvider';

const OrphanAdoptionProgram: React.FC = () => {
  const { openDonationModal } = useDonationModal();

  const programHighlights = [
    { label: 'Children Currently Supported', value: '300+' },
    { label: 'Educational Success Rate', value: '85%' },
    { label: 'Health Outcomes Improved', value: '95%' },
    { label: 'Monthly Budget', value: '₦450,000' }
  ];

  const programFeatures = [
    {
      icon: Target,
      title: 'Educational Support',
      description: 'Full scholarships, school supplies, uniforms, and educational materials for all program children.',
      details: ['Primary and secondary education funding', 'University scholarships for top performers', 'Books, uniforms, and learning materials', 'Computer literacy training', 'Extra-curricular activities support']
    },
    {
      icon: Heart,
      title: 'Healthcare Services',
      description: 'Comprehensive medical care including regular checkups, treatments, and health insurance.',
      details: ['Regular medical checkups', 'Vaccination programs', 'Emergency medical care', 'Mental health support', 'Health insurance coverage']
    },
    {
      icon: Users,
      title: 'Psychological Support',
      description: 'Professional counseling and mentorship programs to ensure emotional well-being.',
      details: ['Individual counseling sessions', 'Group therapy programs', 'Mentor matching system', 'Life skills training', 'Emotional development workshops']
    },
    {
      icon: Calendar,
      title: 'Skills Development',
      description: 'Vocational training and career guidance to prepare children for independent futures.',
      details: ['Vocational training programs', 'Career counseling', 'Internship opportunities', 'Entrepreneurship training', 'Job placement assistance']
    }
  ];

  const successStories = [
    {
      name: 'Blessing Adeyemi',
      age: 19,
      story: 'Joined our program at age 8. Now studying Medicine at the University of Lagos.',
      achievement: 'First Class Honors',
      image: 'https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Emmanuel Okafor',
      age: 17,
      story: 'Program participant since age 10. Excelling in sciences and mathematics.',
      achievement: 'Science Olympiad Winner',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Grace Idowu',
      age: 16,
      story: 'Joined at age 9. Passionate about technology and coding.',
      achievement: 'Young Tech Innovator',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b490?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  const impactAreas = [
    {
      area: 'Education',
      impact: '98% school enrollment rate among program children',
      description: 'Every child in our program attends school with full support'
    },
    {
      area: 'Health',
      impact: '95% improvement in health outcomes',
      description: 'Regular healthcare and nutrition support show remarkable results'
    },
    {
      area: 'Emotional Well-being',
      impact: '90% show improved emotional stability',
      description: 'Professional counseling and mentorship programs make a difference'
    },
    {
      area: 'Future Readiness',
      impact: '85% complete secondary education',
      description: 'High graduation rates prepare children for successful futures'
    }
  ];

  const howToHelp = [
    {
      title: 'Monthly Sponsorship',
      description: 'Sponsor a child\'s monthly needs including education, healthcare, and basic necessities.',
      amount: '₦15,000/month',
      impact: 'Supports 1 child completely'
    },
    {
      title: 'Educational Fund',
      description: 'Support educational expenses including school fees, books, and supplies.',
      amount: '₦25,000',
      impact: 'Covers 1 year of education'
    },
    {
      title: 'Healthcare Support',
      description: 'Contribute to medical care, health insurance, and wellness programs.',
      amount: '₦10,000',
      impact: 'Medical care for 3 months'
    },
    {
      title: 'Skills Training',
      description: 'Fund vocational training and career development programs.',
      amount: '₦20,000',
      impact: 'Skills training for 1 child'
    }
  ];

  return (
    <>
      <Head>
        <title>Orphan Adoption Program - Saintlammy Foundation</title>
        <meta name="description" content="Comprehensive support system for orphaned children including education, healthcare, housing, and emotional support through Saintlammy Foundation's Orphan Adoption Program." />
        <meta name="keywords" content="orphan adoption, child welfare, education support, healthcare for orphans, Nigeria charity" />
      </Head>

      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-gray-900 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-accent-500">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/programs" className="text-gray-500 dark:text-gray-400 hover:text-accent-500">Programs</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white">Orphan Adoption Program</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-32 bg-white dark:bg-black">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Children learning"
            fill
            className="object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mr-4">
                <Heart className="w-8 h-8 text-accent-400" />
              </div>
              <div>
                <span className="px-4 py-2 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium">
                  Child Welfare Program
                </span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
              Orphan Adoption Program
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light leading-relaxed mb-8">
              Providing comprehensive support to orphaned children including education, healthcare, psychological support, and career guidance to help them build successful futures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => openDonationModal({
                  source: 'orphan-adoption-program',
                  category: 'orphan',
                  title: 'Support Orphan Adoption Program',
                  description: 'Help us provide comprehensive support to orphaned children including education, healthcare, and emotional care.'
                })}
                className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-medium text-base transition-colors shadow-glow hover:shadow-glow-lg font-sans inline-flex items-center justify-center"
              >
                Support This Program
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <Link
                href="/contact"
                className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white border border-gray-300 dark:border-transparent px-8 py-4 rounded-full font-medium text-base transition-colors font-sans text-center inline-flex items-center justify-center"
              >
                Get Involved
                <Users className="w-5 h-5 ml-2" />
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
              Comprehensive Support System
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our program addresses every aspect of a child's development through structured support systems.
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

      {/* Success Stories */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-6 font-display">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Real stories of transformation and hope from children in our program.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="aspect-w-4 aspect-h-3 relative h-48">
                  <Image
                    src={story.image}
                    alt={story.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {story.name}
                      </h3>
                      <p className="text-accent-400 text-sm">Age {story.age}</p>
                    </div>
                    <div className="ml-auto">
                      <div className="flex items-center text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-xs ml-1">{story.achievement}</span>
                      </div>
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
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-6 font-display">
              Measurable Impact
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our program delivers measurable results across key development areas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactAreas.map((area, index) => (
              <div key={index} className="text-center">
                <div className="bg-accent-500/10 rounded-2xl p-6">
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
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-6 font-display">
              Ways to Support
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose how you'd like to contribute to transforming the lives of orphaned children.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howToHelp.map((option, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center">
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
                    source: `orphan-adoption-${option.title.toLowerCase().replace(' ', '-')}`,
                    category: 'orphan',
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
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-6 font-display">
            Get Involved Today
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Ready to make a difference in a child's life? Contact us to learn more about volunteering, sponsoring, or partnering with our program.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex items-center justify-center">
              <Phone className="w-5 h-5 text-accent-400 mr-3" />
              <span className="text-gray-600 dark:text-gray-300">+234 (0) 123 456 7890</span>
            </div>
            <div className="flex items-center justify-center">
              <Mail className="w-5 h-5 text-accent-400 mr-3" />
              <span className="text-gray-600 dark:text-gray-300">programs@saintlammyfoundation.org</span>
            </div>
            <div className="flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent-400 mr-3" />
              <span className="text-gray-600 dark:text-gray-300">Mon-Fri, 9am-5pm</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => openDonationModal({
                source: 'orphan-adoption-cta',
                category: 'orphan',
                title: 'Support Orphan Adoption Program',
                description: 'Help transform the lives of orphaned children through comprehensive support.'
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

export default OrphanAdoptionProgram;