import React from 'react';
import Image from 'next/image';
import { Users, GraduationCap, Heart, Home } from 'lucide-react';

const ImpactGallery: React.FC = () => {
  const impactStories = [
    {
      id: 1,
      title: 'Education Program Launch',
      description: 'New computer lab opening at Hope Children Home, providing digital literacy training to 50+ children.',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      icon: GraduationCap,
      category: 'Education',
      date: 'March 2024'
    },
    {
      id: 2,
      title: 'Clean Water Project',
      description: 'Installing clean water systems in rural communities, providing safe drinking water to 200+ families.',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      icon: Heart,
      category: 'Healthcare',
      date: 'February 2024'
    },
    {
      id: 3,
      title: 'Widow Empowerment',
      description: 'Skills training program helping widows start small businesses and become financially independent.',
      image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      icon: Users,
      category: 'Empowerment',
      date: 'January 2024'
    },
    {
      id: 4,
      title: 'Home Renovation',
      description: 'Complete renovation of Grace Orphanage, creating safer and healthier living spaces for 30 children.',
      image: 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80',
      icon: Home,
      category: 'Infrastructure',
      date: 'December 2023'
    }
  ];

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
          {impactStories.map((story, index) => (
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
                  <div className="bg-openai-500 rounded-full p-2 mr-3">
                    <story.icon className="w-4 h-4 text-white" />
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
          ))}
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