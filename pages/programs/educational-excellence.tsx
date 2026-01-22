import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { GraduationCap, BookOpen, Users, Trophy, MapPin, ArrowRight, CheckCircle, Star, ArrowLeft, Phone, Mail, Clock, Award, Target } from 'lucide-react';
import { useDonationModal } from '@/components/DonationModalProvider';
import SEOHead from '@/components/SEOHead';
import { pageSEO } from '@/lib/seo';

const EducationalExcellenceProgram: React.FC = () => {
  const { openDonationModal } = useDonationModal();

  const programHighlights = [
    { label: 'Students Currently Supported', value: '450+' },
    { label: 'Graduation Success Rate', value: '92%' },
    { label: 'University Admissions', value: '78%' },
    { label: 'Monthly Budget', value: '₦280,000' }
  ];

  const programFeatures = [
    {
      icon: GraduationCap,
      title: 'Scholarship Programs',
      description: 'Full and partial scholarships covering tuition, fees, and educational materials for deserving students.',
      details: ['Primary education scholarships', 'Secondary school sponsorship', 'University placement support', 'Vocational training scholarships', 'Merit-based award system']
    },
    {
      icon: BookOpen,
      title: 'Learning Support',
      description: 'Comprehensive educational support including materials, tutoring, and academic guidance.',
      details: ['School supplies and textbooks', 'School uniforms provision', 'After-school tutoring programs', 'Computer literacy training', 'STEM program participation']
    },
    {
      icon: Users,
      title: 'Mentorship Program',
      description: 'Pairing students with mentors for academic guidance and career development support.',
      details: ['Academic mentors assignment', 'Career guidance counseling', 'Study skills development', 'Goal setting and tracking', 'Regular progress meetings']
    },
    {
      icon: Trophy,
      title: 'Excellence Recognition',
      description: 'Recognizing and rewarding academic excellence to motivate continued high performance.',
      details: ['Academic achievement awards', 'Excellence certificates', 'Special recognition events', 'Leadership development programs', 'Peer recognition systems']
    }
  ];

  const educationLevels = [
    {
      level: 'Primary Education',
      students: '180+ students',
      successRate: '95%',
      support: 'Complete package including tuition, uniforms, books, and meals',
      avgCost: '₦35,000/year',
      description: 'Foundation education ensuring strong literacy and numeracy skills.',
      outcomes: ['95% literacy rate', '90% numeracy proficiency', '98% attendance rate', '85% complete primary']
    },
    {
      level: 'Secondary Education',
      students: '200+ students',
      successRate: '92%',
      support: 'Full sponsorship including WAEC/NECO fees and career guidance',
      avgCost: '₦65,000/year',
      description: 'Comprehensive secondary education with focus on academic excellence.',
      outcomes: ['92% graduation rate', '78% university admission', '88% pass WAEC', '95% career ready']
    },
    {
      level: 'University Education',
      students: '60+ students',
      successRate: '89%',
      support: 'University tuition, accommodation, and academic support',
      avgCost: '₦180,000/year',
      description: 'Higher education support for exceptional students pursuing degrees.',
      outcomes: ['89% completion rate', '95% first class/2:1', '92% employment rate', '85% leadership roles']
    },
    {
      level: 'Vocational Training',
      students: '45+ students',
      successRate: '94%',
      support: 'Skills training, certification, and job placement assistance',
      avgCost: '₦45,000/program',
      description: 'Technical skills development for immediate employment opportunities.',
      outcomes: ['94% certification', '87% job placement', '90% income increase', '95% skill mastery']
    }
  ];

  const successStories = [
    {
      name: 'Chioma Okeke',
      level: 'University Graduate',
      achievement: 'First Class in Computer Science',
      currentRole: 'Software Engineer at Tech Company',
      story: 'From a struggling family in rural Nigeria to becoming a software engineer in Lagos. Our scholarship program made this transformation possible.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b490?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Emeka Okafor',
      level: 'Secondary School',
      achievement: '9 A1s in WAEC Examination',
      currentRole: 'University of Ibadan Medical Student',
      story: 'Excellent WAEC results earned him admission to study Medicine. Now pursuing his dream of becoming a doctor.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Amina Hassan',
      level: 'Vocational Training',
      achievement: 'Certified Fashion Designer',
      currentRole: 'Fashion Business Owner',
      story: 'Completed fashion design training and now runs a successful tailoring business employing 8 people.',
      image: 'https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  const academicSupport = [
    {
      service: 'After-School Tutoring',
      description: 'Free tutoring sessions in Mathematics, English, and Sciences',
      beneficiaries: '300+ students',
      schedule: 'Mon-Fri, 4-6 PM'
    },
    {
      service: 'Computer Literacy',
      description: 'Basic computer skills and digital literacy training',
      beneficiaries: '250+ students',
      schedule: 'Weekends, 10 AM-2 PM'
    },
    {
      service: 'Library Services',
      description: 'Access to books, research materials, and quiet study spaces',
      beneficiaries: '400+ students',
      schedule: 'Daily, 8 AM-6 PM'
    },
    {
      service: 'Career Counseling',
      description: 'Individual guidance on career choices and university applications',
      beneficiaries: '150+ students',
      schedule: 'By appointment'
    }
  ];

  const impactMetrics = [
    {
      metric: 'Academic Performance',
      impact: '92% above average performance',
      description: 'Students consistently score above national averages'
    },
    {
      metric: 'School Completion',
      impact: '95% completion rate',
      description: 'High retention and graduation rates across all levels'
    },
    {
      metric: 'Higher Education',
      impact: '78% pursue tertiary education',
      description: 'Strong progression to universities and polytechnics'
    },
    {
      metric: 'Career Success',
      impact: '85% secure employment',
      description: 'High employment rates within 6 months of graduation'
    }
  ];

  const supportOptions = [
    {
      title: 'Annual Scholarship',
      description: 'Sponsor a student\'s complete annual education including all fees and materials.',
      amount: '₦65,000',
      impact: 'Full year education for 1 student',
      icon: GraduationCap
    },
    {
      title: 'School Supplies Package',
      description: 'Provide essential school supplies, books, and uniforms for needy students.',
      amount: '₦15,000',
      impact: 'School supplies for 1 student',
      icon: BookOpen
    },
    {
      title: 'Computer Lab Support',
      description: 'Fund computer equipment and digital literacy programs for students.',
      amount: '₦50,000',
      impact: 'Digital training for 20 students',
      icon: Target
    },
    {
      title: 'Excellence Awards',
      description: 'Support academic achievement recognition and motivation programs.',
      amount: '₦25,000',
      impact: 'Awards for 10 excellent students',
      icon: Trophy
    }
  ];

  return (
    <>
      <SEOHead config={pageSEO.educationalExcellence} />

      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-gray-900 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-accent-500">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/programs" className="text-gray-500 dark:text-gray-400 hover:text-accent-500">Programs</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white">Educational Excellence Program</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-32 bg-white dark:bg-black">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Students learning"
            fill
            className="object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mr-4">
                <GraduationCap className="w-8 h-8 text-accent-400" />
              </div>
              <div>
                <span className="px-4 py-2 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium">
                  Education Program
                </span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
              Educational Excellence Program
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light leading-relaxed mb-8">
              Comprehensive educational support ensuring children from vulnerable families access quality education from primary through university levels with mentorship and career guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => openDonationModal({
                  source: 'educational-excellence-program',
                  category: 'general',
                  title: 'Support Educational Excellence Program',
                  description: 'Help provide quality education access to children from vulnerable families.'
                })}
                className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-medium text-base transition-colors shadow-glow hover:shadow-glow-lg font-sans inline-flex items-center justify-center"
              >
                Support Education
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <Link
                href="/volunteer"
                className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white border border-gray-300 dark:border-transparent px-8 py-4 rounded-full font-medium text-base transition-colors font-sans text-center inline-flex items-center justify-center"
              >
                Become a Tutor
                <BookOpen className="w-5 h-5 ml-2" />
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
              Comprehensive Educational Support
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our program addresses every aspect of a student's educational journey from primary through higher education.
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

      {/* Education Levels */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-6 font-display">
              Support Across All Education Levels
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From primary school through university, we provide comprehensive support at every educational stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {educationLevels.map((level, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {level.level}
                  </h3>
                  <span className="bg-accent-500/20 text-accent-400 px-3 py-1 rounded-full text-sm">
                    {level.successRate} success
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {level.description}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="font-semibold text-accent-400">{level.students}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Current Students</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="font-semibold text-accent-400">{level.avgCost}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Average Cost</div>
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Support Includes:</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{level.support}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Key Outcomes:</h4>
                  {level.outcomes.map((outcome, outcomeIndex) => (
                    <div key={outcomeIndex} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-accent-400 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-300 text-sm">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Support Services */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-6 font-display">
              Additional Academic Support
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Beyond scholarships, we provide comprehensive support services to ensure student success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {academicSupport.map((service, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {service.service}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {service.description}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-accent-400 font-medium">{service.beneficiaries}</span>
                  <span className="text-gray-500 dark:text-gray-400">{service.schedule}</span>
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
              Student Success Stories
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Inspiring stories of educational transformation and career success from our program alumni.
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
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {story.name}
                      </h3>
                      <p className="text-accent-400 text-sm">{story.level}</p>
                    </div>
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                  <div className="bg-accent-500/10 rounded-lg p-3 mb-4">
                    <div className="text-accent-400 text-sm font-semibold">{story.achievement}</div>
                    <div className="text-gray-600 dark:text-gray-300 text-xs">{story.currentRole}</div>
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

      {/* Impact Metrics */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-6 font-display">
              Educational Impact
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Measurable outcomes demonstrating the effectiveness of our educational support programs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {metric.metric}
                  </h3>
                  <div className="text-2xl font-bold text-accent-400 mb-2">
                    {metric.impact}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {metric.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-6 font-display">
              Support Educational Excellence
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose how you'd like to contribute to providing quality education for vulnerable children.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportOptions.map((option, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center">
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
                    source: `educational-excellence-${option.title.toLowerCase().replace(/\s+/g, '-')}`,
                    category: 'general',
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
            Invest in Education Today
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Join us in breaking the cycle of poverty through education. Your support can transform a child's future.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex items-center justify-center">
              <Phone className="w-5 h-5 text-accent-400 mr-3" />
              <span className="text-gray-600 dark:text-gray-300">+234 (0) 123 456 7890</span>
            </div>
            <div className="flex items-center justify-center">
              <Mail className="w-5 h-5 text-accent-400 mr-3" />
              <span className="text-gray-600 dark:text-gray-300">education@saintlammyfoundation.org</span>
            </div>
            <div className="flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent-400 mr-3" />
              <span className="text-gray-600 dark:text-gray-300">Mon-Fri, 8am-5pm</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => openDonationModal({
                source: 'educational-excellence-cta',
                category: 'general',
                title: 'Support Educational Excellence Program',
                description: 'Help provide quality education and bright futures for vulnerable children.'
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

export default EducationalExcellenceProgram;