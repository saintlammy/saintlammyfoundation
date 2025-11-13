import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  CookiePreferences,
  CookieConsentData,
  getCookieConsent,
  saveCookieConsent,
  hasUserConsented,
  acceptAllCookies,
  rejectAllCookies,
  defaultPreferences,
} from '../lib/cookieConsent';

interface CookieConsentContextType {
  showBanner: boolean;
  consentData: CookieConsentData | null;
  preferences: CookiePreferences;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (preferences: CookiePreferences) => void;
  openSettings: () => void;
  closeSettings: () => void;
  showSettings: boolean;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider');
  }
  return context;
};

interface CookieConsentProviderProps {
  children: ReactNode;
}

export const CookieConsentProvider: React.FC<CookieConsentProviderProps> = ({ children }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consentData, setConsentData] = useState<CookieConsentData | null>(null);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = hasUserConsented();
    const consent = getCookieConsent();

    if (hasConsented && consent) {
      setConsentData(consent);
      setPreferences(consent.preferences);
      setShowBanner(false);
    } else {
      // Show banner after a short delay for better UX
      setTimeout(() => {
        setShowBanner(true);
      }, 1000);
    }
  }, []);

  const acceptAll = () => {
    const allAcceptedPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };

    acceptAllCookies();

    // Update state immediately with the expected values
    setPreferences(allAcceptedPreferences);

    // Then get the saved consent data
    const consent = getCookieConsent();
    setConsentData(consent);

    setShowBanner(false);
    setShowSettings(false);
  };

  const rejectAll = () => {
    const rejectedPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };

    rejectAllCookies();

    // Update state immediately with the expected values
    setPreferences(rejectedPreferences);

    // Then get the saved consent data
    const consent = getCookieConsent();
    setConsentData(consent);

    setShowBanner(false);
    setShowSettings(false);
  };

  const savePreferences = (newPreferences: CookiePreferences) => {
    saveCookieConsent(newPreferences, 'customize');
    const consent = getCookieConsent();
    setConsentData(consent);
    setPreferences(newPreferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const openSettings = () => {
    setShowSettings(true);
  };

  const closeSettings = () => {
    setShowSettings(false);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        showBanner,
        consentData,
        preferences,
        acceptAll,
        rejectAll,
        savePreferences,
        openSettings,
        closeSettings,
        showSettings,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};
