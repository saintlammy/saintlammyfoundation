import React, { useState } from 'react';
import Image from 'next/image';
import { X, Heart, User, MapPin, Calendar, GraduationCap, Home, CheckCircle } from 'lucide-react';
import { ComponentProps } from '@/types';

interface Beneficiary {
  id: string;
  name: string;
  age: number;
  location: string;
  category: 'orphan' | 'widow' | 'family';
  story: string;
  needs: string[];
  monthlyCost: number;
  image: string;
  schoolGrade?: string;
  familySize?: number;
  dreamAspiration?: string;
}

interface SponsorModalProps extends ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  beneficiary: Beneficiary | null;
}

const SponsorModal: React.FC<SponsorModalProps> = ({
  className = '',
  isOpen,
  onClose,
  beneficiary
}) => {
  const [sponsorshipType, setSponsorshipType] = useState<'monthly' | 'one-time' | 'custom'>('monthly');
  const [customAmount, setCustomAmount] = useState('');
  const [sponsorInfo, setSponsorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [step, setStep] = useState<'details' | 'sponsor-info' | 'confirmation'>('details');

  if (!isOpen || !beneficiary) return null;

  const sponsorshipOptions = {
    monthly: beneficiary.monthlyCost,
    'one-time': beneficiary.monthlyCost * 6, // 6 months upfront
    custom: customAmount ? parseInt(customAmount) : 0
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'sponsor-info') {
      setStep('confirmation');
    } else if (step === 'confirmation') {
      // Process sponsorship (integrate with payment gateway)
      console.log('Processing sponsorship...', { beneficiary, sponsorshipType, sponsorInfo });
      onClose();
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'orphan':
        return GraduationCap;
      case 'widow':
        return Home;
      default:
        return User;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'orphan':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'widow':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-gray-900 border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-semibold text-white font-display">
            {step === 'details' && 'Sponsor a Life'}
            {step === 'sponsor-info' && 'Your Information'}
            {step === 'confirmation' && 'Confirm Sponsorship'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Beneficiary Details */}
              <div>
                <div className="relative h-64 rounded-xl overflow-hidden mb-6">
                  <Image
                    src={beneficiary.image}
                    alt={`${beneficiary.name} - Beneficiary of Saintlammy Foundation`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(beneficiary.category)}`}>
                      {React.createElement(getCategoryIcon(beneficiary.category), { className: 'w-4 h-4 mr-1' })}
                      {beneficiary.category.charAt(0).toUpperCase() + beneficiary.category.slice(1)} Support
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 font-display">
                  Meet {beneficiary.name}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-300">
                    <User className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{beneficiary.age} years old</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{beneficiary.location}</span>
                  </div>
                  {beneficiary.schoolGrade && (
                    <div className="flex items-center text-gray-300">
                      <GraduationCap className="w-5 h-5 mr-3 text-gray-400" />
                      <span>Grade {beneficiary.schoolGrade}</span>
                    </div>
                  )}
                  {beneficiary.familySize && (
                    <div className="flex items-center text-gray-300">
                      <Home className="w-5 h-5 mr-3 text-gray-400" />
                      <span>{beneficiary.familySize} family members</span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3 font-display">
                    {beneficiary.name}'s Story
                  </h4>
                  <p className="text-gray-300 leading-relaxed font-light">
                    {beneficiary.story}
                  </p>
                </div>

                {beneficiary.dreamAspiration && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3 font-display">
                      Dreams & Aspirations
                    </h4>
                    <p className="text-accent-200 leading-relaxed font-light italic">
                      "{beneficiary.dreamAspiration}"
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 font-display">
                    Current Needs
                  </h4>
                  <div className="space-y-2">
                    {beneficiary.needs.map((need, index) => (
                      <div key={index} className="flex items-center text-gray-300">
                        <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                        <span className="text-sm">{need}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sponsorship Options */}
              <div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-semibold text-white mb-4 font-display">
                    Choose Your Support Level
                  </h4>

                  <div className="space-y-4">
                    {/* Monthly Sponsorship */}
                    <label className="flex items-center p-4 bg-gray-800/30 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors">
                      <input
                        type="radio"
                        name="sponsorship"
                        value="monthly"
                        checked={sponsorshipType === 'monthly'}
                        onChange={(e) => setSponsorshipType(e.target.value as 'monthly')}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 mr-4 ${sponsorshipType === 'monthly' ? 'border-accent-500 bg-accent-500' : 'border-gray-400'}`}></div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-white">Monthly Sponsorship</h5>
                          <span className="text-accent-400 font-bold">${beneficiary.monthlyCost}/month</span>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">
                          Ongoing support covering education, healthcare, and basic needs
                        </p>
                      </div>
                    </label>

                    {/* One-time Support */}
                    <label className="flex items-center p-4 bg-gray-800/30 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors">
                      <input
                        type="radio"
                        name="sponsorship"
                        value="one-time"
                        checked={sponsorshipType === 'one-time'}
                        onChange={(e) => setSponsorshipType(e.target.value as 'one-time')}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 mr-4 ${sponsorshipType === 'one-time' ? 'border-accent-500 bg-accent-500' : 'border-gray-400'}`}></div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-white">6-Month Support</h5>
                          <span className="text-accent-400 font-bold">${beneficiary.monthlyCost * 6}</span>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">
                          One-time contribution covering 6 months of support
                        </p>
                      </div>
                    </label>

                    {/* Custom Amount */}
                    <label className="flex items-center p-4 bg-gray-800/30 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors">
                      <input
                        type="radio"
                        name="sponsorship"
                        value="custom"
                        checked={sponsorshipType === 'custom'}
                        onChange={(e) => setSponsorshipType(e.target.value as 'custom')}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 mr-4 ${sponsorshipType === 'custom' ? 'border-accent-500 bg-accent-500' : 'border-gray-400'}`}></div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-white">Custom Amount</h5>
                          <div className="flex items-center">
                            <span className="text-white mr-2">$</span>
                            <input
                              type="number"
                              value={customAmount}
                              onChange={(e) => setCustomAmount(e.target.value)}
                              placeholder="Enter amount"
                              className="w-24 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-right"
                              min="1"
                            />
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">
                          Choose your own contribution amount
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Impact Statement */}
                <div className="bg-gradient-to-r from-accent-500/10 to-accent-600/10 border border-accent-500/20 rounded-xl p-6">
                  <Heart className="w-8 h-8 text-accent-400 mb-3" />
                  <h4 className="text-lg font-semibold text-white mb-2 font-display">
                    Your Impact
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Your sponsorship will provide {beneficiary.name} with consistent access to education, healthcare, nutritious meals, and emotional support. You'll receive regular updates on their progress and can build a meaningful connection that transforms both your lives.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 'sponsor-info' && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-2 font-display">
                  Thank you for choosing to sponsor {beneficiary.name}!
                </h3>
                <p className="text-gray-300">
                  Please provide your information to complete the sponsorship process.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={sponsorInfo.name}
                      onChange={(e) => setSponsorInfo({ ...sponsorInfo, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={sponsorInfo.email}
                      onChange={(e) => setSponsorInfo({ ...sponsorInfo, email: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={sponsorInfo.phone}
                    onChange={(e) => setSponsorInfo({ ...sponsorInfo, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Message to {beneficiary.name} (Optional)
                  </label>
                  <textarea
                    value={sponsorInfo.message}
                    onChange={(e) => setSponsorInfo({ ...sponsorInfo, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                    placeholder="Write a encouraging message..."
                  />
                </div>

                <div className="flex items-center justify-between pt-6">
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'confirmation' && (
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-4 font-display">
                Sponsorship Confirmed!
              </h3>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Beneficiary:</span>
                    <span className="text-white font-medium">{beneficiary.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sponsorship Type:</span>
                    <span className="text-white font-medium">
                      {sponsorshipType === 'monthly' ? 'Monthly Support' :
                       sponsorshipType === 'one-time' ? '6-Month Support' : 'Custom Amount'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-accent-400 font-bold">
                      ${sponsorshipOptions[sponsorshipType]}{sponsorshipType === 'monthly' ? '/month' : ''}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sponsor:</span>
                    <span className="text-white font-medium">{sponsorInfo.name}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 mb-8 leading-relaxed">
                Thank you for your generous heart! You'll receive a confirmation email with next steps and information about staying connected with {beneficiary.name}. Your support will make a profound difference in their life.
              </p>

              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-medium transition-colors"
                >
                  Complete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'details' && (
          <div className="flex items-center justify-between p-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              Your information is secure and will only be used for sponsorship purposes.
            </p>
            <button
              onClick={() => setStep('sponsor-info')}
              className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-medium transition-colors"
            >
              Continue to Sponsor
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SponsorModal;