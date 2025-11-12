import type { NextApiRequest, NextApiResponse } from 'next';

// Simple OG image generator using HTML template
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    title = 'Support Our Campaign',
    description = 'Help us make a difference',
    goalAmount = '10,000',
    currentAmount = '5,000',
    currency = 'USD',
    progress = '50',
    beneficiaryCount = '70',
    statLabel = 'Orphans Need',
    urgencyMessage = 'Time is running out',
  } = req.query;

  const currencySymbol = currency === 'USD' ? '$' : '₦';

  // Generate HTML for the OG image
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            width: 1200px;
            height: 630px;
            display: flex;
            flex-direction: column;
            background: #ffffff;
          }
          .header {
            display: flex;
            align-items: center;
            padding: 30px 40px;
            border-bottom: 2px solid #e5e7eb;
          }
          .logo {
            font-size: 28px;
            font-weight: 700;
            color: #4f46e5;
          }
          .content {
            display: flex;
            flex: 1;
            padding: 40px;
            gap: 30px;
          }
          .left {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .urgent-badge {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            color: #ef4444;
            font-size: 16px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .title {
            font-size: 42px;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 20px;
            color: #111827;
            max-width: 600px;
          }
          .description {
            font-size: 20px;
            color: #6b7280;
            line-height: 1.5;
            margin-bottom: 30px;
            max-width: 600px;
          }
          .progress-section {
            margin-bottom: 25px;
          }
          .progress-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 16px;
            color: #6b7280;
          }
          .progress-bar {
            width: 100%;
            height: 12px;
            background-color: #e5e7eb;
            border-radius: 9999px;
            overflow: hidden;
          }
          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%);
            width: ${progress}%;
          }
          .progress-footer {
            display: flex;
            justify-content: space-between;
            margin-top: 8px;
            font-size: 14px;
            color: #9ca3af;
          }
          .right {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
            border-radius: 20px;
            padding: 50px 40px;
            min-width: 350px;
            color: white;
          }
          .stat-number {
            font-size: 100px;
            font-weight: 700;
            margin-bottom: 12px;
            opacity: 0.9;
          }
          .stat-label {
            font-size: 28px;
            font-weight: 300;
            margin-bottom: 8px;
            text-align: center;
          }
          .urgency {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 30px;
            opacity: 0.8;
          }
          .urgency-icon {
            font-size: 40px;
            margin-bottom: 8px;
          }
          .urgency-text {
            font-size: 16px;
          }
          .footer {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 25px;
            border-top: 2px solid #e5e7eb;
            font-size: 16px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Saintlammy Foundation</div>
        </div>

        <div class="content">
          <div class="left">
            <div class="urgent-badge">
              <span style="margin-right: 8px;">⚠️</span>
              URGENT CAMPAIGN
            </div>

            <h1 class="title">${String(title).substring(0, 80)}</h1>

            <p class="description">
              ${String(description).substring(0, 150)}${String(description).length > 150 ? '...' : ''}
            </p>

            <div class="progress-section">
              <div class="progress-header">
                <span>Progress</span>
                <span style="font-weight: 600;">${progress}% funded</span>
              </div>

              <div class="progress-bar">
                <div class="progress-fill"></div>
              </div>

              <div class="progress-footer">
                <span>${currencySymbol}${currentAmount} raised</span>
                <span>${currencySymbol}${goalAmount} goal</span>
              </div>
            </div>
          </div>

          <div class="right">
            <div class="stat-number">${beneficiaryCount}+</div>
            <div class="stat-label">${statLabel}</div>
            <div class="stat-label">Your Help</div>
            <div class="urgency">
              <div class="urgency-icon">⏰</div>
              <div class="urgency-text">${urgencyMessage}</div>
            </div>
          </div>
        </div>

        <div class="footer">
          Every donation makes a difference • Join us today
        </div>
      </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
