import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import Navigation from '@/components/Navigation';
import Breadcrumb from '@/components/Breadcrumb';
import SponsorModal from '@/components/SponsorModal';
import ErrorBoundary from '@/components/ErrorBoundary';
import { DonationModalProvider, useDonationModal } from '@/components/DonationModalProvider';
import { User, MapPin, GraduationCap, Home, Heart, Search, Filter, ChevronDown } from 'lucide-react';

interface Beneficiary {
  id: string;
  name: string;
  age: number;
  location: string;
  category: 'orphan' | 'widow' | 'family';
  story: string;
  needs: string[];
  monthlyCost: number;
  image: string;
  schoolGrade?: string;
  familySize?: number;
  dreamAspiration?: string;
  isSponsored?: boolean;
}

interface BeneficiariesPageProps {
  beneficiaries: Beneficiary[];
  categories: string[];
  locations: string[];
}

const BeneficiariesContent: React.FC<BeneficiariesPageProps> = ({
  beneficiaries,
  categories,
  locations
}) => {
  const { openDonationModal } = useDonationModal();
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showSponsored, setShowSponsored] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'age' | 'cost'>('name');

  const filteredBeneficiaries = beneficiaries
    .filter(beneficiary => {
      const matchesSearch = beneficiary.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           beneficiary.story.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || beneficiary.category === selectedCategory;
      const matchesLocation = selectedLocation === 'all' || beneficiary.location.includes(selectedLocation);
      const matchesSponsored = showSponsored || !beneficiary.isSponsored;

      return matchesSearch && matchesCategory && matchesLocation && matchesSponsored;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'age':
          return a.age - b.age;
        case 'cost':
          return a.monthlyCost - b.monthlyCost;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleSponsorClick = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setIsSponsorModalOpen(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'orphan':
        return GraduationCap;
      case 'widow':
        return Home;
      default:
        return User;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'orphan':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'widow':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const statsCards = [
    {
      label: 'Total Beneficiaries',
      value: beneficiaries.length.toString(),
      color: 'text-blue-400'
    },
    {
      label: 'Awaiting Sponsors',
      value: beneficiaries.filter(b => !b.isSponsored).length.toString(),
      color: 'text-yellow-400'
    },
    {
      label: 'Currently Sponsored',
      value: beneficiaries.filter(b => b.isSponsored).length.toString(),
      color: 'text-green-400'
    },
    {
      label: 'Locations Served',
      value: locations.length.toString(),
      color: 'text-purple-400'
    }
  ];

  return (
    <>
      <Head>
        <title>Our Beneficiaries - Saintlammy Foundation</title>
        <meta
          name="description"
          content="Meet the children, widows, and families we support across Nigeria. Learn their stories and consider sponsoring a life to create lasting impact."
        />
        <meta name="keywords" content="sponsor child Nigeria, adopt orphan, support widow, beneficiaries, charity sponsorship" />
        <link rel="canonical" href="https://www.saintlammyfoundation.org/beneficiaries" />
      </Head>

      <Navigation onDonateClick={() => openDonationModal({
        source: 'general',
        title: 'Support Our Mission',
        description: 'Your donation helps us transform lives across Nigeria'
      })} />

      <ErrorBoundary>
        <main className="min-h-screen bg-gray-900 pt-16">
          {/* Header Section */}
          <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="max-w-7xl mx-auto px-6">
              <Breadcrumb
                items={[{ label: 'Our Beneficiaries', current: true }]}
                className="mb-8"
              />

              <div className="text-center mb-12">
                <h1 className="text-display-lg md:text-display-xl font-medium text-white mb-6 font-display tracking-tight">
                  Our Beneficiaries
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                  Every face tells a story of hope, resilience, and potential. Meet the incredible individuals and families whose lives are being transformed through our programs.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                  <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
                    <div className={`text-3xl font-bold mb-2 font-display ${stat.color}`}>
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

          {/* Filters Section */}
          <section className="py-8 bg-black">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or story..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500 appearance-none"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}s
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>

                {/* Location Filter */}
                <div className="relative">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500 appearance-none"
                  >
                    <option value="all">All Locations</option>
                    {locations.map(location => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'age' | 'cost')}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500 appearance-none"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="age">Sort by Age</option>
                    <option value="cost">Sort by Cost</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Show Sponsored Toggle */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showSponsored}
                    onChange={(e) => setShowSponsored(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${showSponsored ? 'bg-accent-500' : 'bg-gray-600'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${showSponsored ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                  <span className="ml-3 text-gray-300">Include sponsored beneficiaries</span>
                </label>

                <div className="text-gray-400 text-sm">
                  Showing {filteredBeneficiaries.length} of {beneficiaries.length} beneficiaries
                </div>
              </div>
            </div>
          </section>

          {/* Beneficiaries Grid */}
          <section className="py-16 bg-gray-900">
            <div className="max-w-7xl mx-auto px-6">
              {filteredBeneficiaries.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No beneficiaries found</h3>
                  <p className="text-gray-400">Try adjusting your search criteria or filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredBeneficiaries.map((beneficiary) => {
                    const CategoryIcon = getCategoryIcon(beneficiary.category);

                    return (
                      <div
                        key={beneficiary.id}
                        className="group bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden hover:bg-gray-800/70 hover:border-gray-600 transition-all duration-300"
                      >
                        {/* Image */}
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={beneficiary.image}
                            alt={`${beneficiary.name} - Beneficiary of Saintlammy Foundation`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>

                          {/* Category Badge */}
                          <div className="absolute top-4 left-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(beneficiary.category)}`}>
                              <CategoryIcon className="w-3 h-3 mr-1" />
                              {beneficiary.category.charAt(0).toUpperCase() + beneficiary.category.slice(1)}
                            </span>
                          </div>

                          {/* Sponsored Badge */}
                          {beneficiary.isSponsored && (
                            <div className="absolute top-4 right-4">
                              <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded-full text-xs font-medium">
                                Sponsored
                              </span>
                            </div>
                          )}

                          {/* Monthly Cost */}
                          <div className="absolute bottom-4 right-4">
                            <span className="bg-black/60 backdrop-blur-sm text-accent-400 text-sm font-bold px-3 py-1 rounded-full">
                              ${beneficiary.monthlyCost}/mo
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-white mb-2 font-display">
                            {beneficiary.name}
                          </h3>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-gray-400 text-sm">
                              <User className="w-4 h-4 mr-2" />
                              <span>{beneficiary.age} years old</span>
                            </div>
                            <div className="flex items-center text-gray-400 text-sm">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span>{beneficiary.location}</span>
                            </div>
                            {beneficiary.schoolGrade && (
                              <div className="flex items-center text-gray-400 text-sm">
                                <GraduationCap className="w-4 h-4 mr-2" />
                                <span>Grade {beneficiary.schoolGrade}</span>
                              </div>
                            )}
                          </div>

                          <p className="text-gray-300 text-sm leading-relaxed mb-6 font-light line-clamp-3">
                            {beneficiary.story}
                          </p>

                          <div className="space-y-3">
                            {!beneficiary.isSponsored ? (
                              <button
                                onClick={() => handleSponsorClick(beneficiary)}
                                className="w-full flex items-center justify-center space-x-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                              >
                                <Heart className="w-4 h-4" />
                                <span>Sponsor {beneficiary.name}</span>
                              </button>
                            ) : (
                              <div className="w-full bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-3 rounded-lg text-center font-medium">
                                Currently Sponsored
                              </div>
                            )}

                            <button
                              onClick={() => openDonationModal({
                                source: 'general',
                                title: 'Support Our Beneficiaries',
                                description: 'Help us support all our beneficiaries with general donations'
                              })}
                              className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                            >
                              Make a General Donation
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-16 bg-black">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-2xl font-semibold text-white mb-4 font-display">
                Can't Find the Right Match?
              </h2>
              <p className="text-gray-300 mb-8 font-light">
                Our team can help you find a beneficiary that aligns with your heart and interests. We're always welcoming new beneficiaries into our programs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded-full font-medium transition-colors">
                  Contact Our Team
                </button>
                <button
                  onClick={() => openDonationModal({
                    source: 'general',
                    title: 'General Donation',
                    description: 'Support all our programs with a general donation'
                  })}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3 rounded-full font-medium transition-colors"
                >
                  Make General Donation
                </button>
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

const BeneficiariesPage: React.FC<BeneficiariesPageProps> = (props) => {
  return <BeneficiariesContent {...props} />;
};

export const getStaticProps: GetStaticProps<BeneficiariesPageProps> = async () => {
  // In a real app, fetch from your database
  const beneficiaries: Beneficiary[] = [
    {
      id: 'amara-n',
      name: 'Amara N.',
      age: 12,
      location: 'Lagos, Nigeria',
      category: 'orphan',
      story: 'Amara lost both parents in a car accident when she was 8. Despite the challenges, she dreams of becoming a doctor to help other children. She excels in school and has a bright, curious mind.',
      needs: ['School fees and supplies', 'Healthcare', 'Nutritious meals', 'Emotional support'],
      monthlyCost: 85,
      image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      schoolGrade: '6',
      dreamAspiration: 'I want to become a doctor so I can help sick children get better, just like doctors helped me when I was sad.',
      isSponsored: false
    },
    {
      id: 'folake-o',
      name: 'Mrs. Folake O.',
      age: 34,
      location: 'Ibadan, Nigeria',
      category: 'widow',
      story: 'After losing her husband, Folake struggled to provide for her three young children. She is eager to learn new skills and start a small business to become self-sufficient.',
      needs: ['Business training', 'Micro-loan support', 'Childcare assistance', 'Basic necessities'],
      monthlyCost: 120,
      image: 'https://images.unsplash.com/photo-1494790108755-2616c34ca2f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      familySize: 4,
      dreamAspiration: 'I want to open a small shop so my children can go to school and have a better future than I had.',
      isSponsored: true
    },
    {
      id: 'emmanuel-a',
      name: 'Emmanuel A.',
      age: 16,
      location: 'Abuja, Nigeria',
      category: 'orphan',
      story: 'Emmanuel was living on the streets before our outreach team found him. He is incredibly intelligent and wants to study engineering. He\'s now back in school and excelling.',
      needs: ['Secondary school fees', 'Technical books', 'Computer access', 'University preparation'],
      monthlyCost: 95,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      schoolGrade: '11',
      dreamAspiration: 'I want to become an engineer and build bridges and roads to connect communities across Nigeria.',
      isSponsored: false
    },
    // Add more beneficiaries...
  ];

  const categories = Array.from(new Set(beneficiaries.map(b => b.category)));
  const locations = Array.from(new Set(beneficiaries.map(b => b.location.split(',')[1]?.trim() || b.location)));

  return {
    props: {
      beneficiaries,
      categories,
      locations
    },
    revalidate: 3600
  };
};

export default BeneficiariesPage;