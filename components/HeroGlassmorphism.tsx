import React from 'react';
import { ComponentProps } from '@/types';
import { Heart, Users, GraduationCap, TrendingUp, Handshake, MapPin, ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps extends ComponentProps {
  title?: string;
  subtitle?: string;
  onDonateClick?: () => void;
}

const HeroGlassmorphism: React.FC<HeroProps> = ({
  className = '',
  title = 'Hope Has a Home — Empowering Widows, Orphans, and the Vulnerable',
  subtitle = 'We are building a future where no widow is forgotten, no orphan left behind, and no vulnerable home stands alone.',
  onDonateClick
}) => {
  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}>

      {/* Full Background Image */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1603998382124-c9835bf50409?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        {/* Overlay - Lighter for light mode to show image better, Dark for dark mode */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/30 to-white/45 dark:from-black/60 dark:via-black/50 dark:to-black/70"></div>

        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-accent-500/20 dark:bg-accent-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/15 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Main Content - Glassmorphism Card */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="animate-slide-up">

          {/* Frosted Glass Card */}
          <div className="relative bg-white/80 dark:bg-black/30 backdrop-blur-2xl rounded-3xl border border-gray-200/40 dark:border-white/20 shadow-2xl p-8 sm:p-12 lg:p-16">

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl blur-xl opacity-40 dark:opacity-50"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl blur-xl opacity-30 dark:opacity-40"></div>

            {/* CAC Badge */}
            <div className="mb-8 flex justify-center">
              <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-accent-500/10 dark:bg-white/10 backdrop-blur-md border border-accent-500/30 dark:border-white/20 shadow-lg">
                <Sparkles className="w-4 h-4 text-accent-600 dark:text-accent-300 mr-2 animate-pulse" />
                <span className="text-sm font-semibold text-accent-700 dark:text-white hidden sm:inline">
                  CAC Registered: Saintlammy Community Care Initiative
                </span>
                <span className="text-sm font-semibold text-accent-700 dark:text-white sm:hidden">
                  CAC Registered
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 text-center tracking-tight font-display leading-tight">
              <span className="bg-gradient-to-r from-accent-600 via-purple-600 to-accent-500 dark:from-accent-400 dark:via-purple-400 dark:to-accent-300 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                {title}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-200 text-center max-w-4xl mx-auto mb-12 leading-relaxed font-light">
              {subtitle}
            </p>

            {/* Feature Pills - Old Capsule Design */}
            <div className="flex flex-wrap justify-center gap-4 text-sm mb-12">
              {[
                { icon: Heart, label: 'Orphan Care' },
                { icon: Users, label: 'Widows' },
                { icon: GraduationCap, label: 'Education' },
                { icon: TrendingUp, label: 'Growth' },
                { icon: Handshake, label: 'Partners' },
                { icon: MapPin, label: 'Nigeria' }
              ].map((feature, index) => (
                <span
                  key={index}
                  className="flex items-center px-4 py-2 bg-white/40 dark:bg-white/10 backdrop-blur-md rounded-full text-gray-900 dark:text-white/90 border border-gray-300/50 dark:border-white/20 font-medium text-sm hover:bg-white/50 dark:hover:bg-white/20 transition-all shadow-sm"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <feature.icon className="w-4 h-4 mr-2" />
                  <span className="font-sans">{feature.label}</span>
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={onDonateClick}
                className="group relative w-full sm:w-auto px-10 py-5 bg-accent-500 hover:bg-accent-600 text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-accent-500/50 hover:scale-105 flex items-center justify-center"
              >
                <span className="relative z-10 font-sans">Donate Now</span>
                <ArrowRight className="ml-2 w-6 h-6 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="/volunteer"
                className="group w-full sm:w-auto px-10 py-5 bg-white dark:bg-white/10 backdrop-blur-md text-gray-900 dark:text-white font-bold text-lg rounded-2xl border-2 border-gray-300 dark:border-white/30 hover:bg-gray-50 dark:hover:bg-white/15 hover:border-gray-400 dark:hover:border-white/50 transition-all duration-300 shadow-xl hover:scale-105 flex items-center justify-center"
              >
                <span className="font-sans">Join Our Mission</span>
                <ArrowRight className="ml-2 w-6 h-6 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* Stats - Premium Display */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-gray-200/50 dark:border-white/10">
              {[
                { value: '50+', label: 'Widows Supported', icon: Users },
                { value: '24+', label: 'Orphans Connected', icon: Heart },
                { value: '3', label: 'Outreaches', icon: MapPin },
                { value: '0.5+', label: 'Years of Impact', icon: TrendingUp },
              ].map((stat, index) => (
                <div key={index} className="text-center group cursor-pointer">
                  <div className="flex justify-center mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gray-100/70 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <stat.icon className="w-6 h-6 text-accent-600 dark:text-white" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1 font-display group-hover:text-accent-500 dark:group-hover:text-accent-300 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-white/80 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400/40 dark:border-white/40 rounded-full flex justify-center backdrop-blur-sm">
          <div className="w-1 h-3 bg-gray-600/80 dark:bg-white/80 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroGlassmorphism;
