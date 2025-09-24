import React from 'react';
import Image from 'next/image';
import { ComponentProps } from '@/types';
import { Quote, Star } from 'lucide-react';
import { useDonationModal } from './DonationModalProvider';

interface SuccessStory {
  id: string;
  name: string;
  age?: number;
  location: string;
  story: string;
  quote: string;
  image: string;
  category: 'orphan' | 'widow' | 'community';
  impact: string;
  dateHelped: string;
}

interface SuccessStoriesProps extends ComponentProps {}

const SuccessStories: React.FC<SuccessStoriesProps> = ({ className = '' }) => {
  const { openDonationModal } = useDonationModal();

  const stories: SuccessStory[] = [
    {
      id: '1',
      name: 'Amara N.',
      age: 12,
      location: 'Lagos, Nigeria',
      story: 'Amara lost both parents in a car accident when she was 8. Through our orphan support program, she has received consistent education funding, healthcare, and emotional support.',
      quote: "Before Saintlammy Foundation found me, I thought my dreams of becoming a doctor were impossible. Now I'm excelling in school and know that anything is possible with the right support.",
      image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'orphan',
      impact: 'Maintained 95% attendance rate and top 10% academic performance',
      dateHelped: 'January 2022'
    },
    {
      id: '2',
      name: 'Mrs. Folake O.',
      age: 34,
      location: 'Ibadan, Nigeria',
      story: 'After losing her husband, Folake struggled to feed her three children. Our widow empowerment program provided monthly stipends and helped her start a small tailoring business.',
      quote: "The foundation didn't just give me money - they gave me hope and the tools to build a better future for my children. My tailoring business now supports my family independently.",
      image: 'https://images.unsplash.com/photo-1494790108755-2616c34ca2f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'widow',
      impact: 'Achieved financial independence and expanded business to employ 3 others',
      dateHelped: 'March 2022'
    },
    {
      id: '3',
      name: 'Emmanuel A.',
      age: 16,
      location: 'Abuja, Nigeria',
      story: 'Emmanuel was living on the streets when our outreach team found him. Through our comprehensive support program, he was enrolled in school and provided with safe housing.',
      quote: "I never thought I'd see the inside of a classroom again. Now I'm preparing for university and want to become an engineer to help build better communities.",
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'orphan',
      impact: 'Completed secondary education with honors and received university scholarship',
      dateHelped: 'September 2021'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'orphan':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'widow':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'community':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <section className={`py-24 bg-gray-900 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-display-md md:text-display-lg font-medium text-white mb-6 font-display tracking-tight">
            Lives Transformed
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            Real people, real impact. These are the faces and stories behind our mission to transform lives across Nigeria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <div
              key={story.id}
              className="group bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden hover:bg-gray-800/70 hover:border-gray-600 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={story.image}
                  alt={`Portrait of ${story.name}, a beneficiary of Saintlammy Foundation's ${story.category} support program from ${story.location}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading={index > 0 ? 'lazy' : 'eager'}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(story.category)}`}>
                    {story.category.charAt(0).toUpperCase() + story.category.slice(1)} Support
                  </span>
                </div>

                {/* Quote Icon */}
                <div className="absolute bottom-4 right-4">
                  <div className="w-10 h-10 bg-accent-500/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Quote className="w-5 h-5 text-accent-400" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1 font-display">
                      {story.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {story.age && `Age ${story.age} • `}{story.location}
                    </p>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-4 font-light">
                  {story.story}
                </p>

                <blockquote className="border-l-4 border-accent-500 pl-4 mb-4">
                  <p className="text-accent-100 text-sm italic font-medium leading-relaxed">
                    "{story.quote}"
                  </p>
                </blockquote>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Impact:</span>
                    <span className="text-green-400 font-medium">Successful</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {story.impact}
                  </p>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-700">
                    <span className="text-gray-400">Supported since:</span>
                    <span className="text-white font-medium">{story.dateHelped}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-accent-500/10 to-accent-600/10 border border-accent-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-white mb-4 font-display">
              Be Part of the Next Success Story
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto font-light">
              Every donation creates opportunities for transformation. Join us in writing more success stories across Nigeria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => openDonationModal({
                  source: 'success-stories',
                  category: 'orphan',
                  title: 'Support Success Stories',
                  description: 'Help create more life-changing success stories like these'
                })}
                className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded-full font-medium transition-colors text-center"
              >
                Sponsor a Child
              </button>
              <a
                href="/beneficiaries"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3 rounded-full font-medium transition-colors text-center"
              >
                View All Beneficiaries
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;