import React, { useState } from 'react';
import { X, Cookie, Shield, TrendingUp, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { useCookieConsent } from '../contexts/CookieConsentContext';
import { CookiePreferences, getCookieDescriptions } from '../lib/cookieConsent';

const CookieConsent: React.FC = () => {
  const { showBanner, acceptAll, rejectAll, openSettings } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto" />

      {/* Cookie Banner */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl pointer-events-auto transform transition-all duration-500 ease-out animate-slide-up">
        {/* Decorative Top Border */}
        <div className="h-2 bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 rounded-t-2xl" />

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Cookie className="w-7 h-7 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                We Value Your Privacy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We use cookies to enhance your browsing experience, provide personalized content, and analyze our traffic.
                By clicking "Accept All", you consent to our use of cookies.
              </p>
            </div>
          </div>

          {/* Cookie Types Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-900">Necessary</p>
                <p className="text-xs text-green-700">Always active</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-900">Analytics</p>
                <p className="text-xs text-blue-700">Improve experience</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <Settings className="w-5 h-5 text-purple-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-purple-900">Preferences</p>
                <p className="text-xs text-purple-700">Remember settings</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={acceptAll}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Accept All Cookies
            </button>

            <button
              onClick={rejectAll}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
            >
              Reject All
            </button>

            <button
              onClick={openSettings}
              className="px-6 py-3 border-2 border-green-500 text-green-600 font-semibold rounded-xl hover:bg-green-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Customize
            </button>
          </div>

          {/* Privacy Policy Link */}
          <div className="mt-4 text-center">
            <a
              href="/cookie-policy"
              className="text-sm text-green-600 hover:text-green-700 underline font-medium"
            >
              Learn more about our cookie policy
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CookieConsent;
