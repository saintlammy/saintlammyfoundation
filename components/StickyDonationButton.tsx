import React, { useState, useEffect } from 'react';
import { Heart, X } from 'lucide-react';
import { ComponentProps } from '@/types';

interface StickyDonationButtonProps extends ComponentProps {
  onDonateClick?: () => void;
}

const StickyDonationButton: React.FC<StickyDonationButtonProps> = ({
  className = '',
  onDonateClick
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past hero section (approximately 100vh)
      const scrollPosition = window.scrollY;
      const shouldShow = scrollPosition > window.innerHeight && !isDismissed;
      setIsVisible(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <div className="relative">
        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-full flex items-center justify-center transition-colors duration-200 border border-gray-300 dark:border-gray-600"
          aria-label="Dismiss donation reminder"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Main donation button */}
        <button
          onClick={onDonateClick}
          className="group relative bg-accent-500 hover:bg-accent-600 text-white px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3 font-medium text-base"
          aria-label="Make a donation to Saintlammy Foundation"
        >
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Heart className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
          </div>
          <span className="font-sans">Donate Now</span>

          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-accent-400 opacity-30 animate-ping"></div>
        </button>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-800 dark:bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
            Help transform lives today
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800 dark:border-t-gray-900"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyDonationButton;