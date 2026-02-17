import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');

  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Admin routes are always dark mode regardless of system/localStorage preference
    if (isAdminRoute) {
      setTheme('dark');
      return;
    }

    // Get theme from localStorage or system preference for public routes
    const savedTheme = localStorage.getItem('saintlammy-theme') as Theme;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;

    setTheme(initialTheme);
  }, [isAdminRoute]);

  useEffect(() => {
    if (mounted) {
      applyTheme(theme);
      // Only persist theme for non-admin routes
      if (!isAdminRoute) {
        localStorage.setItem('saintlammy-theme', theme);
      }
    }
  }, [theme, mounted, isAdminRoute]);

  const applyTheme = (newTheme: Theme) => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;

    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    // Admin routes always stay dark
    if (isAdminRoute) return;
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const handleSetTheme = (newTheme: Theme) => {
    // Admin routes always stay dark
    if (isAdminRoute) return;
    setTheme(newTheme);
  };

  // Always provide context, even during SSR/hydration
  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      setTheme: handleSetTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};