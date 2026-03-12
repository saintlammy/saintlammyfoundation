import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Heart, ExternalLink, ArrowLeft, Share2 } from 'lucide-react';
import { ProfileCard } from '@/components/campaigns/ProfileCard';
import { ProfileDetailModal } from '@/components/campaigns/ProfileDetailModal';
import { useDonationModal } from '@/components/DonationModalProvider';
import type { CampaignProfile, Campaign } from '@/types';

export default function VulnerableHomesPage() {
  const router = useRouter();
  const { openDonationModal } = useDonationModal();
  const [profiles, setProfiles] = useState<CampaignProfile[]>([]);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<CampaignProfile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load the vulnerable homes campaign
      const campaignRes = await fetch('/api/campaigns?campaign_type=vulnerable_homes&status=active&limit=1');
      const campaignData = await campaignRes.json();

      if (campaignData.success && campaignData.data.length > 0) {
        const activeCampaign = campaignData.data[0];
        setCampaign(activeCampaign);

        // Load profiles for this campaign
        const profilesRes = await fetch(`/api/campaign-profiles?campaign_id=${activeCampaign.id}&status=active`);
        const profilesData = await profilesRes.json();

        if (profilesData.success) {
          setProfiles(profilesData.data);
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReadMore = (profile: CampaignProfile) => {
    setSelectedProfile(profile);
    setModalOpen(true);
  };

  const handleSponsor = (profile: CampaignProfile) => {
    // Close modal if open
    setModalOpen(false);

    // Open donation modal with profile context
    openDonationModal({
      source: 'vulnerable-homes',
      campaignId: campaign?.id,
      title: `Sponsor ${profile.title.split('—')[0].trim()}`,
      description: profile.how_your_gift_helps || profile.story_snippet,
      category: 'home',
      // Pass profile data for tracking
      metadata: {
        profile_id: profile.id,
        profile_code: profile.profile_code,
        profile_title: profile.title
      }
    });
  };

  const handleViewCampaignDetails = () => {
    if (campaign) {
      router.push(`/campaign/${campaign.id}`);
    }
  };

  const handleDonateGeneral = () => {
    openDonationModal({
      source: 'vulnerable-homes',
      campaignId: campaign?.id,
      title: campaign?.title || 'Support Vulnerable Homes',
      description: campaign?.description || 'Your support helps families in need',
      category: 'home'
    });
  };

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://saintlammyfoundation.org';
  const pageUrl = `${siteUrl}/campaigns/vulnerable-homes`;

  return (
    <>
      <Head>
        <title>Vulnerable Homes: Stories of Hope | Saintlammy Foundation</title>
        <meta name="description" content="Meet the families we support in Alimosho LGA, Lagos. Your support provides food, hygiene, and stability to vulnerable homes." />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content="Vulnerable Homes: Stories of Hope | Saintlammy Foundation" />
        <meta property="og:description" content="Meet the families we support in Alimosho LGA, Lagos" />
        <meta property="og:site_name" content="Saintlammy Foundation" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={pageUrl} />
        <meta property="twitter:title" content="Vulnerable Homes: Stories of Hope" />
        <meta property="twitter:description" content="Meet the families we support in Alimosho LGA, Lagos" />

        <link rel="canonical" href={pageUrl} />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push('/')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </button>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && navigator.share) {
                    navigator.share({
                      title: 'Vulnerable Homes: Stories of Hope',
                      text: 'Meet the families we support in Alimosho LGA, Lagos',
                      url: pageUrl
                    });
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </nav>

        {/* Section Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
              {campaign?.title || 'Vulnerable Homes: Stories of Hope'}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {campaign?.description || 'Your support helps families in Alimosho LGA, Lagos with food, hygiene, and targeted stability support.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleDonateGeneral}
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3.5 rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Heart className="w-5 h-5" />
                Donate to Support a Home
              </button>
              {campaign && (
                <button
                  onClick={handleViewCampaignDetails}
                  className="text-teal-700 hover:text-teal-800 px-8 py-3.5 rounded-lg transition-colors duration-200 flex items-center gap-2 underline-offset-4 hover:underline"
                >
                  View Campaign Details
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No profiles available at this time.</p>
            </div>
          ) : (
            /* Profile Cards Grid */
            <div className="grid md:grid-cols-2 gap-8">
              {profiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onReadMore={handleReadMore}
                  onSponsor={handleSponsor}
                />
              ))}
            </div>
          )}
        </section>

        {/* Profile Detail Modal */}
        <ProfileDetailModal
          profile={selectedProfile}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSponsor={handleSponsor}
        />
      </div>
    </>
  );
}
