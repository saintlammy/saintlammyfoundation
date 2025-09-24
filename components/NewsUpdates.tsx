import React from 'react';
import Image from 'next/image';
import { ComponentProps } from '@/types';
import { Calendar, ArrowRight, Heart, Users, Award } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: 'outreach' | 'achievement' | 'partnership' | 'update';
  image: string;
  readTime: string;
}

interface NewsUpdatesProps extends ComponentProps {}

const NewsUpdates: React.FC<NewsUpdatesProps> = ({ className = '' }) => {
  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'December Medical Outreach Reaches 200+ Families',
      excerpt: 'Our largest medical outreach program provided free health screenings, medications, and health education to over 200 families in rural Ogun State.',
      date: '2024-12-15',
      category: 'outreach',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      readTime: '3 min read'
    },
    {
      id: '2',
      title: 'Partnership with Local Schools Expands Education Access',
      excerpt: 'New partnerships with 5 primary schools will provide educational materials, scholarships, and mentorship programs for 150 orphaned children.',
      date: '2024-12-10',
      category: 'partnership',
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      readTime: '4 min read'
    },
    {
      id: '3',
      title: 'Widow Empowerment Program Celebrates 50 New Businesses',
      excerpt: 'Through micro-loans and business training, 50 widows have successfully launched small businesses, achieving financial independence for their families.',
      date: '2024-12-05',
      category: 'achievement',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      readTime: '2 min read'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'outreach':
        return Heart;
      case 'partnership':
        return Users;
      case 'achievement':
        return Award;
      default:
        return Calendar;
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

  return (
    <section className={`py-24 bg-gray-900 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-display-md md:text-display-lg font-medium text-white mb-6 font-display tracking-tight">
            Latest News & Updates
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            Stay connected with our ongoing work and the impact we're creating together across Nigerian communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {newsItems.map((item, index) => {
            const CategoryIcon = getCategoryIcon(item.category);

            return (
              <article
                key={item.id}
                className="group bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden hover:bg-gray-800/70 hover:border-gray-600 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={`${item.title} - Latest update from Saintlammy Foundation`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    loading={index > 0 ? 'lazy' : 'eager'}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                      <CategoryIcon className="w-3 h-3 mr-1" />
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </span>
                  </div>

                  {/* Read Time */}
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                      {item.readTime}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-400 mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(item.date)}
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-3 font-display group-hover:text-accent-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-gray-300 text-sm leading-relaxed mb-4 font-light">
                    {item.excerpt}
                  </p>

                  <button className="inline-flex items-center text-accent-400 hover:text-accent-300 font-medium text-sm group/link transition-colors">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <a
            href="/news"
            className="inline-flex items-center space-x-2 bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded-full font-medium transition-colors"
          >
            <span>View All Updates</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default NewsUpdates;