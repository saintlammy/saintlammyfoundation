import React from 'react';
import Image from 'next/image';
import { Quote } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Chidinma',
      role: 'Monthly Donor',
      location: 'Lagos, Nigeria',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
      quote: 'I chose to adopt a home through Saintlammy because of their transparency and heart. I see where my support is going.',
      donation: 'Monthly Donor'
    },
    {
      id: 2,
      name: 'Ibrahim',
      role: 'Orphanage Director',
      location: 'Abuja, Nigeria',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
      quote: 'Saintlammy\'s timely interventions helped us feed and clothe 28 children when funds ran dry.',
      donation: 'Partner Organization'
    },
    {
      id: 3,
      name: 'RenewAfrica Partnership Group',
      role: 'Partner Organization',
      location: 'Nigeria',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
      quote: 'We trust Saintlammy Foundation because they deliver real impact where it\'s most needed.',
      donation: 'Strategic Partner'
    }
  ];

  return (
    <section className="py-24 bg-gray-200 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
            Stories That Inspire Us
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            Voices from the field - hear from donors, partners, and communities who make our mission possible.
            Every story represents hope in action and lives transformed through love and service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-accent-500 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-30 transition-opacity">
                <Quote className="w-8 h-8 text-accent-400" />
              </div>

              {/* Profile */}
              <div className="flex items-center mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white font-display">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-light">
                    {testimonial.role}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
                    {testimonial.location}
                  </p>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-gray-600 dark:text-gray-300 mb-6 font-light leading-relaxed text-sm italic">
                "{testimonial.quote}"
              </blockquote>

              {/* Badge */}
              <div className="inline-flex items-center px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-xs font-medium">
                {testimonial.donation}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 md:p-12 border border-gray-300 dark:border-gray-600">
            <h3 className="text-2xl md:text-3xl font-medium text-gray-900 dark:text-white mb-4 font-display tracking-tight">
              Join Our Community of Change-Makers
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
              Every donor, volunteer, and supporter becomes part of an extraordinary story of transformation.
              Your story could be next.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded-full font-medium text-base transition-colors font-sans">
                Start Your Impact Story
              </button>
              <button className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-8 py-3 rounded-full font-medium text-base transition-colors font-sans">
                Read More Stories
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;