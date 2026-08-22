import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useRouter } from 'next/router';
import {
  RiAlarmWarningLine as AlertCircle,
  RiCheckboxCircleLine as CheckCircle,
  RiCloseLine as X,
  RiExternalLinkLine as ExternalLink,
  RiFacebookFill as Facebook,
  RiFileCopyLine as Copy,
  RiFocus3Line as Target,
  RiHeart3Line as Heart,
  RiLinkedinFill as Linkedin,
  RiMailLine as Mail,
  RiMessage2Line as MessageSquare,
  RiQrCodeLine as QrCode,
  RiShareLine as Share2,
  RiTimeLine as Clock,
  RiTwitterXLine as Twitter,
} from 'react-icons/ri';
import { useDonationModal } from './DonationModalProvider';
import CampaignQRModal from './CampaignQRModal';
import CampaignMetaTags from './CampaignMetaTags';
import { trackCampaignShare } from '@/lib/trackCampaignShare';
import { ActionButton, ActionLink, SectionHeading } from './home/HomePrimitives';

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
  category?: string;
  beneficiary_count?: number;
  stat_label?: string;
  urgency_message?: string;
}

interface UrgentNeedsProps {
  onDonateClick?: () => void;
}

const UrgentNeeds: React.FC<UrgentNeedsProps> = ({ onDonateClick }) => {
  const router = useRouter();
  const { openDonationModal } = useDonationModal();
  const [featuredCampaign, setFeaturedCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [shareButtonRect, setShareButtonRect] = useState<DOMRect | null>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const shareButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetchFeaturedCampaign();
  }, []);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target as Node) &&
        shareButtonRef.current &&
        !shareButtonRef.current.contains(event.target as Node)
      ) {
        setShowShareMenu(false);
      }
    };

    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);

  const fetchFeaturedCampaign = async () => {
    try {
      const response = await fetch('/api/campaigns?status=active&featured=true');
      const result = await response.json();
      if (result.success && result.data.length > 0) {
        setFeaturedCampaign(result.data[0]);
      }
    } catch (error) {
      console.error('Error fetching featured campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100).toFixed(1);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return currency === 'USD' ? `$${amount.toLocaleString()}` : `₦${amount.toLocaleString()}`;
  };

  const formatDeadline = (deadline: string) => {
    return new Date(deadline).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getNGNEquivalent = (amount: number, currency: string) => {
    if (currency === 'USD') {
      return Math.round(amount * 1395); // Approximate conversion rate: 1 USD = 1395 NGN
    }
    return amount;
  };

  if (loading) {
    return (
      <section className="home-section home-section-soft">
        <div className="home-container text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">Loading urgent campaigns...</p>
        </div>
      </section>
    );
  }

  if (!featuredCampaign) {
    return null; // Don't show the section if no featured campaign
  }

  const progressPercentage = getProgressPercentage(featuredCampaign.current_amount, featuredCampaign.goal_amount);
  const impactEntries = Object.entries(featuredCampaign.impact_details || {});
  const beneficiaryCount = featuredCampaign.beneficiary_count || 70;
  const statLabel = featuredCampaign.stat_label || `${featuredCampaign.category || 'People'} Need`;
  const urgencyMessage = featuredCampaign.urgency_message || 'Time is running out';

  const mapCampaignCategoryToDonationCategory = (campaignCategory?: string): 'orphan' | 'widow' | 'family' | 'outreach' | 'emergency' | 'education' | 'healthcare' | 'empowerment' | 'infrastructure' => {
    // Map campaign categories to valid donation categories
    const categoryMap: Record<string, 'orphan' | 'widow' | 'family' | 'outreach' | 'emergency' | 'education' | 'healthcare' | 'empowerment' | 'infrastructure'> = {
      'widows': 'widow',
      'widow': 'widow',
      'orphans': 'orphan',
      'orphan': 'orphan',
      'home': 'family',
      'family': 'family',
      'medical': 'healthcare',
      'education': 'education',
      'empowerment': 'empowerment',
      'emergency': 'emergency',
      'healthcare': 'healthcare',
      'infrastructure': 'infrastructure',
      'outreach': 'outreach'
    };

    return campaignCategory && categoryMap[campaignCategory.toLowerCase()]
      ? categoryMap[campaignCategory.toLowerCase()]
      : 'emergency';
  };

  const handleDonateToCampaign = () => {
    if (onDonateClick) {
      onDonateClick(); // Use legacy callback if provided
    } else {
      openDonationModal({
        source: 'urgent-needs',
        campaignId: featuredCampaign.id,
        title: featuredCampaign.title,
        description: featuredCampaign.description,
        category: mapCampaignCategoryToDonationCategory(featuredCampaign.category),
        suggestedAmount: parseInt(Object.keys(featuredCampaign.impact_details || {})[0] || '0')
      });
    }
  };

  const getCampaignUrl = (source?: string) => {
    if (typeof window !== 'undefined' && featuredCampaign) {
      // Use dedicated campaign page for better link previews
      const baseUrl = `${window.location.origin}/campaign/${featuredCampaign.id}`;
      if (source) {
        return `${baseUrl}?utm_source=${source}&utm_medium=${source === 'email' || source === 'sms' ? 'direct' : 'social'}&utm_campaign=${encodeURIComponent(featuredCampaign.id)}&utm_content=${encodeURIComponent(featuredCampaign.title)}`;
      }
      return baseUrl;
    }
    return typeof window !== 'undefined' ? window.location.origin : '';
  };

  const handleShare = async (platform: string) => {
    const shareUrl = getCampaignUrl(platform);
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(featuredCampaign?.title || 'Support Our Campaign');
    const encodedDescription = encodeURIComponent(featuredCampaign?.description || '');

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      sms: `sms:?&body=${encodedTitle}%20${encodedUrl}`,
    };

    if (shareUrls[platform]) {
      // Track the share event
      if (featuredCampaign) {
        await trackCampaignShare(featuredCampaign.id, platform, platform, platform === 'email' || platform === 'sms' ? 'direct' : 'social');
      }

      if (platform === 'email' || platform === 'sms') {
        // For email and SMS, use window.location instead of window.open
        window.location.href = shareUrls[platform];
      } else {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
      }
      setShowShareMenu(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      const url = getCampaignUrl('copy_link');
      await navigator.clipboard.writeText(url);

      // Track the copy/share event
      if (featuredCampaign) {
        await trackCampaignShare(featuredCampaign.id, 'copy_link', 'copy_link', 'direct');
      }

      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowShareMenu(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <>
      {/* Dynamic Meta Tags for Featured Campaign */}
      {featuredCampaign && <CampaignMetaTags campaign={featuredCampaign} />}

      <section id="urgent-campaign" className="home-section home-section-paper home-urgent-section scroll-mt-20">
        <div className="home-container">
        <SectionHeading
          eyebrow="Urgent campaign"
          title={<>Some needs cannot <span className="home-urgent-accent">wait.</span></>}
          description="Immediate support can become a meal, medicine or a safe next step for a family today."
        />

        {/* Main Campaign */}
        <div data-home-reveal className="home-bezel home-urgent-bezel">
          <div className="home-bezel-core home-urgent-card">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 md:p-12">
              <div className="flex items-center mb-4">
                <div className="bg-red-500/20 rounded-full p-2 mr-3">
                  <Heart className="w-6 h-6 text-red-400" />
                </div>
                <span className="text-red-400 font-semibold text-sm tracking-wide uppercase">URGENT CAMPAIGN</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-4 font-display">
                {featuredCampaign.title}
              </h3>

              <div className="flex items-center mb-6">
                <Target className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  Goal: {formatCurrency(featuredCampaign.goal_amount, featuredCampaign.currency)}
                  {featuredCampaign.currency === 'USD' && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      (₦{getNGNEquivalent(featuredCampaign.goal_amount, featuredCampaign.currency).toLocaleString()})
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-center mb-6">
                <Clock className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-lg font-medium text-red-400">
                  Deadline: {formatDeadline(featuredCampaign.deadline)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span>Progress</span>
                  <span>{progressPercentage}% raised</span>
                </div>
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                    style={{width: `${progressPercentage}%`}}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {formatCurrency(featuredCampaign.current_amount, featuredCampaign.currency)} raised of {formatCurrency(featuredCampaign.goal_amount, featuredCampaign.currency)} goal
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="font-semibold text-gray-900 dark:text-white font-display">Your Impact:</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {impactEntries.map(([amount, description]) => (
                    <div key={amount}>
                      <span className="font-medium">{formatCurrency(parseInt(amount), featuredCampaign.currency)}</span>
                      {featuredCampaign.currency === 'USD' && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          (₦{getNGNEquivalent(parseInt(amount), featuredCampaign.currency).toLocaleString()})
                        </span>
                      )}
                      {' = '}{description}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <ActionButton
                  onClick={handleDonateToCampaign}
                  tone="urgent"
                >
                  Give Now
                </ActionButton>
                <ActionLink href={`/campaign/${featuredCampaign.id}`} tone="secondary">Learn more</ActionLink>
                <ActionButton
                  onClick={() => setShowQRModal(true)}
                  tone="secondary"
                  showArrow={false}
                  aria-label={`Share ${featuredCampaign.title} with a QR code`}
                >
                  Share campaign
                </ActionButton>
              </div>
            </div>

            <div className="md:w-1/2 bg-gradient-to-br from-red-500 to-orange-600 p-8 md:p-12 text-white flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl md:text-8xl font-bold mb-4 opacity-90">{beneficiaryCount}+</div>
                <div className="text-xl md:text-2xl font-light mb-2">{statLabel}</div>
                <div className="text-xl md:text-2xl font-light">Your Help</div>
                <div className="mt-8 text-white/80">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-sm">{urgencyMessage}</div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-6 font-light text-lg">
            &ldquo;You can&apos;t change the whole world. But you can change someone&apos;s world.&rdquo;
          </p>
          <div className="home-urgent-options">
            {['Adopt a widow', 'Feed a family', 'Sponsor an outreach', 'Donate in crypto'].map(label => (
              <button key={label} onClick={handleDonateToCampaign} className="home-urgent-option group">
                <Heart className="w-4 h-4" />
                <span>{label}</span>
                <ExternalLink className="w-4 h-4 home-icon-motion" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {featuredCampaign && (
        <CampaignQRModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          campaignId={featuredCampaign.id}
          campaignTitle={featuredCampaign.title}
          utmSource="homepage_share"
        />
      )}
      </section>
    </>
  );
};

export default UrgentNeeds;
