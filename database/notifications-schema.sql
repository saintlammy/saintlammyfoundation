-- Notifications table schema
-- Run this SQL in your Supabase SQL Editor to create the notifications table

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('success', 'error', 'warning', 'info')),
  category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('donation', 'volunteer', 'program', 'general', 'emergency', 'system')),
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  read BOOLEAN DEFAULT false,
  user_id UUID REFERENCES donors(id) ON DELETE CASCADE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_category ON notifications(category);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notifications_updated_at();

-- Add RLS (Row Level Security) policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own notifications
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Policy: Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy: Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications
  FOR DELETE
  USING (user_id = auth.uid());

-- Policy: Admins can manage all notifications
CREATE POLICY "Admins can manage all notifications"
  ON notifications
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM donors
      WHERE donors.id = auth.uid()
      AND donors.role = 'admin'
    )
  );

-- Sample notifications for testing
INSERT INTO notifications (title, message, type, category, priority, user_id, metadata)
VALUES
  (
    'Welcome to Saintlammy Foundation!',
    'Thank you for joining our mission to support orphans, widows, and communities across Nigeria.',
    'success',
    'general',
    'medium',
    NULL,
    '{"source": "system", "version": "1.0"}'
  ),
  (
    'New Campaign: Feed 100 Widows',
    'Help us reach our goal of feeding 100 widows before Christmas. Every donation counts!',
    'info',
    'donation',
    'high',
    NULL,
    '{"campaign_id": "feed-100-widows", "goal": 1795.00}'
  ),
  (
    'System Maintenance Scheduled',
    'Our system will undergo maintenance on December 15, 2024 from 2:00 AM to 4:00 AM UTC. Some features may be temporarily unavailable.',
    'warning',
    'system',
    'medium',
    NULL,
    '{"maintenance_window": "2024-12-15T02:00:00Z to 2024-12-15T04:00:00Z"}'
  );

-- Grant permissions
GRANT ALL ON notifications TO authenticated;
GRANT ALL ON notifications TO service_role;
