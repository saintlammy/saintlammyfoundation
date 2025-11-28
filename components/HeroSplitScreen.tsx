import React from 'react';
import { ComponentProps } from '@/types';
import { Heart, Users, GraduationCap, TrendingUp, Handshake, MapPin, ArrowRight, CheckCircle } from 'lucide-react';

interface HeroProps extends ComponentProps {
  title?: string;
  subtitle?: string;
  onDonateClick?: () => void;
}

const HeroSplitScreen: React.FC<HeroProps> = ({
  className = '',
  title = 'Hope Has a Home — Empowering Widows, Orphans, and the Vulnerable',
  subtitle = 'We are building a future where no widow is forgotten, no orphan left behind, and no vulnerable home stands alone.',
  onDonateClick
}) => {
  return (
    <section className={`relative min-h-screen flex items-center overflow-hidden ${className}`}>
      <div className="w-full h-full flex flex-col lg:flex-row">

        {/* Left Side - Content */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-6 sm:px-12 lg:px-16 py-20 lg:py-0 min-h-screen">
          <div className="max-w-2xl w-full animate-slide-up">

            {/* CAC Badge */}
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent-500/10 dark:bg-accent-500/20 border border-accent-500/20 dark:border-accent-500/30 text-xs sm:text-sm font-medium text-accent-600 dark:text-accent-400 shadow-sm">
                <span className="w-2 h-2 bg-accent-500 rounded-full mr-3 animate-pulse flex-shrink-0"></span>
                <span className="hidden sm:inline">CAC Registered: Saintlammy Community Care Initiative</span>
                <span className="sm:hidden">CAC Registered</span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-gray-900 dark:text-white font-display leading-tight">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed font-light">
              {subtitle}
            </p>

            {/* Key Points */}
            <div className="mb-10 space-y-3">
              {[
                'Supporting 50+ widows monthly',
                'Connecting 24+ orphans with donors',
                'Faith-driven, community-focused',
              ].map((point, index) => (
                <div key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-accent-500 dark:text-accent-400 mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{point}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={onDonateClick}
                className="group relative px-8 py-4 bg-accent-500 text-white font-semibold text-base rounded-xl hover:bg-accent-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <span className="relative z-10 font-sans">Donate Now</span>
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="/volunteer"
                className="group px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-base rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-accent-500 dark:hover:border-accent-500 transition-all duration-300 text-center shadow-md flex items-center justify-center"
              >
                <span className="font-sans">Join Our Team</span>
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* Stats - Integrated */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-800">
              {[
                { value: '50+', label: 'Widows' },
                { value: '24+', label: 'Orphans' },
                { value: '3', label: 'Outreaches' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-accent-500 dark:text-accent-400 mb-1 font-display">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block w-full lg:w-1/2 relative">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1603998382124-c9835bf50409?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />

          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/10 to-black/20 dark:from-transparent dark:via-black/20 dark:to-black/40"></div>

          {/* Feature Pills - Floating on Image */}
          <div className="absolute bottom-12 right-12 space-y-3 max-w-xs">
            {[
              { icon: Heart, label: 'Orphan Care', color: 'from-red-500 to-pink-500' },
              { icon: Users, label: 'Widow Support', color: 'from-purple-500 to-indigo-500' },
              { icon: GraduationCap, label: 'Education', color: 'from-blue-500 to-cyan-500' },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center px-4 py-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-800/50 transform hover:scale-105 transition-all duration-300"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mr-3 flex-shrink-0`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-sm text-gray-900 dark:text-white">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Image Preview */}
        <div className="lg:hidden w-full h-64 relative">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1603998382124-c9835bf50409?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-950 via-transparent to-transparent"></div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden lg:block">
        <div className="w-6 h-10 border-2 border-gray-400/40 dark:border-gray-600/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-600/60 dark:bg-gray-400/60 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSplitScreen;
