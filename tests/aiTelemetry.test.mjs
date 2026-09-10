import assert from 'node:assert/strict';
import { extractOpenAIUsage, extractGoogleUsage, logAiUsage, sanitizeJourneyId } from '../src/lib/aiTelemetry.js';

console.log('Testing aiTelemetry.js helpers & resilience (V3)...');

// 1. Journey ID sanitization
const validUuid = 'c111dc41-a1e3-4b0f-a13f-84dc64ae00a5';
assert.equal(sanitizeJourneyId(validUuid), validUuid);

const validPrefix = 'journey-1725920000000-abcd1234';
assert.equal(sanitizeJourneyId(validPrefix), validPrefix);

const validDelivery = 'delivery-e9fb3f28-76c0-4c95-b4aa-a850cc6083f8';
assert.equal(sanitizeJourneyId(validDelivery), validDelivery);

const validAtelier = 'atelier-1725920000000';
assert.equal(sanitizeJourneyId(validAtelier), validAtelier);

assert.equal(sanitizeJourneyId(null), null);
assert.equal(sanitizeJourneyId(undefined), null);
assert.equal(sanitizeJourneyId(''), null);
assert.equal(sanitizeJourneyId("'; DROP TABLE ai_usage_logs; --"), null);
assert.equal(sanitizeJourneyId('a'.repeat(100)), null);
assert.equal(sanitizeJourneyId('user@example.com'), null);

// 2. OpenAI Responses API (/v1/responses) usage extraction
const fakeResponsesApiPayload = {
  id: 'resp_abc123',
  model: 'gpt-4o-mini-2024-07-18',
  usage: {
    input_tokens: 650,
    output_tokens: 180,
    total_tokens: 830,
    input_token_details: {
      cached_tokens: 128
    },
    output_token_details: {
      reasoning_tokens: 32
    }
  }
};
const responsesApiUsage = extractOpenAIUsage(fakeResponsesApiPayload);
assert.equal(responsesApiUsage.inputTokens, 650);
assert.equal(responsesApiUsage.cachedInputTokens, 128);
assert.equal(responsesApiUsage.outputTokens, 180);
assert.equal(responsesApiUsage.totalTokens, 830);
assert.equal(responsesApiUsage.reasoningTokens, 32);
assert.equal(responsesApiUsage.providerRequestId, 'resp_abc123');
assert.equal(responsesApiUsage.resolvedModel, 'gpt-4o-mini-2024-07-18');

// 3. OpenAI Chat Completions (/v1/chat/completions) fallback usage extraction
const fakeChatCompletions = {
  id: 'chatcmpl_xyz',
  model: 'gpt-4o-mini',
  usage: {
    prompt_tokens: 450,
    completion_tokens: 120,
    total_tokens: 570,
    prompt_tokens_details: {
      cached_tokens: 200
    }
  }
};
const chatUsage = extractOpenAIUsage(fakeChatCompletions);
assert.equal(chatUsage.inputTokens, 450);
assert.equal(chatUsage.cachedInputTokens, 200);
assert.equal(chatUsage.outputTokens, 120);
assert.equal(chatUsage.totalTokens, 570);

// 4. Google GenAI usage extraction
const fakeGoogle = {
  usageMetadata: {
    promptTokenCount: 800,
    candidatesTokenCount: 250,
    totalTokenCount: 1050,
    cachedContentTokenCount: 100
  }
};
const googleUsage = extractGoogleUsage(fakeGoogle);
assert.equal(googleUsage.inputTokens, 800);
assert.equal(googleUsage.cachedInputTokens, 100);
assert.equal(googleUsage.outputTokens, 250);
assert.equal(googleUsage.totalTokens, 1050);

// 5. Non-blocking resilience: should not throw even if client is missing or fails
await assert.doesNotReject(async () => {
  await logAiUsage({
    journeyId: validUuid,
    operationType: 'test',
    provider: 'openai',
    exactModel: 'gpt-4o-mini',
    inputTokens: 100,
    outputTokens: 50,
    abortSignal: AbortSignal.timeout(50)
  });
});

console.log('✅ aiTelemetry.js tests passed successfully!');

