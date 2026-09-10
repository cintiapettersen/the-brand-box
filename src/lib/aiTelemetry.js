import { calculateCost, AI_PRICING_VERSION } from './aiPricing.js';

let telemetryClient = null;

async function getTelemetryClient() {
  if (!telemetryClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = (process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.replace(/['"]/g, '') : undefined);
    
    if (url && key) {
      const { createClient } = await import('@supabase/supabase-js');
      telemetryClient = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false }
      });
    }
  }
  return telemetryClient;
}

/**
 * Validates and constrains client-provided journey identifiers.
 * Accepts standard UUID v4 or journey-[0-9a-zA-Z_-]{10,60}, max 64 characters.
 */
export function sanitizeJourneyId(rawId) {
  if (typeof rawId !== 'string') return null;
  const trimmed = rawId.trim();
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(trimmed) ||
    /^(journey|delivery|atelier)-[0-9a-zA-Z_-]{6,60}$/.test(trimmed)
  ) {
    return trimmed.slice(0, 64);
  }
  return null;
}

/**
 * Extracts exact token usage from OpenAI Responses API (/v1/responses)
 * or Chat Completions (/v1/chat/completions) response schema.
 */
export function extractOpenAIUsage(responseJson = {}) {
  const usage = responseJson?.usage || {};
  
  // Responses API schema: input_tokens, output_tokens
  // Chat Completions schema: prompt_tokens, completion_tokens
  const inputTokens = usage.input_tokens ?? usage.prompt_tokens ?? 0;
  const outputTokens = usage.output_tokens ?? usage.completion_tokens ?? 0;

  // Responses API nests under input_token_details.cached_tokens
  // Chat Completions nests under prompt_tokens_details.cached_tokens
  const cachedInputTokens = 
    usage.input_token_details?.cached_tokens ?? 
    usage.prompt_tokens_details?.cached_tokens ?? 
    0;

  const reasoningTokens = 
    usage.output_token_details?.reasoning_tokens ?? 
    usage.completion_tokens_details?.reasoning_tokens ?? 
    0;

  const totalTokens = usage.total_tokens ?? (inputTokens + outputTokens);

  return {
    inputTokens: Math.max(0, Number(inputTokens) || 0),
    cachedInputTokens: Math.max(0, Number(cachedInputTokens) || 0),
    outputTokens: Math.max(0, Number(outputTokens) || 0),
    totalTokens: Math.max(0, Number(totalTokens) || 0),
    reasoningTokens: Math.max(0, Number(reasoningTokens) || 0),
    providerRequestId: responseJson?.id || null,
    resolvedModel: responseJson?.model || null
  };
}

/**
 * Extracts exact token usage from Google GenAI response schema.
 */
export function extractGoogleUsage(responseObj = {}) {
  const meta = responseObj?.usageMetadata || 
               responseObj?.response?.usageMetadata || 
               responseObj?.candidates?.[0]?.usageMetadata || 
               {};
  const inputTokens = meta.promptTokenCount || 0;
  const cachedInputTokens = meta.cachedContentTokenCount || 0;
  const outputTokens = meta.candidatesTokenCount || 0;
  const totalTokens = meta.totalTokenCount || (inputTokens + outputTokens);

  return {
    inputTokens: Math.max(0, Number(inputTokens) || 0),
    cachedInputTokens: Math.max(0, Number(cachedInputTokens) || 0),
    outputTokens: Math.max(0, Number(outputTokens) || 0),
    totalTokens: Math.max(0, Number(totalTokens) || 0),
    providerRequestId: null,
    resolvedModel: null
  };
}

/**
 * Enqueues AI usage logging via Next.js serverless after() lifecycle
 * or bounded timeout to ensure zero client latency without premature process death.
 */
export async function enqueueAiTelemetry(params = {}) {
  try {
    const nextServer = await import('next/server');
    if (typeof nextServer.after === 'function') {
      nextServer.after(async () => {
        await logAiUsageWithTimeout(params, 3000);
      });
      return;
    }
  } catch (_) {
    // next/server is unavailable in pure Node tests or non-request scopes
  }

  logAiUsageWithTimeout(params, 3000).catch(err => {
    console.warn('[AI Telemetry] Enqueue write warning:', err.message);
  });
}


async function logAiUsageWithTimeout(params, timeoutMs = 3000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    await logAiUsage({ ...params, abortSignal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Logs a single AI generation event to public.ai_usage_logs in Supabase.
 * Strictly non-blocking and privacy-safe: NEVER stores prompts, customer text, or PII.
 */
export async function logAiUsage(params = {}) {
  try {
    const {
      journeyId,
      deliveryId = null,
      operationType,
      provider,
      exactModel = 'unspecified',
      inputTokens = 0,
      cachedInputTokens = 0,
      outputTokens = 0,
      inputImageCount = 0,
      outputImageCount = 0,
      imageResolution = null,
      imageQuality = null,
      attemptNumber = 1,
      providerSuccess = true,
      outputAccepted = true,
      retryReason = null,
      fallbackUsed = false,
      errorCode = null,
      latencyMs = 0,
      providerRequestId = null,
      pricingMode = 'standard',
      metadata = {},
      abortSignal = null
    } = params;

    const resolvedProviderSuccess = params.providerSuccess !== undefined
      ? Boolean(params.providerSuccess)
      : (params.success !== undefined ? Boolean(params.success) : true);

    const resolvedOutputAccepted = params.outputAccepted !== undefined
      ? Boolean(params.outputAccepted)
      : (params.providerSuccess !== undefined ? Boolean(params.providerSuccess) : resolvedProviderSuccess);

    const cleanJourneyId = sanitizeJourneyId(journeyId);
    if (!cleanJourneyId) {
      return;
    }

    const costBreakdown = calculateCost({
      model: exactModel,
      inputTokens,
      cachedInputTokens,
      outputTokens,
      outputImageCount: resolvedProviderSuccess ? outputImageCount : 0
    });

    // Privacy-safe metadata sanitizer: STRICT WHITELIST ONLY
    const safeMetadata = {};
    if (metadata && typeof metadata === 'object' && !Array.isArray(metadata)) {
      if (metadata.language) safeMetadata.language = String(metadata.language).slice(0, 10);
      if (typeof metadata.coverageScore === 'number') safeMetadata.coverageScore = Number(metadata.coverageScore.toFixed(4));
      if (typeof metadata.backgroundRatio === 'number') safeMetadata.backgroundRatio = Number(metadata.backgroundRatio.toFixed(4));
      if (metadata.phase) safeMetadata.phase = String(metadata.phase).slice(0, 30);
      if (typeof metadata.refCount === 'number') safeMetadata.refCount = metadata.refCount;
      if (metadata.styleName) safeMetadata.styleName = String(metadata.styleName).slice(0, 40);
      if (metadata.sourceType) safeMetadata.sourceType = String(metadata.sourceType).slice(0, 40);
      if (metadata.hasReferenceImage !== undefined) safeMetadata.hasReferenceImage = Boolean(metadata.hasReferenceImage);
      // Mark internal quality gate retries so they do not count against customer generation credits
      if (metadata.internalQualityGate !== undefined) safeMetadata.internalQualityGate = Boolean(metadata.internalQualityGate);
    }

    const client = await getTelemetryClient();
    if (!client) {
      return;
    }

    const totalTokens = (Number(inputTokens) || 0) + (Number(outputTokens) || 0);

    const insertPromise = client.from('ai_usage_logs').insert([{
      journey_id: cleanJourneyId,
      delivery_id: deliveryId || null,
      operation_type: String(operationType).slice(0, 64),
      provider: String(provider).slice(0, 32),
      exact_model: String(exactModel).slice(0, 128),
      input_tokens: Math.max(0, Number(inputTokens) || 0),
      cached_input_tokens: Math.max(0, Number(cachedInputTokens) || 0),
      output_tokens: Math.max(0, Number(outputTokens) || 0),
      total_tokens: totalTokens,
      input_image_count: Math.max(0, Number(inputImageCount) || 0),
      output_image_count: Math.max(0, Number(outputImageCount) || 0),
      image_resolution: imageResolution ? String(imageResolution).slice(0, 32) : null,
      image_quality: imageQuality ? String(imageQuality).slice(0, 32) : null,
      attempt_number: Math.max(1, Number(attemptNumber) || 1),
      provider_success: Boolean(resolvedProviderSuccess),
      output_accepted: Boolean(resolvedOutputAccepted),
      retry_reason: retryReason ? String(retryReason).slice(0, 255) : null,
      fallback_used: Boolean(fallbackUsed),
      error_code: errorCode ? String(errorCode).slice(0, 128) : null,
      latency_ms: latencyMs ? Math.max(0, Math.round(Number(latencyMs))) : null,
      provider_request_id: providerRequestId ? String(providerRequestId).slice(0, 128) : null,
      pricing_mode: String(pricingMode).slice(0, 32),
      pricing_source: costBreakdown.pricingSource,
      pricing_version: costBreakdown.pricingVersion,
      pricing_status: costBreakdown.pricingStatus,
      cost_confidence: costBreakdown.costConfidence,
      unit_price_input_per_m: costBreakdown.unitPriceInputPerM,
      unit_price_cached_input_per_m: costBreakdown.unitPriceCachedInputPerM,
      unit_price_output_per_m: costBreakdown.unitPriceOutputPerM,
      unit_price_per_image: costBreakdown.unitPricePerImage,
      estimated_cost_usd: costBreakdown.estimatedCostUsd, // Nullable!
      metadata: safeMetadata
    }]);

    const activeSignal = abortSignal || (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(3000) : null);

    if (activeSignal) {
      await Promise.race([
        insertPromise,
        new Promise((_, reject) => {
          activeSignal.addEventListener('abort', () => reject(new Error('AI telemetry insert timed out')), { once: true });
        })
      ]);
    } else {
      await insertPromise;
    }
  } catch (err) {
    // Non-blocking telemetry guarantee: do not fail customer request
    console.warn('[AI Telemetry] Non-critical usage logging error:', err.message);
  }
}

/**
 * Links all prior unlinked AI usage logs of a journey to a delivery record upon checkout/save,
 * and sets the dedicated journey_id column on public.entregas.
 */
export async function linkJourneyToDelivery(journeyId, deliveryId) {
  const cleanJourneyId = sanitizeJourneyId(journeyId);
  if (!cleanJourneyId || !deliveryId) return;

  try {
    const client = await getTelemetryClient();
    if (!client) return;

    // 1. Link historical ai_usage_logs
    await client
      .from('ai_usage_logs')
      .update({ delivery_id: deliveryId })
      .eq('journey_id', cleanJourneyId)
      .is('delivery_id', null);

    // 2. Set dedicated journey_id column on entregas if not yet populated
    await client
      .from('entregas')
      .update({ journey_id: cleanJourneyId })
      .eq('id', deliveryId)
      .is('journey_id', null);
  } catch (err) {
    console.warn('[AI Telemetry] Non-critical journey linking error:', err.message);
  }
}

