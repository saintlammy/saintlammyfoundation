import React, { useState } from 'react';
import { RiCheckboxCircleLine, RiMailLine, RiSendPlaneLine } from 'react-icons/ri';
import { DoubleBezel } from './home/HomePrimitives';

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to subscribe');
      }

      setIsSubscribed(true);
      setEmail('');
      setName('');

      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="home-section home-section-soft home-newsletter">
      <div className="home-container home-container-narrow">
        <DoubleBezel coreClassName="home-newsletter-core">
          <div data-home-reveal className="home-newsletter-copy">
            <div className="home-card-icon mb-6">
              <RiMailLine className="w-7 h-7" />
            </div>
            <span className="home-eyebrow">Hope, delivered monthly</span>
            <h2 className="font-display tracking-tight">
              Stay close to the work.
            </h2>
            <p className="text-lg text-gray-600 font-light leading-relaxed">
              Subscribe to our <strong>Hope Dispatch</strong> newsletter and get monthly updates,
              prayer requests, and photos from the field delivered to your inbox.
            </p>
          </div>

          {isSubscribed ? (
            <div className="text-center py-8">
              <RiCheckboxCircleLine className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-green-400 mb-2 font-display">
                Thank You!
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                You're now subscribed to Hope Dispatch. Watch for your first update soon!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="home-newsletter-form">
              {error && (
                <div className="mb-6 p-4 bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500/30 rounded-xl">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="home-input"
                    placeholder="Enter your full name"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="home-input"
                    placeholder="Enter your email address"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="home-action home-action-primary group w-full justify-between disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>{isLoading ? 'Subscribing...' : 'Subscribe to Hope Dispatch'}</span>
                <span className="home-action-island"><RiSendPlaneLine /></span>
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
              <RiMailLine className="w-4 h-4 inline mr-2" /> Get monthly updates, prayer requests, and photos from the field.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </DoubleBezel>
      </div>
    </section>
  );
};

export default NewsletterSignup;
