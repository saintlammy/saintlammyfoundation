import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Clock, Target, Heart, Share2, ArrowLeft } from 'lucide-react';
import { useDonationModal } from '@/components/DonationModalProvider';

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  currency: string;
  deadline: string;
  status: string;
  is_featured: boolean;
  impact_details: Record<string, string>;
  image_url?: string;
  category?: string;
}

interface CampaignPageProps {
  campaign: Campaign | null;
  error?: string;
}

const CampaignPage: React.FC<CampaignPageProps> = ({ campaign, error }) => {
  const router = useRouter();
  const { openDonationModal } = useDonationModal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Campaign Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{error || 'This campaign does not exist or has been removed.'}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://saintlammyfoundation.org';
  const campaignUrl = `${siteUrl}/campaign/${campaign.id}`;
  const progressPercentage = Math.min((campaign.current_amount / campaign.goal_amount) * 100, 100).toFixed(0);

  const ogImage = campaign.image_url || `${siteUrl}/images/default-campaign-og.jpg`;
  const ogDescription = `${campaign.description} | ${progressPercentage}% funded | Help us reach our goal of ${campaign.currency === 'USD' ? '$' : '₦'}${campaign.goal_amount.toLocaleString()}`;

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currency === 'USD' ? '$' : '₦';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  const handleDonate = () => {
    openDonationModal({
      source: 'campaign-page',
      campaignId: campaign.id,
      category: campaign.category || 'general',
      title: `Support: ${campaign.title}`,
      description: campaign.description
    });
  };

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{campaign.title} | Saintlammy Foundation</title>
        <meta name="title" content={`${campaign.title} | Saintlammy Foundation`} />
        <meta name="description" content={ogDescription} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={campaignUrl} />
        <meta property="og:title" content={campaign.title} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Saintlammy Foundation" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={campaignUrl} />
        <meta property="twitter:title" content={campaign.title} />
        <meta property="twitter:description" content={ogDescription} />
        <meta property="twitter:image" content={ogImage} />

        {/* Additional Meta Tags */}
        <meta name="author" content="Saintlammy Foundation" />
        <meta name="keywords" content={`charity, donation, ${campaign.title}, Nigeria, humanitarian aid, fundraising`} />

        {/* Canonical URL */}
        <link rel="canonical" href={campaignUrl} />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Navigation */}
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push('/')}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </button>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    if (mounted && navigator.share) {
                      navigator.share({
                        title: campaign.title,
                        text: campaign.description,
                        url: campaignUrl
                      });
                    }
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Campaign Content */}
        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Campaign Image */}
          {campaign.image_url && (
            <div className="mb-8 rounded-2xl overflow-hidden">
              <img
                src={campaign.image_url}
                alt={campaign.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          {/* Campaign Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center mb-4">
              <div className="bg-red-500/20 rounded-full p-2 mr-3">
                <Heart className="w-6 h-6 text-red-400" />
              </div>
              <span className="text-red-400 font-semibold text-sm tracking-wide uppercase">
                {campaign.is_featured ? 'URGENT CAMPAIGN' : 'ACTIVE CAMPAIGN'}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {campaign.title}
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {campaign.description}
            </p>

            {/* Campaign Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                <div className="flex items-center mb-2">
                  <Target className="w-5 h-5 text-accent-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Goal</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(campaign.goal_amount, campaign.currency)}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                <div className="flex items-center mb-2">
                  <Heart className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Raised</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(campaign.current_amount, campaign.currency)}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Deadline</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatDeadline(campaign.deadline)}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                <span className="font-medium">Campaign Progress</span>
                <span className="font-bold">{progressPercentage}% funded</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-accent-500 to-accent-600 h-4 rounded-full transition-all duration-500 shadow-glow"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>{formatCurrency(campaign.current_amount, campaign.currency)} raised</span>
                <span>{formatCurrency(campaign.goal_amount, campaign.currency)} goal</span>
              </div>
            </div>

            {/* Donate Button */}
            <button
              onClick={handleDonate}
              className="w-full bg-accent-500 hover:bg-accent-600 text-white py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
            >
              Donate Now
            </button>
          </div>

          {/* Impact Details */}
          {campaign.impact_details && Object.keys(campaign.impact_details).length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Impact Details</h2>
              <div className="space-y-4">
                {Object.entries(campaign.impact_details).map(([key, value]) => (
                  <div key={key} className="flex items-start">
                    <div className="w-2 h-2 bg-accent-500 rounded-full mt-2 mr-4"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white capitalize mb-1">
                        {key.replace(/_/g, ' ')}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<CampaignPageProps> = async (context) => {
  const { id } = context.params as { id: string };

  try {
    // Fetch campaign from API
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/campaigns?id=${id}`);

    if (!response.ok) {
      return {
        props: {
          campaign: null,
          error: 'Failed to load campaign'
        }
      };
    }

    const result = await response.json();

    if (!result.success || !result.data || result.data.length === 0) {
      return {
        props: {
          campaign: null,
          error: 'Campaign not found'
        }
      };
    }

    return {
      props: {
        campaign: result.data[0]
      }
    };
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return {
      props: {
        campaign: null,
        error: 'An error occurred while loading the campaign'
      }
    };
  }
};

export default CampaignPage;
