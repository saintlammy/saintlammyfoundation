import React from 'react';
import { ComponentProps } from '@/types';
import { Heart, Users, GraduationCap, ArrowRight, CheckCircle2, Award } from 'lucide-react';

interface HeroProps extends ComponentProps {
  title?: string;
  subtitle?: string;
  onDonateClick?: () => void;
}

const HeroAsymmetric: React.FC<HeroProps> = ({
  className = '',
  title = 'Hope Has a Home',
  subtitle = 'Empowering Widows, Orphans, and the Vulnerable',
  onDonateClick
}) => {
  return (
    <section className={`relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 ${className}`}>

      {/* Diagonal Background Split */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Diagonal Image Section */}
        <div className="absolute -right-1/4 top-0 bottom-0 w-2/3 transform skew-x-12 origin-top-right">
          <div
            className="absolute inset-0 bg-cover bg-center transform -skew-x-12 scale-110"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1603998382124-c9835bf50409?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent dark:from-gray-950/80 dark:via-gray-950/40 dark:to-transparent transform -skew-x-12"></div>
        </div>

        {/* Accent Shapes */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-accent-500/5 dark:bg-accent-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-40 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Column - Main Content */}
          <div className="animate-slide-up">

            {/* CAC Badge */}
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent-500/10 dark:bg-accent-500/20 border border-accent-500/30 shadow-sm">
                <Award className="w-4 h-4 text-accent-600 dark:text-accent-400 mr-2" />
                <span className="text-sm font-bold text-accent-700 dark:text-accent-300 hidden sm:inline">
                  CAC Registered Organization
                </span>
                <span className="text-sm font-bold text-accent-700 dark:text-accent-300 sm:hidden">
                  CAC Registered
                </span>
              </div>
            </div>

            {/* Massive Bold Title */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-6 tracking-tighter text-gray-900 dark:text-white font-display leading-none">
              {title}
            </h1>

            {/* Subtitle with Accent */}
            <div className="mb-8">
              <div className="h-1 w-20 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full mb-4"></div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-700 dark:text-gray-300 leading-tight">
                {subtitle}
              </p>
            </div>

            {/* Brief Description */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
              Through love, structure, and action, we bring transformation where it's needed most across Nigeria.
            </p>

            {/* Key Metrics - Inline */}
            <div className="flex flex-wrap gap-8 mb-12">
              {[
                { value: '50+', label: 'Widows' },
                { value: '24+', label: 'Orphans' },
                { value: '3', label: 'Outreaches' },
              ].map((stat, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="text-4xl sm:text-5xl font-black text-accent-500 dark:text-accent-400 font-display">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons - Bold & Asymmetric */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={onDonateClick}
                className="group relative px-10 py-5 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold text-lg rounded-2xl hover:from-accent-600 hover:to-accent-700 transition-all duration-300 shadow-2xl hover:shadow-accent-500/50 hover:scale-105 flex items-center justify-center"
              >
                <span className="relative z-10 font-sans">Make an Impact</span>
                <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-2" />
              </button>

              <a
                href="/about"
                className="group px-10 py-5 bg-transparent text-gray-900 dark:text-white font-bold text-lg rounded-2xl border-2 border-gray-900 dark:border-white hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-all duration-300 flex items-center justify-center"
              >
                <span className="font-sans">Our Story</span>
                <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-2" />
              </a>
            </div>
          </div>

          {/* Right Column - Features & Trust Indicators */}
          <div className="animate-slide-up space-y-6" style={{animationDelay: '0.2s'}}>

            {/* Feature Cards - Stacked */}
            <div className="space-y-4">
              {[
                {
                  icon: Heart,
                  title: 'Orphan Care',
                  description: '24+ orphans connected with loving donors',
                  color: 'from-red-500 to-pink-500'
                },
                {
                  icon: Users,
                  title: 'Widow Empowerment',
                  description: '50+ widows receiving monthly support',
                  color: 'from-purple-500 to-indigo-500'
                },
                {
                  icon: GraduationCap,
                  title: 'Educational Access',
                  description: 'Ensuring every child has quality education',
                  color: 'from-blue-500 to-cyan-500'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700 hover:border-accent-500 dark:hover:border-accent-500 transition-all duration-300 hover:shadow-xl hover:scale-102 cursor-pointer"
                  style={{animationDelay: `${0.3 + index * 0.1}s`}}
                >
                  {/* Gradient Accent Bar */}
                  <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${feature.color} rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                  <div className="flex items-start space-x-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-accent-500 dark:text-accent-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Badge */}
            <div className="bg-gradient-to-r from-accent-500/10 to-purple-500/10 dark:from-accent-500/20 dark:to-purple-500/20 rounded-2xl p-6 border border-accent-500/20 dark:border-accent-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Trusted by
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    Hundreds of Donors
                  </p>
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white font-bold text-xs">
                      {i === 1 ? '👤' : i === 2 ? '❤️' : '🙏'}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Minimal */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce opacity-50 hover:opacity-100 transition-opacity hidden lg:block">
        <div className="flex flex-col items-center">
          <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-600 dark:bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">Scroll</span>
        </div>
      </div>
    </section>
  );
};

export default HeroAsymmetric;
