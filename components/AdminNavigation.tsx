import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ComponentProps } from '@/types';
import { Heart, Menu, X, Shield, Wallet, BarChart3, Users, Settings } from 'lucide-react';

interface AdminNavigationProps extends ComponentProps {}

const AdminNavigation: React.FC<AdminNavigationProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: BarChart3 },
    { href: '/admin/wallet-management', label: 'Wallets', icon: Wallet },
    { href: '/admin/donations', label: 'Donations', icon: Heart },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
    { href: '/', label: 'Back to Site', icon: null },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-accent-500/20 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center mr-3">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-white font-display tracking-tight">
                <span className="text-accent-400">Admin</span> Panel
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block ml-auto">
            <div className="flex items-baseline space-x-4">
              {navLinks.map((link) => {
                const isActive = router.pathname === link.href;
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`relative px-3 py-2 text-sm font-medium font-sans transition-colors duration-200 group flex items-center gap-2 ${
                      isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {IconComponent && <IconComponent className="w-4 h-4" />}
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

          {/* Mobile menu button */}
          <div className="md:hidden">
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
        <div className="px-2 pt-2 pb-3 space-y-1 border-t border-accent-500/20">
          {navLinks.map((link) => {
            const isActive = router.pathname === link.href;
            const IconComponent = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative block px-3 py-2 text-base font-medium transition-colors group flex items-center gap-2 ${
                  isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                {IconComponent && <IconComponent className="w-4 h-4" />}
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

export default AdminNavigation;