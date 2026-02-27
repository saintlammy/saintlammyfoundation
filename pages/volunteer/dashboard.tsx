import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import VolunteerProtectedRoute from '@/components/volunteer/VolunteerProtectedRoute';
import SEOHead from '@/components/SEOHead';
import {
  Calendar,
  Clock,
  Award,
  TrendingUp,
  Users,
  MapPin,
  Heart,
  CheckCircle,
  AlertCircle,
  LogOut,
  User,
  Settings,
  FileText,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';

interface VolunteerData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  volunteers?: Array<{
    id: string;
    status: string;
    interests: string[];
    skills: string[];
    availability: string[];
    volunteer_roles?: {
      title: string;
      category: string;
    };
  }>;
}

const VolunteerDashboard: React.FC = () => {
  const router = useRouter();
  const { user, session, signOut } = useAuth();
  const [volunteerData, setVolunteerData] = useState<VolunteerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchVolunteerData();
    }
  }, [session]);

  const fetchVolunteerData = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setVolunteerData(data.user);
      }
    } catch (error) {
      console.error('Error fetching volunteer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/volunteer/login');
  };

  const stats = {
    hoursLogged: 0, // Placeholder - will be calculated from time logs
    eventsAttended: 0, // Placeholder
    impactScore: 0, // Placeholder
    upcomingEvents: 0 // Placeholder
  };

  const volunteerRecord = volunteerData?.volunteers?.[0];
  const assignedRole = volunteerRecord?.volunteer_roles;

  return (
    <VolunteerProtectedRoute>
      <SEOHead
        title="Volunteer Dashboard - Saintlammy Foundation"
        description="Your volunteer portal dashboard"
        canonical="/volunteer/dashboard"
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header/Navigation */}
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-4">
                <Heart className="h-8 w-8 text-accent-500" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Volunteer Portal
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Saintlammy Foundation
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/volunteer/profile')}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">Profile</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
            </div>
          ) : (
            <>
              {/* Welcome Section */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome back, {volunteerData?.name?.split(' ')[0] || 'Volunteer'}! 👋
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Here's your volunteer activity overview
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Hours Logged</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.hoursLogged}</p>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
                      <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Events Attended</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.eventsAttended}</p>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
                      <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Impact Score</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.impactScore}</p>
                    </div>
                    <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
                      <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.upcomingEvents}</p>
                    </div>
                    <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Assigned Role */}
                  {assignedRole && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Users className="h-5 w-5 text-accent-500" />
                        Your Current Role
                      </h3>
                      <div className="bg-accent-50 dark:bg-accent-900/20 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-xl font-bold text-accent-900 dark:text-accent-100">
                              {assignedRole.title}
                            </h4>
                            <p className="text-sm text-accent-700 dark:text-accent-300 mt-1 capitalize">
                              {assignedRole.category}
                            </p>
                          </div>
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-medium px-3 py-1 rounded-full">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Upcoming Assignments */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-accent-500" />
                      Upcoming Assignments
                    </h3>
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">No upcoming assignments yet</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        Check back later for new opportunities
                      </p>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-accent-500" />
                      Recent Activity
                    </h3>
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">No recent activity</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        Your volunteer activities will appear here
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                  {/* Profile Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Profile</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-accent-100 dark:bg-accent-900/20 rounded-full p-3">
                          <User className="h-6 w-6 text-accent-600 dark:text-accent-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{volunteerData?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{volunteerData?.email}</p>
                        </div>
                      </div>

                      {volunteerRecord && (
                        <>
                          {volunteerRecord.status && (
                            <div className="flex items-center justify-between py-2 border-t border-gray-200 dark:border-gray-700">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                              <span className="text-sm font-medium text-green-600 dark:text-green-400 capitalize">
                                {volunteerRecord.status}
                              </span>
                            </div>
                          )}

                          {volunteerRecord.interests && volunteerRecord.interests.length > 0 && (
                            <div className="py-2 border-t border-gray-200 dark:border-gray-700">
                              <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Interests</span>
                              <div className="flex flex-wrap gap-2">
                                {volunteerRecord.interests.map((interest, index) => (
                                  <span
                                    key={index}
                                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                                  >
                                    {interest}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      <button
                        onClick={() => router.push('/volunteer/profile')}
                        className="w-full mt-4 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => router.push('/volunteer/opportunities')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Users className="h-5 w-5 text-accent-500" />
                        <span>Browse Opportunities</span>
                      </button>
                      <button
                        onClick={() => router.push('/volunteer/hours')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Clock className="h-5 w-5 text-accent-500" />
                        <span>Log Hours</span>
                      </button>
                      <button
                        onClick={() => router.push('/volunteer/reports')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <FileText className="h-5 w-5 text-accent-500" />
                        <span>View Reports</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </VolunteerProtectedRoute>
  );
};

export default VolunteerDashboard;
