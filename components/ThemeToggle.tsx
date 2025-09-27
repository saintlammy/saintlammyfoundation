import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'navigation' | 'admin';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  size = 'md',
  variant = 'default'
}) => {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const variantClasses = {
    default: 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
    navigation: 'bg-gray-900/10 dark:bg-white/10 hover:bg-gray-900/20 dark:hover:bg-white/20 backdrop-blur-sm text-gray-900 dark:text-white border border-gray-900/20 dark:border-white/20',
    admin: 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600'
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-full
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
        transform hover:scale-105 active:scale-95
        ${className}
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative">
        {/* Sun Icon */}
        <Sun
          className={`
            ${iconSizes[size]}
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            transition-all duration-300 ease-in-out
            ${theme === 'light'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 rotate-90 scale-0'
            }
          `}
        />

        {/* Moon Icon */}
        <Moon
          className={`
            ${iconSizes[size]}
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            transition-all duration-300 ease-in-out
            ${theme === 'dark'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-0'
            }
          `}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;