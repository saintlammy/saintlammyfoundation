import React from 'react';
import { Clock, Target, Heart, AlertCircle } from 'lucide-react';

interface UrgentNeedsProps {
  onDonateClick?: () => void;
}

const UrgentNeeds: React.FC<UrgentNeedsProps> = ({ onDonateClick }) => {
  return (
    <section className="py-24 bg-gray-100 dark:bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-500/20 text-red-400 text-sm font-medium mb-6">
            <AlertCircle className="w-4 h-4 mr-2" />
            URGENT NEEDS
          </div>
          <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
            Help Right Now
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            Every day without your support means another hungry child or struggling mother. Be the reason someone breathes again.
          </p>
        </div>

        {/* Main Campaign */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-200 dark:border-gray-700">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 md:p-12">
              <div className="flex items-center mb-4">
                <div className="bg-red-500/20 rounded-full p-2 mr-3">
                  <Heart className="w-6 h-6 text-red-400" />
                </div>
                <span className="text-red-400 font-semibold text-sm tracking-wide uppercase">URGENT CAMPAIGN</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-4 font-display">
                Feed 100 Widows Before Christmas
              </h3>

              <div className="flex items-center mb-6">
                <Target className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-lg font-medium text-gray-900 dark:text-white">Goal: ₦2,500,000 / $1,800</span>
              </div>

              <div className="flex items-center mb-6">
                <Clock className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-lg font-medium text-red-400">Deadline: December 20, 2025</span>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span>Progress</span>
                  <span>45% raised</span>
                </div>
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all duration-500" style={{width: '45%'}}></div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">₁,125,000 raised of ₦2,500,000 goal</div>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="font-semibold text-gray-900 dark:text-white font-display">Your Impact:</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <div>₦5,000 / $4 = Feeds one widow for 2 weeks</div>
                  <div>₦25,000 / $18 = Supports a widow's family for a month</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onDonateClick}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-medium text-base transition-colors shadow-lg hover:shadow-xl font-sans"
                >
                  Give Now
                </button>
                <button
                  onClick={onDonateClick}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-medium text-base transition-colors font-sans"
                >
                  Adopt a Widow
                </button>
              </div>
            </div>

            <div className="md:w-1/2 bg-gradient-to-br from-red-500 to-orange-600 p-8 md:p-12 text-white flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl md:text-8xl font-bold mb-4 opacity-90">100</div>
                <div className="text-xl md:text-2xl font-light mb-2">Widows Need</div>
                <div className="text-xl md:text-2xl font-light">Your Help</div>
                <div className="mt-8 text-white/80">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-sm">Time is running out</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-6 font-light text-lg">
            "You can't change the whole world. But you can change someone's world."
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={onDonateClick}
              className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-full font-medium text-sm transition-colors font-sans flex items-center"
            >
              <Heart className="w-4 h-4 mr-2" /> Adopt a Widow
            </button>
            <button
              onClick={onDonateClick}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium text-sm transition-colors font-sans flex items-center"
            >
              <Heart className="w-4 h-4 mr-2" /> Feed a Family
            </button>
            <button
              onClick={onDonateClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium text-sm transition-colors font-sans flex items-center"
            >
              <Heart className="w-4 h-4 mr-2" /> Sponsor an Outreach
            </button>
            <button
              onClick={onDonateClick}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-full font-medium text-sm transition-colors font-sans flex items-center"
            >
              <Heart className="w-4 h-4 mr-2" /> Donate in Crypto
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UrgentNeeds;