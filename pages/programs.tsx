import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { GraduationCap, Heart, Home, Users, Target, DollarSign, TrendingUp, Award } from 'lucide-react';
import { DonationModalProvider, useDonationModal } from '@/components/DonationModalProvider';

const ProgramsContent: React.FC = () => {
  const { openDonationModal } = useDonationModal();
  const mainPrograms = [
    {
      id: 1,
      title: 'Orphan Adoption Program',
      description: 'Comprehensive support system for orphaned children including education, healthcare, housing, and emotional support.',
      image: 'https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      icon: Heart,
      category: 'Child Welfare',
      beneficiaries: 300,
      monthlyBudget: 450000,
      features: [
        'Educational scholarships and school supplies',
        'Medical care and health insurance',
        'Psychological counseling and mentorship',
        'Skills training and career guidance',
        'Housing support in partner orphanages'
      ],
      impact: {
        'Children Supported': '300+',
        'Educational Success Rate': '85%',
        'Health Outcomes': '95% improved',
        'Monthly Budget': '₦450,000'
      }
    },
    {
      id: 2,
      title: 'Widow Empowerment Initiative',
      description: 'Economic empowerment program helping widows become financially independent through skills training and micro-business support.',
      image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      icon: Users,
      category: 'Economic Empowerment',
      beneficiaries: 500,
      monthlyBudget: 320000,
      features: [
        'Tailoring and fashion design training',
        'Soap making and cosmetics production',
        'Small business management courses',
        'Micro-loan access and financial literacy',
        'Market linkage and sales support'
      ],
      impact: {
        'Widows Empowered': '500+',
        'Businesses Started': '180',
        'Income Increase': '65% average',
        'Monthly Budget': '₦320,000'
      }
    },
    {
      id: 3,
      title: 'Educational Excellence Program',
      description: 'Scholarship program and educational support for children from vulnerable families to ensure quality education access.',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      icon: GraduationCap,
      category: 'Education',
      beneficiaries: 450,
      monthlyBudget: 280000,
      features: [
        'Full and partial scholarships',
        'School supplies and uniforms',
        'Computer literacy training',
        'After-school tutoring programs',
        'University placement support'
      ],
      impact: {
        'Students Supported': '450+',
        'Graduation Rate': '92%',
        'University Admissions': '78%',
        'Monthly Budget': '₦280,000'
      }
    },
    {
      id: 4,
      title: 'Healthcare Access Program',
      description: 'Providing healthcare services and medical support to underserved communities through mobile clinics and health education.',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      icon: Heart,
      category: 'Healthcare',
      beneficiaries: 1200,
      monthlyBudget: 380000,
      features: [
        'Mobile medical clinics',
        'Free medications and treatments',
        'Health education and prevention',
        'Maternal and child health services',
        'Mental health support and counseling'
      ],
      impact: {
        'Patients Treated': '1,200+',
        'Medical Consultations': '3,500+',
        'Lives Saved': '25+',
        'Monthly Budget': '₦380,000'
      }
    }
  ];

  const supportPrograms = [
    {
      title: 'Emergency Relief Fund',
      description: 'Rapid response support for families facing urgent crises',
      icon: Target,
      budget: '₦150,000/month'
    },
    {
      title: 'Food Security Initiative',
      description: 'Regular food distribution to vulnerable households',
      icon: Home,
      budget: '₦200,000/month'
    },
    {
      title: 'Clean Water Projects',
      description: 'Installing water systems in rural communities',
      icon: Award,
      budget: '₦100,000/month'
    },
    {
      title: 'Digital Literacy Program',
      description: 'Computer skills training for youth and adults',
      icon: TrendingUp,
      budget: '₦80,000/month'
    }
  ];

  const programStats = [
    { label: 'Total Beneficiaries', value: '2,450+', icon: Users },
    { label: 'Active Programs', value: '8', icon: Target },
    { label: 'Monthly Budget', value: '₦1.43M', icon: DollarSign },
    { label: 'Success Rate', value: '87%', icon: TrendingUp }
  ];

  return (
    <>
      <Head>
        <title>Programs - Saintlammy Foundation</title>
        <meta name="description" content="Explore Saintlammy Foundation's comprehensive programs supporting orphans, widows, education, and healthcare across Nigeria." />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="relative py-32 bg-gray-900">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Educational program"
              fill
              className="object-cover object-center opacity-30"
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-medium text-white mb-6 font-display tracking-tight">
              Our Programs
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed">
              Comprehensive programs designed to create lasting impact in the lives of widows, orphans, and vulnerable communities.
            </p>
          </div>
        </section>

        {/* Program Stats */}
        <section className="py-24 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                Program Impact Overview
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                Real numbers showing the tangible difference our programs make every month
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {programStats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <stat.icon className="w-8 h-8 text-accent-400" />
                  </div>
                  <div className="text-3xl md:text-4xl font-medium text-accent-400 mb-2 group-hover:scale-110 transition-transform font-display tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium text-sm font-sans">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Programs */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                Core Programs
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                Our flagship programs addressing the most critical needs in our communities
              </p>
            </div>

            <div className="space-y-16">
              {mainPrograms.map((program, index) => (
                <div key={program.id} className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-accent-500 transition-colors shadow-lg dark:shadow-none">
                  <div className={`md:flex ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="md:w-1/2 relative h-64 md:h-80">
                      <Image
                        src={program.image}
                        alt={program.title}
                        fill
                        className="object-cover object-center"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-xs font-medium">
                          {program.category}
                        </span>
                      </div>
                    </div>

                    <div className="md:w-1/2 p-8 md:p-12">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center mr-4">
                          <program.icon className="w-6 h-6 text-accent-400" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white font-display">{program.title}</h3>
                          <p className="text-accent-400 text-sm font-medium">{program.beneficiaries} Beneficiaries</p>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed mb-6">{program.description}</p>

                      <div className="space-y-2 mb-6">
                        <h4 className="text-gray-900 dark:text-white font-semibold text-sm mb-3">Program Features:</h4>
                        {program.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-accent-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-600 dark:text-gray-300 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {Object.entries(program.impact).map(([key, value]) => (
                          <div key={key} className="text-center p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                            <div className="text-accent-400 font-semibold text-sm">{value}</div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">{key}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <button className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-full font-medium text-sm transition-colors font-sans">
                          Support This Program
                        </button>
                        <button className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white border border-gray-300 dark:border-transparent px-6 py-3 rounded-full font-medium text-sm transition-colors font-sans">
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Support Programs */}
        <section className="py-24 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                Support Programs
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                Additional programs complementing our core initiatives
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {supportPrograms.map((program, index) => (
                <div key={index} className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-accent-500 transition-colors text-center group shadow-lg dark:shadow-none">
                  <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <program.icon className="w-6 h-6 text-accent-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-display">{program.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-light mb-4">{program.description}</p>
                  <div className="inline-flex items-center px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-xs font-medium">
                    {program.budget}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How Programs Work */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                How Our Programs Work
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                A systematic approach ensuring maximum impact and transparency
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  step: '01',
                  title: 'Needs Assessment',
                  description: 'We conduct thorough community assessments to identify the most pressing needs and eligible beneficiaries.'
                },
                {
                  step: '02',
                  title: 'Program Design',
                  description: 'Each program is carefully designed with clear objectives, timelines, and measurable success metrics.'
                },
                {
                  step: '03',
                  title: 'Implementation',
                  description: 'Programs are rolled out with dedicated teams, regular monitoring, and continuous support for beneficiaries.'
                },
                {
                  step: '04',
                  title: 'Impact Measurement',
                  description: 'We track progress, measure outcomes, and provide transparent reporting to all stakeholders and donors.'
                }
              ].map((item, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{item.step}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 font-display">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-white dark:bg-black">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
              Support Our Programs
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Your support makes these programs possible. Choose how you'd like to contribute to transforming lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => openDonationModal({
                  source: 'general',
                  title: 'Support Our Programs',
                  description: 'Help us continue running these transformative programs'
                })}
                className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-medium text-base transition-colors shadow-glow hover:shadow-glow-lg font-sans"
              >
                Donate Now
              </button>
              <button className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white border border-gray-300 dark:border-transparent px-8 py-4 rounded-full font-medium text-base transition-colors font-sans">
                Become a Partner
              </button>
            </div>
          </div>
        </section>
      </Layout>

    </>
  );
};

const Programs: React.FC = () => {
  return (
    <DonationModalProvider>
      <ProgramsContent />
    </DonationModalProvider>
  );
};

// Enable ISR for better performance
export async function getStaticProps() {
  return {
    props: {},
    revalidate: 3600 // Revalidate every hour
  };
}

export default Programs;