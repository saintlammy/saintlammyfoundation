import React, { createContext, useContext, useEffect, ReactNode } from 'react';
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

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');
  const theme: Theme = isAdminRoute ? 'dark' : 'light';

  useEffect(() => {
    applyTheme(theme);
    if (!isAdminRoute) {
      localStorage.setItem('saintlammy-theme', 'light');
    }
  }, [theme, isAdminRoute]);

  const toggleTheme = () => {
    // Public routes are intentionally light-only and admin routes stay dark.
    return;
  };

  const handleSetTheme = (_newTheme: Theme) => {
    // Theme changes are not exposed on either route family.
    return;
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
