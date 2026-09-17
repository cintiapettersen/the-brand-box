-- ==============================================================================
-- Migration 003: Fix Supabase Security Advisor Security Definer View Warnings
-- ==============================================================================
-- Problem:
-- PostgreSQL views in the public schema default to SECURITY DEFINER behavior
-- when not declared with security_invoker = true. By default, public schema views
-- are exposed by PostgREST and granted SELECT to anon/authenticated, bypassing
-- Row Level Security (RLS) on underlying tables (ai_usage_logs and entregas).
--
-- Solution:
-- 1. Recreate views with explicit `WITH (security_invoker = true)`
-- 2. Revoke all permissions from anon, authenticated, and public roles
-- 3. Grant SELECT access exclusively to service_role (and postgres DBA)
-- ==============================================================================

-- Step 1: Drop old views in public schema
DROP VIEW IF EXISTS public.v_delivery_ai_costs CASCADE;
DROP VIEW IF EXISTS public.v_cost_by_operation CASCADE;
DROP VIEW IF EXISTS public.v_quality_gate_telemetry CASCADE;

-- Step 2: Recreate views with security_invoker = true
-- 2.1 AI cost and telemetry per delivery
CREATE OR REPLACE VIEW public.v_delivery_ai_costs
WITH (security_invoker = true)
AS
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

-- 2.2 Performance and reliability by operation and exact runtime model
CREATE OR REPLACE VIEW public.v_cost_by_operation
WITH (security_invoker = true)
AS
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

-- 2.3 Quality gate telemetry and retry analytics
CREATE OR REPLACE VIEW public.v_quality_gate_telemetry
WITH (security_invoker = true)
AS
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

-- Step 3: Revoke all privileges from public API roles (anon and authenticated)
REVOKE ALL ON TABLE public.v_delivery_ai_costs FROM anon, authenticated, public;
REVOKE ALL ON TABLE public.v_cost_by_operation FROM anon, authenticated, public;
REVOKE ALL ON TABLE public.v_quality_gate_telemetry FROM anon, authenticated, public;

-- Step 4: Grant SELECT strictly to service_role
GRANT SELECT ON TABLE public.v_delivery_ai_costs TO service_role;
GRANT SELECT ON TABLE public.v_cost_by_operation TO service_role;
GRANT SELECT ON TABLE public.v_quality_gate_telemetry TO service_role;
