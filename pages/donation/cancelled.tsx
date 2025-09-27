import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, Heart, HelpCircle, RotateCcw } from 'lucide-react';

const DonationCancelled: React.FC = () => {
  const reasons = [
    {
      icon: <Heart className="w-6 h-6 text-accent-500" />,
      title: 'Try a Different Payment Method',
      description: 'We accept PayPal, cryptocurrency, and major credit cards.',
      action: 'Choose Payment Method',
      href: '/#donate'
    },
    {
      icon: <HelpCircle className="w-6 h-6 text-blue-500" />,
      title: 'Need Help?',
      description: 'Our team is here to assist you with any payment questions.',
      action: 'Contact Support',
      href: '/contact'
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-green-500" />,
      title: 'Try Again Later',
      description: 'Sometimes a simple retry can resolve temporary issues.',
      action: 'Retry Donation',
      href: '/#donate'
    }
  ];

  return (
    <>
      <Head>
        <title>Donation Cancelled | Saintlammy Foundation</title>
        <meta name="description" content="Your donation was cancelled. No charges were made to your account." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-yellow-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Donation Cancelled
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your donation was cancelled and no charges were made to your account. We understand that sometimes plans change.
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                What Happened?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Your payment process was interrupted or cancelled. This could happen for various reasons:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 text-xl">🚫</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Payment Cancelled</h4>
                <p className="text-sm text-gray-600">You clicked cancel or back button during payment</p>
              </div>

              <div className="text-center p-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-orange-600 text-xl">⚠️</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Technical Issue</h4>
                <p className="text-sm text-gray-600">Temporary connection or payment processor issue</p>
              </div>

              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 text-xl">💳</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Payment Method</h4>
                <p className="text-sm text-gray-600">Issue with the selected payment method</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 mb-1">No Charges Made</h4>
                  <p className="text-sm text-green-700">
                    Your payment method has not been charged. No transaction was completed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Options */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              How Can We Help?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reasons.map((reason, index) => (
                <div key={index} className="text-center p-6 border border-gray-100 rounded-xl hover:border-accent-200 hover:bg-accent-50 transition-all">
                  <div className="flex justify-center mb-4">
                    {reason.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{reason.title}</h4>
                  <p className="text-gray-600 mb-4 text-sm">{reason.description}</p>
                  <Link
                    href={reason.href}
                    className="inline-flex items-center space-x-2 text-accent-600 hover:text-accent-700 font-medium text-sm"
                  >
                    <span>{reason.action}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Still Want to Help */}
          <div className="bg-gradient-to-r from-accent-500 to-blue-600 rounded-2xl shadow-lg text-white p-8 mb-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Still Want to Help?</h3>
              <p className="text-lg mb-6 text-white/90">
                There are many ways to support our mission beyond donations.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h4 className="font-medium mb-2">Volunteer</h4>
                  <p className="text-sm text-white/80 mb-3">Join our volunteer programs</p>
                  <Link href="/volunteer" className="text-white underline text-sm">
                    Learn More
                  </Link>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">📢</span>
                  </div>
                  <h4 className="font-medium mb-2">Spread Awareness</h4>
                  <p className="text-sm text-white/80 mb-3">Share our mission with others</p>
                  <Link href="/about" className="text-white underline text-sm">
                    Learn More
                  </Link>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h4 className="font-medium mb-2">Partnership</h4>
                  <p className="text-sm text-white/80 mb-3">Partner with us organizationally</p>
                  <Link href="/partner" className="text-white underline text-sm">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#donate"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors font-medium"
              >
                <Heart className="w-4 h-4" />
                <span>Try Donating Again</span>
              </Link>

              <Link
                href="/"
                className="inline-flex items-center space-x-2 px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return Home</span>
              </Link>
            </div>

            <p className="text-gray-500 text-sm">
              Need assistance? Contact us at{' '}
              <a href="mailto:info@saintlammyfoundation.org" className="text-accent-600 hover:underline">
                info@saintlammyfoundation.org
              </a>
              {' '}or{' '}
              <a href="tel:+2341234567890" className="text-accent-600 hover:underline">
                +234 123 456 7890
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default DonationCancelled;