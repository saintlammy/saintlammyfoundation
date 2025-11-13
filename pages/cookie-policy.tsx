import React from 'react';
import { Cookie, Shield, TrendingUp, Target, Settings, Info } from 'lucide-react';
import { useCookieConsent } from '../contexts/CookieConsentContext';

const CookiePolicy: React.FC = () => {
  const { openSettings } = useCookieConsent();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Cookie className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Cookie Policy</h1>
          </div>
          <p className="text-lg text-green-50">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Introduction */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <div className="flex items-start gap-4 mb-4">
              <Info className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We use cookies to enhance your browsing experience, provide personalized content, analyze our traffic, and improve our services. This policy explains what cookies we use and why.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Types of Cookies */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Types of Cookies We Use</h2>

          <div className="space-y-6">
            {/* Necessary Cookies */}
            <div className="bg-white rounded-xl shadow-sm p-8 border-l-4 border-green-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Necessary Cookies</h3>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full mb-3">
                    Always Active
                  </span>
                  <p className="text-gray-600 mb-4">
                    These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt out of these cookies.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Examples:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Session management and user authentication</li>
                      <li>Load balancing and security measures</li>
                      <li>Cookie consent preferences</li>
                      <li>Form submission and data validation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="bg-white rounded-xl shadow-sm p-8 border-l-4 border-blue-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics Cookies</h3>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-3">
                    Optional
                  </span>
                  <p className="text-gray-600 mb-4">
                    These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our content and user experience.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Examples:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Google Analytics - tracking page views and user behavior</li>
                      <li>Understanding which pages are most popular</li>
                      <li>Identifying technical issues and errors</li>
                      <li>Measuring campaign effectiveness</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="bg-white rounded-xl shadow-sm p-8 border-l-4 border-purple-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Marketing Cookies</h3>
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full mb-3">
                    Optional
                  </span>
                  <p className="text-gray-600 mb-4">
                    These cookies are used to track visitors across websites to display relevant advertisements. They may also be used to limit how many times you see an ad and measure the effectiveness of advertising campaigns.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Examples:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Social media integration and sharing</li>
                      <li>Targeted advertising based on interests</li>
                      <li>Campaign tracking and attribution</li>
                      <li>Retargeting and remarketing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Preference Cookies */}
            <div className="bg-white rounded-xl shadow-sm p-8 border-l-4 border-orange-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Settings className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Preference Cookies</h3>
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm font-semibold rounded-full mb-3">
                    Optional
                  </span>
                  <p className="text-gray-600 mb-4">
                    These cookies allow our website to remember choices you make (such as your language preference or the region you're in) and provide enhanced, more personalized features.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Examples:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Language and region preferences</li>
                      <li>Theme settings (light/dark mode)</li>
                      <li>Font size and accessibility preferences</li>
                      <li>Previously viewed content</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Managing Cookies */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Your Cookie Preferences</h2>
            <p className="text-gray-600 mb-6">
              You have full control over which cookies you accept. You can manage your preferences at any time by clicking the button below or by using the cookie settings icon in the footer.
            </p>
            <button
              onClick={openSettings}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg flex items-center gap-2"
            >
              <Settings className="w-5 h-5" />
              Manage Cookie Preferences
            </button>
          </div>
        </section>

        {/* Browser Settings */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Browser Settings</h2>
            <p className="text-gray-600 mb-4">
              Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or delete certain cookies. Please note that if you disable cookies, some features of our website may not function properly.
            </p>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">Learn how to manage cookies in popular browsers:</p>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">Google Chrome</a></li>
                <li>• <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">Mozilla Firefox</a></li>
                <li>• <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">Safari</a></li>
                <li>• <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">Microsoft Edge</a></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Our Cookie Policy?</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about how we use cookies, please don't hesitate to contact us.
            </p>
            <div className="space-y-2 text-gray-600">
              <p><strong>Email:</strong> info@saintlammyfoundation.org</p>
              <p><strong>Phone:</strong> +234 123 456 7890</p>
            </div>
          </div>
        </section>

        {/* Back to Home */}
        <div className="text-center">
          <a
            href="/"
            className="inline-block px-6 py-3 border-2 border-green-500 text-green-600 font-semibold rounded-xl hover:bg-green-50 transition-all duration-200"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
