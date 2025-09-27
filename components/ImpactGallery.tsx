import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Users, GraduationCap, Heart, Home, Building } from 'lucide-react';

interface ImpactStory {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  category: string;
  date: string;
}

const ImpactGallery: React.FC = () => {
  const [impactStories, setImpactStories] = useState<ImpactStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch('/api/gallery?limit=4');
        const data = await response.json();
        setImpactStories(data);
      } catch (error) {
        console.error('Error fetching gallery:', error);
        setImpactStories([]);
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

  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-display-md md:text-display-lg font-medium text-white mb-6 font-display tracking-tight">
            Impact in Action
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            See how your donations are creating real, measurable change in communities across Nigeria.
            Every project is documented with full transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            [...Array(4)].map((_, index) => (
              <div
                key={index}
                className={`animate-pulse bg-gray-800 rounded-2xl ${
                  index === 0 ? 'md:col-span-2 h-96' : 'h-80'
                }`}
              >
                <div className="h-full bg-gray-700 rounded-2xl"></div>
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
                <button className="mt-4 inline-flex items-center text-accent-400 hover:text-accent-300 font-medium text-sm transition-colors group-hover:translate-x-1 duration-200 font-sans">
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
              <div className="text-3xl md:text-4xl font-medium text-accent-400 mb-2 group-hover:scale-110 transition-transform font-display tracking-tight">
                {stat.number}
              </div>
              <div className="text-gray-300 font-medium text-sm font-sans">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <button className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-medium text-base transition-colors shadow-lg hover:shadow-xl font-sans">
            View All Impact Stories
          </button>
        </div>
      </div>
    </section>
  );
};

export default ImpactGallery;