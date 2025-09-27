import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import Breadcrumb from '@/components/Breadcrumb';
import SponsorModal from '@/components/SponsorModal';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useDonationModal } from '@/components/DonationModalProvider';
import { Heart, Users, GraduationCap, Star, CheckCircle, ArrowRight, Gift, Target, Clock } from 'lucide-react';

interface SponsorshipTier {
  id: string;
  name: string;
  amount: number;
  description: string;
  benefits: string[];
  popular?: boolean;
  icon: React.ElementType;
  color: string;
}

interface Beneficiary {
  id: string;
  name: string;
  age: number;
  location: string;
  category: 'orphan' | 'widow' | 'family';
  story: string;
  image: string;
  monthlyCost: number;
  isSponsored?: boolean;
}

const SponsorPage: React.FC = () => {
  const { openDonationModal } = useDonationModal();
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);

  const sponsorshipTiers: SponsorshipTier[] = [
    {
      id: 'basic',
      name: 'Basic Sponsor',
      amount: 50,
      description: 'Provide essential support for one beneficiary',
      benefits: [
        'Monthly updates on your beneficiary',
        'Quarterly photos and stories',
        'Annual impact report',
        'Access to sponsor community'
      ],
      icon: Heart,
      color: 'bg-blue-500'
    },
    {
      id: 'premium',
      name: 'Premium Sponsor',
      amount: 100,
      description: 'Comprehensive support with enhanced engagement',
      benefits: [
        'All Basic Sponsor benefits',
        'Monthly video updates',
        'Direct communication with beneficiary',
        'Invitation to annual sponsor events',
        'Educational milestone celebrations'
      ],
      popular: true,
      icon: Star,
      color: 'bg-accent-500'
    },
    {
      id: 'champion',
      name: 'Champion Sponsor',
      amount: 200,
      description: 'Transform lives with premium sponsorship',
      benefits: [
        'All Premium Sponsor benefits',
        'Sponsor multiple beneficiaries',
        'Exclusive donor recognition',
        'Site visit opportunities',
        'Custom program development input',
        'Legacy impact documentation'
      ],
      icon: Target,
      color: 'bg-purple-500'
    }
  ];

  const featuredBeneficiaries: Beneficiary[] = [
    {
      id: 'amara-featured',
      name: 'Amara',
      age: 8,
      location: 'Lagos, Nigeria',
      category: 'orphan',
      story: 'Dreams of becoming a doctor to help other children like herself. Your sponsorship provides education, healthcare, and hope.',
      image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      monthlyCost: 85,
      isSponsored: false
    },
    {
      id: 'grace-featured',
      name: 'Grace',
      age: 35,
      location: 'Abuja, Nigeria',
      category: 'widow',
      story: 'Mother of three learning new skills to provide for her family. Your support helps her start a sustainable business.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616c34ca2f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      monthlyCost: 120,
      isSponsored: false
    },
    {
      id: 'emmanuel-featured',
      name: 'Emmanuel',
      age: 16,
      location: 'Port Harcourt, Nigeria',
      category: 'orphan',
      story: 'Passionate about technology and engineering. Your sponsorship gives him access to education and tools for his future.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      monthlyCost: 95,
      isSponsored: false
    }
  ];

  const handleSponsorClick = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setIsSponsorModalOpen(true);
  };

  const handleTierSelect = (tier: SponsorshipTier) => {
    openDonationModal({
      source: 'sponsorship',
      title: `${tier.name} - $${tier.amount}/month`,
      description: tier.description,
      suggestedAmount: tier.amount
    });
  };

  return (
    <>
      <Head>
        <title>Sponsor a Life - Transform Futures | Saintlammy Foundation</title>
        <meta
          name="description"
          content="Sponsor an orphan, widow, or vulnerable family in Nigeria. Create lasting impact through direct sponsorship programs. Choose your sponsorship level and change a life today."
        />
        <meta name="keywords" content="sponsor child Nigeria, orphan sponsorship, widow support, sponsor a family, child sponsorship Africa" />
        <link rel="canonical" href="https://www.saintlammyfoundation.org/sponsor" />
      </Head>

      <Navigation onDonateClick={() => openDonationModal({
        source: 'general',
        title: 'Support Our Mission',
        description: 'Your donation helps us transform lives across Nigeria'
      })} />

      <ErrorBoundary>
        <main className="min-h-screen bg-gray-900 pt-16">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="max-w-7xl mx-auto px-6">
              <Breadcrumb
                items={[{ label: 'Sponsor a Life', current: true }]}
                className="mb-8"
              />

              <div className="text-center mb-16">
                <h1 className="text-display-lg md:text-display-xl font-medium text-white mb-6 font-display tracking-tight">
                  Sponsor a Life, Transform a Future
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
                  Create lasting change through direct sponsorship. Connect with an orphan, widow, or vulnerable family
                  and witness the incredible transformation that your support makes possible.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                {[
                  { label: 'Lives Sponsored', value: '350+', icon: Heart },
                  { label: 'Active Sponsors', value: '280+', icon: Users },
                  { label: 'Success Stories', value: '150+', icon: Star },
                  { label: 'Years of Impact', value: '2+', icon: Clock }
                ].map((stat, index) => (
                  <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
                    <stat.icon className="w-8 h-8 text-accent-400 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-white mb-2 font-display">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Sponsorship Tiers */}
          <section className="py-20 bg-gray-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-display-md md:text-display-lg font-medium text-white mb-6 font-display tracking-tight">
                  Choose Your Sponsorship Level
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto font-light">
                  Every level of sponsorship creates meaningful impact. Choose the option that feels right for you.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {sponsorshipTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={`relative bg-gray-800/50 border rounded-2xl p-8 ${
                      tier.popular
                        ? 'border-accent-500 ring-2 ring-accent-500/20'
                        : 'border-gray-700 hover:border-gray-600'
                    } transition-all duration-300 hover:shadow-xl`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-accent-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="text-center">
                      <div className={`w-16 h-16 ${tier.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                        <tier.icon className="w-8 h-8 text-white" />
                      </div>

                      <h3 className="text-2xl font-semibold text-white mb-2 font-display">
                        {tier.name}
                      </h3>

                      <div className="mb-4">
                        <span className="text-4xl font-bold text-white">${tier.amount}</span>
                        <span className="text-gray-400 text-lg">/month</span>
                      </div>

                      <p className="text-gray-300 mb-8 font-light">
                        {tier.description}
                      </p>

                      <div className="space-y-4 mb-8">
                        {tier.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300 text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => handleTierSelect(tier)}
                        className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-300 ${
                          tier.popular
                            ? 'bg-accent-500 hover:bg-accent-600 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-white'
                        }`}
                      >
                        Start Sponsoring
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Beneficiaries */}
          <section className="py-20 bg-black">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-display-md md:text-display-lg font-medium text-white mb-6 font-display tracking-tight">
                  Meet Your Future Beneficiary
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto font-light">
                  These are just a few of the amazing individuals waiting for a sponsor like you.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredBeneficiaries.map((beneficiary) => (
                  <div
                    key={beneficiary.id}
                    className="group bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden hover:bg-gray-800/70 hover:border-gray-600 transition-all duration-300"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={beneficiary.image}
                        alt={`${beneficiary.name} - Available for sponsorship`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                      <div className="absolute bottom-4 right-4">
                        <span className="bg-accent-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                          ${beneficiary.monthlyCost}/mo
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-2 font-display">
                        {beneficiary.name}, {beneficiary.age}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">{beneficiary.location}</p>
                      <p className="text-gray-300 text-sm leading-relaxed mb-6 font-light">
                        {beneficiary.story}
                      </p>
                      <button
                        onClick={() => handleSponsorClick(beneficiary)}
                        className="w-full bg-accent-500 hover:bg-accent-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <Heart className="w-4 h-4" />
                        <span>Sponsor {beneficiary.name}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <a
                  href="/beneficiaries"
                  className="inline-flex items-center bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-medium transition-colors"
                >
                  View All Available Beneficiaries
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-20 bg-gray-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-display-md md:text-display-lg font-medium text-white mb-6 font-display tracking-tight">
                  How Sponsorship Works
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  {
                    step: '1',
                    title: 'Choose Your Level',
                    description: 'Select a sponsorship tier that fits your budget and desired impact',
                    icon: Target
                  },
                  {
                    step: '2',
                    title: 'Meet Your Beneficiary',
                    description: 'We match you with a beneficiary whose story resonates with you',
                    icon: Heart
                  },
                  {
                    step: '3',
                    title: 'Track Their Progress',
                    description: 'Receive regular updates, photos, and stories about their journey',
                    icon: GraduationCap
                  },
                  {
                    step: '4',
                    title: 'Celebrate Success',
                    description: 'Witness the transformation and celebrate their achievements',
                    icon: Star
                  }
                ].map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-accent-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="bg-accent-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                      {step.step}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3 font-display">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 text-sm font-light">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-black">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-display-md font-medium text-white mb-6 font-display tracking-tight">
                Ready to Change a Life Forever?
              </h2>
              <p className="text-lg text-gray-300 mb-8 font-light">
                Join hundreds of sponsors who are making a real difference. Your sponsorship doesn't just support someone—it transforms their entire future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => openDonationModal({
                    source: 'sponsorship',
                    title: 'Start Your Sponsorship Journey',
                    description: 'Begin transforming a life today'
                  })}
                  className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-medium transition-colors shadow-lg hover:shadow-xl"
                >
                  Start Sponsoring Today
                </button>
                <a
                  href="/beneficiaries"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-medium transition-colors"
                >
                  Browse Beneficiaries
                </a>
              </div>
            </div>
          </section>
        </main>
      </ErrorBoundary>

      {/* Sponsor Modal */}
      <SponsorModal
        isOpen={isSponsorModalOpen}
        onClose={() => setIsSponsorModalOpen(false)}
        beneficiary={selectedBeneficiary}
      />
    </>
  );
};


export default SponsorPage;