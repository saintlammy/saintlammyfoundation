import type { NextApiRequest, NextApiResponse } from 'next';
// @ts-ignore - @vercel/og not installed, this endpoint is currently unused
import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextApiRequest) {
  try {
    const { searchParams } = new URL(req.url!);

    const title = searchParams.get('title') || 'Support Our Campaign';
    const description = searchParams.get('description') || 'Help us make a difference';
    const goalAmount = searchParams.get('goalAmount') || '10,000';
    const currentAmount = searchParams.get('currentAmount') || '5,000';
    const currency = searchParams.get('currency') || 'USD';
    const progress = searchParams.get('progress') || '50';
    const beneficiaryCount = searchParams.get('beneficiaryCount') || '70';
    const statLabel = searchParams.get('statLabel') || 'Orphans Need';

    const currencySymbol = currency === 'USD' ? '$' : '₦';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '40px',
              borderBottom: '2px solid #e5e7eb',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: 32,
                fontWeight: 700,
                color: '#4f46e5',
              }}
            >
              Saintlammy Foundation
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flex: 1,
              padding: '60px',
              gap: '40px',
            }}
          >
            {/* Left Side - Campaign Info */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '24px',
                  color: '#ef4444',
                  fontSize: 20,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                <span style={{ marginRight: '12px' }}>⚠️</span>
                URGENT CAMPAIGN
              </div>

              <h1
                style={{
                  fontSize: 56,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  marginBottom: '24px',
                  color: '#111827',
                  maxWidth: '600px',
                }}
              >
                {title}
              </h1>

              <p
                style={{
                  fontSize: 24,
                  color: '#6b7280',
                  lineHeight: 1.5,
                  marginBottom: '40px',
                  maxWidth: '600px',
                }}
              >
                {description.substring(0, 120)}
                {description.length > 120 ? '...' : ''}
              </p>

              {/* Progress Bar */}
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '32px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    fontSize: 18,
                    color: '#6b7280',
                  }}
                >
                  <span>Progress</span>
                  <span style={{ fontWeight: 600 }}>{progress}% funded</span>
                </div>

                <div
                  style={{
                    width: '100%',
                    height: '16px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${progress}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '12px',
                    fontSize: 16,
                    color: '#9ca3af',
                  }}
                >
                  <span>
                    {currencySymbol}
                    {currentAmount} raised
                  </span>
                  <span>
                    {currencySymbol}
                    {goalAmount} goal
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side - Stats Card */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                borderRadius: '24px',
                padding: '60px',
                minWidth: '400px',
                color: 'white',
              }}
            >
              <div
                style={{
                  fontSize: 120,
                  fontWeight: 700,
                  marginBottom: '16px',
                  opacity: 0.9,
                }}
              >
                {beneficiaryCount}+
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 300,
                  marginBottom: '8px',
                  textAlign: 'center',
                }}
              >
                {statLabel}
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 300,
                  marginBottom: '40px',
                  textAlign: 'center',
                }}
              >
                Your Help
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: 0.8,
                }}
              >
                <div style={{ fontSize: 48, marginBottom: '8px' }}>⏰</div>
                <div style={{ fontSize: 18 }}>Time is running out</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '32px',
              borderTop: '2px solid #e5e7eb',
              fontSize: 20,
              color: '#6b7280',
            }}
          >
            Every donation makes a difference • Join us today
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
