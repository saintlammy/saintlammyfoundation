import React, { useState } from 'react';
import { X, Shield, TrendingUp, Target, Settings, Check } from 'lucide-react';
import { useCookieConsent } from '../contexts/CookieConsentContext';
import { CookiePreferences, getCookieDescriptions } from '../lib/cookieConsent';

const CookieSettings: React.FC = () => {
  const { showSettings, closeSettings, savePreferences, preferences: initialPreferences } = useCookieConsent();
  const [preferences, setPreferences] = useState<CookiePreferences>(initialPreferences);
  const descriptions = getCookieDescriptions();

  if (!showSettings) return null;

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Cannot disable necessary cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    savePreferences(preferences);
  };

  const cookieTypes = [
    {
      key: 'necessary' as const,
      icon: Shield,
      color: 'green',
      ...descriptions.necessary,
    },
    {
      key: 'analytics' as const,
      icon: TrendingUp,
      color: 'blue',
      ...descriptions.analytics,
    },
    {
      key: 'marketing' as const,
      icon: Target,
      color: 'purple',
      ...descriptions.marketing,
    },
    {
      key: 'preferences' as const,
      icon: Settings,
      color: 'orange',
      ...descriptions.preferences,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Cookie Preferences</h2>
          </div>
          <button
            onClick={closeSettings}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <p className="text-gray-600 mb-6">
            Customize your cookie preferences below. You can enable or disable different types of cookies based on your preferences.
          </p>

          <div className="space-y-4">
            {cookieTypes.map(({ key, icon: Icon, color, title, description, examples }) => {
              const isEnabled = preferences[key];
              const isNecessary = key === 'necessary';

              return (
                <div
                  key={key}
                  className={`border-2 rounded-xl p-5 transition-all duration-200 ${
                    isEnabled
                      ? `border-${color}-500 bg-${color}-50`
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isEnabled
                            ? `bg-${color}-500`
                            : 'bg-gray-200'
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${isEnabled ? 'text-white' : 'text-gray-500'}`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                          {isNecessary && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                              Always Active
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{description}</p>
                        <div className="flex flex-wrap gap-2">
                          {examples.map((example, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                            >
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      onClick={() => togglePreference(key)}
                      disabled={isNecessary}
                      className={`relative w-14 h-8 rounded-full transition-all duration-200 flex-shrink-0 ${
                        isNecessary ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                      } ${isEnabled ? `bg-${color}-500` : 'bg-gray-300'}`}
                    >
                      <div
                        className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200 ${
                          isEnabled ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      >
                        {isEnabled && (
                          <Check className="w-4 h-4 text-green-500 absolute top-1 left-1" />
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> Necessary cookies are always enabled as they are essential for the website to function properly.
              You can change your preferences at any time by clicking the cookie icon in the footer.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg"
          >
            Save Preferences
          </button>
          <button
            onClick={closeSettings}
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieSettings;
