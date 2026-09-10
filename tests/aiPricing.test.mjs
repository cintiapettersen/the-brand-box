import assert from 'node:assert/strict';
import { calculateCost, resolveRateCard, AI_PRICING_VERSION, UNVERIFIED_MODELS } from '../src/lib/aiPricing.js';

console.log('Testing aiPricing.js (V3 official rates & unknown policy)...');

// 1. Version test
assert.equal(AI_PRICING_VERSION, '2026-09-01');

// 2. Resolver test for verified models
assert.equal(resolveRateCard('gemini-2.5-flash').matchedModel, 'gemini-2.5-flash');
assert.equal(resolveRateCard('gemini-2.5-flash').pricingStatus, 'exact');
assert.equal(resolveRateCard('gpt-4o-mini-2024-07-18').matchedModel, 'gpt-4o-mini-2024-07-18');
assert.equal(resolveRateCard('gpt-4o-mini-2024-07-18').pricingStatus, 'exact');
assert.equal(resolveRateCard('gpt-4o-2024-08-06').matchedModel, 'gpt-4o-2024-08-06');
assert.equal(resolveRateCard('gpt-4o-2024-08-06').pricingStatus, 'exact');

// 3. Unverified preview models must be 'unknown' and cost null
assert.equal(resolveRateCard('gemini-3.1-flash-image-preview').pricingStatus, 'unknown');
assert.equal(resolveRateCard('gemini-3.1-flash-image-preview').rates, null);
const unverifiedGemini31 = calculateCost({
  model: 'gemini-3.1-flash-image-preview',
  inputTokens: 1000,
  outputImageCount: 1
});
assert.equal(unverifiedGemini31.estimatedCostUsd, null);
assert.equal(unverifiedGemini31.pricingStatus, 'unknown');
assert.equal(unverifiedGemini31.costConfidence, 'none');

assert.equal(resolveRateCard('imagen-4.0-generate-001').pricingStatus, 'unknown');
assert.equal(resolveRateCard('imagen-4.0-generate-001').rates, null);
const unverifiedImagen = calculateCost({
  model: 'imagen-4.0-generate-001',
  outputImageCount: 1
});
assert.equal(unverifiedImagen.estimatedCostUsd, null);
assert.equal(unverifiedImagen.pricingStatus, 'unknown');

// 4. Unknown models must NEVER fallback to gpt-4o-mini or another price
const unknownModelRes = calculateCost({
  model: 'unknown-mystery-llm-v1',
  inputTokens: 5000,
  outputTokens: 1000
});
assert.equal(unknownModelRes.estimatedCostUsd, null);
assert.equal(unknownModelRes.pricingStatus, 'unknown');
assert.equal(unknownModelRes.matchedModel, 'unknown-mystery-llm-v1');

// 5. Gemini 2.5 Flash token cost calculation:
// Input: $0.30 / 1M ($0.0000003/tok)
// Output: $2.50 / 1M ($0.0000025/tok)
// 10,000 input at $0.30/1M = $0.003
// 2,000 output at $2.50/1M = $0.005
// Total = $0.008000
const geminiRes = calculateCost({
  model: 'gemini-2.5-flash',
  inputTokens: 10000,
  cachedInputTokens: 0,
  outputTokens: 2000
});
assert.equal(geminiRes.estimatedCostUsd, 0.008);

// 6. Gemini 2.5 Flash Context Caching ($0.030 / 1M):
// 10,000 total input where 5,000 are cached:
// 5,000 uncached at $0.30/1M = $0.0015
// 5,000 cached at $0.030/1M = $0.00015
// 2,000 output at $2.50/1M = $0.005
// Total = 0.0015 + 0.00015 + 0.005 = 0.006650
const cachedRes = calculateCost({
  model: 'gemini-2.5-flash',
  inputTokens: 10000,
  cachedInputTokens: 5000,
  outputTokens: 2000
});
assert.equal(cachedRes.estimatedCostUsd, 0.00665);

// 7. Gemini 2.5 Flash Image ($0.30/M input, $0.039 per image):
// 1,000 input tokens at $0.30/M = $0.0003
// 2 images at $0.039 = $0.078
// Total = 0.0003 + 0.078 = 0.078300
const imageRes = calculateCost({
  model: 'gemini-2.5-flash-image',
  inputTokens: 1000,
  outputTokens: 0,
  outputImageCount: 2
});
assert.equal(imageRes.estimatedCostUsd, 0.0783);

console.log('✅ aiPricing.js tests passed successfully!');

