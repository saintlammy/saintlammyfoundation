import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ComponentProps } from '@/types';
import { DonationContext } from './DonationModalProvider';
import { Heart, Menu, X, ChevronDown, Users, FileText, HandHeart, Star, MessageSquare } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface MegaMenuOption {
  href: string;
  label: string;
  description: string;
  icon: any;
}

interface NavItem {
  href?: string;
  label: string;
  type: 'link' | 'button' | 'megamenu';
  megaMenuOptions?: MegaMenuOption[];
}

interface NavigationProps extends ComponentProps {
  onDonateClick?: (context?: DonationContext) => void;
}

const Navigation: React.FC<NavigationProps> = ({ className = '', onDonateClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openMegaMenu, setOpenMegaMenu] = useState<string | null>(null);
  const router = useRouter();
  const megaMenuTimerRef = useRef<NodeJS.Timeout | null>(null);

  const navLinks: NavItem[] = [
    { href: '/', label: 'Home', type: 'link' },
    {
      label: 'About Us',
      type: 'megamenu',
      megaMenuOptions: [
        {
          href: '/about',
          label: 'Our Story',
          description: 'Learn about our mission, vision, and founding story',
          icon: FileText
        },
        {
          href: '/stories',
          label: 'Impact Stories',
          description: 'Real stories of lives transformed through our work',
          icon: MessageSquare
        },
        {
          href: '/about#testimonials',
          label: 'Testimonials',
          description: 'What people say about our foundation',
          icon: Star
        }
      ]
    },
    {
      label: 'Our Work',
      type: 'megamenu',
      megaMenuOptions: [
        {
          href: '/programs',
          label: 'Programs',
          description: 'Our ongoing charitable programs and initiatives',
          icon: Heart
        },
        {
          href: '/outreaches',
          label: 'Outreaches',
          description: 'Community outreach events and activities',
          icon: Users
        }
      ]
    },
    {
      label: 'Get Involved',
      type: 'megamenu',
      megaMenuOptions: [
        {
          href: '/volunteer',
          label: 'Volunteer',
          description: 'Join our team of dedicated volunteers',
          icon: HandHeart
        },
        {
          href: '/donate',
          label: 'Donate',
          description: 'Make a difference with your contribution',
          icon: Heart
        }
      ]
    },
    { href: '/news', label: 'News', type: 'link' },
    { href: '/contact', label: 'Contact', type: 'link' },
  ];

  const handleMegaMenuEnter = (label: string) => {
    if (megaMenuTimerRef.current) {
      clearTimeout(megaMenuTimerRef.current);
    }
    setOpenMegaMenu(label);
  };

  const handleMegaMenuLeave = () => {
    megaMenuTimerRef.current = setTimeout(() => {
      setOpenMegaMenu(null);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (megaMenuTimerRef.current) {
        clearTimeout(megaMenuTimerRef.current);
      }
    };
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 bg-white/90 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-white/10 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-auto rounded-lg overflow-hidden flex items-center mr-3">
                <img
                  src="/images/logo/logo-icon.svg"
                  alt="Saintlammy Foundation"
                  className="h-full w-auto object-contain dark:invert"
                />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white font-display tracking-tight">
                Saintlammy Foundation
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block ml-auto">
            <div className="flex items-center space-x-4">
              <div className="flex items-baseline space-x-4 relative">
              {navLinks.map((link) => {
                const isActive = link.href ? router.pathname === link.href : false;
                const isMegaMenuActive = link.megaMenuOptions?.some(option => router.pathname === option.href);

                if (link.type === 'megamenu') {
                  return (
                    <div
                      key={link.label}
                      className="relative"
                      onMouseEnter={() => handleMegaMenuEnter(link.label)}
                      onMouseLeave={handleMegaMenuLeave}
                    >
                      <button
                        className={`relative px-3 py-2 text-sm font-medium font-sans transition-colors duration-200 group flex items-center ${
                          isMegaMenuActive || openMegaMenu === link.label
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {link.label}
                        <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                          openMegaMenu === link.label ? 'rotate-180' : ''
                        }`} />
                        {/* Gradient underline */}
                        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent-400 to-accent-600 transform transition-all duration-200 ${
                          isMegaMenuActive || openMegaMenu === link.label ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`}></span>
                      </button>

                      {/* Mega Menu Dropdown */}
                      {openMegaMenu === link.label && link.megaMenuOptions && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                          <div className="p-4">
                            <div className="space-y-2">
                              {link.megaMenuOptions.map((option) => {
                                const IconComponent = option.icon;
                                const isOptionActive = router.pathname === option.href;

                                return (
                                  <a
                                    key={option.href}
                                    href={option.href}
                                    onClick={() => setOpenMegaMenu(null)}
                                    className={`flex items-start p-3 rounded-lg transition-colors duration-200 group ${
                                      isOptionActive
                                        ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                  >
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                                      isOptionActive
                                        ? 'bg-accent-100 dark:bg-accent-800/50'
                                        : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-accent-100 dark:group-hover:bg-accent-800/50'
                                    }`}>
                                      <IconComponent className={`w-4 h-4 ${
                                        isOptionActive
                                          ? 'text-accent-600 dark:text-accent-400'
                                          : 'text-gray-600 dark:text-gray-400 group-hover:text-accent-600 dark:group-hover:text-accent-400'
                                      }`} />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className={`text-sm font-medium ${
                                        isOptionActive
                                          ? 'text-accent-600 dark:text-accent-400'
                                          : 'text-gray-900 dark:text-white'
                                      }`}>
                                        {option.label}
                                      </h4>
                                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        {option.description}
                                      </p>
                                    </div>
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`relative px-3 py-2 text-sm font-medium font-sans transition-colors duration-200 group ${
                      isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {link.label}
                    {/* Gradient underline */}
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent-400 to-accent-600 transform transition-all duration-200 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}></span>
                  </a>
                );
              })}
              </div>
              <ThemeToggle variant="navigation" size="sm" />
            </div>
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle variant="navigation" size="sm" />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 inline-flex items-center justify-center p-2 rounded-md transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white/95 dark:bg-black/95 backdrop-blur-xl`}>
        <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200/20 dark:border-white/10">
          {navLinks.map((link) => {
            const isActive = link.href ? router.pathname === link.href : false;
            const isMegaMenuActive = link.megaMenuOptions?.some(option => router.pathname === option.href);

            if (link.type === 'megamenu') {
              return (
                <div key={link.label} className="space-y-1">
                  <div className={`relative block px-3 py-2 text-base font-medium ${
                    isMegaMenuActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {link.label}
                    {/* Mobile gradient underline */}
                    <span className={`absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-accent-400 to-accent-600 transform transition-all duration-200 ${
                      isMegaMenuActive ? 'scale-x-100' : 'scale-x-0'
                    }`}></span>
                  </div>
                  <div className="pl-4 space-y-1">
                    {link.megaMenuOptions?.map((option) => {
                      const IconComponent = option.icon;
                      const isOptionActive = router.pathname === option.href;

                      return (
                        <a
                          key={option.href}
                          href={option.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center px-3 py-2 text-sm font-medium transition-colors group rounded-lg ${
                            isOptionActive ? 'text-gray-900 dark:text-white bg-accent-500/20' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                          }`}
                        >
                          <IconComponent className="w-4 h-4 mr-3" />
                          <div>
                            <div className={isOptionActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'}>
                              {option.label}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400">
                              {option.description}
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`relative block px-3 py-2 text-base font-medium transition-colors group ${
                  isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {link.label}
                {/* Mobile gradient underline */}
                <span className={`absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-accent-400 to-accent-600 transform transition-all duration-200 ${
                  isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;