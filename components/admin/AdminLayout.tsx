import React, { useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
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
  Search
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
  const router = useRouter();
  const { user, signOut, isAdmin, isModerator } = useAuth();

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

  const menuItems: MenuItem[] = [
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
        { id: 'donations-transactions', label: 'Transactions', icon: TrendingUp, href: '/admin/donations/transactions' },
        { id: 'donations-recurring', label: 'Recurring', icon: Calendar, href: '/admin/donations/recurring' },
        { id: 'donations-analytics', label: 'Analytics', icon: BarChart3, href: '/admin/donations/analytics' }
      ]
    },
    {
      id: 'wallets',
      label: 'Crypto Wallets',
      icon: Wallet,
      href: '/admin/wallet-management',
      badge: '5'
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      children: [
        { id: 'users-all', label: 'All Users', icon: Users, href: '/admin/users' },
        { id: 'users-donors', label: 'Donors', icon: Heart, href: '/admin/users/donors' },
        { id: 'users-volunteers', label: 'Volunteers', icon: UserCheck, href: '/admin/users/volunteers' },
        { id: 'users-admins', label: 'Administrators', icon: Shield, href: '/admin/users/admins' }
      ]
    },
    {
      id: 'content',
      label: 'Content',
      icon: FileText,
      children: [
        { id: 'content-pages', label: 'Pages', icon: Globe, href: '/admin/content/pages' },
        { id: 'content-programs', label: 'Programs', icon: Heart, href: '/admin/content/programs' },
        { id: 'content-outreaches', label: 'Outreaches', icon: Calendar, href: '/admin/content/outreaches' },
        { id: 'content-testimonials', label: 'Testimonials', icon: MessageSquare, href: '/admin/content/testimonials' }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
      children: [
        { id: 'analytics-overview', label: 'Overview', icon: BarChart3, href: '/admin/analytics' },
        { id: 'analytics-donations', label: 'Donation Metrics', icon: Heart, href: '/admin/analytics/donations' },
        { id: 'analytics-website', label: 'Website Traffic', icon: Globe, href: '/admin/analytics/website' },
        { id: 'analytics-reports', label: 'Reports', icon: FileText, href: '/admin/analytics/reports' }
      ]
    },
    {
      id: 'communications',
      label: 'Communications',
      icon: MessageSquare,
      children: [
        { id: 'communications-messages', label: 'Messages', icon: MessageSquare, href: '/admin/communications/messages', badge: '12' },
        { id: 'communications-newsletter', label: 'Newsletter', icon: Bell, href: '/admin/communications/newsletter' },
        { id: 'communications-notifications', label: 'Notifications', icon: Bell, href: '/admin/communications/notifications' }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      children: [
        { id: 'settings-general', label: 'General', icon: Settings, href: '/admin/settings' },
        { id: 'settings-payment', label: 'Payment Gateway', icon: Wallet, href: '/admin/settings/payment' },
        { id: 'settings-security', label: 'Security', icon: Shield, href: '/admin/settings/security' },
        { id: 'settings-integrations', label: 'Integrations', icon: Globe, href: '/admin/settings/integrations' }
      ]
    }
  ];

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

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.id);
    const isActive = item.href ? isActiveRoute(item.href) : false;

    if (hasChildren) {
      return (
        <div key={item.id} className="mb-1">
          <button
            onClick={() => toggleMenu(item.id)}
            className={clsx(
              'w-full flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-colors',
              level === 0 ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50',
              isExpanded && 'text-white bg-gray-700'
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
              isExpanded && 'rotate-180'
            )} />
          </button>

          {isExpanded && item.children && (
            <div className="mt-1 space-y-1">
              {item.children.map(child => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={item.id} className="mb-1">
        <a
          href={item.href}
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
        </a>
      </div>
    );
  };

  return (
    <ProtectedRoute requireAdmin={true}>
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className={clsx(
        'fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center mr-3">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-white font-display">
              Admin Panel
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <nav className="space-y-2">
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
              onClick={handleSignOut}
              className="text-gray-400 hover:text-white"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white mr-4"
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                />
              </div>

              {/* Notifications */}
              <button className="relative text-gray-400 hover:text-white">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-accent-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>

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
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
    </ProtectedRoute>
  );
};

export default AdminLayout;