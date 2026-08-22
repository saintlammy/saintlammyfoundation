import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { RiDoubleQuotesR } from 'react-icons/ri';
import { getTestimonialAvatar, inferGenderFromName, type Gender } from '@/lib/avatarUtils';
import { ActionLink, DoubleBezel, SectionHeading } from './home/HomePrimitives';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating?: number;
  image?: string;
  gender?: Gender;
  program?: string;
  date?: string;
}

const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/testimonials?status=published&limit=6', {
          cache: 'no-store'
        });

        console.log('📡 Testimonials API response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('📊 Testimonials fetched:', data.length, 'items');

          if (data && data.length > 0) {
            // Transform database testimonials to component format
            const transformed = data.map((t: Testimonial) => {
              // Get gender from data or infer from name
              const gender = t.gender || inferGenderFromName(t.name);

              console.log(`🎭 Processing testimonial: ${t.name}`);
              console.log(`   Original image: ${t.image}`);
              console.log(`   Gender: ${gender}`);

              // Get avatar with fallback
              const avatarUrl = getTestimonialAvatar(t.image, gender, t.name);
              console.log(`   Final avatar URL: ${avatarUrl}`);

              return {
                id: t.id,
                name: t.name,
                role: t.role || 'Beneficiary',
                location: t.program || 'Nigeria',
                image: avatarUrl,
                quote: t.content,
                donation: t.program || 'Supporter'
              };
            });

            console.log('✅ Using database testimonials with transformed data:', transformed);
            setTestimonials(transformed);
            return;
          }
        }

        // Fallback to example testimonials
        console.warn('⚠️ Falling back to mock testimonials');
        setTestimonials(getFallbackTestimonials());
      } catch (error) {
        console.error('❌ Error fetching testimonials:', error);
        setTestimonials(getFallbackTestimonials());
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const getFallbackTestimonials = () => [
    {
      id: 1,
      name: 'Chidinma Okafor',
      role: 'Monthly Donor',
      location: 'Lagos, Nigeria',
      image: '/images/nigerian-ngo/portrait-widow.webp',
      quote: 'Saintlammy Foundation\'s transparency and dedication to supporting widows touched my heart. I see exactly where my support is making a difference.',
      donation: 'Monthly Donor'
    },
    {
      id: 2,
      name: 'Ibrahim Yusuf',
      role: 'Community Leader',
      location: 'Abuja, Nigeria',
      image: '/images/nigerian-ngo/portrait-volunteer.webp',
      quote: 'Saintlammy Foundation\'s timely interventions helped our community provide food and essential supplies to 28 vulnerable children and their families when resources ran dry.',
      donation: 'Partner Organization'
    },
    {
      id: 3,
      name: 'RenewAfrica Partnership Group',
      role: 'Partner Organization',
      location: 'Nigeria',
      image: '/images/nigerian-ngo/volunteer-team.webp',
      quote: 'We trust Saintlammy Foundation because they deliver real impact where it\'s most needed, empowering widows and supporting vulnerable families across Nigeria.',
      donation: 'Strategic Partner'
    }
  ];

  return (
    <section className="home-section home-section-soft home-testimonials">
      <div className="home-container">
        <SectionHeading
          eyebrow="Voices from the field"
          title={<>Trust is built in <span className="home-ink-accent">people&apos;s own words.</span></>}
          description="Hear from donors, partners and communities who make this mission possible."
        />

        <div className="home-testimonial-grid">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={testimonial.id}
              data-home-reveal
              className={`home-bezel home-testimonial-bezel group ${testimonials.length === 2 ? 'home-testimonial-half' : ''} ${index === 1 ? 'home-testimonial-raised' : ''}`}
            >
              <article className="home-bezel-core home-testimonial-card">
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-30 transition-opacity">
                <RiDoubleQuotesR className="w-8 h-8 text-accent-500" />
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
              </article>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-16">
          <DoubleBezel coreClassName="home-inline-cta">
            <h3 className="text-2xl md:text-3xl font-medium text-gray-900 dark:text-white mb-4 font-display tracking-tight">
              Join Our Community of Change-Makers
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
              Every donor, volunteer, and supporter becomes part of an extraordinary story of transformation.
              Your story could be next.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ActionLink href="/donate">Start your impact story</ActionLink>
              <ActionLink href="/stories" tone="secondary">Read more stories</ActionLink>
            </div>
          </DoubleBezel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
