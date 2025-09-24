import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  CheckCircle, Heart, Download, Share2, Mail, Calendar,
  ArrowRight, Gift, Star, Users
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const DonationSuccess: React.FC = () => {
  const router = useRouter();
  const [donationDetails, setDonationDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Extract payment details from URL parameters
    const {
      paymentId,
      PayerID,
      token,
      subscription_id,
      amount,
      currency,
      donationType
    } = router.query;

    if (paymentId || subscription_id) {
      // In a real implementation, you would verify the payment with your backend
      setDonationDetails({
        paymentId: paymentId || subscription_id,
        amount: amount || '0',
        currency: currency || 'USD',
        donationType: donationType || 'one-time',
        payerID: PayerID,
        token
      });
    }
    setIsLoading(false);
  }, [router.query]);

  const formatCurrency = (amount: string, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(parseFloat(amount) || 0);
  };

  const shareMessage = donationDetails ?
    `I just donated ${formatCurrency(donationDetails.amount, donationDetails.currency)} to Saintlammy Foundation! Join me in supporting orphans, widows, and vulnerable communities. 💝` :
    'I just supported Saintlammy Foundation! Join me in helping orphans, widows, and vulnerable communities. 💝';

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.origin);
    const text = encodeURIComponent(shareMessage);

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${text} ${url}`);
        break;
      case 'email':
        window.open(`mailto:?subject=Supporting Saintlammy Foundation&body=${text} ${url}`);
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your donation...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Donation Successful - Thank You! | Saintlammy Foundation</title>
        <meta name="description" content="Thank you for your generous donation to Saintlammy Foundation. Your support helps transform lives." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Navigation />

      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Thank You for Your Generosity! 🙏
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your donation has been successfully processed and will make a real difference in the lives of those we serve.
            </p>
          </div>

          {/* Donation Details Card */}
          {donationDetails && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Donation Details</h2>
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Confirmed</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Amount</label>
                    <p className="text-2xl font-bold text-accent-600">
                      {formatCurrency(donationDetails.amount, donationDetails.currency)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Donation Type</label>
                    <p className="text-lg capitalize">
                      {donationDetails.donationType === 'one-time' ? 'One-time donation' : `${donationDetails.donationType} recurring`}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Payment ID</label>
                    <p className="text-sm font-mono text-gray-700 bg-gray-50 p-2 rounded">
                      {donationDetails.paymentId}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Date</label>
                    <p className="text-lg">{new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex flex-wrap gap-4">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-accent-50 text-accent-700 rounded-lg hover:bg-accent-100 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Download Receipt</span>
                  </button>
                  <button
                    onClick={() => handleShare('email')}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Receipt</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Impact Message */}
          <div className="bg-gradient-to-r from-accent-500 to-blue-600 rounded-2xl shadow-lg text-white p-8 mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Your Impact</h3>
                {donationDetails && (
                  <div className="space-y-2 text-lg">
                    {parseFloat(donationDetails.amount) >= 25 && (
                      <p>✨ Your donation can provide meals for a family for a week</p>
                    )}
                    {parseFloat(donationDetails.amount) >= 50 && (
                      <p>📚 Help fund educational materials for orphaned children</p>
                    )}
                    {parseFloat(donationDetails.amount) >= 100 && (
                      <p>🏠 Support housing assistance for vulnerable widows</p>
                    )}
                    {parseFloat(donationDetails.amount) >= 250 && (
                      <p>💼 Fund job training programs for sustainable livelihoods</p>
                    )}
                  </div>
                )}
                <p className="mt-4 text-white/90">
                  Every dollar you contribute goes directly to supporting our mission of empowering orphans, widows, and vulnerable communities across Nigeria.
                </p>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">What Happens Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-accent-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Email Confirmation</h4>
                    <p className="text-gray-600 text-sm">You'll receive a detailed receipt and tax documentation within 24 hours.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-accent-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Regular Updates</h4>
                    <p className="text-gray-600 text-sm">Receive quarterly impact reports showing how your donation is making a difference.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Gift className="w-4 h-4 text-accent-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Direct Impact</h4>
                    <p className="text-gray-600 text-sm">Your funds are deployed immediately to our ongoing programs and emergency needs.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-accent-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Community Updates</h4>
                    <p className="text-gray-600 text-sm">Join our donor community for exclusive stories and volunteer opportunities.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Share Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Inspire Others to Give
              </h3>
              <p className="text-gray-600 mb-6">
                Share your act of kindness and encourage others to join our mission.
              </p>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Twitter</span>
                </button>

                <button
                  onClick={() => handleShare('facebook')}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Facebook</span>
                </button>

                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors font-medium"
              >
                <span>Return Home</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/programs"
                className="inline-flex items-center space-x-2 px-8 py-4 border border-accent-500 text-accent-600 rounded-lg hover:bg-accent-50 transition-colors font-medium"
              >
                <span>View Our Programs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-gray-500 text-sm">
              Have questions? Contact us at{' '}
              <a href="mailto:info@saintlammyfoundation.org" className="text-accent-600 hover:underline">
                info@saintlammyfoundation.org
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default DonationSuccess;