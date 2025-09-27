import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import Navigation from '@/components/Navigation';
import Breadcrumb from '@/components/Breadcrumb';
import ErrorBoundary from '@/components/ErrorBoundary';
import { DonationModalProvider, useDonationModal } from '@/components/DonationModalProvider';
import { Users, GraduationCap, Heart, Building, Calendar, MapPin, Target, ArrowLeft, Share2 } from 'lucide-react';

interface StoryData {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  category: string;
  date: string;
  fullStory: string;
  location: string;
  beneficiaries: number;
  outcome: string;
  projectCost?: number;
  duration?: string;
  partnerOrganizations?: string[];
  nextSteps?: string;
  gallery?: string[];
}

interface StoryPageProps {
  story: StoryData | null;
}

const StoryContent: React.FC<StoryPageProps> = ({ story }) => {
  const { openDonationModal } = useDonationModal();

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Story Not Found</h1>
          <p className="text-gray-400 mb-6">The story you're looking for doesn't exist.</p>
          <a
            href="/gallery"
            className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            View All Stories
          </a>
        </div>
      </div>
    );
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return GraduationCap;
      case 'Heart':
        return Heart;
      case 'Users':
        return Users;
      case 'Building':
        return Building;
      default:
        return GraduationCap;
    }
  };

  const IconComponent = getIconComponent(story.icon);

  const handleSupportProject = () => {
    const categoryMap: Record<string, string> = {
      'Education': 'educational programs',
      'Healthcare': 'healthcare initiatives',
      'Empowerment': 'empowerment programs',
      'Infrastructure': 'infrastructure projects',
      'Emergency Relief': 'emergency relief efforts'
    };

    const programType = categoryMap[story.category] || 'similar programs';
    const categoryKey = story.category.toLowerCase() as 'education' | 'healthcare' | 'empowerment' | 'infrastructure';

    openDonationModal({
      source: 'story-page',
      category: categoryKey,
      title: `Support ${story.category} Programs`,
      description: `Help us fund more ${programType} like "${story.title}" that transform lives in Nigerian communities.`,
      suggestedAmount: story.category === 'Education' ? 50 : story.category === 'Healthcare' ? 75 : 100,
      storyId: story.id,
      programType: story.category
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: story.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Story link copied to clipboard!');
    }
  };

  return (
    <>
      <Head>
        <title>{story.title} - Impact Story | Saintlammy Foundation</title>
        <meta name="description" content={story.description} />
        <meta name="keywords" content={`${story.category}, Nigeria charity, impact story, ${story.location}`} />

        {/* Open Graph tags */}
        <meta property="og:title" content={story.title} />
        <meta property="og:description" content={story.description} />
        <meta property="og:image" content={story.image} />
        <meta property="og:type" content="article" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={story.title} />
        <meta name="twitter:description" content={story.description} />
        <meta name="twitter:image" content={story.image} />

        <link rel="canonical" href={`https://www.saintlammyfoundation.org/story/${story.id}`} />
      </Head>

      <Navigation onDonateClick={() => openDonationModal({
        source: 'general',
        title: 'Support Our Mission',
        description: 'Your donation helps us transform lives across Nigeria'
      })} />

      <ErrorBoundary>
        <main className="min-h-screen bg-gray-900 pt-16">
          {/* Hero Section */}
          <section className="relative py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center justify-between mb-8">
                <Breadcrumb
                  items={[
                    { label: 'Gallery', href: '/gallery' },
                    { label: story.title, current: true }
                  ]}
                />

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <a
                    href="/gallery"
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Gallery
                  </a>
                </div>
              </div>

              {/* Story Header */}
              <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden mb-8">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent"></div>

                {/* Header Content */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center mb-6">
                    <div className="bg-accent-500 rounded-full p-3 mr-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-accent-400 text-sm font-medium font-sans tracking-wide uppercase">
                        {story.category}
                      </span>
                      <span className="text-white/60 text-sm font-light">
                        {story.date}
                      </span>
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold text-white font-display mb-4">
                    {story.title}
                  </h1>
                  <p className="text-xl text-gray-300 max-w-3xl font-light">
                    {story.description}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Project Overview */}
          <section className="py-16 bg-gray-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Project Stats */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 sticky top-24">
                    <h2 className="text-2xl font-semibold text-white mb-8 font-display">
                      Project Overview
                    </h2>

                    <div className="space-y-6">
                      <div className="flex items-start">
                        <MapPin className="w-6 h-6 text-accent-400 mr-4 mt-1" />
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Location</div>
                          <div className="text-white font-medium">{story.location}</div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Users className="w-6 h-6 text-accent-400 mr-4 mt-1" />
                        <div>
                          <div className="text-sm text-gray-400 mb-1">People Impacted</div>
                          <div className="text-white font-medium">{story.beneficiaries.toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Target className="w-6 h-6 text-accent-400 mr-4 mt-1" />
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Key Outcome</div>
                          <div className="text-white font-medium">{story.outcome}</div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Calendar className="w-6 h-6 text-accent-400 mr-4 mt-1" />
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Project Date</div>
                          <div className="text-white font-medium">{story.date}</div>
                        </div>
                      </div>

                      {story.projectCost && (
                        <div className="flex items-start">
                          <div className="w-6 h-6 bg-accent-400 rounded-full flex items-center justify-center mr-4 mt-1">
                            <span className="text-white text-xs font-bold">₦</span>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Project Investment</div>
                            <div className="text-white font-medium">₦{story.projectCost.toLocaleString()}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-700">
                      <button
                        onClick={handleSupportProject}
                        className="w-full bg-accent-500 hover:bg-accent-600 text-white py-4 px-6 rounded-xl font-medium transition-colors mb-4"
                      >
                        Support Similar Projects
                      </button>
                      <a
                        href="/gallery"
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-medium transition-colors text-center block"
                      >
                        View More Stories
                      </a>
                    </div>
                  </div>
                </div>

                {/* Story Content */}
                <div className="lg:col-span-2">
                  <div className="prose prose-lg prose-invert max-w-none">
                    <div className="text-gray-300 leading-relaxed space-y-6">
                      {story.fullStory.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="text-lg font-light leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {story.partnerOrganizations && story.partnerOrganizations.length > 0 && (
                      <div className="mt-12 p-8 bg-gray-800/30 border border-gray-700 rounded-xl">
                        <h3 className="text-xl font-semibold text-white mb-4 font-display">
                          Partner Organizations
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {story.partnerOrganizations.map((partner, index) => (
                            <div key={index} className="text-gray-300 font-light">
                              • {partner}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {story.nextSteps && (
                      <div className="mt-12 p-8 bg-accent-500/10 border border-accent-500/30 rounded-xl">
                        <h3 className="text-xl font-semibold text-white mb-4 font-display">
                          What's Next
                        </h3>
                        <p className="text-gray-300 font-light leading-relaxed">
                          {story.nextSteps}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Related Stories CTA */}
          <section className="py-16 bg-black">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-display-md font-medium text-white mb-6 font-display tracking-tight">
                More Impact Stories
              </h2>
              <p className="text-lg text-gray-300 mb-8 font-light">
                Discover how your support continues to transform lives across Nigerian communities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/gallery"
                  className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-medium transition-colors"
                >
                  View All Stories
                </a>
                <button
                  onClick={handleSupportProject}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-medium transition-colors"
                >
                  Support This Cause
                </button>
              </div>
            </div>
          </section>
        </main>
      </ErrorBoundary>
    </>
  );
};

const StoryPage: React.FC<StoryPageProps> = (props) => {
  return (
    <DonationModalProvider>
      <StoryContent {...props} />
    </DonationModalProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string;

  // Mock data - in real implementation, fetch from API/database
  const stories: StoryData[] = [
    {
      id: '1',
      title: 'School Supplies Drive Success',
      description: 'Over 500 children received complete school supply packages, uniforms, and educational materials for the new academic year.',
      image: 'https://images.unsplash.com/photo-1497375638960-ca368c7231e4?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      icon: 'GraduationCap',
      category: 'Education',
      date: 'January 2024',
      fullStory: 'The 2024 Back-to-School Initiative was our most successful educational outreach to date. Working closely with local schools across Lagos and Abuja, we identified 500 children from vulnerable families who needed support to start the new academic year.\n\nEach child received a comprehensive package including school bags, notebooks, pens, pencils, mathematical sets, and age-appropriate reading materials. Additionally, we provided school uniforms and shoes to ensure every child could attend school with dignity.\n\nThe initiative also included educational scholarships for 50 orphaned children, covering their full tuition fees for the academic year. We established partnerships with three schools to ensure ongoing monitoring and support.\n\nParent feedback has been overwhelmingly positive, with 98% reporting improved school attendance and academic performance among their children. Teachers noted increased engagement and participation from supported students.\n\nThe program\'s success was made possible through collaboration with local education authorities, community leaders, and volunteer coordinators who helped identify the most deserving beneficiaries.',
      location: 'Lagos & Abuja, Nigeria',
      beneficiaries: 500,
      outcome: '98% improved school attendance and academic performance',
      projectCost: 2500000,
      duration: '3 months planning, 1 month distribution',
      partnerOrganizations: [
        'Lagos State Ministry of Education',
        'Federal Capital Territory Education Authority',
        'Community Education Trust',
        'Parent-Teacher Associations Network'
      ],
      nextSteps: 'We are planning to expand this initiative to reach 1,000 children in the next academic year, with additional focus on digital learning tools and teacher training programs.'
    },
    {
      id: '2',
      title: 'Mobile Health Clinic Launch',
      description: 'Our new mobile healthcare unit reached 12 rural communities, providing free medical checkups and treatments.',
      image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      icon: 'Heart',
      category: 'Healthcare',
      date: 'February 2024',
      fullStory: 'Our mobile health clinic initiative brings essential healthcare services directly to underserved rural communities across Nigeria. The fully equipped medical van visits remote villages where healthcare access is limited or non-existent.\n\nThe clinic is staffed by qualified doctors, nurses, and community health workers who provide comprehensive services including general consultations, maternal health services, childhood immunizations, and health education sessions.\n\nDuring the first quarter, we reached 12 communities and served over 1,200 patients. Common conditions treated included malaria, respiratory infections, and hypertension. We also conducted health screenings that led to early detection of serious conditions in 45 patients, who were then referred to partner hospitals.\n\nThe program has established permanent health records for each community and trained local health ambassadors to provide basic care between clinic visits.\n\nCommunity leaders report significant improvements in overall health outcomes, with a 40% reduction in preventable diseases and increased health awareness among residents.',
      location: 'Rural communities across Nigeria',
      beneficiaries: 1200,
      outcome: 'Early detection of serious conditions in 45 patients, 100% immunization coverage',
      projectCost: 4200000,
      duration: '6 months setup, ongoing monthly visits',
      partnerOrganizations: [
        'Nigerian Medical Association',
        'Rural Health Initiative',
        'Community Health Workers Network',
        'Partner Hospitals Consortium'
      ],
      nextSteps: 'Plans to acquire two additional mobile units and expand coverage to 25 more communities by the end of the year.'
    },
    {
      id: '3',
      title: 'Widow Empowerment Graduation',
      description: '35 widows completed our skills training program and received startup funds for their new businesses.',
      image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      icon: 'Users',
      category: 'Empowerment',
      date: 'March 2024',
      fullStory: 'The Widow Empowerment Program represents our commitment to helping vulnerable women achieve financial independence and dignity. This comprehensive 6-month program combines skills training, financial literacy, and mentorship.\n\nParticipants chose from various vocational tracks including tailoring, catering, hairdressing, soap making, and small-scale farming. Each program included business management training, basic accounting, and marketing skills.\n\nUpon graduation, each participant received a startup package worth ₦150,000 including equipment, initial inventory, and working capital. We also facilitated access to microfinance loans for business expansion.\n\nSix months post-graduation, 90% of participants report sustainable income generation, with average monthly earnings of ₦85,000. Many have expanded their businesses and now employ others in their communities.\n\nThe program includes ongoing mentorship and market linkage support to ensure long-term sustainability of the businesses.',
      location: 'Ibadan, Kaduna & Port Harcourt',
      beneficiaries: 35,
      outcome: '90% achieved financial independence with average monthly income of ₦85,000',
      projectCost: 5250000,
      duration: '6 months training, 12 months follow-up support',
      partnerOrganizations: [
        'Women Empowerment Network',
        'Microfinance Institutions',
        'Small Business Development Center',
        'Market Vendors Association'
      ],
      nextSteps: 'Expanding the program to include 100 more widows across 5 additional states, with focus on digital skills and e-commerce training.'
    },
    {
      id: '4',
      title: 'Community Center Opening',
      description: 'Grand opening of our new community center in Abuja, providing safe space for education and community activities.',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      icon: 'Building',
      category: 'Infrastructure',
      date: 'April 2024',
      fullStory: 'The Abuja Community Center project addresses the critical need for safe, accessible community spaces in underserved neighborhoods. The 2,000 square meter facility serves as a hub for education, skills training, and community gatherings.\n\nThe center features six classrooms, a computer laboratory with 20 workstations, a library stocked with over 1,000 books, a multipurpose hall for community events, and a playground for children. Solar panels provide sustainable electricity, and a borehole ensures clean water access.\n\nSince opening, the center has hosted literacy classes for 150 adults, after-school programs for 200 children, and weekend skills workshops. The facility also serves as a venue for community meetings, cultural events, and emergency shelter during crises.\n\nLocal community leaders report significant improvements in youth engagement and a 60% reduction in juvenile delinquency in the surrounding area.\n\nThe center operates with a team of 8 full-time staff and over 30 volunteers from the community.',
      location: 'Kubwa, Abuja',
      beneficiaries: 2500,
      outcome: '60% reduction in juvenile delinquency, 350 people in regular programs',
      projectCost: 18500000,
      duration: '18 months construction, ongoing operations',
      partnerOrganizations: [
        'Abuja Municipal Area Council',
        'Community Development Association',
        'Youth Development Foundation',
        'Local Construction Cooperative'
      ],
      nextSteps: 'Plans to establish similar community centers in 3 additional underserved communities across the FCT over the next two years.'
    }
  ];

  const story = stories.find(s => s.id === slug) || null;

  return {
    props: {
      story
    }
  };
};

export default StoryPage;