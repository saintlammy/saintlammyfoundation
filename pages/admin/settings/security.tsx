import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Shield,
  Key,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  User,
  Activity
} from 'lucide-react';
import { getTypedSupabaseClient } from '@/lib/supabase';

interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  passwordLastChanged: string;
  loginNotifications: boolean;
  ipWhitelist: string[];
  apiKeysActive: number;
}

interface LoginSession {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  current: boolean;
}

interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'password_change' | 'failed_login' | '2fa_enabled' | '2fa_disabled';
  timestamp: string;
  ipAddress: string;
  device: string;
  status: 'success' | 'failed' | 'warning';
}

const SecurityManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    passwordLastChanged: '',
    loginNotifications: true,
    ipWhitelist: [],
    apiKeysActive: 0
  });
  const [sessions, setSessions] = useState<LoginSession[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      // In production, this would fetch from database
      await new Promise(resolve => setTimeout(resolve, 500));

      setSettings({
        twoFactorEnabled: false,
        sessionTimeout: 30,
        passwordLastChanged: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        loginNotifications: true,
        ipWhitelist: ['192.168.1.1', '10.0.0.1'],
        apiKeysActive: 3
      });

      setSessions([
        {
          id: '1',
          device: 'Chrome on MacOS',
          location: 'Lagos, Nigeria',
          ipAddress: '197.210.85.123',
          lastActive: new Date().toISOString(),
          current: true
        },
        {
          id: '2',
          device: 'Safari on iPhone',
          location: 'Abuja, Nigeria',
          ipAddress: '197.210.52.89',
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          current: false
        },
        {
          id: '3',
          device: 'Firefox on Windows',
          location: 'Port Harcourt, Nigeria',
          ipAddress: '197.210.74.201',
          lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          current: false
        }
      ]);

      setSecurityEvents([
        {
          id: '1',
          type: 'login',
          timestamp: new Date().toISOString(),
          ipAddress: '197.210.85.123',
          device: 'Chrome on MacOS',
          status: 'success'
        },
        {
          id: '2',
          type: 'failed_login',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          ipAddress: '103.55.145.78',
          device: 'Unknown',
          status: 'failed'
        },
        {
          id: '3',
          type: 'password_change',
          timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          ipAddress: '197.210.85.123',
          device: 'Chrome on MacOS',
          status: 'success'
        },
        {
          id: '4',
          type: 'login',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          ipAddress: '197.210.74.201',
          device: 'Firefox on Windows',
          status: 'success'
        },
        {
          id: '5',
          type: 'failed_login',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          ipAddress: '45.142.120.21',
          device: 'Unknown',
          status: 'failed'
        }
      ]);
    } catch (error) {
      console.error('Error loading security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle2FA = () => {
    setSettings({ ...settings, twoFactorEnabled: !settings.twoFactorEnabled });
    alert(`Two-factor authentication ${!settings.twoFactorEnabled ? 'enabled' : 'disabled'} successfully`);
  };

  const handleToggleLoginNotifications = () => {
    setSettings({ ...settings, loginNotifications: !settings.loginNotifications });
  };

  const handleSessionTimeoutChange = (minutes: number) => {
    setSettings({ ...settings, sessionTimeout: minutes });
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
    alert('Session revoked successfully');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    // In production, this would call the API
    alert('Password changed successfully');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'logout':
        return <Lock className="w-5 h-5 text-gray-500" />;
      case 'password_change':
        return <Key className="w-5 h-5 text-blue-500" />;
      case 'failed_login':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case '2fa_enabled':
        return <Shield className="w-5 h-5 text-green-500" />;
      case '2fa_disabled':
        return <Shield className="w-5 h-5 text-yellow-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getEventLabel = (type: string) => {
    switch (type) {
      case 'login':
        return 'Successful Login';
      case 'logout':
        return 'Logout';
      case 'password_change':
        return 'Password Changed';
      case 'failed_login':
        return 'Failed Login Attempt';
      case '2fa_enabled':
        return '2FA Enabled';
      case '2fa_disabled':
        return '2FA Disabled';
      default:
        return 'Security Event';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <Head>
        <title>Security Settings - Admin Dashboard</title>
        <meta name="description" content="Manage security settings and monitor activity" />
      </Head>

      <AdminLayout title="Security Settings">
        <div className="space-y-6">
          {/* Security Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 dark:text-gray-400 text-sm">Two-Factor Auth</p>
                <Shield className={`w-5 h-5 ${settings.twoFactorEnabled ? 'text-green-500' : 'text-gray-400'}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {settings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {settings.twoFactorEnabled ? 'Account is secure' : 'Recommended for security'}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 dark:text-gray-400 text-sm">Active Sessions</p>
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {sessions.length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Across {sessions.length} device{sessions.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 dark:text-gray-400 text-sm">Password Age</p>
                <Key className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {Math.floor((Date.now() - new Date(settings.passwordLastChanged).getTime()) / (1000 * 60 * 60 * 24))} days
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Last changed {formatTimestamp(settings.passwordLastChanged)}
              </p>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5" />
              Change Password
            </h3>
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full px-4 py-2 pr-10 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-4 py-2 pr-10 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-medium transition-colors"
              >
                Update Password
              </button>
            </form>
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                onClick={handleToggle2FA}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  settings.twoFactorEnabled
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {settings.twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
              </button>
            </div>
            {settings.twoFactorEnabled && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <p className="font-medium">Two-factor authentication is active</p>
                </div>
                <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                  Your account is protected with authenticator app verification
                </p>
              </div>
            )}
          </div>

          {/* Security Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Login Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive email alerts for new logins</p>
                  </div>
                </div>
                <button
                  onClick={handleToggleLoginNotifications}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.loginNotifications ? 'bg-accent-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                      settings.loginNotifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Session Timeout</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Auto-logout after inactivity</p>
                  </div>
                </div>
                <select
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSessionTimeoutChange(Number(e.target.value))}
                  className="px-4 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={0}>Never</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Sessions</h3>
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Smartphone className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-white">{session.device}</p>
                        {session.current && (
                          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {session.location} • {session.ipAddress}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Last active {formatTimestamp(session.lastActive)}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <button
                      onClick={() => handleRevokeSession(session.id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Security Events */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Security Events</h3>
            <div className="space-y-3">
              {securityEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  {getEventIcon(event.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 dark:text-white">{getEventLabel(event.type)}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {event.device} • {event.ipAddress}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default SecurityManagement;
