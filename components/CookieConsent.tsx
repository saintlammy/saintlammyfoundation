import React, { useState } from 'react';
import { Cookie, Shield } from 'lucide-react';
import { useCookieConsent } from '../contexts/CookieConsentContext';

const CookieConsent: React.FC = () => {
  const { showBanner, acceptAll, rejectAll, openSettings } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <>
      {/* Minimal Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/10 backdrop-blur-[2px] animate-fade-in" />

      {/* Slick Minimal Banner */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl animate-slide-up">
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          {/* Content */}
          <div className="px-6 py-5">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Text & Actions */}
              <div className="flex-1 min-w-0">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Cookie Preferences
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    We use cookies to improve your experience. Essential cookies are always active.{' '}
                    <a href="/cookie-policy" className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 underline font-medium">
                      Learn more
                    </a>
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={acceptAll}
                    className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Accept All
                  </button>

                  <button
                    onClick={rejectAll}
                    className="px-5 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    Reject
                  </button>

                  <button
                    onClick={openSettings}
                    className="px-5 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    Customize
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Subtle Bottom Accent */}
          <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from {
            transform: translate(-50%, 20px);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
};

export default CookieConsent;
