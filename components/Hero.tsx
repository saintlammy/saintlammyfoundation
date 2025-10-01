import React from 'react';
import { ComponentProps } from '@/types';
import { Heart, Users, GraduationCap, TrendingUp, Handshake, MapPin } from 'lucide-react';

interface HeroProps extends ComponentProps {
  title?: string;
  subtitle?: string;
  onDonateClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({
  className = '',
  title = 'Hope Has a Home — Empowering Widows, Orphans, and the Vulnerable',
  subtitle = 'We are building a future where no widow is forgotten, no orphan left behind, and no vulnerable home stands alone. Through love, structure, and action, we bring transformation where it\'s needed most.',
  onDonateClick
}) => {
  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background */}
      <div className="absolute inset-0">
        {/* Background Image using CSS - more reliable */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1603998382124-c9835bf50409?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/60 dark:from-black/60 dark:via-black/40 dark:to-black/60"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-900/10 dark:bg-white/10 backdrop-blur-sm border border-gray-900/20 dark:border-white/20 text-sm font-medium text-gray-900 dark:text-white mb-8">
            <span className="w-2 h-2 bg-accent-400 rounded-full mr-3 animate-pulse"></span>
            CAC Registered: Saintlammy Community Care Initiative
          </div>

          {/* Main Heading */}
          <h1 className="text-display-lg md:text-display-xl lg:text-display-2xl font-medium mb-8 tracking-tight">
            <span className="openai-gradient-text font-display max-w-5xl mx-auto">
              {title}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto mb-12 font-light leading-relaxed">
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
              onClick={onDonateClick}
              className="group relative px-8 py-4 bg-accent-500 text-white font-medium text-base rounded-xl hover:bg-accent-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span className="relative z-10 font-sans">Donate Now</span>
            </button>

            <a
              href="/about"
              className="group px-8 py-4 bg-white/10 dark:bg-white/10 backdrop-blur-sm text-gray-900 dark:text-white font-medium text-base rounded-xl border border-gray-900/20 dark:border-white/20 hover:bg-white/20 dark:hover:bg-white/20 transition-all duration-300 text-center"
            >
              <span className="flex items-center font-sans">
                Learn More
                <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </a>

            <a
              href="/volunteer"
              className="group px-8 py-4 bg-white/10 dark:bg-white/10 backdrop-blur-sm text-gray-900 dark:text-white font-medium text-base rounded-xl border border-gray-900/20 dark:border-white/20 hover:bg-white/20 dark:hover:bg-white/20 transition-all duration-300 text-center"
            >
              <span className="flex items-center font-sans">
                Volunteer
                <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </a>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {[
              { icon: Heart, label: 'Orphan Care' },
              { icon: Users, label: 'Widow Empowerment' },
              { icon: GraduationCap, label: 'Education Programs' },
              { icon: TrendingUp, label: 'Community Development' },
              { icon: Handshake, label: 'Partnership Programs' },
              { icon: MapPin, label: 'Nigeria Focus' }
            ].map((feature, index) => (
              <span
                key={index}
                className="flex items-center px-4 py-2 bg-white/10 dark:bg-white/10 backdrop-blur-sm rounded-full text-gray-900 dark:text-white/80 border border-gray-900/20 dark:border-white/20 font-medium text-sm hover:bg-white/20 dark:hover:bg-white/20 transition-all"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <feature.icon className="w-4 h-4 mr-2" />
                <span className="font-sans">{feature.label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Stats Preview */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center animate-slide-up" style={{animationDelay: '0.5s'}}>
          {[
            { label: 'Widows Supported', value: '500+' },
            { label: 'Orphans Connected', value: '300+' },
            { label: 'Community Outreaches', value: '20+' },
            { label: 'Years of Service', value: '2+' }
          ].map((stat, index) => (
            <div key={index} className="group">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-accent-400 transition-colors font-display">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;