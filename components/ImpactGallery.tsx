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
        // Fallback to real 2025 data
        setImpactStories([
          {
            id: '1',
            title: 'Widows Food Support Outreach',
            description: 'Over 30 widows received carefully packed food supplies including rice, oil, garri, and seasoning items during our second official outreach.',
            image: 'https://images.unsplash.com/photo-1497375638960-ca368c7231e4?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            icon: 'Heart',
            category: 'Relief',
            date: 'August 25, 2025',
            fullStory: 'August 25, 2025 marked our second official outreach, bringing essential food relief to over 30 widows in Lagos. Held at our partner church location, this outreach addressed one of the most pressing needs faced by vulnerable widows—access to nutritious food.\n\nEach widow received carefully packed food supplies including rice, oil, garri, and essential seasoning items. These are staple foods that provide sustenance for entire households, and for many widows, these supplies meant the difference between eating and going hungry.\n\nThe distribution was deeply personal. Many widows shared heartbreaking stories of going days without proper meals before this outreach. Some spoke of feeding their children while going without food themselves. Others described the daily anxiety of not knowing where the next meal would come from.\n\nThe atmosphere was filled with testimonies of renewed hope, physical relief, and deep gratitude. Widows expressed that beyond the food, they felt seen, valued, and remembered. This outreach reinforced our core mission: to bring dignity and stability to every widow we encounter.\n\nImmediate nourishment was provided to 30+ vulnerable homes, but the impact went beyond physical sustenance—it restored hope and demonstrated that these courageous women are not forgotten.',
            location: 'Lagos, Nigeria',
            beneficiaries: 30,
            outcome: 'Immediate nourishment for 30+ homes. Testimonies of renewed hope and dignity.'
          },
          {
            id: '2',
            title: 'Open Medical Checkup Outreach',
            description: 'Free medical consultations and basic treatments provided for over 40 widows and less privileged individuals during our second outreach.',
            image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
            icon: 'Heart',
            category: 'Healthcare',
            date: 'September 21, 2025',
            fullStory: 'Our second major outreach on September 21, 2025 brought free healthcare services directly to those who needed it most. Held in partnership with a local church, the medical outreach provided comprehensive health screenings and consultations for over 40 widows and less privileged community members.\n\nQualified medical professionals volunteered their time to conduct thorough examinations, checking blood pressure, vision, and general health status. The screening led to early detection of 8+ health concerns including hypertension and vision challenges that would have otherwise gone undiagnosed.\n\nOne particularly touching moment was providing specialized eye drops and health supplements to a widow struggling with vision impairment. She had been unable to afford proper medical care and was brought to tears by the compassionate attention and practical help she received.\n\nDozens of attendees received hope, health guidance, and follow-up referrals. The outreach demonstrated that healthcare should be accessible to all, regardless of economic status.',
            location: 'Lagos, Nigeria',
            beneficiaries: 40,
            outcome: 'Early detection of 8+ health concerns. Dozens received hope and health guidance.'
          },
          {
            id: '3',
            title: 'Widow Empowerment Starter Support',
            description: 'Selected widows began receiving business starter items and monthly stipends, with one-on-one support sessions launched.',
            image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
            icon: 'Users',
            category: 'Empowerment',
            date: 'October 14, 2025',
            fullStory: 'October 14, 2025 marked the beginning of our structured Widow Empowerment Program, representing a shift from one-time relief to sustainable support. This initiative focuses on helping vulnerable widows achieve financial independence through practical business support and ongoing mentorship.\n\nThe first wave of the program saw 10+ carefully selected widows onboarded into our monthly adoption pipeline. Each widow receives business starter items tailored to their skills and interests, along with monthly stipends to help stabilize their households while they build their enterprises.\n\nWhat sets this program apart is the personalized approach. One-on-one support sessions were launched to provide individualized guidance, business mentorship, and emotional support. We recognize that each widow\'s journey is unique, and our support is designed to meet them where they are.\n\nThis is more than charity—it\'s partnership. We walk alongside these courageous women as they rebuild their lives, restore dignity to their families, and create sustainable income streams. The program continues to expand as we identify more widows in need and secure resources for their empowerment.',
            location: 'Lagos, Nigeria',
            beneficiaries: 10,
            outcome: 'First wave activated. 10+ widows onboarded into monthly adoption pipeline.'
          },
          {
            id: '4',
            title: 'Community Support for Vulnerable Homes',
            description: 'Groceries, sanitary materials, and children\'s supplies distributed to families in poor housing conditions throughout Lagos.',
            image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
            icon: 'Home',
            category: 'Relief',
            date: 'Ongoing since August 2025',
            fullStory: 'Since August 2025, we have been running continuous community support initiatives targeting vulnerable homes throughout Lagos. This ongoing program addresses the daily struggles faced by families living in poor housing conditions, battling inflation, and dealing with health crises.\n\nOur field teams regularly visit identified homes to deliver essential supplies including groceries, sanitary materials, and children\'s necessities. These distributions are done with dignity and respect, recognizing that every family deserves to be treated with honor regardless of their circumstances.\n\nThe economic pressures of inflation have pushed many families to the breaking point. A bag of rice that once cost ₦30,000 now exceeds ₦100,000. Medical expenses continue to rise. Our intervention has helped stabilize several homes that were under severe pressure, preventing situations from deteriorating into crisis.\n\nWhat makes this program special is the relational approach. We don\'t just drop off supplies—we build relationships, understand each family\'s specific needs, and provide tailored support. Some families need help with children\'s school fees. Others need medical support. Some need food security. We meet each need with compassion and practical action.\n\nThis work continues daily, funded by generous donors who understand that consistent, dignified care can make the difference between despair and hope for vulnerable families.',
            location: 'Lagos, Nigeria',
            beneficiaries: 200,
            outcome: 'Stabilized several homes under pressure. Direct care delivered with dignity.'
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
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
            { number: '6', label: 'Active Programs' },
            { number: '312', label: 'Lives Impacted' },
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
                sizes="(max-width: 768px) 100vw, 896px"
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