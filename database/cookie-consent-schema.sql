-- Cookie Consent Tracking Schema
-- Tracks user consent for GDPR compliance and analytics

-- Cookie Consent Logs Table
CREATE TABLE IF NOT EXISTS cookie_consent_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255) NOT NULL, -- Anonymous session identifier
  ip_address VARCHAR(45), -- IPv4 or IPv6
  user_agent TEXT,

  -- Consent Details
  consent_action VARCHAR(50) NOT NULL, -- 'accept_all', 'reject_all', 'customize'
  necessary BOOLEAN DEFAULT true NOT NULL,
  analytics BOOLEAN DEFAULT false,
  marketing BOOLEAN DEFAULT false,
  preferences BOOLEAN DEFAULT false,

  -- Metadata
  consent_version VARCHAR(10) DEFAULT '1.0', -- Policy version
  consent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  page_url TEXT, -- Where consent was given
  referrer TEXT,

  -- Geo Location (optional)
  country_code VARCHAR(2),
  region VARCHAR(100),

  -- Updates
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Indexes
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cookie_consent_session ON cookie_consent_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_cookie_consent_date ON cookie_consent_logs(consent_date);
CREATE INDEX IF NOT EXISTS idx_cookie_consent_action ON cookie_consent_logs(consent_action);
CREATE INDEX IF NOT EXISTS idx_cookie_consent_created ON cookie_consent_logs(created_at);

-- Cookie Analytics Summary Table (for dashboard)
CREATE TABLE IF NOT EXISTS cookie_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,

  -- Daily counts
  total_consents INTEGER DEFAULT 0,
  accept_all_count INTEGER DEFAULT 0,
  reject_all_count INTEGER DEFAULT 0,
  customize_count INTEGER DEFAULT 0,

  -- Category opt-ins
  analytics_opted_in INTEGER DEFAULT 0,
  marketing_opted_in INTEGER DEFAULT 0,
  preferences_opted_in INTEGER DEFAULT 0,

  -- Percentages (calculated)
  acceptance_rate DECIMAL(5,2), -- Percentage who accepted all

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for date queries
CREATE INDEX IF NOT EXISTS idx_cookie_analytics_date ON cookie_analytics(date);

-- Cookie Policy Versions Table
CREATE TABLE IF NOT EXISTS cookie_policy_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  version VARCHAR(10) NOT NULL UNIQUE,
  content TEXT NOT NULL, -- JSON or markdown content

  -- Metadata
  is_active BOOLEAN DEFAULT false,
  effective_date DATE NOT NULL,
  created_by VARCHAR(255),

  -- Descriptions
  change_summary TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Only one active policy at a time
CREATE UNIQUE INDEX IF NOT EXISTS idx_cookie_policy_active ON cookie_policy_versions(is_active) WHERE is_active = true;

-- Function to update analytics summary
CREATE OR REPLACE FUNCTION update_cookie_analytics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO cookie_analytics (
    date,
    total_consents,
    accept_all_count,
    reject_all_count,
    customize_count,
    analytics_opted_in,
    marketing_opted_in,
    preferences_opted_in,
    acceptance_rate,
    updated_at
  )
  VALUES (
    CURRENT_DATE,
    1,
    CASE WHEN NEW.consent_action = 'accept_all' THEN 1 ELSE 0 END,
    CASE WHEN NEW.consent_action = 'reject_all' THEN 1 ELSE 0 END,
    CASE WHEN NEW.consent_action = 'customize' THEN 1 ELSE 0 END,
    CASE WHEN NEW.analytics = true THEN 1 ELSE 0 END,
    CASE WHEN NEW.marketing = true THEN 1 ELSE 0 END,
    CASE WHEN NEW.preferences = true THEN 1 ELSE 0 END,
    0, -- Will be calculated separately
    CURRENT_TIMESTAMP
  )
  ON CONFLICT (date)
  DO UPDATE SET
    total_consents = cookie_analytics.total_consents + 1,
    accept_all_count = cookie_analytics.accept_all_count + CASE WHEN NEW.consent_action = 'accept_all' THEN 1 ELSE 0 END,
    reject_all_count = cookie_analytics.reject_all_count + CASE WHEN NEW.consent_action = 'reject_all' THEN 1 ELSE 0 END,
    customize_count = cookie_analytics.customize_count + CASE WHEN NEW.consent_action = 'customize' THEN 1 ELSE 0 END,
    analytics_opted_in = cookie_analytics.analytics_opted_in + CASE WHEN NEW.analytics = true THEN 1 ELSE 0 END,
    marketing_opted_in = cookie_analytics.marketing_opted_in + CASE WHEN NEW.marketing = true THEN 1 ELSE 0 END,
    preferences_opted_in = cookie_analytics.preferences_opted_in + CASE WHEN NEW.preferences = true THEN 1 ELSE 0 END,
    acceptance_rate = ROUND((cookie_analytics.accept_all_count + CASE WHEN NEW.consent_action = 'accept_all' THEN 1 ELSE 0 END)::DECIMAL / (cookie_analytics.total_consents + 1) * 100, 2),
    updated_at = CURRENT_TIMESTAMP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update analytics
DROP TRIGGER IF EXISTS trigger_update_cookie_analytics ON cookie_consent_logs;
CREATE TRIGGER trigger_update_cookie_analytics
  AFTER INSERT ON cookie_consent_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_cookie_analytics();

-- Insert default active policy version
INSERT INTO cookie_policy_versions (
  version,
  content,
  is_active,
  effective_date,
  change_summary
) VALUES (
  '1.0',
  '{"necessary": {"enabled": true, "description": "Essential cookies for website functionality"}, "analytics": {"enabled": false, "description": "Help us understand website usage"}, "marketing": {"enabled": false, "description": "Personalized advertising"}, "preferences": {"enabled": false, "description": "Remember your settings"}}',
  true,
  CURRENT_DATE,
  'Initial cookie policy version'
) ON CONFLICT (version) DO NOTHING;

-- Sample queries for analytics

-- Get consent statistics for last 30 days
-- SELECT
--   date,
--   total_consents,
--   accept_all_count,
--   reject_all_count,
--   acceptance_rate
-- FROM cookie_analytics
-- WHERE date >= CURRENT_DATE - INTERVAL '30 days'
-- ORDER BY date DESC;

-- Get breakdown of cookie preferences
-- SELECT
--   COUNT(*) as total,
--   SUM(CASE WHEN analytics = true THEN 1 ELSE 0 END) as analytics_count,
--   SUM(CASE WHEN marketing = true THEN 1 ELSE 0 END) as marketing_count,
--   SUM(CASE WHEN preferences = true THEN 1 ELSE 0 END) as preferences_count,
--   ROUND(SUM(CASE WHEN analytics = true THEN 1 ELSE 0 END)::DECIMAL / COUNT(*) * 100, 2) as analytics_percent,
--   ROUND(SUM(CASE WHEN marketing = true THEN 1 ELSE 0 END)::DECIMAL / COUNT(*) * 100, 2) as marketing_percent,
--   ROUND(SUM(CASE WHEN preferences = true THEN 1 ELSE 0 END)::DECIMAL / COUNT(*) * 100, 2) as preferences_percent
-- FROM cookie_consent_logs
-- WHERE consent_date >= CURRENT_DATE - INTERVAL '30 days';

-- Get geographic distribution (if geo data collected)
-- SELECT
--   country_code,
--   COUNT(*) as consent_count,
--   SUM(CASE WHEN consent_action = 'accept_all' THEN 1 ELSE 0 END) as accepts,
--   SUM(CASE WHEN consent_action = 'reject_all' THEN 1 ELSE 0 END) as rejects
-- FROM cookie_consent_logs
-- WHERE consent_date >= CURRENT_DATE - INTERVAL '30 days'
-- GROUP BY country_code
-- ORDER BY consent_count DESC;
