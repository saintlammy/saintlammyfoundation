import React, { useState } from 'react';
import { Shield, TrendingUp, Target, Settings, Check } from 'lucide-react';
import { useCookieConsent } from '../contexts/CookieConsentContext';
import { CookiePreferences, getCookieDescriptions } from '../lib/cookieConsent';
import LandingModal from './home/LandingModal';

interface CookieSettingsDialogProps {
  initialPreferences: CookiePreferences;
  onClose: () => void;
  onSave: (preferences: CookiePreferences) => void;
}

const CookieSettingsDialog: React.FC<CookieSettingsDialogProps> = ({
  initialPreferences,
  onClose,
  onSave,
}) => {
  const [preferences, setPreferences] = useState<CookiePreferences>(initialPreferences);
  const descriptions = getCookieDescriptions();

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Cannot disable necessary cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    onSave(preferences);
  };

  const cookieTypes = [
    {
      key: 'necessary' as const,
      icon: Shield,
      ...descriptions.necessary,
    },
    {
      key: 'analytics' as const,
      icon: TrendingUp,
      ...descriptions.analytics,
    },
    {
      key: 'marketing' as const,
      icon: Target,
      ...descriptions.marketing,
    },
    {
      key: 'preferences' as const,
      icon: Settings,
      ...descriptions.preferences,
    },
  ];

  return (
    <LandingModal
      isOpen
      onClose={onClose}
      title="Cookie preferences"
      description="Choose which optional cookies may be used. Essential cookies remain active so the website works correctly."
      eyebrow="Privacy controls"
      icon={<Settings className="h-5 w-5" />}
      size="lg"
      className="cookie-modal-shell"
      bodyClassName="cookie-modal-body"
    >

        {/* Content */}
        <div className="landing-modal-content">
          <div className="space-y-4">
            {cookieTypes.map(({ key, icon: Icon, title, description, examples }) => {
              const isEnabled = preferences[key];
              const isNecessary = key === 'necessary';

              return (
                <div
                  key={key}
                  className="cookie-modal-option"
                  data-enabled={isEnabled}
                  data-locked={isNecessary}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="cookie-modal-option-icon">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                          {isNecessary && (
                            <span className="cookie-modal-required">
                              Always Active
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{description}</p>
                        <div className="flex flex-wrap gap-2">
                          {examples.map((example, idx) => (
                            <span
                              key={idx}
                              className="cookie-modal-example"
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
                      role="switch"
                      aria-checked={isEnabled}
                      aria-label={isNecessary
                        ? `${title} are always enabled`
                        : `${isEnabled ? 'Disable' : 'Enable'} ${title}`}
                      className="cookie-modal-toggle"
                      data-enabled={isEnabled}
                    >
                      <span className="cookie-modal-toggle-thumb">
                        {isEnabled && (
                          <Check className="h-3.5 w-3.5" />
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Info */}
          <div className="landing-modal-note mt-6 p-4">
            <p className="text-sm">
              <strong>Note:</strong> Necessary cookies are always enabled as they are essential for the website to function properly.
              You can change your preferences at any time by clicking the cookie icon in the footer.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="landing-modal-footer">
          <button
            onClick={handleSave}
            className="landing-modal-primary flex-1"
          >
            Save Preferences
          </button>
          <button
            onClick={onClose}
            className="landing-modal-secondary"
          >
            Cancel
          </button>
        </div>
    </LandingModal>
  );
};

const CookieSettings: React.FC = () => {
  const { showSettings, closeSettings, savePreferences, preferences } = useCookieConsent();

  if (!showSettings) return null;

  return (
    <CookieSettingsDialog
      initialPreferences={preferences}
      onClose={closeSettings}
      onSave={savePreferences}
    />
  );
};

export default CookieSettings;
