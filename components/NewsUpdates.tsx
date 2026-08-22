import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ComponentProps } from '@/types';
import { RiArrowRightUpLine, RiAwardLine, RiCalendarLine, RiHeart3Line, RiTeamLine } from 'react-icons/ri';
import { ActionLink, SectionHeading } from './home/HomePrimitives';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: 'outreach' | 'achievement' | 'partnership' | 'update';
  image: string;
  readTime: string;
  slug?: string;
}

interface NewsUpdatesProps extends ComponentProps {}

const NewsUpdates: React.FC<NewsUpdatesProps> = ({ className = '' }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news?limit=3');
        const data = await response.json();
        setNewsItems(data);
      } catch (error) {
        console.error('Error fetching news:', error);
        setNewsItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'outreach':
        return RiHeart3Line;
      case 'partnership':
        return RiTeamLine;
      case 'achievement':
        return RiAwardLine;
      default:
        return RiCalendarLine;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'outreach':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'partnership':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'achievement':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!loading && newsItems.length === 0) return null;

  return (
    <section className={`home-section home-section-paper home-news-section ${className}`}>
      <div className="home-container">
        <SectionHeading
          eyebrow="From the field"
          title={<>The work is moving. <span className="home-ink-accent">Follow along.</span></>}
          description="Outreach notes, programme updates and moments of progress from communities across Nigeria."
        />

        <div className="home-news-grid">
          {loading ? (
            [...Array(3)].map((_, index) => (
              <div key={index} className="home-bezel animate-pulse">
                <div className="home-bezel-core overflow-hidden">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-32"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
                </div>
              </div>
            ))
          ) : (
            newsItems.map((item, index) => {
            const CategoryIcon = getCategoryIcon(item.category);

            return (
              <a
                href={`/news/${item.slug || item.id}`}
                key={item.id}
                data-home-reveal
                className={`home-bezel home-news-bezel group block cursor-pointer ${index === 0 ? 'home-news-featured' : ''}`}
              >
                <article className="home-bezel-core home-news-card">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={`${item.title} - Latest update from Saintlammy Foundation`}
                    fill
                    className="object-cover home-image-motion"
                    loading={index > 0 ? 'lazy' : 'eager'}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                      <CategoryIcon className="w-3 h-3 mr-1" />
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </span>
                  </div>

                  {/* Read Time */}
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      {item.readTime}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <RiCalendarLine className="w-4 h-4 mr-2" />
                    {formatDate(item.date)}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 font-display group-hover:text-accent-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 font-light">
                    {item.excerpt}
                  </p>

                  <span className="inline-flex items-center text-accent-600 font-medium text-sm group/link">
                    Read More
                    <RiArrowRightUpLine className="w-4 h-4 ml-1 home-icon-motion" />
                  </span>
                </div>
                </article>
              </a>
            );
            })
          )}
        </div>

        {/* View All Button */}
        <div data-home-reveal className="mt-12">
          <ActionLink href="/news">View all updates</ActionLink>
        </div>
      </div>
    </section>
  );
};

export default NewsUpdates;
