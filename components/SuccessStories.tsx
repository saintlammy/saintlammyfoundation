import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ComponentProps } from '@/types';
import { RiDoubleQuotesL, RiStarFill } from 'react-icons/ri';
import { useDonationModal } from './DonationModalProvider';
import { truncateForCard } from '@/lib/textUtils';
import { ActionButton, ActionLink, DoubleBezel, SectionHeading } from './home/HomePrimitives';

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
    <section className={`home-section home-section-paper home-success-stories ${className}`}>
      <div className="home-container">
        <SectionHeading
          eyebrow="Proof of possibility"
          title={<>Lives changed. <span className="home-ink-accent">Futures reopened.</span></>}
          description="Real people and real outcomes—the human stories behind our work across Nigeria."
        />

        <div className="home-story-grid">
          {loading ? (
            // Loading skeleton
            [...Array(3)].map((_, index) => (
              <div key={index} className="home-bezel home-story-bezel animate-pulse">
                <div className="home-bezel-core overflow-hidden">
                <div className="h-64 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                </div>
              </div>
            ))
          ) : (
            stories.map((story, index) => (
            <div
              key={story.id}
              data-home-reveal
              className="home-bezel home-story-bezel group"
            >
              <article className="home-bezel-core home-story-card">
              {/* Image */}
              <div className="home-story-photo relative h-64 overflow-hidden">
                <Image
                  src={story.image}
                  alt={`Portrait of ${story.name}, a beneficiary of Saintlammy Foundation's ${story.category} support program from ${story.location}`}
                  fill
                  className="object-cover home-image-motion"
                  loading={index > 0 ? 'lazy' : 'eager'}
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
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
                  <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                    <RiDoubleQuotesL className="w-5 h-5 text-accent-600" />
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
                      <RiStarFill key={i} className="w-4 h-4 text-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 font-light">
                  {truncateForCard(story.story, 3)}
                </p>

                <blockquote className="mb-4">
                  <p className="text-accent-600 dark:text-accent-100 text-sm italic font-medium leading-relaxed">
                    &ldquo;{truncateForCard(story.quote, 2)}&rdquo;
                  </p>
                </blockquote>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Impact:</span>
                    <span className="text-green-400 font-medium">Successful</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {truncateForCard(story.impact, 2)}
                  </p>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Supported since:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{story.dateHelped}</span>
                  </div>
                </div>
              </div>
              </article>
            </div>
            ))
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-16">
          <DoubleBezel coreClassName="home-inline-cta">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 font-display">
              Be Part of the Next Success Story
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto font-light">
              Every donation creates opportunities for transformation. Join us in writing more success stories across Nigeria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ActionButton
                onClick={() => openDonationModal({
                  source: 'success-stories',
                  category: 'orphan',
                  title: 'Support Success Stories',
                  description: 'Help create more life-changing success stories like these'
                })}
              >
                Sponsor a Child
              </ActionButton>
              <ActionLink href="/beneficiaries" tone="secondary">View all beneficiaries</ActionLink>
            </div>
          </DoubleBezel>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
