-- Migration 002: Production-grade, Privacy-safe AI Usage & Cost Telemetry (Architecture V3)
-- Status: LOCAL SPECIFICATION ONLY - NOT YET APPLIED TO PRODUCTION SUPABASE
-- Summary:
-- 1. Adds dedicated nullable journey_id column to public.entregas
-- 2. Creates public.ai_usage_logs table with decoupled provider_success / output_accepted, nullable estimated_cost_usd, and explicit pricing statuses
-- 3. Sets strict Row Level Security (service_role only)
-- 4. Creates reporting views for journey costs, operation performance, and quality gating without hardcoded revenue values.

-- Step 1: Add dedicated journey_id column to entregas table for dual-table relational linkage
ALTER TABLE public.entregas ADD COLUMN IF NOT EXISTS journey_id VARCHAR(64);
CREATE INDEX IF NOT EXISTS idx_entregas_journey_id ON public.entregas(journey_id);

-- Step 2: Create ai_usage_logs table
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journey_id VARCHAR(64) NOT NULL,
    delivery_id UUID REFERENCES public.entregas(id) ON DELETE SET NULL,
    operation_type VARCHAR(64) NOT NULL,
    provider VARCHAR(32) NOT NULL,
    exact_model VARCHAR(128) NOT NULL,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    cached_input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    input_image_count INTEGER NOT NULL DEFAULT 0,
    output_image_count INTEGER NOT NULL DEFAULT 0,
    image_resolution VARCHAR(32),
    image_quality VARCHAR(32),
    attempt_number INTEGER NOT NULL DEFAULT 1,
    provider_success BOOLEAN NOT NULL DEFAULT true,
    output_accepted BOOLEAN NOT NULL DEFAULT true,
    retry_reason VARCHAR(255),
    fallback_used BOOLEAN NOT NULL DEFAULT false,
    error_code VARCHAR(128),
    latency_ms INTEGER,
    provider_request_id VARCHAR(128),
    pricing_mode VARCHAR(32) NOT NULL DEFAULT 'standard',
    pricing_source VARCHAR(64) NOT NULL DEFAULT 'official_rate_card',
    pricing_version VARCHAR(32) NOT NULL DEFAULT '2026-09-01',
    pricing_status VARCHAR(32) NOT NULL DEFAULT 'exact', -- 'exact', 'unknown', 'free_tier'
    cost_confidence VARCHAR(32) NOT NULL DEFAULT 'high', -- 'high', 'medium', 'none'
    unit_price_input_per_m NUMERIC(12, 6),
    unit_price_cached_input_per_m NUMERIC(12, 6),
    unit_price_output_per_m NUMERIC(12, 6),
    unit_price_per_image NUMERIC(10, 6),
    estimated_cost_usd NUMERIC(12, 6), -- NULLABLE: null indicates unknown/unverified model pricing, 0 means proven zero-cost
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Step 3: Performance indexes
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_journey_id ON public.ai_usage_logs(journey_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_delivery_id ON public.ai_usage_logs(delivery_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_created_at ON public.ai_usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_operation_type ON public.ai_usage_logs(operation_type);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_provider_model ON public.ai_usage_logs(provider, exact_model);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_provider_success ON public.ai_usage_logs(provider_success, output_accepted);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_pricing_status ON public.ai_usage_logs(pricing_status);

-- Step 4: Row Level Security (RLS) - Strictly locked down to service_role (zero public / anon read/write)
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access on ai_usage_logs" ON public.ai_usage_logs;
CREATE POLICY "Service role full access on ai_usage_logs"
    ON public.ai_usage_logs
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Step 5: Reporting Views

-- 5.1 Real AI cost per delivery
CREATE OR REPLACE VIEW public.v_delivery_ai_costs AS
SELECT
    e.id AS delivery_id,
    e.journey_id,
    e.marca,
    e.plano,
    e.paid,
    e.payment_status,
    e.created_at,
    COUNT(l.id) AS total_ai_operations,
    SUM(CASE WHEN l.provider_success THEN 1 ELSE 0 END) AS successful_executions,
    SUM(CASE WHEN l.output_accepted THEN 1 ELSE 0 END) AS accepted_outputs,
    COALESCE(SUM(l.estimated_cost_usd), 0.000000) AS total_known_ai_cost_usd,
    SUM(CASE WHEN l.pricing_status = 'unknown' THEN 1 ELSE 0 END) AS unpriced_operations_count,
    COALESCE(SUM(l.total_tokens), 0) AS total_tokens_consumed,
    COALESCE(SUM(l.output_image_count), 0) AS total_images_generated
FROM public.entregas e
LEFT JOIN public.ai_usage_logs l ON e.id = l.delivery_id
GROUP BY e.id, e.journey_id, e.marca, e.plano, e.paid, e.payment_status, e.created_at;

-- 5.2 Performance and reliability by operation and exact runtime model
CREATE OR REPLACE VIEW public.v_cost_by_operation AS
SELECT
    operation_type,
    provider,
    exact_model,
    pricing_status,
    COUNT(*) AS total_calls,
    SUM(CASE WHEN provider_success THEN 1 ELSE 0 END) AS provider_success_calls,
    SUM(CASE WHEN output_accepted THEN 1 ELSE 0 END) AS accepted_output_calls,
    SUM(CASE WHEN NOT provider_success THEN 1 ELSE 0 END) AS provider_failed_calls,
    ROUND(AVG(latency_ms), 0) AS avg_latency_ms,
    SUM(total_tokens) AS total_tokens,
    SUM(output_image_count) AS total_images,
    SUM(estimated_cost_usd) AS total_known_cost_usd,
    ROUND(AVG(estimated_cost_usd), 6) AS avg_cost_per_call_usd
FROM public.ai_usage_logs
GROUP BY operation_type, provider, exact_model, pricing_status
ORDER BY total_known_cost_usd DESC NULLS LAST;

-- 5.3 Quality gate telemetry and retries
CREATE OR REPLACE VIEW public.v_quality_gate_telemetry AS
SELECT
    operation_type,
    exact_model,
    attempt_number,
    provider_success,
    output_accepted,
    retry_reason,
    fallback_used,
    COUNT(*) AS occurrences,
    SUM(estimated_cost_usd) AS retry_cost_usd
FROM public.ai_usage_logs
WHERE attempt_number > 1 OR NOT output_accepted OR retry_reason IS NOT NULL
GROUP BY operation_type, exact_model, attempt_number, provider_success, output_accepted, retry_reason, fallback_used
ORDER BY occurrences DESC;
