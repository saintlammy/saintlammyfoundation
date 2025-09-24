import React from 'react';
import { ComponentProps } from '@/types';
import { Heart } from 'lucide-react';

interface LoadingSpinnerProps extends ComponentProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className = '',
  size = 'md',
  message = 'Loading...',
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-gray-900 flex items-center justify-center z-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        {/* Spinning Heart Icon */}
        <div className="relative mb-4">
          <div className={`${sizeClasses[size]} mx-auto animate-spin`}>
            <Heart className="w-full h-full text-accent-500" />
          </div>

          {/* Pulse Effect */}
          <div className={`absolute inset-0 ${sizeClasses[size]} mx-auto animate-ping`}>
            <Heart className="w-full h-full text-accent-500 opacity-30" />
          </div>
        </div>

        {/* Loading Message */}
        {message && (
          <p className="text-gray-300 font-medium text-sm animate-pulse">
            {message}
          </p>
        )}

        {/* Loading Dots */}
        <div className="flex justify-center space-x-1 mt-3">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-2 h-2 bg-accent-500 rounded-full animate-bounce"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationDuration: '0.6s'
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;