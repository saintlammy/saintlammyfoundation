import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { ComponentProps } from '@/types';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps extends ComponentProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  className = '',
  items,
  showHome = true
}) => {
  const allItems = showHome
    ? [{ label: 'Home', href: '/' }, ...items]
    : items;

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isHome = index === 0 && showHome;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
              )}

              {isLast || !item.href ? (
                <span
                  className={`${
                    isLast
                      ? 'text-white font-medium'
                      : 'text-gray-300 hover:text-white'
                  } ${isHome ? 'flex items-center' : ''}`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {isHome && <Home className="w-4 h-4 mr-1" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={`text-gray-300 hover:text-white transition-colors ${
                    isHome ? 'flex items-center' : ''
                  }`}
                >
                  {isHome && <Home className="w-4 h-4 mr-1" />}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;