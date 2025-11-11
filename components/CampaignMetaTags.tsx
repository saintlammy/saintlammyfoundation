import Head from 'next/head';
import React from 'react';

interface CampaignMetaTagsProps {
  campaign: {
    id: string;
    title: string;
    description: string;
    image_url?: string;
    goal_amount: number;
    current_amount: number;
    currency: string;
  };
}

const CampaignMetaTags: React.FC<CampaignMetaTagsProps> = ({ campaign }) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://saintlammyfoundation.org';
  const campaignUrl = `${siteUrl}/#urgent-campaign?utm_source=social_share&utm_medium=og_meta&utm_campaign=${campaign.id}`;

  const ogImage = campaign.image_url || `${siteUrl}/images/default-campaign-og.jpg`;
  const progressPercentage = Math.min((campaign.current_amount / campaign.goal_amount) * 100, 100).toFixed(0);

  const ogDescription = `${campaign.description} | ${progressPercentage}% funded | Help us reach our goal of ${campaign.currency === 'USD' ? '$' : '₦'}${campaign.goal_amount.toLocaleString()}`;

  return (
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
  );
};

export default CampaignMetaTags;
