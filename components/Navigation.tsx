import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ComponentProps } from '@/types';
import { DonationContext } from './DonationModalProvider';
import { Heart, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface NavigationProps extends ComponentProps {
  onDonateClick?: (context?: DonationContext) => void;
}

const Navigation: React.FC<NavigationProps> = ({ className = '', onDonateClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const navLinks = [
    { href: '/', label: 'Home', type: 'link' },
    { href: '/about', label: 'About', type: 'link' },
    { href: '/stories', label: 'Stories', type: 'link' },
    { href: '/news', label: 'News', type: 'link' },
    { href: '/outreaches', label: 'Outreaches', type: 'link' },
    { href: '/programs', label: 'Programs', type: 'link' },
    { href: '/donate', label: 'Donate', type: 'button' },
    { href: '/volunteer', label: 'Volunteer', type: 'link' },
    { href: '/contact', label: 'Contact', type: 'link' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 bg-white/90 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-white/10 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center mr-3">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white font-display tracking-tight">
                <span className="text-accent-400">Saint</span>lammy Foundation
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block ml-auto">
            <div className="flex items-center space-x-4">
              <ThemeToggle variant="navigation" size="sm" />
              <div className="flex items-baseline space-x-4">
              {navLinks.map((link) => {
                const isActive = router.pathname === link.href;

                if (link.type === 'button' && link.label === 'Donate') {
                  return (
                    <button
                      key={link.href}
                      onClick={() => onDonateClick?.({ source: 'general' })}
                      className="relative px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium font-sans transition-colors duration-200 rounded-full"
                    >
                      {link.label}
                    </button>
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
            </div>
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle variant="navigation" size="sm" />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white hover:bg-white/10 inline-flex items-center justify-center p-2 rounded-md transition-colors"
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
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-black/95 backdrop-blur-xl`}>
        <div className="px-2 pt-2 pb-3 space-y-1 border-t border-white/10">
          {navLinks.map((link) => {
            const isActive = router.pathname === link.href;

            if (link.type === 'button' && link.label === 'Donate') {
              return (
                <button
                  key={link.href}
                  onClick={() => onDonateClick?.({ source: 'general' })}
                  className="block w-full text-left px-3 py-3 bg-accent-500 hover:bg-accent-600 text-white text-base font-medium font-sans transition-colors duration-200 rounded-lg mx-3 mb-2"
                >
                  {link.label}
                </button>
              );
            }

            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative block px-3 py-2 text-base font-medium transition-colors group ${
                  isActive ? 'text-white' : 'text-gray-300 hover:text-white'
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