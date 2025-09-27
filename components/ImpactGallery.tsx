import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDonationModal } from './DonationModalProvider';
import { Users, GraduationCap, Heart, Home, Building, X, Calendar, MapPin, Target } from 'lucide-react';

interface ImpactStory {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  category: string;
  date: string;
  fullStory?: string;
  location?: string;
  beneficiaries?: number;
  outcome?: string;
}

const ImpactGallery: React.FC = () => {
  const { openDonationModal } = useDonationModal();
  const [impactStories, setImpactStories] = useState<ImpactStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<ImpactStory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch('/api/gallery?limit=4');
        const data = await response.json();

        // Transform gallery data to match ImpactStory interface
        const transformedData = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          image: item.image,
          icon: item.icon,
          category: item.category,
          date: item.date || new Date().toLocaleDateString()
        }));

        setImpactStories(transformedData);
      } catch (error) {
        console.error('Error fetching gallery:', error);
        // Fallback to mock data
        setImpactStories([
          {
            id: '1',
            title: 'School Supplies Drive Success',
            description: 'Over 500 children received complete school supply packages, uniforms, and educational materials for the new academic year.',
            image: 'https://images.unsplash.com/photo-1497375638960-ca368c7231e4?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            icon: 'GraduationCap',
            category: 'Education',
            date: 'January 2024',
            fullStory: 'The 2024 Back-to-School Initiative was our most successful educational outreach to date. Working closely with local schools across Lagos and Abuja, we identified 500 children from vulnerable families who needed support to start the new academic year.\n\nEach child received a comprehensive package including school bags, notebooks, pens, pencils, mathematical sets, and age-appropriate reading materials. Additionally, we provided school uniforms and shoes to ensure every child could attend school with dignity.\n\nThe initiative also included educational scholarships for 50 orphaned children, covering their full tuition fees for the academic year. We established partnerships with three schools to ensure ongoing monitoring and support.\n\nParent feedback has been overwhelmingly positive, with 98% reporting improved school attendance and academic performance among their children.',
            location: 'Lagos & Abuja, Nigeria',
            beneficiaries: 500,
            outcome: '98% improved school attendance and academic performance'
          },
          {
            id: '2',
            title: 'Mobile Health Clinic Launch',
            description: 'Our new mobile healthcare unit reached 12 rural communities, providing free medical checkups and treatments.',
            image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
            icon: 'Heart',
            category: 'Healthcare',
            date: 'February 2024',
            fullStory: 'Our mobile health clinic initiative brings essential healthcare services directly to underserved rural communities across Nigeria. The fully equipped medical van visits remote villages where healthcare access is limited or non-existent.\n\nThe clinic is staffed by qualified doctors, nurses, and community health workers who provide comprehensive services including general consultations, maternal health services, childhood immunizations, and health education sessions.\n\nDuring the first quarter, we reached 12 communities and served over 1,200 patients. Common conditions treated included malaria, respiratory infections, and hypertension. We also conducted health screenings that led to early detection of serious conditions in 45 patients, who were then referred to partner hospitals.\n\nThe program has established permanent health records for each community and trained local health ambassadors to provide basic care between clinic visits.',
            location: 'Rural communities across Nigeria',
            beneficiaries: 1200,
            outcome: 'Early detection of serious conditions in 45 patients, 100% immunization coverage'
          },
          {
            id: '3',
            title: 'Widow Empowerment Graduation',
            description: '35 widows completed our skills training program and received startup funds for their new businesses.',
            image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
            icon: 'Users',
            category: 'Empowerment',
            date: 'March 2024',
            fullStory: 'The Widow Empowerment Program represents our commitment to helping vulnerable women achieve financial independence and dignity. This comprehensive 6-month program combines skills training, financial literacy, and mentorship.\n\nParticipants chose from various vocational tracks including tailoring, catering, hairdressing, soap making, and small-scale farming. Each program included business management training, basic accounting, and marketing skills.\n\nUpon graduation, each participant received a startup package worth ₦150,000 including equipment, initial inventory, and working capital. We also facilitated access to microfinance loans for business expansion.\n\nSix months post-graduation, 90% of participants report sustainable income generation, with average monthly earnings of ₦85,000. Many have expanded their businesses and now employ others in their communities.',
            location: 'Ibadan, Kaduna & Port Harcourt',
            beneficiaries: 35,
            outcome: '90% achieved financial independence with average monthly income of ₦85,000'
          },
          {
            id: '4',
            title: 'Community Center Opening',
            description: 'Grand opening of our new community center in Abuja, providing safe space for education and community activities.',
            image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
            icon: 'Building',
            category: 'Infrastructure',
            date: 'April 2024',
            fullStory: 'The Abuja Community Center project addresses the critical need for safe, accessible community spaces in underserved neighborhoods. The 2,000 square meter facility serves as a hub for education, skills training, and community gatherings.\n\nThe center features six classrooms, a computer laboratory with 20 workstations, a library stocked with over 1,000 books, a multipurpose hall for community events, and a playground for children. Solar panels provide sustainable electricity, and a borehole ensures clean water access.\n\nSince opening, the center has hosted literacy classes for 150 adults, after-school programs for 200 children, and weekend skills workshops. The facility also serves as a venue for community meetings, cultural events, and emergency shelter during crises.\n\nLocal community leaders report significant improvements in youth engagement and a 60% reduction in juvenile delinquency in the surrounding area.',
            location: 'Kubwa, Abuja',
            beneficiaries: 2500,
            outcome: '60% reduction in juvenile delinquency, 350 people in regular programs'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

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

  const handleReadStory = (story: ImpactStory) => {
    setSelectedStory(story);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStory(null);
  };

  const handleSupportProject = (story: ImpactStory) => {
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
      source: 'impact-story',
      category: categoryKey,
      title: `Support ${story.category} Programs`,
      description: `Help us fund more ${programType} like "${story.title}" that transform lives in Nigerian communities.`,
      suggestedAmount: story.category === 'Education' ? 50 : story.category === 'Healthcare' ? 75 : 100,
      storyId: story.id,
      programType: story.category
    });
    closeModal();
  };

  return (
    <section className="py-24 bg-gray-200 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
            Impact in Action
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            See how your donations are creating real, measurable change in communities across Nigeria.
            Every project is documented with full transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            [...Array(4)].map((_, index) => (
              <div
                key={index}
                className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl ${
                  index === 0 ? 'md:col-span-2 h-96' : 'h-80'
                }`}
              >
                <div className="h-full bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
              </div>
            ))
          ) : (
            impactStories.map((story, index) => {
              const IconComponent = getIconComponent(story.icon);
              return (
            <div
              key={story.id}
              className={`group relative overflow-hidden rounded-2xl ${
                index === 0 ? 'md:col-span-2 h-96' : 'h-80'
              }`}
            >
              {/* Background Image */}
              <Image
                src={story.image}
                alt={story.title}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                {/* Category Badge */}
                <div className="flex items-center mb-4">
                  <div className="bg-accent-500 rounded-full p-2 mr-3">
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-accent-400 text-sm font-medium font-sans tracking-wide uppercase">
                    {story.category}
                  </span>
                  <span className="text-white/60 text-sm ml-auto font-light">
                    {story.date}
                  </span>
                </div>

                {/* Title and Description */}
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 font-display">
                  {story.title}
                </h3>
                <p className="text-white/90 font-light text-sm leading-relaxed max-w-lg">
                  {story.description}
                </p>

                {/* CTA */}
                <button
                  onClick={() => handleReadStory(story)}
                  className="mt-4 inline-flex items-center text-accent-400 hover:text-accent-300 font-medium text-sm transition-colors group-hover:translate-x-1 duration-200 font-sans"
                >
                  Read Full Story
                  <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
              );
            })
          )}
        </div>

        {/* Bottom Statistics */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: '127', label: 'Active Projects' },
            { number: '15.8K', label: 'Lives Impacted' },
            { number: '89%', label: 'Funds to Programs' },
            { number: '24/7', label: 'Transparency' }
          ].map((stat, index) => (
            <div key={index} className="group">
              <div className="text-3xl md:text-4xl font-medium text-accent-500 dark:text-accent-400 mb-2 group-hover:scale-110 transition-transform font-display tracking-tight">
                {stat.number}
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium text-sm font-sans">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <a
            href="/gallery"
            className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-medium text-base transition-colors shadow-lg hover:shadow-xl font-sans inline-block"
          >
            View All Impact Stories
          </a>
        </div>
      </div>

      {/* Story Modal */}
      {isModalOpen && selectedStory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header Image */}
            <div className="relative h-64 md:h-80">
              <Image
                src={selectedStory.image}
                alt={selectedStory.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent"></div>

              {/* Header Content */}
              <div className="absolute bottom-6 left-6 right-16">
                <div className="flex items-center mb-4">
                  {(() => {
                    const IconComponent = getIconComponent(selectedStory.icon);
                    return (
                      <div className="bg-accent-500 rounded-full p-2 mr-3">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                    );
                  })()}
                  <span className="text-accent-400 text-sm font-medium font-sans tracking-wide uppercase">
                    {selectedStory.category}
                  </span>
                  <span className="text-white/60 text-sm ml-auto font-light">
                    {selectedStory.date}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white font-display">
                  {selectedStory.title}
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-20rem)]">
              {/* Project Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {selectedStory.location && (
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <MapPin className="w-5 h-5 text-accent-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-400">Location</div>
                      <div className="font-medium">{selectedStory.location}</div>
                    </div>
                  </div>
                )}
                {selectedStory.beneficiaries && (
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Users className="w-5 h-5 text-accent-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-400">Beneficiaries</div>
                      <div className="font-medium">{selectedStory.beneficiaries.toLocaleString()}</div>
                    </div>
                  </div>
                )}
                {selectedStory.outcome && (
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Target className="w-5 h-5 text-accent-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-400">Key Outcome</div>
                      <div className="font-medium text-sm">{selectedStory.outcome}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Full Story Content */}
              <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
                {selectedStory.fullStory ?
                  selectedStory.fullStory.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="font-light">
                      {paragraph}
                    </p>
                  )) :
                  <p className="font-light">{selectedStory.description}</p>
                }
              </div>

              {/* CTA */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  Stories like this are possible because of supporters like you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => handleSupportProject(selectedStory)}
                    className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Support Similar Projects
                  </button>
                  <a
                    href="/gallery"
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
                  >
                    View More Stories
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ImpactGallery;