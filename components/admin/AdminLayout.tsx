import React, { useState, ReactNode, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import NotificationBell from '@/components/NotificationBell';
import { useAutoLogout } from '@/hooks/useAutoLogout';
import AutoLogoutModal from '@/components/AutoLogoutModal';
import NextImage from 'next/image';
import {
  BarChart3,
  Users,
  Heart,
  Wallet,
  Settings,
  FileText,
  Calendar,
  MessageSquare,
  Shield,
  TrendingUp,
  PieChart,
  UserCheck,
  Globe,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Bell,
  Search,
  Newspaper,
  Image,
  Target,
  Cookie,
  Calculator,
  Home,
  Briefcase,
  ClipboardList,
  FormInput
} from 'lucide-react';
import clsx from 'clsx';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  href?: string;
  children?: MenuItem[];
  badge?: string | number;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title = 'Dashboard' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['dashboard']);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDesktop, setIsDesktop] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const sidebarOpenerRef = useRef<HTMLButtonElement>(null);
  const sidebarWasOpenRef = useRef(false);
  const router = useRouter();
  const { user, signOut } = useAuth();

  // Admin dashboard always uses dark mode - force dark class on <html>
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    return () => {
      // Public routes always return to the single light theme.
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    };
  }, []);

  // Auto-logout after 60 minutes of inactivity
  const { showLogoutModal, logoutReason, closeModal } = useAutoLogout({
    timeoutMinutes: 60,
    onLogout: (reason) => {
      if (process.env.NODE_ENV === 'development') console.warn(`User logged out due to: ${reason}`);
    }
  });

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (!error) {
        router.push('/admin/login');
      } else {
        console.error('Sign out error:', error);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const menuItems = useMemo<MenuItem[]>(() => [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      href: '/admin'
    },
    {
      id: 'donations',
      label: 'Donations',
      icon: Heart,
      children: [
        { id: 'donations-overview', label: 'Overview', icon: PieChart, href: '/admin/donations' },
        { id: 'donations-recurring', label: 'Recurring', icon: Calendar, href: '/admin/donations/recurring' },
        { id: 'donations-analytics', label: 'Analytics', icon: BarChart3, href: '/admin/donations/analytics' }
      ]
    },
    {
      id: 'campaigns',
      label: 'Campaigns',
      icon: Target,
      href: '/admin/campaigns'
    },
    {
      id: 'wallets',
      label: 'Crypto Wallets',
      icon: Wallet,
      href: '/admin/wallet-management'
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      children: [
        { id: 'users-all', label: 'All Users', icon: Users, href: '/admin/users' },
        { id: 'users-donors', label: 'Donors', icon: Heart, href: '/admin/users/donors' },
        {
          id: 'users-volunteers',
          label: 'Volunteers',
          icon: UserCheck,
          children: [
            { id: 'users-volunteers-all', label: 'All Volunteers', icon: UserCheck, href: '/admin/users/volunteers' },
            { id: 'users-volunteer-roles', label: 'Volunteer Roles', icon: Briefcase, href: '/admin/users/volunteer-roles' },
            { id: 'users-volunteer-forms', label: 'Registration Forms', icon: ClipboardList, href: '/admin/users/volunteer-forms' }
          ]
        },
        { id: 'users-admins', label: 'Administrators', icon: Shield, href: '/admin/users/admins' }
      ]
    },
    {
      id: 'content',
      label: 'Content',
      icon: FileText,
      children: [
        { id: 'content-all', label: 'All Content', icon: FileText, href: '/admin/content' },
        { id: 'content-outreach-reports', label: 'Outreach Reports', icon: FileText, href: '/admin/content/outreach-reports' },
        { id: 'content-testimonials', label: 'Testimonials', icon: MessageSquare, href: '/admin/content/testimonials' },
        { id: 'content-volunteers', label: 'Volunteers', icon: UserCheck, href: '/admin/content/volunteers' },
        { id: 'content-beneficiaries', label: 'Beneficiaries', icon: Users, href: '/admin/content/beneficiaries' },
        { id: 'content-orphanage-homes', label: 'Orphanage Homes', icon: Home, href: '/admin/content/orphanage-homes' }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
      children: [
        { id: 'analytics-overview', label: 'Donation Metrics', icon: BarChart3, href: '/admin/analytics' }
      ]
    },
    {
      id: 'communications',
      label: 'Communications',
      icon: MessageSquare,
      children: [
        { id: 'communications-messages', label: 'Messages', icon: MessageSquare, href: '/admin/communications/messages' },
        { id: 'communications-newsletter', label: 'Newsletter', icon: Bell, href: '/admin/communications/newsletter' },
        { id: 'communications-notifications', label: 'Notifications', icon: Bell, href: '/admin/communications/notifications' }
      ]
    },
    {
      id: 'budget-template',
      label: 'Budget Template',
      icon: Calculator,
      href: '/admin/budget-template'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      children: [
        { id: 'settings-general', label: 'General', icon: Settings, href: '/admin/settings' },
        { id: 'settings-security', label: 'Account Security', icon: Shield, href: '/admin/settings/security' },
        { id: 'settings-cookie-compliance', label: 'Cookie Compliance', icon: Cookie, href: '/admin/cookie-compliance' },
        { id: 'settings-form-options', label: 'Form Options', icon: FormInput, href: '/admin/settings/form-options' }
      ]
    }
  ], []);

  const searchableItems = useMemo(() => {
    const flattened: Array<{ id: string; label: string; href: string }> = [];
    const visit = (items: MenuItem[]) => items.forEach((item) => {
      if (item.href) flattened.push({ id: item.id, label: item.label, href: item.href });
      if (item.children) visit(item.children);
    });
    visit(menuItems);
    return flattened;
  }, [menuItems]);

  const searchResults = searchQuery.trim()
    ? searchableItems.filter((item) => item.label.toLowerCase().includes(searchQuery.trim().toLowerCase())).slice(0, 6)
    : [];

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const isActiveRoute = (href: string) => {
    return router.pathname === href;
  };

  const isMenuActive = (item: MenuItem): boolean => {
    if (item.href && isActiveRoute(item.href)) {
      return true;
    }
    if (item.children) {
      return item.children.some(child => isMenuActive(child));
    }
    return false;
  };

  // Auto-expand parent menus when child routes are active
  useEffect(() => {
    const findParentMenusToExpand = (items: MenuItem[], currentPath: string): string[] => {
      const menusToExpand: string[] = [];

      const checkMenuItem = (item: MenuItem): boolean => {
        if (item.href === currentPath) {
          return true;
        }
        if (item.children) {
          const hasActiveChild = item.children.some(child => checkMenuItem(child));
          if (hasActiveChild) {
            menusToExpand.push(item.id);
            return true;
          }
        }
        return false;
      };

      items.forEach(item => checkMenuItem(item));
      return menusToExpand;
    };

    const menusToExpand = findParentMenusToExpand(menuItems, router.pathname);
    if (menusToExpand.length > 0) {
      setExpandedMenus(prev => {
        const newExpanded = [...new Set([...prev, ...menusToExpand])];
        return newExpanded;
      });
    }
  }, [menuItems, router.pathname]);

  useEffect(() => {
    setSidebarOpen(false);
    setSearchQuery('');
  }, [router.asPath]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const updateViewport = () => setIsDesktop(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);
    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  useEffect(() => {
    if (isDesktop) return;

    if (!sidebarOpen) {
      if (sidebarWasOpenRef.current) sidebarOpenerRef.current?.focus();
      sidebarWasOpenRef.current = false;
      return;
    }

    sidebarWasOpenRef.current = true;
    const sidebar = sidebarRef.current;
    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusable = sidebar?.querySelectorAll<HTMLElement>(focusableSelector);
    (focusable?.[0] ?? sidebar)?.focus();

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setSidebarOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !sidebar) return;

      const elements = Array.from(sidebar.querySelectorAll<HTMLElement>(focusableSelector));
      if (elements.length === 0) {
        event.preventDefault();
        sidebar.focus();
        return;
      }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', trapFocus);
    return () => window.removeEventListener('keydown', trapFocus);
  }, [isDesktop, sidebarOpen]);

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.id);
    const isActive = item.href ? isActiveRoute(item.href) : false;
    const hasActiveChild = hasChildren && isMenuActive(item);

    if (hasChildren) {
      return (
        <div key={item.id} className="mb-1">
          <button
            type="button"
            onClick={() => toggleMenu(item.id)}
            aria-expanded={isExpanded || Boolean(hasActiveChild)}
            aria-controls={`admin-menu-${item.id}`}
            className={clsx(
              'w-full flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-colors',
              level === 0 ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50',
              (isExpanded || hasActiveChild) && 'text-white bg-gray-700'
            )}
            style={{ paddingLeft: `${12 + level * 16}px` }}
          >
            <div className="flex items-center">
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-accent-500 text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
            <ChevronDown className={clsx(
              'w-4 h-4 transition-transform',
              (isExpanded || hasActiveChild) && 'rotate-180'
            )} />
          </button>

          {(isExpanded || hasActiveChild) && item.children && (
            <div id={`admin-menu-${item.id}`} className="mt-1 space-y-1">
              {item.children.map(child => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={item.id} className="mb-1">
        <Link
          href={item.href || '/admin'}
          className={clsx(
            'w-full flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-colors block',
            isActive
              ? 'text-white bg-accent-500'
              : level === 0
                ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
          )}
          style={{ paddingLeft: `${12 + level * 16}px` }}
        >
          <div className="flex items-center">
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-accent-500 text-white rounded-full">
                {item.badge}
              </span>
            )}
          </div>
        </Link>
      </div>
    );
  };

  return (
    <ProtectedRoute requireAdmin={true}>
    <div className="flex h-screen bg-gray-900">
      <a href="#admin-main" className="sr-only z-[70] rounded-lg bg-white px-4 py-2 text-gray-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to admin content</a>
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        tabIndex={-1}
        aria-label="Admin navigation"
        aria-modal={!isDesktop && sidebarOpen ? 'true' : undefined}
        aria-hidden={!isDesktop && !sidebarOpen}
        inert={!isDesktop && !sidebarOpen ? true : undefined}
        role={!isDesktop && sidebarOpen ? 'dialog' : undefined}
        className={clsx(
        'fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 flex flex-col transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between h-16 px-4 bg-gray-900 border-b border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 p-1.5">
              <NextImage
                src="/images/logo/logo-icon.svg"
                alt="Saintlammy Foundation"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-lg font-semibold text-white font-display">
              Admin Panel
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close admin navigation"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 px-4 py-6 overflow-y-auto bg-gray-800">
          <nav className="space-y-2" aria-label="Primary admin sections">
            {menuItems.map(item => renderMenuItem(item))}
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.user_metadata?.name?.charAt(0)?.toUpperCase() ||
                 user?.email?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-white">
                {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Admin'}
              </p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              aria-label="Sign out"
              className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                ref={sidebarOpenerRef}
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open admin navigation"
                aria-expanded={sidebarOpen}
                className="mr-3 flex h-11 w-11 items-center justify-center rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-semibold text-white font-display">
                {title}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <label htmlFor="admin-search" className="sr-only">Search admin pages</label>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  id="admin-search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && searchResults[0]) router.push(searchResults[0].href);
                    if (event.key === 'Escape') setSearchQuery('');
                  }}
                  placeholder="Search admin pages"
                  autoComplete="off"
                  role="combobox"
                  aria-expanded={searchResults.length > 0}
                  aria-autocomplete="list"
                  aria-activedescendant={searchResults[0] ? `admin-search-option-${searchResults[0].id}` : undefined}
                  aria-controls="admin-search-results"
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                />
                {searchResults.length > 0 && (
                  <div id="admin-search-results" className="absolute right-0 top-full z-30 mt-2 w-72 overflow-hidden rounded-xl border border-gray-600 bg-gray-800 py-2 shadow-xl" role="listbox">
                    {searchResults.map((result) => (
                      <Link key={result.id} id={`admin-search-option-${result.id}`} href={result.href} role="option" aria-selected={result.id === searchResults[0].id} className="block px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 hover:text-white">
                        {result.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Admin Dashboard uses permanent dark mode */}
              {/* Notifications */}
              <NotificationBell />

              {/* User Menu */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.user_metadata?.name?.charAt(0)?.toUpperCase() ||
                     user?.email?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main id="admin-main" className="flex-1 overflow-y-auto bg-gray-900 p-4 sm:p-6" tabIndex={-1}>
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close admin navigation"
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Auto Logout Modal */}
      <AutoLogoutModal
        isOpen={showLogoutModal}
        reason={logoutReason}
        onClose={closeModal}
      />
    </div>
    </ProtectedRoute>
  );
};

export default AdminLayout;
