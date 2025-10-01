import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Stethoscope, Activity, Shield, MapPin, ArrowRight, CheckCircle, Star, ArrowLeft, Phone, Mail, Clock, Truck, Users, Target } from 'lucide-react';
import { useDonationModal } from '@/components/DonationModalProvider';

const HealthcareAccessProgram: React.FC = () => {
  const { openDonationModal } = useDonationModal();

  const programHighlights = [
    { label: 'Patients Treated Monthly', value: '1,200+' },
    { label: 'Medical Consultations', value: '3,500+' },
    { label: 'Lives Saved', value: '25+' },
    { label: 'Monthly Budget', value: '₦380,000' }
  ];

  const healthcareServices = [
    {
      icon: Stethoscope,
      title: 'Mobile Medical Clinics',
      description: 'Bringing healthcare services directly to underserved communities through mobile medical units.',
      details: ['General medical consultations', 'Basic diagnostic services', 'Minor surgical procedures', 'Emergency medical care', 'Health screening programs']
    },
    {
      icon: Heart,
      title: 'Maternal & Child Health',
      description: 'Specialized programs focusing on the health needs of mothers and children.',
      details: ['Prenatal care services', 'Postnatal support programs', 'Child immunization campaigns', 'Nutritional support', 'Family planning services']
    },
    {
      icon: Shield,
      title: 'Preventive Healthcare',
      description: 'Community health education and disease prevention programs.',
      details: ['Health education workshops', 'Disease prevention campaigns', 'Hygiene promotion programs', 'Water sanitation projects', 'Community health training']
    },
    {
      icon: Activity,
      title: 'Mental Health Support',
      description: 'Addressing mental health needs through counseling and support services.',
      details: ['Individual counseling sessions', 'Group therapy programs', 'Trauma recovery support', 'Mental health awareness', 'Stress management workshops']
    }
  ];

  const medicalPrograms = [
    {
      program: 'Mobile Clinic Services',
      coverage: '15 rural communities',
      frequency: '2 times per month per community',
      services: 'General consultations, basic treatments, medication supply',
      beneficiaries: '800+ patients/month',
      impact: '95% patient satisfaction rate'
    },
    {
      program: 'Maternal Health Program',
      coverage: '8 healthcare centers',
      frequency: 'Daily services available',
      services: 'Prenatal care, delivery support, postnatal care',
      beneficiaries: '150+ mothers/month',
      impact: '90% safe delivery rate'
    },
    {
      program: 'Child Immunization',
      coverage: '20 communities',
      frequency: 'Monthly vaccination campaigns',
      services: 'Routine immunizations, health check-ups',
      beneficiaries: '200+ children/month',
      impact: '98% immunization coverage'
    },
    {
      program: 'Health Education',
      coverage: '25 communities',
      frequency: 'Weekly workshops',
      services: 'Disease prevention, hygiene education, nutrition',
      beneficiaries: '500+ people/month',
      impact: '85% behavior change rate'
    }
  ];

  const healthcareImpact = [
    {
      area: 'Medical Access',
      impact: '85% improved access to healthcare',
      description: 'Significant increase in healthcare accessibility for rural communities',
      trend: 'up'
    },
    {
      area: 'Child Mortality',
      impact: '40% reduction in child mortality',
      description: 'Improved child survival rates through preventive care',
      trend: 'down'
    },
    {
      area: 'Maternal Health',
      impact: '90% safe delivery rate',
      description: 'Professional assistance during childbirth',
      trend: 'up'
    },
    {
      area: 'Disease Prevention',
      impact: '70% reduction in preventable diseases',
      description: 'Effective prevention programs show strong results',
      trend: 'down'
    }
  ];

  const successStories = [
    {
      name: 'Mrs. Amina Yusuf',
      condition: 'High-risk pregnancy',
      outcome: 'Safe delivery of twins',
      story: 'Through our maternal health program, received proper prenatal care and delivered healthy twins at our partner clinic.',
      location: 'Kano State',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Ibrahim Musa (Age 7)',
      condition: 'Severe malnutrition',
      outcome: 'Full recovery and healthy growth',
      story: 'Identified through our mobile clinic, received nutritional support and regular monitoring until full recovery.',
      location: 'Kaduna State',
      image: 'https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Chief Adebayo',
      condition: 'Hypertension crisis',
      outcome: 'Stabilized and ongoing care',
      story: 'Emergency intervention by mobile clinic saved his life. Now receives regular monitoring and medication.',
      location: 'Ogun State',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  const healthChallenges = [
    {
      challenge: 'Limited Healthcare Access',
      description: 'Many rural communities lack access to basic healthcare services',
      solution: 'Mobile medical clinics bring services to remote areas',
      impact: '15 communities now have regular medical access'
    },
    {
      challenge: 'High Maternal Mortality',
      description: 'Lack of skilled birth attendants leads to maternal deaths',
      solution: 'Training traditional birth attendants and providing emergency transport',
      impact: '90% of deliveries now have skilled attendance'
    },
    {
      challenge: 'Preventable Diseases',
      description: 'Poor sanitation and lack of health education cause disease outbreaks',
      solution: 'Community health education and sanitation programs',
      impact: '70% reduction in water-borne diseases'
    },
    {
      challenge: 'Mental Health Stigma',
      description: 'Mental health issues often ignored due to cultural barriers',
      solution: 'Community sensitization and accessible mental health services',
      impact: '200+ people now receive mental health support'
    }
  ];

  const supportOptions = [
    {
      title: 'Mobile Clinic Support',
      description: 'Fund a complete mobile clinic outreach to serve one community for a month.',
      amount: '₦75,000',
      impact: 'Healthcare for 200+ people',
      icon: Truck
    },
    {
      title: 'Medical Equipment',
      description: 'Purchase essential medical equipment for our clinics and outreach programs.',
      amount: '₦50,000',
      impact: 'Equip mobile clinic unit',
      icon: Stethoscope
    },
    {
      title: 'Medication Supply',
      description: 'Provide essential medications for common health conditions and treatments.',
      amount: '₦30,000',
      impact: 'Medicine for 100 patients',
      icon: Heart
    },
    {
      title: 'Health Education',
      description: 'Support community health education and disease prevention programs.',
      amount: '₦20,000',
      impact: 'Education for 50 families',
      icon: Users
    }
  ];

  return (
    <>
      <Head>
        <title>Healthcare Access Program - Saintlammy Foundation</title>
        <meta name="description" content="Providing healthcare services and medical support to underserved communities through mobile clinics and health education programs in Nigeria." />
        <meta name="keywords" content="healthcare access, mobile clinic, maternal health, child health, medical support, Nigeria healthcare" />
      </Head>

      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-gray-900 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-accent-500">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/programs" className="text-gray-500 dark:text-gray-400 hover:text-accent-500">Programs</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white">Healthcare Access Program</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-32 bg-white dark:bg-black">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Healthcare workers"
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
                  Healthcare Program
                </span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
              Healthcare Access Program
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light leading-relaxed mb-8">
              Providing comprehensive healthcare services to underserved communities through mobile clinics, health education, maternal care, and mental health support programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => openDonationModal({
                  source: 'healthcare-access-program',
                  category: 'general',
                  title: 'Support Healthcare Access Program',
                  description: 'Help provide essential healthcare services to underserved communities.'
                })}
                className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-medium text-base transition-colors shadow-glow hover:shadow-glow-lg font-sans inline-flex items-center justify-center"
              >
                Support Healthcare
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <Link
                href="/volunteer"
                className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white border border-gray-300 dark:border-transparent px-8 py-4 rounded-full font-medium text-base transition-colors font-sans text-center inline-flex items-center justify-center"
              >
                Volunteer as Medical Professional
                <Stethoscope className="w-5 h-5 ml-2" />
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

      {/* Healthcare Services */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-6 font-display">
              Comprehensive Healthcare Services
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our program addresses the full spectrum of healthcare needs in underserved communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {healthcareServices.map((service, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center mr-4">
                    <service.icon className="w-6 h-6 text-accent-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white font-display">
                    {service.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="space-y-2">
                  {service.details.map((detail, detailIndex) => (
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

      {/* Medical Programs */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-6 font-display">
              Active Medical Programs
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Ongoing healthcare programs delivering consistent medical services to communities in need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {medicalPrograms.map((program, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {program.program}
                  </h3>
                  <span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-sm">
                    Active
                  </span>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Coverage</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{program.coverage}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Services</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{program.services}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="font-semibold text-accent-400 text-sm">{program.beneficiaries}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Beneficiaries</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="font-semibold text-accent-400 text-sm">{program.impact}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Success Rate</div>
                    </div>
                  </div>
                  <div className="bg-accent-500/10 rounded-lg p-3">
                    <p className="text-accent-400 text-sm font-medium">{program.frequency}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Challenges & Solutions */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-6 font-display">
              Addressing Health Challenges
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Identifying community health challenges and implementing effective solutions.
            </p>
          </div>

          <div className="space-y-8">
            {healthChallenges.map((item, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8">
                <div className="md:flex md:items-start md:space-x-8">
                  <div className="md:w-1/3 mb-6 md:mb-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {item.challenge}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {item.description}
                    </p>
                  </div>
                  <div className="md:w-1/3 mb-6 md:mb-0">
                    <h4 className="text-accent-400 font-semibold mb-3">Our Solution</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {item.solution}
                    </p>
                  </div>
                  <div className="md:w-1/3">
                    <h4 className="text-green-600 font-semibold mb-3">Impact</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {item.impact}
                    </p>
                  </div>
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
              Lives Transformed
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Real stories of health transformation and recovery through our healthcare programs.
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
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{story.location}</p>
                    </div>
                    <div className="flex items-center text-green-500">
                      <Heart className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 mb-3">
                    <div className="text-red-600 dark:text-red-400 text-sm font-semibold">{story.condition}</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mb-4">
                    <div className="text-green-600 dark:text-green-400 text-sm font-semibold">{story.outcome}</div>
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

      {/* Healthcare Impact */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-6 font-display">
              Healthcare Impact Metrics
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Measurable improvements in community health outcomes through our programs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {healthcareImpact.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {metric.area}
                  </h3>
                  <div className={`text-2xl font-bold mb-2 ${
                    metric.trend === 'up' ? 'text-green-500' : 'text-accent-400'
                  }`}>
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
              Support Healthcare Access
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose how you'd like to contribute to improving healthcare access in underserved communities.
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
                    source: `healthcare-access-${option.title.toLowerCase().replace(/\s+/g, '-')}`,
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
            Save Lives Through Healthcare
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Join us in providing essential healthcare services to communities that need it most. Your support saves lives.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex items-center justify-center">
              <Phone className="w-5 h-5 text-accent-400 mr-3" />
              <span className="text-gray-600 dark:text-gray-300">+234 (0) 123 456 7890</span>
            </div>
            <div className="flex items-center justify-center">
              <Mail className="w-5 h-5 text-accent-400 mr-3" />
              <span className="text-gray-600 dark:text-gray-300">healthcare@saintlammyfoundation.org</span>
            </div>
            <div className="flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent-400 mr-3" />
              <span className="text-gray-600 dark:text-gray-300">24/7 Emergency Support</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => openDonationModal({
                source: 'healthcare-access-cta',
                category: 'general',
                title: 'Support Healthcare Access Program',
                description: 'Help provide essential healthcare services and save lives in underserved communities.'
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

export default HealthcareAccessProgram;