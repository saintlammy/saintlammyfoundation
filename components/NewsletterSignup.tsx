import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';

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
    <section className="py-24 bg-gray-900">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-accent-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 font-display tracking-tight">
              Stay In the Loop
            </h2>
            <p className="text-lg text-gray-300 font-light leading-relaxed">
              Subscribe to our <strong>Hope Dispatch</strong> newsletter and get monthly updates,
              prayer requests, and photos from the field delivered to your inbox.
            </p>
          </div>

          {isSubscribed ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-green-400 mb-2 font-display">
                Thank You!
              </h3>
              <p className="text-gray-300">
                You're now subscribed to Hope Dispatch. Watch for your first update soon!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
                    placeholder="Enter your full name"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
                    placeholder="Enter your email address"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-4 rounded-full font-medium text-base transition-colors shadow-lg hover:shadow-xl flex items-center justify-center font-sans"
              >
                <Send className="w-5 h-5 mr-2" />
                {isLoading ? 'Subscribing...' : 'Subscribe to Hope Dispatch'}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400 font-light">
              <Mail className="w-4 h-4 inline mr-2" /> Get monthly updates, prayer requests, and photos from the field.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;