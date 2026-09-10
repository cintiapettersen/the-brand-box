export const AI_PRICING_VERSION = '2026-09-01';

/**
 * Authoritative Rate Cards for Verified Models (Point-in-Time 2026-09-01)
 * Standard Commercial Tier
 */
export const AI_RATE_CARD = {
  'gemini-2.5-flash': {
    provider: 'google',
    inputPerM: 0.30,
    cachedInputPerM: 0.030, // Official Google Standard context caching ($0.03/M)
    outputPerM: 2.50,
    perImage: 0.00,
    pricingSource: 'google_ai_studio_standard_2026_09'
  },
  'gemini-2.5-flash-image': {
    provider: 'google',
    inputPerM: 0.30,
    cachedInputPerM: 0.030,
    outputPerM: 0.00,
    perImage: 0.039, // Official Google Standard image output up to 1024x1024
    pricingSource: 'google_ai_studio_standard_2026_09'
  },
  'gpt-4o-mini': {
    provider: 'openai',
    inputPerM: 0.15,
    cachedInputPerM: 0.075,
    outputPerM: 0.60,
    perImage: 0.00,
    pricingSource: 'openai_standard_tier_2026_09'
  },
  'gpt-4o': {
    provider: 'openai',
    inputPerM: 2.50,
    cachedInputPerM: 1.25,
    outputPerM: 10.00,
    perImage: 0.00,
    pricingSource: 'openai_standard_tier_2026_09'
  }
};

/**
 * Explicit registry of known experimental / preview models whose commercial
 * production pricing is unverified. These must NOT be assumed or substituted.
 */
export const UNVERIFIED_MODELS = new Set([
  'gemini-3.1-flash-image-preview',
  'imagen-4.0-generate-001'
]);

/**
 * Resolves model to rate card with strict unknown model safeguards.
 * Never falls back to another model's price.
 */
export function resolveRateCard(modelName = '') {
  if (!modelName || typeof modelName !== 'string') {
    return {
      matchedModel: 'unspecified',
      rates: null,
      pricingStatus: 'unknown',
      costConfidence: 'none'
    };
  }

  const clean = modelName.trim().toLowerCase();

  // 1. Explicitly check unverified/preview models first
  if (UNVERIFIED_MODELS.has(clean)) {
    return {
      matchedModel: clean,
      rates: null,
      pricingStatus: 'unknown',
      costConfidence: 'none'
    };
  }

  // 2. Exact match in verified rate card
  if (AI_RATE_CARD[clean]) {
    return {
      matchedModel: clean,
      rates: AI_RATE_CARD[clean],
      pricingStatus: 'exact',
      costConfidence: 'exact'
    };
  }

  // 3. Strict prefix matches for verified versioned snapshots (e.g. gpt-4o-mini-2024-07-18)
  if (clean.startsWith('gpt-4o-mini-') || clean.startsWith('gpt-4o-mini')) {
    return {
      matchedModel: clean,
      rates: AI_RATE_CARD['gpt-4o-mini'],
      pricingStatus: 'exact',
      costConfidence: 'exact'
    };
  }
  if ((clean.startsWith('gpt-4o-') || clean.startsWith('gpt-4o')) && !clean.includes('mini')) {
    return {
      matchedModel: clean,
      rates: AI_RATE_CARD['gpt-4o'],
      pricingStatus: 'exact',
      costConfidence: 'exact'
    };
  }
  if (clean.startsWith('gemini-2.5-flash-image')) {
    return {
      matchedModel: clean,
      rates: AI_RATE_CARD['gemini-2.5-flash-image'],
      pricingStatus: 'exact',
      costConfidence: 'exact'
    };
  }
  if (clean.startsWith('gemini-2.5-flash')) {
    return {
      matchedModel: clean,
      rates: AI_RATE_CARD['gemini-2.5-flash'],
      pricingStatus: 'exact',
      costConfidence: 'exact'
    };
  }

  // 4. Unknown model: strictly return null rates. NEVER fallback to another model.
  return {
    matchedModel: clean,
    rates: null,
    pricingStatus: 'unknown',
    costConfidence: 'none'
  };
}

/**
 * Calculates estimated USD cost for an AI operation.
 * Returns null if model is unknown or unverified.
 * Returns a number (e.g. 0.000000) only when cost is proven.
 */
export function calculateCost({
  model = '',
  inputTokens = 0,
  cachedInputTokens = 0,
  outputTokens = 0,
  outputImageCount = 0
} = {}) {
  const { matchedModel, rates, pricingStatus, costConfidence } = resolveRateCard(model);

  if (!rates) {
    return {
      matchedModel,
      rates: null,
      pricingStatus,
      costConfidence,
      pricingVersion: AI_PRICING_VERSION,
      pricingSource: 'unverified_or_unknown_registry',
      unitPriceInputPerM: null,
      unitPriceCachedInputPerM: null,
      unitPriceOutputPerM: null,
      unitPricePerImage: null,
      estimatedCostUsd: null // Nullable cost
    };
  }

  const safeInput = Math.max(0, Number(inputTokens) || 0);
  const safeCached = Math.min(safeInput, Math.max(0, Number(cachedInputTokens) || 0));
  const safeUncachedInput = Math.max(0, safeInput - safeCached);
  const safeOutput = Math.max(0, Number(outputTokens) || 0);
  const safeImages = Math.max(0, Number(outputImageCount) || 0);

  const inputCost = (safeUncachedInput / 1_000_000) * rates.inputPerM;
  const cachedCost = (safeCached / 1_000_000) * rates.cachedInputPerM;
  const outputCost = (safeOutput / 1_000_000) * rates.outputPerM;
  const imageCost = safeImages * rates.perImage;

  const totalCost = inputCost + cachedCost + outputCost + imageCost;

  return {
    matchedModel,
    rates,
    pricingStatus,
    costConfidence,
    pricingVersion: AI_PRICING_VERSION,
    pricingSource: rates.pricingSource,
    unitPriceInputPerM: rates.inputPerM,
    unitPriceCachedInputPerM: rates.cachedInputPerM,
    unitPriceOutputPerM: rates.outputPerM,
    unitPricePerImage: rates.perImage,
    estimatedCostUsd: Number(totalCost.toFixed(6))
  };
}

