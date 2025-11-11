/**
 * Track campaign share events for analytics
 * @param campaignId - The ID of the campaign being shared
 * @param platform - The platform where it's being shared (facebook, twitter, etc.)
 * @param utmSource - UTM source parameter
 * @param utmMedium - UTM medium parameter
 */
export async function trackCampaignShare(
  campaignId: string,
  platform: string,
  utmSource?: string,
  utmMedium?: string
): Promise<void> {
  try {
    const response = await fetch('/api/campaign-share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        campaignId,
        platform,
        utmSource: utmSource || platform,
        utmMedium: utmMedium || 'social'
      }),
    });

    const result = await response.json();

    if (!result.success) {
      console.warn('Share tracking failed:', result.message);
    }
  } catch (error) {
    // Fail silently - don't interrupt user experience
    console.error('Error tracking share:', error);
  }
}
