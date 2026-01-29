import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ComponentProps } from '@/types';
import { Quote, Star } from 'lucide-react';
import { useDonationModal } from './DonationModalProvider';
import { truncateForCard } from '@/lib/textUtils';

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
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/stories?limit=3');
        const data = await response.json();
        setStories(data);
      } catch (error) {
        console.error('Error fetching stories:', error);
        // Fallback to empty array, API will return mock data on error
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

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
    <section className={`py-24 bg-gray-100 dark:bg-gray-900 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
            Lives Transformed
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            Real people, real impact. These are the faces and stories behind our mission to transform lives across Nigeria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Loading skeleton
            [...Array(3)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))
          ) : (
            stories.map((story, index) => (
            <div
              key={story.id}
              className="group bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-800/70 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

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
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 font-display">
                      {story.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {story.age && `Age ${story.age} • `}{story.location}
                    </p>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 font-light">
                  {truncateForCard(story.story, 3)}
                </p>

                <blockquote className="border-l-4 border-accent-500 pl-4 mb-4">
                  <p className="text-accent-600 dark:text-accent-100 text-sm italic font-medium leading-relaxed">
                    "{truncateForCard(story.quote, 2)}"
                  </p>
                </blockquote>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Impact:</span>
                    <span className="text-green-400 font-medium">Successful</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {story.impact}
                  </p>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Supported since:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{story.dateHelped}</span>
                  </div>
                </div>
              </div>
            </div>
            ))
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-accent-500/10 to-accent-600/10 border border-accent-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 font-display">
              Be Part of the Next Success Story
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto font-light">
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
                className="bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 px-8 py-3 rounded-full font-medium transition-colors text-center"
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