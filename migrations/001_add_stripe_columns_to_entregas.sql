-- Migration 001: Add Stripe payment tracking, event idempotency and delivery columns to entregas table

ALTER TABLE entregas 
  ADD COLUMN IF NOT EXISTS email_enviado BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS paid BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS payment_status TEXT,
  ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_event_id TEXT;

-- Create indexes for performance and fast lookups
CREATE INDEX IF NOT EXISTS idx_entregas_stripe_session_id ON entregas(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_entregas_payment_status ON entregas(payment_status);

-- Unique index for stripe_event_id to guarantee event uniqueness when tracked
CREATE UNIQUE INDEX IF NOT EXISTS idx_entregas_stripe_event_id_unique ON entregas(stripe_event_id) WHERE stripe_event_id IS NOT NULL;
