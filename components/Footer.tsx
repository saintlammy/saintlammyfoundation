import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ComponentProps } from '@/types';
import { useDonationModal } from './DonationModalProvider';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import {
  RiArrowRightUpLine as ArrowRight,
  RiSettings4Line as Cookie,
  RiFacebookFill as Facebook,
  RiGlobalLine as Globe,
  RiHeart3Line as Heart,
  RiInstagramLine as Instagram,
  RiLinkedinFill as Linkedin,
  RiMailLine as Mail,
  RiMapPin2Line as MapPin,
  RiPhoneLine as Phone,
  RiTwitterXLine as Twitter,
  RiYoutubeLine as Youtube,
} from 'react-icons/ri';

interface FooterProps extends ComponentProps {}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const { openDonationModal } = useDonationModal();
  const { openSettings } = useCookieConsent();

  const quickLinks = [
    { href: '/', label: 'Home' },
    { href: '/programs', label: 'Programs' },
    { href: '/beneficiaries', label: 'Beneficiaries' },
    { href: '/news', label: 'News & Updates' },
    { href: '/partner', label: 'Partner With Us' },
    { href: '/volunteer', label: 'Volunteer' },
    { href: '/contact', label: 'Contact Us' }
  ];

  const programs = [
    { href: '/programs#food-household-relief', label: 'Food & Household Relief' },
    { href: '/programs#orphanage-support', label: 'Orphanage Support' },
    { href: '/programs#education-support', label: 'Education Support' },
    { href: '/programs#medical-checkups', label: 'Open Medical Check-ups' },
    { href: '/outreaches', label: 'Community Outreaches' },
    { href: '/outreaches#upcoming-outreaches', label: 'Upcoming Outreaches' }
  ];

  const legalLinks = [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/cookie-policy', label: 'Cookie Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/transparency', label: 'Financial Transparency' },
    { href: '/governance', label: 'Governance' }
  ];

  const socialLinks = [
    {
      href: 'https://facebook.com/saintlammyfoundation',
      icon: Facebook,
      label: 'Facebook',
      color: 'hover:text-blue-400'
    },
    {
      href: 'https://twitter.com/scciglobal',
      icon: Twitter,
      label: 'Twitter',
      color: 'hover:text-sky-400'
    },
    {
      href: 'https://instagram.com/saintlammyfoundation',
      icon: Instagram,
      label: 'Instagram',
      color: 'hover:text-pink-400'
    },
    {
      href: 'https://linkedin.com/company/saintlammyfoundation',
      icon: Linkedin,
      label: 'LinkedIn',
      color: 'hover:text-blue-600'
    },
    {
      href: 'https://youtube.com/saintlammyfoundation',
      icon: Youtube,
      label: 'YouTube',
      color: 'hover:text-red-400'
    }
  ];

  return (
    <footer className={`premium-footer text-white ${className}`}>

      {/* Main Footer Content */}
      <div className="premium-footer-main py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Organization Info - Left Side */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="h-8 w-auto rounded-lg overflow-hidden flex items-center">
                  <Image
                    src="/images/logo/logo-icon.svg"
                    alt="Saintlammy Community Care Initiative"
                    width={32}
                    height={32}
                    className="h-full w-auto object-contain dark:invert"
                  />
                </div>
                <span className="text-xl font-bold font-display text-gray-900 dark:text-white">Saintlammy Foundation</span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6 font-light leading-relaxed">
                Empowering orphans, widows,<br />
                and vulnerable communities<br />
                across Nigeria through<br />
                compassionate care and education.
              </p>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-accent-400" />
                  <span className="text-gray-600 dark:text-gray-300 text-sm">info@saintlammyfoundation.org</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-accent-400" />
                  <span className="text-gray-600 dark:text-gray-300 text-sm">+234 706 307 6704</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-accent-400" />
                  <span className="text-gray-600 dark:text-gray-300 text-sm">Lagos, Nigeria</span>
                </div>
              </div>
            </div>

            {/* Combined Navigation - Right Side */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 font-display">Quick Links</h4>
                <ul className="space-y-3">
                  {quickLinks.map(link => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-600 dark:text-gray-300 hover:text-accent-400 transition-colors text-sm font-light"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Programs */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 font-display">Our Programs</h4>
                <ul className="space-y-3">
                  {programs.map(program => (
                    <li key={program.href}>
                      <Link
                        href={program.href}
                        className="text-gray-600 dark:text-gray-300 hover:text-accent-400 transition-colors text-sm font-light"
                      >
                        {program.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support & Resources */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 font-display">Support & Resources</h4>
                <ul className="space-y-3">
                  <li>
                    <button
                      onClick={() => openDonationModal({
                        source: 'footer',
                        title: 'Support Our Mission',
                        description: 'Your donation helps us continue our humanitarian work'
                      })}
                      className="text-gray-600 dark:text-gray-300 hover:text-accent-400 transition-colors text-sm font-light text-left"
                    >
                      Make a Donation
                    </button>
                  </li>
                  <li>
                    <Link
                      href="/volunteer"
                      className="text-gray-600 dark:text-gray-300 hover:text-accent-400 transition-colors text-sm font-light"
                    >
                      Become a Volunteer
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/partner"
                      className="text-gray-600 dark:text-gray-300 hover:text-accent-400 transition-colors text-sm font-light"
                    >
                      Partner With Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/sponsor"
                      className="text-gray-600 dark:text-gray-300 hover:text-accent-400 transition-colors text-sm font-light"
                    >
                      Sponsor a Child
                    </Link>
                  </li>
                  {legalLinks.map(link => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-600 dark:text-gray-300 hover:text-accent-400 transition-colors text-sm font-light"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Social Media & CTA */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
              {/* Social Links */}
              <div className="flex items-center space-x-6">
                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Follow Us:</span>
                {socialLinks.map(social => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-gray-600 dark:text-gray-400 ${social.color} transition-colors`}
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>

              {/* Donation CTA */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => openDonationModal({
                    source: 'footer',
                    title: 'Support Our Mission',
                    description: 'Your donation helps us continue our humanitarian work'
                  })}
                  className="premium-footer-action group"
                >
                  <Heart className="w-4 h-4" />
                  <span>Donate Now</span>
                  <span className="premium-footer-action-island"><ArrowRight className="w-4 h-4" /></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="premium-footer-bottom py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-700 dark:text-gray-400">
              <span>© {new Date().getFullYear()} Saintlammy Community Care Initiative. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">RC: 9015713</span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 md:gap-4 text-sm text-gray-700 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Nigeria</span>
              </div>
              <span className="hidden md:inline">•</span>
              <span>Registered Nonprofit</span>
              <span className="hidden md:inline">•</span>
              <button
                onClick={openSettings}
                className="flex items-center space-x-1 hover:text-green-600 transition-colors"
                aria-label="Cookie Settings"
              >
                <Cookie className="w-4 h-4" />
                <span>Cookie Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
