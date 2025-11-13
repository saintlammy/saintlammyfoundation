// Cookie Consent Management
// Handles cookie consent preferences and storage

export interface CookiePreferences {
  necessary: boolean; // Always true, cannot be disabled
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export interface CookieConsentData {
  hasConsented: boolean;
  consentDate?: string;
  preferences: CookiePreferences;
}

const COOKIE_CONSENT_KEY = 'saintlammy_cookie_consent';
const CONSENT_VERSION = '1.0'; // Increment when cookie policy changes

export const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
};

/**
 * Get stored cookie consent data
 */
export const getCookieConsent = (): CookieConsentData | null => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored);

    // Check if consent version matches
    if (data.version !== CONSENT_VERSION) {
      // Clear old consent if version changed
      clearCookieConsent();
      return null;
    }

    return {
      hasConsented: data.hasConsented || false,
      consentDate: data.consentDate,
      preferences: data.preferences || defaultPreferences,
    };
  } catch (error) {
    console.error('Error reading cookie consent:', error);
    return null;
  }
};

/**
 * Save cookie consent preferences
 */
export const saveCookieConsent = (preferences: CookiePreferences, action?: 'accept_all' | 'reject_all' | 'customize'): void => {
  if (typeof window === 'undefined') return;

  const consentData = {
    version: CONSENT_VERSION,
    hasConsented: true,
    consentDate: new Date().toISOString(),
    preferences: {
      ...preferences,
      necessary: true, // Always true
    },
  };

  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));

    // Apply preferences immediately
    applyCookiePreferences(preferences);

    // Log to backend for analytics and compliance
    logConsentToBackend(preferences, action);
  } catch (error) {
    console.error('Error saving cookie consent:', error);
  }
};

/**
 * Log consent to backend for compliance tracking
 */
const logConsentToBackend = async (preferences: CookiePreferences, action?: string): Promise<void> => {
  if (typeof window === 'undefined') return;

  try {
    // Generate or get session ID
    let sessionId = sessionStorage.getItem('cookie_session_id');
    if (!sessionId) {
      sessionId = generateSessionId();
      sessionStorage.setItem('cookie_session_id', sessionId);
    }

    // Determine consent action
    let consentAction: 'accept_all' | 'reject_all' | 'customize' = 'customize';
    if (action) {
      consentAction = action as any;
    } else if (preferences.analytics && preferences.marketing && preferences.preferences) {
      consentAction = 'accept_all';
    } else if (!preferences.analytics && !preferences.marketing && !preferences.preferences) {
      consentAction = 'reject_all';
    }

    // Send to backend (non-blocking, fire and forget)
    fetch('/api/cookie-consent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        consentAction,
        necessary: preferences.necessary,
        analytics: preferences.analytics,
        marketing: preferences.marketing,
        preferences: preferences.preferences,
        consentVersion: CONSENT_VERSION,
        pageUrl: window.location.href,
        referrer: document.referrer || undefined,
      }),
    }).catch(err => {
      // Silently fail - don't block user experience
      console.log('Cookie consent logging failed (non-critical):', err);
    });
  } catch (error) {
    console.log('Error logging cookie consent (non-critical):', error);
  }
};

/**
 * Generate a unique session ID
 */
const generateSessionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Clear cookie consent data
 */
export const clearCookieConsent = (): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(COOKIE_CONSENT_KEY);

    // Clear analytics cookies if they were set
    clearAnalyticsCookies();
  } catch (error) {
    console.error('Error clearing cookie consent:', error);
  }
};

/**
 * Check if user has consented to cookies
 */
export const hasUserConsented = (): boolean => {
  const consent = getCookieConsent();
  return consent?.hasConsented || false;
};

/**
 * Get specific cookie preference
 */
export const getCookiePreference = (type: keyof CookiePreferences): boolean => {
  const consent = getCookieConsent();
  return consent?.preferences[type] || false;
};

/**
 * Apply cookie preferences (enable/disable tracking)
 */
export const applyCookiePreferences = (preferences: CookiePreferences): void => {
  if (typeof window === 'undefined') return;

  // Analytics cookies
  if (preferences.analytics) {
    enableAnalytics();
  } else {
    disableAnalytics();
  }

  // Marketing cookies
  if (preferences.marketing) {
    enableMarketing();
  } else {
    disableMarketing();
  }

  // Preference cookies (theme, language, etc.)
  // These are handled separately and don't need special action
};

/**
 * Enable analytics tracking
 */
const enableAnalytics = (): void => {
  // Google Analytics (if implemented)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      analytics_storage: 'granted',
    });
  }

  console.log('Analytics cookies enabled');
};

/**
 * Disable analytics tracking
 */
const disableAnalytics = (): void => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      analytics_storage: 'denied',
    });
  }

  clearAnalyticsCookies();
  console.log('Analytics cookies disabled');
};

/**
 * Clear analytics cookies
 */
const clearAnalyticsCookies = (): void => {
  if (typeof document === 'undefined') return;

  // Clear Google Analytics cookies
  const gaCookies = ['_ga', '_gat', '_gid', '_gat_gtag'];
  gaCookies.forEach(cookie => {
    document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
};

/**
 * Enable marketing cookies
 */
const enableMarketing = (): void => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    });
  }

  console.log('Marketing cookies enabled');
};

/**
 * Disable marketing cookies
 */
const disableMarketing = (): void => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  }

  console.log('Marketing cookies disabled');
};

/**
 * Accept all cookies
 */
export const acceptAllCookies = (): void => {
  const allAccepted: CookiePreferences = {
    necessary: true,
    analytics: true,
    marketing: true,
    preferences: true,
  };

  saveCookieConsent(allAccepted, 'accept_all');
};

/**
 * Reject all optional cookies (keep only necessary)
 */
export const rejectAllCookies = (): void => {
  saveCookieConsent(defaultPreferences, 'reject_all');
};

/**
 * Get cookie descriptions
 */
export const getCookieDescriptions = () => {
  return {
    necessary: {
      title: 'Necessary Cookies',
      description: 'Essential cookies required for the website to function properly. These cannot be disabled.',
      examples: ['Session management', 'Security', 'Load balancing'],
    },
    analytics: {
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website by collecting anonymous information.',
      examples: ['Google Analytics', 'Page views', 'User behavior'],
    },
    marketing: {
      title: 'Marketing Cookies',
      description: 'Used to track visitors across websites to display relevant advertisements.',
      examples: ['Ad targeting', 'Campaign tracking', 'Social media'],
    },
    preferences: {
      title: 'Preference Cookies',
      description: 'Remember your preferences and settings for a better user experience.',
      examples: ['Language', 'Theme', 'Display settings'],
    },
  };
};
