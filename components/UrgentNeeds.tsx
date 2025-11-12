import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Clock, Target, Heart, AlertCircle, Share2, Facebook, Twitter, Linkedin, Copy, CheckCircle, QrCode, Mail, MessageSquare, X } from 'lucide-react';
import { useDonationModal } from './DonationModalProvider';
import CampaignQRModal from './CampaignQRModal';
import CampaignMetaTags from './CampaignMetaTags';
import { trackCampaignShare } from '@/lib/trackCampaignShare';

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

  // Update button position when menu opens and on scroll
  useEffect(() => {
    const updatePosition = () => {
      if (shareButtonRef.current) {
        setShareButtonRect(shareButtonRef.current.getBoundingClientRect());
      }
    };

    if (showShareMenu) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
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
      <section className="py-24 bg-gray-100 dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 text-center">
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

  const mapCampaignCategoryToDonationCategory = (campaignCategory?: string): 'orphan' | 'widow' | 'home' | 'general' => {
    // Map campaign categories to valid donation categories
    const categoryMap: Record<string, 'orphan' | 'widow' | 'home' | 'general'> = {
      'widows': 'widow',
      'widow': 'widow',
      'orphans': 'orphan',
      'orphan': 'orphan',
      'medical': 'general',
      'education': 'general',
      'empowerment': 'general',
      'emergency': 'general',
      'healthcare': 'general',
      'infrastructure': 'general'
    };

    return campaignCategory && categoryMap[campaignCategory.toLowerCase()]
      ? categoryMap[campaignCategory.toLowerCase()]
      : 'general';
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

      <section id="urgent-campaign" className="py-24 bg-gray-100 dark:bg-black scroll-mt-20">
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
                <button
                  onClick={handleDonateToCampaign}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-medium text-base transition-colors shadow-lg hover:shadow-xl font-sans"
                >
                  Give Now
                </button>
                <div className="relative">
                  <button
                    ref={shareButtonRef}
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-red-600 dark:text-red-400 border-2 border-red-600 dark:border-red-400 px-8 py-4 rounded-full font-medium text-base transition-colors font-sans flex items-center justify-center w-full"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share Campaign
                  </button>

                  {/* Share Menu Portal */}
                  {showShareMenu && typeof window !== 'undefined' && ReactDOM.createPortal(
                    <div
                      ref={shareMenuRef}
                      className="fixed bg-white dark:bg-gray-700 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-600 w-72"
                      style={{
                        top: shareButtonRect ? `${shareButtonRect.bottom + 8}px` : '50%',
                        left: shareButtonRect ? `${shareButtonRect.left}px` : '50%',
                        transform: shareButtonRect ? 'none' : 'translate(-50%, -50%)',
                        zIndex: 10000
                      }}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Share this campaign</p>
                          <button
                            onClick={() => setShowShareMenu(false)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                        <div className="space-y-2">
                          <button
                            onClick={() => handleShare('facebook')}
                            className="w-full flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            <Facebook className="w-5 h-5 text-blue-600 mr-3" />
                            <span className="text-gray-700 dark:text-gray-300">Facebook</span>
                          </button>
                          <button
                            onClick={() => handleShare('twitter')}
                            className="w-full flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            <Twitter className="w-5 h-5 text-blue-400 mr-3" />
                            <span className="text-gray-700 dark:text-gray-300">Twitter</span>
                          </button>
                          <button
                            onClick={() => handleShare('linkedin')}
                            className="w-full flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            <Linkedin className="w-5 h-5 text-blue-700 mr-3" />
                            <span className="text-gray-700 dark:text-gray-300">LinkedIn</span>
                          </button>
                          <button
                            onClick={() => handleShare('whatsapp')}
                            className="w-full flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">WhatsApp</span>
                          </button>
                          <button
                            onClick={() => handleShare('telegram')}
                            className="w-full flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            <svg className="w-5 h-5 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">Telegram</span>
                          </button>
                          <button
                            onClick={() => handleShare('email')}
                            className="w-full flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            <Mail className="w-5 h-5 text-red-500 mr-3" />
                            <span className="text-gray-700 dark:text-gray-300">Email</span>
                          </button>
                          <button
                            onClick={() => handleShare('sms')}
                            className="w-full flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            <MessageSquare className="w-5 h-5 text-orange-500 mr-3" />
                            <span className="text-gray-700 dark:text-gray-300">SMS</span>
                          </button>

                          <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>

                          <button
                            onClick={copyToClipboard}
                            className={`w-full flex items-center px-4 py-2 rounded-lg transition-all ${
                              copied
                                ? 'bg-green-50 dark:bg-green-900/20'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                          >
                            {copied ? (
                              <>
                                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                <span className="text-green-600 dark:text-green-400 font-medium">Link Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-5 h-5 text-gray-500 mr-3" />
                                <span className="text-gray-700 dark:text-gray-300">Copy Link</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setShowQRModal(true);
                              setShowShareMenu(false);
                            }}
                            className="w-full flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            <QrCode className="w-5 h-5 text-purple-500 mr-3" />
                            <span className="text-gray-700 dark:text-gray-300">Generate QR Code</span>
                          </button>
                        </div>
                      </div>
                    </div>,
                    document.body
                  )}
                </div>
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